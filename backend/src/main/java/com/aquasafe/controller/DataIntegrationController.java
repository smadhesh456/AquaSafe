package com.aquasafe.controller;

import com.aquasafe.dto.DataAcquisitionSummaryDTO;
import com.aquasafe.dto.SourceMonitoringDTO;
import com.aquasafe.entity.District;
import com.aquasafe.repository.DistrictRepository;
import com.aquasafe.service.RealDataAcquisitionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/acquisition")
public class DataIntegrationController {

    private final RealDataAcquisitionService acquisitionService;
    private final DistrictRepository districtRepository;

    public DataIntegrationController(RealDataAcquisitionService acquisitionService, DistrictRepository districtRepository) {
        this.acquisitionService = acquisitionService;
        this.districtRepository = districtRepository;
    }

    /**
     * Get 13 authentic parameters for a district (defaults to Nagapattinam).
     */
    @GetMapping("/parameters/{district}")
    public ResponseEntity<DataAcquisitionSummaryDTO> getDistrictParameters(@PathVariable String district) {
        return ResponseEntity.ok(acquisitionService.acquireAndIntegrateDistrictData(district, false));
    }

    /**
     * Get 13 authentic parameters for Nagapattinam default endpoint.
     */
    @GetMapping("/parameters")
    public ResponseEntity<DataAcquisitionSummaryDTO> getDefaultParameters() {
        return ResponseEntity.ok(acquisitionService.acquireAndIntegrateDistrictData("Nagapattinam", false));
    }

    /**
     * Trigger live refresh data acquisition from external sources (Open-Meteo, CPCB, IDSP, etc.)
     */
    @PostMapping("/refresh/{district}")
    public ResponseEntity<DataAcquisitionSummaryDTO> refreshDistrictData(@PathVariable String district) {
        return ResponseEntity.ok(acquisitionService.acquireAndIntegrateDistrictData(district, true));
    }

    /**
     * Get real-time connection and monitoring status of all external data sources.
     */
    @GetMapping("/sources-monitoring")
    public ResponseEntity<List<SourceMonitoringDTO>> getSourcesMonitoring() {
        return ResponseEntity.ok(acquisitionService.getSourceMonitoringStatus());
    }

    /**
     * Get list of all 38 recognized Tamil Nadu districts in alphabetical order.
     */
    @GetMapping("/districts")
    public ResponseEntity<List<District>> getDistrictsList() {
        return ResponseEntity.ok(districtRepository.findAllByOrderByNameAsc());
    }
}

