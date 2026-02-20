# 📡 Cellular Networks Architecture — 4G Handover Simulation for Mission-Critical IoT

Evaluating cell handover reliability in 4G LTE networks through algorithmic simulation, with a focus on continuous connectivity for remote patient monitoring systems.

[![Python 3.9+](https://img.shields.io/badge/python-3.9+-blue.svg)](https://www.python.org/downloads/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Jupyter Notebook](https://img.shields.io/badge/Jupyter-Notebook-orange.svg)](https://jupyter.org/)
[![4G LTE](https://img.shields.io/badge/Network-4G%20LTE-green.svg)](#)
[![OFDMA/MIMO](https://img.shields.io/badge/PHY-OFDMA%20%2F%20MIMO-purple.svg)](#)

---

## 📋 Overview

**Cellular Networks Architecture** is a simulation-driven project that models and evaluates handover algorithms in 4G LTE-abstracted networks. The simulation tests whether a mobile network can maintain **continuous, stable connectivity** for User Equipment (UE) — such as patients equipped with wearable health devices transmitting vital signs — as they traverse across multiple overlapping cell coverage areas.

The project implements three distinct handover decision algorithms, tunes them with real-world-inspired parameters (hysteresis, thresholds, cost penalties), and measures Key Performance Indicators (KPIs) like **Handover Failure Rate (HFR)** and **Call Dropping Probability (CDP)**.

## 🎯 The Problem

Mobile connectivity in mission-critical IoT (e.g., healthcare telemetry) faces unique challenges:

* **🔴 Data Loss Risk:** A failed handover during patient monitoring can mean lost vital signs — heart rate, blood pressure, SpO₂ — at a critical moment.
* **🟠 Ping-Pong Effect:** Without proper hysteresis, a UE oscillates rapidly between two base stations, degrading Quality of Service (QoS) and draining battery life.
* **🟠 Network Congestion:** Connecting to the strongest signal doesn't guarantee resources. A highly loaded cell may offer worse throughput than a weaker, less congested one.
* **🟡 Suboptimal Handover Decisions:** Naive signal-strength-only algorithms fail in dense urban or multi-cell environments where load balancing is critical.

## ✅ The Solution

This simulation evaluates three handover strategies to find the optimal balance between signal quality, network load, and connection stability:

| Algorithm | Decision Logic | Key Advantage | Weakness |
| :--- | :--- | :--- | :--- |
| **📶 RSSI-based** | Connect to the strongest signal (with hysteresis) | Simple, fast decisions | Ignores network load |
| **📊 Threshold-based** | Stay connected if signal > minimum threshold | Reduces unnecessary handovers | May keep a degrading connection |
| **💰 Cost-based** | Minimize composite cost (signal + load + distance) | Holistic, load-aware optimization | Higher computational overhead |

---

## 🏗️ Architecture & Network Model

The simulation abstracts the 4G LTE physical layer (OFDMA/MIMO/SC-FDMA) to focus on the algorithmic decision-making layer:

```text
┌─────────────────────────────────────────────────────┐
│                  4G LTE Network Model               │
│                                                     │
│  ┌───────────┐  ┌───────────┐  ┌───────────┐       │
│  │    BS₁    │  │    BS₂    │  │    BSₙ    │       │
│  │ (eNodeB)  │  │ (eNodeB)  │  │ (eNodeB)  │       │
│  └─────┬─────┘  └─────┬─────┘  └─────┬─────┘       │
│        │              │              │              │
│  ══════╪══════════════╪══════════════╪══════════    │
│        │    Overlapping Coverage Areas│              │
│  ──────┼──────────────┼──────────────┼──────────    │
│        │              │              │              │
│  ┌─────┴──────────────┴──────────────┴─────┐        │
│  │         Handover Decision Engine         │        │
│  │  ┌──────────┬────────────┬────────────┐  │        │
│  │  │  RSSI    │ Threshold  │   Cost     │  │        │
│  │  │Algorithm │ Algorithm  │ Algorithm  │  │        │
│  │  └──────────┴────────────┴────────────┘  │        │
│  └──────────────────┬───────────────────────┘        │
│                     │                                │
│  ┌──────────────────┴───────────────────────┐        │
│  │          User Equipment (UE)              │        │
│  │   📱 Patient Wearable (HR, BP, SpO₂)     │        │
│  │   → Random Walk / Predefined Path        │        │
│  └───────────────────────────────────────────┘        │
│                                                     │
│  ┌──────────────────────────────────────────┐        │
│  │           KPI Evaluation Layer            │        │
│  │  • Handover Failure Rate (HFR)           │        │
│  │  • Call Dropping Probability (CDP)        │        │
│  │  • Traffic Channel Congestion             │        │
│  └──────────────────────────────────────────┘        │
└─────────────────────────────────────────────────────┘
```

### Handover Types Modeled

* **Horizontal Handoffs (Intra-technology):** Transitions between homogeneous 4G access points — the primary focus of the simulation.
* **Vertical Handoffs (Inter-technology):** Transitions between heterogeneous networks (e.g., WLAN ↔ 4G/GPRS) — explored as a challenge analysis for seamless mobility.

---

## ⚙️ Simulation Parameters

The simulation tunes the following parameters to mimic real-world network physics:

| Parameter | Value | Purpose |
| :--- | :--- | :--- |
| **Hysteresis Margin** | 5% (0.05) | Prevents the **ping-pong effect** — UE switches only if new signal is ≥5% stronger |
| **Signal Threshold** | 0.3 | Minimum acceptable signal strength; UE stays connected if above this |
| **Cost Penalty** | 50 units | Discourages frequent base station switching in the cost-based algorithm |
| **Signal Fluctuation** | $\mathcal{N}(0, 0.002)$ | Random noise (normal distribution) simulating environmental obstacles & interference |
| **Handover Delay** | $0.2 + \min\left(\frac{\text{cost}}{100}, 1.0\right)$ | Fixed synchronization delay + variable delay proportional to connection cost |
| **Base Station Deployment** | Grid / Random | Uniform grid or randomized positioning for coverage overlap analysis |

### Signal Strength Model

Signal strength (SNR) is calculated as an inverse function of the Euclidean distance between UE and Base Station, with injected Gaussian noise:

> $\text{SNR}(d) = \frac{1}{d(UE, BS)} + \epsilon, \quad \epsilon \sim \mathcal{N}(0, 0.002)$

---

## 📂 Project Structure

```text
cellular-networks-architecture/
├── notebooks/                             # 🧠 Source code & simulation
│   └── 4G_Handover_Simulation.ipynb       # Primary Jupyter simulation
├── docs/                                  # 📋 Documentation & reports
│   ├── simulation_report.docx             # Detailed technical report (Greek)
│   └── simulation_presentation.pptx       # Summary presentation slides (Greek)
├── README.md                              # This file
├── LICENSE                                # MIT License
└── .gitignore                             # Python/Jupyter ignores
```

## 🚀 Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/FilippeZ/cellular-networks-architecture.git
cd cellular-networks-architecture
pip install jupyter numpy matplotlib
```

### 2. Run the Simulation

```bash
jupyter notebook notebooks/4G_Handover_Simulation.ipynb
```

### 3. Explore

Execute cells sequentially to:

| Step | What Happens |
| :--- | :--- |
| **Cell Deployment** | Base stations placed on grid or randomly |
| **UE Mobility** | Patient device follows a random walk across cells |
| **Handover Execution** | RSSI / Threshold / Cost algorithms compete |
| **KPI Analysis** | HFR, CDP, and congestion metrics computed |
| **Visualization** | Signal strength maps, handover events, path traces |

---

## 📊 Key Performance Indicators (KPIs)

The simulation evaluates network reliability through:

| KPI | What It Measures | Why It Matters |
| :--- | :--- | :--- |
| **Handover Failure Rate (HFR)** | % of failed handover attempts | Direct indicator of connectivity gaps |
| **Call Dropping Probability (CDP)** | Probability of losing an active connection | Critical for real-time health telemetry |
| **Traffic Channel Congestion** | Resource utilization per cell | Identifies overloaded base stations |
| **Ping-Pong Count** | Rapid back-and-forth handovers | Measures algorithm stability |

---

## 🔬 Algorithm Deep Dive

### 📶 RSSI-based Handover
The UE continuously monitors the Received Signal Strength Indicator from all reachable base stations. A handover is triggered when a neighboring cell's RSSI exceeds the current cell's RSSI by the **hysteresis margin** (5%), preventing oscillations while ensuring connection to the optimal signal.

### 📊 Threshold-based Handover
The UE maintains its current connection as long as the signal remains above the **minimum threshold** (0.3). A handover is initiated only when the signal drops below this limit, significantly reducing unnecessary handover events at the expense of occasionally maintaining a degrading connection.

### 💰 Cost-based Handover
A holistic algorithm that computes the **total connection cost** by weighing:
- **Signal strength** (inverse of distance)
- **Network load** (current traffic on the target BS)
- **Switching penalty** (50 units to discourage frequent changes)

The UE always selects the base station with the **minimum total cost**, achieving load-aware optimization that balances signal quality with resource availability.

---

## 🏥 Application Context: Remote Patient Monitoring

This simulation is evaluated in the context of **healthcare IoT**, where a patient wearing biosensors (heart rate, blood pressure, SpO₂) moves through a 4G coverage area. The critical requirement is **zero data loss** during base station transitions — a failed handover could mean missed vital sign alerts.

The simulation verifies:
- ✅ Continuous connectivity across cell boundaries
- ✅ Minimal handover latency for real-time data streams
- ✅ Load-balanced resource allocation to prevent congestion
- ✅ Resilience against signal fluctuations in urban environments

---

## 🛠️ Technologies

| Component | Technology |
| :--- | :--- |
| **Language** | Python 3.9+ |
| **Simulation** | Jupyter Notebook |
| **Computation** | NumPy |
| **Visualization** | Matplotlib |
| **Network Model** | Custom OOP (Network, BaseStation, UE classes) |
| **Signal Model** | Euclidean distance + Gaussian noise |

## 📄 License

This project is licensed under the **MIT License** — see [LICENSE](LICENSE) for details.

## 👤 Author

**Filippos-Paraskevas Zygouris**
[GitHub](https://github.com/FilippeZ) | University of Patras — Department of Computer Engineering & Informatics
