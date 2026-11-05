package com.aquasafe.dto;

public class ParameterRecordDTO {

    private int parameterNumber;
    private String parameterName;
    private String parameterCode;
    private String category;
    private Double numericValue;
    private String displayValue;
    private String unit;
    private String sourceName;
    private String sourceUrl;
    private String monitoringStation;
    private String collectionDate;
    private String referencePeriod;
    private String dataStatus; // LIVE, OFFICIAL, MISSING, ERROR, STALE, DEMO
    private boolean available;

    public ParameterRecordDTO() {}

    public ParameterRecordDTO(int parameterNumber, String parameterName, String parameterCode, String category,
                              Double numericValue, String unit, String sourceName, String sourceUrl,
                              String monitoringStation, String collectionDate, String referencePeriod, String dataStatus) {
        this.parameterNumber = parameterNumber;
        this.parameterName = parameterName;
        this.parameterCode = parameterCode;
        this.category = category;
        this.numericValue = numericValue;
        this.unit = unit;
        this.sourceName = sourceName;
        this.sourceUrl = sourceUrl;
        this.monitoringStation = monitoringStation;
        this.collectionDate = collectionDate;
        this.referencePeriod = referencePeriod;
        this.dataStatus = dataStatus != null ? dataStatus : ("MISSING");

        if (numericValue != null && !"MISSING".equalsIgnoreCase(dataStatus)) {
            this.available = true;
            this.displayValue = String.valueOf(numericValue);
        } else {
            this.available = false;
            this.displayValue = "DATA NOT AVAILABLE FROM VERIFIED SOURCE";
        }
    }

    public static ParameterRecordDTO missing(int parameterNumber, String parameterName, String parameterCode,
                                             String category, String unit, String sourceName, String sourceUrl,
                                             String monitoringStation) {
        ParameterRecordDTO dto = new ParameterRecordDTO();
        dto.setParameterNumber(parameterNumber);
        dto.setParameterName(parameterName);
        dto.setParameterCode(parameterCode);
        dto.setCategory(category);
        dto.setNumericValue(null);
        dto.setDisplayValue("DATA NOT AVAILABLE FROM VERIFIED SOURCE");
        dto.setUnit(unit);
        dto.setSourceName(sourceName);
        dto.setSourceUrl(sourceUrl);
        dto.setMonitoringStation(monitoringStation);
        dto.setCollectionDate("N/A");
        dto.setReferencePeriod("Current Surveillance Cycle");
        dto.setDataStatus("MISSING");
        dto.setAvailable(false);
        return dto;
    }

    public int getParameterNumber() { return parameterNumber; }
    public void setParameterNumber(int parameterNumber) { this.parameterNumber = parameterNumber; }

    public String getParameterName() { return parameterName; }
    public void setParameterName(String parameterName) { this.parameterName = parameterName; }

    public String getParameterCode() { return parameterCode; }
    public void setParameterCode(String parameterCode) { this.parameterCode = parameterCode; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public Double getNumericValue() { return numericValue; }
    public void setNumericValue(Double numericValue) { this.numericValue = numericValue; }

    public String getDisplayValue() { return displayValue; }
    public void setDisplayValue(String displayValue) { this.displayValue = displayValue; }

    public String getUnit() { return unit; }
    public void setUnit(String unit) { this.unit = unit; }

    public String getSourceName() { return sourceName; }
    public void setSourceName(String sourceName) { this.sourceName = sourceName; }

    public String getSourceUrl() { return sourceUrl; }
    public void setSourceUrl(String sourceUrl) { this.sourceUrl = sourceUrl; }

    public String getMonitoringStation() { return monitoringStation; }
    public void setMonitoringStation(String monitoringStation) { this.monitoringStation = monitoringStation; }

    public String getCollectionDate() { return collectionDate; }
    public void setCollectionDate(String collectionDate) { this.collectionDate = collectionDate; }

    public String getReferencePeriod() { return referencePeriod; }
    public void setReferencePeriod(String referencePeriod) { this.referencePeriod = referencePeriod; }

    public String getDataStatus() { return dataStatus; }
    public void setDataStatus(String dataStatus) { this.dataStatus = dataStatus; }

    public boolean isAvailable() { return available; }
    public void setAvailable(boolean available) { this.available = available; }
}

