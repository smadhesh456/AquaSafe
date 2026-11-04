package com.aquasafe.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "data_collection_logs", indexes = {
    @Index(name = "idx_coll_category", columnList = "category"),
    @Index(name = "idx_coll_status", columnList = "status"),
    @Index(name = "idx_coll_timestamp", columnList = "timestamp")
})
public class DataCollectionLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 50)
    private String category; // WEATHER, WATER_QUALITY, DISEASE, POPULATION

    @Column(name = "source_name", length = 150)
    private String sourceName;

    @Column(nullable = false, length = 30)
    private String status; // SUCCESS, FAILED, PARTIAL

    @Column(name = "records_collected")
    private Integer recordsCollected = 0;

    @Column(name = "missing_records")
    private Integer missingRecords = 0;

    @Column(name = "error_message", length = 1000)
    private String errorMessage;

    @Column(name = "trigger_type", length = 50)
    private String triggerType = "SCHEDULED"; // SCHEDULED, MANUAL, UPLOAD

    @Column(nullable = false)
    private LocalDateTime timestamp = LocalDateTime.now();

    public DataCollectionLog() {}

    public DataCollectionLog(String category, String sourceName, String status, Integer recordsCollected, Integer missingRecords, String errorMessage, String triggerType) {
        this.category = category;
        this.sourceName = sourceName;
        this.status = status;
        this.recordsCollected = recordsCollected != null ? recordsCollected : 0;
        this.missingRecords = missingRecords != null ? missingRecords : 0;
        this.errorMessage = errorMessage;
        this.triggerType = triggerType != null ? triggerType : "SCHEDULED";
        this.timestamp = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getSourceName() { return sourceName; }
    public void setSourceName(String sourceName) { this.sourceName = sourceName; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Integer getRecordsCollected() { return recordsCollected; }
    public void setRecordsCollected(Integer recordsCollected) { this.recordsCollected = recordsCollected; }

    public Integer getMissingRecords() { return missingRecords; }
    public void setMissingRecords(Integer missingRecords) { this.missingRecords = missingRecords; }

    public String getErrorMessage() { return errorMessage; }
    public void setErrorMessage(String errorMessage) { this.errorMessage = errorMessage; }

    public String getTriggerType() { return triggerType; }
    public void setTriggerType(String triggerType) { this.triggerType = triggerType; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}

