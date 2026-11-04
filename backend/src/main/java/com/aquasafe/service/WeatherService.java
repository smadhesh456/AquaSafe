package com.aquasafe.service;

import com.aquasafe.entity.District;
import com.aquasafe.entity.WeatherData;
import com.aquasafe.repository.DistrictRepository;
import com.aquasafe.repository.WeatherDataRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class WeatherService {

    private final WeatherDataRepository weatherRepository;
    private final DistrictRepository districtRepository;
    private final DataCollectionService dataCollectionService;

    public WeatherService(
            WeatherDataRepository weatherRepository,
            DistrictRepository districtRepository,
            DataCollectionService dataCollectionService) {
        this.weatherRepository = weatherRepository;
        this.districtRepository = districtRepository;
        this.dataCollectionService = dataCollectionService;
    }

    public WeatherData getLatestWeather(String district) {
        return dataCollectionService.fetchLiveWeatherForDistrict(district, "USER_REQUEST");
    }

    public List<WeatherData> getAllLatestDistrictsWeather() {
        List<District> districts = districtRepository.findAllByOrderByNameAsc();
        List<WeatherData> result = new ArrayList<>();
        for (District d : districts) {
            Optional<WeatherData> opt = weatherRepository.findTopByDistrictOrderByDateDesc(d.getName());
            if (opt.isPresent()) {
                result.add(opt.get());
            } else {
                result.add(dataCollectionService.fetchLiveWeatherForDistrict(d.getName(), "ALL_DISTRICTS_QUERY"));
            }
        }
        return result;
    }

    public Page<WeatherData> getHistoricalWeather(String district, int page, int size) {
        if (district != null && !district.trim().isEmpty()) {
            return weatherRepository.findByDistrictContainingIgnoreCase(district, PageRequest.of(page, size));
        }
        return weatherRepository.findAll(PageRequest.of(page, size));
    }

    public List<Object[]> getDistrictAverages() {
        return weatherRepository.getDistrictAverages();
    }

    public Map<String, Object> syncAllDistrictsLive() {
        return dataCollectionService.collectAllDistrictsWeather("USER_MANUAL_SYNC");
    }
}
