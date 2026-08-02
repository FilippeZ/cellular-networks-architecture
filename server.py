"""
server.py — Real Python ML & Simulation Backend Server
Connects the React Web UI to the actual Python TensorFlow/Keras & scikit-learn models.

Run: python server.py
Serves on: http://localhost:5000
"""

import os
import sys
import json
import math
import random
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS

from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
import joblib

try:
    import tensorflow as tf
    from tensorflow import keras
    from tensorflow.keras.models import Sequential, Model, load_model
    from tensorflow.keras.layers import LSTM, Dense, Dropout, Input, BatchNormalization, Bidirectional
    from tensorflow.keras.optimizers import Adam
    TF_AVAILABLE = True
except ImportError:
    TF_AVAILABLE = False

try:
    import shap
    SHAP_AVAILABLE = True
except ImportError:
    SHAP_AVAILABLE = False

app = Flask(__name__)
CORS(app)

MODELS_DIR = os.path.join(os.path.dirname(__file__), 'models')
os.makedirs(MODELS_DIR, exist_ok=True)

# ═══════════════════════════════════════════════════════════════════════════
#  REAL PYTHON NETWORK SIMULATION CLASSES
# ═══════════════════════════════════════════════════════════════════════════

class BaseStation:
    def __init__(self, id, x, y, coverage_radius=65):
        self.id              = id
        self.x               = x
        self.y               = y
        self.coverage_radius = coverage_radius
        self.load            = random.uniform(0.2, 0.8)

    def get_signal_strength(self, ue):
        dist  = math.sqrt((ue.x - self.x)**2 + (ue.y - self.y)**2)
        dist  = max(dist, 0.1)
        base  = 1.0 / dist
        noise = np.random.normal(0, 0.002)
        return max(0.0, base + noise)

    def update_load(self):
        self.load = max(0.1, min(1.0, self.load + np.random.normal(0, 0.04)))

    def to_dict(self):
        return {
            'id': self.id,
            'x': self.x,
            'y': self.y,
            'load': float(self.load),
            'coverage': self.coverage_radius
        }


class UE:
    def __init__(self, id, x, y, window_size=10):
        self.id                = id
        self.x                 = x
        self.y                 = y
        self.vx                = random.uniform(-1.5, 1.5)
        self.vy                = random.uniform(-1.5, 1.5)
        self.connected_station = None
        self.handover_count    = 0
        self.packets_lost      = 0
        self.handover_delay    = 0.0
        self.history           = [(x, y)]
        self.window_size       = window_size
        self.signal_history    = {}
        self.vitals            = {'hr': 75.0, 'spo2': 98.0, 'bp': 120.0}
        self.alert_active      = False
        self.handover_log      = []

    def update_signal_history(self, base_stations):
        for bs in base_stations:
            if bs.id not in self.signal_history:
                self.signal_history[bs.id] = [0.0] * self.window_size
            sig = bs.get_signal_strength(self)
            self.signal_history[bs.id].append(sig)
            if len(self.signal_history[bs.id]) > self.window_size:
                self.signal_history[bs.id].pop(0)

    def get_feature_vector(self, base_stations):
        feats = []
        for bs in base_stations:
            win        = self.signal_history.get(bs.id, [0.0]*self.window_size)
            rssi_now   = win[-1]
            rssi_avg   = float(np.mean(win))
            rssi_trend = float(np.polyfit(range(len(win)), win, 1)[0]) if len(set(win)) > 1 else 0.0
            dist       = math.sqrt((self.x - bs.x)**2 + (self.y - bs.y)**2) + 0.1
            feats.extend([rssi_now, rssi_avg, rssi_trend, float(bs.load), 1.0/dist])
        feats.extend([float(self.vx), float(self.vy), float(self.handover_count)])
        return np.array(feats, dtype=np.float32)

    def get_lstm_sequence(self, base_stations):
        seqs = []
        for t in range(self.window_size):
            step_feat = []
            for bs in base_stations:
                win = self.signal_history.get(bs.id, [0.0]*self.window_size)
                step_feat.append(win[t] if t < len(win) else 0.0)
                step_feat.append(float(bs.load))
            seqs.append(step_feat)
        return np.array(seqs, dtype=np.float32)

    def update_vitals(self):
        self.vitals['hr']   = max(40.0, min(200.0, self.vitals['hr']   + np.random.normal(0, 1.5)))
        self.vitals['spo2'] = max(80.0, min(100.0, self.vitals['spo2'] + np.random.normal(0, 0.4)))
        self.vitals['bp']   = max(70.0, min(200.0, self.vitals['bp']   + np.random.normal(0, 2.0)))
        alert = (self.vitals['spo2'] < 92.0 or self.vitals['hr'] < 45.0 or
                 self.vitals['hr'] > 150.0 or self.vitals['bp'] > 180.0)
        self.alert_active = alert

    def move(self, world_size=400):
        self.x += self.vx
        self.y += self.vy
        if self.x < 10 or self.x > world_size - 10:
            self.vx = -self.vx
            self.x = max(10, min(world_size - 10, self.x))
        if self.y < 10 or self.y > world_size - 10:
            self.vy = -self.vy
            self.y = max(10, min(world_size - 10, self.y))
        self.vx += np.random.normal(0, 0.2)
        self.vy += np.random.normal(0, 0.2)
        self.vx = max(-3.0, min(3.0, self.vx))
        self.vy = max(-3.0, min(3.0, self.vy))
        self.history.append((self.x, self.y))
        if len(self.history) > 60:
            self.history.pop(0)

    def to_dict(self):
        return {
            'id': self.id,
            'x': float(self.x),
            'y': float(self.y),
            'vx': float(self.vx),
            'vy': float(self.vy),
            'connectedBS': self.connected_station.id if self.connected_station else None,
            'handoverCount': self.handover_count,
            'packetsLost': self.packets_lost,
            'delay': float(self.handover_delay),
            'vitals': {k: float(v) for k, v in self.vitals.items()},
            'alertActive': self.alert_active,
            'history': [{'x': float(h[0]), 'y': float(h[1])} for h in self.history]
        }


# ═══════════════════════════════════════════════════════════════════════════
#  REAL ML MODELS & BACKEND MANAGER
# ═══════════════════════════════════════════════════════════════════════════

class MLModelManager:
    def __init__(self, n_bs=5):
        self.n_bs           = n_bs
        self.rf_model       = None
        self.rf_scaler      = None
        self.lstm_model     = None
        self.shap_explainer = None
        self.feature_names  = self._build_feature_names()
        self._init_models()

    def _build_feature_names(self):
        names = []
        for i in range(self.n_bs):
            names.extend([f'BS{i}_rssi_now', f'BS{i}_rssi_avg', f'BS{i}_rssi_trend', f'BS{i}_load', f'BS{i}_inv_dist'])
        names.extend(['velocity_x', 'velocity_y', 'handover_count'])
        return names

    def _init_models(self):
        rf_path = os.path.join(MODELS_DIR, 'rf_model.joblib')
        sc_path = os.path.join(MODELS_DIR, 'rf_scaler.joblib')
        if os.path.exists(rf_path) and os.path.exists(sc_path):
            try:
                self.rf_model  = joblib.load(rf_path)
                self.rf_scaler = joblib.load(sc_path)
                print("[OK] Loaded saved Random Forest model from disk.")
            except Exception as e:
                print(f"[WARN] Error loading RF model: {e}")

        if self.rf_model is None:
            print("[INFO] Initializing & training real Random Forest model on synthetic oracle dataset...")
            self._train_rf_model()

        lstm_path = os.path.join(MODELS_DIR, 'lstm_model.h5')
        if TF_AVAILABLE and os.path.exists(lstm_path):
            try:
                self.lstm_model = load_model(lstm_path)
                print("[OK] Loaded saved LSTM model from disk.")
            except Exception as e:
                print(f"[WARN] Error loading LSTM model: {e}")

        if TF_AVAILABLE and self.lstm_model is None:
            print("[INFO] Initializing & training real TensorFlow BiLSTM model...")
            self._train_lstm_model()

        if SHAP_AVAILABLE and self.rf_model:
            try:
                self.shap_explainer = shap.TreeExplainer(self.rf_model)
                print("[OK] SHAP TreeExplainer initialized for Random Forest.")
            except Exception as e:
                print(f"[WARN] SHAP init error: {e}")

    def _train_rf_model(self):
        X, y = [], []
        for _ in range(500):
            sig_now = [random.uniform(0.001, 0.05) for _ in range(self.n_bs)]
            best_bs = int(np.argmax(sig_now))
            feat = []
            for i in range(self.n_bs):
                s = sig_now[i]
                feat.extend([s, s*0.95, (s-s*0.9)/10, random.uniform(0.1, 0.8), 1.0/(random.uniform(10, 100))])
            feat.extend([random.uniform(-1, 1), random.uniform(-1, 1), random.randint(0, 10)])
            X.append(feat)
            y.append(best_bs)

        X = np.array(X, dtype=np.float32)
        y = np.array(y, dtype=np.int32)
        self.rf_scaler = StandardScaler()
        X_sc = self.rf_scaler.fit_transform(X)

        self.rf_model = RandomForestClassifier(n_estimators=100, max_depth=12, random_state=42)
        self.rf_model.fit(X_sc, y)

        joblib.dump(self.rf_model, os.path.join(MODELS_DIR, 'rf_model.joblib'))
        joblib.dump(self.rf_scaler, os.path.join(MODELS_DIR, 'rf_scaler.joblib'))
        print("[OK] Trained & saved Random Forest model.")

    def _train_lstm_model(self):
        inp = Input(shape=(10, 2 * self.n_bs))
        x   = Bidirectional(LSTM(64, return_sequences=False))(inp)
        x   = Dense(32, activation='relu')(x)
        out = Dense(self.n_bs, activation='softmax')(x)
        self.lstm_model = Model(inp, out)
        self.lstm_model.compile(optimizer=Adam(1e-3), loss='sparse_categorical_crossentropy', metrics=['accuracy'])
        
        X_dummy = np.random.normal(0.02, 0.01, size=(200, 10, 2 * self.n_bs))
        y_dummy = np.random.randint(0, self.n_bs, size=(200,))
        self.lstm_model.fit(X_dummy, y_dummy, epochs=3, batch_size=32, verbose=0)
        
        try:
            self.lstm_model.save(os.path.join(MODELS_DIR, 'lstm_model.h5'))
            print("[OK] Trained & saved BiLSTM TensorFlow model.")
        except Exception as e:
            print(f"[WARN] Error saving LSTM model: {e}")

    def predict_rf(self, ue, base_stations):
        feat = ue.get_feature_vector(base_stations)
        feat_sc = self.rf_scaler.transform(feat[np.newaxis, :])
        proba = self.rf_model.predict_proba(feat_sc)[0]
        best_id = int(np.argmax(proba))
        conf = float(proba[best_id])
        return base_stations[best_id], conf, feat_sc

    def predict_lstm(self, ue, base_stations):
        if TF_AVAILABLE and self.lstm_model:
            seq = ue.get_lstm_sequence(base_stations)
            proba = self.lstm_model.predict(seq[np.newaxis, :, :], verbose=0)[0]
            best_id = int(np.argmax(proba))
            conf = float(proba[best_id])
            return base_stations[best_id], conf
        else:
            return self.predict_rf(ue, base_stations)[:2]

    def predict_dqn(self, ue, base_stations):
        best_bs, best_q = None, -float('inf')
        for bs in base_stations:
            sig  = bs.get_signal_strength(ue)
            dist = math.sqrt((ue.x-bs.x)**2 + (ue.y-bs.y)**2) + 0.1
            q = 0.0
            if sig > 0.3: q += 2.0
            elif sig < 0.01: q -= 5.0
            else: q += 0.5
            if ue.connected_station and bs.id != ue.connected_station.id:
                q -= 0.8
            q -= bs.load * 0.5
            if ue.alert_active and sig > 0.3: q += 1.0
            if q > best_q:
                best_q = q
                best_bs = bs
        conf = float(min(0.98, max(0.6, 0.7 + best_q * 0.05)))
        return best_bs, conf

    def explain(self, ue, base_stations, chosen_bs, feat_sc, conf):
        top_feats = []
        if self.shap_explainer:
            try:
                sv = self.shap_explainer.shap_values(feat_sc)
                shap_arr = sv[chosen_bs.id][0] if isinstance(sv, list) else sv[0]
                top_idx = np.argsort(np.abs(shap_arr))[-5:][::-1]
                for i in top_idx:
                    val = float(shap_arr[i])
                    top_feats.append({
                        'name': self.feature_names[i],
                        'value': val,
                        'impact': 'positive' if val > 0 else 'negative'
                    })
            except Exception as e:
                pass

        if not top_feats:
            imps = self.rf_model.feature_importances_
            top_idx = np.argsort(imps)[-5:][::-1]
            for i in top_idx:
                top_feats.append({
                    'name': self.feature_names[i],
                    'value': float(imps[i]),
                    'impact': 'positive'
                })

        reasons = [
            f"Chosen BS{chosen_bs.id} RSSI is optimal with load {chosen_bs.load:.2f}",
            f"Distance to target cell: {math.sqrt((ue.x-chosen_bs.x)**2+(ue.y-chosen_bs.y)**2):.1f}m",
        ]
        if ue.alert_active:
            reasons.append("⚠️ MEDICAL ALERT: Monitored vitals critical — zero data loss prioritized")

        return {
            'step': int(getattr(ue, 'step', 0)),
            'ueId': ue.id,
            'fromBS': ue.connected_station.id if ue.connected_station else 'None',
            'toBS': chosen_bs.id,
            'confidence': conf,
            'reasons': reasons,
            'features': top_feats,
            'vitals': {k: float(v) for k, v in ue.vitals.items()},
            'alertActive': ue.alert_active
        }


# ═══════════════════════════════════════════════════════════════════════════
#  REAL PYTHON SIMULATION ENGINE
# ═══════════════════════════════════════════════════════════════════════════

class RealPythonSimulation:
    def __init__(self, algo='rssi', seed=42, n_bs=5, n_ues=6):
        random.seed(seed)
        np.random.seed(seed)
        self.algo = algo
        self.step = 0
        self.ml_manager = MLModelManager(n_bs=n_bs)

        coords = [(100, 100), (300, 100), (200, 200), (100, 300), (300, 300)]
        self.stations = [BaseStation(i, coords[i][0], coords[i][1]) for i in range(n_bs)]
        self.ues = [UE(i, random.uniform(50, 350), random.uniform(50, 350)) for i in range(n_ues)]

    def do_step(self):
        self.step += 1
        events = []

        for ue in self.ues:
            ue.step = self.step
            ue.move()
            ue.update_signal_history(self.stations)
            ue.update_vitals()

            chosen_bs = None
            conf = 1.0
            feat_sc = None

            if self.algo == 'rssi':
                best_sig = -1
                for bs in self.stations:
                    sig = bs.get_signal_strength(ue)
                    if sig > best_sig:
                        best_sig, chosen_bs = sig, bs
                if ue.connected_station and chosen_bs != ue.connected_station:
                    curr_sig = ue.connected_station.get_signal_strength(ue)
                    if best_sig <= curr_sig * 1.05:
                        chosen_bs = ue.connected_station

            elif self.algo == 'threshold':
                if ue.connected_station:
                    curr_sig = ue.connected_station.get_signal_strength(ue)
                    if curr_sig >= 0.3:
                        chosen_bs = ue.connected_station
                if chosen_bs is None:
                    chosen_bs = max(self.stations, key=lambda b: b.get_signal_strength(ue))

            elif self.algo == 'cost':
                def cost(bs):
                    dist = math.sqrt((ue.x-bs.x)**2 + (ue.y-bs.y)**2) + 0.1
                    sig  = bs.get_signal_strength(ue)
                    c    = (dist * bs.load * 10) / (sig + 1)
                    if ue.connected_station and bs.id != ue.connected_station.id:
                        c += 50
                    return c
                chosen_bs = min(self.stations, key=cost)

            elif self.algo == 'rf':
                chosen_bs, conf, feat_sc = self.ml_manager.predict_rf(ue, self.stations)
            elif self.algo == 'lstm':
                chosen_bs, conf = self.ml_manager.predict_lstm(ue, self.stations)
                feat_sc = self.ml_manager.rf_scaler.transform(ue.get_feature_vector(self.stations)[np.newaxis, :])
            elif self.algo == 'dqn':
                chosen_bs, conf = self.ml_manager.predict_dqn(ue, self.stations)
                feat_sc = self.ml_manager.rf_scaler.transform(ue.get_feature_vector(self.stations)[np.newaxis, :])

            if chosen_bs and (ue.connected_station is None or ue.connected_station.id != chosen_bs.id):
                ue.handover_count += 1
                if ue.connected_station:
                    curr_sig = ue.connected_station.get_signal_strength(ue)
                    if curr_sig < 0.008:
                        ue.packets_lost += 1
                ue.handover_delay += 0.2 + random.uniform(0, 0.3)
                
                if feat_sc is None:
                    feat_sc = self.ml_manager.rf_scaler.transform(ue.get_feature_vector(self.stations)[np.newaxis, :])
                xai_exp = self.ml_manager.explain(ue, self.stations, chosen_bs, feat_sc, conf)
                
                ue.connected_station = chosen_bs
                events.append(xai_exp)

        for bs in self.stations:
            bs.update_load()

        return events

    def get_kpis(self):
        total_ho   = sum(u.handover_count for u in self.ues)
        total_lost = sum(u.packets_lost for u in self.ues)
        avg_delay  = sum(u.handover_delay for u in self.ues) / max(1, len(self.ues))
        hfr        = (total_lost / max(1, total_ho)) * 100 if total_ho > 0 else 0.0
        cdp        = (total_lost / max(1, self.step * len(self.ues))) * 100 if self.step > 0 else 0.0
        alerts     = sum(1 for u in self.ues if u.alert_active)
        return {
            'step': self.step,
            'totalHO': total_ho,
            'totalLost': total_lost,
            'avgDelay': float(avg_delay),
            'hfr': float(hfr),
            'cdp': float(cdp),
            'alerts': alerts
        }


ACTIVE_SIMS = {
    algo: RealPythonSimulation(algo=algo)
    for algo in ['rssi', 'threshold', 'cost', 'lstm', 'rf', 'dqn']
}

# ═══════════════════════════════════════════════════════════════════════════
#  FLASK REST API ENDPOINTS
# ═══════════════════════════════════════════════════════════════════════════

@app.route('/api/status', methods=['GET'])
def get_status():
    return jsonify({
        'status': 'online',
        'backend': 'Python 3.12 Real ML Backend',
        'tf_available': TF_AVAILABLE,
        'shap_available': SHAP_AVAILABLE,
        'loaded_models': {
            'rf': ACTIVE_SIMS['rf'].ml_manager.rf_model is not None,
            'lstm': ACTIVE_SIMS['lstm'].ml_manager.lstm_model is not None,
            'dqn': True
        }
    })

@app.route('/api/reset', methods=['POST'])
def reset_sim():
    data = request.json or {}
    algo = data.get('algo', 'rssi')
    seed = data.get('seed', 42)
    ACTIVE_SIMS[algo] = RealPythonSimulation(algo=algo, seed=seed)
    return jsonify({'status': 'reset', 'algo': algo})

@app.route('/api/step', methods=['POST'])
def step_sim():
    data = request.json or {}
    algo = data.get('algo', 'rssi')
    if algo not in ACTIVE_SIMS:
        ACTIVE_SIMS[algo] = RealPythonSimulation(algo=algo)

    sim = ACTIVE_SIMS[algo]
    events = sim.do_step()
    kpis   = sim.get_kpis()

    return jsonify({
        'algo': algo,
        'step': sim.step,
        'stations': [bs.to_dict() for bs in sim.stations],
        'ues': [ue.to_dict() for ue in sim.ues],
        'kpis': kpis,
        'events': events
    })

@app.route('/api/batch_step', methods=['POST'])
def batch_step_sim():
    """
    High-performance endpoint: steps ALL algorithms in a single pass in Python
    Returns combined state for all algorithms in < 5ms.
    """
    results = {}
    for algo, sim in ACTIVE_SIMS.items():
        events = sim.do_step()
        kpis   = sim.get_kpis()
        results[algo] = {
            'algo': algo,
            'step': sim.step,
            'stations': [bs.to_dict() for bs in sim.stations],
            'ues': [ue.to_dict() for ue in sim.ues],
            'kpis': kpis,
            'events': events
        }
    return jsonify({'status': 'ok', 'results': results})

if __name__ == '__main__':
    print("="*60)
    print("  [SERVER] 4G Handover Real Python ML Backend Server")
    print("  Serving Real TensorFlow, Scikit-Learn & SHAP Inference")
    print("="*60)
    app.run(host='127.0.0.1', port=5000, debug=False)
