/* 第 6 章 練習題（原創，數字隨機） */
(function () {
  const { define } = (typeof window !== "undefined" ? window : globalThis).OBPractice;

  define("ch06", [
    { id: "6-1", title: "Worth 四點判讀", gen(r) {
      const red = r.pick(["右", "左"]), grn = red === "右" ? "左" : "右";
      const cases = [
        ["4 個點：上面 1 紅、左右 2 綠，下面那點紅綠交替", 0, "兩眼的影像都有，而且合成一個，是正常融像。"],
        ["2 個紅點", red === "右" ? 2 : 1, `只有戴紅鏡的${red}眼在看，${grn}眼被抑制。`],
        ["3 個綠點", red === "右" ? 1 : 2, `只有戴綠鏡的${grn}眼在看，${red}眼被抑制。`],
        [`5 個點，紅點在${red}邊`, 3, "紅點與紅鏡同側，是非交叉複視，對應內斜。"],
        [`5 個點，紅點在${grn}邊`, 4, "紅點在紅鏡的對側，是交叉複視，對應外斜。"],
      ];
      const [s, a, why] = r.pick(cases);
      return {
        q: `病人${red}眼戴紅鏡、${grn}眼戴綠鏡，看 Worth 四點燈箱時說：「${s}」。判斷是？`,
        parts: [{ label: "判斷", type: "choice", opts: ["正常融像", "左眼抑制", "右眼抑制", "非交叉複視（內斜）", "交叉複視（外斜）"], ans: a }],
        steps: [{ c: "紅鏡那眼只看得到紅點與白點（變紅），綠鏡那眼只看得到綠點與白點（變綠）。" }, { c: why }],
      };
    } },
    { id: "6-2", title: "雙眼視差", gen(r) {
      const pd = r.pick([58, 60, 62, 64, 66]), d = r.pick([33, 40, 50, 100]), dd = r.pick([0.5, 1, 2, 5]);
      const eta = (pd / 1000) * (dd / 100) / Math.pow(d / 100, 2), sec = eta * 206265;
      return {
        q: `PD ${pd} mm，注視 ${d} cm 處的目標，另一個物體在它前方 ${dd} cm。雙眼視差約幾弧秒？`,
        parts: [{ label: "視差", type: "num", ans: sec, unit: "″", dp: 0, tol: Math.max(2, sec * 0.03) }],
        steps: [
          { c: "η（rad）≈ PD × Δd ÷ d²，全部換成公尺。", e: `${pd / 1000} × ${dd / 100} / ${(d / 100)}² = ${eta.toExponential(3)} rad` },
          { c: "1 rad ＝ 206265″。", e: `${eta.toExponential(3)} × 206265 = ${sec.toFixed(0)}″` },
          { c: "近距離立體視常模約 40″ 以內，可以比較看看這個差距是否看得出深度。" },
        ],
      };
    } },
    { id: "6-3", title: "內聚需求", gen(r) {
      const pd = r.pick([56, 58, 60, 62, 64, 66, 68]), d = r.pick([25, 33, 40, 50, 100]);
      const dem = (pd / 10) / (d / 100);
      return {
        q: `PD ${pd} mm 的病人注視 ${d} cm 處的目標，需要多少稜鏡度的內聚？`,
        parts: [{ label: "內聚", type: "num", ans: dem, unit: "Δ", dp: 1, tol: 0.3 }],
        steps: [{ c: "內聚（Δ）＝ PD（cm）÷ 距離（m）。", e: `${(pd / 10).toFixed(1)} / ${d / 100} = ${dem.toFixed(1)}Δ` }],
      };
    } },
    { id: "6-4", title: "NPC 判讀", gen(r) {
      const b = r.pick([3, 4, 5, 6, 8, 10, 12]), rec = b + r.pick([1, 2, 3, 4]);
      const bad = b > 5 || rec > 7;
      return {
        q: `NPC 測得破裂點 ${b} cm、恢復點 ${rec} cm。判讀是？`,
        parts: [{ label: "判讀", type: "choice", opts: ["正常", "超出常模，提示內聚不足"], ans: bad ? 1 : 0 }],
        steps: [{ c: "常用標準：破裂 ≤ 5 cm、恢復 ≤ 7 cm。", e: `破裂 ${b} cm ${b > 5 ? "超出" : "正常"}；恢復 ${rec} cm ${rec > 7 ? "超出" : "正常"}` }, { c: bad ? "建議加測近距離眼位、BO 儲存力，並評估是否符合內聚不足。" : "仍要搭配症狀與其他雙眼視檢查判讀。" }],
      };
    } },
  ]);
})();
