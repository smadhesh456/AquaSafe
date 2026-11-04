package com.aquasafe.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "data_sources", indexes = {
    @Index(name = "idx_source_category", columnList = "category"),
    @Index(name = "idx_source_status", columnList = "data_status")
})
public class DataSourceEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "source_name", nullable = false, length = 150)
    private String sourceName;

    @Column(name = "source_url", length = 500)
    private String sourceUrl;

    @Column(nullable = false, length = 50)
    private String category; // WATER_QUALITY, WEATHER, DISEASE, POPULATION, SANITATION

    @Column(name = "data_status", nullable = false, length = 20)
    private String dataStatus = "STORED"; // LIVE, STORED, DEMO

    @Column(name = "reference_year", length = 50)
    private String referenceYear;

    @Column(length = 1000)
    private String description;

    @Column(name = "last_checked")
    private LocalDateTime lastChecked = LocalDateTime.now();

    @Column(name = "record_count")
    private Long recordCount = 0L;

    public DataSourceEntity() {}

    public DataSourceEntity(String sourceName, String sourceUrl, String category, String dataStatus, String referenceYear, String description) {
        this.sourceName = sourceName;
        this.sourceUrl = sourceUrl;
        this.category = category;
        this.dataStatus = dataStatus;
        this.referenceYear = referenceYear;
        this.description = description;
        this.lastChecked = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getSourceName() { return sourceName; }
    public void setSourceName(String sourceName) { this.sourceName = sourceName; }

    public String getSourceUrl() { return sourceUrl; }
    public void setSourceUrl(String sourceUrl) { this.sourceUrl = sourceUrl; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getDataStatus() { return dataStatus; }
    public void setDataStatus(String dataStatus) { this.dataStatus = dataStatus; }

    public String getReferenceYear() { return referenceYear; }
    public void setReferenceYear(String referenceYear) { this.referenceYear = referenceYear; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public LocalDateTime getLastChecked() { return lastChecked; }
    public void setLastChecked(LocalDateTime lastChecked) { this.lastChecked = lastChecked; }

    public Long getRecordCount() { return recordCount; }
    public void setRecordCount(Long recordCount) { this.recordCount = recordCount; }
}

