/**
 * AquaSafe Chart.js Visualizations
 * Multi-Series Epidemiological, Water Quality, and Meteorological Charts
 */

const AquaCharts = {
    diseaseChart: null,
    riskChart: null,
    rainfallChart: null,
    monthlyChart: null,
    waterChart: null,
    weatherChart: null,

    initDiseaseTrend(canvasId, trendData) {
        const ctx = document.getElementById(canvasId);
        if (!ctx) return;
        if (this.diseaseChart) this.diseaseChart.destroy();

        this.diseaseChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: trendData.labels || [],
                datasets: [
                    {
                        label: 'Diarrhea Cases',
                        data: trendData.diarrhea || [],
                        borderColor: '#0284c7',
                        backgroundColor: 'rgba(2, 132, 199, 0.08)',
                        fill: true,
                        tension: 0.35,
                        borderWidth: 2
                    },
                    {
                        label: 'Typhoid Cases',
                        data: trendData.typhoid || [],
                        borderColor: '#f59e0b',
                        backgroundColor: 'transparent',
                        tension: 0.35,
                        borderWidth: 2
                    },
                    {
                        label: 'Viral Hepatitis',
                        data: trendData.hepatitis || [],
                        borderColor: '#8b5cf6',
                        backgroundColor: 'transparent',
                        tension: 0.35,
                        borderWidth: 2
                    },
                    {
                        label: 'Cholera Cases',
                        data: trendData.cholera || [],
                        borderColor: '#ef4444',
                        backgroundColor: 'transparent',
                        tension: 0.35,
                        borderWidth: 2
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'top', labels: { boxWidth: 12, font: { family: 'Inter', size: 12 } } },
                    tooltip: { mode: 'index', intersect: false }
                },
                scales: {
                    x: { grid: { display: false }, ticks: { font: { family: 'Inter', size: 11 } } },
                    y: { beginAtZero: true, title: { display: true, text: 'Reported Cases', font: { family: 'Inter', size: 11 } }, grid: { color: '#f1f5f9' } }
                }
            }
        });
    },

    initRiskDistribution(canvasId, distData) {
        const ctx = document.getElementById(canvasId);
        if (!ctx) return;
        if (this.riskChart) this.riskChart.destroy();

        this.riskChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: distData.labels || ['LOW', 'MEDIUM', 'HIGH'],
                datasets: [{
                    data: distData.data || [14, 18, 6],
                    backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
                    borderWidth: 3,
                    borderColor: '#ffffff',
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'bottom', labels: { boxWidth: 12, font: { family: 'Inter', size: 12 } } }
                },
                cutout: '70%'
            }
        });
    },

    initRainfallVsDisease(canvasId, data) {
        const ctx = document.getElementById(canvasId);
        if (!ctx) return;
        if (this.rainfallChart) this.rainfallChart.destroy();

        this.rainfallChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.dates || [],
                datasets: [
                    {
                        type: 'line',
                        label: 'Total Disease Cases',
                        data: data.cases || [],
                        borderColor: '#ef4444',
                        backgroundColor: 'transparent',
                        tension: 0.3,
                        borderWidth: 2.5,
                        yAxisID: 'y1'
                    },
                    {
                        type: 'bar',
                        label: 'Avg Rainfall (mm)',
                        data: data.rainfall || [],
                        backgroundColor: 'rgba(2, 132, 199, 0.55)',
                        borderColor: '#0284c7',
                        borderWidth: 1,
                        borderRadius: 4,
                        yAxisID: 'y'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'top', labels: { boxWidth: 12, font: { family: 'Inter', size: 11 } } },
                    tooltip: { mode: 'index', intersect: false }
                },
                scales: {
                    x: { grid: { display: false }, ticks: { font: { family: 'Inter', size: 10 } } },
                    y: {
                        beginAtZero: true,
                        position: 'left',
                        title: { display: true, text: 'Rainfall (mm)', font: { family: 'Inter', size: 11 } },
                        grid: { color: '#f1f5f9' }
                    },
                    y1: {
                        beginAtZero: true,
                        position: 'right',
                        title: { display: true, text: 'Disease Cases', font: { family: 'Inter', size: 11 } },
                        grid: { display: false }
                    }
                }
            }
        });
    },

    initMonthlyDisease(canvasId, data) {
        const ctx = document.getElementById(canvasId);
        if (!ctx) return;
        if (this.monthlyChart) this.monthlyChart.destroy();

        this.monthlyChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.months || [],
                datasets: [{
                    label: 'Total Water-Borne Cases',
                    data: data.cases || [],
                    backgroundColor: 'rgba(13, 148, 136, 0.75)',
                    borderColor: '#0d9488',
                    borderWidth: 1.5,
                    borderRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    x: { grid: { display: false }, ticks: { font: { family: 'Inter', size: 11 } } },
                    y: { beginAtZero: true, title: { display: true, text: 'Monthly Cases', font: { family: 'Inter', size: 11 } }, grid: { color: '#f1f5f9' } }
                }
            }
        });
    },

    initWaterQualityVar(canvasId, data) {
        const ctx = document.getElementById(canvasId);
        if (!ctx) return;
        if (this.waterChart) this.waterChart.destroy();

        // Sample up to 12 districts for clear readable labels
        const labels = (data.districts || []).slice(0, 12);
        const turb = (data.turbidity || []).slice(0, 12);
        const doVal = (data.dissolvedOxygen || []).slice(0, 12);

        this.waterChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Mean Turbidity (NTU)',
                        data: turb,
                        backgroundColor: 'rgba(239, 68, 68, 0.75)',
                        borderRadius: 4
                    },
                    {
                        label: 'Dissolved Oxygen (mg/L)',
                        data: doVal,
                        backgroundColor: 'rgba(2, 132, 199, 0.75)',
                        borderRadius: 4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'top', labels: { boxWidth: 12, font: { family: 'Inter', size: 11 } } }
                },
                scales: {
                    x: { grid: { display: false }, ticks: { font: { family: 'Inter', size: 10 } } },
                    y: { beginAtZero: true, grid: { color: '#f1f5f9' } }
                }
            }
        });
    },

    initWeatherTrends(canvasId, data) {
        const ctx = document.getElementById(canvasId);
        if (!ctx) return;
        if (this.weatherChart) this.weatherChart.destroy();

        const labels = (data.districts || []).slice(0, 12);
        const temps = (data.temperature || []).slice(0, 12);
        const humids = (data.humidity || []).slice(0, 12);

        this.weatherChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Air Temp (°C)',
                        data: temps,
                        borderColor: '#f97316',
                        backgroundColor: 'transparent',
                        borderWidth: 2,
                        tension: 0.3
                    },
                    {
                        label: 'Relative Humidity (%)',
                        data: humids,
                        borderColor: '#0284c7',
                        backgroundColor: 'rgba(2, 132, 199, 0.08)',
                        fill: true,
                        borderWidth: 2,
                        tension: 0.3
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'top', labels: { boxWidth: 12, font: { family: 'Inter', size: 11 } } }
                },
                scales: {
                    x: { grid: { display: false }, ticks: { font: { family: 'Inter', size: 10 } } },
                    y: { beginAtZero: true, grid: { color: '#f1f5f9' } }
                }
            }
        });
    }
};

window.AquaCharts = AquaCharts;
