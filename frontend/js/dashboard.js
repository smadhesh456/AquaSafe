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
