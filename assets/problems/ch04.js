/* 第 4 章 練習題（原創，數字隨機） */
(function () {
  const { define, F } = (typeof window !== "undefined" ? window : globalThis).OBPractice;
  const ceil4 = (v) => Math.ceil(v * 4 - 1e-9) / 4;

  define("ch04", [
    { id: "4-1", title: "由遠點與近點求 AA", gen(r) {
      const K = r.pick([-4, -3, -2.5, -2, -1, 0, 1, 1.5, 2, 3]), AA = r.step(Math.max(2, K + 2), 12, 0.5);
      const Ffp = -K, Fnp = Ffp + AA; // 以視標聚散度需求表示
      const np = 100 / Fnp;
      const fpTxt = K === 0 ? "遠點在無限遠" : K < 0 ? `遠點在眼前 ${(100 / -K).toFixed(1)} cm` : `遠點在眼後 ${(100 / K).toFixed(1)} cm（虛遠點）`;
      return {
        q: `一位未矯正、屈光狀態 ${K === 0 ? "正視" : F.D(K)} 的病人，${fpTxt}，近點在眼前 ${np.toFixed(1)} cm。調節幅度是多少？`,
        parts: [{ label: "AA", type: "num", ans: AA, unit: "D", tol: 0.06 }],
        steps: [
          { c: "把遠點與近點換成屈光度（眼前為正的調節需求）。", e: `F_fp = ${F.s(Ffp)} D；F_np = 100 / ${np.toFixed(1)} = ${F.s(Fnp)} D` },
          { c: "AA ＝ F_np − F_fp。", e: `${F.s(Fnp)} − ${F.s(Ffp)} = ${AA.toFixed(2)} D` },
          { c: K < 0 ? "近視者的遠點在眼前，看近本來就省調節，所以近點比同 AA 的正視者更近。" : K > 0 ? "遠視者看遠就要用調節，近點會比同 AA 的正視者更遠。" : "正視眼遠點在無限遠，AA 就是 1 ÷ 近點。" },
        ],
      };
    } },
    { id: "4-2", title: "Hofstetter 三個期望值", gen(r) {
      const A = r.int(8, 55);
      const mx = 25 - 0.4 * A, av = 18.5 - 0.3 * A, mn = 15 - 0.25 * A;
      return {
        q: `${A} 歲病人，依 Hofstetter 公式，最大、平均、最小調節幅度各是多少？`,
        parts: [{ label: "最大", type: "num", ans: mx, unit: "D" }, { label: "平均", type: "num", ans: av, unit: "D" }, { label: "最小", type: "num", ans: mn, unit: "D" }],
        steps: [
          { c: "最大 ＝ 25 − 0.4 × 年齡。", e: `25 − 0.4 × ${A} = ${mx.toFixed(2)}` },
          { c: "平均 ＝ 18.5 − 0.3 × 年齡。", e: `18.5 − 0.3 × ${A} = ${av.toFixed(2)}` },
          { c: "最小 ＝ 15 − 0.25 × 年齡。", e: `15 − 0.25 × ${A} = ${mn.toFixed(2)}` },
        ],
      };
    } },
    { id: "4-3", title: "推進法判讀", gen(r) {
      const A = r.int(12, 45), mn = 15 - 0.25 * A;
      const aa = Math.max(1, +(mn + r.pick([-3, -2, -1, 0.5, 1.5, 3])).toFixed(2)), np = 100 / aa;
      const bad = aa < mn;
      return {
        q: `${A} 歲病人戴遠用矯正，推進法近點為 ${np.toFixed(1)} cm。(a) 調節幅度？(b) 判讀？`,
        parts: [{ label: "(a) AA", type: "num", ans: aa, unit: "D", tol: 0.06 }, { label: "(b) 判讀", type: "choice", opts: ["符合年齡期望值", "低於最小值，疑似調節不足"], ans: bad ? 1 : 0 }],
        steps: [
          { c: "已矯正，遠點在無限遠，AA ＝ 1 ÷ 近點。", e: `100 / ${np.toFixed(1)} = ${aa.toFixed(2)} D` },
          { c: "和 Hofstetter 最小值比較。", e: `15 − 0.25 × ${A} = ${mn.toFixed(2)} D → ${bad ? "低於最小值" : "高於最小值"}` },
        ],
      };
    } },
    { id: "4-4", title: "暫定加入度", gen(r) {
      const wd = r.pick([33, 40, 50]), A = r.int(42, 65), AA = Math.max(0.5, +(18.5 - 0.3 * A).toFixed(2));
      const raw = 100 / wd - AA / 2, add = Math.max(0, ceil4(raw));
      return {
        q: `${A} 歲病人，以 Hofstetter 平均值估計 AA，閱讀距離 ${wd} cm。暫定加入度是多少？（四捨五入到 0.25 D，不足時取較高的一格）`,
        parts: [{ label: "暫定 Add", type: "num", ans: add, unit: "D", tol: 0.01 }],
        steps: [
          { c: "先估 AA。", e: `18.5 − 0.3 × ${A} = ${AA.toFixed(2)} D` },
          { c: "閱讀距離的調節需求 ＝ 1 ÷ 距離。", e: `100 / ${wd} = ${(100 / wd).toFixed(2)} D` },
          { c: "保留一半調節：Add ＝ 需求 − ½AA。", e: `${(100 / wd).toFixed(2)} − ${(AA / 2).toFixed(2)} = ${raw.toFixed(2)} → ${F.s(add)}` },
        ],
      };
    } },
    { id: "4-5", title: "加入度的清晰視範圍", gen(r) {
      const add = r.step(1, 3, 0.25), AA = r.step(0.5, 2.5, 0.5);
      const far = 100 / add, near = 100 / (add + AA);
      return {
        q: `病人 AA ${AA.toFixed(2)} D，戴遠用矯正加上 ${F.s(add)} 的加入度。清晰視範圍的近端與遠端各是幾公分？`,
        parts: [{ label: "近端", type: "num", ans: near, unit: "cm", dp: 1, tol: 0.6 }, { label: "遠端", type: "num", ans: far, unit: "cm", dp: 1, tol: 0.6 }],
        steps: [
          { c: "遠端：調節完全放鬆，只靠加入度聚焦。", e: `100 / ${add.toFixed(2)} = ${far.toFixed(1)} cm` },
          { c: "近端：加入度加上全部調節。", e: `100 / (${add.toFixed(2)} + ${AA.toFixed(2)}) = ${near.toFixed(1)} cm` },
        ],
      };
    } },
    { id: "4-6", title: "用 NRA／PRA 平衡加入度", gen(r) {
      const add = r.step(0.75, 2.5, 0.25), nra = r.step(0.5, 2.5, 0.25), pra = -r.step(0.25, 2.5, 0.25);
      const fin = add + (nra + pra) / 2;
      return {
        q: `暫定加入度 ${F.s(add)} 下，測得 NRA ${F.s(nra)}、PRA ${F.s(pra)}。平衡後的加入度是多少？`,
        parts: [{ label: "最終 Add", type: "num", ans: fin, unit: "D", dp: 3, tol: 0.13 }],
        steps: [
          { c: "Add′ ＝ Add ＋（NRA ＋ PRA）÷ 2。", e: `${F.s(add)} + (${F.s(nra)} + ${F.s(pra)}) / 2 = ${F.s(fin, 3)}` },
          { c: nra + pra > 0 ? "NRA 比較大，表示還有空間再加正。" : nra + pra < 0 ? "PRA 比較大，表示加入度給太多，要減少。" : "兩者相等，已經平衡。" },
          { c: "結果不在 0.25 的格子上時，取接近的一格並以試戴確認。" },
        ],
      };
    } },
  ]);
})();
