import React from 'react';

export default function XAIPanel({ explanation }) {
  if (!explanation) {
    return (
      <div style={{
        background: 'rgba(22,27,34,0.85)',
        border: '1px solid rgba(48,54,61,0.8)',
        borderRadius: '12px',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
        minHeight: '200px',
        color: '#484f58',
      }}>
        <span style={{ fontSize: '28px' }}>🔍</span>
        <span style={{ fontSize: '12px', textAlign: 'center' }}>
          XAI explanation will appear here<br/>when a handover is triggered
        </span>
      </div>
    );
  }

  const { algoLabel, fromBS, toBS, confidence, reasons, features, vitals, alertActive, step } = explanation;
  const isML = ['LSTM (ML)', 'Random Forest', 'DQN RL'].some(a => algoLabel?.includes(a.split(' ')[0]));

  return (
    <div style={{
      background: 'rgba(22,27,34,0.9)',
      border: alertActive ? '1px solid rgba(255,123,114,0.5)' : '1px solid rgba(48,54,61,0.8)',
      borderRadius: '12px',
      padding: '16px',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      animation: 'slideIn 0.3s ease',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontSize: '10px', color: '#8b949e', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '4px' }}>
            🔍 XAI Report — Step {step}
          </div>
          <div style={{ fontSize: '14px', fontWeight: 700, color: '#e6edf3' }}>
            BS{fromBS} → BS{toBS}
          </div>
        </div>
        {confidence != null && (
          <div style={{
            background: confidence > 0.85 ? 'rgba(63,185,80,0.15)' : 'rgba(255,166,87,0.15)',
            border: `1px solid ${confidence > 0.85 ? 'rgba(63,185,80,0.4)' : 'rgba(255,166,87,0.4)'}`,
            borderRadius: '8px',
            padding: '4px 10px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '9px', color: '#8b949e' }}>Confidence</div>
            <div style={{
              fontSize: '16px',
              fontWeight: 700,
              fontFamily: "'JetBrains Mono', monospace",
              color: confidence > 0.85 ? '#3fb950' : '#ffa657',
            }}>
              {(confidence * 100).toFixed(0)}%
            </div>
          </div>
        )}
      </div>

      {/* Alert Banner */}
      {alertActive && (
        <div style={{
          background: 'rgba(255,123,114,0.1)',
          border: '1px solid rgba(255,123,114,0.4)',
          borderRadius: '8px',
          padding: '8px 12px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}>
          <span style={{ fontSize: '16px' }}>⚠️</span>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#ff7b72' }}>MEDICAL ALERT ACTIVE</div>
            <div style={{ fontSize: '10px', color: '#8b949e', marginTop: '2px' }}>
              HR: {vitals?.hr?.toFixed(0)} bpm | SpO₂: {vitals?.spo2?.toFixed(1)}% | BP: {vitals?.bp?.toFixed(0)} mmHg
            </div>
          </div>
        </div>
      )}

      {/* Reasons */}
      <div>
        <div style={{ fontSize: '10px', color: '#8b949e', fontWeight: 600, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Rationale
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {reasons?.map((r, i) => (
            <div key={i} style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '6px',
              fontSize: '11px',
              color: '#c9d1d9',
            }}>
              <span style={{ color: '#3fb950', marginTop: '1px', flexShrink: 0 }}>▶</span>
              <span>{r}</span>
            </div>
          ))}
        </div>
      </div>

      {/* SHAP-like Feature Attribution */}
      {features && features.length > 0 && (
        <div>
          <div style={{ fontSize: '10px', color: '#8b949e', fontWeight: 600, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            {isML ? 'SHAP Feature Attribution' : 'Feature Attribution'}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            {features.slice(0, 5).map((f, i) => {
              const maxAbsVal = Math.max(...features.map(x => Math.abs(x.value)), 0.01);
              const pct = Math.abs(f.value) / maxAbsVal * 100;
              const color = f.impact === 'positive' ? '#3fb950' : '#ff7b72';
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{
                    color: '#8b949e',
                    width: '130px',
                    flexShrink: 0,
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '9px',
                  }}>
                    {f.name}
                  </span>
                  <div style={{
                    flex: 1,
                    height: '8px',
                    background: 'rgba(48,54,61,0.5)',
                    borderRadius: '4px',
                    overflow: 'hidden',
                  }}>
                    <div style={{
                      width: `${pct}%`,
                      height: '100%',
                      background: color,
                      borderRadius: '4px',
                      transition: 'width 0.4s ease',
                    }} />
                  </div>
                  <span style={{
                    fontSize: '9px',
                    color,
                    fontFamily: "'JetBrains Mono', monospace",
                    width: '42px',
                    textAlign: 'right',
                    flexShrink: 0,
                  }}>
                    {f.impact === 'positive' ? '+' : ''}{(f.value * 100).toFixed(2)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Vitals (non-alert) */}
      {!alertActive && vitals && (
        <div style={{
          background: 'rgba(63,185,80,0.06)',
          border: '1px solid rgba(63,185,80,0.2)',
          borderRadius: '8px',
          padding: '8px 12px',
          display: 'flex',
          gap: '16px',
        }}>
          <div style={{ fontSize: '10px', color: '#8b949e' }}>
            HR: <span style={{ color: '#3fb950', fontWeight: 600 }}>{vitals.hr?.toFixed(0)}</span>
          </div>
          <div style={{ fontSize: '10px', color: '#8b949e' }}>
            SpO₂: <span style={{ color: '#3fb950', fontWeight: 600 }}>{vitals.spo2?.toFixed(1)}%</span>
          </div>
          <div style={{ fontSize: '10px', color: '#8b949e' }}>
            BP: <span style={{ color: '#3fb950', fontWeight: 600 }}>{vitals.bp?.toFixed(0)}</span>
          </div>
        </div>
      )}
    </div>
  );
}
