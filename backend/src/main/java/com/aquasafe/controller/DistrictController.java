package com.aquasafe.controller;

import com.aquasafe.entity.District;
import com.aquasafe.service.DistrictService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/districts")
public class DistrictController {

    private final DistrictService districtService;

    public DistrictController(DistrictService districtService) {
        this.districtService = districtService;
    }

    @GetMapping
    public ResponseEntity<List<District>> getAllDistricts() {
        return ResponseEntity.ok(districtService.getAllDistricts());
    }

    @GetMapping("/{name}")
    public ResponseEntity<District> getDistrictByName(@PathVariable String name) {
        return districtService.getDistrictByName(name)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/zone/{zone}")
    public ResponseEntity<List<District>> getDistrictsByZone(@PathVariable String zone) {
        return ResponseEntity.ok(districtService.getDistrictsByZone(zone));
    }
}

