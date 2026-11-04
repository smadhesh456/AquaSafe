/**
 * AquaSafe Machine Learning Prediction Controller
 * Submits environmental/sanitary features to Weka Random Forest model
 * Tailored for all 38 Tamil Nadu Districts
 */

const TAMIL_NADU_DISTRICTS = {
    'Ariyalur': { lat: 11.1401, lon: 79.0786, zone: 'Central', ph: 7.4, turbidity: 3.8, tds: 420, do: 6.2, waterTemp: 27.5, popDensity: 390, sanitation: 72.4, cleanWater: 89.2, cases: 14, source: 'Marudaiyaru River Basin' },
    'Chengalpattu': { lat: 12.6841, lon: 79.9836, zone: 'North', ph: 7.2, turbidity: 4.1, tds: 480, do: 5.8, waterTemp: 28.2, popDensity: 860, sanitation: 89.1, cleanWater: 94.5, cases: 18, source: 'Palar River & Maduranthakam Lake' },
    'Chennai': { lat: 13.0827, lon: 80.2707, zone: 'North', ph: 7.35, turbidity: 4.6, tds: 510, do: 5.4, waterTemp: 29.0, popDensity: 26553, sanitation: 92.5, cleanWater: 96.0, cases: 26, source: 'Red Hills / Chembarambakkam System' },
    'Coimbatore': { lat: 11.0168, lon: 76.9558, zone: 'West', ph: 7.2, turbidity: 1.8, tds: 210, do: 7.2, waterTemp: 25.4, popDensity: 748, sanitation: 88.5, cleanWater: 93.8, cases: 5, source: 'Siruvani Catchment & Bhavani Basin' },
    'Cuddalore': { lat: 11.7480, lon: 79.7714, zone: 'North', ph: 6.9, turbidity: 5.8, tds: 610, do: 4.9, waterTemp: 28.5, popDensity: 702, sanitation: 76.8, cleanWater: 88.0, cases: 28, source: 'Gadilam & Pennaiyar River Basin' },
    'Dharmapuri': { lat: 12.1211, lon: 78.1582, zone: 'West', ph: 7.6, turbidity: 3.5, tds: 530, do: 6.1, waterTemp: 27.8, popDensity: 335, sanitation: 71.0, cleanWater: 87.2, cases: 16, source: 'Chinnar & Vaniyar River System' },
    'Dindigul': { lat: 10.3673, lon: 77.9803, zone: 'South', ph: 7.5, turbidity: 3.9, tds: 580, do: 5.9, waterTemp: 28.0, popDensity: 357, sanitation: 75.2, cleanWater: 89.5, cases: 19, source: 'Kamarajar Lake & Kodaganar River' },
    'Erode': { lat: 11.3410, lon: 77.7172, zone: 'West', ph: 7.1, turbidity: 3.2, tds: 440, do: 6.5, waterTemp: 27.2, popDensity: 397, sanitation: 83.4, cleanWater: 92.1, cases: 12, source: 'Bhavani River & Cauvery Confluence' },
    'Kallakurichi': { lat: 11.7383, lon: 78.9639, zone: 'North', ph: 7.3, turbidity: 4.4, tds: 490, do: 5.6, waterTemp: 28.0, popDensity: 440, sanitation: 73.1, cleanWater: 88.5, cases: 21, source: 'Gomukhi Dam & Manimuktha River' },
    'Kanchipuram': { lat: 12.8342, lon: 79.7036, zone: 'North', ph: 7.4, turbidity: 3.6, tds: 460, do: 6.0, waterTemp: 28.1, popDensity: 927, sanitation: 86.4, cleanWater: 93.0, cases: 15, source: 'Vegavathi River & Palar Canal' },
    'Kanyakumari': { lat: 8.0883, lon: 77.5385, zone: 'South', ph: 7.0, turbidity: 1.9, tds: 180, do: 7.4, waterTemp: 26.8, popDensity: 1119, sanitation: 97.2, cleanWater: 97.8, cases: 4, source: 'Pechiparai & Perunchani Catchments' },
    'Karur': { lat: 10.9601, lon: 78.0766, zone: 'Central', ph: 7.6, turbidity: 4.5, tds: 650, do: 5.2, waterTemp: 28.8, popDensity: 373, sanitation: 77.5, cleanWater: 90.1, cases: 22, source: 'Amaravathi & Cauvery Confluence' },
    'Krishnagiri': { lat: 12.5186, lon: 78.2137, zone: 'West', ph: 7.3, turbidity: 3.1, tds: 390, do: 6.6, waterTemp: 26.9, popDensity: 370, sanitation: 74.8, cleanWater: 89.0, cases: 13, source: 'Krishnagiri Reservoir & South Pennar' },
    'Madurai': { lat: 9.9252, lon: 78.1198, zone: 'South', ph: 7.6, turbidity: 4.8, tds: 690, do: 5.3, waterTemp: 29.2, popDensity: 819, sanitation: 81.0, cleanWater: 91.5, cases: 24, source: 'Vaigai Reservoir Basin System' },
    'Mayiladuthurai': { lat: 11.1075, lon: 79.6524, zone: 'Central', ph: 7.2, turbidity: 4.9, tds: 520, do: 5.5, waterTemp: 28.3, popDensity: 780, sanitation: 78.2, cleanWater: 89.6, cases: 20, source: 'Cauvery Delta Channel Distribution' },
    'Nagapattinam': { lat: 10.7672, lon: 79.8449, zone: 'Central', ph: 7.4, turbidity: 5.4, tds: 710, do: 5.1, waterTemp: 28.6, popDensity: 668, sanitation: 76.5, cleanWater: 87.5, cases: 25, source: 'Vettar River & Coastal Aquifers' },
    'Namakkal': { lat: 11.2189, lon: 78.1674, zone: 'West', ph: 7.5, turbidity: 3.4, tds: 490, do: 6.3, waterTemp: 27.9, popDensity: 506, sanitation: 80.2, cleanWater: 91.0, cases: 14, source: 'Cauvery River Scheme & Thirumanimutharu' },
    'Nilgiris': { lat: 11.4102, lon: 76.6950, zone: 'West', ph: 6.8, turbidity: 1.4, tds: 95, do: 8.5, waterTemp: 19.5, popDensity: 287, sanitation: 91.5, cleanWater: 96.2, cases: 2, source: 'Pykara Catchment & Western Ghats Springs' },
    'Perambalur': { lat: 11.2342, lon: 78.8820, zone: 'Central', ph: 7.5, turbidity: 3.9, tds: 540, do: 5.8, waterTemp: 28.1, popDensity: 321, sanitation: 71.9, cleanWater: 88.0, cases: 15, source: 'Vellar Basin & Deep Groundwater' },
    'Pudukkottai': { lat: 10.3797, lon: 78.8208, zone: 'Central', ph: 7.4, turbidity: 4.2, tds: 510, do: 5.7, waterTemp: 28.4, popDensity: 348, sanitation: 75.0, cleanWater: 88.7, cases: 18, source: 'Agniyar & Vellar River System' },
    'Ramanathapuram': { lat: 9.3639, lon: 78.8395, zone: 'South', ph: 7.8, turbidity: 5.6, tds: 820, do: 4.8, waterTemp: 29.5, popDensity: 330, sanitation: 69.4, cleanWater: 84.5, cases: 27, source: 'Gundar Basin & Desalinated Distribution' },
    'Ranipet': { lat: 12.9229, lon: 79.3326, zone: 'North', ph: 7.1, turbidity: 4.8, tds: 640, do: 5.1, waterTemp: 28.3, popDensity: 820, sanitation: 82.5, cleanWater: 91.0, cases: 23, source: 'Palar River Monitoring Section' },
    'Salem': { lat: 11.6643, lon: 78.1460, zone: 'West', ph: 6.9, turbidity: 5.9, tds: 570, do: 4.7, waterTemp: 28.9, popDensity: 665, sanitation: 75.5, cleanWater: 89.2, cases: 31, source: 'Mettur Dam Catchment & Tributaries' },
    'Sivaganga': { lat: 9.8433, lon: 78.4809, zone: 'South', ph: 7.5, turbidity: 4.0, tds: 560, do: 5.7, waterTemp: 28.7, popDensity: 328, sanitation: 73.8, cleanWater: 88.4, cases: 17, source: 'Vaigai Canal Distribution' },
    'Tenkasi': { lat: 8.9594, lon: 77.3152, zone: 'South', ph: 7.1, turbidity: 2.3, tds: 230, do: 7.1, waterTemp: 26.2, popDensity: 480, sanitation: 84.1, cleanWater: 93.5, cases: 7, source: 'Chittar River & Western Ghats Springs' },
    'Thanjavur': { lat: 10.7870, lon: 79.1378, zone: 'Central', ph: 7.3, turbidity: 4.6, tds: 490, do: 5.9, waterTemp: 28.2, popDensity: 705, sanitation: 81.3, cleanWater: 92.0, cases: 20, source: 'Cauvery / Vennar Delta Network' },
    'Theni': { lat: 10.0104, lon: 77.4768, zone: 'South', ph: 7.2, turbidity: 2.6, tds: 270, do: 6.9, waterTemp: 26.5, popDensity: 433, sanitation: 82.0, cleanWater: 92.8, cases: 8, source: 'Vaigai Headwaters & Suruli Falls' },
    'Thoothukudi': { lat: 8.7642, lon: 78.1348, zone: 'South', ph: 7.7, turbidity: 4.9, tds: 740, do: 5.2, waterTemp: 29.1, popDensity: 368, sanitation: 80.5, cleanWater: 90.0, cases: 22, source: 'Thamirabarani River Coastal Reach' },
    'Tiruchirappalli': { lat: 10.7905, lon: 78.7047, zone: 'Central', ph: 7.3, turbidity: 3.6, tds: 450, do: 6.3, waterTemp: 28.4, popDensity: 601, sanitation: 85.0, cleanWater: 93.6, cases: 16, source: 'Cauvery & Kollidam Collector Wells' },
    'Tirunelveli': { lat: 8.7139, lon: 77.7567, zone: 'South', ph: 7.1, turbidity: 2.4, tds: 240, do: 7.0, waterTemp: 27.0, popDensity: 458, sanitation: 83.7, cleanWater: 93.2, cases: 9, source: 'Thamirabarani Perennial System' },
    'Tirupathur': { lat: 12.4958, lon: 78.5678, zone: 'North', ph: 7.3, turbidity: 3.7, tds: 460, do: 6.1, waterTemp: 27.6, popDensity: 610, sanitation: 79.0, cleanWater: 90.5, cases: 15, source: 'Palar River Sub-Basin' },
    'Tiruppur': { lat: 11.1085, lon: 77.3411, zone: 'West', ph: 7.2, turbidity: 4.1, tds: 510, do: 5.8, waterTemp: 27.6, popDensity: 476, sanitation: 85.6, cleanWater: 93.0, cases: 17, source: 'Noyyal Basin & Bhavani Water Project' },
    'Tiruvallur': { lat: 13.1432, lon: 79.9083, zone: 'North', ph: 7.4, turbidity: 4.3, tds: 520, do: 5.6, waterTemp: 28.5, popDensity: 1098, sanitation: 84.2, cleanWater: 92.5, cases: 21, source: 'Poondi Reservoir & Kosasthalaiyar' },
    'Tiruvannamalai': { lat: 12.2253, lon: 79.0747, zone: 'North', ph: 7.4, turbidity: 3.9, tds: 470, do: 6.0, waterTemp: 28.0, popDensity: 399, sanitation: 76.0, cleanWater: 89.8, cases: 16, source: 'Sathanur Dam & South Pennar' },
    'Tiruvarur': { lat: 10.7725, lon: 79.6365, zone: 'Central', ph: 7.3, turbidity: 5.1, tds: 550, do: 5.4, waterTemp: 28.3, popDensity: 556, sanitation: 77.8, cleanWater: 89.0, cases: 23, source: 'Vennar & Kudamurutti Rivers' },
    'Vellore': { lat: 12.9165, lon: 79.1325, zone: 'North', ph: 7.5, turbidity: 4.2, tds: 580, do: 5.6, waterTemp: 28.6, popDensity: 648, sanitation: 82.1, cleanWater: 91.2, cases: 19, source: 'Palar River Deep Bed Wells' },
    'Viluppuram': { lat: 11.9401, lon: 79.4861, zone: 'North', ph: 7.3, turbidity: 4.5, tds: 500, do: 5.7, waterTemp: 28.2, popDensity: 482, sanitation: 74.2, cleanWater: 88.6, cases: 22, source: 'South Pennar & Gingee River' },
    'Virudhunagar': { lat: 9.5680, lon: 77.9624, zone: 'South', ph: 7.7, turbidity: 4.6, tds: 670, do: 5.3, waterTemp: 29.0, popDensity: 454, sanitation: 79.6, cleanWater: 90.8, cases: 21, source: 'Kousika & Gundar River Basin' }
};

const DISTRICT_PRESETS = {
    'Chennai': {
        ph: 7.35, turbidity: 4.6, tds: 510, do: 5.4, waterTemp: 29.0,
        temp: 29.5, rainfall: 45.0, precipitation: 45.0, humidity: 82.0,
        cases: 26, density: 26553, sanitation: 92.5, cleanWater: 96.0
    },
    'Salem': {
        ph: 6.90, turbidity: 5.9, tds: 570, do: 4.7, waterTemp: 28.9,
        temp: 31.0, rainfall: 38.0, precipitation: 38.0, humidity: 76.0,
        cases: 31, density: 665, sanitation: 75.5, cleanWater: 89.2
    },
    'Cuddalore': {
        ph: 6.90, turbidity: 5.8, tds: 610, do: 4.9, waterTemp: 28.5,
        temp: 30.2, rainfall: 52.0, precipitation: 52.0, humidity: 84.0,
        cases: 28, density: 702, sanitation: 76.8, cleanWater: 88.0
    },
    'Madurai': {
        ph: 7.60, turbidity: 4.8, tds: 690, do: 5.3, waterTemp: 29.2,
        temp: 32.5, rainfall: 15.0, precipitation: 15.0, humidity: 65.0,
        cases: 24, density: 819, sanitation: 81.0, cleanWater: 91.5
    },
    'Coimbatore': {
        ph: 7.20, turbidity: 1.8, tds: 210, do: 7.2, waterTemp: 25.4,
        temp: 26.5, rainfall: 12.0, precipitation: 12.0, humidity: 62.0,
        cases: 5, density: 748, sanitation: 88.5, cleanWater: 93.8
    },
    'Nilgiris': {
        ph: 6.80, turbidity: 1.4, tds: 95, do: 8.5, waterTemp: 19.5,
        temp: 18.2, rainfall: 22.0, precipitation: 22.0, humidity: 72.0,
        cases: 2, density: 287, sanitation: 91.5, cleanWater: 96.2
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

    if (btnFetchLive) {
        btnFetchLive.addEventListener('click', () => {
            fetchLiveInternetData();
        });
    }

    document.querySelectorAll('.preset-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const district = btn.getAttribute('data-district');
            applyPreset(district);
        });
    });

    if (districtSelect) {
        districtSelect.addEventListener('change', (e) => {
            const district = e.target.value;
            if (DISTRICT_PRESETS[district]) {
                applyPreset(district);
            } else if (TAMIL_NADU_DISTRICTS[district]) {
                applyBaseline(district);
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

function applyBaseline(district) {
    const d = TAMIL_NADU_DISTRICTS[district];
    if (!d) return;

    document.getElementById('predPh').value = d.ph;
    document.getElementById('predTurbidity').value = d.turbidity;
    document.getElementById('predTds').value = d.tds;
    document.getElementById('predDo').value = d.do;
    document.getElementById('predWaterTemp').value = d.waterTemp;
    document.getElementById('predCases').value = d.cases;
    document.getElementById('predDensity').value = d.popDensity;
    document.getElementById('predSanitation').value = d.sanitation;
    document.getElementById('predCleanWater').value = d.cleanWater;
}

function applyPreset(district) {
    const p = DISTRICT_PRESETS[district];
    if (!p) {
        applyBaseline(district);
        return;
    }

    document.getElementById('predDistrict').value = district;
    document.getElementById('predPh').value = p.ph;
    document.getElementById('predTurbidity').value = p.turbidity;
    document.getElementById('predTds').value = p.tds;
    document.getElementById('predDo').value = p.do;
    document.getElementById('predWaterTemp').value = p.waterTemp;
    document.getElementById('predTemp').value = p.temp;
    document.getElementById('predRainfall').value = p.rainfall;
    document.getElementById('predPrecipitation').value = p.precipitation;
    document.getElementById('predHumidity').value = p.humidity;
    document.getElementById('predCases').value = p.cases;
    document.getElementById('predDensity').value = p.density;
    document.getElementById('predSanitation').value = p.sanitation;
    document.getElementById('predCleanWater').value = p.cleanWater;
}

async function fetchLiveInternetData() {
    const district = document.getElementById('predDistrict').value;
    const profile = TAMIL_NADU_DISTRICTS[district];
    if (!profile) return;

    const btn = document.getElementById('btnFetchLiveData');
    const banner = document.getElementById('liveDataBanner');
    const details = document.getElementById('liveDataDetails');
    const badge = document.getElementById('liveDataStatusBadge');

    if (btn) {
        btn.disabled = true;
        btn.innerHTML = `<span class="spinner-border spinner-border-sm me-1" role="status"></span> Querying Open-Meteo REST API...`;
    }

    try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${profile.lat}&longitude=${profile.lon}&current=temperature_2m,relative_humidity_2m,precipitation,rain`;
        const res = await fetch(url);
        const data = await res.json();

        let temp = 29.5, humidity = 75.0, rain = 0.0, precip = 0.0;
        if (data && data.current) {
            temp = data.current.temperature_2m ?? temp;
            humidity = data.current.relative_humidity_2m ?? humidity;
            precip = data.current.precipitation ?? precip;
            rain = data.current.rain ?? precip;
        }

        // Apply baseline water + demographic values
        applyBaseline(district);

        // Update live weather values
        document.getElementById('predTemp').value = temp;
        document.getElementById('predRainfall').value = rain;
        document.getElementById('predPrecipitation').value = precip;
        document.getElementById('predHumidity').value = humidity;

        if (banner && details) {
            banner.classList.remove('d-none');
            if (badge) {
                badge.className = 'badge bg-success me-1';
                badge.innerHTML = `<i class="fa-solid fa-satellite-dish me-1"></i> LIVE`;
            }
            details.innerHTML = `Open-Meteo (Lat: ${profile.lat}, Lon: ${profile.lon}): <strong>${temp}°C</strong>, Rain: <strong>${rain}mm</strong>, Humidity: <strong>${humidity}%</strong> | CPCB Station: <em>${profile.source}</em> | Refreshed: ${new Date().toLocaleTimeString()}`;
        }
    } catch (err) {
        console.warn('Open-Meteo live query failed, falling back to stored surveillance records:', err);
        applyBaseline(district);

        if (banner && details) {
            banner.classList.remove('d-none');
            if (badge) {
                badge.className = 'badge bg-primary me-1';
                badge.innerHTML = `<i class="fa-solid fa-database me-1"></i> STORED`;
            }
            details.innerHTML = `Tamil Nadu TNPCB/CPCB baseline loaded for ${district}. Weather API fallback applied.`;
        }
    } finally {
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = `<i class="fa-solid fa-cloud-arrow-down me-1"></i> <strong>Fetch Live Weather & Indicators</strong> (Open-Meteo & CPCB)`;
        }
    }
}

async function executePrediction() {
    const btn = document.getElementById('btnPredictRisk');
    const spinner = document.getElementById('predictSpinner');

    const params = {
        district: document.getElementById('predDistrict').value,
        ph: parseFloat(document.getElementById('predPh').value),
        turbidity: parseFloat(document.getElementById('predTurbidity').value),
        tds: parseFloat(document.getElementById('predTds').value),
        dissolvedOxygen: parseFloat(document.getElementById('predDo').value),
        waterTemperature: parseFloat(document.getElementById('predWaterTemp').value),
        temperature: parseFloat(document.getElementById('predTemp').value),
        rainfall: parseFloat(document.getElementById('predRainfall').value),
        precipitation: parseFloat(document.getElementById('predPrecipitation').value),
        humidity: parseFloat(document.getElementById('predHumidity').value),
        previousDiseaseCases: parseInt(document.getElementById('predCases').value),
        populationDensity: parseFloat(document.getElementById('predDensity').value),
        sanitationCoverage: parseFloat(document.getElementById('predSanitation').value),
        cleanWaterCoverage: parseFloat(document.getElementById('predCleanWater').value)
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
    const probPercent = ((res.probability || 0.5) * 100).toFixed(1);

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

    const cp = res.classProbabilities || { LOW: 0, MEDIUM: 0, HIGH: 0 };
    const lowP = ((cp.LOW || 0) * 100).toFixed(1);
    const medP = ((cp.MEDIUM || 0) * 100).toFixed(1);
    const highP = ((cp.HIGH || 0) * 100).toFixed(1);

    // Feature contributions
    let contribHtml = '';
    if (res.featureContributions && Object.keys(res.featureContributions).length > 0) {
        const sorted = Object.entries(res.featureContributions)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);

        contribHtml = `
            <div class="mt-3 text-start">
                <div class="fw-semibold small text-muted text-uppercase mb-2">Key Factor Contributions to Risk:</div>
                ${sorted.map(([name, weight]) => {
                    const pct = (weight * 100).toFixed(1);
                    return `
                        <div class="mb-2">
                            <div class="d-flex justify-content-between small">
                                <span class="fw-semibold">${escapeHtml(name)}</span>
                                <span class="text-muted">${pct}%</span>
                            </div>
                            <div class="progress" style="height: 5px;">
                                <div class="progress-bar bg-primary" style="width: ${pct}%"></div>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    }

    const statusBadge = res.dataStatus === 'LIVE' 
        ? '<span class="badge bg-success"><i class="fa-solid fa-satellite-dish me-1"></i> LIVE DATA</span>'
        : (res.dataStatus === 'STORED' 
            ? '<span class="badge bg-primary"><i class="fa-solid fa-database me-1"></i> STORED SURVEILLANCE</span>'
            : '<span class="badge bg-secondary"><i class="fa-solid fa-vial me-1"></i> DEMO / TESTING</span>');

    container.innerHTML = `
        <div class="result-card ${riskBg} shadow-sm animate__animated animate__fadeIn">
            <div class="d-flex justify-content-between align-items-center mb-2">
                <span class="text-uppercase fw-bold text-muted small letter-spacing-1">Estimated Risk Assessment</span>
                ${statusBadge}
            </div>
            <div class="my-3">
                <span class="risk-badge-large ${riskClass}">${risk} RISK</span>
            </div>
            
            <h3 class="fw-bold mb-2 text-dark">${probPercent}% Estimated Probability</h3>
            <p class="text-secondary mb-3">${escapeHtml(res.message || 'Classification complete based on 13 environmental and sanitary indicators.')}</p>

            <!-- Probability breakdown bars -->
            <div class="row g-2 mb-3 text-start">
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

            <!-- Feature contributions breakdown -->
            ${contribHtml}

            <!-- Model & Input Snapshot Metadata -->
            <div class="bg-white p-3 rounded-3 text-start small border mt-3">
                <div class="row g-2">
                    <div class="col-md-6"><strong>District:</strong> ${escapeHtml(res.district)}</div>
                    <div class="col-md-6"><strong>Model Engine:</strong> ${escapeHtml(res.modelVersion || 'RandomForest-100Trees')} (Weka)</div>
                    <div class="col-md-6"><strong>Timestamp:</strong> ${res.predictionDate ? new Date(res.predictionDate).toLocaleString() : new Date().toLocaleString()}</div>
                    <div class="col-md-6"><strong>Turbidity:</strong> ${params.turbidity} NTU | <strong>DO:</strong> ${params.dissolvedOxygen} mg/L</div>
                    <div class="col-md-6"><strong>Air Temp:</strong> ${params.temperature}°C | <strong>Rain:</strong> ${params.rainfall} mm</div>
                    <div class="col-md-6"><strong>Sanitation:</strong> ${params.sanitationCoverage}% | <strong>Water:</strong> ${params.cleanWaterCoverage}%</div>
                </div>
            </div>

            <!-- Disclaimer -->
            <div class="disclaimer-box text-start mt-3">
                <i class="fa-solid fa-circle-info text-primary mt-1"></i>
                <div>
                    <strong>Public Health Notice:</strong> ${escapeHtml(res.disclaimer || 'AquaSafe predicts potential water-borne disease risk using environmental and epidemiological indicators. It does not provide medical diagnosis or confirm disease outbreaks. For medical emergencies or health concerns, consult certified healthcare professionals or government health authorities.')}
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
            tbody.innerHTML = `<tr><td colspan="7" class="text-center text-muted py-3">No prediction records available.</td></tr>`;
            return;
        }

        tbody.innerHTML = history.slice(0, 8).map(h => {
            let badge = 'bg-success';
            if (h.riskLevel === 'HIGH') badge = 'bg-danger';
            else if (h.riskLevel === 'MEDIUM') badge = 'bg-warning text-dark';

            const statusBadge = h.dataStatus === 'LIVE' 
                ? '<span class="badge bg-success">LIVE</span>' 
                : (h.dataStatus === 'STORED' ? '<span class="badge bg-primary">STORED</span>' : '<span class="badge bg-secondary">DEMO</span>');

            return `
                <tr>
                    <td><strong>${escapeHtml(h.district)}</strong></td>
                    <td><span class="badge ${badge}">${h.riskLevel}</span></td>
                    <td>${((h.probability || 0) * 100).toFixed(1)}%</td>
                    <td>${statusBadge}</td>
                    <td><span class="badge bg-light text-dark">${escapeHtml(h.modelVersion || 'RandomForest')}</span></td>
                    <td>${h.predictionDate ? new Date(h.predictionDate).toLocaleString() : '-'}</td>
                    <td>
                        <span class="badge bg-light text-muted">pH: ${h.ph || '-'}, Turb: ${h.turbidity || '-'}, Rain: ${h.rainfall || '-'}mm</span>
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
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
