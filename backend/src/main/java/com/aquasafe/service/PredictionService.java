package com.aquasafe.service;

import com.aquasafe.dto.PredictionRequestDTO;
import com.aquasafe.dto.PredictionResponseDTO;
import com.aquasafe.entity.*;
import com.aquasafe.ml.WekaModelService;
import com.aquasafe.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
public class PredictionService {

    private static final Logger log = LoggerFactory.getLogger(PredictionService.class);

    private final WekaModelService mlService;
    private final PredictionResultRepository predictionRepository;
    private final AlertService alertService;
    private final WaterQualityRepository waterQualityRepository;
    private final PopulationDataRepository populationRepository;
    private final DiseaseRecordRepository diseaseRepository;
    private final DataCollectionService dataCollectionService;
    private final DistrictRepository districtRepository;

    public PredictionService(
            WekaModelService mlService,
            PredictionResultRepository predictionRepository,
            AlertService alertService,
            WaterQualityRepository waterQualityRepository,
            PopulationDataRepository populationRepository,
            DiseaseRecordRepository diseaseRepository,
            DataCollectionService dataCollectionService,
            DistrictRepository districtRepository) {
        this.mlService = mlService;
        this.predictionRepository = predictionRepository;
        this.alertService = alertService;
        this.waterQualityRepository = waterQualityRepository;
        this.populationRepository = populationRepository;
        this.diseaseRepository = diseaseRepository;
        this.dataCollectionService = dataCollectionService;
        this.districtRepository = districtRepository;
    }

    @Transactional
    public PredictionResponseDTO predictRisk(PredictionRequestDTO req) throws Exception {
        PredictionResponseDTO response = mlService.predict(req);

        // Persist prediction snapshot into database
        PredictionResult entity = new PredictionResult(
            req.getDistrict(),
            response.getRiskLevel(),
            response.getProbability(),
            response.getModelVersion()
        );
        entity.setPh(req.getPh());
        entity.setTurbidity(req.getTurbidity());
        entity.setTds(req.getTds());
        entity.setDissolvedOxygen(req.getDissolvedOxygen());
        entity.setWaterTemperature(req.getWaterTemperature());
        entity.setTemperature(req.getTemperature());
        entity.setRainfall(req.getRainfall());
        entity.setPrecipitation(req.getPrecipitation());
        entity.setHumidity(req.getHumidity());
        entity.setPreviousDiseaseCases(req.getPreviousDiseaseCases());
        entity.setPopulationDensity(req.getPopulationDensity());
        entity.setSanitationCoverage(req.getSanitationCoverage());
        entity.setCleanWaterCoverage(req.getCleanWaterCoverage());
        entity.setDataStatus(response.getDataStatus());
        entity.setFeatureContributions(String.join("; ", response.getFeatureContributions()));

        predictionRepository.save(entity);

        // Generate alert if High Risk
        if ("HIGH".equalsIgnoreCase(response.getRiskLevel())) {
            String alertMsg = "HIGH RISK CONDITION DETECTED: Estimated elevated disease risk in " +
                    req.getDistrict() + " (Calculated Confidence: " +
                    String.format("%.1f%%", response.getProbability() * 100) +
                    "). Recommendation: Increase chlorine dosage at water distribution units and intensify disease surveillance.";
            alertService.createAlert(req.getDistrict(), "HIGH", response.getProbability(), alertMsg);
            log.warn("High-risk alert generated for district: {}", req.getDistrict());
        }

        return response;
    }

    public PredictionResponseDTO predictForDistrictAuto(String districtName) throws Exception {
        PredictionRequestDTO req = buildAutoRequestForDistrict(districtName);
        return predictRisk(req);
    }

    public List<PredictionResponseDTO> predictAllDistricts() {
        List<District> districts = districtRepository.findAllByOrderByNameAsc();
        List<PredictionResponseDTO> results = new ArrayList<>();
        for (District d : districts) {
            try {
                results.add(predictForDistrictAuto(d.getName()));
            } catch (Exception e) {
                log.error("Failed auto prediction for {}: {}", d.getName(), e.getMessage());
            }
        }
        return results;
    }

    public PredictionRequestDTO buildAutoRequestForDistrict(String districtName) {
        PredictionRequestDTO req = new PredictionRequestDTO();
        req.setDistrict(districtName);

        // 1. Fetch live or stored weather
        WeatherData weather = dataCollectionService.fetchLiveWeatherForDistrict(districtName, "AUTO_PREDICTION");
        req.setTemperature(weather.getTemperature());
        req.setRainfall(weather.getRainfall());
        req.setPrecipitation(weather.getPrecipitation());
        req.setHumidity(weather.getHumidity());
        req.setDataStatus(weather.getDataStatus());

        // 2. Fetch latest Water Quality
        Optional<WaterQuality> wqOpt = waterQualityRepository.findTopByDistrictOrderByDateDesc(districtName);
        if (wqOpt.isPresent()) {
            WaterQuality wq = wqOpt.get();
            req.setPh(wq.getPh());
            req.setTurbidity(wq.getTurbidity());
            req.setTds(wq.getTds());
            req.setDissolvedOxygen(wq.getDissolvedOxygen());
            req.setWaterTemperature(wq.getWaterTemperature());
        } else {
            req.setPh(7.4);
            req.setTurbidity(3.2);
            req.setTds(480.0);
            req.setDissolvedOxygen(6.5);
            req.setWaterTemperature(28.0);
        }

        // 3. Fetch Demographics & Sanitation
        Optional<PopulationData> popOpt = populationRepository.findByDistrictIgnoreCase(districtName);
        if (popOpt.isPresent()) {
            PopulationData pop = popOpt.get();
            req.setPopulationDensity(pop.getPopulationDensity());
            req.setSanitationCoverage(pop.getSanitationCoverage());
            req.setCleanWaterCoverage(pop.getCleanWaterCoverage() != null ? pop.getCleanWaterCoverage() : 92.0);
        } else {
            req.setPopulationDensity(550);
            req.setSanitationCoverage(82.0);
            req.setCleanWaterCoverage(91.0);
        }

        // 4. Fetch recent Disease cases
        Optional<DiseaseRecord> disOpt = diseaseRepository.findTopByDistrictOrderByDateDesc(districtName);
        req.setPreviousDiseaseCases(disOpt.map(DiseaseRecord::getTotalCases).orElse(12));

        return req;
    }

    public List<PredictionResult> getRecentPredictions() {
        return predictionRepository.findTop10ByOrderByPredictionDateDesc();
    }

    public Page<PredictionResult> getAllPredictions(int page, int size) {
        return predictionRepository.findAllByOrderByPredictionDateDesc(PageRequest.of(page, size));
    }

    public List<Object[]> getLatestPredictionPerDistrict() {
        return predictionRepository.getLatestPredictionPerDistrict();
    }
}
