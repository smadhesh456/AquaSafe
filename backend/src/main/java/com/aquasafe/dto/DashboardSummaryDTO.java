package com.aquasafe.dto;

import java.time.LocalDateTime;

public class DashboardSummaryDTO {

    private long totalRecords;
    private long totalDistricts;
    private long totalWaterQualityRecords;
    private long totalWeatherRecords;
    private long totalDiseaseReports;
    private long highRiskDistricts;
    private long mediumRiskDistricts;
    private long lowRiskDistricts;
    private long latestPredictionsCount;
    private long activeAlertsCount;
    private String dataFreshness; // LIVE DATA, STORED DATA, DEMO DATA
    private LocalDateTime lastUpdated;
    private String weatherSource;
    private boolean apiOnline = false;
    private LocalDateTime lastSuccessfulWeatherUpdate;

    public DashboardSummaryDTO() {}

    public long getTotalRecords() { return totalRecords; }
    public void setTotalRecords(long totalRecords) { this.totalRecords = totalRecords; }

    public long getTotalDistricts() { return totalDistricts; }
    public void setTotalDistricts(long totalDistricts) { this.totalDistricts = totalDistricts; }

    public long getTotalWaterQualityRecords() { return totalWaterQualityRecords; }
    public void setTotalWaterQualityRecords(long totalWaterQualityRecords) { this.totalWaterQualityRecords = totalWaterQualityRecords; }

    public long getTotalWeatherRecords() { return totalWeatherRecords; }
    public void setTotalWeatherRecords(long totalWeatherRecords) { this.totalWeatherRecords = totalWeatherRecords; }

    public long getTotalDiseaseReports() { return totalDiseaseReports; }
    public void setTotalDiseaseReports(long totalDiseaseReports) { this.totalDiseaseReports = totalDiseaseReports; }

    public long getHighRiskDistricts() { return highRiskDistricts; }
    public void setHighRiskDistricts(long highRiskDistricts) { this.highRiskDistricts = highRiskDistricts; }

    public long getMediumRiskDistricts() { return mediumRiskDistricts; }
    public void setMediumRiskDistricts(long mediumRiskDistricts) { this.mediumRiskDistricts = mediumRiskDistricts; }

    public long getLowRiskDistricts() { return lowRiskDistricts; }
    public void setLowRiskDistricts(long lowRiskDistricts) { this.lowRiskDistricts = lowRiskDistricts; }

    public long getLatestPredictionsCount() { return latestPredictionsCount; }
    public void setLatestPredictionsCount(long latestPredictionsCount) { this.latestPredictionsCount = latestPredictionsCount; }

    public long getActiveAlertsCount() { return activeAlertsCount; }
    public void setActiveAlertsCount(long activeAlertsCount) { this.activeAlertsCount = activeAlertsCount; }

    public String getDataFreshness() { return dataFreshness; }
    public void setDataFreshness(String dataFreshness) { this.dataFreshness = dataFreshness; }

    public LocalDateTime getLastUpdated() { return lastUpdated; }
    public void setLastUpdated(LocalDateTime lastUpdated) { this.lastUpdated = lastUpdated; }

    public String getWeatherSource() { return weatherSource; }
    public void setWeatherSource(String weatherSource) { this.weatherSource = weatherSource; }

    public boolean isApiOnline() { return apiOnline; }
    public void setApiOnline(boolean apiOnline) { this.apiOnline = apiOnline; }

    public LocalDateTime getLastSuccessfulWeatherUpdate() { return lastSuccessfulWeatherUpdate; }
    public void setLastSuccessfulWeatherUpdate(LocalDateTime lastSuccessfulWeatherUpdate) { this.lastSuccessfulWeatherUpdate = lastSuccessfulWeatherUpdate; }
}
