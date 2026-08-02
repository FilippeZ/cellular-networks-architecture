import React, { useState, useEffect, useRef, useCallback } from 'react';
import NetworkCanvas from './components/NetworkCanvas';
import KPIPanel      from './components/KPIPanel';
import XAIPanel      from './components/XAIPanel';
import AlgoSelector  from './components/AlgoSelector';
import CompareBar    from './components/CompareBar';
import { createSimState, simStep, getKPIs, ALGO_META } from './simulation';

const ALL_ALGOS = Object.keys(ALGO_META);

const SPEEDS = [
  { label: '0.5×', ms: 500 },
  { label: '1×',   ms: 250 },
  { label: '2×',   ms: 125 },
  { label: '4×',   ms: 60  },
  { label: '8×',   ms: 25  },
];

function Tab({ active, onClick, children }) {
  return (
    <button onClick={onClick} style={{
      background:   active ? 'rgba(88,166,255,0.15)' : 'transparent',
      border:       `1px solid ${active ? 'rgba(88,166,255,0.4)' : 'transparent'}`,
      borderRadius: '6px',
      padding:      '6px 16px',
      fontSize:     '11px',
      fontWeight:   active ? 700 : 400,
      color:        active ? '#58a6ff' : '#8b949e',
      cursor:       'pointer',
      transition:   'all 0.15s ease',
      fontFamily:   "'Inter', sans-serif",
    }}>
      {children}
    </button>
  );
}

function Btn({ onClick, disabled, color = '#58a6ff', bg, children }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      background:   bg ?? `${color}18`,
      border:       `1px solid ${color}55`,
      borderRadius: '8px',
      padding:      '7px 16px',
      fontSize:     '12px',
      fontWeight:   600,
      color,
      cursor:       disabled ? 'not-allowed' : 'pointer',
      opacity:      disabled ? 0.5 : 1,
      transition:   'all 0.15s ease',
      fontFamily:   "'Inter', sans-serif",
      whiteSpace:   'nowrap',
    }}>
      {children}
    </button>
  );
}

// ── Initial state factory ────────────────────────────────────
const makeInitial = () => ({
  states:  Object.fromEntries(ALL_ALGOS.map(a => [a, createSimState(a, 42)])),
  kpis:    Object.fromEntries(ALL_ALGOS.map(a => [a, getKPIs(createSimState(a, 42))])),
});

export default function App() {
  const initial = useRef(makeInitial());

  const [states,   setStates]   = useState(initial.current.states);
  const [allKPIs,  setAllKPIs]  = useState(initial.current.kpis);
  const [algo,     setAlgo]     = useState('rssi');
  const [running,  setRunning]  = useState(false);
  const [speedIdx, setSpeedIdx] = useState(1);
  const [tab,      setTab]      = useState('single');
  const [xaiLog,   setXaiLog]   = useState([]);
  const [lastXAI,  setLastXAI]  = useState(null);

  const timerRef = useRef(null);

  // ── Single deterministic tick — pure JS, zero latency ─────
  const tick = useCallback(() => {
    setStates(prev => {
      const next    = {};
      const newKPIs = {};
      const newXAI  = [];

      for (const a of ALL_ALGOS) {
        const ns  = simStep(prev[a]);
        next[a]   = ns;
        newKPIs[a] = getKPIs(ns);
        for (const ev of (ns.lastEvents || [])) {
          if (ev.exp) newXAI.push(ev.exp);
        }
      }

      // Update KPIs and XAI log outside this setter via a microtask
      setTimeout(() => {
        setAllKPIs(newKPIs);
        if (newXAI.length > 0) {
          setXaiLog(log => [...log.slice(-49), ...newXAI]);
          setLastXAI(newXAI[newXAI.length - 1]);
        }
      }, 0);

      return next;
    });
  }, []);

  // ── Timer management ───────────────────────────────────────
  useEffect(() => {
    if (running) {
      timerRef.current = setInterval(tick, SPEEDS[speedIdx].ms);
    }
    return () => clearInterval(timerRef.current);
  }, [running, speedIdx, tick]);

  const handleReset = () => {
    setRunning(false);
    clearInterval(timerRef.current);
    const init = makeInitial();
    setStates(init.states);
    setAllKPIs(init.kpis);
    setXaiLog([]);
    setLastXAI(null);
  };

  const handleStep = () => {
    if (!running) tick();
  };

  const activeState  = states[algo] || {};
  const activeKPIs   = allKPIs[algo] || {};
  const activeAlerts = (activeState.ues || []).filter(u => u.alertActive).length;

  const mlAlgos    = ['lstm', 'rf', 'dqn'];
  const staticAlgos = ['rssi', 'threshold', 'cost'];
  const bestML      = mlAlgos.reduce((b, a) => (allKPIs[a]?.hfr ?? 999) < (allKPIs[b]?.hfr ?? 999) ? a : b);
  const bestStatic  = staticAlgos.reduce((b, a) => (allKPIs[a]?.hfr ?? 999) < (allKPIs[b]?.hfr ?? 999) ? a : b);
  const mlWins      = (allKPIs[bestML]?.hfr ?? 0) < (allKPIs[bestStatic]?.hfr ?? 0);
  const showBanner  = (activeState.step || 0) > 10;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: "'Inter', sans-serif" }}>

      {/* ══ Header ══════════════════════════════════════════════ */}
      <header style={{
        borderBottom: '1px solid rgba(48,54,61,0.8)',
        padding: '12px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'rgba(13,17,23,0.97)',
        backdropFilter: 'blur(12px)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        gap: '12px',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
          <div style={{
            width: '34px', height: '34px',
            background: 'linear-gradient(135deg, #58a6ff 0%, #bc8cff 100%)',
            borderRadius: '9px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '17px',
          }}>📡</div>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#e6edf3' }}>4G Handover Intelligence</div>
            <div style={{ fontSize: '10px', color: '#8b949e' }}>Static vs ML — Live Simulation Dashboard</div>
          </div>
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {/* Speed selector */}
          <div style={{
            display: 'flex',
            background: 'rgba(22,27,34,0.9)',
            border: '1px solid rgba(48,54,61,0.7)',
            borderRadius: '7px',
            overflow: 'hidden',
          }}>
            {SPEEDS.map((s, i) => (
              <button key={i} onClick={() => setSpeedIdx(i)} style={{
                background: speedIdx === i ? '#58a6ff25' : 'transparent',
                border: 'none',
                borderRight: i < SPEEDS.length - 1 ? '1px solid rgba(48,54,61,0.5)' : 'none',
                padding: '5px 10px',
                fontSize: '10px',
                fontWeight: speedIdx === i ? 700 : 400,
                color: speedIdx === i ? '#58a6ff' : '#8b949e',
                cursor: 'pointer',
                fontFamily: "'Inter', sans-serif",
              }}>{s.label}</button>
            ))}
          </div>

          <Btn onClick={handleStep} disabled={running} color="#8b949e">⏭ Step</Btn>

          <Btn
            onClick={() => setRunning(r => !r)}
            color={running ? '#ff7b72' : '#58a6ff'}
            bg={running ? 'rgba(255,123,114,0.15)' : 'rgba(88,166,255,0.15)'}
          >
            {running ? '⏸ Pause' : '▶ Run'}
          </Btn>

          <Btn onClick={handleReset} color="#8b949e">↺ Reset</Btn>
        </div>

        {/* Step counter */}
        <div style={{
          background: 'rgba(88,166,255,0.08)',
          border: '1px solid rgba(88,166,255,0.2)',
          borderRadius: '7px',
          padding: '5px 12px',
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '12px',
          color: '#58a6ff',
          fontWeight: 600,
          flexShrink: 0,
        }}>
          Step {activeState.step ?? 0}
          {running && <span style={{ color: '#3fb950', marginLeft: '8px', fontSize: '9px' }}>● LIVE</span>}
        </div>
      </header>

      {/* ══ ML vs Static Banner ════════════════════════════════════ */}
      {showBanner && (
        <div style={{
          background: mlWins ? 'rgba(63,185,80,0.06)' : 'rgba(240,136,62,0.06)',
          borderBottom: `1px solid ${mlWins ? 'rgba(63,185,80,0.2)' : 'rgba(240,136,62,0.2)'}`,
          padding: '7px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '11px',
        }}>
          <span style={{ fontSize: '13px' }}>{mlWins ? '🧠' : '📊'}</span>
          <span style={{ color: mlWins ? '#3fb950' : '#f0883e', fontWeight: 600 }}>
            {mlWins
              ? `ML outperforming static — ${ALGO_META[bestML].label} HFR: ${(allKPIs[bestML]?.hfr ?? 0).toFixed(2)}%  vs  ${ALGO_META[bestStatic].label} (best static): ${(allKPIs[bestStatic]?.hfr ?? 0).toFixed(2)}%`
              : `Static competitive at step ${activeState.step} — ${ALGO_META[bestStatic].label} leading. ML advantage builds over time.`
            }
          </span>
        </div>
      )}

      {/* ══ Main ═══════════════════════════════════════════════════ */}
      <main style={{ flex: 1, padding: '18px 24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '4px' }}>
          <Tab active={tab === 'single'}  onClick={() => setTab('single')}>🎯 Single Algorithm</Tab>
          <Tab active={tab === 'compare'} onClick={() => setTab('compare')}>📊 Live Comparison</Tab>
          <Tab active={tab === 'xai'}     onClick={() => setTab('xai')}>🔍 XAI Log</Tab>
        </div>

        {/* ── SINGLE TAB ────────────────────────────────────────── */}
        {tab === 'single' && (
          <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr 270px', gap: '14px', alignItems: 'start' }}>

            {/* Left column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <AlgoSelector selected={algo} onSelect={setAlgo} />
              <KPIPanel
                algo={algo}
                kpis={activeKPIs}
                kpiHistory={activeState.kpiHistory}
                activeAlerts={activeAlerts}
              />

              {/* Patient vitals */}
              <div style={{
                background: 'rgba(22,27,34,0.85)',
                border: '1px solid rgba(48,54,61,0.8)',
                borderRadius: '12px',
                padding: '14px',
              }}>
                <div style={{ fontSize: '10px', fontWeight: 600, color: '#8b949e', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '8px' }}>
                  🏥 Patient Vitals
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  {(activeState.ues || []).slice(0, 6).map(ue => (
                    <div key={ue.id} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '7px',
                      padding: '5px 9px',
                      background: ue.alertActive ? 'rgba(255,123,114,0.08)' : 'rgba(48,54,61,0.15)',
                      border: `1px solid ${ue.alertActive ? 'rgba(255,123,114,0.3)' : 'rgba(48,54,61,0.3)'}`,
                      borderRadius: '7px',
                    }}>
                      <div style={{
                        width: 7, height: 7, borderRadius: '50%',
                        background: ue.alertActive ? '#ff7b72' : '#3fb950',
                        boxShadow: `0 0 6px ${ue.alertActive ? '#ff7b72' : '#3fb950'}`,
                        flexShrink: 0,
                      }} />
                      <span style={{ fontSize: '10px', color: ue.color, fontWeight: 700, width: '28px' }}>UE{ue.id}</span>
                      <span style={{ fontSize: '9px', color: '#8b949e', fontFamily: "'JetBrains Mono', monospace" }}>
                        ♥{ue.vitals?.hr?.toFixed(0)} O₂{ue.vitals?.spo2?.toFixed(0)}%
                      </span>
                      {ue.alertActive && (
                        <span style={{ fontSize: '9px', color: '#ff7b72', fontWeight: 700, marginLeft: 'auto' }}>⚠ ALERT</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Centre: network canvas */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
              <NetworkCanvas state={activeState} width={530} height={530} />
              <div style={{
                display: 'flex', gap: '14px',
                fontSize: '10px', color: '#8b949e',
                background: 'rgba(22,27,34,0.6)',
                border: '1px solid rgba(48,54,61,0.5)',
                borderRadius: '7px',
                padding: '7px 14px',
              }}>
                <span>🔷 Base Station (hex = load)</span>
                <span>● UE / patient wearable</span>
                <span style={{ color: '#3fb950' }}>— Strong link</span>
                <span style={{ color: '#ff7b72' }}>— Weak / Alert</span>
              </div>
            </div>

            {/* Right: XAI explanation */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ fontSize: '10px', fontWeight: 600, color: '#8b949e', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                🔍 Last Handover — XAI
              </div>
              <XAIPanel explanation={xaiLog.filter(e => e.algo === algo).slice(-1)[0] ?? null} />
            </div>
          </div>
        )}

        {/* ── COMPARE TAB ───────────────────────────────────────── */}
        {tab === 'compare' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

            {/* Summary cards */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {ALL_ALGOS.map(a => {
                const meta = ALGO_META[a];
                const kpi  = allKPIs[a] || {};
                const isBestML     = a === bestML     && mlWins;
                const isBestStatic = a === bestStatic && !mlWins;
                return (
                  <div key={a} onClick={() => { setAlgo(a); setTab('single'); }} style={{
                    background: `${meta.color}10`,
                    border: `1px solid ${isBestML || isBestStatic ? meta.color + '80' : meta.color + '28'}`,
                    borderRadius: '10px',
                    padding: '10px 14px',
                    flex: '1',
                    minWidth: '120px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    boxShadow: isBestML || isBestStatic ? `0 0 16px ${meta.color}30` : 'none',
                  }}>
                    <div style={{ fontSize: '11px', fontWeight: 600, color: meta.color, marginBottom: '5px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      {meta.icon} {meta.label}
                      {(isBestML || isBestStatic) && <span style={{ fontSize: '9px', background: meta.color + '30', borderRadius: '4px', padding: '1px 5px' }}>BEST</span>}
                    </div>
                    <div style={{ fontSize: '10px', color: '#8b949e', lineHeight: 1.7 }}>
                      HFR: <b style={{ color: '#e6edf3' }}>{(kpi.hfr ?? 0).toFixed(2)}%</b><br/>
                      Lost: <b style={{ color: '#e6edf3' }}>{kpi.totalLost ?? 0}</b><br/>
                      HO: <b style={{ color: '#e6edf3' }}>{kpi.totalHO ?? 0}</b>
                    </div>
                    {meta.type === 'ml' && (
                      <div style={{ fontSize: '8px', color: '#bc8cff', fontWeight: 700, marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                        ✦ Proactive ML
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <CompareBar allKPIs={allKPIs} />

            {/* 6 mini canvases */}
            <div>
              <div style={{ fontSize: '10px', fontWeight: 600, color: '#8b949e', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '8px' }}>
                Network Topology — All Algorithms
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                {ALL_ALGOS.map(a => (
                  <div key={a} onClick={() => { setAlgo(a); setTab('single'); }} style={{ cursor: 'pointer' }}>
                    <NetworkCanvas state={states[a] || {}} width={270} height={255} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── XAI TAB ────────────────────────────────────────────── */}
        {tab === 'xai' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '14px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '7px', maxHeight: '72vh', overflowY: 'auto', paddingRight: '4px' }}>
              <div style={{ fontSize: '10px', fontWeight: 600, color: '#8b949e', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '2px' }}>
                🔍 Handover Decision Log — {xaiLog.length} events
              </div>
              {xaiLog.length === 0 && (
                <div style={{ color: '#484f58', fontSize: '12px', textAlign: 'center', marginTop: '40px' }}>
                  Press ▶ Run or ⏭ Step to generate XAI explanations
                </div>
              )}
              {[...xaiLog].reverse().map((exp, i) => {
                const meta = ALGO_META[exp.algo] ?? ALGO_META.rssi;
                return (
                  <div key={i} onClick={() => setLastXAI(exp)}
                    onMouseEnter={e => e.currentTarget.style.borderColor = meta.color + '60'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = exp.alertActive ? 'rgba(255,123,114,0.4)' : 'rgba(48,54,61,0.6)'}
                    style={{
                      background: 'rgba(22,27,34,0.8)',
                      border: `1px solid ${exp.alertActive ? 'rgba(255,123,114,0.4)' : 'rgba(48,54,61,0.6)'}`,
                      borderRadius: '9px',
                      padding: '10px 12px',
                      cursor: 'pointer',
                      transition: 'border-color 0.15s ease',
                    }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                        <span style={{
                          background: `${meta.color}20`,
                          border: `1px solid ${meta.color}40`,
                          borderRadius: '4px', padding: '1px 7px',
                          fontSize: '10px', fontWeight: 600, color: meta.color,
                        }}>
                          {meta.icon} {meta.label}
                        </span>
                        <span style={{ fontSize: '11px', fontWeight: 600, color: '#e6edf3' }}>
                          BS{exp.fromBS} → BS{exp.toBS}
                        </span>
                        {exp.alertActive && <span>⚠️</span>}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                        {exp.confidence != null && (
                          <span style={{
                            fontSize: '10px',
                            fontFamily: "'JetBrains Mono', monospace",
                            color: exp.confidence > 0.85 ? '#3fb950' : '#ffa657',
                            fontWeight: 600,
                          }}>
                            {(exp.confidence * 100).toFixed(0)}%
                          </span>
                        )}
                        <span style={{ fontSize: '9px', color: '#484f58', fontFamily: "'JetBrains Mono', monospace" }}>
                          s{exp.step}
                        </span>
                      </div>
                    </div>
                    <div style={{ fontSize: '10px', color: '#8b949e' }}>{exp.reasons?.[0]}</div>
                  </div>
                );
              })}
            </div>

            <div style={{ position: 'sticky', top: '72px' }}>
              <div style={{ fontSize: '10px', fontWeight: 600, color: '#8b949e', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '8px' }}>
                Detailed Report
              </div>
              <XAIPanel explanation={lastXAI} />
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid rgba(48,54,61,0.4)',
        padding: '8px 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        fontSize: '10px', color: '#484f58',
      }}>
        <span>📡 4G Handover Intelligence Dashboard</span>
        <span>University of Patras — Cellular Networks Architecture</span>
        <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>
          {ALL_ALGOS.length} algorithms · {(states[algo]?.ues || []).length} UEs · {(states[algo]?.stations || []).length} Base Stations
        </span>
      </footer>
    </div>
  );
}
