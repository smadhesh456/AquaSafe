# AquaSafe: Water-Borne Disease Prediction Using Big Data Analytics & Machine Learning

AquaSafe is an epidemiological surveillance and predictive healthcare intelligence platform. It integrates environmental water quality sensors, meteorological observation feeds, demographic indicators, and clinical disease reports to predict and prevent outbreaks of water-borne diseases (Cholera, Typhoid, Diarrhea, and Hepatitis) across Tamil Nadu districts.

---

## 🗺️ Dynamic District Selection & Authentic 13-Parameter Surveillance

AquaSafe features an authentic, district-based epidemiological surveillance architecture covering **all 38 recognized districts of Tamil Nadu**:

### 1. Dynamic District-First Architecture
- **No Hardcoded Defaults**: Prompts the user to select any Tamil Nadu district (`Ariyalur` to `Virudhunagar`).
- **Dynamic Coordinate Resolution**: Coordinates are dynamically resolved to query localized meteorological and environmental feeds.
- **Strict Data Isolation**: Reports are generated exclusively for the selected district without mixing cross-district or statewide data. Switching districts replaces previous data immediately.

### 2. The 13 Monitored Surveillance Parameters
- **Water Quality (CPCB & TNPCB Network)**: pH Level, Turbidity, Total Dissolved Solids (TDS), Dissolved Oxygen (DO), Water Temperature.
- **Weather (Open-Meteo REST API)**: Air Temperature, Relative Humidity, Rainfall, Precipitation.
- **Demographic & Sanitation Indicators**: Historical Disease Cases (IDSP / MoHFW), Population Density (Census of India 2011), Sanitation Coverage (Swachh Bharat Mission / NFHS-5), Clean Drinking Water Coverage (Jal Jeevan Mission *Har Ghar Jal*).

### 3. Strict Authenticity & Machine Learning Safety Guard
- **No Fake / Synthetic Data**: Unsampled parameters are explicitly marked as `DATA NOT AVAILABLE` (`[MISSING]`).
- **Safety Guard**: If critical observations are missing, the ML engine returns `INSUFFICIENT VERIFIED DATA FOR RISK PREDICTION` instead of generating unsupported predictions.
- **Decision Support Notice**: AquaSafe provides epidemiological risk assessment and early-warning decision support; it does not diagnose patients or confirm outbreaks.

---

## ⚡ Quick Start (Single Command)

To run the entire AquaSafe application with a single command:

### Windows:
```cmd
.\run.bat
```
*(Or in PowerShell: `.\run.ps1`)*

### Cross-Platform (Windows / Mac / Linux):
```bash
python run.py
```

### Linux / macOS:
```bash
./run.sh
```

### Make:
```bash
make run
```

The system will start up, configure the database, seed demonstration data, validate the Machine Learning model, and automatically open your web browser to:
```
http://localhost:8080
```

---

## 📚 Complete Project Documentation

For full technical specifications, architecture diagrams, mathematical equations, REST APIs, and operation steps, please refer to the dedicated guide:

👉 **[PROJECT_GUIDE.md](PROJECT_GUIDE.md)**  
👉 **[RUN_GUIDE.md](RUN_GUIDE.md)**

---

## 🔑 Default Credentials

- **Administrator**: `admin` / `admin123`
- **Analyst**: `analyst` / `user123`

---

## 🛠️ Technical Stack Summary

- **Backend**: Spring Boot 3.2.5, Java 17 LTS, Spring Data JPA, Spring Security, OpenCSV
- **Machine Learning**: Weka 3.8.6 (Random Forest, 100 Trees, 10-Fold Cross-Validation)
- **Big Data Engine**: Apache Spark 3.x, PySpark, Multi-Threaded Local Dispatcher
- **Database**: Zero-Config In-Memory H2 (MySQL Mode) + Production MySQL 8.x
- **Frontend**: HTML5, Modern CSS3 Glassmorphic Theme, Vanilla JS ES6+, Bootstrap 5.3, Chart.js 4, Leaflet.js
- **Weather API**: Open-Meteo REST API

---

## 📄 License
AquaSafe &copy; 2026. Predictive Public Health Analytics.
