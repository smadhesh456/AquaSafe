-- AquaSafe: Water-Borne Disease Prediction Using Big Data Analytics
-- Database Schema for MySQL 8.x / MariaDB & H2 Dual-Engine Mode

CREATE DATABASE IF NOT EXISTS aquasafe CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE aquasafe;

-- 1. Districts Master Table (All 38 Districts of Tamil Nadu)
CREATE TABLE IF NOT EXISTS districts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    state VARCHAR(100) NOT NULL DEFAULT 'Tamil Nadu',
    latitude DECIMAL(9, 6) NOT NULL,
    longitude DECIMAL(9, 6) NOT NULL,
    geographic_identifier VARCHAR(50),
    headquarters VARCHAR(100),
    zone VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_district_name (name),
    INDEX idx_district_zone (zone)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Data Sources Registry Table (Transparency & Provenance)
CREATE TABLE IF NOT EXISTS data_sources (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    source_name VARCHAR(150) NOT NULL,
    source_url VARCHAR(500),
    category VARCHAR(50) NOT NULL,
    data_status VARCHAR(20) NOT NULL DEFAULT 'STORED',
    reference_year VARCHAR(50),
    description VARCHAR(1000),
    last_checked TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    record_count BIGINT DEFAULT 0,
    INDEX idx_source_category (category),
    INDEX idx_source_status (data_status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Water Quality Table
CREATE TABLE IF NOT EXISTS water_quality (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    district VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL DEFAULT 'Tamil Nadu',
    date DATE NOT NULL,
    ph DECIMAL(4, 2) NOT NULL,
    turbidity DECIMAL(6, 2) NOT NULL,
    tds DECIMAL(7, 2) NOT NULL,
    dissolved_oxygen DECIMAL(5, 2) NOT NULL,
    water_temperature DECIMAL(5, 2) NOT NULL,
    source_name VARCHAR(150) DEFAULT 'CPCB & TNPCB Water Quality Monitoring Network',
    source_url VARCHAR(500) DEFAULT 'https://cpcb.nic.in/water-quality-data/',
    data_status VARCHAR(20) DEFAULT 'STORED',
    station_name VARCHAR(150),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_wq_district (district),
    INDEX idx_wq_date (date),
    INDEX idx_wq_district_date (district, date),
    INDEX idx_wq_status (data_status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Weather Data Table
CREATE TABLE IF NOT EXISTS weather_data (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    district VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL DEFAULT 'Tamil Nadu',
    date DATE NOT NULL,
    temperature DECIMAL(5, 2) NOT NULL,
    rainfall DECIMAL(6, 2) NOT NULL,
    humidity DECIMAL(5, 2) NOT NULL,
    precipitation DECIMAL(6, 2) DEFAULT 0.0,
    weather_condition VARCHAR(100) DEFAULT 'Partly Cloudy',
    source VARCHAR(50) DEFAULT 'Open-Meteo Weather API',
    source_url VARCHAR(500) DEFAULT 'https://api.open-meteo.com/v1/forecast',
    data_status VARCHAR(20) DEFAULT 'STORED',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_weather_district (district),
    INDEX idx_weather_date (date),
    INDEX idx_weather_district_date (district, date),
    INDEX idx_weather_status (data_status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. Disease Records Table
CREATE TABLE IF NOT EXISTS disease_records (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    district VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL DEFAULT 'Tamil Nadu',
    date DATE NOT NULL,
    cholera_cases INT NOT NULL DEFAULT 0,
    typhoid_cases INT NOT NULL DEFAULT 0,
    diarrhea_cases INT NOT NULL DEFAULT 0,
    hepatitis_cases INT NOT NULL DEFAULT 0,
    reporting_period VARCHAR(50) DEFAULT 'MONTHLY',
    outbreak_status VARCHAR(50) DEFAULT 'REPORTED_CASES',
    source_name VARCHAR(150) DEFAULT 'IDSP Tamil Nadu & MoHFW',
    source_url VARCHAR(500) DEFAULT 'https://idsp.mohfw.gov.in/',
    data_status VARCHAR(20) DEFAULT 'STORED',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_disease_district (district),
    INDEX idx_disease_date (date),
    INDEX idx_disease_district_date (district, date),
    INDEX idx_disease_status (data_status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. Population & Demographics Table
CREATE TABLE IF NOT EXISTS population_data (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    district VARCHAR(100) NOT NULL UNIQUE,
    state VARCHAR(100) NOT NULL DEFAULT 'Tamil Nadu',
    population BIGINT NOT NULL,
    population_density INT NOT NULL,
    sanitation_coverage DECIMAL(5, 2) NOT NULL,
    clean_water_coverage DECIMAL(5, 2) DEFAULT 92.0,
    reference_year VARCHAR(50) DEFAULT 'Census 2011 / NFHS-5 2019-21',
    source_name VARCHAR(150) DEFAULT 'Census of India & NFHS-5',
    data_status VARCHAR(20) DEFAULT 'STORED',
    latitude DECIMAL(9, 6) NOT NULL,
    longitude DECIMAL(9, 6) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_pop_district (district)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 7. Sanitation & Clean Water Indicators Table
CREATE TABLE IF NOT EXISTS sanitation_data (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    district VARCHAR(100) NOT NULL UNIQUE,
    state VARCHAR(100) NOT NULL DEFAULT 'Tamil Nadu',
    sanitation_coverage DECIMAL(5, 2) NOT NULL,
    clean_water_coverage DECIMAL(5, 2) NOT NULL,
    rural_sanitation DECIMAL(5, 2),
    urban_sanitation DECIMAL(5, 2),
    reference_year VARCHAR(50) DEFAULT '2019-2021 (NFHS-5)',
    source_name VARCHAR(150) DEFAULT 'NFHS-5 & Jal Jeevan Mission',
    data_status VARCHAR(20) DEFAULT 'STORED',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_sanitation_district (district)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 8. Data Collection Logs Table (Automated & Manual Ingestion Records)
CREATE TABLE IF NOT EXISTS data_collection_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    category VARCHAR(50) NOT NULL,
    source_name VARCHAR(150),
    status VARCHAR(30) NOT NULL,
    records_collected INT DEFAULT 0,
    missing_records INT DEFAULT 0,
    error_message VARCHAR(1000),
    trigger_type VARCHAR(50) DEFAULT 'SCHEDULED',
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_coll_category (category),
    INDEX idx_coll_status (status),
    INDEX idx_coll_timestamp (timestamp)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 9. Preprocessing & Validation Logs Table
CREATE TABLE IF NOT EXISTS preprocessing_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    pipeline_name VARCHAR(150) NOT NULL,
    records_input INT DEFAULT 0,
    records_cleaned INT DEFAULT 0,
    missing_imputed INT DEFAULT 0,
    duplicates_removed INT DEFAULT 0,
    invalid_filtered INT DEFAULT 0,
    outliers_detected INT DEFAULT 0,
    status VARCHAR(30) NOT NULL DEFAULT 'SUCCESS',
    report_details TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_prep_status (status),
    INDEX idx_prep_timestamp (timestamp)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 10. Prediction Results Table (Machine Learning Inferences)
CREATE TABLE IF NOT EXISTS prediction_results (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    district VARCHAR(100) NOT NULL,
    prediction_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    risk_level VARCHAR(20) NOT NULL,
    probability DECIMAL(5, 4) NOT NULL,
    model_version VARCHAR(50) NOT NULL,
    ph DECIMAL(4, 2),
    turbidity DECIMAL(6, 2),
    tds DECIMAL(7, 2),
    dissolved_oxygen DECIMAL(5, 2),
    water_temperature DECIMAL(5, 2),
    temperature DECIMAL(5, 2),
    rainfall DECIMAL(6, 2),
    precipitation DECIMAL(6, 2),
    humidity DECIMAL(5, 2),
    previous_disease_cases INT,
    population_density INT,
    sanitation_coverage DECIMAL(5, 2),
    clean_water_coverage DECIMAL(5, 2),
    data_status VARCHAR(20) DEFAULT 'STORED',
    feature_contributions TEXT,
    INDEX idx_pred_district (district),
    INDEX idx_pred_date (prediction_date),
    INDEX idx_pred_risk (risk_level)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 11. Alerts Table
CREATE TABLE IF NOT EXISTS alerts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    district VARCHAR(100) NOT NULL,
    risk_level VARCHAR(20) NOT NULL,
    probability DECIMAL(5, 4) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) NOT NULL DEFAULT 'UNREAD',
    INDEX idx_alerts_district (district),
    INDEX idx_alerts_status (status),
    INDEX idx_alerts_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 12. Users Table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'USER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_users_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 13. Dataset Imports Table
CREATE TABLE IF NOT EXISTS dataset_imports (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    filename VARCHAR(255) NOT NULL,
    dataset_type VARCHAR(50) NOT NULL,
    total_records INT NOT NULL,
    valid_records INT NOT NULL,
    invalid_records INT NOT NULL,
    duplicate_records INT NOT NULL,
    missing_values INT NOT NULL,
    status VARCHAR(50) NOT NULL,
    import_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Default Users (Password: admin123, user123 hashed via BCrypt)
INSERT INTO users (username, password, role) VALUES 
('admin', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVKIUi', 'ADMIN'),
('analyst', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVKIUi', 'USER')
ON DUPLICATE KEY UPDATE role=VALUES(role);
