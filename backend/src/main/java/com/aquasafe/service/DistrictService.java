package com.aquasafe.service;

import com.aquasafe.entity.District;
import com.aquasafe.repository.DistrictRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DistrictService {

    private final DistrictRepository districtRepository;

    public DistrictService(DistrictRepository districtRepository) {
        this.districtRepository = districtRepository;
    }

    public List<District> getAllDistricts() {
        return districtRepository.findAllByOrderByNameAsc();
    }

    public Optional<District> getDistrictByName(String name) {
        return districtRepository.findByNameIgnoreCase(name);
    }

    public List<District> getDistrictsByZone(String zone) {
        return districtRepository.findByZoneIgnoreCase(zone);
    }

    public long count() {
        return districtRepository.count();
    }
}

