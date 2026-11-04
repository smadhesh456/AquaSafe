package com.aquasafe.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "preprocessing_logs", indexes = {
    @Index(name = "idx_prep_status", columnList = "status"),
    @Index(name = "idx_prep_timestamp", columnList = "timestamp")
})
public class PreprocessingLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "pipeline_name", nullable = false, length = 150)
    private String pipelineName;

    @Column(name = "records_input")
    private Integer recordsInput = 0;

    @Column(name = "records_cleaned")
    private Integer recordsCleaned = 0;

    @Column(name = "missing_imputed")
    private Integer missingImputed = 0;

    @Column(name = "duplicates_removed")
    private Integer duplicatesRemoved = 0;

    @Column(name = "invalid_filtered")
    private Integer invalidFiltered = 0;

    @Column(name = "outliers_detected")
    private Integer outliersDetected = 0;

    @Column(nullable = false, length = 30)
    private String status = "SUCCESS";

    @Lob
    @Column(name = "report_details", columnDefinition = "TEXT")
    private String reportDetails;

    @Column(nullable = false)
    private LocalDateTime timestamp = LocalDateTime.now();

    public PreprocessingLog() {}

    public PreprocessingLog(String pipelineName, Integer recordsInput, Integer recordsCleaned, Integer missingImputed, Integer duplicatesRemoved, Integer invalidFiltered, Integer outliersDetected, String status, String reportDetails) {
        this.pipelineName = pipelineName;
        this.recordsInput = recordsInput;
        this.recordsCleaned = recordsCleaned;
        this.missingImputed = missingImputed;
        this.duplicatesRemoved = duplicatesRemoved;
        this.invalidFiltered = invalidFiltered;
        this.outliersDetected = outliersDetected;
        this.status = status;
        this.reportDetails = reportDetails;
        this.timestamp = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getPipelineName() { return pipelineName; }
    public void setPipelineName(String pipelineName) { this.pipelineName = pipelineName; }

    public Integer getRecordsInput() { return recordsInput; }
    public void setRecordsInput(Integer recordsInput) { this.recordsInput = recordsInput; }

    public Integer getRecordsCleaned() { return recordsCleaned; }
    public void setRecordsCleaned(Integer recordsCleaned) { this.recordsCleaned = recordsCleaned; }

    public Integer getMissingImputed() { return missingImputed; }
    public void setMissingImputed(Integer missingImputed) { this.missingImputed = missingImputed; }

    public Integer getDuplicatesRemoved() { return duplicatesRemoved; }
    public void setDuplicatesRemoved(Integer duplicatesRemoved) { this.duplicatesRemoved = duplicatesRemoved; }

    public Integer getInvalidFiltered() { return invalidFiltered; }
    public void setInvalidFiltered(Integer invalidFiltered) { this.invalidFiltered = invalidFiltered; }

    public Integer getOutliersDetected() { return outliersDetected; }
    public void setOutliersDetected(Integer outliersDetected) { this.outliersDetected = outliersDetected; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getReportDetails() { return reportDetails; }
    public void setReportDetails(String reportDetails) { this.reportDetails = reportDetails; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}

