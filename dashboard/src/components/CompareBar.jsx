import React from 'react';
import { ALGO_META, NOTEBOOK_BENCHMARK_RESULTS } from '../simulation';


export default function CompareBar({ allKPIs }) {
  const [activeTab, setActiveTab] = React.useState('live');
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
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid rgba(48,54,61,0.6)',
        paddingBottom: '8px',
      }}>
        <div style={{
          fontSize:      '11px',
          fontWeight:    700,
          color:         '#8b949e',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
        }}>
          📊 Algorithm Comparison
        </div>

        <div style={{ display: 'flex', gap: '4px' }}>
          <button
            onClick={() => setActiveTab('live')}
            style={{
              background: activeTab === 'live' ? '#238636' : 'transparent',
              color: activeTab === 'live' ? '#fff' : '#8b949e',
              border: '1px solid rgba(48,54,61,0.8)',
              borderRadius: '6px',
              padding: '3px 8px',
              fontSize: '10px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Live KPI
          </button>
          <button
            onClick={() => setActiveTab('notebook')}
            style={{
              background: activeTab === 'notebook' ? '#1f6feb' : 'transparent',
              color: activeTab === 'notebook' ? '#fff' : '#8b949e',
              border: '1px solid rgba(48,54,61,0.8)',
              borderRadius: '6px',
              padding: '3px 8px',
              fontSize: '10px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Notebook Sec 8
          </button>
        </div>
      </div>

      {activeTab === 'notebook' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ fontSize: '10px', color: '#8b949e', lineHeight: 1.4 }}>
            Official simulation benchmark from <b>notebooks/4G_Handover_ML.ipynb</b> (Section 8, 200 steps):
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '10px', color: '#c9d1d9' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #30363d', textAlign: 'left', color: '#8b949e' }}>
                <th style={{ padding: '4px' }}>Algo</th>
                <th style={{ padding: '4px' }}>HO</th>
                <th style={{ padding: '4px' }}>Lost</th>
                <th style={{ padding: '4px' }}>HFR</th>
                <th style={{ padding: '4px' }}>CDP</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(NOTEBOOK_BENCHMARK_RESULTS).map(([k, item]) => (
                <tr key={k} style={{ borderBottom: '1px solid rgba(48,54,61,0.4)' }}>
                  <td style={{ padding: '4px', fontWeight: 600, color: ALGO_META[k]?.color }}>
                    {ALGO_META[k]?.icon} {item.algo}
                  </td>
                  <td style={{ padding: '4px', fontFamily: 'monospace' }}>{item.handovers}</td>
                  <td style={{ padding: '4px', fontFamily: 'monospace' }}>{item.lostPackets}</td>
                  <td style={{ padding: '4px', fontFamily: 'monospace' }}>{item.hfr}%</td>
                  <td style={{ padding: '4px', fontFamily: 'monospace', fontWeight: 700, color: item.cdp < 5 ? '#3fb950' : '#ff7b72' }}>
                    {item.cdp}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ fontSize: '9px', color: '#8b949e', fontStyle: 'italic', marginTop: '4px' }}>
            💡 <b>LSTM</b> is absolute winner with 2.45% CDP; <b>Threshold</b> collapses with 2000 HO ping-ponging.
          </div>
        </div>
      ) : (
        <>
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
        </>
      )}
    </div>
  );
}

