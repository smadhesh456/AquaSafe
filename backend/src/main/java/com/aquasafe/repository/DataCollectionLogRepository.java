package com.aquasafe.repository;

import com.aquasafe.entity.DataCollectionLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DataCollectionLogRepository extends JpaRepository<DataCollectionLog, Long> {
    List<DataCollectionLog> findTop20ByOrderByTimestampDesc();
    Page<DataCollectionLog> findAllByOrderByTimestampDesc(Pageable pageable);
    Optional<DataCollectionLog> findTopByCategoryOrderByTimestampDesc(String category);
}

