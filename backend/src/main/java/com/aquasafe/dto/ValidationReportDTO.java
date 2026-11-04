package com.aquasafe.dto;

import java.time.LocalDateTime;
import java.util.*;

public class ValidationReportDTO {

    private LocalDateTime timestamp = LocalDateTime.now();
    private String status = "PASSED"; // PASSED, WARNING, FAILED
    private int totalRecordsEvaluated;
    private int validRecords;
    private int invalidRecords;
    private int duplicateRecords;
    private int missingValuesImputed;
    private int outliersIdentified;
    private Map<String, Map<String, Integer>> categoryMetrics = new LinkedHashMap<>();
    private List<String> issuesFound = new ArrayList<>();
    private List<String> rulesApplied = new ArrayList<>();

    public ValidationReportDTO() {}

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public int getTotalRecordsEvaluated() { return totalRecordsEvaluated; }
    public void setTotalRecordsEvaluated(int totalRecordsEvaluated) { this.totalRecordsEvaluated = totalRecordsEvaluated; }

    public int getValidRecords() { return validRecords; }
    public void setValidRecords(int validRecords) { this.validRecords = validRecords; }

    public int getInvalidRecords() { return invalidRecords; }
    public void setInvalidRecords(int invalidRecords) { this.invalidRecords = invalidRecords; }

    public int getDuplicateRecords() { return duplicateRecords; }
    public void setDuplicateRecords(int duplicateRecords) { this.duplicateRecords = duplicateRecords; }

    public int getMissingValuesImputed() { return missingValuesImputed; }
    public void setMissingValuesImputed(int missingValuesImputed) { this.missingValuesImputed = missingValuesImputed; }

    public int getOutliersIdentified() { return outliersIdentified; }
    public void setOutliersIdentified(int outliersIdentified) { this.outliersIdentified = outliersIdentified; }

    public Map<String, Map<String, Integer>> getCategoryMetrics() { return categoryMetrics; }
    public void setCategoryMetrics(Map<String, Map<String, Integer>> categoryMetrics) { this.categoryMetrics = categoryMetrics; }

    public List<String> getIssuesFound() { return issuesFound; }
    public void setIssuesFound(List<String> issuesFound) { this.issuesFound = issuesFound; }

    public List<String> getRulesApplied() { return rulesApplied; }
    public void setRulesApplied(List<String> rulesApplied) { this.rulesApplied = rulesApplied; }
}

