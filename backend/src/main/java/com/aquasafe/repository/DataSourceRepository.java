package com.aquasafe.repository;

import com.aquasafe.entity.DataSourceEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DataSourceRepository extends JpaRepository<DataSourceEntity, Long> {
    Optional<DataSourceEntity> findBySourceNameIgnoreCase(String sourceName);
    List<DataSourceEntity> findByCategoryIgnoreCase(String category);
    List<DataSourceEntity> findByDataStatusIgnoreCase(String dataStatus);
}

