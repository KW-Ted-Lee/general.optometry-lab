/* 第 1 章 練習題（原創，數字隨機） */
(function () {
  const { define, F } = (typeof window !== "undefined" ? window : globalThis).OBPractice;
  const ARC = Math.PI / 180 / 60;
  const DEC = [0.1, 0.125, 0.2, 0.25, 0.3, 0.4, 0.5, 0.6, 0.8, 1.0, 1.25, 1.5, 2.0];

  define("ch01", [
    { id: "1-1", title: "小數視力換成 MAR 與 LogMAR", gen(r) {
      const v = r.pick(DEC), mar = 1 / v, lm = Math.log10(mar);
      return {
        q: `病人的小數視力為 ${v}。求 (a) MAR（弧分）、(b) LogMAR、(c) 英尺制 Snellen 分母（20/?）。`,
        parts: [{ label: "(a) MAR", type: "num", ans: mar, unit: "′" }, { label: "(b) LogMAR", type: "num", ans: lm, tol: 0.011 }, { label: "(c) 20/", type: "num", ans: 20 * mar, dp: 0, tol: 0.6 }],
        steps: [
          { c: "MAR 是小數視力的倒數。", e: `MAR = 1 / ${v} = ${mar.toFixed(2)}′` },
          { c: "LogMAR 是 MAR 取以 10 為底的對數。", e: `LogMAR = log(${mar.toFixed(2)}) = ${F.n(lm, 2)}` },
          { c: "Snellen 分母 = 20 × MAR。", e: `20 × ${mar.toFixed(2)} = ${(20 * mar).toFixed(0)} → 20/${(20 * mar).toFixed(0)}` },
        ],
      };
    } },
    { id: "1-2", title: "視標高度", gen(r) {
      const d = r.pick([2, 3, 4, 5, 6]), v = r.pick([0.1, 0.2, 0.5, 1.0]);
      const theta = 5 / v, h = 2 * d * Math.tan(theta * ARC / 2) * 1000;
      return {
        q: `設計在 ${d} m 使用的視力表，小數視力 ${v} 那一行的視標（整個字）應該多高？`,
        parts: [{ label: "高度", type: "num", ans: h, unit: "mm" }],
        steps: [
          { c: `${v} 的視標整體視角 = 5′ ÷ ${v} = ${theta}′。`, e: `${theta}′ = ${theta} / 60 = ${(theta / 60).toFixed(4)}°` },
          { c: "h = 2d · tan(θ/2)（也可以用 d · tan θ 近似）。", e: `h = 2 × ${d} × tan(${(theta / 120).toFixed(4)}°) = ${(h / 1000).toFixed(5)} m = ${h.toFixed(2)} mm` },
          { c: "記憶法：6 m 的 1.0 是 8.73 mm，高度和距離、MAR 都成正比。" },
        ],
      };
    } },
    { id: "1-3", title: "近用視力 M-unit", gen(r) {
      const m = r.pick([0.25, 0.33, 0.4, 0.5, 1.0]), M = r.pick([0.5, 0.8, 1.0, 1.6, 2.0, 2.5, 4.0, 8.0]);
      const va = m / M;
      return {
        q: `病人在 ${m * 100} cm 處剛好讀出 ${M.toFixed(1)} M 的字。求 (a) 小數視力、(b) 相當的英尺制 Snellen 分母（20/?）。`,
        parts: [{ label: "(a) 小數視力", type: "num", ans: va, dp: 3 }, { label: "(b) 20/", type: "num", ans: 20 / va, dp: 0, tol: Math.max(1, 0.015 * 20 / va) }],
        steps: [
          { c: "小 m 除大 M。", e: `VA = ${m} / ${M.toFixed(1)} = ${va.toFixed(3)}` },
          { c: "Snellen 分母 = 20 ÷ 小數視力。", e: `20 / ${va.toFixed(3)} = ${(20 / va).toFixed(0)}` },
        ],
      };
    } },
    { id: "1-4", title: "兩行之間的 LogMAR 差", gen(r) {
      let a = r.pick(DEC), b = r.pick(DEC); while (b === a) b = r.pick(DEC);
      const la = Math.log10(1 / a), lb = Math.log10(1 / b), diff = Math.abs(la - lb);
      return {
        q: `小數視力 ${a} 與 ${b} 之間相差多少 LogMAR？若用 ETDRS 表（每行 0.1、每字 0.02），大約相差幾行？`,
        parts: [{ label: "LogMAR 差", type: "num", ans: diff, tol: 0.011 }, { label: "約幾行", type: "num", ans: Math.round(diff * 10), dp: 0, tol: 0.5 }],
        steps: [
          { c: "分別取 LogMAR。", e: `LogMAR(${a}) = ${F.n(la, 3)}；LogMAR(${b}) = ${F.n(lb, 3)}` },
          { c: "相減取絕對值。", e: `|${F.n(la, 3)} − ${F.n(lb, 3)}| = ${diff.toFixed(3)}` },
          { c: "每行 0.1。", e: `${diff.toFixed(3)} / 0.1 ≈ ${Math.round(diff * 10)} 行` },
        ],
      };
    } },
    { id: "1-5", title: "走近才看得到最大視標", gen(r) {
      const x = r.pick([1, 1.5, 2, 2.5, 3, 4, 5]), base = r.pick([0.1, 0.2]);
      const va = (x / 6) * base;
      return {
        q: `病人在 6 m 看不到 ${base} 的視標，請他走近，到 ${x} m 時剛好辨認出 ${base} 的視標。視力值是多少？`,
        parts: [{ label: "視力", type: "num", ans: va, dp: 3 }],
        steps: [
          { c: "非標準距離：VA = 實際距離 ÷ 設計距離 × 該行的值。", e: `VA = ${x} / 6 × ${base} = ${va.toFixed(3)}` },
          { c: "紀錄時要寫明是走近後的結果，例如註明測試距離。" },
        ],
      };
    } },
    { id: "1-6", title: "換個距離看同一個字", gen(r) {
      const v = r.pick([0.2, 0.25, 0.4, 0.5, 1.0]), d = r.pick([2, 3, 4, 5]);
      const ang = (5 / v) * 6 / d;
      return {
        q: `6 m 標準視力表上標示 ${v} 的完整視標，若在 ${d} m 處觀看，所占的視角是幾分？`,
        parts: [{ label: "視角", type: "num", ans: ang, unit: "′" }],
        steps: [
          { c: "在 6 m 時，這個字所占的視角是 5′ ÷ VA。", e: `5 / ${v} = ${(5 / v).toFixed(2)}′` },
          { c: "字的大小不變，距離變近，視角與距離成反比。", e: `${(5 / v).toFixed(2)} × 6 / ${d} = ${ang.toFixed(2)}′` },
        ],
      };
    } },
  ]);
})();
