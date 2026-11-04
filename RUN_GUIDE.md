# AquaSafe - Quick Run Guide (Single Command Execution)

This document provides the exact single commands to run the AquaSafe project, the summary of its technical stack, and immediate operational steps.

For full architectural details, equations, and REST endpoint references, consult [PROJECT_GUIDE.md](PROJECT_GUIDE.md).

---

## 🚀 1. The Single Command to Run the Project

Run **ONE** of the following commands from the root `AquaSafe` directory:

### For Windows:
```cmd
.\run.bat
```
*(You can also simply double-click `run.bat` in Windows File Explorer, or run `.\run.ps1` in PowerShell)*

### For Python (All Operating Systems):
```bash
python run.py
```

### For Linux / macOS / Git Bash:
```bash
./run.sh
```

### For Make:
```bash
make run
```

---

## 🌐 Live Internet Data Prediction (Real-Time Surveillance)

AquaSafe gathers live, real-time meteorological observations from the internet (Open-Meteo REST API) combined with official **Central Pollution Control Board (CPCB)** / **TNPCB** water quality parameters, **Census of India 2011** demographics, and **NFHS-5** / **Jal Jeevan Mission** sanitation indicators across all **38 Tamil Nadu districts**:

### Option A: Command-Line Live Internet Prediction
```bash
# Gather live internet data and predict for all 38 Tamil Nadu districts:
python fetch_and_predict.py --all

# Gather live internet data for a specific district (e.g. Chennai, Salem, Madurai, Coimbatore):
python fetch_and_predict.py --district Chennai
```

### Option B: Interactive Web UI Live Prediction
1. Start the server (`.\run.bat` or `python run.py`).
2. Go to **Predictions** (`http://localhost:8080/prediction.html`).
3. Select your district from any of the 38 Tamil Nadu districts and click **"Fetch Live Weather & Indicators (Open-Meteo & CPCB)"**.
4. The system queries live Open-Meteo internet feeds for that district's exact GPS coordinates, auto-fills all 13 features, and executes Weka Random Forest classification to render risk levels, probability breakdown, and factor contributions.

---

## ⚡ What That Single Command Automatically Does

You do **not** need to set up MySQL, configure Apache Tomcat, start a Python backend, or configure node servers. The single command automatically:

1. **Checks Java Environment**: Validates that Java 17+ is installed.
2. **Builds Backend Package**: Checks for `backend/target/aquasafe-backend-1.0.0-SNAPSHOT.jar`; if missing, automatically compiles and packages it.
3. **Auto-Configures Database**: Attempts connection to MySQL on port 3306; if not running, seamlessly switches to embedded in-memory H2 in MySQL compatibility mode with zero configuration.
4. **Seeds Surveillance Datasets**: Loads all 38 Tamil Nadu districts, data sources registry, sanitation data, demographics, water quality time-series, meteorological data, and historical disease records.
5. **Loads & Validates ML Model**: Loads the Weka Random Forest model (100 decision trees) and runs 10-fold cross-validation (>99% accuracy on 912 records).
6. **Starts Server**: Binds the application to `http://localhost:8080`.
7. **Launches Default Browser**: Automatically opens `http://localhost:8080` once the server is healthy.

---

## 🛠️ 2. Technical Stack Summary

- **Backend**: Java 17 LTS, Spring Boot 3.2.5 (Web, Data JPA, Security, Validation, OpenCSV).
- **Machine Learning**: Weka 3.8.6 (Random Forest with 100 Trees, 10-Fold Stratified Cross-Validation, serialized model format, feature contributions calculation, 13 environmental & demographic inputs).
- **Big Data Engine**: Apache Spark 3.x / PySpark with resilient fallback to high-throughput In-Memory Multi-threaded Streaming Dispatcher.
- **Database**: Dual-engine architecture — Automatic In-Memory H2 in MySQL Compatibility Mode (zero installation needed) + MySQL 8.x Enterprise with HikariCP.
- **Frontend**: HTML5, Modern CSS3 (Glassmorphism, custom design system, CSS Variables), Vanilla JS ES6+, Bootstrap 5.3, Chart.js 4, Leaflet.js (GIS spatial visualization for 38 districts), FontAwesome 6, Google Inter typography.
- **External APIs**: Open-Meteo REST API (real-time forecast & historical archive).
- **Data Provenance**: Explicit status classification: `LIVE` (real-time API feed), `STORED` (validated time-series records), and `DEMO` (testing).

---

## 🔑 3. Login Credentials

| Username | Password | Role | Description |
| :--- | :--- | :--- | :--- |
| `admin` | `admin123` | **ADMIN** | Full administrative rights (Upload CSVs, Data Preprocessing, ML Retraining, Big Data trigger) |
| `analyst` | `user123` | **USER** | Public Health Analyst (View Dashboard, ML Predictions, GIS Map, Export Reports) |

*(Quick Credential buttons are available on `login.html` for 1-click filling)*

---

## 📋 4. How It Works (Quick Overview)

1. **Data Ingestion**: Multi-source surveillance datasets (water quality, weather, population density, historical disease cases across 38 districts) are loaded into the database.
2. **Data Preprocessing**: Filters sensor anomalies, enforces physical boundaries, removes duplicate records, imputes missing values using medians, and assigns deterministic ground-truth risk categories.
3. **Machine Learning Prediction**: When new environmental readings are submitted, the Weka Random Forest classifier evaluates the 13 features and predicts the exact statistical probability and risk category: **HIGH**, **MEDIUM**, or **LOW**.
4. **Geospatial Intelligence**: Leaflet.js plots all 38 Tamil Nadu districts on an interactive map with risk-colored pins (Red for High, Amber for Medium, Green for Low) with an interactive district inspector panel.
5. **Automated Alerting**: When high risk or contamination is detected, an automated public health warning is generated.
6. **Reporting & PDF Export**: Analysts can filter historical metrics by district and date range and print / export official executive PDF summaries.

---

## ⚠️ Public Health Disclaimer
AquaSafe predicts potential water-borne disease risk using environmental and epidemiological indicators. It does not provide medical diagnosis or confirm disease outbreaks. For medical emergencies or health concerns, consult certified healthcare professionals or government health authorities.
