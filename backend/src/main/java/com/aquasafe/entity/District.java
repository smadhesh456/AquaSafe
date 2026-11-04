package com.aquasafe.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "districts", indexes = {
    @Index(name = "idx_district_name", columnList = "name"),
    @Index(name = "idx_district_zone", columnList = "zone")
})
public class District {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String name;

    @Column(nullable = false, length = 100)
    private String state = "Tamil Nadu";

    @Column(nullable = false)
    private Double latitude;

    @Column(nullable = false)
    private Double longitude;

    @Column(name = "geographic_identifier", length = 50)
    private String geographicIdentifier;

    @Column(length = 100)
    private String headquarters;

    @Column(length = 50)
    private String zone;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public District() {}

    public District(String name, String state, Double latitude, Double longitude, String geographicIdentifier, String headquarters, String zone) {
        this.name = name;
        this.state = state != null ? state : "Tamil Nadu";
        this.latitude = latitude;
        this.longitude = longitude;
        this.geographicIdentifier = geographicIdentifier;
        this.headquarters = headquarters;
        this.zone = zone;
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }

    public String getGeographicIdentifier() { return geographicIdentifier; }
    public void setGeographicIdentifier(String geographicIdentifier) { this.geographicIdentifier = geographicIdentifier; }

    public String getHeadquarters() { return headquarters; }
    public void setHeadquarters(String headquarters) { this.headquarters = headquarters; }

    public String getZone() { return zone; }
    public void setZone(String zone) { this.zone = zone; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}

