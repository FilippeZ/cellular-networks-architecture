# 📡 Cellular Networks Architecture — Intelligent 4G Handover Simulation

Advancing from static rule-based to **ML-driven predictive handover** for mission-critical healthcare IoT, with full **Explainable AI (XAI)** transparency layer and an **Interactive Vite React Dashboard**.

[![Python 3.9+](https://img.shields.io/badge/python-3.9+-blue.svg)](https://www.python.org/downloads/)
[![React 18](https://img.shields.io/badge/React-18-61DAFB.svg)](https://reactjs.org/)
[![Vite 5](https://img.shields.io/badge/Vite-5-646CFF.svg)](https://vitejs.dev/)
[![Flask API](https://img.shields.io/badge/Flask-API-000000.svg)](https://flask.palletsprojects.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Jupyter Notebook](https://img.shields.io/badge/Jupyter-Notebook-orange.svg)](https://jupyter.org/)
[![4G LTE](https://img.shields.io/badge/Network-4G%20LTE-green.svg)](#)
[![Machine Learning](https://img.shields.io/badge/ML-LSTM%20%7C%20RF%20%7C%20DQN-purple.svg)](#)
[![XAI](https://img.shields.io/badge/XAI-SHAP%20%7C%20Explainable-brightgreen.svg)](#)
[![OFDMA/MIMO](https://img.shields.io/badge/PHY-OFDMA%20%2F%20MIMO-purple.svg)](#)

---

## 📋 Overview

**Cellular Networks Architecture** is a simulation-driven project that models and evaluates handover algorithms in 4G LTE-abstracted networks. The project has evolved from three static handover algorithms (RSSI, Threshold, Cost) into a full **Intelligent ML-Enhanced System** that proactively predicts and executes handovers before signal degradation occurs.

The simulation tests whether a mobile network can maintain **continuous, stable connectivity** for User Equipment (UE) — such as patients equipped with wearable health devices transmitting vital signs (HR, BP, SpO₂) — as they traverse multiple overlapping cell coverage areas.

The system now features:
- 🧠 **LSTM predictive handover** (time-series forecasting)
- 🌲 **Random Forest classification** (interpretable, fast decisions)
- 🎮 **DQN Reinforcement Learning** (self-optimizing adaptive policy)
- 🔍 **XAI layer with SHAP** (clinical audit reports, human-readable explanations)
- 🌐 **Interactive Vite+React Dashboard** (live 2D Canvas visualization & KPI monitoring)

---

## 🎯 The Problem

Mobile connectivity in mission-critical IoT (e.g., healthcare telemetry) faces unique challenges:

* **🔴 Data Loss Risk:** A failed handover during patient monitoring can mean lost vital signs at a critical moment.
* **🟠 Ping-Pong Effect:** Without proper hysteresis, a UE oscillates rapidly between two base stations.
* **🟠 Network Congestion:** Connecting to the strongest signal doesn't guarantee resources.
* **🟡 Reactive Decisions:** Static algorithms react *after* signal degradation — too late for zero-data-loss telemetry.
* **🔵 Black-Box Algorithms:** ML systems without transparency are unacceptable in regulated healthcare environments.

## ✅ The Solution — Two-Layer Intelligent System

### Layer 1: ML Handover Algorithms

| Algorithm | Strategy | Key Advantage |
| :--- | :--- | :--- |
| **📶 RSSI-based** | Connect to strongest signal (with hysteresis) | Simple, fast decisions |
| **📊 Threshold-based** | Stay connected if signal > minimum threshold | Reduces unnecessary handovers |
| **💰 Cost-based** | Minimize composite cost (signal + load + distance) | Holistic, load-aware |
| **🔮 LSTM Predictive** | Time-series forecast of future signal trajectory | **Proactive**: triggers before signal drops |
| **🌲 Random Forest** | Supervised classification on oracle-labeled data | Fast, explainable, high accuracy |
| **🎮 DQN RL** | Reinforcement learning with shaped healthcare reward | **Self-adaptive**: improves with experience |

### Layer 2: Explainable AI (XAI)

In mission-critical healthcare, "black box" decisions are unacceptable. The XAI layer provides:

- **SHAP values** — quantify which features drove each handover decision
- **NLP clinical audit reports** — human-readable explanation of every handover
- **Medical alert context** — explains handovers linked to patient vital sign alerts
- **Proactive vs. reactive analysis** — proves that ML acts before signal loss

---

## 🏗️ Architecture

```text
┌─────────────────────────────────────────────────────────────────┐
│              Intelligent 4G LTE Network System                  │
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │     BS₁     │  │     BS₂     │  │     BSₙ     │            │
│  │  (eNodeB)   │  │  (eNodeB)   │  │  (eNodeB)   │            │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘            │
│         └─────────────── RSSI/Load history ──────────────┐     │
│                                                          ↓     │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │               ML Handover Decision Engine                │  │
│  │  ┌──────────┬──────────────┬────────────┬────────────┐   │  │
│  │  │  RSSI    │  Threshold   │   Cost     │    ML      │   │  │
│  │  │(baseline)│  (baseline)  │ (baseline) │  Models    │   │  │
│  │  └──────────┴──────────────┴────────────┴─────┬──────┘   │  │
│  │                                               ↓          │  │
│  │  ┌────────────────────────────────────────────────────┐  │  │
│  │  │             ML Models                              │  │  │
│  │  │  ┌──────────┐  ┌──────────────┐  ┌─────────────┐  │  │  │
│  │  │  │   LSTM   │  │    Random    │  │     DQN     │  │  │  │
│  │  │  │ (RSSI    │  │    Forest    │  │     RL      │  │  │  │
│  │  │  │ forecast)│  │ (classifier) │  │  (adaptive) │  │  │  │
│  │  │  └──────────┘  └──────────────┘  └─────────────┘  │  │  │
│  │  └────────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────┬───────────────────────────┘  │
│                                 ↓                               │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                  XAI Explainability Layer                │  │
│  │  • SHAP values per decision         • NLP audit reports  │  │
│  │  • Feature attribution (top 5)      • Medical alert ctx  │  │
│  │  • Proactive vs reactive analysis                        │  │
│  └──────────────────────────────┬───────────────────────────┘  │
│                                 ↓                               │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │           User Equipment (UE) — Patient Wearable         │  │
│  │   📱 HR, BP, SpO₂ sensors → LSTM signal history buffer   │  │
│  │   → Linear / Random / Custom mobility patterns           │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    KPI Evaluation Layer                  │  │
│  │  • HFR  • CDP  • Packets Lost  • Proactive Handover Rate │  │
│  │  • ML Confidence Score  • XAI Explanation Quality        │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## ⚙️ Simulation Parameters

### Static Algorithm Parameters (unchanged)

| Parameter | Value | Purpose |
| :--- | :--- | :--- |
| **Hysteresis Margin** | 5% (0.05) | Prevents ping-pong effect |
| **Signal Threshold** | 0.3 | Minimum acceptable signal strength |
| **Cost Penalty** | 50 units | Discourages unnecessary switching |
| **Signal Fluctuation** | $\mathcal{N}(0, 0.002)$ | Environmental noise |

### ML Model Hyperparameters

| Model | Key Parameters |
| :--- | :--- |
| **LSTM** | 2× BiLSTM (128→64 units), window=10 steps, Adam lr=1e-3, EarlyStopping |
| **Random Forest** | 200 estimators, max_depth=15, balanced class weights |
| **DQN** | γ=0.95, ε-greedy decay=0.995→0.05, replay buffer=20k, target network update=100 steps |

### LSTM Feature Engineering

Each timestep builds a `(window_size=10, 2×N_BS)` sequence:

```text
For each Base Station:
  [RSSI_t-9..t, Load_t-9..t]
```

Flat feature vector (for RF/DQN):
```text
Per BS: [rssi_now, rssi_avg(window), rssi_trend_slope, load_now, 1/distance]
Global: [velocity_x, velocity_y, handover_count]
```

---

## 📂 Project Structure

```text
cellular-networks-architecture/
├── dashboard/                             # 🌐 Interactive Vite + React 2D Web App
│   ├── src/
│   │   ├── components/                    # Canvas, KPI, XAI, Compare UI components
│   │   ├── simulation.js                  # Pure-JS 60 FPS simulation engine
│   │   └── App.jsx                        # Main React application
│   └── package.json                       # Dependencies
├── notebooks/                             # 🧠 Simulation notebooks
│   ├── 4G_Handover_Simulation.ipynb       # Original static algorithm simulation
│   └── 4G_Handover_ML.ipynb              # 🆕 ML + XAI enhanced simulation
├── models/                                # 💾 Saved TensorFlow & RF model weights
│   ├── lstm_model.h5
│   ├── rf_model.joblib
│   └── rf_scaler.joblib
├── docs/                                  # 📋 Documentation & reports
│   ├── simulation_report.docx             # Technical report (Greek)
│   └── simulation_presentation.pptx       # Summary presentation (Greek)
├── map/                                   # 🗺️ Geospatial visualization
│   ├── sim.py                             # OSMnx + Folium map generator
│   ├── ue_bs_custom_icon_map.html         # Interactive handover map
│   └── *.svg                             # Custom UE/BS icons
├── server.py                              # 🐍 Python Flask REST API server
├── README.md                              # This file
├── LICENSE                                # MIT License
└── .gitignore
```

---

## 🚀 Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/FilippeZ/cellular-networks-architecture.git
cd cellular-networks-architecture
pip install jupyter numpy matplotlib pandas scikit-learn seaborn
# For LSTM support:
pip install tensorflow
# For XAI:
pip install shap
```

### 2. Run the Original Simulation (Static Algorithms)

```bash
jupyter notebook notebooks/4G_Handover_Simulation.ipynb
```

### 3. Run the Intelligent ML Simulation (New)

```bash
jupyter notebook notebooks/4G_Handover_ML.ipynb
```

Execute cells sequentially to:

| Section | What Happens |
| :--- | :--- |
| **1 — Setup** | Imports, config, global style system |
| **2 — Network Model** | Enhanced `BaseStation`, `UE`, `Network` classes with signal history buffers |
| **3 — Data Generation** | Oracle (cost-based) simulation generates `(features, label)` training dataset |
| **4 — Random Forest** | Train RF classifier; plot confusion matrix + feature importance |
| **5 — LSTM** | Build & train Bidirectional LSTM; plot training curves |
| **6 — DQN** | Train DQN agent with healthcare-shaped rewards; plot episode rewards |
| **7 — ML Wrappers** | Plug ML models into simulation interface |
| **8 — Comparative Run** | Run all 6 algorithms on same topology |
| **9 — KPI Dashboard** | Side-by-side dashboard: HFR, CDP, packets lost, radar chart |
| **10 — XAI Engine** | SHAP explainer, NLP report generator, vitals timeline plotter |
| **11 — XAI Simulation** | Instrumented run with live XAI explanations + clinical audit |
| **12 — Proactive Analysis** | Quantify ML lead-time advantage over reactive static methods |
| **13 — Summary** | Final KPIs, clinical recommendations |

### 4. Run the Interactive Web Dashboard (React)

```bash
cd dashboard
npm install
npm run dev
```
Open **[http://localhost:3000/](http://localhost:3000/)** in your browser.

---

## 📊 Key Performance Indicators (KPIs)

| KPI | What It Measures | Why It Matters |
| :--- | :--- | :--- |
| **Handover Failure Rate (HFR)** | % of handovers resulting in data loss | Direct connectivity gap indicator |
| **Call Dropping Probability (CDP)** | Probability of losing an active session | Critical for real-time health telemetry |
| **Packets Lost** | Actual data frames dropped during handover | Zero-tolerance metric for vital signs |
| **Proactive Handover Rate** | % of handovers triggered before signal drop | Key ML advantage metric |
| **ML Confidence Score** | Model's probability for chosen BS | XAI quality gate (< 60% → flag for review) |
| **Ping-Pong Count** | Rapid back-and-forth handovers | Algorithm stability |

---

## 🔬 Algorithm Deep Dive

### Static Baselines

#### 📶 RSSI-based Handover
Continuously monitors RSSI from all BSes. Triggers handover when a neighbor exceeds current RSSI by 5% hysteresis margin. **Reactive** — decision made at time of signal drop.

#### 📊 Threshold-based Handover
Maintains connection until signal drops below 0.3 threshold. Minimizes unnecessary handovers but may keep a degrading connection longer than optimal.

#### 💰 Cost-based Handover
Minimizes a composite cost: `cost = (distance × load × 10) / (signal + 1) + switching_penalty`. Load-aware but still **reactive**.

---

### ML Models

#### 🔮 LSTM Predictive Handover
```
Input: 10-step sliding window of [RSSI_BS0, Load_BS0, ..., RSSI_BSN, Load_BSN]
Model: BiLSTM(128) → BiLSTM(64) → Dense(64) → Softmax(N_BS)
Output: P(best_BS | signal_trajectory) → proactive handover decision
```
By learning the *trajectory* of signal degradation, the LSTM predicts which BS will be optimal **in the future**, allowing handover before any packet loss risk.

#### 🌲 Random Forest Handover Classifier
Trained on oracle-labeled data. Each decision is backed by **feature importances**: "BS2 was chosen because its RSSI trend slope was +0.003/step while current BS0 slope was -0.008/step and load dropped to 0.24."

#### 🎮 DQN Reinforcement Learning Handover
**Reward function** designed for healthcare IoT:
```python
reward = +2.0   # signal > threshold → stable
reward += -5.0  # signal < 0.01 → data loss risk
reward += -1.0  # unnecessary switch → ping-pong penalty
reward += +1.0  # patient has active alert → prioritize stability
reward += -0.5 × load  # prefer less-loaded cells
```
The agent progressively improves its policy through thousands of environment interactions, outperforming static rules without any manual tuning.

---

## 🔍 Explainable AI (XAI) Layer

### Why XAI in Healthcare?

> IEC 62304 (medical device software lifecycle) and FDA SaMD guidance require that AI/ML-based decisions in clinical systems be **auditable, traceable, and explainable**.

The XAI layer generates a **clinical audit report** for every handover decision:

```
╔══════════════════════════════════════════════════════════════════╗
║  XAI HANDOVER DECISION REPORT — Step  147                        ║
╠══════════════════════════════════════════════════════════════════╣
║  UE  0  |  From: BS2 → To: BS3     Model Confidence: 91.3%      ║
╠══════════════════════════════════════════════════════════════════╣
║  DECISION RATIONALE                                              ║
╠══════════════════════════════════════════════════════════════════╣
  ▶ Target BS3 signal (RSSI=0.02341) is improving (+0.00031/step).
  ▶ Current BS2 RSSI was 0.00912 (declining trend).
  ▶ BS3 network load is 0.23 (lower is better).
  ▶ Distance to BS3: 47.3m
╠══════════════════════════════════════════════════════════════════╣
║  TOP CONTRIBUTING FEATURES (SHAP)                                ║
╠══════════════════════════════════════════════════════════════════╣
  • BS3_rssi_trend             : +0.01823  ↑ pushes TO handover
  • BS2_rssi_avg               : -0.01204  ↓ pushes AGAINST handover
  • BS3_load                   : +0.00891  ↑ pushes TO handover
  • BS3_inv_dist               : +0.00654  ↑ pushes TO handover
  • velocity_x                 : +0.00312  ↑ pushes TO handover
╚══════════════════════════════════════════════════════════════════╝
```

### XAI Components

| Component | Technology | Output |
| :--- | :--- | :--- |
| **Global Feature Importance** | SHAP TreeExplainer | Bar chart of mean \|SHAP\| per feature |
| **Local Decision Explanation** | SHAP + RF feature importance | Per-handover top-5 features |
| **NLP Clinical Report** | Template + SHAP values | Plain-English audit entry |
| **Medical Alert Context** | Vital sign thresholds + signal | Alert-aware explanation |
| **Vitals + Handover Timeline** | Matplotlib + event markers | Clinical monitoring dashboard |

---

## 🏥 Healthcare Application Context

A patient with wearable biosensors (HR, BP, SpO₂) moves through a 4G coverage area. The **ML system** guarantees:

- ✅ **Zero data loss** — LSTM triggers handover before signal reaches the drop threshold
- ✅ **Proactive decisions** — system acts 5–15 steps *before* RSSI/Threshold would react
- ✅ **Explainability** — every decision is logged with clinical-grade explanation
- ✅ **Medical alert awareness** — DQN reward shaping prioritizes connectivity during active patient alerts
- ✅ **Load balancing** — all ML models consider BS load to prevent congestion during mass events

---

## 🛠️ Technologies

| Component | Technology |
| :--- | :--- |
| **Language** | Python 3.9+, JavaScript (ES6+) |
| **Web App** | Vite, React 18, HTML5 Canvas, Vanilla CSS |
| **Backend Server** | Flask 3.1, Flask-CORS |
| **Simulation** | Jupyter Notebook |
| **Computation** | NumPy, Pandas |
| **Visualization** | Matplotlib, Seaborn |
| **ML — Classical** | scikit-learn (RandomForest, GBM, StandardScaler) |
| **ML — Deep Learning** | TensorFlow/Keras (BiLSTM, DQN, BatchNorm) |
| **XAI** | SHAP (TreeExplainer, summary plots) |
| **Geospatial** | OSMnx, NetworkX, Folium |
| **Network Model** | Custom OOP (BaseStation, UE, Network) |
| **Signal Model** | Euclidean distance + Gaussian noise |

---

## 📄 License

This project is licensed under the **MIT License** — see [LICENSE](LICENSE) for details.

## 👤 Author

**Filippos-Paraskevas Zygouris**  
[GitHub](https://github.com/FilippeZ) | University of Patras — Department of Computer Engineering & Informatics
