/* 第 8 章 練習題（原創，隨機出題） */
(function () {
  const { define } = (typeof window !== "undefined" ? window : globalThis).OBPractice;
  const M = ["內直肌", "外直肌", "上直肌", "下直肌", "上斜肌", "下斜肌"];
  const ACT = [["內轉", "—", "—"], ["外轉", "—", "—"], ["上轉", "內旋", "內轉"], ["下轉", "外旋", "內轉"], ["內旋", "下轉", "外轉"], ["外旋", "上轉", "外轉"]];
  const NERVE = [0, 2, 0, 0, 1, 0];
  const GAZE = ["右上", "右", "右下", "左上", "左", "左下"];
  // 每個斜方向：右眼肌肉索引、左眼肌肉索引
  const YOKE = { 右上: [2, 5], 右: [1, 0], 右下: [3, 4], 左上: [5, 2], 左: [0, 1], 左下: [4, 3] };

  define("ch08", [
    { id: "8-1", title: "肌肉的作用與神經", gen(r) {
      const i = r.int(0, 5), ask = r.int(0, 1);
      if (ask === 0) {
        return {
          q: `${M[i]}的<b>主要作用</b>是？`,
          parts: [{ label: "主要作用", type: "choice", opts: ["內轉", "外轉", "上轉", "下轉", "內旋", "外旋"], ans: ["內轉", "外轉", "上轉", "下轉", "內旋", "外旋"].indexOf(ACT[i][0]) }],
          steps: [{ c: `${M[i]}：主要 ${ACT[i][0]}${ACT[i][1] !== "—" ? `，次要 ${ACT[i][1]}，第三 ${ACT[i][2]}` : "，沒有其他作用"}。` }, { c: "斜肌的名稱與作用方向相反：上斜肌往下、下斜肌往上，主要作用都是旋轉。" }],
        };
      }
      return {
        q: `${M[i]}由哪一對腦神經支配？`,
        parts: [{ label: "神經", type: "choice", opts: ["動眼神經（III）", "滑車神經（IV）", "外旋神經（VI）"], ans: NERVE[i] }],
        steps: [{ c: "口訣 LR6 SO4 R3：外直肌 VI、上斜肌 IV，其餘 III。" }],
      };
    } },
    { id: "8-2", title: "配偶肌", gen(r) {
      const g = r.pick(GAZE), [ri, li] = YOKE[g], eye = r.int(0, 1);
      const ans = eye === 0 ? ri : li;
      return {
        q: `病人往<b>${g}</b>看，${eye === 0 ? "右眼" : "左眼"}主要靠哪一條肌肉？`,
        parts: [{ label: "肌肉", type: "choice", opts: M, ans }],
        steps: [
          { c: `往${g}看時，右眼${g[0] === "右" ? "外轉" : "內轉"}、左眼${g[0] === "右" ? "內轉" : "外轉"}。` },
          { c: g.length === 1 ? "水平方向只靠內外直肌。" : "外轉時的上下由直肌負責，內轉時的上下由斜肌負責。", e: `右眼 ${M[ri]}、左眼 ${M[li]}（配偶肌）` },
        ],
      };
    } },
    { id: "8-3", title: "檢查哪一條肌肉要看哪裡", gen(r) {
      const eye = r.pick(["右", "左"]), i = r.int(0, 5);
      let ans;
      for (const g of GAZE) { const [ri, li] = YOKE[g]; if ((eye === "右" ? ri : li) === i) ans = GAZE.indexOf(g); }
      return {
        q: `要單獨檢查<b>${eye}${M[i]}</b>的功能，應請病人看向哪個方向？`,
        parts: [{ label: "方向", type: "choice", opts: GAZE, ans }],
        steps: [{ c: "找出這條肌肉作用最單純的眼位：直肌在外轉時、斜肌在內轉時。" }, { c: `${eye}${M[i]} → 病人看 ${GAZE[ans]}` }],
      };
    } },
    { id: "8-4", title: "肌肉作用的分解", gen(r) {
      const rect = r.int(0, 1) === 0, th = r.pick([-40, -30, -20, -10, 0, 10, 20]);
      const plane = rect ? 23 : 51, alpha = rect ? plane - th : plane + th;
      const v = Math.cos(alpha * Math.PI / 180) * 100;
      const mus = rect ? "上直肌" : "上斜肌", act = rect ? "上轉" : "下轉";
      const pos = th === 0 ? "正前方" : th > 0 ? `外轉 ${th}°` : `內轉 ${-th}°`;
      return {
        q: `以簡化模型（直肌平面 23°、斜肌 51°）估算：右眼${pos}時，${mus}的拉力有百分之幾用在${act}？`,
        parts: [{ label: `${act}比例`, type: "num", ans: v, unit: "%", dp: 0, tol: 1.5 }],
        steps: [
          { c: rect ? "直肌：α ＝ 23° − 外轉角。" : "斜肌：α ＝ 51° − 內轉角。", e: `α = ${plane} − (${rect ? th : -th}) = ${alpha}°` },
          { c: "上下作用 ＝ cos α。", e: `cos ${alpha}° = ${(v / 100).toFixed(3)} → ${v.toFixed(0)}%` },
        ],
      };
    } },
  ]);
})();
