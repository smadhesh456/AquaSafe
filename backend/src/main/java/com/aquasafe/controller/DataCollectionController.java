package com.aquasafe.controller;

import com.aquasafe.entity.DataCollectionLog;
import com.aquasafe.entity.WeatherData;
import com.aquasafe.repository.DataCollectionLogRepository;
import com.aquasafe.service.DataCollectionService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/data-collection")
public class DataCollectionController {

    private final DataCollectionService collectionService;
    private final DataCollectionLogRepository logRepository;

    public DataCollectionController(DataCollectionService collectionService, DataCollectionLogRepository logRepository) {
        this.collectionService = collectionService;
        this.logRepository = logRepository;
    }

    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> getStatus() {
        return ResponseEntity.ok(collectionService.getCollectionStatus());
    }

    @PostMapping("/trigger")
    public ResponseEntity<Map<String, Object>> triggerCollection() {
        Map<String, Object> result = collectionService.collectAllDistrictsWeather("MANUAL");
        return ResponseEntity.ok(result);
    }

    @PostMapping("/district/{district}")
    public ResponseEntity<WeatherData> triggerDistrictCollection(@PathVariable String district) {
        WeatherData weather = collectionService.fetchLiveWeatherForDistrict(district, "MANUAL");
        return ResponseEntity.ok(weather);
    }

    @GetMapping("/logs")
    public ResponseEntity<Page<DataCollectionLog>> getLogs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size) {
        return ResponseEntity.ok(logRepository.findAllByOrderByTimestampDesc(PageRequest.of(page, size)));
    }
}

