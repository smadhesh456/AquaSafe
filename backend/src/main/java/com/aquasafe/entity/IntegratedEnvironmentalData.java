package com.aquasafe.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "integrated_environmental_data", indexes = {
    @Index(name = "idx_integ_district", columnList = "district"),
    @Index(name = "idx_integ_date", columnList = "observation_date"),
    @Index(name = "idx_integ_status", columnList = "overall_status")
})
public class IntegratedEnvironmentalData {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String district;

    @Column(nullable = false)
    private Double latitude;

    @Column(nullable = false)
    private Double longitude;

    @Column(name = "observation_date", nullable = false)
    private LocalDate observationDate = LocalDate.now();

    @Column(name = "integration_timestamp")
    private LocalDateTime integrationTimestamp = LocalDateTime.now();

    // 1. pH
    @Column(name = "ph_value")
    private Double phValue;
    @Column(name = "ph_unit", length = 20)
    private String phUnit = "pH units";
    @Column(name = "ph_source", length = 150)
    private String phSource = "CPCB & TNPCB Water Quality Monitoring Network";
    @Column(name = "ph_status", length = 20)
    private String phStatus = "OFFICIAL";

    // 2. Turbidity
    @Column(name = "turbidity_value")
    private Double turbidityValue;
    @Column(name = "turbidity_unit", length = 20)
    private String turbidityUnit = "NTU";
    @Column(name = "turbidity_source", length = 150)
    private String turbiditySource = "CPCB & TNPCB Monitoring Network";
    @Column(name = "turbidity_status", length = 20)
    private String turbidityStatus = "MISSING";

    // 3. TDS
    @Column(name = "tds_value")
    private Double tdsValue;
    @Column(name = "tds_unit", length = 20)
    private String tdsUnit = "mg/L";
    @Column(name = "tds_source", length = 150)
    private String tdsSource = "CPCB & TNPCB Monitoring Network";
    @Column(name = "tds_status", length = 20)
    private String tdsStatus = "OFFICIAL";

    // 4. Dissolved Oxygen (DO)
    @Column(name = "do_value")
    private Double doValue;
    @Column(name = "do_unit", length = 20)
    private String doUnit = "mg/L";
    @Column(name = "do_source", length = 150)
    private String doSource = "CPCB & TNPCB Monitoring Network";
    @Column(name = "do_status", length = 20)
    private String doStatus = "OFFICIAL";

    // 5. Water Temperature
    @Column(name = "water_temp_value")
    private Double waterTempValue;
    @Column(name = "water_temp_unit", length = 20)
    private String waterTempUnit = "°C";
    @Column(name = "water_temp_source", length = 150)
    private String waterTempSource = "CPCB & TNPCB Station Sampling";
    @Column(name = "water_temp_status", length = 20)
    private String waterTempStatus = "OFFICIAL";

    // 6. Air Temperature
    @Column(name = "air_temp_value")
    private Double airTempValue;
    @Column(name = "air_temp_unit", length = 20)
    private String airTempUnit = "°C";
    @Column(name = "air_temp_source", length = 150)
    private String airTempSource = "Open-Meteo Weather API";
    @Column(name = "air_temp_status", length = 20)
    private String airTempStatus = "LIVE";

    // 7. Relative Humidity
    @Column(name = "humidity_value")
    private Double humidityValue;
    @Column(name = "humidity_unit", length = 20)
    private String humidityUnit = "%";
    @Column(name = "humidity_source", length = 150)
    private String humiditySource = "Open-Meteo Weather API";
    @Column(name = "humidity_status", length = 20)
    private String humidityStatus = "LIVE";

    // 8. Rainfall
    @Column(name = "rainfall_value")
    private Double rainfallValue;
    @Column(name = "rainfall_unit", length = 20)
    private String rainfallUnit = "mm";
    @Column(name = "rainfall_source", length = 150)
    private String rainfallSource = "Open-Meteo Weather API";
    @Column(name = "rainfall_status", length = 20)
    private String rainfallStatus = "LIVE";

    // 9. Precipitation
    @Column(name = "precipitation_value")
    private Double precipitationValue;
    @Column(name = "precipitation_unit", length = 20)
    private String precipitationUnit = "mm";
    @Column(name = "precipitation_source", length = 150)
    private String precipitationSource = "Open-Meteo Weather API";
    @Column(name = "precipitation_status", length = 20)
    private String precipitationStatus = "LIVE";

    // 10. Disease Cases
    @Column(name = "disease_cases_value")
    private Integer diseaseCasesValue;
    @Column(name = "disease_name", length = 100)
    private String diseaseName = "Acute Diarrhoeal Disease / Typhoid";
    @Column(name = "disease_reporting_period", length = 100)
    private String diseaseReportingPeriod = "IDSP Monthly Surveillance";
    @Column(name = "disease_source", length = 150)
    private String diseaseSource = "IDSP Tamil Nadu & MoHFW";
    @Column(name = "disease_status", length = 20)
    private String diseaseStatus = "OFFICIAL";

    // 11. Population Density
    @Column(name = "population_density_value")
    private Integer populationDensityValue;
    @Column(name = "population_density_unit", length = 30)
    private String populationDensityUnit = "persons/km²";
    @Column(name = "census_reference_year", length = 50)
    private String censusReferenceYear = "2011";
    @Column(name = "population_source", length = 150)
    private String populationSource = "Census of India - Office of Registrar General";
    @Column(name = "population_status", length = 20)
    private String populationStatus = "OFFICIAL";

    // 12. Sanitation Coverage
    @Column(name = "sanitation_coverage_value")
    private Double sanitationCoverageValue;
    @Column(name = "sanitation_coverage_unit", length = 20)
    private String sanitationCoverageUnit = "%";
    @Column(name = "sanitation_reference_year", length = 50)
    private String sanitationReferenceYear = "2019-2021 (NFHS-5)";
    @Column(name = "sanitation_source", length = 150)
    private String sanitationSource = "Swachh Bharat Mission & NFHS-5";
    @Column(name = "sanitation_status", length = 20)
    private String sanitationStatus = "OFFICIAL";

    // 13. Drinking Water Coverage
    @Column(name = "drinking_water_coverage_value")
    private Double drinkingWaterCoverageValue;
    @Column(name = "drinking_water_coverage_unit", length = 20)
    private String drinkingWaterCoverageUnit = "%";
    @Column(name = "drinking_water_reference_year", length = 50)
    private String drinkingWaterReferenceYear = "2023-2024 (Jal Jeevan Mission)";
    @Column(name = "drinking_water_source", length = 150)
    private String drinkingWaterSource = "Jal Jeevan Mission (Har Ghar Jal)";
    @Column(name = "drinking_water_status", length = 20)
    private String drinkingWaterStatus = "OFFICIAL";

    // Summary Metrics
    @Column(name = "total_parameters")
    private Integer totalParameters = 13;

    @Column(name = "collected_parameters")
    private Integer collectedParameters = 0;

    @Column(name = "official_parameters")
    private Integer officialParameters = 0;

    @Column(name = "missing_parameters")
    private Integer missingParameters = 0;

    @Column(name = "overall_status", length = 30)
    private String overallStatus = "OFFICIAL";

    @Column(name = "can_predict_risk")
    private Boolean canPredictRisk = false;

    @Column(name = "monitoring_station", length = 200)
    private String monitoringStation;

    @Column(name = "validation_notes", columnDefinition = "TEXT")
    private String validationNotes;

    public IntegratedEnvironmentalData() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getDistrict() { return district; }
    public void setDistrict(String district) { this.district = district; }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }

    public LocalDate getObservationDate() { return observationDate; }
    public void setObservationDate(LocalDate observationDate) { this.observationDate = observationDate; }

    public LocalDateTime getIntegrationTimestamp() { return integrationTimestamp; }
    public void setIntegrationTimestamp(LocalDateTime integrationTimestamp) { this.integrationTimestamp = integrationTimestamp; }

    public Double getPhValue() { return phValue; }
    public void setPhValue(Double phValue) { this.phValue = phValue; }
    public String getPhUnit() { return phUnit; }
    public void setPhUnit(String phUnit) { this.phUnit = phUnit; }
    public String getPhSource() { return phSource; }
    public void setPhSource(String phSource) { this.phSource = phSource; }
    public String getPhStatus() { return phStatus; }
    public void setPhStatus(String phStatus) { this.phStatus = phStatus; }

    public Double getTurbidityValue() { return turbidityValue; }
    public void setTurbidityValue(Double turbidityValue) { this.turbidityValue = turbidityValue; }
    public String getTurbidityUnit() { return turbidityUnit; }
    public void setTurbidityUnit(String turbidityUnit) { this.turbidityUnit = turbidityUnit; }
    public String getTurbiditySource() { return turbiditySource; }
    public void setTurbiditySource(String turbiditySource) { this.turbiditySource = turbiditySource; }
    public String getTurbidityStatus() { return turbidityStatus; }
    public void setTurbidityStatus(String turbidityStatus) { this.turbidityStatus = turbidityStatus; }

    public Double getTdsValue() { return tdsValue; }
    public void setTdsValue(Double tdsValue) { this.tdsValue = tdsValue; }
    public String getTdsUnit() { return tdsUnit; }
    public void setTdsUnit(String tdsUnit) { this.tdsUnit = tdsUnit; }
    public String getTdsSource() { return tdsSource; }
    public void setTdsSource(String tdsSource) { this.tdsSource = tdsSource; }
    public String getTdsStatus() { return tdsStatus; }
    public void setTdsStatus(String tdsStatus) { this.tdsStatus = tdsStatus; }

    public Double getDoValue() { return doValue; }
    public void setDoValue(Double doValue) { this.doValue = doValue; }
    public String getDoUnit() { return doUnit; }
    public void setDoUnit(String doUnit) { this.doUnit = doUnit; }
    public String getDoSource() { return doSource; }
    public void setDoSource(String doSource) { this.doSource = doSource; }
    public String getDoStatus() { return doStatus; }
    public void setDoStatus(String doStatus) { this.doStatus = doStatus; }

    public Double getWaterTempValue() { return waterTempValue; }
    public void setWaterTempValue(Double waterTempValue) { this.waterTempValue = waterTempValue; }
    public String getWaterTempUnit() { return waterTempUnit; }
    public void setWaterTempUnit(String waterTempUnit) { this.waterTempUnit = waterTempUnit; }
    public String getWaterTempSource() { return waterTempSource; }
    public void setWaterTempSource(String waterTempSource) { this.waterTempSource = waterTempSource; }
    public String getWaterTempStatus() { return waterTempStatus; }
    public void setWaterTempStatus(String waterTempStatus) { this.waterTempStatus = waterTempStatus; }

    public Double getAirTempValue() { return airTempValue; }
    public void setAirTempValue(Double airTempValue) { this.airTempValue = airTempValue; }
    public String getAirTempUnit() { return airTempUnit; }
    public void setAirTempUnit(String airTempUnit) { this.airTempUnit = airTempUnit; }
    public String getAirTempSource() { return airTempSource; }
    public void setAirTempSource(String airTempSource) { this.airTempSource = airTempSource; }
    public String getAirTempStatus() { return airTempStatus; }
    public void setAirTempStatus(String airTempStatus) { this.airTempStatus = airTempStatus; }

    public Double getHumidityValue() { return humidityValue; }
    public void setHumidityValue(Double humidityValue) { this.humidityValue = humidityValue; }
    public String getHumidityUnit() { return humidityUnit; }
    public void setHumidityUnit(String humidityUnit) { this.humidityUnit = humidityUnit; }
    public String getHumiditySource() { return humiditySource; }
    public void setHumiditySource(String humiditySource) { this.humiditySource = humiditySource; }
    public String getHumidityStatus() { return humidityStatus; }
    public void setHumidityStatus(String humidityStatus) { this.humidityStatus = humidityStatus; }

    public Double getRainfallValue() { return rainfallValue; }
    public void setRainfallValue(Double rainfallValue) { this.rainfallValue = rainfallValue; }
    public String getRainfallUnit() { return rainfallUnit; }
    public void setRainfallUnit(String rainfallUnit) { this.rainfallUnit = rainfallUnit; }
    public String getRainfallSource() { return rainfallSource; }
    public void setRainfallSource(String rainfallSource) { this.rainfallSource = rainfallSource; }
    public String getRainfallStatus() { return rainfallStatus; }
    public void setRainfallStatus(String rainfallStatus) { this.rainfallStatus = rainfallStatus; }

    public Double getPrecipitationValue() { return precipitationValue; }
    public void setPrecipitationValue(Double precipitationValue) { this.precipitationValue = precipitationValue; }
    public String getPrecipitationUnit() { return precipitationUnit; }
    public void setPrecipitationUnit(String precipitationUnit) { this.precipitationUnit = precipitationUnit; }
    public String getPrecipitationSource() { return precipitationSource; }
    public void setPrecipitationSource(String precipitationSource) { this.precipitationSource = precipitationSource; }
    public String getPrecipitationStatus() { return precipitationStatus; }
    public void setPrecipitationStatus(String precipitationStatus) { this.precipitationStatus = precipitationStatus; }

    public Integer getDiseaseCasesValue() { return diseaseCasesValue; }
    public void setDiseaseCasesValue(Integer diseaseCasesValue) { this.diseaseCasesValue = diseaseCasesValue; }
    public String getDiseaseName() { return diseaseName; }
    public void setDiseaseName(String diseaseName) { this.diseaseName = diseaseName; }
    public String getDiseaseReportingPeriod() { return diseaseReportingPeriod; }
    public void setDiseaseReportingPeriod(String diseaseReportingPeriod) { this.diseaseReportingPeriod = diseaseReportingPeriod; }
    public String getDiseaseSource() { return diseaseSource; }
    public void setDiseaseSource(String diseaseSource) { this.diseaseSource = diseaseSource; }
    public String getDiseaseStatus() { return diseaseStatus; }
    public void setDiseaseStatus(String diseaseStatus) { this.diseaseStatus = diseaseStatus; }

    public Integer getPopulationDensityValue() { return populationDensityValue; }
    public void setPopulationDensityValue(Integer populationDensityValue) { this.populationDensityValue = populationDensityValue; }
    public String getPopulationDensityUnit() { return populationDensityUnit; }
    public void setPopulationDensityUnit(String populationDensityUnit) { this.populationDensityUnit = populationDensityUnit; }
    public String getCensusReferenceYear() { return censusReferenceYear; }
    public void setCensusReferenceYear(String censusReferenceYear) { this.censusReferenceYear = censusReferenceYear; }
    public String getPopulationSource() { return populationSource; }
    public void setPopulationSource(String populationSource) { this.populationSource = populationSource; }
    public String getPopulationStatus() { return populationStatus; }
    public void setPopulationStatus(String populationStatus) { this.populationStatus = populationStatus; }

    public Double getSanitationCoverageValue() { return sanitationCoverageValue; }
    public void setSanitationCoverageValue(Double sanitationCoverageValue) { this.sanitationCoverageValue = sanitationCoverageValue; }
    public String getSanitationCoverageUnit() { return sanitationCoverageUnit; }
    public void setSanitationCoverageUnit(String sanitationCoverageUnit) { this.sanitationCoverageUnit = sanitationCoverageUnit; }
    public String getSanitationReferenceYear() { return sanitationReferenceYear; }
    public void setSanitationReferenceYear(String sanitationReferenceYear) { this.sanitationReferenceYear = sanitationReferenceYear; }
    public String getSanitationSource() { return sanitationSource; }
    public void setSanitationSource(String sanitationSource) { this.sanitationSource = sanitationSource; }
    public String getSanitationStatus() { return sanitationStatus; }
    public void setSanitationStatus(String sanitationStatus) { this.sanitationStatus = sanitationStatus; }

    public Double getDrinkingWaterCoverageValue() { return drinkingWaterCoverageValue; }
    public void setDrinkingWaterCoverageValue(Double drinkingWaterCoverageValue) { this.drinkingWaterCoverageValue = drinkingWaterCoverageValue; }
    public String getDrinkingWaterCoverageUnit() { return drinkingWaterCoverageUnit; }
    public void setDrinkingWaterCoverageUnit(String drinkingWaterCoverageUnit) { this.drinkingWaterCoverageUnit = drinkingWaterCoverageUnit; }
    public String getDrinkingWaterReferenceYear() { return drinkingWaterReferenceYear; }
    public void setDrinkingWaterReferenceYear(String drinkingWaterReferenceYear) { this.drinkingWaterReferenceYear = drinkingWaterReferenceYear; }
    public String getDrinkingWaterSource() { return drinkingWaterSource; }
    public void setDrinkingWaterSource(String drinkingWaterSource) { this.drinkingWaterSource = drinkingWaterSource; }
    public String getDrinkingWaterStatus() { return drinkingWaterStatus; }
    public void setDrinkingWaterStatus(String drinkingWaterStatus) { this.drinkingWaterStatus = drinkingWaterStatus; }

    public Integer getTotalParameters() { return totalParameters; }
    public void setTotalParameters(Integer totalParameters) { this.totalParameters = totalParameters; }

    public Integer getCollectedParameters() { return collectedParameters; }
    public void setCollectedParameters(Integer collectedParameters) { this.collectedParameters = collectedParameters; }

    public Integer getOfficialParameters() { return officialParameters; }
    public void setOfficialParameters(Integer officialParameters) { this.officialParameters = officialParameters; }

    public Integer getMissingParameters() { return missingParameters; }
    public void setMissingParameters(Integer missingParameters) { this.missingParameters = missingParameters; }

    public String getOverallStatus() { return overallStatus; }
    public void setOverallStatus(String overallStatus) { this.overallStatus = overallStatus; }

    public Boolean getCanPredictRisk() { return canPredictRisk; }
    public void setCanPredictRisk(Boolean canPredictRisk) { this.canPredictRisk = canPredictRisk; }

    public String getMonitoringStation() { return monitoringStation; }
    public void setMonitoringStation(String monitoringStation) { this.monitoringStation = monitoringStation; }

    public String getValidationNotes() { return validationNotes; }
    public void setValidationNotes(String validationNotes) { this.validationNotes = validationNotes; }
}

