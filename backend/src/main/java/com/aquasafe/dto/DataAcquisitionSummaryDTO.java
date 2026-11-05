package com.aquasafe.dto;

import java.util.ArrayList;
import java.util.List;

public class DataAcquisitionSummaryDTO {

    private String district;
    private String state = "Tamil Nadu";
    private String zone = "Tamil Nadu";
    private Double latitude;
    private Double longitude;
    private String geographicIdentifier;
    private int totalParameters = 13;
    private int successfullyCollectedParameters;
    private int officialDatasetParameters;
    private int missingParameters;
    private int failedSources;
    private String lastSynchronizationTime;
    private String overallStatus; // LIVE, OFFICIAL, PARTIAL, MISSING, ERROR
    private boolean canPredictRisk;
    private String riskPredictionAdvisory;

    // ML Risk Prediction evaluation fields for selected district
    private String riskLevel = "INSUFFICIENT VERIFIED DATA FOR RISK PREDICTION"; // LOW RISK, MEDIUM RISK, HIGH RISK, or INSUFFICIENT VERIFIED DATA FOR RISK PREDICTION
    private Double riskProbability = 0.0;
    private List<String> featureContributions = new ArrayList<>();
    private String recommendation = "Evaluation pending authentic parameter verification.";
    private String medicalDisclaimer = "AquaSafe is an engineering predictive analytics and early-warning decision support system using big data analytics and machine learning. It is NOT a medical diagnosis tool and never confirms a disease outbreak.";

    private List<ParameterRecordDTO> parameters = new ArrayList<>();

    public DataAcquisitionSummaryDTO() {}

    public String getDistrict() { return district; }
    public void setDistrict(String district) { this.district = district; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public String getZone() { return zone; }
    public void setZone(String zone) { this.zone = zone; }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }

    public String getGeographicIdentifier() { return geographicIdentifier; }
    public void setGeographicIdentifier(String geographicIdentifier) { this.geographicIdentifier = geographicIdentifier; }

    public int getTotalParameters() { return totalParameters; }
    public void setTotalParameters(int totalParameters) { this.totalParameters = totalParameters; }

    public int getSuccessfullyCollectedParameters() { return successfullyCollectedParameters; }
    public void setSuccessfullyCollectedParameters(int successfullyCollectedParameters) { this.successfullyCollectedParameters = successfullyCollectedParameters; }

    public int getOfficialDatasetParameters() { return officialDatasetParameters; }
    public void setOfficialDatasetParameters(int officialDatasetParameters) { this.officialDatasetParameters = officialDatasetParameters; }

    public int getMissingParameters() { return missingParameters; }
    public void setMissingParameters(int missingParameters) { this.missingParameters = missingParameters; }

    public int getFailedSources() { return failedSources; }
    public void setFailedSources(int failedSources) { this.failedSources = failedSources; }

    public String getLastSynchronizationTime() { return lastSynchronizationTime; }
    public void setLastSynchronizationTime(String lastSynchronizationTime) { this.lastSynchronizationTime = lastSynchronizationTime; }

    public String getOverallStatus() { return overallStatus; }
    public void setOverallStatus(String overallStatus) { this.overallStatus = overallStatus; }

    public boolean isCanPredictRisk() { return canPredictRisk; }
    public void setCanPredictRisk(boolean canPredictRisk) { this.canPredictRisk = canPredictRisk; }

    public String getRiskPredictionAdvisory() { return riskPredictionAdvisory; }
    public void setRiskPredictionAdvisory(String riskPredictionAdvisory) { this.riskPredictionAdvisory = riskPredictionAdvisory; }

    public String getRiskLevel() { return riskLevel; }
    public void setRiskLevel(String riskLevel) { this.riskLevel = riskLevel; }

    public Double getRiskProbability() { return riskProbability; }
    public void setRiskProbability(Double riskProbability) { this.riskProbability = riskProbability; }

    public List<String> getFeatureContributions() { return featureContributions; }
    public void setFeatureContributions(List<String> featureContributions) { this.featureContributions = featureContributions; }

    public String getRecommendation() { return recommendation; }
    public void setRecommendation(String recommendation) { this.recommendation = recommendation; }

    public String getMedicalDisclaimer() { return medicalDisclaimer; }
    public void setMedicalDisclaimer(String medicalDisclaimer) { this.medicalDisclaimer = medicalDisclaimer; }

    public List<ParameterRecordDTO> getParameters() { return parameters; }
    public void setParameters(List<ParameterRecordDTO> parameters) { this.parameters = parameters; }
}

