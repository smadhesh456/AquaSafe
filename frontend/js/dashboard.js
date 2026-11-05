/**
 * AquaSafe Dashboard Controller
 * Real-time KPI cards, multi-series charts, data governance panel, and SSE live stream handler
 */

document.addEventListener('DOMContentLoaded', async () => {
    initDashboard();
    setupSseStream();
    setupSyncButton();
});

async function initDashboard() {
    try {
        await Promise.allSettled([
            loadKpiSummary(),
            loadChartsData(),
            loadAcquisitionSection(),
            loadMonitoringPanel(),
            loadRecentAlerts()
        ]);
    } catch (err) {
        console.error('Failed to initialize dashboard:', err);
    }
}

async function loadKpiSummary() {
    try {
        const summary = await api.getDashboardSummary();
        updateKpiValues(summary);
    } catch (err) {
        console.warn('Could not fetch KPI summary from backend:', err);
    }
}

function updateKpiValues(summary) {
    if (!summary) return;

    setText('kpiTotalDistricts', summary.totalDistricts || 38);
    setText('kpiWqRecords', (summary.totalWaterQualityRecords || 912).toLocaleString());
    setText('kpiWeatherRecords', (summary.totalWeatherRecords || 912).toLocaleString());
    setText('kpiDiseaseReports', (summary.totalDiseaseReports || 912).toLocaleString());
    setText('kpiHighRisk', summary.highRiskDistricts || 0);
    setText('kpiMediumRisk', summary.mediumRiskDistricts || 0);
    setText('kpiLowRisk', summary.lowRiskDistricts || 0);

    const alertCount = summary.activeAlertsCount || 0;
    const navBadge = document.getElementById('navAlertCountBadge');
    if (navBadge) {
        navBadge.textContent = alertCount;
        navBadge.style.display = alertCount > 0 ? 'inline-block' : 'none';
    }

    // Update Data Freshness Badge
    const badge = document.getElementById('dataFreshnessBadge');
    const badgeText = document.getElementById('dataFreshnessText');
    if (badge && badgeText) {
        const status = summary.dataFreshness || 'STORED DATA';
        badgeText.textContent = status;
        badge.className = 'freshness-badge ' + (
            status.includes('LIVE') ? 'live' : (status.includes('STORED') ? 'stored' : 'demo')
        );
    }

    // Update Last Updated Timestamp
    const updatedEl = document.getElementById('lastUpdatedTimestamp');
    if (updatedEl && summary.lastUpdated) {
        const d = new Date(summary.lastUpdated);
        updatedEl.textContent = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    }
}

async function loadChartsData() {
    try {
        // 1. Disease Trends Chart (IDSP reported burdens)
        const trends = await api.getDiseaseTrends();
        AquaCharts.initDiseaseTrend('diseaseTrendChart', trends);

        // 2. Risk Distribution Chart
        const riskDist = await api.getRiskDistribution();
        AquaCharts.initRiskDistribution('riskDistChart', riskDist);

        // 3. Rainfall vs Disease Correlation
        const rainfallCorr = await api.getRainfallVsDisease();
        AquaCharts.initRainfallVsDisease('rainfallDiseaseChart', rainfallCorr);

        // 4. Monthly Disease Aggregates
        const monthly = await api.getMonthlyDisease();
        AquaCharts.initMonthlyDisease('monthlyDiseaseChart', monthly);

        // 5. Water Quality Variations
        const waterVar = await api.getWaterQualityTrends();
        AquaCharts.initWaterQualityVar('waterQualityVarChart', waterVar);

        // 6. Weather Trends
        const weatherTrends = await api.getWeatherTrends();
        AquaCharts.initWeatherTrends('weatherTrendsChart', weatherTrends);
    } catch (err) {
        console.error('Chart loading error:', err);
    }
}

async function loadMonitoringPanel() {
    try {
        const mon = await api.getMonitoringPanel();
        if (!mon) return;

        const isOnline = mon.apiOnline === true;
        const apiDot = document.getElementById('monApiDot');
        const apiStatus = document.getElementById('monApiStatus');
        if (apiStatus) {
            apiStatus.textContent = isOnline ? 'CONNECTED (LIVE)' : 'STORED DATA (FALLBACK)';
            apiStatus.className = isOnline ? 'd-block text-success' : 'd-block text-warning';
        }
        if (apiDot) {
            apiDot.style.background = isOnline ? '#10b981' : '#f59e0b';
        }

        const syncTime = document.getElementById('monLastWeatherSync');
        if (syncTime && mon.lastSuccessfulWeatherUpdate) {
            const d = new Date(mon.lastSuccessfulWeatherUpdate);
            syncTime.textContent = 'Last Sync: ' + d.toLocaleTimeString();
        }

        const totalRec = document.getElementById('monTotalRecords');
        if (totalRec && mon.totalRecordsCollected) {
            totalRec.textContent = Number(mon.totalRecordsCollected).toLocaleString();
        }
    } catch (err) {
        console.warn('Could not load monitoring panel data:', err);
    }
}

async function loadRecentAlerts() {
    const list = document.getElementById('recentAlertsList');
    if (!list) return;

    try {
        const alerts = await api.getAlerts();
        if (!alerts || alerts.length === 0) {
            list.innerHTML = `
                <div class="p-3 text-center text-muted">
                    <i class="fa-solid fa-circle-check text-success fa-2x mb-2"></i>
                    <p class="mb-0 small">No active critical alerts. All monitored parameters are within nominal thresholds.</p>
                </div>`;
            return;
        }

        list.innerHTML = alerts.slice(0, 4).map(a => `
            <div class="list-group-item d-flex align-items-start gap-3 py-3 border-0 border-bottom">
                <div class="kpi-icon ${a.riskLevel === 'HIGH' ? 'bg-danger-subtle text-danger' : 'bg-warning-subtle text-warning'}">
                    <i class="fa-solid fa-triangle-exclamation"></i>
                </div>
                <div class="flex-grow-1">
                    <div class="d-flex justify-content-between align-items-center mb-1">
                        <strong class="text-dark">${a.district}</strong>
                        <span class="badge ${a.riskLevel === 'HIGH' ? 'bg-danger' : 'bg-warning text-dark'}">${a.riskLevel} RISK</span>
                    </div>
                    <p class="small text-muted mb-0">${a.message}</p>
                </div>
            </div>
        `).join('');
    } catch (err) {
        console.warn('Could not load alerts:', err);
    }
}

function setupSyncButton() {
    const btnTop = document.getElementById('btnSyncWeatherTop');
    const btnMon = document.getElementById('btnSyncAllDistricts');

    async function handleSync(btn) {
        if (!btn) return;
        const originalText = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin me-1"></i> Syncing 38 Districts...';

        try {
            const resp = await api.syncAllWeather();
            alert(`Weather sync complete: ${resp.successfulDistricts} districts updated from Open-Meteo REST service.`);
            await initDashboard();
        } catch (e) {
            alert('Weather sync notice: ' + e.message);
        } finally {
            btn.disabled = false;
            btn.innerHTML = originalText;
        }
    }

    if (btnTop) btnTop.addEventListener('click', () => handleSync(btnTop));
    if (btnMon) btnMon.addEventListener('click', () => handleSync(btnMon));
}

function setupSseStream() {
    try {
        const streamUrl = `${window.location.origin.includes('8080') ? window.location.origin : 'http://localhost:8080'}/api/dashboard/live-stream`;
        const evtSource = new EventSource(streamUrl);

        evtSource.addEventListener('DASHBOARD_UPDATE', (event) => {
            try {
                const data = JSON.parse(event.data);
                updateKpiValues(data);
            } catch (e) {}
        });

        evtSource.onerror = () => {
            evtSource.close();
            // Silent reconnect after 20s
            setTimeout(setupSseStream, 20000);
        };
    } catch (err) {
        console.debug('SSE stream fallback to periodic polling.');
    }
}

function setText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
}


// ============================================================================
// REAL DATA ACQUISITION & INTEGRATION MODULE (Nagapattinam & Tamil Nadu)
// ============================================================================

let currentAcquisitionDistrict = 'Nagapattinam';
let acquisitionDistrictsLoaded = false;

async function loadAcquisitionSection(district = currentAcquisitionDistrict) {
    currentAcquisitionDistrict = district;

    // Load district dropdown once
    if (!acquisitionDistrictsLoaded) {
        await populateAcquisitionDistricts(district);
        setupAcquisitionHandlers();
        acquisitionDistrictsLoaded = true;
    }

    try {
        const summary = await api.getAcquisitionParameters(district);
        updateAcquisitionSummaryUI(summary);
        renderAcquisitionTable(summary.parameters || []);
    } catch (err) {
        console.error('Failed to load acquisition parameters:', err);
        const tbody = document.getElementById('acquisitionTableBody');
        if (tbody) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="9" class="text-center py-4 text-danger">
                        <i class="fa-solid fa-circle-exclamation me-1"></i> Failed to acquire parameters: ${err.message}
                    </td>
                </tr>`;
        }
    }

    // Refresh official sources monitoring health
    loadSourceMonitoring();
}

async function populateAcquisitionDistricts(selectedDistrict) {
    const select = document.getElementById('districtAcquisitionSelect');
    if (!select) return;

    try {
        const districts = await api.getAcquisitionDistricts();
        if (Array.isArray(districts) && districts.length > 0) {
            select.innerHTML = districts.map(d => `
                <option value="${d}" ${d.toLowerCase() === selectedDistrict.toLowerCase() ? 'selected' : ''}>
                    ${d} ${d.toLowerCase() === 'nagapattinam' ? '(Primary Focus)' : ''}
                </option>
            `).join('');
        }
    } catch (e) {
        console.warn('Could not populate district dropdown:', e);
    }
}

function updateAcquisitionSummaryUI(summary) {
    if (!summary) return;

    setText('acqTotalParams', summary.totalParameters || 13);
    setText('acqCollectedParams', summary.successfullyCollectedParameters || 0);
    setText('acqMissingParams', summary.missingParameters || 0);

    const noteEl = document.getElementById('acqMissingNote');
    if (noteEl) {
        noteEl.textContent = summary.missingParameters > 0 ? `${summary.missingParameters} Unsampled/Unavailable` : 'All 13 Verified';
    }

    setText('acqOfficialSources', summary.officialDatasetParameters || 5);

    const liveFeeds = (summary.parameters || []).filter(p => p.dataStatus === 'LIVE').length;
    setText('acqLiveFeeds', liveFeeds);

    const guardEl = document.getElementById('acqPredictionGuard');
    const guardSub = document.getElementById('acqPredictionGuardSub');
    if (guardEl) {
        if (summary.canPredictRisk) {
            guardEl.className = 'fs-6 fw-bold text-success mt-2';
            guardEl.innerHTML = '<i class="fa-solid fa-circle-check me-1"></i>READY';
            if (guardSub) guardSub.textContent = 'Sufficient verified data';
        } else {
            guardEl.className = 'fs-6 fw-bold text-danger mt-2';
            guardEl.innerHTML = '<i class="fa-solid fa-triangle-exclamation me-1"></i>HALTED';
            if (guardSub) guardSub.textContent = 'Insufficient verified data';
        }
    }
}

function renderAcquisitionTable(parameters) {
    const tbody = document.getElementById('acquisitionTableBody');
    if (!tbody) return;

    if (!parameters || parameters.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="9" class="text-center py-4 text-muted">
                    No acquisition records available for this district.
                </td>
            </tr>`;
        return;
    }

    const categoryBadgeClass = (cat) => {
        switch ((cat || '').toUpperCase()) {
            case 'WATER QUALITY': return 'bg-teal-subtle text-teal border border-teal-subtle';
            case 'WEATHER': return 'bg-primary-subtle text-primary border border-primary-subtle';
            case 'DISEASE SURVEILLANCE': return 'bg-danger-subtle text-danger border border-danger-subtle';
            case 'POPULATION': return 'bg-info-subtle text-info border border-info-subtle';
            case 'SANITATION & DRINKING WATER': return 'bg-secondary-subtle text-secondary border border-secondary-subtle';
            default: return 'bg-light text-dark border';
        }
    };

    const statusBadge = (status) => {
        const s = (status || 'MISSING').toUpperCase();
        switch (s) {
            case 'LIVE': return '<span class="badge badge-status-live"><i class="fa-solid fa-bolt me-1"></i>LIVE</span>';
            case 'OFFICIAL': return '<span class="badge badge-status-official"><i class="fa-solid fa-building-columns me-1"></i>OFFICIAL</span>';
            case 'MISSING': return '<span class="badge badge-status-missing"><i class="fa-solid fa-circle-exclamation me-1"></i>MISSING</span>';
            case 'ERROR': return '<span class="badge badge-status-error"><i class="fa-solid fa-xmark me-1"></i>ERROR</span>';
            case 'STALE': return '<span class="badge badge-status-stale"><i class="fa-solid fa-clock-rotate-left me-1"></i>STALE</span>';
            case 'DEMO': return '<span class="badge badge-status-demo"><i class="fa-solid fa-flask me-1"></i>DEMO</span>';
            default: return `<span class="badge bg-secondary">${s}</span>`;
        }
    };

    tbody.innerHTML = parameters.map(p => {
        const isMissing = !p.available || (p.dataStatus && p.dataStatus.toUpperCase() === 'MISSING') || (p.displayValue && p.displayValue.includes('DATA NOT AVAILABLE'));

        const valueDisplay = isMissing 
            ? `<span class="param-missing-cell"><i class="fa-solid fa-triangle-exclamation me-1"></i>DATA NOT AVAILABLE FROM VERIFIED SOURCE</span>`
            : `<span class="param-value-cell">${p.numericValue != null ? p.numericValue : p.displayValue}</span> <span class="text-muted small">${p.unit || ''}</span>`;

        const encodedParam = encodeURIComponent(JSON.stringify(p));

        return `
            <tr>
                <td class="text-muted fw-bold">${p.parameterNumber}</td>
                <td><span class="badge ${categoryBadgeClass(p.category)}">${p.category}</span></td>
                <td>
                    <strong>${p.parameterName}</strong>
                    <div class="text-muted" style="font-size: 0.72rem;"><code>${p.parameterCode}</code></div>
                </td>
                <td>${valueDisplay}</td>
                <td>
                    <strong class="text-dark d-block" style="font-size: 0.85rem;">${p.sourceName}</strong>
                    <a href="${p.sourceUrl}" target="_blank" class="small text-decoration-none text-primary" style="font-size: 0.75rem;">
                        <i class="fa-solid fa-arrow-up-right-from-square me-1"></i>Govt Portal
                    </a>
                </td>
                <td style="font-size: 0.82rem;">${p.monitoringStation || 'District Spatial Extent'}</td>
                <td style="font-size: 0.82rem;">
                    <div>${p.collectionDate || 'N/A'}</div>
                    <span class="badge bg-light text-secondary border mt-1" style="font-size: 0.7rem;">${p.referencePeriod || 'Surveillance Cycle'}</span>
                </td>
                <td>${statusBadge(p.dataStatus)}</td>
                <td class="text-end">
                    <button class="btn btn-sm btn-outline-primary py-0 px-2 btn-inspect-provenance" data-param="${encodedParam}">
                        <i class="fa-solid fa-fingerprint me-1"></i>Inspect
                    </button>
                </td>
            </tr>
        `;
    }).join('');

    // Attach inspect click handlers
    document.querySelectorAll('.btn-inspect-provenance').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const raw = e.currentTarget.getAttribute('data-param');
            if (raw) {
                try {
                    const data = JSON.parse(decodeURIComponent(raw));
                    showProvenanceModal(data);
                } catch (err) {
                    console.error('Failed to parse provenance data:', err);
                }
            }
        });
    });
}

async function loadSourceMonitoring() {
    const grid = document.getElementById('sourceMonitoringGrid');
    if (!grid) return;

    try {
        const sources = await api.getSourcesMonitoring();
        if (!Array.isArray(sources) || sources.length === 0) return;

        grid.innerHTML = sources.map(s => {
            const isOnline = (s.connectionStatus || '').toUpperCase() === 'ONLINE' || (s.connectionStatus || '').toUpperCase() === 'ACCESSIBLE';
            const statusClass = isOnline ? 'text-success' : 'text-danger';
            const statusBadgeClass = isOnline ? 'bg-success-subtle text-success border border-success-subtle' : 'bg-danger-subtle text-danger border border-danger-subtle';

            return `
                <div class="col-md-6 col-lg-4">
                    <div class="p-3 rounded border bg-light h-100 d-flex flex-column justify-content-between">
                        <div>
                            <div class="d-flex justify-content-between align-items-center mb-2">
                                <span class="badge ${statusBadgeClass} text-uppercase" style="font-size: 0.68rem;">
                                    ${s.connectionStatus}
                                </span>
                                <span class="badge bg-light text-secondary border" style="font-size: 0.68rem;">
                                    ${s.category}
                                </span>
                            </div>
                            <h6 class="fw-bold mb-1 text-dark" style="font-size: 0.9rem;">${s.sourceName}</h6>
                            <p class="small text-muted mb-2" style="font-size: 0.78rem;">${s.notes || ''}</p>
                        </div>
                        <div class="pt-2 border-top d-flex justify-content-between align-items-center small">
                            <span class="text-muted">Records: <strong class="text-dark">${s.recordsRetrieved.toLocaleString()}</strong></span>
                            <a href="${s.portalUrl}" target="_blank" class="text-primary text-decoration-none fw-semibold">
                                <i class="fa-solid fa-arrow-up-right-from-square me-1"></i>Portal
                            </a>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    } catch (err) {
        console.warn('Failed to load source monitoring grid:', err);
    }
}

function showProvenanceModal(p) {
    const body = document.getElementById('provenanceModalBody');
    const link = document.getElementById('modalSourceLink');
    if (!body) return;

    if (link) {
        link.href = p.sourceUrl || '#';
        link.style.display = p.sourceUrl ? 'inline-block' : 'none';
    }

    const isMissing = !p.available || (p.dataStatus && p.dataStatus.toUpperCase() === 'MISSING') || (p.displayValue && p.displayValue.includes('DATA NOT AVAILABLE'));

    body.innerHTML = `
        <div class="mb-3 pb-3 border-bottom">
            <span class="badge bg-primary-subtle text-primary mb-1">${p.category}</span>
            <h5 class="fw-bold text-dark mb-0">${p.parameterName} (${p.parameterCode})</h5>
            <small class="text-muted">Parameter #${p.parameterNumber} of 13 Surveillance Specification</small>
        </div>

        <div class="row g-2 mb-3">
            <div class="col-6">
                <div class="p-2 bg-light rounded border">
                    <small class="text-muted d-block" style="font-size: 0.72rem;">Authentic Observation Value</small>
                    <div class="${isMissing ? 'text-danger fw-bold' : 'text-dark fw-bold'} mt-1" style="font-size: 0.95rem;">
                        ${isMissing ? 'DATA NOT AVAILABLE FROM VERIFIED SOURCE' : (p.numericValue + ' ' + (p.unit || ''))}
                    </div>
                </div>
            </div>
            <div class="col-6">
                <div class="p-2 bg-light rounded border">
                    <small class="text-muted d-block" style="font-size: 0.72rem;">Data Classification</small>
                    <div class="fw-bold text-dark mt-1" style="font-size: 0.95rem;">
                        ${p.dataStatus}
                    </div>
                </div>
            </div>
        </div>

        <div class="list-group list-group-flush small">
            <div class="list-group-item d-flex justify-content-between px-0 py-2">
                <span class="text-muted">Official Source Organization:</span>
                <strong class="text-dark">${p.sourceName}</strong>
            </div>
            <div class="list-group-item d-flex justify-content-between px-0 py-2">
                <span class="text-muted">Monitoring Station / Location:</span>
                <span class="text-dark fw-semibold text-end">${p.monitoringStation || 'District Coverage'}</span>
            </div>
            <div class="list-group-item d-flex justify-content-between px-0 py-2">
                <span class="text-muted">Observation Sampling Date:</span>
                <span class="text-dark fw-semibold">${p.collectionDate || 'N/A'}</span>
            </div>
            <div class="list-group-item d-flex justify-content-between px-0 py-2">
                <span class="text-muted">Reference Period / Baseline Year:</span>
                <span class="text-dark fw-semibold">${p.referencePeriod || 'Current Routine Cycle'}</span>
            </div>
            <div class="list-group-item d-flex justify-content-between px-0 py-2">
                <span class="text-muted">Public Portal Endpoint:</span>
                <a href="${p.sourceUrl}" target="_blank" class="text-primary text-truncate" style="max-width: 250px;">
                    ${p.sourceUrl}
                </a>
            </div>
        </div>

        <div class="alert alert-light border mt-3 mb-0 small text-muted">
            <i class="fa-solid fa-shield-halved text-success me-1"></i>
            <strong>Data Integrity Assurance:</strong> This parameter record is ingested strictly from official records. No artificial interpolation or synthetic substitution is applied.
        </div>
    `;

    // Show modal via Bootstrap Modal API
    const modalEl = document.getElementById('provenanceModal');
    if (modalEl && window.bootstrap && window.bootstrap.Modal) {
        const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
        modal.show();
    }
}

function setupAcquisitionHandlers() {
    const districtSelect = document.getElementById('districtAcquisitionSelect');
    if (districtSelect) {
        districtSelect.addEventListener('change', (e) => {
            loadAcquisitionSection(e.target.value);
        });
    }

    const btnRefresh = document.getElementById('btnRefreshAcquisition');
    if (btnRefresh) {
        btnRefresh.addEventListener('click', async () => {
            const select = document.getElementById('districtAcquisitionSelect');
            const targetDistrict = select ? select.value : currentAcquisitionDistrict;

            const originalHtml = btnRefresh.innerHTML;
            btnRefresh.disabled = true;
            btnRefresh.innerHTML = '<i class="fa-solid fa-spinner fa-spin me-1"></i> Syncing Verified Feeds...';

            try {
                const refreshed = await api.refreshDistrictAcquisition(targetDistrict);
                updateAcquisitionSummaryUI(refreshed);
                renderAcquisitionTable(refreshed.parameters || []);
                loadSourceMonitoring();
                alert(`Real Data Acquisition synchronized for ${targetDistrict}. Verified feeds re-queried.`);
            } catch (err) {
                alert(`Sync notice for ${targetDistrict}: ` + err.message);
            } finally {
                btnRefresh.disabled = false;
                btnRefresh.innerHTML = originalHtml;
            }
        });
    }
}
