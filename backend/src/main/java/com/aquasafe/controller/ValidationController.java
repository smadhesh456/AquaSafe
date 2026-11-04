package com.aquasafe.controller;

import com.aquasafe.dto.ValidationReportDTO;
import com.aquasafe.service.DataPreprocessingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/validation")
public class ValidationController {

    private final DataPreprocessingService preprocessingService;

    public ValidationController(DataPreprocessingService preprocessingService) {
        this.preprocessingService = preprocessingService;
    }

    @GetMapping("/report")
    public ResponseEntity<ValidationReportDTO> getReport() {
        return ResponseEntity.ok(preprocessingService.generateValidationReport());
    }
}

