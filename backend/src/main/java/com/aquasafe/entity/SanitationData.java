package com.aquasafe.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "sanitation_data", indexes = {
    @Index(name = "idx_sanitation_district", columnList = "district")
})
public class SanitationData {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String district;

    @Column(nullable = false, length = 100)
    private String state = "Tamil Nadu";

    @Column(name = "sanitation_coverage", nullable = false)
    private Double sanitationCoverage; // % households with improved toilet facility (NFHS-5)

    @Column(name = "clean_water_coverage", nullable = false)
    private Double cleanWaterCoverage; // % households with improved drinking water source (NFHS-5 / JJM)

    @Column(name = "rural_sanitation")
    private Double ruralSanitation;

    @Column(name = "urban_sanitation")
    private Double urbanSanitation;

    @Column(name = "reference_year", length = 50)
    private String referenceYear = "2019-2021 (NFHS-5)";

    @Column(name = "source_name", length = 150)
    private String sourceName = "NFHS-5 & Jal Jeevan Mission";

    @Column(name = "data_status", length = 20)
    private String dataStatus = "STORED";

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public SanitationData() {}

    public SanitationData(String district, String state, Double sanitationCoverage, Double cleanWaterCoverage, Double ruralSanitation, Double urbanSanitation, String referenceYear, String sourceName, String dataStatus) {
        this.district = district;
        this.state = state != null ? state : "Tamil Nadu";
        this.sanitationCoverage = sanitationCoverage;
        this.cleanWaterCoverage = cleanWaterCoverage;
        this.ruralSanitation = ruralSanitation;
        this.urbanSanitation = urbanSanitation;
        this.referenceYear = referenceYear;
        this.sourceName = sourceName;
        this.dataStatus = dataStatus != null ? dataStatus : "STORED";
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getDistrict() { return district; }
    public void setDistrict(String district) { this.district = district; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public Double getSanitationCoverage() { return sanitationCoverage; }
    public void setSanitationCoverage(Double sanitationCoverage) { this.sanitationCoverage = sanitationCoverage; }

    public Double getCleanWaterCoverage() { return cleanWaterCoverage; }
    public void setCleanWaterCoverage(Double cleanWaterCoverage) { this.cleanWaterCoverage = cleanWaterCoverage; }

    public Double getRuralSanitation() { return ruralSanitation; }
    public void setRuralSanitation(Double ruralSanitation) { this.ruralSanitation = ruralSanitation; }

    public Double getUrbanSanitation() { return urbanSanitation; }
    public void setUrbanSanitation(Double urbanSanitation) { this.urbanSanitation = urbanSanitation; }

    public String getReferenceYear() { return referenceYear; }
    public void setReferenceYear(String referenceYear) { this.referenceYear = referenceYear; }

    public String getSourceName() { return sourceName; }
    public void setSourceName(String sourceName) { this.sourceName = sourceName; }

    public String getDataStatus() { return dataStatus; }
    public void setDataStatus(String dataStatus) { this.dataStatus = dataStatus; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}

