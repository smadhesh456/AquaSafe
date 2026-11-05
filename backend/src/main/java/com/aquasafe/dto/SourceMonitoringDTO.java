package com.aquasafe.dto;

public class SourceMonitoringDTO {

    private String sourceName;
    private String category;
    private String portalUrl;
    private String connectionStatus; // ONLINE, ACCESSIBLE, OFFLINE
    private boolean apiAvailable;
    private String lastSuccessfulCollection;
    private long recordsRetrieved;
    private long collectionErrors;
    private boolean requiresApiKey;
    private String notes;

    public SourceMonitoringDTO() {}

    public SourceMonitoringDTO(String sourceName, String category, String portalUrl, String connectionStatus,
                               boolean apiAvailable, String lastSuccessfulCollection, long recordsRetrieved,
                               long collectionErrors, boolean requiresApiKey, String notes) {
        this.sourceName = sourceName;
        this.category = category;
        this.portalUrl = portalUrl;
        this.connectionStatus = connectionStatus;
        this.apiAvailable = apiAvailable;
        this.lastSuccessfulCollection = lastSuccessfulCollection;
        this.recordsRetrieved = recordsRetrieved;
        this.collectionErrors = collectionErrors;
        this.requiresApiKey = requiresApiKey;
        this.notes = notes;
    }

    public String getSourceName() { return sourceName; }
    public void setSourceName(String sourceName) { this.sourceName = sourceName; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getPortalUrl() { return portalUrl; }
    public void setPortalUrl(String portalUrl) { this.portalUrl = portalUrl; }

    public String getConnectionStatus() { return connectionStatus; }
    public void setConnectionStatus(String connectionStatus) { this.connectionStatus = connectionStatus; }

    public boolean isApiAvailable() { return apiAvailable; }
    public void setApiAvailable(boolean apiAvailable) { this.apiAvailable = apiAvailable; }

    public String getLastSuccessfulCollection() { return lastSuccessfulCollection; }
    public void setLastSuccessfulCollection(String lastSuccessfulCollection) { this.lastSuccessfulCollection = lastSuccessfulCollection; }

    public long getRecordsRetrieved() { return recordsRetrieved; }
    public void setRecordsRetrieved(long recordsRetrieved) { this.recordsRetrieved = recordsRetrieved; }

    public long getCollectionErrors() { return collectionErrors; }
    public void setCollectionErrors(long collectionErrors) { this.collectionErrors = collectionErrors; }

    public boolean isRequiresApiKey() { return requiresApiKey; }
    public void setRequiresApiKey(boolean requiresApiKey) { this.requiresApiKey = requiresApiKey; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}

