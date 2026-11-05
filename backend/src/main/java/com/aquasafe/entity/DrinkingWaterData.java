package com.aquasafe.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "drinking_water_data", indexes = {
    @Index(name = "idx_water_district", columnList = "district")
})
public class DrinkingWaterData {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String district;

    @Column(nullable = false, length = 100)
    private String state = "Tamil Nadu";

    @Column(name = "clean_water_coverage", nullable = false)
    private Double cleanWaterCoverage;

    @Column(name = "household_tap_coverage")
    private Double householdTapCoverage;

    @Column(name = "drinking_water_access")
    private Double drinkingWaterAccess;

    @Column(name = "reference_year", length = 50)
    private String referenceYear = "2023-2024 (Jal Jeevan Mission)";

    @Column(name = "source_name", length = 150)
    private String sourceName = "Jal Jeevan Mission (Har Ghar Jal)";

    @Column(name = "source_url", length = 500)
    private String sourceUrl = "https://ejalshakti.gov.in/";

    @Column(name = "data_status", length = 20)
    private String dataStatus = "OFFICIAL";

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    public DrinkingWaterData() {}

    public DrinkingWaterData(String district, Double cleanWaterCoverage, Double householdTapCoverage, Double drinkingWaterAccess, String referenceYear) {
        this.district = district;
        this.cleanWaterCoverage = cleanWaterCoverage;
        this.householdTapCoverage = householdTapCoverage;
        this.drinkingWaterAccess = drinkingWaterAccess;
        this.referenceYear = referenceYear;
        this.dataStatus = "OFFICIAL";
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getDistrict() { return district; }
    public void setDistrict(String district) { this.district = district; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public Double getCleanWaterCoverage() { return cleanWaterCoverage; }
    public void setCleanWaterCoverage(Double cleanWaterCoverage) { this.cleanWaterCoverage = cleanWaterCoverage; }

    public Double getHouseholdTapCoverage() { return householdTapCoverage; }
    public void setHouseholdTapCoverage(Double householdTapCoverage) { this.householdTapCoverage = householdTapCoverage; }

    public Double getDrinkingWaterAccess() { return drinkingWaterAccess; }
    public void setDrinkingWaterAccess(Double drinkingWaterAccess) { this.drinkingWaterAccess = drinkingWaterAccess; }

    public String getReferenceYear() { return referenceYear; }
    public void setReferenceYear(String referenceYear) { this.referenceYear = referenceYear; }

    public String getSourceName() { return sourceName; }
    public void setSourceName(String sourceName) { this.sourceName = sourceName; }

    public String getSourceUrl() { return sourceUrl; }
    public void setSourceUrl(String sourceUrl) { this.sourceUrl = sourceUrl; }

    public String getDataStatus() { return dataStatus; }
    public void setDataStatus(String dataStatus) { this.dataStatus = dataStatus; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}

