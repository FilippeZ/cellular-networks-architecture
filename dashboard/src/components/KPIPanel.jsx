import React from 'react';
import { ALGO_META } from '../simulation';

const styles = {
  card: {
    background: 'rgba(22,27,34,0.85)',
    border: '1px solid rgba(48,54,61,0.8)',
    borderRadius: '12px',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  title: {
    fontSize: '11px',
    fontWeight: 600,
    color: '#8b949e',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    marginBottom: '2px',
  },
  kpiGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '8px',
  },
  kpiItem: (color) => ({
    background: `${color}12`,
    border: `1px solid ${color}30`,
    borderRadius: '8px',
    padding: '10px 12px',
  }),
  kpiLabel: {
    fontSize: '10px',
    color: '#8b949e',
    fontWeight: 500,
    marginBottom: '2px',
  },
  kpiValue: (color) => ({
    fontSize: '20px',
    fontWeight: 700,
    color,
    fontFamily: "'JetBrains Mono', monospace",
    lineHeight: 1.2,
  }),
  kpiUnit: {
    fontSize: '10px',
    color: '#8b949e',
    marginLeft: '2px',
    fontWeight: 400,
  },
};

function KPIItem({ label, value, unit, color }) {
  return (
    <div style={styles.kpiItem(color)}>
      <div style={styles.kpiLabel}>{label}</div>
      <div style={styles.kpiValue(color)}>
        {value}
        <span style={styles.kpiUnit}>{unit}</span>
      </div>
    </div>
  );
}

function MiniSparkline({ data, color, width = 120, height = 32 }) {
  if (!data || data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - min) / range) * height;
    return `${x},${y}`;
  });
  const polyline = pts.join(' ');
  const areaPath = `M0,${height} L${pts[0]} L${polyline.split(' ').slice(1).join(' L')} L${width},${height} Z`;

  return (
    <svg width={width} height={height} style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id={`sg-${color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0.01" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#sg-${color.replace('#','')})`} />
      <polyline
        points={polyline}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function KPIPanel({ algo, kpis, kpiHistory, activeAlerts }) {
  const meta   = ALGO_META[algo];
  const isML   = meta.type === 'ml';

  const hoData   = kpiHistory?.map(k => k.totalHO)  || [];
  const lostData = kpiHistory?.map(k => k.totalLost) || [];
  const hfrData  = kpiHistory?.map(k => k.hfr)       || [];

  return (
    <div style={styles.card}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            background: meta.color + '20',
            border: `1px solid ${meta.color}50`,
            borderRadius: '6px',
            padding: '3px 8px',
            fontSize: '12px',
            fontWeight: 600,
            color: meta.color,
          }}>
            {meta.icon} {meta.label}
          </span>
          {isML && (
            <span style={{
              background: '#bc8cff20',
              border: '1px solid #bc8cff40',
              borderRadius: '4px',
              padding: '2px 6px',
              fontSize: '9px',
              fontWeight: 700,
              color: '#bc8cff',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
            }}>
              ML
            </span>
          )}
        </div>
        <div style={{
          fontSize: '10px',
          color: '#8b949e',
          fontFamily: "'JetBrains Mono', monospace",
        }}>
          step {kpis.step}
        </div>
      </div>

      {/* KPI Grid */}
      <div style={styles.kpiGrid}>
        <KPIItem label="Handovers" value={kpis.totalHO}          unit=""     color={meta.color} />
        <KPIItem label="HFR"       value={kpis.hfr?.toFixed(1)}  unit="%"    color={kpis.hfr > 5 ? '#ff7b72' : '#3fb950'} />
        <KPIItem label="Lost Pkts" value={kpis.totalLost}        unit=""     color={kpis.totalLost > 0 ? '#ffa657' : '#3fb950'} />
        <KPIItem label="CDP"       value={kpis.cdp?.toFixed(2)}  unit="%"    color={kpis.cdp > 5 ? '#ff7b72' : '#3fb950'} />
      </div>

      {/* Sparklines */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <div style={{ fontSize: '10px', color: '#8b949e', marginBottom: '2px' }}>Trend</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '9px', color: '#8b949e', width: '36px' }}>HO</span>
          <MiniSparkline data={hoData} color={meta.color} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '9px', color: '#8b949e', width: '36px' }}>HFR</span>
          <MiniSparkline data={hfrData} color="#ff7b72" />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '9px', color: '#8b949e', width: '36px' }}>Lost</span>
          <MiniSparkline data={lostData} color="#ffa657" />
        </div>
      </div>

      {/* Notebook Section 8 Benchmark Highlight */}
      <div style={{
        background: '#161b22',
        border: '1px solid rgba(56,139,253,0.3)',
        borderRadius: '8px',
        padding: '8px 10px',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '9px', textTransform: 'uppercase', color: '#58a6ff', fontWeight: 700 }}>
            Notebook Sec 8 Benchmark
          </span>
          <span style={{ fontSize: '9px', color: '#8b949e', fontFamily: 'monospace' }}>200 Steps</span>
        </div>
        <div style={{ fontSize: '11px', fontWeight: 600, color: meta.color }}>
          {algo === 'lstm' && '🥇 2.45% CDP (49 Lost) — Proactive Winner'}
          {algo === 'rf' && '🥈 8.85% CDP (177 Lost) — 94.34% RF Accuracy'}
          {algo === 'cost' && '🥉 9.85% CDP (197 Lost) — Oracle Baseline'}
          {algo === 'dqn' && '⚠️ 25.50% CDP (510 Lost) — 20 Ep. Early Policy'}
          {algo === 'rssi' && '🔴 38.65% CDP (773 Lost) — Load Ignorant'}
          {algo === 'threshold' && '🔴 75.50% CDP (1510 Lost) — Ping-Pong Collapse'}
        </div>
      </div>

      {/* Medical Alerts */}
      {activeAlerts > 0 && (
        <div style={{
          background: 'rgba(255,123,114,0.08)',
          border: '1px solid rgba(255,123,114,0.4)',
          borderRadius: '8px',
          padding: '6px 10px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          animation: 'fadeIn 0.3s ease',
        }}>
          <span style={{ fontSize: '13px' }}>⚠️</span>
          <span style={{ fontSize: '10px', color: '#ff7b72', fontWeight: 600 }}>
            {activeAlerts} Medical Alert{activeAlerts > 1 ? 's' : ''} Active (Zero-Data-Loss Active)
          </span>
        </div>
      )}
    </div>
  );
}

