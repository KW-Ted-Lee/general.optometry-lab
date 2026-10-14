/* 雙眼正面圖（檢查者面對病人）：病人的右眼在畫面左邊
   世界座標單位為 mm；OLBino.drawEyes(s, c, opt)
   opt.R / opt.L：{ h, v } 眼球轉動量（稜鏡度 Δ）；h 為正＝往鼻側（內轉），v 為正＝往上
   opt.pupil：{ R, L } 瞳孔半徑（mm）；opt.cover："R" | "L" | null；opt.see：遮眼板半透明
   opt.reflex：顯示角膜反光；opt.light：{ R, L } 是否被筆燈照到（影響瞳孔亮度） */
(function () {
  const EX = 16, MM_PER_D = 0.12, HIRSCH = 22, KAPPA = 0.3;
  function almond(ctx, s, cx, cy, w, h) {
    ctx.beginPath();
    ctx.moveTo(s.X(cx - w / 2), s.Y(cy));
    ctx.bezierCurveTo(s.X(cx - w / 4), s.Y(cy + h * 0.75), s.X(cx + w / 4), s.Y(cy + h * 0.75), s.X(cx + w / 2), s.Y(cy));
    ctx.bezierCurveTo(s.X(cx + w / 4), s.Y(cy - h * 0.7), s.X(cx - w / 4), s.Y(cy - h * 0.7), s.X(cx - w / 2), s.Y(cy));
    ctx.closePath();
  }
  function one(s, c, side, rot, o) {
    const ctx = s.ctx, cx = side === "R" ? -EX : EX, nas = side === "R" ? 1 : -1;
    const ix = cx + nas * rot.h * MM_PER_D, iy = rot.v * MM_PER_D;
    const pr = (o.pupil && o.pupil[side]) || 2;
    ctx.save();
    almond(ctx, s, cx, 0, 28, 12);
    ctx.fillStyle = "#f7f4ee"; ctx.fill(); ctx.clip();
    ctx.beginPath(); ctx.arc(s.X(ix), s.Y(iy), s.sx * 5.8, 0, Math.PI * 2); ctx.fillStyle = o.iris || "#6b4f36"; ctx.fill();
    ctx.beginPath(); ctx.arc(s.X(ix), s.Y(iy), s.sx * pr, 0, Math.PI * 2); ctx.fillStyle = "#111"; ctx.fill();
    if (o.reflex !== false) {
      const rx = ix - nas * (rot.h / HIRSCH), ry = iy - rot.v / HIRSCH;
      ctx.beginPath(); ctx.arc(s.X(rx + nas * KAPPA), s.Y(ry), Math.max(2, s.sx * 0.45), 0, Math.PI * 2); ctx.fillStyle = "#fff"; ctx.shadowColor = "#fff"; ctx.shadowBlur = 6; ctx.fill();
    }
    ctx.restore();
    ctx.save(); almond(ctx, s, cx, 0, 28, 12); ctx.strokeStyle = "#5b4636"; ctx.lineWidth = 1.6; ctx.stroke(); ctx.restore();
    // 眉毛
    if (o.brow !== false) { ctx.save(); ctx.strokeStyle = c.muted; ctx.lineWidth = 3; ctx.beginPath();
    ctx.moveTo(s.X(cx - 13), s.Y(9)); ctx.quadraticCurveTo(s.X(cx), s.Y(13), s.X(cx + 13), s.Y(9.5)); ctx.stroke(); ctx.restore(); }
    if (o.cover === side) {
      ctx.save(); ctx.globalAlpha = o.see ? 0.45 : 0.96; ctx.fillStyle = c.ink;
      const x0 = s.X(cx - 15), y0 = s.Y(9), w = s.sx * 30, h = s.sx * 18;
      ctx.beginPath(); if (ctx.roundRect) ctx.roundRect(x0, y0, w, h, 8); else ctx.rect(x0, y0, w, h); ctx.fill(); ctx.restore();
      s.text("遮眼板", cx, -10.5, { size: 11, color: c.muted });
    }
    return { ix, iy };
  }
  function drawEyes(s, c, o = {}) {
    const R = o.R || { h: 0, v: 0 }, L = o.L || { h: 0, v: 0 };
    // 鼻樑
    s.line(0, 6, 0, -6, { color: c.line, w: 1, dash: [2, 4] });
    const a = one(s, c, "R", R, o), b = one(s, c, "L", L, o);
    if (o.labels !== false) { s.text("病人右眼 OD", -EX, -11.8, { size: 11, color: c.muted, dy: o.cover === "R" ? 14 : 0 }); s.text("病人左眼 OS", EX, -11.8, { size: 11, color: c.muted, dy: o.cover === "L" ? 14 : 0 }); }
    return { R: a, L: b };
  }
  window.OLBino = { drawEyes, EX, MM_PER_D, HIRSCH };
})();
