package com.aquasafe.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "water_quality", indexes = {
    @Index(name = "idx_wq_district", columnList = "district"),
    @Index(name = "idx_wq_date", columnList = "date"),
    @Index(name = "idx_wq_district_date", columnList = "district, date"),
    @Index(name = "idx_wq_status", columnList = "data_status")
})
public class WaterQuality {

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
    private Double ph;

    @Column(nullable = false)
    private Double turbidity;

    @Column(nullable = false)
    private Double tds;

    @Column(name = "dissolved_oxygen", nullable = false)
    private Double dissolvedOxygen;

    @Column(name = "water_temperature", nullable = false)
    private Double waterTemperature;

    @Column(name = "source_name", length = 150)
    private String sourceName = "CPCB & TNPCB Water Quality Monitoring Network";

    @Column(name = "source_url", length = 500)
    private String sourceUrl = "https://cpcb.nic.in/water-quality-data/";

    @Column(name = "data_status", length = 20)
    private String dataStatus = "STORED"; // LIVE, STORED, DEMO

    @Column(name = "station_name", length = 150)
    private String stationName;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public WaterQuality() {}

    public WaterQuality(String district, String state, LocalDate date, Double ph, Double turbidity, Double tds, Double dissolvedOxygen, Double waterTemperature) {
        this(district, state, date, ph, turbidity, tds, dissolvedOxygen, waterTemperature, "CPCB & TNPCB Water Quality Monitoring Network", "https://cpcb.nic.in/water-quality-data/", "STORED", null);
    }

    public WaterQuality(String district, String state, LocalDate date, Double ph, Double turbidity, Double tds, Double dissolvedOxygen, Double waterTemperature, String sourceName, String sourceUrl, String dataStatus, String stationName) {
        this.district = district;
        this.state = state != null ? state : "Tamil Nadu";
        this.date = date;
        this.ph = ph;
        this.turbidity = turbidity;
        this.tds = tds;
        this.dissolvedOxygen = dissolvedOxygen;
        this.waterTemperature = waterTemperature;
        this.sourceName = sourceName != null ? sourceName : "CPCB & TNPCB Water Quality Monitoring Network";
        this.sourceUrl = sourceUrl != null ? sourceUrl : "https://cpcb.nic.in/water-quality-data/";
        this.dataStatus = dataStatus != null ? dataStatus : "STORED";
        this.stationName = stationName;
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

    public Double getPh() { return ph; }
    public void setPh(Double ph) { this.ph = ph; }

    public Double getTurbidity() { return turbidity; }
    public void setTurbidity(Double turbidity) { this.turbidity = turbidity; }

    public Double getTds() { return tds; }
    public void setTds(Double tds) { this.tds = tds; }

    public Double getDissolvedOxygen() { return dissolvedOxygen; }
    public void setDissolvedOxygen(Double dissolvedOxygen) { this.dissolvedOxygen = dissolvedOxygen; }

    public Double getWaterTemperature() { return waterTemperature; }
    public void setWaterTemperature(Double waterTemperature) { this.waterTemperature = waterTemperature; }

    public String getSourceName() { return sourceName; }
    public void setSourceName(String sourceName) { this.sourceName = sourceName; }

    public String getSourceUrl() { return sourceUrl; }
    public void setSourceUrl(String sourceUrl) { this.sourceUrl = sourceUrl; }

    public String getDataStatus() { return dataStatus; }
    public void setDataStatus(String dataStatus) { this.dataStatus = dataStatus; }

    public String getStationName() { return stationName; }
    public void setStationName(String stationName) { this.stationName = stationName; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
