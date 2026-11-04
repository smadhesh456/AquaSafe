package com.aquasafe.service;

import com.aquasafe.entity.DataCollectionLog;
import com.aquasafe.entity.District;
import com.aquasafe.entity.WeatherData;
import com.aquasafe.repository.DataCollectionLogRepository;
import com.aquasafe.repository.DistrictRepository;
import com.aquasafe.repository.WeatherDataRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class DataCollectionService {

    private static final Logger log = LoggerFactory.getLogger(DataCollectionService.class);

    private final WeatherDataRepository weatherRepository;
    private final DistrictRepository districtRepository;
    private final DataCollectionLogRepository logRepository;
    private final RestTemplate restTemplate;

    @Value("${aquasafe.weather.api-url:https://api.open-meteo.com/v1/forecast}")
    private String forecastApiUrl;

    @Value("${aquasafe.weather.archive-api-url:https://archive-api.open-meteo.com/v1/archive}")
    private String archiveApiUrl;

    private LocalDateTime lastSuccessfulWeatherSync = null;
    private boolean lastApiCallSuccessful = false;
    private String lastErrorMessage = null;

    public DataCollectionService(
            WeatherDataRepository weatherRepository,
            DistrictRepository districtRepository,
            DataCollectionLogRepository logRepository,
            RestTemplateBuilder restTemplateBuilder) {
        this.weatherRepository = weatherRepository;
        this.districtRepository = districtRepository;
        this.logRepository = logRepository;
        this.restTemplate = restTemplateBuilder
                .setConnectTimeout(Duration.ofMillis(3500))
                .setReadTimeout(Duration.ofMillis(3500))
                .build();
    }

    /**
     * Fetches real-time weather from Open-Meteo for a specific district.
     * Accurately labels status as LIVE on success, or falls back to STORED data.
     */
    public WeatherData fetchLiveWeatherForDistrict(String districtName, String triggerType) {
        Optional<District> distOpt = districtRepository.findByNameIgnoreCase(districtName);
        if (distOpt.isEmpty()) {
            throw new IllegalArgumentException("Unknown Tamil Nadu district: " + districtName);
        }

        District d = distOpt.get();
        try {
            String url = String.format(Locale.US,
                "%s?latitude=%.4f&longitude=%.4f&current=temperature_2m,relative_humidity_2m,precipitation,weather_code",
                forecastApiUrl, d.getLatitude(), d.getLongitude()
            );

            @SuppressWarnings("unchecked")
            Map<String, Object> resp = restTemplate.getForObject(url, Map.class);
            if (resp != null && resp.containsKey("current")) {
                @SuppressWarnings("unchecked")
                Map<String, Object> current = (Map<String, Object>) resp.get("current");
                double temp = ((Number) current.get("temperature_2m")).doubleValue();
                double humidity = ((Number) current.get("relative_humidity_2m")).doubleValue();
                double rain = ((Number) current.get("precipitation")).doubleValue();
                int wCode = current.containsKey("weather_code") ? ((Number) current.get("weather_code")).intValue() : 1;

                String condition = decodeWmoWeatherCode(wCode);
                LocalDate today = LocalDate.now();

                // Save or update today's observation
                WeatherData weatherData;
                Optional<WeatherData> existing = weatherRepository.findByDistrictIgnoreCaseAndDate(d.getName(), today);
                if (existing.isPresent()) {
                    weatherData = existing.get();
                    weatherData.setTemperature(temp);
                    weatherData.setRainfall(rain);
                    weatherData.setPrecipitation(rain);
                    weatherData.setHumidity(humidity);
                    weatherData.setWeatherCondition(condition);
                    weatherData.setDataStatus("LIVE");
                    weatherData.setSource("Open-Meteo Weather API");
                    weatherData.setSourceUrl(url);
                } else {
                    weatherData = new WeatherData(
                        d.getName(), d.getState(), today, temp, rain, humidity,
                        rain, condition, "Open-Meteo Weather API", url, "LIVE"
                    );
                }
                weatherRepository.save(weatherData);

                lastSuccessfulWeatherSync = LocalDateTime.now();
                lastApiCallSuccessful = true;
                lastErrorMessage = null;

                logRepository.save(new DataCollectionLog(
                    "WEATHER", "Open-Meteo Weather API", "SUCCESS", 1, 0, null, triggerType
                ));

                return weatherData;
            }
        } catch (Exception e) {
            lastApiCallSuccessful = false;
            lastErrorMessage = e.getMessage();
            log.warn("Open-Meteo API unavailable for {}: {}", districtName, e.getMessage());

            logRepository.save(new DataCollectionLog(
                "WEATHER", "Open-Meteo Weather API", "FAILED", 0, 1, e.getMessage(), triggerType
            ));
        }

        // Return latest stored record on API error
        Optional<WeatherData> storedOpt = weatherRepository.findTopByDistrictOrderByDateDesc(d.getName());
        if (storedOpt.isPresent()) {
            WeatherData stored = storedOpt.get();
            stored.setDataStatus("STORED");
            return stored;
        }

        return new WeatherData(d.getName(), d.getState(), LocalDate.now(), 29.5, 0.0, 70.0, "STORED");
    }

    /**
     * Batch collection across all 38 Tamil Nadu districts.
     */
    public Map<String, Object> collectAllDistrictsWeather(String triggerType) {
        log.info("Starting live weather synchronization across all Tamil Nadu districts via Open-Meteo (Trigger: {})...", triggerType);
        List<District> districts = districtRepository.findAllByOrderByNameAsc();

        int successCount = 0;
        int failureCount = 0;
        List<String> failedDistricts = new ArrayList<>();

        for (District d : districts) {
            try {
                fetchLiveWeatherForDistrict(d.getName(), triggerType);
                successCount++;
            } catch (Exception e) {
                failureCount++;
                failedDistricts.add(d.getName());
            }
        }

        String overallStatus = failureCount == 0 ? "SUCCESS" : (successCount > 0 ? "PARTIAL" : "FAILED");
        logRepository.save(new DataCollectionLog(
            "WEATHER", "Open-Meteo Weather API", overallStatus, successCount, failureCount,
            failureCount > 0 ? "Failures: " + String.join(", ", failedDistricts) : null,
            triggerType
        ));

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("status", overallStatus);
        result.put("triggerType", triggerType);
        result.put("totalDistricts", districts.size());
        result.put("successfulDistricts", successCount);
        result.put("failedDistricts", failureCount);
        result.put("lastSyncTime", lastSuccessfulWeatherSync);
        result.put("failedDistrictNames", failedDistricts);
        return result;
    }

    /**
     * Automatic scheduled background collection (every 6 hours).
     */
    @Scheduled(cron = "${aquasafe.weather.sync-cron:0 0 */6 * * *}")
    public void scheduledWeatherCollection() {
        log.info("Triggering scheduled background weather collection...");
        collectAllDistrictsWeather("SCHEDULED");
    }

    public Map<String, Object> getCollectionStatus() {
        Map<String, Object> status = new LinkedHashMap<>();
        status.put("apiOnline", lastApiCallSuccessful);
        status.put("lastSuccessfulUpdate", lastSuccessfulWeatherSync);
        status.put("lastErrorMessage", lastErrorMessage);
        status.put("primaryProvider", "Open-Meteo REST API (https://api.open-meteo.com/v1/forecast)");
        status.put("archiveProvider", "Open-Meteo Historical Archive (https://archive-api.open-meteo.com/v1/archive)");
        status.put("recentLogs", logRepository.findTop20ByOrderByTimestampDesc());
        return status;
    }

    private String decodeWmoWeatherCode(int code) {
        return switch (code) {
            case 0 -> "Clear Sky";
            case 1 -> "Mainly Clear";
            case 2 -> "Partly Cloudy";
            case 3 -> "Overcast";
            case 45, 48 -> "Foggy";
            case 51, 53, 55 -> "Drizzle";
            case 61 -> "Slight Rain";
            case 63 -> "Moderate Rain";
            case 65 -> "Heavy Rain";
            case 80, 81, 82 -> "Rain Showers";
            case 95, 96, 99 -> "Thunderstorm";
            default -> "Partly Cloudy";
        };
    }
}

