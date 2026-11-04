package com.aquasafe.controller;

import com.aquasafe.entity.DataSourceEntity;
import com.aquasafe.repository.DataSourceRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/data-sources")
public class DataSourceController {

    private final DataSourceRepository dataSourceRepository;

    public DataSourceController(DataSourceRepository dataSourceRepository) {
        this.dataSourceRepository = dataSourceRepository;
    }

    @GetMapping
    public ResponseEntity<List<DataSourceEntity>> getAllDataSources() {
        return ResponseEntity.ok(dataSourceRepository.findAll());
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<DataSourceEntity>> getByCategory(@PathVariable String category) {
        return ResponseEntity.ok(dataSourceRepository.findByCategoryIgnoreCase(category));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<DataSourceEntity>> getByStatus(@PathVariable String status) {
        return ResponseEntity.ok(dataSourceRepository.findByDataStatusIgnoreCase(status));
    }
}

