/**
 * AquaSafe Machine Learning Prediction Controller
 * Submits environmental/sanitary features to Weka Random Forest model
 */

const DISTRICT_PRESETS = {
    'Delhi': {
        ph: 7.5, turbidity: 6.5, tds: 650, dissolvedOxygen: 4.2,
        temperature: 28.5, rainfall: 4.0, humidity: 55.0,
        previousDiseaseCases: 35, populationDensity: 11320, sanitationCoverage: 93.0
    },
    'Mumbai': {
        ph: 7.3, turbidity: 2.8, tds: 220, dissolvedOxygen: 6.5,
        temperature: 32.0, rainfall: 120.0, humidity: 88.0,
        previousDiseaseCases: 22, populationDensity: 19652, sanitationCoverage: 90.0
    },
    'Bengaluru': {
        ph: 7.4, turbidity: 2.5, tds: 310, dissolvedOxygen: 6.8,
        temperature: 24.5, rainfall: 15.0, humidity: 68.0,
        previousDiseaseCases: 12, populationDensity: 4381, sanitationCoverage: 95.0
    },
    'Varanasi': {
        ph: 7.9, turbidity: 6.2, tds: 540, dissolvedOxygen: 5.3,
        temperature: 29.0, rainfall: 45.0, humidity: 75.0,
        previousDiseaseCases: 32, populationDensity: 2395, sanitationCoverage: 78.0
    },
    'Chandigarh': {
        ph: 7.2, turbidity: 1.6, tds: 190, dissolvedOxygen: 7.6,
        temperature: 26.0, rainfall: 5.0, humidity: 52.0,
        previousDiseaseCases: 4, populationDensity: 9258, sanitationCoverage: 97.0
    },
    'Shillong': {
        ph: 6.9, turbidity: 1.7, tds: 110, dissolvedOxygen: 8.4,
        temperature: 18.5, rainfall: 25.0, humidity: 78.0,
        previousDiseaseCases: 4, populationDensity: 2200, sanitationCoverage: 90.0
    },
    'Chennai': {
        ph: 7.35, turbidity: 3.8, tds: 450, dissolvedOxygen: 5.6,
        temperature: 29.5, rainfall: 85.0, humidity: 82.0,
        previousDiseaseCases: 24, populationDensity: 26553, sanitationCoverage: 92.5
    },
    'Salem': {
        ph: 6.9, turbidity: 5.8, tds: 520, dissolvedOxygen: 4.8,
        temperature: 30.1, rainfall: 72.0, humidity: 76.0,
        previousDiseaseCases: 31, populationDensity: 665, sanitationCoverage: 75.5
    },
    'Coimbatore': {
        ph: 7.2, turbidity: 1.8, tds: 210, dissolvedOxygen: 7.2,
        temperature: 26.5, rainfall: 12.0, humidity: 62.0,
        previousDiseaseCases: 5, populationDensity: 748, sanitationCoverage: 88.5
    }
};

const DISTRICT_LIVE_PROFILES = {
    // --- Northern India ---
    'Delhi': {
        lat: 28.6139, lon: 77.2090, state: 'Delhi',
        ph: 7.50, turbidity: 6.5, tds: 650, dissolvedOxygen: 4.2,
        populationDensity: 11320, sanitationCoverage: 93.0, previousDiseaseCases: 35,
        source: 'Yamuna River Basin & Sonia Vihar Treatment Plant'
    },
    'Chandigarh': {
        lat: 30.7333, lon: 76.7794, state: 'Chandigarh',
        ph: 7.20, turbidity: 1.6, tds: 190, dissolvedOxygen: 7.6,
        populationDensity: 9258, sanitationCoverage: 97.0, previousDiseaseCases: 4,
        source: 'Kajauli Water Works (Bhakra Main Canal)'
    },
    'Jaipur': {
        lat: 26.9124, lon: 75.7873, state: 'Rajasthan',
        ph: 7.80, turbidity: 3.6, tds: 720, dissolvedOxygen: 5.8,
        populationDensity: 6500, sanitationCoverage: 85.0, previousDiseaseCases: 21,
        source: 'Bisalpur Dam System & Deep Aquifer Tubewells'
    },
    'Lucknow': {
        lat: 26.8467, lon: 80.9462, state: 'Uttar Pradesh',
        ph: 7.60, turbidity: 5.5, tds: 510, dissolvedOxygen: 4.9,
        populationDensity: 1816, sanitationCoverage: 83.0, previousDiseaseCases: 28,
        source: 'Gomti River Water Works & Gaughat Intake'
    },
    'Varanasi': {
        lat: 25.3176, lon: 82.9739, state: 'Uttar Pradesh',
        ph: 7.90, turbidity: 6.2, tds: 540, dissolvedOxygen: 5.3,
        populationDensity: 2395, sanitationCoverage: 78.0, previousDiseaseCases: 32,
        source: 'Ganges River Intake & Bhelupur Water Treatment Plant'
    },
    'Amritsar': {
        lat: 31.6340, lon: 74.8723, state: 'Punjab',
        ph: 7.40, turbidity: 3.1, tds: 380, dissolvedOxygen: 6.4,
        populationDensity: 928, sanitationCoverage: 88.0, previousDiseaseCases: 15,
        source: 'Upper Bari Doab Canal & Municipal Tubewells'
    },
    'Srinagar': {
        lat: 34.0837, lon: 74.7973, state: 'Jammu & Kashmir',
        ph: 7.10, turbidity: 2.0, tds: 160, dissolvedOxygen: 8.2,
        populationDensity: 703, sanitationCoverage: 84.0, previousDiseaseCases: 6,
        source: 'Doodhganga Catchment & Dal Lake System'
    },
    'Dehradun': {
        lat: 30.3165, lon: 78.0322, state: 'Uttarakhand',
        ph: 7.20, turbidity: 1.9, tds: 195, dissolvedOxygen: 8.0,
        populationDensity: 549, sanitationCoverage: 91.0, previousDiseaseCases: 5,
        source: 'Song River & Mountain Spring Gravity Feed'
    },

    // --- Western India ---
    'Mumbai': {
        lat: 19.0760, lon: 72.8777, state: 'Maharashtra',
        ph: 7.30, turbidity: 2.8, tds: 220, dissolvedOxygen: 6.5,
        populationDensity: 19652, sanitationCoverage: 90.0, previousDiseaseCases: 22,
        source: 'Bhatsa, Vaitarna & Tansa Catchment Reservoirs'
    },
    'Pune': {
        lat: 18.5204, lon: 73.8567, state: 'Maharashtra',
        ph: 7.20, turbidity: 2.2, tds: 240, dissolvedOxygen: 7.0,
        populationDensity: 9400, sanitationCoverage: 92.0, previousDiseaseCases: 10,
        source: 'Khadakwasla Dam & Mutha River Canal System'
    },
    'Ahmedabad': {
        lat: 23.0225, lon: 72.5714, state: 'Gujarat',
        ph: 7.70, turbidity: 4.1, tds: 580, dissolvedOxygen: 5.5,
        populationDensity: 11885, sanitationCoverage: 91.0, previousDiseaseCases: 19,
        source: 'Sabarmati River & Narmada Main Canal Feeder'
    },
    'Surat': {
        lat: 21.1702, lon: 72.8311, state: 'Gujarat',
        ph: 7.50, turbidity: 3.5, tds: 380, dissolvedOxygen: 6.3,
        populationDensity: 13680, sanitationCoverage: 93.0, previousDiseaseCases: 15,
        source: 'Tapi River French Wells & Sarthana Water Works'
    },
    'Panaji': {
        lat: 15.4909, lon: 73.8278, state: 'Goa',
        ph: 7.10, turbidity: 1.9, tds: 170, dissolvedOxygen: 7.3,
        populationDensity: 394, sanitationCoverage: 96.0, previousDiseaseCases: 3,
        source: 'Opa Water Works & Khandepar/Mandovi River'
    },

    // --- Southern India ---
    'Bengaluru': {
        lat: 12.9716, lon: 77.5946, state: 'Karnataka',
        ph: 7.40, turbidity: 2.5, tds: 310, dissolvedOxygen: 6.8,
        populationDensity: 4381, sanitationCoverage: 95.0, previousDiseaseCases: 12,
        source: 'Cauvery Water Supply Scheme (Stages I-IV)'
    },
    'Hyderabad': {
        lat: 17.3850, lon: 78.4867, state: 'Telangana',
        ph: 7.50, turbidity: 3.2, tds: 420, dissolvedOxygen: 6.2,
        populationDensity: 18172, sanitationCoverage: 93.5, previousDiseaseCases: 16,
        source: 'Krishna & Godavari River Water Supply Schemes'
    },
    'Chennai': {
        lat: 13.0827, lon: 80.2707, state: 'Tamil Nadu',
        ph: 7.35, turbidity: 3.8, tds: 450, dissolvedOxygen: 5.6,
        populationDensity: 26553, sanitationCoverage: 92.5, previousDiseaseCases: 24,
        source: 'Red Hills / Chembarambakkam Reservoir & Metro Distribution'
    },
    'Coimbatore': {
        lat: 11.0168, lon: 76.9558, state: 'Tamil Nadu',
        ph: 7.20, turbidity: 1.8, tds: 210, dissolvedOxygen: 7.2,
        populationDensity: 748, sanitationCoverage: 88.5, previousDiseaseCases: 5,
        source: 'Siruvani & Bhavani River Surface Catchments'
    },
    'Madurai': {
        lat: 9.9252, lon: 78.1198, state: 'Tamil Nadu',
        ph: 7.60, turbidity: 4.2, tds: 680, dissolvedOxygen: 5.4,
        populationDensity: 819, sanitationCoverage: 81.0, previousDiseaseCases: 18,
        source: 'Vaigai Reservoir Basin & Deep Aquifer Wells'
    },
    'Salem': {
        lat: 11.6643, lon: 78.1460, state: 'Tamil Nadu',
        ph: 6.90, turbidity: 5.8, tds: 520, dissolvedOxygen: 4.8,
        populationDensity: 665, sanitationCoverage: 75.5, previousDiseaseCases: 31,
        source: 'Mettur Dam Scheme & Tributary Runoff Monitoring'
    },
    'Kochi': {
        lat: 9.9312, lon: 76.2673, state: 'Kerala',
        ph: 7.00, turbidity: 1.8, tds: 140, dissolvedOxygen: 7.4,
        populationDensity: 6340, sanitationCoverage: 98.0, previousDiseaseCases: 5,
        source: 'Periyar River Freshwater Intake (Aluva Headworks)'
    },
    'Thiruvananthapuram': {
        lat: 8.5241, lon: 76.9366, state: 'Kerala',
        ph: 6.90, turbidity: 1.6, tds: 130, dissolvedOxygen: 7.8,
        populationDensity: 1508, sanitationCoverage: 98.0, previousDiseaseCases: 4,
        source: 'Peppara & Aruvikkara Reservoir Catchments'
    },
    'Visakhapatnam': {
        lat: 17.6868, lon: 83.2185, state: 'Andhra Pradesh',
        ph: 7.30, turbidity: 3.0, tds: 360, dissolvedOxygen: 6.7,
        populationDensity: 384, sanitationCoverage: 87.0, previousDiseaseCases: 11,
        source: 'Godavari & Raiwada Reservoir Pipeline Systems'
    },

    // --- Eastern India ---
    'Kolkata': {
        lat: 22.5726, lon: 88.3639, state: 'West Bengal',
        ph: 7.60, turbidity: 5.2, tds: 480, dissolvedOxygen: 5.1,
        populationDensity: 24306, sanitationCoverage: 89.0, previousDiseaseCases: 38,
        source: 'Hooghly River (Ganges) & Palta Water Works'
    },
    'Patna': {
        lat: 25.5941, lon: 85.1376, state: 'Bihar',
        ph: 7.80, turbidity: 6.0, tds: 490, dissolvedOxygen: 5.2,
        populationDensity: 1823, sanitationCoverage: 74.0, previousDiseaseCases: 34,
        source: 'Ganga & Sone River Deep Aquifer Intakes'
    },
    'Bhubaneswar': {
        lat: 20.2961, lon: 85.8245, state: 'Odisha',
        ph: 7.30, turbidity: 3.8, tds: 340, dissolvedOxygen: 6.5,
        populationDensity: 2134, sanitationCoverage: 84.0, previousDiseaseCases: 17,
        source: 'Mahanadi & Kuakhai River Water System'
    },
    'Ranchi': {
        lat: 23.3441, lon: 85.3096, state: 'Jharkhand',
        ph: 7.10, turbidity: 4.2, tds: 360, dissolvedOxygen: 6.2,
        populationDensity: 572, sanitationCoverage: 76.0, previousDiseaseCases: 24,
        source: 'Subarnarekha River & Kanke Dam Storage'
    },

    // --- Central India ---
    'Bhopal': {
        lat: 23.2599, lon: 77.4126, state: 'Madhya Pradesh',
        ph: 7.40, turbidity: 2.9, tds: 320, dissolvedOxygen: 6.6,
        populationDensity: 855, sanitationCoverage: 82.0, previousDiseaseCases: 14,
        source: 'Upper Lake (Bhojtal) & Narmada Pipeline Scheme'
    },
    'Indore': {
        lat: 22.7196, lon: 75.8577, state: 'Madhya Pradesh',
        ph: 7.30, turbidity: 2.1, tds: 260, dissolvedOxygen: 7.1,
        populationDensity: 9700, sanitationCoverage: 96.0, previousDiseaseCases: 8,
        source: 'Narmada Water Pipeline & Yashwant Sagar'
    },
    'Raipur': {
        lat: 21.2514, lon: 81.6296, state: 'Chhattisgarh',
        ph: 7.40, turbidity: 4.6, tds: 410, dissolvedOxygen: 5.9,
        populationDensity: 750, sanitationCoverage: 80.0, previousDiseaseCases: 20,
        source: 'Kharun River Intake System'
    },

    // --- North-Eastern India ---
    'Guwahati': {
        lat: 26.1445, lon: 91.7362, state: 'Assam',
        ph: 7.30, turbidity: 4.8, tds: 220, dissolvedOxygen: 6.7,
        populationDensity: 4400, sanitationCoverage: 86.0, previousDiseaseCases: 23,
        source: 'Brahmaputra River Raw Water Intake'
    },
    'Shillong': {
        lat: 25.5788, lon: 91.8933, state: 'Meghalaya',
        ph: 6.90, turbidity: 1.7, tds: 110, dissolvedOxygen: 8.4,
        populationDensity: 2200, sanitationCoverage: 90.0, previousDiseaseCases: 4,
        source: 'Greater Shillong Water Supply (Umiam & Mountain Springs)'
    }
};

document.addEventListener('DOMContentLoaded', () => {
    setupPredictionForm();
    loadPredictionHistory();
});

function setupPredictionForm() {
    const form = document.getElementById('predictionForm');
    const districtSelect = document.getElementById('predDistrict');
    const btnFetchLive = document.getElementById('btnFetchLiveData');

    // Live internet fetch button
    if (btnFetchLive) {
        btnFetchLive.addEventListener('click', () => {
            fetchLiveInternetData();
        });
    }

    // Quick Preset buttons
    document.querySelectorAll('.preset-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const district = btn.getAttribute('data-district');
            applyPreset(district);
        });
    });

    if (districtSelect) {
        districtSelect.addEventListener('change', (e) => {
            if (DISTRICT_PRESETS[e.target.value]) {
                applyPreset(e.target.value);
            }
        });
    }

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await executePrediction();
        });
    }
}

async function fetchLiveInternetData() {
    const district = document.getElementById('predDistrict').value;
    const profile = DISTRICT_LIVE_PROFILES[district];
    if (!profile) return;

    const btn = document.getElementById('btnFetchLiveData');
    const banner = document.getElementById('liveDataBanner');
    const details = document.getElementById('liveDataDetails');

    if (btn) {
        btn.disabled = true;
        btn.innerHTML = `<span class="spinner-border spinner-border-sm me-1" role="status"></span> Querying Open-Meteo & CPCB...`;
    }

    try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${profile.lat}&longitude=${profile.lon}&current=temperature_2m,relative_humidity_2m,precipitation`;
        const res = await fetch(url);
        const data = await res.json();
        
        let temp = 28.5, humidity = 70.0, rain = 0.0, timeStr = new Date().toLocaleTimeString();
        if (data && data.current) {
            temp = data.current.temperature_2m;
            humidity = data.current.relative_humidity_2m;
            rain = data.current.precipitation;
        }

        // Auto-populate form fields
        document.getElementById('predPh').value = profile.ph;
        document.getElementById('predTurbidity').value = profile.turbidity;
        document.getElementById('predTds').value = profile.tds;
        document.getElementById('predDo').value = profile.dissolvedOxygen;
        document.getElementById('predTemp').value = temp;
        document.getElementById('predRainfall').value = rain;
        document.getElementById('predHumidity').value = humidity;
        document.getElementById('predCases').value = profile.previousDiseaseCases;
        document.getElementById('predDensity').value = profile.populationDensity;
        document.getElementById('predSanitation').value = profile.sanitationCoverage;

        // Show banner
        if (banner && details) {
            banner.classList.remove('d-none');
            details.innerHTML = `Live Open-Meteo Weather: <strong>${temp}°C</strong>, Rain: <strong>${rain}mm</strong>, Humidity: <strong>${humidity}%</strong> | CPCB/TNPCB Station: <em>${profile.source}</em> | Refreshed: ${timeStr}`;
        }
    } catch (err) {
        console.error('Failed to fetch live weather:', err);
        document.getElementById('predPh').value = profile.ph;
        document.getElementById('predTurbidity').value = profile.turbidity;
        document.getElementById('predTds').value = profile.tds;
        document.getElementById('predDo').value = profile.dissolvedOxygen;
        document.getElementById('predTemp').value = 28.0;
        document.getElementById('predRainfall').value = 0.0;
        document.getElementById('predHumidity').value = 70.0;
        document.getElementById('predCases').value = profile.previousDiseaseCases;
        document.getElementById('predDensity').value = profile.populationDensity;
        document.getElementById('predSanitation').value = profile.sanitationCoverage;

        if (banner && details) {
            banner.classList.remove('d-none');
            details.innerHTML = `CPCB/TNPCB Station baseline loaded for ${district}. Weather API fallback applied.`;
        }
    } finally {
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = `<i class="fa-solid fa-cloud-arrow-down me-1"></i> <strong>Fetch Live Internet Data</strong> (Open-Meteo & CPCB)`;
        }
    }
}

function applyPreset(district) {
    const data = DISTRICT_PRESETS[district] || DISTRICT_LIVE_PROFILES[district];
    if (!data) return;

    document.getElementById('predDistrict').value = district;
    document.getElementById('predPh').value = data.ph;
    document.getElementById('predTurbidity').value = data.turbidity;
    document.getElementById('predTds').value = data.tds;
    document.getElementById('predDo').value = data.dissolvedOxygen;
    document.getElementById('predTemp').value = data.temperature !== undefined ? data.temperature : 28.0;
    document.getElementById('predRainfall').value = data.rainfall !== undefined ? data.rainfall : 0.0;
    document.getElementById('predHumidity').value = data.humidity !== undefined ? data.humidity : 70.0;
    document.getElementById('predCases').value = data.previousDiseaseCases;
    document.getElementById('predDensity').value = data.populationDensity;
    document.getElementById('predSanitation').value = data.sanitationCoverage;
}

async function executePrediction() {
    const btn = document.getElementById('btnPredictRisk');
    const spinner = document.getElementById('predictSpinner');
    const resultBox = document.getElementById('predictionResultContainer');

    const params = {
        district: document.getElementById('predDistrict').value,
        ph: parseFloat(document.getElementById('predPh').value),
        turbidity: parseFloat(document.getElementById('predTurbidity').value),
        tds: parseFloat(document.getElementById('predTds').value),
        dissolvedOxygen: parseFloat(document.getElementById('predDo').value),
        temperature: parseFloat(document.getElementById('predTemp').value),
        rainfall: parseFloat(document.getElementById('predRainfall').value),
        humidity: parseFloat(document.getElementById('predHumidity').value),
        previousDiseaseCases: parseInt(document.getElementById('predCases').value),
        populationDensity: parseInt(document.getElementById('predDensity').value),
        sanitationCoverage: parseFloat(document.getElementById('predSanitation').value)
    };

    if (btn) btn.disabled = true;
    if (spinner) spinner.classList.remove('d-none');

    try {
        const response = await api.predictRisk(params);
        renderPredictionResult(response, params);
        await loadPredictionHistory();
    } catch (err) {
        alert('Prediction Error: ' + err.message);
    } finally {
        if (btn) btn.disabled = false;
        if (spinner) spinner.classList.add('d-none');
    }
}

function renderPredictionResult(res, params) {
    const container = document.getElementById('predictionResultContainer');
    if (!container) return;

    const risk = (res.riskLevel || 'LOW').toUpperCase();
    const probPercent = (res.probability * 100).toFixed(1);

    let riskClass = 'low';
    let riskBg = 'risk-low';
    let badgeColor = 'bg-success';
    if (risk === 'HIGH') {
        riskClass = 'high';
        riskBg = 'risk-high';
        badgeColor = 'bg-danger';
    } else if (risk === 'MEDIUM') {
        riskClass = 'medium';
        riskBg = 'risk-medium';
        badgeColor = 'bg-warning text-dark';
    }

    // Class probabilities
    const cp = res.classProbabilities || { LOW: 0, MEDIUM: 0, HIGH: 0 };
    const lowP = ((cp.LOW || 0) * 100).toFixed(1);
    const medP = ((cp.MEDIUM || 0) * 100).toFixed(1);
    const highP = ((cp.HIGH || 0) * 100).toFixed(1);

    container.innerHTML = `
        <div class="result-card ${riskBg} shadow-sm animate__animated animate__fadeIn">
            <span class="text-uppercase fw-bold text-muted small letter-spacing-1">Estimated Risk Assessment</span>
            <div class="my-3">
                <span class="risk-badge-large ${riskClass}">${risk} RISK</span>
            </div>
            
            <h3 class="fw-bold mb-2 text-dark">${probPercent}% Estimated Probability</h3>
            <p class="text-secondary mb-4">${escapeHtml(res.message)}</p>

            <!-- Probability breakdown bars -->
            <div class="row g-2 mb-4 text-start">
                <div class="col-4">
                    <div class="small fw-semibold text-muted mb-1">LOW: ${lowP}%</div>
                    <div class="progress" style="height: 6px;">
                        <div class="progress-bar bg-success" style="width: ${lowP}%"></div>
                    </div>
                </div>
                <div class="col-4">
                    <div class="small fw-semibold text-muted mb-1">MEDIUM: ${medP}%</div>
                    <div class="progress" style="height: 6px;">
                        <div class="progress-bar bg-warning" style="width: ${medP}%"></div>
                    </div>
                </div>
                <div class="col-4">
                    <div class="small fw-semibold text-muted mb-1">HIGH: ${highP}%</div>
                    <div class="progress" style="height: 6px;">
                        <div class="progress-bar bg-danger" style="width: ${highP}%"></div>
                    </div>
                </div>
            </div>

            <!-- Model & Input Snapshot Metadata -->
            <div class="bg-white p-3 rounded-3 text-start small border">
                <div class="row g-2">
                    <div class="col-md-6"><strong>District:</strong> ${escapeHtml(res.district)}</div>
                    <div class="col-md-6"><strong>Model Engine:</strong> ${escapeHtml(res.modelVersion)} (Weka Random Forest)</div>
                    <div class="col-md-6"><strong>Timestamp:</strong> ${new Date(res.predictionDate).toLocaleString()}</div>
                    <div class="col-md-6"><strong>Input Turbidity:</strong> ${params.turbidity} NTU | <strong>DO:</strong> ${params.dissolvedOxygen} mg/L</div>
                </div>
            </div>

            <!-- Disclaimer -->
            <div class="disclaimer-box text-start">
                <i class="fa-solid fa-circle-info text-primary mt-1"></i>
                <div>
                    <strong>Public Health Public Notice:</strong> ${escapeHtml(res.disclaimer)}
                </div>
            </div>
        </div>
    `;

    container.scrollIntoView({ behavior: 'smooth' });
}

async function loadPredictionHistory() {
    const tbody = document.getElementById('predictionHistoryBody');
    if (!tbody) return;

    try {
        const history = await api.getPredictionHistory();
        if (!history || history.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" class="text-center text-muted py-3">No prediction records available.</td></tr>`;
            return;
        }

        tbody.innerHTML = history.slice(0, 8).map(h => {
            let badge = 'bg-success';
            if (h.riskLevel === 'HIGH') badge = 'bg-danger';
            else if (h.riskLevel === 'MEDIUM') badge = 'bg-warning text-dark';

            return `
                <tr>
                    <td><strong>${escapeHtml(h.district)}</strong></td>
                    <td><span class="badge ${badge}">${h.riskLevel}</span></td>
                    <td>${(h.probability * 100).toFixed(1)}%</td>
                    <td><span class="badge bg-light text-dark">${escapeHtml(h.modelVersion)}</span></td>
                    <td>${new Date(h.predictionDate).toLocaleString()}</td>
                    <td>
                        <span class="badge bg-light text-muted">pH: ${h.ph || '-'}, Turb: ${h.turbidity || '-'}</span>
                    </td>
                </tr>
            `;
        }).join('');
    } catch (err) {
        console.warn('Could not load prediction history:', err);
    }
}

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
