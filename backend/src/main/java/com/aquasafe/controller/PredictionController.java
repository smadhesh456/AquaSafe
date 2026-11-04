package com.aquasafe.controller;

import com.aquasafe.dto.PredictionRequestDTO;
import com.aquasafe.dto.PredictionResponseDTO;
import com.aquasafe.entity.PredictionResult;
import com.aquasafe.service.PredictionService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/predictions")
public class PredictionController {

    private final PredictionService predictionService;

    public PredictionController(PredictionService predictionService) {
        this.predictionService = predictionService;
    }

    @PostMapping("/predict")
    public ResponseEntity<PredictionResponseDTO> predictRisk(@Valid @RequestBody PredictionRequestDTO request) throws Exception {
        PredictionResponseDTO response = predictionService.predictRisk(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/auto/{district}")
    public ResponseEntity<PredictionResponseDTO> predictRiskAuto(@PathVariable String district) throws Exception {
        PredictionResponseDTO response = predictionService.predictForDistrictAuto(district);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/predict-all")
    public ResponseEntity<List<PredictionResponseDTO>> predictAllDistricts() {
        return ResponseEntity.ok(predictionService.predictAllDistricts());
    }

    @GetMapping("/history")
    public ResponseEntity<List<PredictionResult>> getRecentPredictions() {
        return ResponseEntity.ok(predictionService.getRecentPredictions());
    }

    @GetMapping("/district-summary")
    public ResponseEntity<List<Object[]>> getDistrictSummary() {
        return ResponseEntity.ok(predictionService.getLatestPredictionPerDistrict());
    }

    @GetMapping("/all")
    public ResponseEntity<Page<PredictionResult>> getAllPredictions(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size) {
        return ResponseEntity.ok(predictionService.getAllPredictions(page, size));
    }
}
