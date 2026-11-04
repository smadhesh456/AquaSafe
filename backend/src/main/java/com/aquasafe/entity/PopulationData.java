package com.aquasafe.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "population_data", indexes = {
    @Index(name = "idx_pop_district", columnList = "district")
})
public class PopulationData {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String district;

    @Column(nullable = false, length = 100)
    private String state = "Tamil Nadu";

    @Column(nullable = false)
    private Long population;

    @Column(name = "population_density", nullable = false)
    private Integer populationDensity;

    @Column(name = "sanitation_coverage", nullable = false)
    private Double sanitationCoverage;

    @Column(name = "clean_water_coverage")
    private Double cleanWaterCoverage = 92.0;

    @Column(name = "reference_year", length = 50)
    private String referenceYear = "Census 2011 / NFHS-5 2019-21";

    @Column(name = "source_name", length = 150)
    private String sourceName = "Census of India & NFHS-5";

    @Column(name = "data_status", length = 20)
    private String dataStatus = "STORED";

    @Column(nullable = false)
    private Double latitude;

    @Column(nullable = false)
    private Double longitude;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public PopulationData() {}

    public PopulationData(String district, String state, Long population, Integer populationDensity, Double sanitationCoverage, Double latitude, Double longitude) {
        this(district, state, population, populationDensity, sanitationCoverage, 92.0, "Census 2011 / NFHS-5 2019-21", "Census of India & NFHS-5", "STORED", latitude, longitude);
    }

    public PopulationData(String district, String state, Long population, Integer populationDensity, Double sanitationCoverage, Double cleanWaterCoverage, String referenceYear, String sourceName, String dataStatus, Double latitude, Double longitude) {
        this.district = district;
        this.state = state != null ? state : "Tamil Nadu";
        this.population = population;
        this.populationDensity = populationDensity;
        this.sanitationCoverage = sanitationCoverage;
        this.cleanWaterCoverage = cleanWaterCoverage != null ? cleanWaterCoverage : 90.0;
        this.referenceYear = referenceYear != null ? referenceYear : "Census 2011 / NFHS-5 2019-21";
        this.sourceName = sourceName != null ? sourceName : "Census of India & NFHS-5";
        this.dataStatus = dataStatus != null ? dataStatus : "STORED";
        this.latitude = latitude;
        this.longitude = longitude;
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getDistrict() { return district; }
    public void setDistrict(String district) { this.district = district; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public Long getPopulation() { return population; }
    public void setPopulation(Long population) { this.population = population; }

    public Integer getPopulationDensity() { return populationDensity; }
    public void setPopulationDensity(Integer populationDensity) { this.populationDensity = populationDensity; }

    public Double getSanitationCoverage() { return sanitationCoverage; }
    public void setSanitationCoverage(Double sanitationCoverage) { this.sanitationCoverage = sanitationCoverage; }

    public Double getCleanWaterCoverage() { return cleanWaterCoverage; }
    public void setCleanWaterCoverage(Double cleanWaterCoverage) { this.cleanWaterCoverage = cleanWaterCoverage; }

    public String getReferenceYear() { return referenceYear; }
    public void setReferenceYear(String referenceYear) { this.referenceYear = referenceYear; }

    public String getSourceName() { return sourceName; }
    public void setSourceName(String sourceName) { this.sourceName = sourceName; }

    public String getDataStatus() { return dataStatus; }
    public void setDataStatus(String dataStatus) { this.dataStatus = dataStatus; }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
