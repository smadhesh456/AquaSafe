package com.aquasafe.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "weather_data", indexes = {
    @Index(name = "idx_weather_district", columnList = "district"),
    @Index(name = "idx_weather_date", columnList = "date"),
    @Index(name = "idx_weather_district_date", columnList = "district, date"),
    @Index(name = "idx_weather_status", columnList = "data_status")
})
public class WeatherData {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String district;

    @Column(nullable = false, length = 100)
    private String state = "Tamil Nadu";

    @Column(nullable = false)
    private LocalDate date;

    @Column(nullable = false)
    private Double temperature;

    @Column(nullable = false)
    private Double rainfall;

    @Column(nullable = false)
    private Double humidity;

    @Column(name = "precipitation")
    private Double precipitation = 0.0;

    @Column(name = "weather_condition", length = 100)
    private String weatherCondition = "Partly Cloudy";

    @Column(length = 50)
    private String source = "Open-Meteo Weather API";

    @Column(name = "source_url", length = 500)
    private String sourceUrl = "https://api.open-meteo.com/v1/forecast";

    @Column(name = "data_status", length = 20)
    private String dataStatus = "STORED"; // LIVE, STORED, DEMO

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public WeatherData() {}

    public WeatherData(String district, String state, LocalDate date, Double temperature, Double rainfall, Double humidity, String source) {
        this(district, state, date, temperature, rainfall, humidity, rainfall, "Standard", source, "https://api.open-meteo.com/v1/forecast", source != null && source.contains("LIVE") ? "LIVE" : "STORED");
    }

    public WeatherData(String district, String state, LocalDate date, Double temperature, Double rainfall, Double humidity, Double precipitation, String weatherCondition, String source, String sourceUrl, String dataStatus) {
        this.district = district;
        this.state = state != null ? state : "Tamil Nadu";
        this.date = date;
        this.temperature = temperature;
        this.rainfall = rainfall;
        this.humidity = humidity;
        this.precipitation = precipitation != null ? precipitation : rainfall;
        this.weatherCondition = weatherCondition != null ? weatherCondition : "Partly Cloudy";
        this.source = source != null ? source : "Open-Meteo Weather API";
        this.sourceUrl = sourceUrl != null ? sourceUrl : "https://api.open-meteo.com/v1/forecast";
        this.dataStatus = dataStatus != null ? dataStatus : (source != null && source.contains("LIVE") ? "LIVE" : "STORED");
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getDistrict() { return district; }
    public void setDistrict(String district) { this.district = district; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public Double getTemperature() { return temperature; }
    public void setTemperature(Double temperature) { this.temperature = temperature; }

    public Double getRainfall() { return rainfall; }
    public void setRainfall(Double rainfall) { this.rainfall = rainfall; }

    public Double getHumidity() { return humidity; }
    public void setHumidity(Double humidity) { this.humidity = humidity; }

    public Double getPrecipitation() { return precipitation != null ? precipitation : rainfall; }
    public void setPrecipitation(Double precipitation) { this.precipitation = precipitation; }

    public String getWeatherCondition() { return weatherCondition; }
    public void setWeatherCondition(String weatherCondition) { this.weatherCondition = weatherCondition; }

    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }

    public String getSourceUrl() { return sourceUrl; }
    public void setSourceUrl(String sourceUrl) { this.sourceUrl = sourceUrl; }

    public String getDataStatus() { return dataStatus; }
    public void setDataStatus(String dataStatus) { this.dataStatus = dataStatus; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
