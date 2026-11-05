/**
 * AquaSafe REST API Client Module
 * Communicates with the Spring Boot backend service
 */

const API_BASE = window.location.origin.includes('8080') 
    ? window.location.origin + '/api' 
    : 'http://localhost:8080/api';

const api = {
    // Auth Helpers
    getToken() {
        return localStorage.getItem('aquasafe_token');
    },

    getUser() {
        const user = localStorage.getItem('aquasafe_user');
        return user ? JSON.parse(user) : { username: 'Analyst', role: 'USER' };
    },

    setUser(userData) {
        localStorage.setItem('aquasafe_user', JSON.stringify(userData));
        if (userData.token) {
            localStorage.setItem('aquasafe_token', userData.token);
        }
    },

    logout() {
        localStorage.removeItem('aquasafe_token');
        localStorage.removeItem('aquasafe_user');
        window.location.href = 'login.html';
    },

    async request(endpoint, options = {}) {
        const url = `${API_BASE}${endpoint}`;
        const headers = options.headers || {};

        if (!(options.body instanceof FormData)) {
            headers['Content-Type'] = 'application/json';
        }

        const token = this.getToken();
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        try {
            const response = await fetch(url, {
                ...options,
                headers
            });

            if (!response.ok) {
                let errData;
                try {
                    errData = await response.json();
                } catch {
                    errData = { message: `HTTP Error ${response.status}: ${response.statusText}` };
                }
                throw new Error(errData.message || 'Server request failed');
            }

            const contentType = response.headers.get('content-type') || '';
            if (contentType.includes('application/json')) {
                return await response.json();
            } else {
                const text = await response.text();
                return { message: text, success: true };
            }
        } catch (err) {
            console.error(`API Error [${endpoint}]:`, err.message);
            throw err;
        }
    },

    // 1. Dashboard Endpoints
    async getDashboardSummary() {
        return this.request('/dashboard/summary');
    },

    async getDiseaseTrends() {
        return this.request('/dashboard/disease-trends');
    },

    async getRainfallVsDisease() {
        return this.request('/dashboard/rainfall-vs-disease');
    },

    async getMonthlyDisease() {
        return this.request('/dashboard/monthly-disease');
    },

    async getWeatherTrends() {
        return this.request('/dashboard/weather-trends');
    },

    async getWaterQualityTrends() {
        return this.request('/dashboard/water-quality');
    },

    async getRiskDistribution() {
        return this.request('/dashboard/risk-distribution');
    },

    async getDistrictRisk() {
        return this.request('/dashboard/district-risk');
    },

    async getMonitoringPanel() {
        return this.request('/dashboard/monitoring');
    },

    // 2. Districts Registry (All 38 Districts)
    async getDistricts() {
        return this.request('/districts');
    },

    async getDistrict(name) {
        return this.request(`/districts/${encodeURIComponent(name)}`);
    },

    // 3. Water Quality
    async getWaterQuality(district = '', page = 0, size = 15) {
        const query = `?district=${encodeURIComponent(district)}&page=${page}&size=${size}`;
        return this.request(`/water-quality${query}`);
    },

    // 4. Weather Data (Open-Meteo)
    async getCurrentWeather(district = 'Chennai') {
        return this.request(`/weather/current?district=${encodeURIComponent(district)}`);
    },

    async getCurrentWeatherAll() {
        return this.request('/weather/current/all');
    },

    async getHistoricalWeather(district = '', page = 0, size = 15) {
        const query = `?district=${encodeURIComponent(district)}&page=${page}&size=${size}`;
        return this.request(`/weather${query}`);
    },

    async syncAllWeather() {
        return this.request('/weather/sync-all', { method: 'POST' });
    },

    // 5. Disease Surveillance
    async getDiseases(district = '', page = 0, size = 15) {
        const query = `?district=${encodeURIComponent(district)}&page=${page}&size=${size}`;
        return this.request(`/diseases${query}`);
    },

    // 6. Population & Demographics
    async getPopulation() {
        return this.request('/population');
    },

    // 7. Datasets & Ingestion
    async uploadDataset(formData) {
        const url = `${API_BASE}/datasets/upload`;
        const resp = await fetch(url, {
            method: 'POST',
            body: formData
        });
        if (!resp.ok) {
            const err = await resp.json();
            throw new Error(err.message || 'Dataset upload failed');
        }
        return await resp.json();
    },

    async getImportHistory() {
        return this.request('/datasets');
    },

    async getDataSources() {
        return this.request('/data-sources');
    },

    // 8. Data Validation & Preprocessing
    async runPreprocessing() {
        return this.request('/preprocessing/run', { method: 'POST' });
    },

    async getValidationReport() {
        return this.request('/validation/report');
    },

    async getPreprocessingLogs() {
        return this.request('/preprocessing/logs');
    },

    // 9. Data Collection Automation
    async getDataCollectionStatus() {
        return this.request('/data-collection/status');
    },

    async triggerDataCollection() {
        return this.request('/data-collection/trigger', { method: 'POST' });
    },

    // 10. ML Model Management
    async trainModel() {
        return this.request('/model/train', { method: 'POST' });
    },

    async getModelEvaluation() {
        return this.request('/model/evaluation');
    },

    // 11. Prediction Engine
    async predictRisk(params) {
        return this.request('/predictions/predict', {
            method: 'POST',
            body: JSON.stringify(params)
        });
    },

    async predictRiskAuto(district) {
        return this.request(`/predictions/auto/${encodeURIComponent(district)}`);
    },

    async predictAllDistricts() {
        return this.request('/predictions/predict-all', { method: 'POST' });
    },

    async getPredictionHistory() {
        return this.request('/predictions/history');
    },

    async getDistrictRiskSummary() {
        return this.request('/predictions/district-summary');
    },

    // 12. Alerts
    async getAlerts() {
        return this.request('/alerts');
    },

    async markAlertRead(id) {
        return this.request(`/alerts/${id}/read`, { method: 'PUT' });
    },

    // 13. Reports
    async getReports(district = '', startDate = '', endDate = '') {
        let query = '?';
        if (district) query += `district=${encodeURIComponent(district)}&`;
        if (startDate) query += `startDate=${startDate}&`;
        if (endDate) query += `endDate=${endDate}&`;
        return this.request(`/reports${query}`);
    },

    // 14. System & Big Data Processing
    async getSystemHealth() {
        return this.request('/system/health');
    },

    async triggerBigDataProcessing() {
        return this.request('/system/spark/process', { method: 'POST' });
    },

    // 15. Auth
    async login(username, password) {
        return this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ username, password })
        });
    },

    // 16. Real Data Acquisition & Integration Module (Nagapattinam & Tamil Nadu)
    async getAcquisitionParameters(district = 'Nagapattinam') {
        return this.request(`/acquisition/parameters/${encodeURIComponent(district)}`);
    },

    async refreshDistrictAcquisition(district = 'Nagapattinam') {
        return this.request(`/acquisition/refresh/${encodeURIComponent(district)}`, { method: 'POST' });
    },

    async getSourcesMonitoring() {
        return this.request('/acquisition/sources-monitoring');
    },

    async getAcquisitionDistricts() {
        return this.request('/acquisition/districts');
    },

    // Session UI Sync Helper
    initAuthUI() {
        try {
            const user = this.getUser();
            const nameEl = document.getElementById('navUsername');
            if (nameEl && user && user.username) {
                nameEl.textContent = user.username.toLowerCase() === 'admin' 
                    ? 'System Administrator' 
                    : (user.username.toLowerCase() === 'analyst' ? 'Public Health Analyst' : user.username);
            }
            const roleEl = document.getElementById('navUserRole');
            if (roleEl && user && user.role) {
                roleEl.textContent = `${user.role.toUpperCase()} ROLE`;
            }

            // Sync alert notification badge in navigation
            this.getAlerts().then(alerts => {
                if (!alerts) return;
                const unreadCount = alerts.filter(a => a.status === 'UNREAD').length;
                const sidebarBadge = document.getElementById('sidebarAlertBadge');
                if (sidebarBadge) {
                    sidebarBadge.textContent = unreadCount;
                    sidebarBadge.style.display = unreadCount > 0 ? 'inline-block' : 'none';
                }
                const navBadge = document.getElementById('navAlertCountBadge');
                if (navBadge) {
                    navBadge.textContent = unreadCount > 0 ? unreadCount : '!';
                    navBadge.style.display = unreadCount > 0 ? 'inline-block' : 'none';
                }
            }).catch(() => {});
        } catch (e) {
            console.debug('AquaSafe Auth UI init notice:', e);
        }
    }
};

window.api = api;

document.addEventListener('DOMContentLoaded', () => {
    api.initAuthUI();
});
