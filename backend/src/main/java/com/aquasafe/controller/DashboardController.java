package com.aquasafe.controller;

import com.aquasafe.dto.DashboardSummaryDTO;
import com.aquasafe.service.DashboardService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/summary")
    public ResponseEntity<DashboardSummaryDTO> getSummary() {
        return ResponseEntity.ok(dashboardService.getSummary());
    }

    @GetMapping("/disease-trends")
    public ResponseEntity<Map<String, Object>> getDiseaseTrends() {
        return ResponseEntity.ok(dashboardService.getDiseaseTrends());
    }

    @GetMapping("/rainfall-vs-disease")
    public ResponseEntity<Map<String, Object>> getRainfallVsDisease() {
        return ResponseEntity.ok(dashboardService.getRainfallVsDiseaseTrends());
    }

    @GetMapping("/monthly-disease")
    public ResponseEntity<Map<String, Object>> getMonthlyDisease() {
        return ResponseEntity.ok(dashboardService.getMonthlyDiseaseCases());
    }

    @GetMapping("/weather-trends")
    public ResponseEntity<Map<String, Object>> getWeatherTrends() {
        return ResponseEntity.ok(dashboardService.getTemperatureHumidityTrends());
    }

    @GetMapping("/water-quality")
    public ResponseEntity<Map<String, Object>> getWaterQuality() {
        return ResponseEntity.ok(dashboardService.getDistrictRiskBreakdown());
    }

    @GetMapping("/risk-distribution")
    public ResponseEntity<Map<String, Object>> getRiskDistribution() {
        return ResponseEntity.ok(dashboardService.getRiskDistribution());
    }

    @GetMapping("/district-risk")
    public ResponseEntity<Map<String, Object>> getDistrictRisk() {
        return ResponseEntity.ok(dashboardService.getDistrictRiskBreakdown());
    }

    @GetMapping("/monitoring")
    public ResponseEntity<Map<String, Object>> getMonitoringPanel() {
        return ResponseEntity.ok(dashboardService.getMonitoringPanelData());
    }

    @GetMapping(value = "/live-stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter streamDashboardUpdates() {
        return dashboardService.subscribe();
    }
}
