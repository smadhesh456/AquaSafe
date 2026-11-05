/**
 * AquaSafe - District-Based Epidemiological Intelligence Controller
 * Dynamic District Selection, Authentic Multi-Source Data Collection & ML Disease Risk Evaluation
 */

let allDistricts = [];
let currentSelectedDistrict = null;

document.addEventListener('DOMContentLoaded', async () => {
    initDashboard();
});

async function initDashboard() {
    try {
        await loadDistrictsDropdown();
        setupEventListeners();
    } catch (err) {
        console.error('Failed to initialize AquaSafe dashboard:', err);
    }
}

/**
 * Loads all 38 recognized Tamil Nadu districts dynamically into dropdown
 */
async function loadDistrictsDropdown() {
    const select = document.getElementById('districtSelect');
    if (!select) return;

    try {
        const districtsData = await api.getAcquisitionDistricts();
        allDistricts = Array.isArray(districtsData) ? districtsData : [];

        // Sort alphabetically
        allDistricts.sort((a, b) => {
            const nameA = typeof a === 'string' ? a : a.name;
            const nameB = typeof b === 'string' ? b : b.name;
            return nameA.localeCompare(nameB);
        });

        select.innerHTML = '<option value="" selected disabled>-- Select a Tamil Nadu District --</option>';

        allDistricts.forEach(d => {
            const name = typeof d === 'string' ? d : d.name;
            const opt = document.createElement('option');
            opt.value = name;
            opt.textContent = name;
            select.appendChild(opt);
        });

        // Populate quick-select pills
        populateQuickSelectPills();
    } catch (err) {
        console.error('Could not load districts dropdown:', err);
        select.innerHTML = '<option value="" disabled>Error loading Tamil Nadu districts</option>';
    }
}

/**
 * Quick-select pills for major surveillance districts
 */
function populateQuickSelectPills() {
    const container = document.getElementById('quickDistrictPills');
    if (!container) return;

    const featured = ['Chennai', 'Coimbatore', 'Madurai', 'Nagapattinam', 'Salem', 'Thanjavur', 'Tiruchirappalli', 'Cuddalore'];

    container.innerHTML = featured.map(name => `
        <button type="button" class="btn btn-sm btn-outline-primary rounded-pill px-3 py-1 btn-quick-district" data-district="${name}">
            <i class="fa-solid fa-location-dot me-1"></i>${name}
        </button>
    `).join('');

    container.querySelectorAll('.btn-quick-district').forEach(btn => {
        btn.addEventListener('click', () => {
            const dist = btn.getAttribute('data-district');
            const select = document.getElementById('districtSelect');
            if (select) {
                select.value = dist;
                selectAndLoadDistrict(dist);
            }
        });
    });
}

function setupEventListeners() {
    const select = document.getElementById('districtSelect');
    if (select) {
        select.addEventListener('change', (e) => {
            const dist = e.target.value;
            if (dist) {
                selectAndLoadDistrict(dist);
            }
        });
    }

    const btnRefresh = document.getElementById('btnRefreshData');
    if (btnRefresh) {
        btnRefresh.addEventListener('click', () => {
            if (currentSelectedDistrict) {
                refreshDistrictData(currentSelectedDistrict);
            }
        });
    }
}

/**
 * Fetches and replaces the report exclusively for the chosen district
 */
async function selectAndLoadDistrict(districtName) {
    if (!districtName) return;
    currentSelectedDistrict = districtName;

    // UI state transitions
    const btnRefresh = document.getElementById('btnRefreshData');
    if (btnRefresh) btnRefresh.disabled = false;

    const promptState = document.getElementById('initialPromptState');
    const reportSection = document.getElementById('districtReportSection');
    const spinner = document.getElementById('reportLoadingSpinner');
    const loadingText = document.getElementById('loadingDistrictText');

    if (promptState) promptState.style.display = 'none';
    if (reportSection) reportSection.style.display = 'none';
    if (spinner) spinner.style.display = 'block';
    if (loadingText) loadingText.textContent = `Querying verified feeds for ${districtName}...`;

    try {
        const summary = await api.getAcquisitionParameters(districtName);
        renderDistrictReport(summary);

        if (spinner) spinner.style.display = 'none';
        if (reportSection) reportSection.style.display = 'block';

        // Update last updated in navbar
        const lastUpdatedEl = document.getElementById('lastUpdatedTimestamp');
        if (lastUpdatedEl && summary.lastSynchronizationTime) {
            lastUpdatedEl.textContent = summary.lastSynchronizationTime;
        }

        // Load external sources health
        loadSourcesHealth();
    } catch (err) {
        console.error(`Failed to acquire data for ${districtName}:`, err);
        if (spinner) spinner.style.display = 'none';
        if (reportSection) {
            reportSection.style.display = 'block';
            reportSection.innerHTML = `
                <div class="alert alert-danger p-4 rounded-3 shadow-sm">
                    <h5 class="fw-bold"><i class="fa-solid fa-circle-exclamation me-2"></i>Failed to Load District Report</h5>
                    <p class="mb-0">Unable to retrieve verified data for ${districtName}: ${err.message}</p>
                </div>
            `;
        }
    }
}

/**
 * Forces live refresh of external feeds for the selected district
 */
async function refreshDistrictData(districtName) {
    if (!districtName) return;

    const btnRefresh = document.getElementById('btnRefreshData');
    const originalHtml = btnRefresh ? btnRefresh.innerHTML : '';
    if (btnRefresh) {
        btnRefresh.disabled = true;
        btnRefresh.innerHTML = '<i class="fa-solid fa-spinner fa-spin me-2"></i>Refreshing Feeds...';
    }

    try {
        const refreshed = await api.refreshDistrictAcquisition(districtName);
        renderDistrictReport(refreshed);
        loadSourcesHealth();
    } catch (err) {
        alert(`Notice during refresh for ${districtName}: ` + err.message);
    } finally {
        if (btnRefresh) {
            btnRefresh.disabled = false;
            btnRefresh.innerHTML = originalHtml;
        }
    }
}

/**
 * Renders the complete, exclusive district report
 */
function renderDistrictReport(summary) {
    if (!summary) return;

    // 1. Header Information
    setText('reportDistrictName', `${summary.district} District`);
    setText('reportGeographicId', summary.geographicIdentifier || 'TN');
    setText('reportZone', `${summary.zone || 'Tamil Nadu'} Zone`);
    setText('reportCoordinates', `${summary.latitude != null ? summary.latitude.toFixed(4) : '--'}° N, ${summary.longitude != null ? summary.longitude.toFixed(4) : '--'}° E`);
    setText('reportSyncTime', summary.lastSynchronizationTime || 'Just now');
    setText('reportDataAvailabilityBadge', `${summary.successfullyCollectedParameters} of 13 Parameters Available`);

    // 2. Risk Prediction Section
    renderRiskPredictionSection(summary);

    // Filter parameter groups
    const params = summary.parameters || [];
    const wqParams = params.filter(p => p.parameterNumber >= 1 && p.parameterNumber <= 5);
    const weatherParams = params.filter(p => p.parameterNumber >= 6 && p.parameterNumber <= 9);
    const otherParams = params.filter(p => p.parameterNumber >= 10 && p.parameterNumber <= 13);

    // 3. Water Quality Cards
    renderParameterCards('waterQualityCardsRow', wqParams, [
        { code: 'ph', benchmark: 'Standard: 6.5 – 8.5 pH', icon: 'fa-vial' },
        { code: 'turbidity', benchmark: 'Potable Limit: ≤ 5.0 NTU', icon: 'fa-water' },
        { code: 'tds', benchmark: 'Potable Limit: ≤ 500 mg/L', icon: 'fa-cubes-stacked' },
        { code: 'dissolved_oxygen', benchmark: 'Baseline: ≥ 5.0 mg/L', icon: 'fa-lungs' },
        { code: 'water_temperature', benchmark: 'Ambient Aquatic Range', icon: 'fa-temperature-quarter' }
    ]);

    // 4. Weather Parameter Cards
    renderParameterCards('weatherCardsRow', weatherParams, [
        { code: 'air_temperature', benchmark: 'Open-Meteo 2m Sensor', icon: 'fa-temperature-high' },
        { code: 'relative_humidity', benchmark: 'Relative Moisture %', icon: 'fa-droplet' },
        { code: 'rainfall', benchmark: 'Direct Liquid Rain', icon: 'fa-cloud-rain' },
        { code: 'precipitation', benchmark: 'Total Moisture (Rain+Drizzle)', icon: 'fa-cloud-showers-heavy' }
    ]);

    // 5. Other Risk Factor Cards
    renderParameterCards('otherFactorsCardsRow', otherParams, [
        { code: 'disease_cases', benchmark: 'IDSP Reported Cases', icon: 'fa-file-waveform' },
        { code: 'population_density', benchmark: 'Census of India 2011', icon: 'fa-users' },
        { code: 'sanitation_coverage', benchmark: 'NFHS-5 / SBM Target: 100%', icon: 'fa-restroom' },
        { code: 'drinking_water_coverage', benchmark: 'Jal Jeevan Mission Target: 100%', icon: 'fa-faucet-drip' }
    ]);

    // 6. Comprehensive 13-Parameter Audit Table
    renderAuditTable(params);
}

/**
 * Overall Risk Prediction Section
 */
function renderRiskPredictionSection(summary) {
    const container = document.getElementById('riskPredictionContainer');
    if (!container) return;

    const isInsufficient = summary.riskLevel && summary.riskLevel.includes('INSUFFICIENT');

    if (isInsufficient) {
        container.innerHTML = `
            <div class="p-4 rounded-3 bg-light border border-warning shadow-sm">
                <div class="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
                    <div class="d-flex align-items-center gap-3">
                        <span class="badge bg-warning text-dark px-3 py-2 fs-6 fw-bold">
                            <i class="fa-solid fa-triangle-exclamation me-2"></i>INSUFFICIENT VERIFIED DATA FOR RISK PREDICTION
                        </span>
                    </div>
                    <span class="badge bg-light text-secondary border small">Authentic Data Guard Active</span>
                </div>
                <h6 class="fw-bold text-dark mb-1">Advisory Status:</h6>
                <p class="text-muted small mb-3">
                    ${summary.riskPredictionAdvisory || 'Required environmental or demographic observations are unavailable from verified government sources for this district. AquaSafe never generates artificial values or produces unsupported predictions.'}
                </p>
                <div class="alert alert-light border mb-0 small text-secondary">
                    <i class="fa-solid fa-circle-info text-primary me-1"></i>
                    <strong>Public Health Guard:</strong> AquaSafe is a risk assessment and early-warning support system, not a medical diagnosis or confirmation of a disease outbreak. Risk levels are computed strictly when sufficient authentic measurements are verified.
                </div>
            </div>
        `;
        return;
    }

    // Determine badge and color for valid predictions
    let badgeClass = 'bg-success text-white';
    let riskIcon = 'fa-solid fa-circle-check';
    let cardBgClass = 'bg-success-subtle border-success-subtle';
    const risk = (summary.riskLevel || 'LOW RISK').toUpperCase();

    if (risk.includes('HIGH')) {
        badgeClass = 'bg-danger text-white';
        riskIcon = 'fa-solid fa-triangle-exclamation';
        cardBgClass = 'bg-danger-subtle border-danger-subtle';
    } else if (risk.includes('MEDIUM')) {
        badgeClass = 'bg-warning text-dark';
        riskIcon = 'fa-solid fa-circle-exclamation';
        cardBgClass = 'bg-warning-subtle border-warning-subtle';
    }

    const contributions = summary.featureContributions || [];
    const contributionsHtml = contributions.length > 0 ? `
        <div class="mt-3 pt-3 border-top">
            <h6 class="fw-bold text-dark mb-2 small"><i class="fa-solid fa-magnifying-glass-chart text-primary me-1"></i> Contributing Epidemiological & Environmental Risk Indicators:</h6>
            <ul class="mb-0 small ps-3">
                ${contributions.map(c => `<li class="mb-1 text-dark">${c}</li>`).join('')}
            </ul>
        </div>
    ` : '';

    container.innerHTML = `
        <div class="p-4 rounded-3 ${cardBgClass} border shadow-sm">
            <div class="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
                <div class="d-flex align-items-center gap-3">
                    <span class="badge ${badgeClass} px-3 py-2 fs-6 fw-bold">
                        <i class="${riskIcon} me-2"></i>${summary.riskLevel}
                    </span>
                    <span class="fw-semibold small text-muted">
                        Confidence Probability: <strong class="text-dark">${(summary.riskProbability * 100).toFixed(1)}%</strong>
                    </span>
                </div>
                <span class="badge bg-light text-secondary border small">Validated Weka Random Forest ML</span>
            </div>

            <div class="mb-2">
                <h6 class="fw-bold text-dark mb-1">Public Health Decision Advisory:</h6>
                <p class="text-dark mb-0 small">${summary.recommendation || summary.riskPredictionAdvisory || 'Normal baseline surveillance parameters observed.'}</p>
            </div>

            ${contributionsHtml}

            <div class="mt-3 pt-3 border-top small text-muted">
                <i class="fa-solid fa-shield-halved text-primary me-1"></i>
                <strong>Notice:</strong> AquaSafe is a risk assessment and early-warning support system, not a medical diagnosis or confirmation of a disease outbreak.
            </div>
        </div>
    `;
}

/**
 * Generic Parameter Cards Renderer
 */
function renderParameterCards(containerId, paramsList, metaBenchmarks) {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (!paramsList || paramsList.length === 0) {
        container.innerHTML = '<div class="col-12 text-muted small">No parameters recorded in this category.</div>';
        return;
    }

    container.innerHTML = paramsList.map(p => {
        const isMissing = !p.available || (p.dataStatus && p.dataStatus.toUpperCase() === 'MISSING') || (p.displayValue && p.displayValue.includes('DATA NOT AVAILABLE'));

        const meta = metaBenchmarks.find(m => m.code === p.parameterCode) || { benchmark: '', icon: 'fa-chart-simple' };

        const valueHtml = isMissing
            ? `<div class="param-missing-cell mt-1"><i class="fa-solid fa-triangle-exclamation me-1"></i>DATA NOT AVAILABLE</div>`
            : `<div class="param-value-cell mt-1">${p.numericValue != null ? p.numericValue : p.displayValue} <small class="text-muted fs-6 fw-normal">${p.unit || ''}</small></div>`;

        const statusClass = (p.dataStatus || 'OFFICIAL').toLowerCase();

        return `
            <div class="col-md-6 col-lg-4 col-xl">
                <div class="dashboard-card h-100 p-3 d-flex flex-column justify-content-between mb-0">
                    <div>
                        <div class="d-flex justify-content-between align-items-start mb-2">
                            <span class="kpi-title text-dark">${p.parameterName}</span>
                            <span class="badge badge-status-${statusClass}">${p.dataStatus || 'OFFICIAL'}</span>
                        </div>
                        ${valueHtml}
                        <div class="text-muted small mt-2" style="font-size: 0.75rem;">
                            <i class="fa-solid fa-scale-balanced me-1"></i>${meta.benchmark}
                        </div>
                    </div>
                    <div class="pt-2 border-top mt-2 d-flex justify-content-between align-items-center" style="font-size: 0.72rem;">
                        <span class="text-muted text-truncate" style="max-width: 140px;" title="${p.sourceName}">${p.sourceName}</span>
                        <span class="text-muted">${p.collectionDate || 'Routine'}</span>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

/**
 * Audit Table
 */
function renderAuditTable(parameters) {
    const tbody = document.getElementById('districtParamTableBody');
    if (!tbody) return;

    if (!parameters || parameters.length === 0) {
        tbody.innerHTML = '<tr><td colspan="9" class="text-center py-4 text-muted">No records available.</td></tr>';
        return;
    }

    tbody.innerHTML = parameters.map(p => {
        const isMissing = !p.available || (p.dataStatus && p.dataStatus.toUpperCase() === 'MISSING') || (p.displayValue && p.displayValue.includes('DATA NOT AVAILABLE'));

        const valueDisplay = isMissing
            ? `<span class="param-missing-cell"><i class="fa-solid fa-triangle-exclamation me-1"></i>DATA NOT AVAILABLE</span>`
            : `<span class="param-value-cell">${p.numericValue != null ? p.numericValue : p.displayValue}</span> <span class="text-muted small">${p.unit || ''}</span>`;

        const encodedParam = encodeURIComponent(JSON.stringify(p));
        const statusClass = (p.dataStatus || 'OFFICIAL').toLowerCase();

        return `
            <tr>
                <td class="text-muted fw-bold">${p.parameterNumber}</td>
                <td><span class="badge bg-light text-dark border">${p.category}</span></td>
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
                <td><span class="badge badge-status-${statusClass}">${p.dataStatus || 'OFFICIAL'}</span></td>
                <td class="text-end">
                    <button class="btn btn-sm btn-outline-primary py-0 px-2 btn-inspect-audit" data-param="${encodedParam}">
                        <i class="fa-solid fa-fingerprint me-1"></i>Inspect
                    </button>
                </td>
            </tr>
        `;
    }).join('');

    // Attach inspect handlers
    tbody.querySelectorAll('.btn-inspect-audit').forEach(btn => {
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

/**
 * 6 Official External Data Sources Monitoring
 */
async function loadSourcesHealth() {
    const grid = document.getElementById('sourcesHealthGrid');
    if (!grid) return;

    try {
        const sources = await api.getSourcesMonitoring();
        if (!Array.isArray(sources) || sources.length === 0) return;

        grid.innerHTML = sources.map(s => {
            const isOnline = (s.connectionStatus || '').toUpperCase() === 'ONLINE' || (s.connectionStatus || '').toUpperCase() === 'ACCESSIBLE';
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
                            <h6 class="fw-bold mb-1 text-dark" style="font-size: 0.88rem;">${s.sourceName}</h6>
                            <p class="small text-muted mb-2" style="font-size: 0.78rem;">${s.notes || ''}</p>
                        </div>
                        <div class="pt-2 border-top d-flex justify-content-between align-items-center small">
                            <span class="text-muted">Last Query: <strong class="text-dark">${s.lastSuccessfulCollection ? s.lastSuccessfulCollection.split(' ')[1] : 'Recent'}</strong></span>
                            <a href="${s.portalUrl}" target="_blank" class="text-primary text-decoration-none fw-semibold">
                                <i class="fa-solid fa-arrow-up-right-from-square me-1"></i>Portal
                            </a>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    } catch (err) {
        console.warn('Could not load source monitoring:', err);
    }
}

/**
 * Shows provenance inspector modal
 */
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
                        ${isMissing ? 'DATA NOT AVAILABLE' : (p.numericValue + ' ' + (p.unit || ''))}
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

    const modalEl = document.getElementById('provenanceModal');
    if (modalEl && window.bootstrap && window.bootstrap.Modal) {
        const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
        modal.show();
    }
}

function setText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
}
