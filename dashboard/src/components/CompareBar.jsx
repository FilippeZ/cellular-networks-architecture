import React from 'react';
import { ALGO_META } from '../simulation';

export default function CompareBar({ allKPIs }) {
  const algos = Object.keys(allKPIs);
  if (algos.length === 0) return null;

  const metrics = [
    { key: 'hfr',        label: 'HFR (%)',        decimals: 2, lowerBetter: true  },
    { key: 'cdp',        label: 'CDP (%)',         decimals: 3, lowerBetter: true  },
    { key: 'totalLost',  label: 'Packets Lost',    decimals: 0, lowerBetter: true  },
    { key: 'totalHO',    label: 'Handovers',       decimals: 0, lowerBetter: true  },
    { key: 'avgDelay',   label: 'Avg Delay (s)',   decimals: 2, lowerBetter: true  },
  ];

  return (
    <div style={{
      background:   'rgba(22,27,34,0.9)',
      border:       '1px solid rgba(48,54,61,0.8)',
      borderRadius: '12px',
      padding:      '16px',
      display:      'flex',
      flexDirection:'column',
      gap:          '14px',
    }}>
      <div style={{
        fontSize:      '11px',
        fontWeight:    700,
        color:         '#8b949e',
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
      }}>
        📊 Live KPI Comparison
      </div>

      {metrics.map(metric => {
        const vals = algos.map(a => ({ algo: a, val: allKPIs[a]?.[metric.key] ?? 0 }));
        const maxVal = Math.max(...vals.map(v => v.val), 0.001);
        const best   = vals.reduce((b, v) => metric.lowerBetter ? (v.val < b.val ? v : b) : (v.val > b.val ? v : b));

        return (
          <div key={metric.key}>
            <div style={{
              display:        'flex',
              justifyContent: 'space-between',
              marginBottom:   '5px',
            }}>
              <span style={{ fontSize: '10px', color: '#8b949e', fontWeight: 600 }}>{metric.label}</span>
              <span style={{ fontSize: '9px', color: '#3fb950' }}>
                Best: {ALGO_META[best.algo]?.icon} {ALGO_META[best.algo]?.label} ({best.val.toFixed(metric.decimals)})
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {vals.map(({ algo, val }) => {
                const meta  = ALGO_META[algo];
                const pct   = maxVal > 0 ? (val / maxVal) * 100 : 0;
                const isBest = algo === best.algo;
                return (
                  <div key={algo} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{
                      fontSize:   '10px',
                      color:      meta.color,
                      width:      '80px',
                      flexShrink: 0,
                      fontWeight: isBest ? 700 : 400,
                    }}>
                      {meta.icon} {meta.label.replace(' (ML)', '').slice(0, 8)}
                    </span>
                    <div style={{
                      flex:       1,
                      height:     '10px',
                      background: 'rgba(48,54,61,0.5)',
                      borderRadius:'5px',
                      overflow:   'hidden',
                      position:   'relative',
                    }}>
                      <div style={{
                        width:        `${pct}%`,
                        height:       '100%',
                        background:   isBest ? meta.color : meta.color + '70',
                        borderRadius: '5px',
                        transition:   'width 0.5s ease',
                        boxShadow:    isBest ? `0 0 8px ${meta.color}80` : 'none',
                      }} />
                    </div>
                    <span style={{
                      fontSize:    '10px',
                      color:       isBest ? '#3fb950' : '#8b949e',
                      fontFamily:  "'JetBrains Mono', monospace",
                      width:       '45px',
                      textAlign:   'right',
                      flexShrink:  0,
                      fontWeight:  isBest ? 700 : 400,
                    }}>
                      {val.toFixed(metric.decimals)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
