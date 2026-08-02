import React, { useRef, useEffect, useCallback } from 'react';
import { WORLD_SIZE, ALGO_META } from '../simulation';

const CANVAS_PADDING = 24;

export default function NetworkCanvas({ state, width = 480, height = 480 }) {
  const canvasRef = useRef(null);
  const { stations, ues, algo } = state;
  const algoMeta = ALGO_META[algo];

  const toCanvas = useCallback((v, isX) => {
    const range = isX ? width : height;
    return CANVAS_PADDING + (v / WORLD_SIZE) * (range - CANVAS_PADDING * 2);
  }, [width, height]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // DPR scaling
    const dpr = window.devicePixelRatio || 1;
    canvas.width  = width  * dpr;
    canvas.height = height * dpr;
    canvas.style.width  = width  + 'px';
    canvas.style.height = height + 'px';
    ctx.scale(dpr, dpr);

    // ── Background ────────────────────────────────────────────────────
    ctx.fillStyle = '#0d1117';
    ctx.fillRect(0, 0, width, height);

    // Grid
    ctx.strokeStyle = 'rgba(48,54,61,0.35)';
    ctx.lineWidth   = 0.5;
    for (let i = 0; i <= 8; i++) {
      const x = CANVAS_PADDING + (i / 8) * (width  - CANVAS_PADDING * 2);
      const y = CANVAS_PADDING + (i / 8) * (height - CANVAS_PADDING * 2);
      ctx.beginPath(); ctx.moveTo(x, CANVAS_PADDING); ctx.lineTo(x, height - CANVAS_PADDING); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(CANVAS_PADDING, y); ctx.lineTo(width - CANVAS_PADDING, y);  ctx.stroke();
    }

    // ── Coverage circles ──────────────────────────────────────────────
    for (const bs of stations) {
      const cx = toCanvas(bs.x, true);
      const cy = toCanvas(bs.y, false);
      const cr = toCanvas(bs.coverage, true) - toCanvas(0, true);

      // Outer glow
      const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, cr);
      gradient.addColorStop(0,   'rgba(88,166,255,0.08)');
      gradient.addColorStop(0.7, 'rgba(88,166,255,0.04)');
      gradient.addColorStop(1,   'rgba(88,166,255,0.00)');
      ctx.beginPath();
      ctx.arc(cx, cy, cr, 0, Math.PI * 2);
      ctx.fillStyle   = gradient;
      ctx.fill();
      ctx.strokeStyle = `rgba(88,166,255,${0.15 + (1 - bs.load) * 0.2})`;
      ctx.lineWidth   = 1;
      ctx.setLineDash([5, 4]);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // ── UE Trails ─────────────────────────────────────────────────────
    for (const ue of ues) {
      if (!ue.history || ue.history.length < 2) continue;
      ctx.beginPath();
      ctx.moveTo(toCanvas(ue.history[0].x, true), toCanvas(ue.history[0].y, false));
      for (let i = 1; i < ue.history.length; i++) {
        ctx.lineTo(toCanvas(ue.history[i].x, true), toCanvas(ue.history[i].y, false));
      }
      ctx.strokeStyle = ue.color + '40';
      ctx.lineWidth   = 1.2;
      ctx.stroke();
    }

    // ── Connection lines ──────────────────────────────────────────────
    for (const ue of ues) {
      if (!ue.connectedBS) continue;
      const ux = toCanvas(ue.x, true);
      const uy = toCanvas(ue.y, false);
      const bx = toCanvas(ue.connectedBS.x, true);
      const by = toCanvas(ue.connectedBS.y, false);
      ctx.beginPath();
      ctx.moveTo(ux, uy);
      ctx.lineTo(bx, by);
      const quality = 1 / (Math.hypot(ue.x - ue.connectedBS.x, ue.y - ue.connectedBS.y) / 100 + 0.5);
      ctx.strokeStyle = ue.alertActive
        ? `rgba(255,123,114,${0.6 * quality})`
        : `rgba(63,185,80,${0.5 * quality})`;
      ctx.lineWidth = ue.alertActive ? 1.5 : 1;
      ctx.setLineDash([3, 4]);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // ── Base Stations ─────────────────────────────────────────────────
    for (const bs of stations) {
      const cx = toCanvas(bs.x, true);
      const cy = toCanvas(bs.y, false);

      // Tower icon (hexagon)
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI) / 3 - Math.PI / 6;
        const px = cx + 12 * Math.cos(angle);
        const py = cy + 12 * Math.sin(angle);
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fillStyle   = '#161b22';
      ctx.fill();
      ctx.strokeStyle = `rgba(88,166,255,${0.6 + (1 - bs.load) * 0.4})`;
      ctx.lineWidth   = 1.5;
      ctx.stroke();

      // Load bar inside hexagon
      const loadBarW = 16 * bs.load;
      const loadColor = bs.load > 0.75 ? '#ff7b72' : bs.load > 0.5 ? '#ffa657' : '#3fb950';
      ctx.fillStyle = loadColor + '99';
      ctx.fillRect(cx - 8, cy - 2, loadBarW, 4);

      // BS label
      ctx.fillStyle  = '#58a6ff';
      ctx.font       = 'bold 9px Inter';
      ctx.textAlign  = 'center';
      ctx.fillText(`BS${bs.id}`, cx, cy + 22);
    }

    // ── User Equipment ─────────────────────────────────────────────────
    for (const ue of ues) {
      const ux = toCanvas(ue.x, true);
      const uy = toCanvas(ue.y, false);

      // Alert pulse
      if (ue.alertActive) {
        const prog = ((Date.now() / 600) % 1);
        const r2 = 8 + prog * 14;
        ctx.beginPath();
        ctx.arc(ux, uy, r2, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255,123,114,${0.8 * (1 - prog)})`;
        ctx.lineWidth   = 2;
        ctx.stroke();
      }

      // UE body
      ctx.beginPath();
      ctx.arc(ux, uy, 7, 0, Math.PI * 2);
      ctx.fillStyle   = ue.alertActive ? '#ff7b72' : ue.color;
      ctx.fill();
      ctx.strokeStyle = '#0d1117';
      ctx.lineWidth   = 1.5;
      ctx.stroke();

      // UE id
      ctx.fillStyle = '#0d1117';
      ctx.font      = 'bold 7px Inter';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(ue.id, ux, uy);
      ctx.textBaseline = 'alphabetic';
    }

    // ── Algo badge ────────────────────────────────────────────────────
    ctx.fillStyle   = 'rgba(13,17,23,0.75)';
    ctx.roundRect?.(8, 8, 120, 22, 6);
    ctx.fill();
    ctx.fillStyle = algoMeta.color;
    ctx.font      = 'bold 10px Inter';
    ctx.textAlign = 'left';
    ctx.fillText(`${algoMeta.icon} ${algoMeta.label}`, 14, 23);

  }, [state, width, height, toCanvas, algoMeta]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        borderRadius: '12px',
        border: `1px solid rgba(48,54,61,0.8)`,
        background: '#0d1117',
        display: 'block',
      }}
    />
  );
}
