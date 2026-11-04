/**
 * AquaSafe Interactive Geospatial Risk Map Controller
 * Focuses on all 38 Districts of Tamil Nadu using Leaflet.js
 */

let mapInstance = null;
let markersLayer = null;
let allDistrictData = [];
let currentFilter = 'ALL';
let currentZone = 'ALL';
let selectedDistrict = null;

document.addEventListener('DOMContentLoaded', async () => {
    initRiskMap();
    await loadMapData();
    setupFilters();
});

function initRiskMap() {
    const mapContainer = document.getElementById('riskMap');
    if (!mapContainer) return;

    // Centered on Tamil Nadu (Coordinates: 11.1271° N, 78.6569° E, Zoom: 7)
    mapInstance = L.map('riskMap', {
        center: [11.1271, 78.6569],
        zoom: 7,
        minZoom: 6,
        maxZoom: 14
    });

    // CartoDB Voyager / OpenStreetMap Clean Tile Layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | AquaSafe Surveillance'
    }).addTo(mapInstance);

    markersLayer = L.layerGroup().addTo(mapInstance);

    // Map Legend Control
    const legend = L.control({ position: 'bottomright' });
    legend.onAdd = function () {
        const div = L.DomUtil.create('div', 'map-legend p-3 rounded shadow-sm bg-white');
        div.innerHTML = `
            <div class="fw-bold mb-1 small text-dark"><i class="fa-solid fa-layer-group me-1"></i> Predicted Risk Level</div>
            <div class="d-flex align-items-center mb-1"><span class="legend-dot me-2" style="background:#ef4444; width:12px; height:12px; border-radius:50%; display:inline-block;"></span> High Risk Condition</div>
            <div class="d-flex align-items-center mb-1"><span class="legend-dot me-2" style="background:#f59e0b; width:12px; height:12px; border-radius:50%; display:inline-block;"></span> Moderate Risk</div>
            <div class="d-flex align-items-center"><span class="legend-dot me-2" style="background:#10b981; width:12px; height:12px; border-radius:50%; display:inline-block;"></span> Low Risk Nominal</div>
        `;
        return div;
    };
    legend.addTo(mapInstance);
}

async function loadMapData() {
    try {
        let districts = [];
        try {
            districts = await api.getDistricts();
        } catch {
            districts = await api.getPopulation();
        }

        // Fetch latest predictions & weather
        const [predictions, weatherList] = await Promise.allSettled([
            api.getPredictionHistory(),
            api.getCurrentWeatherAll()
        ]);

        const predMap = {};
        if (predictions.status === 'fulfilled' && predictions.value) {
            predictions.value.forEach(p => {
                const k = p.district.toLowerCase();
                if (!predMap[k]) predMap[k] = p;
            });
        }

        const weatherMap = {};
        if (weatherList.status === 'fulfilled' && weatherList.value) {
            weatherList.value.forEach(w => {
                weatherMap[w.district.toLowerCase()] = w;
            });
        }

        // Build composite district dataset
        allDistrictData = districts.map(d => {
            const name = d.name || d.district;
            const k = name.toLowerCase();
            const pred = predMap[k] || {
                riskLevel: 'LOW',
                probability: 0.85,
                modelVersion: 'RandomForest-v2.0-TN',
                dataStatus: 'STORED'
            };
            const weather = weatherMap[k] || {
                temperature: 29.5,
                rainfall: 5.0,
                humidity: 70.0,
                weatherCondition: 'Partly Cloudy',
                dataStatus: 'STORED'
            };

            return {
                name,
                zone: d.zone || 'Central',
                state: d.state || 'Tamil Nadu',
                latitude: d.latitude,
                longitude: d.longitude,
                population: d.population || 1500000,
                density: d.populationDensity || d.density || 500,
                sanitation: d.sanitationCoverage || d.sanitation || 82.0,
                waterAccess: d.cleanWaterCoverage || 92.0,
                waterSource: d.waterSource || 'River Basin / Deep Aquifers',
                prediction: pred,
                weather: weather
            };
        });

        renderMarkers();

        // Automatically inspect first district (Chennai or Ariyalur)
        if (allDistrictData.length > 0) {
            const chennai = allDistrictData.find(d => d.name.toLowerCase() === 'chennai') || allDistrictData[0];
            inspectDistrict(chennai);
        }
    } catch (err) {
        console.error('Failed to load map data:', err);
    }
}

function renderMarkers() {
    if (!markersLayer) return;
    markersLayer.clearLayers();

    allDistrictData.forEach(dist => {
        const risk = dist.prediction.riskLevel.toUpperCase();
        const zone = dist.zone;

        // Apply filters
        if (currentFilter !== 'ALL' && risk !== currentFilter) return;
        if (currentZone !== 'ALL' && zone !== currentZone) return;

        let color = '#10b981'; // Green
        let fillColor = '#34d399';
        let radius = 10;

        if (risk === 'HIGH') {
            color = '#dc2626';
            fillColor = '#ef4444';
            radius = 14;
        } else if (risk === 'MEDIUM') {
            color = '#d97706';
            fillColor = '#f59e0b';
            radius = 12;
        }

        const marker = L.circleMarker([dist.latitude, dist.longitude], {
            radius: radius,
            color: color,
            weight: 2.5,
            fillColor: fillColor,
            fillOpacity: 0.85
        });

        // Popup
        marker.bindPopup(`
            <div class="p-1 text-center" style="min-width: 170px;">
                <h6 class="fw-bold mb-1">${dist.name}</h6>
                <div class="badge ${risk === 'HIGH' ? 'bg-danger' : (risk === 'MEDIUM' ? 'bg-warning text-dark' : 'bg-success')} mb-2">
                    ${risk} RISK (${(dist.prediction.probability * 100).toFixed(1)}%)
                </div>
                <div class="small text-muted mb-2">
                    <div>Temp: ${dist.weather.temperature}°C | Rain: ${dist.weather.rainfall}mm</div>
                    <div>Status: <span class="badge ${dist.weather.dataStatus === 'LIVE' ? 'bg-success' : 'bg-secondary'}">${dist.weather.dataStatus || 'STORED'}</span></div>
                </div>
                <button class="btn btn-outline-primary btn-sm w-100" onclick="window.selectDistrictByName('${dist.name}')">
                    Inspect District
                </button>
            </div>
        `);

        marker.on('click', () => {
            inspectDistrict(dist);
        });

        markersLayer.addLayer(marker);
    });
}

function inspectDistrict(dist) {
    selectedDistrict = dist;
    const emptyState = document.getElementById('inspEmptyState');
    const content = document.getElementById('inspDataContent');
    if (emptyState) emptyState.style.display = 'none';
    if (content) content.style.display = 'block';

    document.getElementById('inspDistrictName').textContent = dist.name;
    document.getElementById('inspZoneState').textContent = `${dist.zone} Zone • Tamil Nadu, India`;

    const riskBadge = document.getElementById('inspRiskBadge');
    const risk = dist.prediction.riskLevel.toUpperCase();
    riskBadge.textContent = `${risk} RISK (${(dist.prediction.probability * 100).toFixed(1)}%)`;
    riskBadge.className = `badge px-3 py-2 fs-6 ${risk === 'HIGH' ? 'bg-danger' : (risk === 'MEDIUM' ? 'bg-warning text-dark' : 'bg-success')}`;

    // Weather
    const w = dist.weather;
    document.getElementById('inspTemp').textContent = `${w.temperature}°C`;
    document.getElementById('inspRain').textContent = `${w.rainfall} mm`;
    document.getElementById('inspHumidity').textContent = `${w.humidity}%`;
    document.getElementById('inspWeatherCondition').textContent = `Condition: ${w.weatherCondition || 'Partly Cloudy'}`;

    const wStat = document.getElementById('inspWeatherStatus');
    if (wStat) {
        wStat.textContent = w.dataStatus || 'STORED';
        wStat.className = `badge ${w.dataStatus === 'LIVE' ? 'bg-success' : 'bg-secondary'}`;
    }

    // Water Quality
    const p = dist.prediction;
    document.getElementById('inspPh').textContent = p.ph ? p.ph.toFixed(2) : '7.30';
    document.getElementById('inspTurbidity').textContent = p.turbidity ? p.turbidity.toFixed(2) : '3.20';
    document.getElementById('inspTds').textContent = p.tds ? p.tds.toFixed(0) : '480';
    document.getElementById('inspDO').textContent = p.dissolvedOxygen ? p.dissolvedOxygen.toFixed(2) : '6.50';
    document.getElementById('inspWaterFacility').textContent = `Water Source: ${dist.waterSource}`;

    // Demographics
    document.getElementById('inspPopulation').textContent = Number(dist.population).toLocaleString('en-IN');
    document.getElementById('inspDensity').textContent = `${dist.density} /km²`;
    document.getElementById('inspSanitation').textContent = `${dist.sanitation}%`;
    document.getElementById('inspWaterAccess').textContent = `${dist.waterAccess}%`;

    // Contributions / Risk factors
    const contribEl = document.getElementById('inspContributions');
    if (p.featureContributions) {
        const factors = typeof p.featureContributions === 'string' 
            ? p.featureContributions.split('; ') 
            : p.featureContributions;
        contribEl.innerHTML = factors.map(f => `<div class="mb-1"><i class="fa-solid fa-circle-dot text-danger me-1"></i> ${f}</div>`).join('');
    } else {
        contribEl.innerHTML = `<div class="text-success"><i class="fa-solid fa-circle-check me-1"></i> All parameters within nominal environmental baselines.</div>`;
    }

    // Bind Live Re-Predict button
    const btnSync = document.getElementById('btnLiveSyncDistrict');
    if (btnSync) {
        btnSync.onclick = async () => {
            btnSync.disabled = true;
            btnSync.innerHTML = '<i class="fa-solid fa-spinner fa-spin me-1"></i> Querying Open-Meteo...';
            try {
                const fresh = await api.predictRiskAuto(dist.name);
                dist.prediction = fresh;
                if (fresh.inputParameters) {
                    dist.weather.temperature = fresh.inputParameters.airTemperature;
                    dist.weather.rainfall = fresh.inputParameters.rainfall;
                    dist.weather.humidity = fresh.inputParameters.humidity;
                    dist.weather.dataStatus = fresh.dataStatus;
                }
                inspectDistrict(dist);
                renderMarkers();
            } catch (err) {
                alert(`Could not fetch live prediction for ${dist.name}: ` + err.message);
            } finally {
                btnSync.disabled = false;
                btnSync.innerHTML = '<i class="fa-solid fa-arrows-rotate me-1"></i> Sync Live Weather & Re-Predict';
            }
        };
    }
}

window.selectDistrictByName = function(name) {
    const found = allDistrictData.find(d => d.name.toLowerCase() === name.toLowerCase());
    if (found) {
        inspectDistrict(found);
        mapInstance.setView([found.latitude, found.longitude], 9);
    }
};

function setupFilters() {
    const btnAll = document.getElementById('filterAll');
    const btnHigh = document.getElementById('filterHigh');
    const btnMed = document.getElementById('filterMed');
    const btnLow = document.getElementById('filterLow');
    const zoneSel = document.getElementById('zoneFilter');

    const buttons = [btnAll, btnHigh, btnMed, btnLow];

    function setActiveBtn(btn) {
        buttons.forEach(b => { if (b) b.classList.remove('active'); });
        if (btn) btn.classList.add('active');
    }

    if (btnAll) btnAll.addEventListener('click', () => { currentFilter = 'ALL'; setActiveBtn(btnAll); renderMarkers(); });
    if (btnHigh) btnHigh.addEventListener('click', () => { currentFilter = 'HIGH'; setActiveBtn(btnHigh); renderMarkers(); });
    if (btnMed) btnMed.addEventListener('click', () => { currentFilter = 'MEDIUM'; setActiveBtn(btnMed); renderMarkers(); });
    if (btnLow) btnLow.addEventListener('click', () => { currentFilter = 'LOW'; setActiveBtn(btnLow); renderMarkers(); });

    if (zoneSel) {
        zoneSel.addEventListener('change', (e) => {
            currentZone = e.target.value;
            renderMarkers();
        });
    }
}
