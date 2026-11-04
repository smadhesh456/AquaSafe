package com.aquasafe.dto;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

public class PredictionResponseDTO {

    private String district;
    private String riskLevel; // LOW, MEDIUM, HIGH
    private Double probability;
    private LocalDateTime predictionDate;
    private String modelVersion;
    private Map<String, Double> classProbabilities;
    private String message;
    private String dataStatus = "STORED"; // LIVE, STORED, DEMO
    private List<String> featureContributions = new ArrayList<>();
    private Map<String, Object> inputParameters = new LinkedHashMap<>();
    private String disclaimer = "Prediction indicates estimated epidemiological risk based on environmental & surveillance indicators. It does NOT diagnose patients or confirm an outbreak.";

    public PredictionResponseDTO() {}

    public PredictionResponseDTO(String district, String riskLevel, Double probability, LocalDateTime predictionDate, String modelVersion, Map<String, Double> classProbabilities, String message) {
        this.district = district;
        this.riskLevel = riskLevel;
        this.probability = probability;
        this.predictionDate = predictionDate;
        this.modelVersion = modelVersion;
        this.classProbabilities = classProbabilities;
        this.message = message;
    }

    public String getDistrict() { return district; }
    public void setDistrict(String district) { this.district = district; }

    public String getRiskLevel() { return riskLevel; }
    public void setRiskLevel(String riskLevel) { this.riskLevel = riskLevel; }

    public Double getProbability() { return probability; }
    public void setProbability(Double probability) { this.probability = probability; }

    public LocalDateTime getPredictionDate() { return predictionDate; }
    public void setPredictionDate(LocalDateTime predictionDate) { this.predictionDate = predictionDate; }

    public String getModelVersion() { return modelVersion; }
    public void setModelVersion(String modelVersion) { this.modelVersion = modelVersion; }

    public Map<String, Double> getClassProbabilities() { return classProbabilities; }
    public void setClassProbabilities(Map<String, Double> classProbabilities) { this.classProbabilities = classProbabilities; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getDataStatus() { return dataStatus; }
    public void setDataStatus(String dataStatus) { this.dataStatus = dataStatus; }

    public List<String> getFeatureContributions() { return featureContributions; }
    public void setFeatureContributions(List<String> featureContributions) { this.featureContributions = featureContributions; }

    public Map<String, Object> getInputParameters() { return inputParameters; }
    public void setInputParameters(Map<String, Object> inputParameters) { this.inputParameters = inputParameters; }

    public String getDisclaimer() { return disclaimer; }
    public void setDisclaimer(String disclaimer) { this.disclaimer = disclaimer; }
}
