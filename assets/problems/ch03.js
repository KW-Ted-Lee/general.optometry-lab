/* 第 3 章 練習題（原創，數字隨機） */
(function () {
  const { define, F } = (typeof window !== "undefined" ? window : globalThis).OBPractice;
  const ax = (a) => String(((a - 1 + 180) % 180) + 1).padStart(3, "0");
  const WD = [[0.5, "50 cm"], [0.667, "67 cm"], [1, "1 m"]];
  const wdL = (w) => (w === 0.667 ? 1.5 : 1 / w);

  define("ch03", [
    { id: "3-1", title: "檢影淨度數", gen(r) {
      const [w, lab] = r.pick(WD), g = r.step(-6, 6, 0.25), net = g - wdL(w);
      return {
        q: `工作距離 ${lab}，檢影在某條徑線中和時的總度數是 ${F.D(g)}。淨度數是多少？`,
        parts: [{ label: "淨度數", type: "num", ans: net, unit: "D", tol: 0.01 }],
        steps: [
          { c: "工作距離鏡 ＝ 1 ÷ 工作距離。", e: `1 / ${w === 0.667 ? "0.67" : w} = ${F.D(wdL(w))}` },
          { c: "net ＝ gross − 工作距離鏡。", e: `${F.s(g)} − ${F.u(wdL(w))} = ${F.D(net)}` },
        ],
      };
    } },
    { id: "3-2", title: "兩條徑線寫成處方", gen(r) {
      const [w, lab] = r.pick(WD);
      let g1 = r.step(-5, 5, 0.25), g2 = r.step(-5, 5, 0.25); while (g2 === g1) g2 = r.step(-5, 5, 0.25);
      const n1 = g1 - wdL(w), n2 = g2 - wdL(w);
      const sph = Math.max(n1, n2), cyl = Math.min(n1, n2) - sph, axis = n1 >= n2 ? 180 : 90;
      return {
        q: `工作距離 ${lab}。180 徑線在 ${F.D(g1)} 中和，090 徑線在 ${F.D(g2)} 中和。請寫出負散處方。`,
        parts: [{ label: "球面", type: "num", ans: sph, unit: "D", tol: 0.01 }, { label: "柱面", type: "num", ans: cyl, unit: "D", tol: 0.01 }, { label: "軸度", type: "num", ans: axis, dp: 0, tol: 0.1 }],
        steps: [
          { c: "兩條徑線各扣工作距離鏡。", e: `180：${F.s(g1)} − ${F.u(wdL(w))} = ${F.s(n1)}；090：${F.s(g2)} − ${F.u(wdL(w))} = ${F.s(n2)}` },
          { c: "負散寫法：球面取較正的那條，柱面 ＝ 較負 − 較正。", e: `sph ${F.s(sph)}，cyl ${F.s(Math.min(n1, n2))} − ${F.s(sph)} = ${F.s(cyl)}` },
          { c: "軸度就是較正那條徑線的方向（光帶與軸平行）。", e: `${F.s(sph)} ${F.s(cyl)} ×${ax(axis)}` },
        ],
      };
    } },
    { id: "3-3", title: "紅綠測試怎麼調", gen(r) {
      const L = r.step(-6, 1, 0.25), k = r.pick([-0.5, -0.25, 0, 0.25, 0.5]), K = L + k; // 實際需要 K
      const ans = k < 0 ? 0 : k > 0 ? 1 : 2;
      const say = ["紅色比較清楚", "綠色比較清楚", "兩邊一樣清楚"][ans];
      return {
        q: `綜合驗光儀球面目前是 ${F.D(L)}，做紅綠測試時病人說「${say}」。下一步怎麼做？`,
        parts: [{ label: "處置", type: "choice", opts: ["加 −0.25", "加 +0.25", "已達終點"], ans }],
        steps: [
          { c: "眼睛對綠光的屈光力較強，綠光焦點在紅光前面。" },
          { c: ans === 0 ? "紅清：焦點還在網膜前（欠矯），加負。" : ans === 1 ? "綠清：焦點在網膜後（過矯），加正。" : "兩邊一樣：黃光焦點在網膜上，達到紅綠終點。", e: "口訣 RAM-GAP：Red Add Minus、Green Add Plus" },
        ],
      };
    } },
    { id: "3-4", title: "鐘面圖三十法則", gen(r) {
      const h = r.int(1, 12), hs = h > 6 ? h - 6 : h, axis = hs * 30;
      const rule = (axis <= 30 || axis >= 150) ? 0 : (axis >= 60 && axis <= 120) ? 1 : 2;
      return {
        q: `霧視後，病人說 ${Math.min(h, h > 6 ? h - 6 : h + 6)}–${Math.max(h, h > 6 ? h - 6 : h + 6)} 點鐘方向的線最黑。(a) 負柱鏡軸在幾度？(b) 屬於哪一類？`,
        parts: [{ label: "(a) 軸度", type: "num", ans: axis, dp: 0, tol: 0.1 }, { label: "(b) 類型", type: "choice", opts: ["順散 WTR", "逆散 ATR", "斜散 OBL"], ans: rule }],
        steps: [
          { c: "線是成對的，取較小的鐘點數。", e: `${hs}` },
          { c: "負柱鏡軸 ＝ 鐘點 × 30。", e: `${hs} × 30 = ${ax(axis)}` },
          { c: "負柱軸在 180±30 順散、090±30 逆散，其餘斜散。", e: ["順散", "逆散", "斜散"][rule] },
        ],
      };
    } },
    { id: "3-5", title: "JCC 的判讀", gen(r) {
      const kind = r.int(0, 1), A = r.pick([10, 30, 45, 75, 90, 105, 135, 160, 180]), C = -r.step(0.5, 2.5, 0.25), face = r.int(0, 1);
      if (kind === 0) {
        const red = face === 0 ? A + 45 : A - 45;
        return {
          q: `測軸：柱鏡 ${F.s(C)} ×${ax(A)}，JCC 手柄對齊柱鏡軸。病人說紅點在 ${ax(red)} 的那一面比較清楚，柱鏡軸應該往哪個方向轉？`,
          parts: [{ label: "方向", type: "choice", opts: [`往 ${ax(A + 5)}（增加角度）`, `往 ${ax(A - 5)}（減少角度）`, "不用轉"], ans: face === 0 ? 0 : 1 }],
          steps: [
            { c: "測軸的規則是「追紅點」：柱鏡軸往較清楚那一面紅點的方向轉。" },
            { c: `紅點在 ${ax(red)}，位於 ${ax(A)} 的${face === 0 ? "逆時針（角度增加）" : "順時針（角度減少）"}那一側。`, e: `${ax(A)} → ${ax(face === 0 ? A + 5 : A - 5)}` },
            { c: "柱鏡度數越大，每次轉的角度越小（大約 5 度）；度數小時可轉 10–15 度。" },
          ],
        };
      }
      const nc = face === 0 ? C - 0.25 : C + 0.25;
      return {
        q: `測度數：柱鏡 ${F.s(C)} ×${ax(A)}。病人說${face === 0 ? "紅點" : "白點"}對齊柱鏡軸的那一面比較清楚。新的柱鏡度數是多少？`,
        parts: [{ label: "柱鏡", type: "num", ans: nc, unit: "D", tol: 0.01 }],
        steps: [
          { c: face === 0 ? "紅點（負柱軸）對齊時較清楚 → 需要更多負柱鏡，加 −0.25。" : "白點（正柱軸）對齊時較清楚 → 負柱鏡給太多，減 −0.25。", e: `${F.s(C)} → ${F.s(nc)}` },
          { c: "記得累積球面補償：柱鏡每變 −0.50，球面補 +0.25。" },
        ],
      };
    } },
    { id: "3-6", title: "柱鏡改變的球面補償", gen(r) {
      const S = r.step(-5, 2, 0.25), C1 = -r.step(0, 2, 0.25);
      let C2 = -r.step(0.25, 3, 0.25); while (C2 === C1) C2 = -r.step(0.25, 3, 0.25);
      const dC = C2 - C1, dS = -dC / 2, S2 = S + dS;
      return {
        q: `處方 ${F.s(S)} ${Math.abs(C1) < 0.001 ? "DS" : F.s(C1)}，JCC 後柱鏡改為 ${F.s(C2)}。要維持等價球面，球面應該變成多少？`,
        parts: [{ label: "新球面", type: "num", ans: S2, unit: "D", dp: 3, tol: 0.006 }],
        steps: [
          { c: "柱鏡變化量。", e: `${F.s(C2)} − ${F.s(C1)} = ${F.s(dC)}` },
          { c: "球面補償 ＝ −柱鏡變化 ÷ 2。", e: `${F.s(dS, 3)}` },
          { c: "新球面。", e: `${F.s(S)} + ${F.s(dS, 3)} = ${F.s(S2, 3)}${Math.abs(S2 * 4 - Math.round(S2 * 4)) > 1e-6 ? "（遇到 0.125 時先記帳，湊滿兩格再補）" : ""}` },
          { c: "驗算 SE 不變。", e: `${F.s(S + C1 / 2, 3)} = ${F.s(S2 + C2 / 2, 3)}` },
        ],
      };
    } },
  ]);
})();
