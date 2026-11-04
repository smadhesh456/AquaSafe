package com.aquasafe.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "disease_records", indexes = {
    @Index(name = "idx_disease_district", columnList = "district"),
    @Index(name = "idx_disease_date", columnList = "date"),
    @Index(name = "idx_disease_district_date", columnList = "district, date"),
    @Index(name = "idx_disease_status", columnList = "data_status")
})
public class DiseaseRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String district;

    @Column(nullable = false, length = 100)
    private String state = "Tamil Nadu";

    @Column(nullable = false)
    private LocalDate date;

    @Column(name = "cholera_cases", nullable = false)
    private Integer choleraCases = 0;

    @Column(name = "typhoid_cases", nullable = false)
    private Integer typhoidCases = 0;

    @Column(name = "diarrhea_cases", nullable = false)
    private Integer diarrheaCases = 0;

    @Column(name = "hepatitis_cases", nullable = false)
    private Integer hepatitisCases = 0;

    @Column(name = "reporting_period", length = 50)
    private String reportingPeriod = "MONTHLY";

    @Column(name = "outbreak_status", length = 50)
    private String outbreakStatus = "REPORTED_CASES"; // REPORTED_CASES, CONFIRMED_OUTBREAK, NONE

    @Column(name = "source_name", length = 150)
    private String sourceName = "IDSP Tamil Nadu & MoHFW";

    @Column(name = "source_url", length = 500)
    private String sourceUrl = "https://idsp.mohfw.gov.in/";

    @Column(name = "data_status", length = 20)
    private String dataStatus = "STORED"; // STORED, DEMO

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public DiseaseRecord() {}

    public DiseaseRecord(String district, String state, LocalDate date, Integer choleraCases, Integer typhoidCases, Integer diarrheaCases, Integer hepatitisCases) {
        this(district, state, date, choleraCases, typhoidCases, diarrheaCases, hepatitisCases, "MONTHLY", "REPORTED_CASES", "IDSP Tamil Nadu & MoHFW", "https://idsp.mohfw.gov.in/", "STORED");
    }

    public DiseaseRecord(String district, String state, LocalDate date, Integer choleraCases, Integer typhoidCases, Integer diarrheaCases, Integer hepatitisCases, String reportingPeriod, String outbreakStatus, String sourceName, String sourceUrl, String dataStatus) {
        this.district = district;
        this.state = state != null ? state : "Tamil Nadu";
        this.date = date;
        this.choleraCases = choleraCases != null ? choleraCases : 0;
        this.typhoidCases = typhoidCases != null ? typhoidCases : 0;
        this.diarrheaCases = diarrheaCases != null ? diarrheaCases : 0;
        this.hepatitisCases = hepatitisCases != null ? hepatitisCases : 0;
        this.reportingPeriod = reportingPeriod != null ? reportingPeriod : "MONTHLY";
        this.outbreakStatus = outbreakStatus != null ? outbreakStatus : "REPORTED_CASES";
        this.sourceName = sourceName != null ? sourceName : "IDSP Tamil Nadu & MoHFW";
        this.sourceUrl = sourceUrl != null ? sourceUrl : "https://idsp.mohfw.gov.in/";
        this.dataStatus = dataStatus != null ? dataStatus : "STORED";
        this.createdAt = LocalDateTime.now();
    }

    public Integer getTotalCases() {
        return (choleraCases != null ? choleraCases : 0) +
               (typhoidCases != null ? typhoidCases : 0) +
               (diarrheaCases != null ? diarrheaCases : 0) +
               (hepatitisCases != null ? hepatitisCases : 0);
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getDistrict() { return district; }
    public void setDistrict(String district) { this.district = district; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public Integer getCholeraCases() { return choleraCases; }
    public void setCholeraCases(Integer choleraCases) { this.choleraCases = choleraCases; }

    public Integer getTyphoidCases() { return typhoidCases; }
    public void setTyphoidCases(Integer typhoidCases) { this.typhoidCases = typhoidCases; }

    public Integer getDiarrheaCases() { return diarrheaCases; }
    public void setDiarrheaCases(Integer diarrheaCases) { this.diarrheaCases = diarrheaCases; }

    public Integer getHepatitisCases() { return hepatitisCases; }
    public void setHepatitisCases(Integer hepatitisCases) { this.hepatitisCases = hepatitisCases; }

    public String getReportingPeriod() { return reportingPeriod; }
    public void setReportingPeriod(String reportingPeriod) { this.reportingPeriod = reportingPeriod; }

    public String getOutbreakStatus() { return outbreakStatus; }
    public void setOutbreakStatus(String outbreakStatus) { this.outbreakStatus = outbreakStatus; }

    public String getSourceName() { return sourceName; }
    public void setSourceName(String sourceName) { this.sourceName = sourceName; }

    public String getSourceUrl() { return sourceUrl; }
    public void setSourceUrl(String sourceUrl) { this.sourceUrl = sourceUrl; }

    public String getDataStatus() { return dataStatus; }
    public void setDataStatus(String dataStatus) { this.dataStatus = dataStatus; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
