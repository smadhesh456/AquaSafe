package com.aquasafe.service;

import com.aquasafe.dto.DatasetUploadResponseDTO;
import com.aquasafe.entity.*;
import com.aquasafe.repository.*;
import com.opencsv.CSVReader;
import com.opencsv.CSVReaderBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.util.*;

@Service
public class DatasetImportService {

    private static final Logger log = LoggerFactory.getLogger(DatasetImportService.class);

    private final WaterQualityRepository waterQualityRepository;
    private final WeatherDataRepository weatherDataRepository;
    private final DiseaseRecordRepository diseaseRecordRepository;
    private final PopulationDataRepository populationDataRepository;
    private final DistrictRepository districtRepository;
    private final DataSourceRepository dataSourceRepository;
    private final SanitationDataRepository sanitationDataRepository;
    private final DatasetImportRepository importRepository;

    public DatasetImportService(
            WaterQualityRepository waterQualityRepository,
            WeatherDataRepository weatherDataRepository,
            DiseaseRecordRepository diseaseRecordRepository,
            PopulationDataRepository populationDataRepository,
            DistrictRepository districtRepository,
            DataSourceRepository dataSourceRepository,
            SanitationDataRepository sanitationDataRepository,
            DatasetImportRepository importRepository) {
        this.waterQualityRepository = waterQualityRepository;
        this.weatherDataRepository = weatherDataRepository;
        this.diseaseRecordRepository = diseaseRecordRepository;
        this.populationDataRepository = populationDataRepository;
        this.districtRepository = districtRepository;
        this.dataSourceRepository = dataSourceRepository;
        this.sanitationDataRepository = sanitationDataRepository;
        this.importRepository = importRepository;
    }

    @Transactional
    public DatasetUploadResponseDTO processCsvUpload(MultipartFile file, String datasetType) throws Exception {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("The uploaded file is empty.");
        }
        return processCsvStream(file.getInputStream(), file.getOriginalFilename(), datasetType);
    }

    @Transactional
    public DatasetUploadResponseDTO processCsvFile(File file, String datasetType) throws Exception {
        if (!file.exists() || file.length() == 0) {
            throw new IllegalArgumentException("File not found or empty: " + file.getPath());
        }
        try (InputStream is = new FileInputStream(file)) {
            return processCsvStream(is, file.getName(), datasetType);
        }
    }

    @Transactional
    public DatasetUploadResponseDTO processCsvStream(InputStream inputStream, String filename, String datasetType) throws Exception {
        log.info("Processing upload for file: {}, datasetType: {}", filename, datasetType);

        try (Reader reader = new InputStreamReader(inputStream, StandardCharsets.UTF_8);
             CSVReader csvReader = new CSVReaderBuilder(reader).build()) {

            List<String[]> allRows = csvReader.readAll();
            if (allRows.isEmpty()) {
                throw new IllegalArgumentException("CSV file contains no data.");
            }

            List<String[]> dataRows = allRows.subList(1, allRows.size());
            int totalRecords = dataRows.size();
            int validRecords = 0;
            int invalidRecords = 0;
            int duplicateRecords = 0;
            int missingValues = 0;

            List<Map<String, String>> previewRows = new ArrayList<>();
            Set<String> seenKeys = new HashSet<>();

            if ("districts".equalsIgnoreCase(datasetType)) {
                List<District> entities = new ArrayList<>();
                for (String[] row : dataRows) {
                    if (row.length < 4) { invalidRecords++; continue; }
                    if (hasMissingValues(row)) missingValues++;
                    try {
                        String name = row[0].trim();
                        String state = row[1].trim();
                        Double lat = Double.parseDouble(row[2].trim());
                        Double lon = Double.parseDouble(row[3].trim());
                        String gid = row.length > 4 ? row[4].trim() : "TN-DIST";
                        String hq = row.length > 5 ? row[5].trim() : name;
                        String zone = row.length > 6 ? row[6].trim() : "Central";

                        if (districtRepository.existsByNameIgnoreCase(name) || seenKeys.contains(name.toLowerCase())) {
                            duplicateRecords++;
                            continue;
                        }
                        seenKeys.add(name.toLowerCase());
                        entities.add(new District(name, state, lat, lon, gid, hq, zone));
                        validRecords++;
                    } catch (Exception e) { invalidRecords++; }
                }
                districtRepository.saveAll(entities);

            } else if ("data_sources".equalsIgnoreCase(datasetType)) {
                List<DataSourceEntity> entities = new ArrayList<>();
                for (String[] row : dataRows) {
                    if (row.length < 3) { invalidRecords++; continue; }
                    try {
                        String sName = row[0].trim();
                        String sUrl = row.length > 1 ? row[1].trim() : "";
                        String cat = row.length > 2 ? row[2].trim() : "GENERAL";
                        String status = row.length > 3 ? row[3].trim() : "STORED";
                        String year = row.length > 4 ? row[4].trim() : "2024-2025";
                        String desc = row.length > 5 ? row[5].trim() : "";
                        entities.add(new DataSourceEntity(sName, sUrl, cat, status, year, desc));
                        validRecords++;
                    } catch (Exception e) { invalidRecords++; }
                }
                dataSourceRepository.saveAll(entities);

            } else if ("sanitation_data".equalsIgnoreCase(datasetType)) {
                List<SanitationData> entities = new ArrayList<>();
                for (String[] row : dataRows) {
                    if (row.length < 4) { invalidRecords++; continue; }
                    try {
                        String dist = row[0].trim();
                        String state = row[1].trim();
                        Double san = Double.parseDouble(row[2].trim());
                        Double water = Double.parseDouble(row[3].trim());
                        Double rural = row.length > 4 && !row[4].isEmpty() ? Double.parseDouble(row[4].trim()) : null;
                        Double urban = row.length > 5 && !row[5].isEmpty() ? Double.parseDouble(row[5].trim()) : null;
                        String year = row.length > 6 ? row[6].trim() : "2019-2021 (NFHS-5)";
                        String src = row.length > 7 ? row[7].trim() : "NFHS-5 & Jal Jeevan Mission";
                        String stat = row.length > 8 ? row[8].trim() : "STORED";

                        if (sanitationDataRepository.existsByDistrictIgnoreCase(dist) || seenKeys.contains(dist.toLowerCase())) {
                            duplicateRecords++;
                            continue;
                        }
                        seenKeys.add(dist.toLowerCase());
                        entities.add(new SanitationData(dist, state, san, water, rural, urban, year, src, stat));
                        validRecords++;
                    } catch (Exception e) { invalidRecords++; }
                }
                sanitationDataRepository.saveAll(entities);

            } else if ("water_quality".equalsIgnoreCase(datasetType)) {
                List<WaterQuality> entities = new ArrayList<>();
                for (String[] row : dataRows) {
                    if (row.length < 8) { invalidRecords++; continue; }
                    if (hasMissingValues(row)) missingValues++;
                    try {
                        String district = row[0].trim();
                        String state = row[1].trim();
                        LocalDate date = LocalDate.parse(row[2].trim());
                        Double ph = Double.parseDouble(row[3].trim());
                        Double turbidity = Double.parseDouble(row[4].trim());
                        Double tds = Double.parseDouble(row[5].trim());
                        Double dissolvedOxygen = Double.parseDouble(row[6].trim());
                        Double waterTemperature = Double.parseDouble(row[7].trim());

                        String key = district.toLowerCase() + "_" + date;
                        if (seenKeys.contains(key)) { duplicateRecords++; continue; }
                        seenKeys.add(key);

                        String src = row.length > 8 ? row[8].trim() : "CPCB & TNPCB Water Quality Monitoring Network";
                        String sUrl = row.length > 9 ? row[9].trim() : "https://cpcb.nic.in/water-quality-data/";
                        String dStat = row.length > 10 ? row[10].trim() : "STORED";
                        String stn = row.length > 11 ? row[11].trim() : null;

                        entities.add(new WaterQuality(district, state, date, ph, turbidity, tds, dissolvedOxygen, waterTemperature, src, sUrl, dStat, stn));
                        validRecords++;

                        if (previewRows.size() < 10) {
                            Map<String, String> p = new LinkedHashMap<>();
                            p.put("district", district);
                            p.put("date", date.toString());
                            p.put("ph", ph.toString());
                            p.put("turbidity", turbidity.toString());
                            p.put("tds", tds.toString());
                            p.put("dissolvedOxygen", dissolvedOxygen.toString());
                            previewRows.add(p);
                        }
                    } catch (Exception ex) { invalidRecords++; }
                }
                waterQualityRepository.saveAll(entities);

            } else if ("weather_data".equalsIgnoreCase(datasetType)) {
                List<WeatherData> entities = new ArrayList<>();
                for (String[] row : dataRows) {
                    if (row.length < 6) { invalidRecords++; continue; }
                    if (hasMissingValues(row)) missingValues++;
                    try {
                        String district = row[0].trim();
                        String state = row[1].trim();
                        LocalDate date = LocalDate.parse(row[2].trim());
                        Double temp = Double.parseDouble(row[3].trim());
                        Double rain = Double.parseDouble(row[4].trim());
                        Double humidity = Double.parseDouble(row[5].trim());

                        String key = district.toLowerCase() + "_" + date;
                        if (seenKeys.contains(key)) { duplicateRecords++; continue; }
                        seenKeys.add(key);

                        Double precip = row.length > 6 && !row[6].isEmpty() ? Double.parseDouble(row[6].trim()) : rain;
                        String cond = row.length > 7 ? row[7].trim() : "Partly Cloudy";
                        String src = row.length > 8 ? row[8].trim() : "Open-Meteo Weather API";
                        String sUrl = row.length > 9 ? row[9].trim() : "https://api.open-meteo.com/v1/forecast";
                        String dStat = row.length > 10 ? row[10].trim() : "STORED";

                        entities.add(new WeatherData(district, state, date, temp, rain, humidity, precip, cond, src, sUrl, dStat));
                        validRecords++;

                        if (previewRows.size() < 10) {
                            Map<String, String> p = new LinkedHashMap<>();
                            p.put("district", district);
                            p.put("date", date.toString());
                            p.put("temperature", temp.toString());
                            p.put("rainfall", rain.toString());
                            p.put("humidity", humidity.toString());
                            previewRows.add(p);
                        }
                    } catch (Exception ex) { invalidRecords++; }
                }
                weatherDataRepository.saveAll(entities);

            } else if ("disease_records".equalsIgnoreCase(datasetType)) {
                List<DiseaseRecord> entities = new ArrayList<>();
                for (String[] row : dataRows) {
                    if (row.length < 7) { invalidRecords++; continue; }
                    if (hasMissingValues(row)) missingValues++;
                    try {
                        String district = row[0].trim();
                        String state = row[1].trim();
                        LocalDate date = LocalDate.parse(row[2].trim());
                        Integer cholera = Integer.parseInt(row[3].trim());
                        Integer typhoid = Integer.parseInt(row[4].trim());
                        Integer diarrhea = Integer.parseInt(row[5].trim());
                        Integer hepatitis = Integer.parseInt(row[6].trim());

                        String key = district.toLowerCase() + "_" + date;
                        if (seenKeys.contains(key)) { duplicateRecords++; continue; }
                        seenKeys.add(key);

                        String period = row.length > 7 ? row[7].trim() : "MONTHLY";
                        String outStat = row.length > 8 ? row[8].trim() : "REPORTED_CASES";
                        String src = row.length > 9 ? row[9].trim() : "IDSP Tamil Nadu & MoHFW";
                        String sUrl = row.length > 10 ? row[10].trim() : "https://idsp.mohfw.gov.in/";
                        String dStat = row.length > 11 ? row[11].trim() : "STORED";

                        entities.add(new DiseaseRecord(district, state, date, cholera, typhoid, diarrhea, hepatitis, period, outStat, src, sUrl, dStat));
                        validRecords++;

                        if (previewRows.size() < 10) {
                            Map<String, String> p = new LinkedHashMap<>();
                            p.put("district", district);
                            p.put("date", date.toString());
                            p.put("cholera", cholera.toString());
                            p.put("typhoid", typhoid.toString());
                            p.put("diarrhea", diarrhea.toString());
                            p.put("hepatitis", hepatitis.toString());
                            previewRows.add(p);
                        }
                    } catch (Exception ex) { invalidRecords++; }
                }
                diseaseRecordRepository.saveAll(entities);

            } else if ("population_data".equalsIgnoreCase(datasetType)) {
                List<PopulationData> entities = new ArrayList<>();
                for (String[] row : dataRows) {
                    if (row.length < 7) { invalidRecords++; continue; }
                    if (hasMissingValues(row)) missingValues++;
                    try {
                        String district = row[0].trim();
                        String state = row[1].trim();
                        Long pop = Long.parseLong(row[2].trim());
                        Integer density = Integer.parseInt(row[3].trim());
                        Double sanitation = Double.parseDouble(row[4].trim());

                        Double cleanWater = 92.0;
                        String refYear = "Census 2011 & NFHS-5 2019-21";
                        String src = "Census of India & NFHS-5";
                        String dStat = "STORED";
                        Double lat;
                        Double lon;

                        if (row.length >= 11) {
                            cleanWater = Double.parseDouble(row[5].trim());
                            refYear = row[6].trim();
                            src = row[7].trim();
                            dStat = row[8].trim();
                            lat = Double.parseDouble(row[9].trim());
                            lon = Double.parseDouble(row[10].trim());
                        } else {
                            lat = Double.parseDouble(row[5].trim());
                            lon = Double.parseDouble(row[6].trim());
                        }

                        if (populationDataRepository.existsByDistrictIgnoreCase(district) || seenKeys.contains(district.toLowerCase())) {
                            duplicateRecords++;
                            continue;
                        }
                        seenKeys.add(district.toLowerCase());

                        entities.add(new PopulationData(district, state, pop, density, sanitation, cleanWater, refYear, src, dStat, lat, lon));
                        validRecords++;

                        if (previewRows.size() < 10) {
                            Map<String, String> p = new LinkedHashMap<>();
                            p.put("district", district);
                            p.put("population", pop.toString());
                            p.put("density", density.toString());
                            p.put("sanitation", sanitation.toString());
                            p.put("lat", lat.toString());
                            p.put("lon", lon.toString());
                            previewRows.add(p);
                        }
                    } catch (Exception ex) { invalidRecords++; }
                }
                populationDataRepository.saveAll(entities);

            } else {
                throw new IllegalArgumentException("Unknown dataset type: " + datasetType + ". Supported: districts, water_quality, weather_data, disease_records, population_data, sanitation_data, data_sources");
            }

            // Save import history log
            DatasetImport importLog = new DatasetImport(
                filename, datasetType, totalRecords, validRecords, invalidRecords, duplicateRecords, missingValues, "COMPLETED"
            );
            importRepository.save(importLog);

            DatasetUploadResponseDTO response = new DatasetUploadResponseDTO();
            response.setFilename(filename);
            response.setDatasetType(datasetType);
            response.setTotalRecords(totalRecords);
            response.setValidRecords(validRecords);
            response.setInvalidRecords(invalidRecords);
            response.setDuplicateRecords(duplicateRecords);
            response.setMissingValues(missingValues);
            response.setStatus("COMPLETED");
            response.setPreviewRows(previewRows);

            return response;
        }
    }

    private boolean hasMissingValues(String[] row) {
        for (String cell : row) {
            if (cell == null || cell.trim().isEmpty() || cell.trim().equalsIgnoreCase("null") || cell.trim().equalsIgnoreCase("na")) {
                return true;
            }
        }
        return false;
    }

    public List<DatasetImport> getRecentImports() {
        return importRepository.findTop10ByOrderByImportTimeDesc();
    }

    public Page<DatasetImport> getAllImports(int page, int size) {
        return importRepository.findAllByOrderByImportTimeDesc(PageRequest.of(page, size));
    }
}
