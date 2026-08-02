# 📡 Cellular Networks Architecture — Intelligent 4G Handover Simulation

Advancing from static rule-based to **ML-driven predictive handover** for mission-critical healthcare IoT, featuring a full **Explainable AI (XAI)** transparency layer, real-time Python TensorFlow/Scikit-Learn inference backend, and an **Interactive Vite + React 2D Web Dashboard**.

[![Python 3.9+](https://img.shields.io/badge/python-3.9+-blue.svg)](https://www.python.org/downloads/)
[![React 18](https://img.shields.io/badge/React-18-61DAFB.svg)](https://reactjs.org/)
[![Vite 5](https://img.shields.io/badge/Vite-5-646CFF.svg)](https://vitejs.dev/)
[![Flask API](https://img.shields.io/badge/Flask-API-000000.svg)](https://flask.palletsprojects.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Jupyter Notebook](https://img.shields.io/badge/Jupyter-Notebook-orange.svg)](https://jupyter.org/)
[![4G LTE](https://img.shields.io/badge/Network-4G%20LTE-green.svg)](#)
[![Machine Learning](https://img.shields.io/badge/ML-LSTM%20%7C%20RF%20%7C%20DQN-purple.svg)](#)
[![XAI](https://img.shields.io/badge/XAI-SHAP%20%7C%20Explainable-brightgreen.svg)](#)

---

## 📋 Executive Summary

**Cellular Networks Architecture** is a complete, simulation-driven framework designed to model, analyze, and optimize base station handover (HO) decision-making in 4G LTE mobile networks. 

Traditional cellular infrastructure relies on static, drop-reactive algorithms such as RSSI or signal threshold triggers. While computationally trivial, these classical methods suffer from **reactive decision lag**, initiating cell migration only *after* signal quality has degraded. In high-density environments or mission-critical applications — such as continuous patient telemetry monitoring — reactive handovers result in severe packet loss, ping-pong oscillations, and network congestion.

This project introduces a **two-layer intelligent handover architecture**:
1. **Predictive ML Handover Engine:** Leverages **BiLSTM sequence forecasting**, **Random Forest classification**, and **Deep Q-Network (DQN) Reinforcement Learning** to anticipate signal drop trajectories and execute handovers proactively before data loss occurs.
2. **Explainable AI (XAI) & Clinical Decision Support Layer:** Integrates **SHAP (SHapley Additive exPlanations)** to provide auditable, real-time, human-readable explanations for every automated handover decision.

---

## 🏆 Project Showcase — Live Application Screenshots

### 🔮 1. LSTM Proactive Winner Showcase (Live App Dashboard)
The screenshot below demonstrates the live Vite + React 2D Canvas Web Dashboard running the **BiLSTM Predictive Engine**. It highlights the model as the **Proactive Winner**, maintaining network connectivity with an impressive **2.45% CDP** and only **71 total handovers** across the simulation trajectory.

![LSTM App Screenshot - Proactive Winner](docs/images/app_lstm_proactive_winner.jpg)

*Figure 1: Interactive 2D Canvas Dashboard running the BiLSTM algorithm, showcasing real-time cell coverage visualization, smooth user trajectory tracking, and the 2.45% CDP metric highlight.*

---

## 🏥 Mission-Critical Healthcare IoT Telemetry Context

The simulation centers on a mobile patient equipped with 4G-connected wearable biosensors transmitting continuous medical telemetry to a hospital monitoring facility:

- **Heart Rate (HR):** Normal $60\text{--}100\text{ bpm}$, monitoring range $40\text{--}200\text{ bpm}$.
- **Blood Pressure (BP):** Normal $90/60\text{--}120/80\text{ mmHg}$, monitoring range $70\text{--}200\text{ mmHg}$.
- **Oxygen Saturation ($\text{SpO}_2$):** Normal $95\text{--}100\%$, monitoring range $80\text{--}100\%$.

### ⚠️ Medical Alert Condition Formula
A medical alert is dynamically triggered whenever a patient's vitals breach safety parameters:
$$\text{MedicalAlert} = (\text{SpO}_2 < 92\%) \lor (\text{HR} < 45\text{ bpm}) \lor (\text{HR} > 150\text{ bpm}) \lor (\text{BP} > 180\text{ mmHg})$$

When an alert is active, the ML Engine adjusts decision boundaries to prioritize **Zero Critical Data Loss ($0\text{ CDP}$)** and maximum signal stability, ensuring that critical cardiac and oxygen telemetry streams remain uninterrupted.

---

## 📐 Signal Propagation & Network Model

The simulation models $N_{\text{BS}} = 5$ eNodeB Base Stations and $N_{\text{UE}}$ mobile User Equipment nodes moving through a $500 \times 500\text{m}$ geographical area.

### 📶 Received Signal Strength Indicator (RSSI) Model
The signal strength $S_{i}(t)$ received by a UE from base station $\text{BS}_i$ at distance $d_i(t)$ incorporates logarithmic path loss and Gaussian thermal noise:
$$d_i(t) = \sqrt{(x_{\text{UE}}(t) - x_{\text{BS}_i})^2 + (y_{\text{UE}}(t) - y_{\text{BS}_i})^2} + \epsilon_{\text{dist}}$$
$$S_{i}(t) = \max\left(0, \frac{P_t}{d_i(t)} + \mathcal{N}(0, \sigma^2)\right)$$

Where:
- Transmit power parameter $P_t = 80.0\text{ signal units}$.
- Gaussian thermal noise variance $\sigma = 0.002$.
- Regularization offset $\epsilon_{\text{dist}} = 0.1\text{m}$.
- Coverage radius $R_{\text{cov}} = 65\text{m}$ ($120\text{m}$ in 2D Canvas rendering).

### ⚖️ Dynamic Base Station Congestion Model
Base stations maintain dynamic cell load factors $L_i(t) \in [0.1, 1.0]$, representing real-time PRB (Physical Resource Block) usage:
$$L_i(t+1) = \max\left(0.1, \min\left(1.0, L_i(t) + \mathcal{N}(0, 0.04^2)\right)\right)$$

---

## 📊 Section 8 Simulation Benchmark — Comprehensive Results

The official simulation benchmark in `notebooks/4G_Handover_ML.ipynb` (Section 8 & 9) evaluates all 6 algorithms over 200 steps on identical network topologies:

### 🏆 Benchmark KPI Performance Table

| Algorithm | Category | Total Handovers | Lost Packets (CDP Count) | HFR (%) | CDP (%) | Performance Rank & Status |
| :--- | :--- | :---: | :---: | :---: | :---: | :--- |
| **LSTM** | **ML** | **71** | **49** | **69.01%** | **2.45%** | 🥇 **Absolute Winner (Proactive)** |
| **Random Forest** | **ML** | **205** | **177** | **86.34%** | **8.85%** | 🥈 **Supervised Classifier (94.34% Acc)** |
| **Cost** | **Static** | **218** | **197** | **90.37%** | **9.85%** | 🥉 **Oracle Baseline** |
| **DQN RL** | **ML** | **567** | **510** | **89.95%** | **25.50%** | ⚠️ **Early Policy (20 Episodes)** |
| **RSSI** | **Static** | **806** | **773** | **95.91%** | **38.65%** | 🔴 **Blind Load-Ignorant** |
| **Threshold** | **Static** | **2000** | **1510** | **75.50%** | **75.50%** | 🔴 **Severe Ping-Pong Collapse** |

### 📐 KPI Metric Definitions
1. **Handover Failure Rate (HFR %):** Ratio of handovers executed under weak signal conditions ($S < 0.008$) resulting in packet loss:
$$\text{HFR} = \frac{N_{\text{failed\_handovers}}}{N_{\text{total\_handovers}}} \times 100\%$$
2. **Call Dropping Probability / Critical Data Loss (CDP %):** Percentage of total transmitted vital sign telemetry packets lost during handovers:
$$\text{CDP} = \frac{N_{\text{lost\_packets}}}{N_{\text{total\_steps}} \times N_{\text{UEs}}} \times 100\%$$

### 🖼️ Section 8 Comparative KPI Dashboard Plot
![Comparative KPI Dashboard](docs/images/kpi_comparative_dashboard.png)

---

## 🔬 In-Depth Analytical Evaluation (Section 8 Findings)

### 1. 🥇 The Dominance of BiLSTM (Proactive Time-Series Forecasting)
The **Bidirectional LSTM** model is the undisputed winner of the simulation, achieving the lowest critical data packet loss (**CDP = 2.45%**, only 49 lost packets) and the fewest total cell switches (**71 handovers**).

- **Architecture:** Input sequence window of 10 time steps $\mathbf{X}_t \in \mathbb{R}^{10 \times 10}$, feeding into a `Bidirectional(LSTM(64))` layer followed by `Dense(32, relu)` and `Dense(5, softmax)`.
- **Why it wins:** Instead of reacting to instant RSSI drops, the BiLSTM models signal trajectories $\frac{dS_i}{dt}$. It identifies which base station will remain stable in future time steps, triggering handovers 5--15 steps *before* signal degradation occurs.

![LSTM Training Curves](docs/images/lstm_training_curves.png)

---

### 2. 🔴 The Collapse of Static Baselines (Threshold & RSSI)
- **Threshold-Based Collapse:** Threshold logic maintains connection until signal drops below $S_{\text{thresh}} = 0.3$. Once the UE reaches cell boundaries, RSSI oscillates rapidly around the boundary, triggering **2,000 handovers** and dropping **75.50% of critical data packets** (1,510 lost packets) due to infinite ping-ponging.
- **RSSI-Based Inefficiency:** RSSI connects to whichever cell has the highest instant signal. Because it ignores cell load $L_i$ and user velocity $(v_x, v_y)$, it constantly hops between congested cells, dropping **38.65% of telemetry packets** (773 lost packets).

<p align="center">
  <img src="docs/images/threshold_trajectory.png" width="48%" alt="Threshold Trajectory" />
  <img src="docs/images/rssi_trajectory.png" width="48%" alt="RSSI Trajectory" />
</p>

---

### 3. 🌲 Random Forest Classifier vs. The Cost Oracle
To train the Random Forest model, the Cost-based algorithm served as an **Oracle**, generating a training dataset of **15,200 labeled samples** from 5 simulation episodes.

- **Feature Vector ($\mathbf{x} \in \mathbb{R}^{28}$):** For each base station $\text{BS}_i$: `[RSSI_now, RSSI_avg, RSSI_trend, BS_load, Inv_Dist]`, plus global velocity `[v_x, v_y, HO_count]`.
- **Random Forest Performance:** Achieving **94.34% test accuracy**, the RF model successfully learned and generalized the Oracle's cost function, slightly outperforming the original Cost algorithm (**205 handovers vs 218**, **8.85% CDP vs 9.85% CDP**).
- **SHAP Feature Importance:** Feature attribution showed that Base Station Loads (`BS1_load`, `BS3_load`) contribute over $42\%$ of decision weight, preventing cell congestion.

<p align="center">
  <img src="docs/images/cost_trajectory.png" width="48%" alt="Cost Trajectory" />
  <img src="docs/images/rf_feature_importance.png" width="48%" alt="Random Forest Feature Importance" />
</p>

---

### 4. ⚠️ Reinforcement Learning Analysis (DQN Underperformance)
The **Deep Q-Network (DQN)** agent recorded a **25.50% CDP** (510 lost packets) and **567 handovers**.

#### 🎯 Healthcare Reward Function Design
$$R(s, a) = R_{\text{signal}} + R_{\text{proactive}} + P_{\text{loss}} + P_{\text{ping-pong}} + R_{\text{vitals}}$$
Where:
- $R_{\text{signal}} = +2.0$ if $S_{\text{target}} > 0.3$.
- $R_{\text{proactive}} = +0.5$ for proactive cell transitions.
- $P_{\text{loss}} = -5.0$ penalty for packet loss risk ($S < 0.01$).
- $P_{\text{ping-pong}} = -1.0$ penalty for unnecessary cell switches.

#### 💡 Root Cause of High CDP
The DQN model was trained for only **20 Episodes** in the simulation. In Reinforcement Learning, Q-learning convergence requires thousands of episodes. At episode 20, the exploration rate $\epsilon$ was still at $0.050$, indicating the agent was actively taking exploratory actions rather than fully exploiting an optimal Q-policy.

![DQN Training Rewards](docs/images/dqn_training_rewards.png)

---

## 🔍 Explainable AI (XAI) Layer & Clinical Decision Support

In regulated medical device environments, "black-box" decision-making is unacceptable. The XAI layer provides:

- **SHAP Feature Attributions:** Quantifies exact feature contributions for every single handover decision.
- **NLP Clinical Audit Reports:** Generates human-readable, auditable decision logs.
- **Medical Alert Context:** Automatically tags handovers triggered during critical vital sign alerts (e.g., $\text{SpO}_2 < 92\%$).

### ⚠️ 2. DQN-RL Medical Alert & XAI Showcase (Live App Dashboard)
The screenshot below shows the live dashboard operating under active patient medical alert conditions. The right-hand panel displays the **XAI Decision Report** featuring the prominent **"⚠️ MEDICAL ALERT ACTIVE"** banner. It explains how the ML model prioritizes signal stability and zero packet loss to safeguard patient vitals in real-time.

![DQN App Screenshot - Medical Alert Active XAI Report](docs/images/app_dqn_xai_medical_alert.jpg)

*Figure 2: Real-time XAI Decision Support Panel showing active patient biosensing alert context (HR: 137 bpm, SpO₂: 89.2%, BP: 145 mmHg), confidence scoring (89%), and SHAP feature attribution bars.*

<p align="center">
  <img src="docs/images/xai_shap_attributions.png" width="48%" alt="XAI SHAP Feature Attributions" />
  <img src="docs/images/patient_vitals_timeline.png" width="48%" alt="Patient Vitals Timeline" />
</p>

---

## 🚀 Proactive vs. Reactive Handover Lead-Time Analysis

Static rule-based algorithms suffer from **decision lag**, triggering handovers only after RSSI drops below drop thresholds. The BiLSTM model provides a **5 to 15 step lead-time advantage**, initiating cell transfer while signal quality is still high.

![Proactive vs Reactive Analysis](docs/images/proactive_vs_reactive.png)

---

## 🖥️ Full Stack Application Architecture

```text
┌────────────────────────────────────────────────────────────────────────┐
│                      Cellular Networks Architecture                    │
│                                                                        │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │           Vite + React 18 2D Web Dashboard (Port 3000)          │  │
│  │  • HTML5 Canvas 60 FPS Network Renderer  • Real-Time KPI Panels  │  │
│  │  • Live SHAP XAI Explanations            • Algorithm Compare Bar │  │
│  └──────────────────────────────────┬───────────────────────────────┘  │
│                                     │ HTTP REST API / JSON             │
│                                     ▼                                  │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │               Python 3.12 Flask REST Server (Port 5000)          │  │
│  │  • `/api/status`     • `/api/step`       • `/api/batch_step`     │  │
│  │  • `/api/reset`      • `/api/benchmark`                             │  │
│  └──────────────────────────────────┬───────────────────────────────┘  │
│                                     │                                  │
│                                     ▼                                  │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                   ML Model & Simulation Engines                  │  │
│  │  ┌─────────────────┐  ┌──────────────────┐  ┌─────────────────┐  │  │
│  │  │  BiLSTM Model   │  │  Random Forest   │  │  DQN RL Agent   │  │  │
│  │  │ (TensorFlow/h5) │  │  (scikit-learn)  │  │ (Reward Policy) │  │  │
│  │  └─────────────────┘  └──────────────────┘  └─────────────────┘  │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 🌐 Flask REST API Endpoint Reference

| Endpoint | Method | Payload | Description |
| :--- | :---: | :--- | :--- |
| `/api/status` | `GET` | None | Returns backend status, TensorFlow/SHAP availability, model accuracies, and dataset samples ($15,200$). |
| `/api/benchmark` | `GET` | None | Returns official Section 8 notebook benchmark KPI metrics for all 6 algorithms. |
| `/api/step` | `POST` | `{"algo": "lstm"}` | Advances specified algorithm simulation by 1 step in Python; returns updated stations, UEs, KPIs, and XAI events. |
| `/api/batch_step` | `POST` | None | Advances all 6 algorithms simultaneously in a single pass in $< 5\text{ms}$. |
| `/api/reset` | `POST` | `{"algo": "rf", "seed": 42}` | Resets specified algorithm simulation state with given random seed. |

---

## 📂 Project File Structure

```text
cellular-networks-architecture/
├── dashboard/                             # 🌐 Interactive Vite + React 2D Web Dashboard
│   ├── src/
│   │   ├── components/                    # NetworkCanvas, KPIPanel, XAIPanel, CompareBar, AlgoSelector
│   │   ├── simulation.js                  # Pure JS 60 FPS fallback simulation engine & benchmark metadata
│   │   ├── App.jsx                        # Main React application shell
│   │   └── index.css                      # Modern dark-mode glassmorphism stylesheet
│   └── package.json                       # Frontend dependencies (React 18, Vite 5)
├── notebooks/                             # 🧠 Jupyter Notebook Simulations
│   ├── 4G_Handover_Simulation.ipynb       # Classical static handover notebook (RSSI, Threshold, Cost)
│   └── 4G_Handover_ML.ipynb              # 🆕 ML + XAI enhanced notebook (13 Sections, BiLSTM, RF, DQN)
├── models/                                # 💾 Saved Trained Machine Learning Weights
│   ├── lstm_model.h5                      # Saved Keras TensorFlow BiLSTM weights
│   ├── rf_model.joblib                    # Saved Scikit-Learn Random Forest model
│   └── rf_scaler.joblib                   # Saved StandardScaler preprocessor
├── docs/                                  # 📋 Documentation Assets & Generated Plots
│   └── images/                            # Extracted plot PNG images & app screenshots used in README
├── server.py                              # 🐍 Flask Python ML REST API server
├── README.md                              # Comprehensive analytical project documentation
└── LICENSE                                # MIT License
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites & Environment Setup

Ensure Python 3.9+ and Node.js 18+ are installed on your machine.

```bash
git clone https://github.com/FilippeZ/cellular-networks-architecture.git
cd cellular-networks-architecture

# Install Python dependencies
pip install jupyter numpy matplotlib pandas scikit-learn seaborn tensorflow shap flask flask-cors
```

### 2. Run the Intelligent ML Jupyter Notebook

```bash
jupyter notebook notebooks/4G_Handover_ML.ipynb
```

Execute cells sequentially to walk through training data generation, model training, Section 8 comparative simulation runs, and XAI clinical report generation.

### 3. Launch Python Backend & React Web Dashboard

In Terminal 1 (Python REST Server):
```bash
python server.py
```

In Terminal 2 (Vite React Web Dashboard):
```bash
cd dashboard
npm install
npm run dev
```

Open **[http://localhost:3000/](http://localhost:3000/)** in your browser to explore the live interactive 60 FPS 2D canvas simulation.

---

## 📄 License

This project is open-source and licensed under the **MIT License** — see [LICENSE](LICENSE) for details.

## 👤 Author

**Filippos-Paraskevas Zygouris**  
[GitHub Profile](https://github.com/FilippeZ) | Department of Computer Engineering & Informatics, University of Patras
