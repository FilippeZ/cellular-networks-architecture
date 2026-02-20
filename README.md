# Cellular Networks Architecture - 4G Handover Simulation

## Overview

This repository contains an advanced simulation project focused on cell handover algorithms within 4G LTE-abstracted networks. Evaluated in the context of remote patient monitoring, the simulation tests the reliability of mobile connectivity for users (e.g., patients with wearable health devices transmitting vital signs) traversing through overlapping cell coverage areas. 

The project evaluates network stability, signal quality, and resource allocation to ensure continuous data transmission without critical loss during base station transitions.

## Key Principles of 4G Handovers
While modern 4G LTE architecture is built upon physical layer technologies such as **Single-Carrier FDMA (SC-FDMA)** on the uplink and **OFDMA/MIMO** on the downlink, this simulation abstracts physical layer complexities to specifically analyze the algorithmic logic of network modeling and handover decision-making.

The simulated environment handles:
*   **Horizontal Handoffs (Intra-technology)**: Facilitating and studying seamless transitions between homogeneous access points.
*   **Vertical Handoffs (Inter-technology)**: Exploring the challenges of transitioning between heterogeneous network access points (e.g., WLAN to 4G/GPRS) to maintain service continuity.

## Evaluated Handover Algorithms

The project simulates three distinct decision-making models to optimize the handover process:

1.  **RSSI-based (Received Signal Strength Indicator)**: A straightforward approach where User Equipment (UE) evaluates the signal strength (abstracted as SNR/RSSI) and connects to the Base Station offering the strongest signal.
2.  **Threshold-based**: The UE maintains connection with its current Base Station as long as the signal strength stays above a defined minimum threshold, reducing unnecessary network switching.
3.  **Cost-based**: A holistic evaluation deciding the optimal connection by computing the ultimate cost, weighing the signal strength against the base station's actual network load (current traffic volume) and the Euclidean distance from the UE.

## Core Simulation Metrics & Parameters

To mimic real-world network physics and evaluate Key Performance Indicators (KPIs) like Handover Failure Rate (HFR) and Call Dropping Probability (CDP), the simulation implements specific tuning parameters:

*   **Hysteresis Margin (5%)**: Applied to the RSSI algorithm, it prevents the **ping-pong effect** by ensuring a switch only occurs if the new signal is strictly 5% stronger than the existing one.
*   **Threshold Value (0.3)**: A minimum limit established to avoid unnecessary handovers, forcing the UE to stay connected if the signal remains viable.
*   **Cost Penalty (50 units)**: Artificially applied in the cost-based matrix to discourage frequent base station hopping, prioritizing network stability over marginal signal improvements.
*   **Signal Fluctuation (Normal Distribution)**: Random noise (mean 0, std dev 0.002) is injected into the Signal-to-Noise Ratio (SNR) to realistically simulate environmental obstacles and interference.
*   **Handover Delay**: Calculated dynamically through a fixed operational delay (0.2s) combined with a variable delay derived from connection costs to represent synchronization overhead.

## Directory Structure

```text
cellular-networks-architecture/
├── docs/                             # Project documentation and reports
│   ├── simulation_report.docx        # Detailed technical report (Greek)
│   └── simulation_presentation.pptx  # Summary presentation slides (Greek)
├── notebooks/                        # Source code and simulation execution
│   └── 4G_Handover_Simulation.ipynb  # Primary Python/Jupyter simulation file
├── README.md                         # This file
├── LICENSE                           # Licensing Information
└── .gitignore                        # Standard ignored files for Python
```

## Setup & Execution

1. Clone the repository: `git clone https://github.com/FilippeZ/cellular-networks-architecture.git`
2. Open the Jupyter Notebook: `jupyter notebook notebooks/4G_Handover_Simulation.ipynb`
3. Execute the cells sequentially to run the random walk, evaluate signal thresholds, and observe handovers in the dynamic 4G simulation environment.

## Context
This project originates from academic coursework at the University of Patras, evaluated for its application in healthcare systems (Μαθήματα/Διπλωματική).
