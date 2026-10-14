/* 第 9 章 練習題（原創，數字隨機）眼位：內斜＋、外斜− */
(function () {
  const { define, F } = (typeof window !== "undefined" ? window : globalThis).OBPractice;
  const ph = (v) => (v === 0 ? "正位" : v > 0 ? `${v}Δ 內斜` : `${-v}Δ 外斜`);

  define("ch09", [
    { id: "9-1", title: "計算法 AC/A", gen(r) {
      const pd = r.pick([56, 58, 60, 62, 64, 66, 68]), d = r.int(-6, 4), n = r.int(-14, 8), dn = r.pick([2.5, 2.5, 3]);
      const aca = pd / 10 + (n - d) / dn;
      return {
        q: `PD ${pd} mm，遠眼位 ${ph(d)}，近眼位（${dn === 2.5 ? "40" : "33"} cm）${ph(n)}。計算法 AC/A 是多少？`,
        parts: [{ label: "AC/A", type: "num", ans: aca, unit: "Δ/D", dp: 2, tol: 0.06 }],
        steps: [
          { c: "AC/A ＝ PD（cm）＋（近眼位 − 遠眼位）÷ 近距離屈光度；內斜記正、外斜記負。", e: `${(pd / 10).toFixed(1)} + (${F.s(n, 0)} − ${F.s(d, 0)}) / ${dn}` },
          { c: "計算。", e: `${(pd / 10).toFixed(1)} + ${F.n((n - d) / dn)} = ${aca.toFixed(2)} Δ/D` },
        ],
      };
    } },
    { id: "9-2", title: "梯度法 AC/A", gen(r) {
      const n = r.int(-12, 6), lens = r.pick([-1, -1, +1]), aca = r.int(1, 8), after = n + aca * (-lens);
      return {
        q: `近距離眼位 ${ph(n)}，加上 ${F.s(lens)} D 鏡片後變成 ${ph(after)}。梯度法 AC/A 是多少？`,
        parts: [{ label: "AC/A", type: "num", ans: aca, unit: "Δ/D", dp: 1, tol: 0.06 }],
        steps: [
          { c: `${lens < 0 ? "負鏡片誘發調節，眼位往內斜方向移動" : "正鏡片放鬆調節，眼位往外斜方向移動"}。`, e: `改變量 = ${F.s(after, 0)} − (${F.s(n, 0)}) = ${F.s(after - n, 0)}Δ` },
          { c: "AC/A ＝ 眼位改變量 ÷ 調節改變量。", e: `${Math.abs(after - n)} / ${Math.abs(lens).toFixed(2)} = ${aca} Δ/D` },
        ],
      };
    } },
    { id: "9-3", title: "Sheard 準則", gen(r) {
      const exo = r.rand() < 0.65, p = r.int(4, 14) * (exo ? -1 : 1), res = r.int(4, 24);
      const need = (2 / 3) * Math.abs(p) - res / 3, ans = Math.max(0, need);
      return {
        q: `近距離眼位 ${ph(p)}，${exo ? "BO" : "BI"} 模糊點 ${res}Δ。依 Sheard 準則需要多少稜鏡？（不需要請填 0）`,
        parts: [{ label: "稜鏡量", type: "num", ans, unit: "Δ", dp: 1, tol: 0.15 }, { label: "基底", type: "choice", opts: ["BI", "BO", "不需要"], ans: ans === 0 ? 2 : exo ? 0 : 1 }],
        steps: [
          { c: `${exo ? "外斜看 BO（正融像聚散）" : "內斜看 BI（負融像聚散）"}，要求儲存力 ≥ 2 × 眼位。`, e: `${res} ${res >= 2 * Math.abs(p) ? "≥" : "<"} ${2 * Math.abs(p)}` },
          { c: "P ＝ ⅔ × 眼位 − ⅓ × 儲存力。", e: `⅔ × ${Math.abs(p)} − ⅓ × ${res} = ${F.n(need)}${need <= 0 ? " → 不需要稜鏡" : `Δ ${exo ? "BI" : "BO"}`}` },
        ],
      };
    } },
    { id: "9-4", title: "Duane–White 分類", gen(r) {
      const T = [["內聚不足（CI）", -1, -10, "低"], ["外散過度（DE）", -12, -3, "高"], ["基本外斜", -8, -8, "正常"], ["內聚過度（CE）", 0, 9, "高"], ["外散不足（DI）", 8, 1, "低"], ["基本內斜", 6, 6, "正常"]];
      const k = r.int(0, 5), [name, d0, n0, ac] = T[k], d = d0 + r.int(-1, 1), n = n0 + r.int(-1, 1);
      const pd = 60, aca = pd / 10 + (n - d) / 2.5;
      return {
        q: `PD 60 mm，遠眼位 ${ph(d)}，近眼位 ${ph(n)}。依 Duane–White 分類屬於？`,
        parts: [{ label: "分類", type: "choice", opts: T.map((t) => t[0]), ans: k }],
        steps: [
          { c: "先看外斜還是內斜，再比較遠近哪個大。", e: `遠 ${ph(d)}、近 ${ph(n)}` },
          { c: "AC/A 可以幫忙確認。", e: `6.0 + (${F.s(n, 0)} − ${F.s(d, 0)}) / 2.5 = ${aca.toFixed(1)} Δ/D（${ac}）` },
          { c: `結論：${name}。` },
        ],
      };
    } },
    { id: "9-5", title: "Percival 準則", gen(r) {
      const bi = r.int(3, 20), bo = r.int(3, 26);
      const G = Math.max(bi, bo), L = Math.min(bi, bo), p = G / 3 - (2 * L) / 3, ans = Math.max(0, p);
      return {
        q: `近距離 BI 模糊點 ${bi}Δ、BO 模糊點 ${bo}Δ。依 Percival 準則需要多少稜鏡？（不需要請填 0）`,
        parts: [{ label: "稜鏡量", type: "num", ans, unit: "Δ", dp: 1, tol: 0.15 }, { label: "基底", type: "choice", opts: ["BI", "BO", "不需要"], ans: ans === 0 ? 2 : bo > bi ? 1 : 0 }],
        steps: [
          { c: "G 為較大側、L 為較小側。", e: `G = ${G}（${bo >= bi ? "BO" : "BI"}），L = ${L}` },
          { c: "P ＝ ⅓G − ⅔L。", e: `${G} / 3 − 2 × ${L} / 3 = ${F.n(p)}` },
          { c: p <= 0 ? "P ≤ 0，需求點已在中間三分之一，不需要稜鏡。" : `基底朝較大側：${bo > bi ? "BO" : "BI"}。` },
        ],
      };
    } },
  ]);
})();
