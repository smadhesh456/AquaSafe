package com.aquasafe.controller;

import com.aquasafe.dto.PreprocessingStatsDTO;
import com.aquasafe.dto.ValidationReportDTO;
import com.aquasafe.entity.PreprocessingLog;
import com.aquasafe.repository.PreprocessingLogRepository;
import com.aquasafe.service.DataPreprocessingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/preprocessing")
public class PreprocessingController {

    private final DataPreprocessingService preprocessingService;
    private final PreprocessingLogRepository logRepository;

    public PreprocessingController(DataPreprocessingService preprocessingService, PreprocessingLogRepository logRepository) {
        this.preprocessingService = preprocessingService;
        this.logRepository = logRepository;
    }

    @PostMapping("/run")
    public ResponseEntity<PreprocessingStatsDTO> runPreprocessing() {
        PreprocessingStatsDTO stats = preprocessingService.cleanAndIntegrateData();
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/validation-report")
    public ResponseEntity<ValidationReportDTO> getValidationReport() {
        return ResponseEntity.ok(preprocessingService.generateValidationReport());
    }

    @GetMapping("/logs")
    public ResponseEntity<List<PreprocessingLog>> getLogs() {
        return ResponseEntity.ok(logRepository.findTop10ByOrderByTimestampDesc());
    }
}
