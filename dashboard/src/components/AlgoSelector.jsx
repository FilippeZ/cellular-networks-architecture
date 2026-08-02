import React from 'react';
import { ALGO_META } from '../simulation';

const ALGO_KEYS = Object.keys(ALGO_META);

export default function AlgoSelector({ selected, onSelect, disabled }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <div style={{
        fontSize: '10px',
        fontWeight: 600,
        color: '#8b949e',
        textTransform: 'uppercase',
        letterSpacing: '0.07em',
        marginBottom: '2px',
      }}>
        Algorithm
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px' }}>
        {ALGO_KEYS.map(key => {
          const meta    = ALGO_META[key];
          const active  = selected === key;
          const isML    = meta.type === 'ml';
          return (
            <button
              key={key}
              onClick={() => onSelect(key)}
              disabled={disabled}
              style={{
                background:    active ? `${meta.color}20` : 'rgba(22,27,34,0.6)',
                border:        `1px solid ${active ? meta.color + '60' : 'rgba(48,54,61,0.7)'}`,
                borderRadius:  '8px',
                padding:       '8px 10px',
                cursor:        disabled ? 'not-allowed' : 'pointer',
                display:       'flex',
                flexDirection: 'column',
                alignItems:    'center',
                gap:           '3px',
                transition:    'all 0.2s ease',
                opacity:       disabled ? 0.6 : 1,
                transform:     active ? 'scale(1.03)' : 'scale(1)',
                boxShadow:     active ? `0 0 16px ${meta.color}30` : 'none',
              }}
            >
              <span style={{ fontSize: '16px' }}>{meta.icon}</span>
              <span style={{
                fontSize:   '10px',
                fontWeight: active ? 700 : 500,
                color:      active ? meta.color : '#8b949e',
                textAlign:  'center',
                lineHeight: 1.2,
              }}>
                {meta.label.replace(' (ML)', '')}
              </span>
              {isML && (
                <span style={{
                  fontSize:        '8px',
                  fontWeight:      700,
                  color:           active ? '#bc8cff' : '#484f58',
                  textTransform:   'uppercase',
                  letterSpacing:   '0.05em',
                }}>
                  ML
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
