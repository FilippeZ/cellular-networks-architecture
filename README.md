# 📡 Cellular Networks Architecture — Intelligent 4G Handover Simulation

Advancing from static rule-based to **ML-driven predictive handover** for mission-critical healthcare IoT, featuring a full **Explainable AI (XAI)** transparency layer and an **Interactive Vite+React Real-Time 2D Dashboard**.

[![Python 3.9+](https://img.shields.io/badge/Python-3.9+-blue.svg)](https://www.python.org/downloads/)
[![React 18](https://img.shields.io/badge/React-18-61DAFB.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF.svg)](https://vitejs.dev/)
[![Flask](https://img.shields.io/badge/Flask-3.1-000000.svg)](https://flask.palletsprojects.com/)
[![TensorFlow](https://img.shields.io/badge/TensorFlow-2.x-FF6F00.svg)](https://www.tensorflow.org/)
[![Scikit-Learn](https://img.shields.io/badge/scikit--learn-1.x-F7931E.svg)](https://scikit-learn.org/)
[![XAI SHAP](https://img.shields.io/badge/XAI-SHAP-brightgreen.svg)](https://shap.readthedocs.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 📋 Overview

**Cellular Networks Architecture** is an advanced simulation and engineering project designed to model, evaluate, and visualize network handover algorithms in 4G LTE-abstracted cellular environments.

The project addresses the critical challenge of **zero-data-loss connectivity for mobile healthcare IoT** — such as ambulatory patients equipped with medical wearables transmitting continuous vitals (Heart Rate, Blood Pressure, SpO₂).

The platform provides a dual-interface architecture:
1. **🧠 Python ML Research Suite (`notebooks/4G_Handover_ML.ipynb`)**: Offline model training, SHAP feature attributions, loss curves, confusion matrices, and academic reporting.
2. **🌐 Interactive React Dashboard (`dashboard/`)**: A real-time 2D HTML5 Canvas web dashboard with live parallel execution of all 6 algorithms, KPI sparklines, and interactive XAI clinical audit inspection.

---

## 🚀 Key Features

### 1. 🤖 6 Handover Algorithms (Static vs. ML)
- **📶 RSSI-based (Baseline)**: Connects to the strongest current signal with a 5% hysteresis margin.
- **📊 Threshold-based (Baseline)**: Maintains current connection until signal drops below minimum quality threshold.
- **💰 Cost-based (Baseline)**: Minimizes a multi-objective cost function balancing distance, cell load, and switching penalties.
- **🔮 BiLSTM Predictive (ML)**: Time-series deep neural network forecasting future RSSI trends over a 10-step window to trigger **proactive handovers** before signal degradation occurs.
- **🌲 Random Forest (ML)**: Supervised classification model trained on oracle decision labels, providing fast and highly interpretable feature importances.
- **🎮 Deep Q-Network (DQN RL)**: Reinforcement learning agent using shaped rewards tailored for healthcare IoT (data loss penalties, medical alert priority, ping-pong avoidance).

### 2. 🔍 Explainable AI (XAI) Layer
- **SHAP Feature Attribution**: Quantifies exact positive and negative contributions of signal trends, cell loads, distances, and UE velocities for each decision.
- **NLP Clinical Audit Reports**: Generates human-readable, regulatory-compliant explanations for every handover.
- **Medical Alert Prioritization**: Automatically prioritizes link stability and zero-data-loss routing during critical patient vital sign alerts.

### 3. 💻 Interactive Web Dashboard (`dashboard/`)
- **Real-Time 2D Canvas Visualization**: Live map of Base Stations (eNodeBs) with dynamic load meters, moving UEs (patient wearables), signal quality links, and pulsating alert rings.
- **Dual Execution Engine**:
  - **Pure-JS Engine**: Ultra-fast synchronous execution (60 FPS, < 1ms/step) for zero-lag UI interaction.
  - **Python REST API Server (`server.py`)**: Connects the UI directly to live TensorFlow/Keras & SHAP Python model inference endpoints (`http://127.0.0.1:5000/api`).
- **Live Comparison Mode**: Parallel execution view comparing all 6 algorithms side-by-side with real-time KPI bar charts.
- **XAI Inspector**: Clickable log of historical handover events showing confidence scores, rationale, and SHAP feature bars.

---

## 🏗️ System Architecture

```text
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        CELLULAR NETWORKS ARCHITECTURE PLATFORM                         │
│                                                                                        │
│  ┌──────────────────────────────────────────────────────────────────────────────────┐  │
│  │                            WEB DASHBOARD (REACT + CANVAS)                        │  │
│  │  • Real-Time 2D Canvas Topology Map   • KPI Sparklines & Radar Comparison Bar    │  │
│  │  • Interactive XAI Audit Inspector    • 0.5× to 8× Playback Controls             │  │
│  └──────────────────────────────────────────┬───────────────────────────────────────┘  │
│                                             │                                          │
│                      ┌──────────────────────┴──────────────────────┐                   │
│                      │                                             │                   │
│                      ▼                                             ▼                   │
│  ┌──────────────────────────────────────┐     ┌─────────────────────────────────────┐  │
│  │    PURE-JS HIGH PERFORMANCE ENGINE   │     │    PYTHON FLASK REST API BACKEND     │  │
│  │  • Instant 60 FPS simulation tick    │     │  • Live TensorFlow / Keras BiLSTM   │  │
│  │  • Zero-lag client-side fallback     │     │  • scikit-learn Random Forest       │  │
│  │  • Synchronous state calculation     │     │  • SHAP TreeExplainer API Engine    │  │
│  └──────────────────────────────────────┘     └─────────────────────────────────────┘  │
│                                                                                        │
│  ┌──────────────────────────────────────────────────────────────────────────────────┐  │
│  │                        PY-RESEARCH SUITE (JUPYTER NOTEBOOKS)                     │  │
│  │  • Data Generation (Oracle)     • Model Training (BiLSTM, RF, DQN)               │  │
│  │  • SHAP Attribution Analysis    • KPI Evaluation & Matplotlib Dashboards        │  │
│  └──────────────────────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 📊 Handover Algorithm Comparison

| Algorithm | Type | Strategy / Model | Key Advantage | Proactive? |
| :--- | :--- | :--- | :--- | :---: |
| **📶 RSSI** | Static | Strongest current signal + 5% hysteresis | Simple, fast execution | ❌ |
| **📊 Threshold** | Static | Retain connection until RSSI < 18 units | Reduces unnecessary handovers | ❌ |
| **💰 Cost-Based** | Static | Min `(dist × load × 5) / RSSI + penalty` | Load-aware multi-objective | ❌ |
| **🔮 BiLSTM** | ML | 2× BiLSTM (128→64 units), 10-step window | **Forecasts RSSI trend; zero data loss** | ✅ |
| **🌲 Random Forest** | ML | 100 Trees, max_depth=12 classifier | Fast, explainable, high precision | ✅ |
| **🎮 DQN RL** | ML | Q-learning with healthcare reward shaping | **Self-adapts** to network congestion | ✅ |

---

## 📂 Project Structure

```text
cellular-networks-architecture/
├── dashboard/                             # 🌐 Vite + React Web Application
│   ├── src/
│   │   ├── components/
│   │   │   ├── NetworkCanvas.jsx          # 2D Canvas renderer (BS, UE, alerts)
│   │   │   ├── KPIPanel.jsx               # KPI card with sparklines
│   │   │   ├── XAIPanel.jsx               # SHAP feature bars & rationale card
│   │   │   ├── AlgoSelector.jsx           # Algorithm picker grid
│   │   │   └── CompareBar.jsx             # Live side-by-side KPI comparison
│   │   ├── simulation.js                  # Core simulation engine & API bridge
│   │   ├── App.jsx                        # Main React dashboard layout
│   │   ├── main.jsx                       # React entry point
│   │   └── index.css                      # Global dark glassmorphism theme
│   ├── index.html                         # HTML template
│   ├── vite.config.js                     # Vite configuration
│   └── package.json                       # Node dependencies
├── notebooks/                             # 🧠 Jupyter Research Notebooks
│   ├── 4G_Handover_Simulation.ipynb       # Static baselines simulation
│   └── 4G_Handover_ML.ipynb              # ML models (LSTM, RF, DQN) + SHAP XAI
├── models/                                # 💾 Saved ML Model Weights
│   ├── rf_model.joblib                    # Trained Random Forest classifier
│   ├── rf_scaler.joblib                   # Feature StandardScaler
│   └── lstm_model.h5                      # Keras BiLSTM model
├── docs/                                  # 📋 Project Documentation
│   ├── simulation_report.docx             # Detailed technical report (Greek)
│   └── simulation_presentation.pptx       # Project summary presentation
├── map/                                   # 🗺️ Geospatial Folium Maps
│   ├── sim.py                             # Map generation script
│   └── ue_bs_custom_icon_map.html         # Interactive map HTML
├── server.py                              # 🐍 Python Flask REST API Server
├── README.md                              # Project documentation
└── LICENSE                                # MIT License
```

---

## ⚡ Quick Start & Installation

### Option 1: Launch the Interactive Web Dashboard

1. **Install Node.js dependencies**:
   ```bash
   cd dashboard
   npm install
   ```

2. **Start the Vite Development Server**:
   ```bash
   npm run dev
   ```
   Open your browser at **[http://127.0.0.1:3000/](http://127.0.0.1:3000/)** (or `http://localhost:3000/`).

3. *(Optional)* **Launch Python ML Backend Server**:
   To run live Python TensorFlow & SHAP inference for the dashboard:
   ```bash
   # In the root folder
   pip install flask flask-cors tensorflow scikit-learn shap joblib
   python server.py
   ```
   The backend server runs on `http://127.0.0.1:5000`.

---

### Option 2: Run Jupyter Notebooks (Model Training & Research)

1. **Install Python dependencies**:
   ```bash
   pip install jupyter numpy matplotlib pandas scikit-learn seaborn tensorflow shap
   ```

2. **Launch Jupyter**:
   ```bash
   jupyter notebook notebooks/4G_Handover_ML.ipynb
   ```
   Execute cells sequentially to train the models, view training curves, generate SHAP feature attributions, and export model weights.

---

## 🔍 Explainable AI (XAI) Audit Report Sample

Every handover decision generates an auditable clinical report:

```text
╔══════════════════════════════════════════════════════════════════════════╗
║  🔍 XAI HANDOVER DECISION REPORT — Step 147                              ║
╠══════════════════════════════════════════════════════════════════════════╣
║  Handover: BS2 → BS3                    Model Confidence: 91%          ║
╠══════════════════════════════════════════════════════════════════════════╣
║  RATIONALE                                                               ║
║  ▶ Target BS3 signal is rising (+0.31/step)                              ║
║  ▶ Current BS2 signal declining (-0.82/step)                             ║
║  ▶ BS3 cell load is low (23%)                                            ║
║  ▶ ⚠️ MEDICAL ALERT: Monitored vitals critical — zero loss prioritized   ║
╠══════════════════════════════════════════════════════════════════════════╣
║  SHAP FEATURE ATTRIBUTION                                                ║
║  • BS3_rssi_trend      : +0.1823  [===================] (Positive)     ║
║  • BS2_rssi_avg        : -0.1204  [==============     ] (Negative)     ║
║  • BS3_load            : +0.0891  [=========          ] (Positive)     ║
║  • Distance_to_BS3     : +0.0654  [=======            ] (Positive)     ║
║  • velocity_x          : +0.0312  [====               ] (Positive)     ║
╚══════════════════════════════════════════════════════════════════════════╝
```

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Filippos-Paraskevas Zygouris**  
[GitHub Profile](https://github.com/FilippeZ)  
University of Patras — Department of Computer Engineering & Informatics
