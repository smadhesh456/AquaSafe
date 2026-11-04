package com.aquasafe.repository;

import com.aquasafe.entity.PreprocessingLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PreprocessingLogRepository extends JpaRepository<PreprocessingLog, Long> {
    List<PreprocessingLog> findTop10ByOrderByTimestampDesc();
    Page<PreprocessingLog> findAllByOrderByTimestampDesc(Pageable pageable);
    Optional<PreprocessingLog> findTopByOrderByTimestampDesc();
}

