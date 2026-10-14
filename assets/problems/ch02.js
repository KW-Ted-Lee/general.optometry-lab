/* 第 2 章 練習題（原創，數字隨機） */
(function () {
  const { define, F } = (typeof window !== "undefined" ? window : globalThis).OBPractice;
  const ax = (a) => String(((a - 1 + 180) % 180) + 1).padStart(3, "0");
  const norm = (a) => ((a - 1 + 180) % 180) + 1;
  const AXES = [5, 10, 15, 20, 30, 45, 60, 75, 80, 90, 95, 100, 120, 135, 150, 165, 170, 175, 180];

  define("ch02", [
    { id: "2-1", title: "屈光力與焦距", gen(r) {
      const f = r.pick([0.125, 0.2, 0.25, 0.4, 0.5, 0.667, 1, 2]), n = r.pick([1, 1, 1.333]);
      const D = n / f;
      return {
        q: `一個光學面在折射率 ${n} 的介質中，焦距為 ${f} m。它的屈光力是多少？`,
        parts: [{ label: "屈光力", type: "num", ans: D, unit: "D", dp: 2, tol: Math.max(0.03, 0.01 * D) }],
        steps: [{ c: "D ＝ n / f，焦距一定要換成公尺。", e: `D = ${n} / ${f} = ${F.s(D)} D` }],
      };
    } },
    { id: "2-2", title: "近視的遠點", gen(r) {
      const P = -r.step(0.5, 10, 0.25), fp = -100 / P;
      return {
        q: `一位近視者的屈光不正為 ${F.D(P)}（以角膜面計）。不戴眼鏡時，他能看清楚的最遠距離是幾公分？`,
        parts: [{ label: "遠點距離", type: "num", ans: fp, unit: "cm", dp: 1, tol: Math.max(0.3, 0.01 * fp) }],
        steps: [
          { c: "遠點距離（m）＝ 1 ÷ |屈光度|。", e: `1 / ${F.u(P)} = ${(fp / 100).toFixed(3)} m` },
          { c: "換成公分。", e: `${fp.toFixed(1)} cm（在眼前）` },
        ],
      };
    } },
    { id: "2-3", title: "眼軸長與軸性近視", gen(r) {
      const dL = r.step(0.5, 4, 0.5), sign = r.sign();
      const P = -3 * dL * sign;
      return {
        q: `以「眼軸每長 1 mm 約 −3.00 D」估算：一個原本正視的眼睛，若眼軸${sign > 0 ? "增長" : "縮短"} ${dL.toFixed(1)} mm，屈光狀態大約變成多少？`,
        parts: [{ label: "屈光狀態", type: "num", ans: P, unit: "D", tol: 0.05 }, { label: "類型", type: "choice", opts: ["近視", "遠視"], ans: P < 0 ? 0 : 1 }],
        steps: [
          { c: "眼軸變長，視網膜往後移，平行光落在視網膜前，就是近視；變短則相反。" },
          { c: "每 mm 約 3 D。", e: `${sign > 0 ? "−" : "+"}3 × ${dL.toFixed(1)} = ${F.D(P)}` },
        ],
      };
    } },
    { id: "2-4", title: "正負散換算", gen(r) {
      const S = r.step(-6, 4, 0.25), C = r.sign() * r.step(0.5, 3, 0.25), A = r.pick(AXES);
      const tS = S + C, tC = -C, tA = norm(A + 90);
      return {
        q: `把處方 <b>${F.s(S)} ${F.s(C)} ×${ax(A)}</b> 換成另一種柱面寫法。`,
        parts: [{ label: "球面", type: "num", ans: tS, unit: "D", tol: 0.01 }, { label: "柱面", type: "num", ans: tC, unit: "D", tol: 0.01 }, { label: "軸度", type: "num", ans: tA, dp: 0, tol: 0.1 }],
        steps: [
          { c: "步驟一：新球面＝球面＋柱面。", e: `${F.s(S)} + ${F.s(C)} = ${F.s(tS)}` },
          { c: "步驟二：柱面變號。", e: `${F.s(C)} → ${F.s(tC)}` },
          { c: "步驟三：軸度加 90，超過 180 就減 180。", e: `${A} + 90 = ${A + 90}${A + 90 > 180 ? ` → ${tA}` : ""}` },
          { c: "驗算：兩種寫法的等價球面相同。", e: `SE = ${F.s(S + C / 2, 3)}` },
        ],
      };
    } },
    { id: "2-5", title: "等價球面", gen(r) {
      const S = r.step(-6, 4, 0.25), C = -r.step(0.5, 4, 0.25), A = r.pick(AXES);
      const se = S + C / 2;
      return {
        q: `處方 ${F.s(S)} ${F.s(C)} ×${ax(A)} 的等價球面（SE）是多少？若要開成純球面，四捨五入到最接近的 0.25 D 是多少？`,
        parts: [{ label: "SE", type: "num", ans: se, unit: "D", dp: 3, tol: 0.006 }, { label: "四捨五入後", type: "num", ans: Math.round(se * 4 + (se < 0 ? -1e-9 : 1e-9)) / 4, unit: "D", tol: 0.13 }],
        steps: [
          { c: "SE ＝ 球面 ＋ 柱面 ÷ 2。", e: `${F.s(S)} + ${F.s(C)} / 2 = ${F.s(se, 3)}` },
          { c: "SE 讓最小模糊圈落在視網膜上；剛好落在 0.125 的中間值時，兩個答案都可接受，臨床上近視通常取較低度數。" },
        ],
      };
    } },
    { id: "2-6", title: "判斷散光類型", gen(r) {
      const kind = r.int(0, 4), C = -r.step(0.5, 3, 0.25);
      let S;
      if (kind === 0) S = 0; // SMA
      else if (kind === 1) S = -C; // SHA：S＋C＝0
      else if (kind === 2) S = -r.step(0.25, 4, 0.25); // CMA
      else if (kind === 3) S = -C + r.step(0.25, 3, 0.25); // CHA
      else S = r.step(0.25, Math.max(0.25, -C - 0.25), 0.25); // MA
      if (kind === 4 && S >= -C) S = -C - 0.25;
      const A = r.pick(AXES);
      const useP = r.rand() < 0.4;
      const shown = useP ? `${F.s(S + C)} ${F.s(-C)} ×${ax(A + 90)}` : `${F.s(S)} ${F.s(C)} ×${ax(A)}`;
      const m1 = S, m2 = S + C;
      const a = A % 180, rule = (a <= 30 || a >= 150) ? 0 : (a >= 60 && a <= 120) ? 1 : 2;
      const T = ["單純近視散光 SMA", "單純遠視散光 SHA", "複合近視散光 CMA", "複合遠視散光 CHA", "混合散光 MA"];
      return {
        q: `處方 <b>${shown}</b>：(a) 屬於哪一種散光？(b) 依軸度分類？`,
        parts: [{ label: "(a) 類型", type: "choice", opts: T, ans: kind }, { label: "(b) 軸度", type: "choice", opts: ["順散 WTR", "逆散 ATR", "斜散 OBL"], ans: rule }],
        steps: [
          ...(useP ? [{ c: "先換成負散寫法比較好判斷。", e: `${F.s(S)} ${F.s(C)} ×${ax(A)}` }] : []),
          { c: "兩條主徑線的處方屈光力分別是 sph 與 sph＋cyl。", e: `${F.s(m1)} 與 ${F.s(m2)}` },
          { c: "一條為 0 是單純型；同號是複合型；異號是混合型。", e: T[kind] },
          { c: "負柱軸在 180±30 為順散、090±30 為逆散，其餘為斜散。", e: `軸 ${ax(A)} → ${["順散", "逆散", "斜散"][rule]}` },
        ],
      };
    } },
  ]);
})();
