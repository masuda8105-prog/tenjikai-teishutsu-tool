const presets = {
  wof: { label: "WOF 東京 2コマ", eventName: "WOF 東京 2コマ", width: 5940, depth: 2500, wallHeight: 2400, wallSide: "top", aisleSide: "bottom" },
  imf: { label: "IMF 大阪秋 2コマ", eventName: "IMF 大阪秋 2コマ", width: 9000, depth: 4500, wallHeight: 2100, wallSide: "top", aisleSide: "bottom" },
  egf: { label: "EGF 大阪春 2コマ", eventName: "EGF 大阪春 2コマ", width: 6000, depth: 3600, wallHeight: 2100, wallSide: "top", aisleSide: "bottom" },
  jex: { label: "JEX 東京 2小間", eventName: "JEX 東京 2小間", width: 8000, depth: 2000, wallHeight: 2100, wallSide: "top", aisleSide: "bottom" },
  wide: { label: "横長 2小間", eventName: "横長 2小間", width: 6000, depth: 3000, wallHeight: 2400, wallSide: "top", aisleSide: "bottom" },
  deep: { label: "奥行き広め", eventName: "奥行き広め", width: 3000, depth: 4500, wallHeight: 2400, wallSide: "top", aisleSide: "bottom" },
  custom: { label: "自由入力", eventName: "自由入力", width: 3000, depth: 3000, wallHeight: 2400, wallSide: "top", aisleSide: "bottom" }
};

const OUTLET_WATT = 100;
const jexRuleNote = "JEX 3階レンタル装飾 2小間: W8000 x D2000、壁面パネルH2100。含まれるもの: テーブルW1500 x D600を2台、社名板W1800 x H300を2枚、アームスポットライト8灯、100V2口コンセント。装飾物・展示品は高さ2.7m以下、通路・小間外へのはみ出し不可。";
const imfRuleNote = "IMF 2コマ: W9000 x D4500 x H2100。サンニシムラ1.5コマ（W6750）、鈴木眼鏡様0.5コマ（W2250）の共同出店。電気使用は1.5kWまで事務局負担、1.5kW超の電気使用料および小間内配線工事・コンセント等は出展社負担。装飾物の高さは2.1m以下、装飾は小間内、通路側への突出は禁止。";
const egfRuleNote = "EGF 2コマ: Aタイプ1コマ W3000 x D3600 x H2100を2コマ運用として W6000 x D3600 x H2100。サンニシムラ1.5コマ、鈴木眼鏡様0.5コマの共同出店。電気使用は1.5kW 100Vまでは事務局負担、1.5kW超の電気使用料およびコンセント等の小間内配線工事は出展社負担。";
const wofRuleNote = "WOF 2小間 ブースプランA: 間口W5940 x 奥行D2500 x 高さH2400。標準装備: 背面W5940 x H2400オクタパネル、袖面W990 x H2400オクタパネル1枚、W990 x H1200オクタパネル1枚、展示台W1500 x D600 x H700を4台、イス4脚、サインパネルW1500 x H300を1枚。";

const itemTypes = [
  { type: "table", label: "長机", width: 1800, depth: 600, color: "#f2b84b" },
  { type: "table", label: "受付机", width: 1200, depth: 600, color: "#f2b84b" },
  { type: "table", label: "展示台 W1500xD600", width: 1500, depth: 600, height: 700, color: "#f2b84b" },
  { type: "table", label: "展示台 W1500xD900", width: 1500, depth: 900, height: 700, color: "#f2b84b" },
  { type: "table", label: "展示台 W1800xD600", width: 1800, depth: 600, height: 700, color: "#f2b84b" },
  { type: "table", label: "展示台 W1800xD900", width: 1800, depth: 900, height: 700, color: "#f2b84b" },
  { type: "fixture", label: "展示台", width: 900, depth: 450, height: 900, color: "#77a7d9" },
  { type: "fixture", label: "什器棚", width: 900, depth: 350, height: 1400, color: "#77a7d9" },
  { type: "fixture", label: "姿見", width: 450, depth: 300, height: 1700, color: "#77a7d9" },
  { type: "bolda", label: "bolda ED04 耳・鼻 装着感向上", width: 900, depth: 600, height: 1100, color: "#5fb7b2", image: "assets/bolda/ED04.png", boldaCode: "ED04", printTheme: "耳・鼻 装着感向上 / Custom Fit", frontTexture: "assets/bolda/textures/ed04-custom-base.png", tierTextures: ["assets/bolda/textures/ed04-custom-tier1.png", "assets/bolda/textures/ed04-custom-tier2.png"], referenceImages: ["assets/bolda/print-references/sample_ED04_A_ptn1.png", "assets/bolda/print-references/sample_ED04_B_ptn1.png"] },
  { type: "bolda", label: "bolda ED04 ネジ抜き・手磨き", width: 900, depth: 600, height: 1100, color: "#5fb7b2", image: "assets/bolda/ED04.png", boldaCode: "ED04", printTheme: "ネジ抜き・手磨き / Screw Extraction & Hand Polishing", frontTexture: "assets/bolda/textures/ed04-screw-base.png", tierTextures: ["assets/bolda/textures/ed04-screw-tier1.png", "assets/bolda/textures/ed04-screw-tier2.png"], referenceImages: ["assets/bolda/print-references/sample_ED04_A_ptn2.png", "assets/bolda/print-references/sample_ED04_B_ptn2.png"] },
  { type: "bolda", label: "bolda ED04 試験枠・測定", width: 900, depth: 600, height: 1100, color: "#5fb7b2", image: "assets/bolda/ED04.png", boldaCode: "ED04", printTheme: "試験枠・測定 / Trial Frames & Measurement", frontTexture: "assets/bolda/textures/ed04-trial-base.png", tierTextures: ["assets/bolda/textures/ed04-trial-tier1.png", "assets/bolda/textures/ed04-trial-tier2.png"], referenceImages: ["assets/bolda/print-references/sample_ED04_A_ptn3.png", "assets/bolda/print-references/sample_ED04_B_ptn3.png"] },
  { type: "bolda", label: "bolda TB05 + AS01 Recommended Items", width: 900, depth: 600, height: 1100, color: "#5fb7b2", image: "assets/bolda/TB05.png", boldaCode: "TB05_AS01", printTheme: "Recommended Items", frontTexture: "assets/bolda/textures/tb05-screwdrivers.png", riserTexture: "assets/bolda/textures/as01-recommended.png", referenceImages: ["assets/bolda/print-references/sample_TB05_ptn3.png", "assets/bolda/print-references/sample_AS01_ptn1.png"], composite: true },
  { type: "bolda", label: "bolda TB05 + AS01 NEW Products", width: 900, depth: 600, height: 1100, color: "#5fb7b2", image: "assets/bolda/TB05.png", boldaCode: "TB05_AS01", printTheme: "NEW Products", frontTexture: "assets/bolda/textures/tb05-heater.png", riserTexture: "assets/bolda/textures/as01-new-products.png", referenceImages: ["assets/bolda/print-references/sample_TB05_ptn2.png", "assets/bolda/print-references/sample_AS01_ptn2.png"], composite: true },
  { type: "bolda", label: "bolda AS01 Recommended Items", width: 900, depth: 250, height: 300, color: "#5fb7b2", image: "assets/bolda/AS01.png", boldaCode: "AS01", printTheme: "Recommended Items", frontTexture: "assets/bolda/textures/as01-recommended.png", referenceImages: ["assets/bolda/print-references/sample_AS01_ptn1.png"] },
  { type: "bolda", label: "bolda AS01 NEW Products", width: 900, depth: 250, height: 300, color: "#5fb7b2", image: "assets/bolda/AS01.png", boldaCode: "AS01", printTheme: "NEW Products", frontTexture: "assets/bolda/textures/as01-new-products.png", referenceImages: ["assets/bolda/print-references/sample_AS01_ptn2.png"] },
  { type: "bolda", label: "bolda SF03", width: 350, depth: 400, height: 1490, color: "#5fb7b2", image: "assets/bolda/SF03.png" },
  { type: "bolda", label: "bolda TB05 工具", width: 900, depth: 600, height: 800, color: "#5fb7b2", image: "assets/bolda/TB05.png", boldaCode: "TB05", printTheme: "工具", frontTexture: "assets/bolda/textures/tb05-tools.png", referenceImages: ["assets/bolda/print-references/sample_TB05_ptn1.png"] },
  { type: "bolda", label: "bolda TB05 ヒーター", width: 900, depth: 600, height: 800, color: "#5fb7b2", image: "assets/bolda/TB05.png", boldaCode: "TB05", printTheme: "電子ヒーター", frontTexture: "assets/bolda/textures/tb05-heater.png", referenceImages: ["assets/bolda/print-references/sample_TB05_ptn2.png"] },
  { type: "bolda", label: "bolda TB05 ドライバー", width: 900, depth: 600, height: 800, color: "#5fb7b2", image: "assets/bolda/TB05.png", boldaCode: "TB05", printTheme: "ドライバー", frontTexture: "assets/bolda/textures/tb05-screwdrivers.png", referenceImages: ["assets/bolda/print-references/sample_TB05_ptn3.png"] },
  { type: "bolda", label: "bolda TB13 ヒーター展示", width: 900, depth: 500, height: 800, color: "#5fb7b2", image: "assets/bolda/TB13.png", boldaCode: "TB13", printTheme: "電子ヒーター", frontTexture: "assets/bolda/textures/tb13-heater.png", referenceImages: ["assets/bolda/print-references/sample_TB13.png"] },
  { type: "bolda", label: "bolda VB01_600CB", width: 600, depth: 600, height: 600, color: "#5fb7b2", image: "assets/bolda/VB01_600CB.png" },
  { type: "wall", label: "サイン", width: 1200, depth: 80, height: 300, color: "#7bcb9d" },
  { type: "power", label: "コンセント", width: 300, depth: 300, color: "#d85a5a", watt: OUTLET_WATT },
  { type: "spotlight", label: "スポットライト", width: 350, depth: 350, color: "#ffd45f", watt: 100 },
  { type: "chair", label: "椅子", width: 450, depth: 450, color: "#9b8ad6" },
  { type: "person", label: "人物A 179cm", width: 600, depth: 600, height: 1790, color: "#ef6fa8", image: "assets/people/person-a-standing-crop.png", standingImage: "assets/people/person-a-standing-crop.png", seatedImage: "assets/people/person-a-seated-crop.png" },
  { type: "person", label: "人物B 179cm", width: 600, depth: 600, height: 1790, color: "#3b69d8", image: "assets/people/person-b-standing-crop.png", standingImage: "assets/people/person-b-standing-crop.png", seatedImage: "assets/people/person-b-seated-crop.png" }
];

const boldaDetails = {
  AS01: {
    code: "AS01",
    visual: "a low, long, shallow white rectangular plinth or bench display; plain solid front, flat top, very low height, clean paper-board seams",
    printData: "共通アイテム/【bolda】/to/bolda_Sannishimura_260323/AS01"
  },
  ED04: {
    code: "ED04",
    visual: "a white stepped display counter; solid box base with a flat front work surface and two raised rectangular rear tiers like stairs for product display",
    printData: "共通アイテム/【bolda】/to/bolda_Sannishimura_260323/ED04"
  },
  SF03: {
    code: "SF03",
    visual: "a tall, narrow, slightly leaning white shelf stand; vertical back panel with four projecting horizontal shelves; slim side profile; made of white board",
    printData: "共通アイテム/【bolda】/to/bolda_Sannishimura_260309/SF03"
  },
  TB05: {
    code: "TB05",
    visual: "a plain white rectangular block counter or pedestal; flat top, solid smooth front and side panels, clean minimal cube-like form",
    printData: "共通アイテム/【bolda】/to/bolda_Sannishimura_260323/TB05"
  },
  TB13: {
    code: "TB13",
    visual: "a tall white counter cabinet; flat top; upper front has two open rectangular cubby shelves separated by a center divider; lower half is a solid smooth front panel",
    printData: "共通アイテム/【bolda】/to/bolda_Sannishimura_260323/TB13"
  },
  TB05_AS01: {
    code: "TB05 + AS01",
    visual: "a printed W900 x D600 x H800 bolda TB05 counter with one W900 x D250 x H300 AS01 yokan-bar riser placed directly on the rear of its top surface; the two pieces touch with no floating gap",
    printData: "共通アイテム/【bolda】/to/bolda_Sannishimura_260323/TB05 + AS01"
  },
  VB01_600CB: {
    code: "VB01_600CB",
    visual: "a compact white cube pedestal; 600mm cube proportions; flat top, solid smooth panels on all visible sides, clean paper-board seams",
    printData: "共通アイテム/【bolda】/to/bolda_Sannishimura_260310/VB01_600CB"
  }
};

const furnitureReferenceImage = "assets/furniture/exhibition-furniture-reference.png";

const realBoothReferenceImages = [
  {
    path: "assets/booth-references/imf-2021-hall-wide.jpg",
    label: "IMF 2021 実ブース全景",
    role: "会場照明、天井、通路、床、白い間仕切りの雰囲気だけを参照"
  },
  {
    path: "assets/booth-references/wof-2024-display-detail.jpg",
    label: "WOF 2024 展示面参考",
    role: "白パネル、アルミ枠、机上面、掲示物の素材感だけを参照"
  },
  {
    path: "assets/booth-references/wof-2024-furniture-detail.jpg",
    label: "WOF 2024 什器・椅子参考",
    role: "椅子、床、壁、什器の実寸感だけを参照"
  }
];

const realBoothReferenceNotes = [
  "Use the real-booth photographs only for exhibition-hall lighting, ceiling scale, aisle openness, floor and partition materials, aluminium framing, contact shadows and realistic fixture finish.",
  "Do not copy or infer any merchandise, eyewear, tools, trays, bottles, signs, people, furniture count or previous layout from a reference photograph.",
  "Render only the booth shell and objects explicitly listed in the placed-object specification. An unlisted object must not appear, even if it is visible in a reference photograph.",
  "Apply print artwork only when that exact print-face asset belongs to a placed fixture. Never invent substitute graphics or merchandise."
];

const realBoothReferencePolicyJa = [
  "実ブース写真は、照明・天井・通路・床・白パネル・アルミ枠・影・素材感だけに使用します。",
  "写真に写るメガネ、工具、商品、トレー、ボトル、人物、旧什器、以前の配置は3Dへ自動追加しません。",
  "3Dに表示するのはブース外形と、現在の配置図に置かれた項目だけです。",
  "印刷面は、配置した什器に紐づく実データがある場合だけ表示します。"
];

const state = {
  preset: "wof",
  eventName: "",
  boothNo: "",
  companyName: "株式会社サンニシムラ",
  contactName: "",
  notes: "",
  jointSide: "right",
  booth: { width: 3000, depth: 3000, wallHeight: 2400, wallSide: "top", aisleSide: "bottom" },
  items: [],
  selectedId: null,
  view: "layout"
};

const canvas = document.getElementById("layoutCanvas");
const ctx = canvas.getContext("2d");
const PRINT_LAYOUT_SCALE = 4;
const preview3dCanvas = document.getElementById("preview3dCanvas");
const preview3dCtx = null;
const previewAssetCache = {};
let drag = null;
let scale = 1;
let origin = { x: 0, y: 0 };
let printRenderMode = false;
let threePreview = null;
let threeDrag = null;
let threeAssetPromises = [];
let threeExpectedAssetCount = 0;
let threeLoadedAssetCount = 0;
let threeFailedAssetCount = 0;
let threeSceneVersion = 0;

const $ = (id) => document.getElementById(id);

function init() {
  Object.entries(presets).forEach(([key, preset]) => {
    const option = document.createElement("option");
    option.value = key;
    option.textContent = preset.label;
    $("presetSelect").append(option);
  });

  itemTypes.forEach((item) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "palette-item";
    const detail = item.type === "spotlight" ? `${item.watt}W` : item.type === "power" ? "" : itemSizeLabel(item);
    button.innerHTML = `${paletteVisual(item)}<span>${item.label}</span>${detail ? `<small>${detail}</small>` : ""}`;
    button.addEventListener("click", () => addItem(item));
    $("itemPalette").append(button);
  });

  bindInputs();
  if (!loadAutosave()) {
    applyPreset("wof");
  }
  render();
}

function paletteVisual(item) {
  if (item.image) {
    const swatch = item.frontTexture
      ? `<img class="palette-print-swatch" src="${escapeHtml(item.frontTexture)}" alt="${escapeHtml(item.printTheme || item.label)} 実印刷面">`
      : "";
    return `<span class="palette-image-stack"><img class="palette-thumb palette-thumb-photo" src="${escapeHtml(item.image)}" alt="${escapeHtml(item.label)} 組み立て済み画像">${swatch}</span>`;
  }
  const svg = buildPaletteSvg(item);
  return `<img class="palette-thumb" src="data:image/svg+xml,${encodeURIComponent(svg)}" alt="${escapeHtml(item.label)}">`;
}

function buildPaletteSvg(item) {
  if (item.type === "spotlight" || item.type === "power") return buildUtilityPaletteSvg(item);
  if (item.type === "wall") return buildSignPaletteSvg(item);
  if (item.type === "chair") return buildChairPaletteSvg(item);
  if (item.type === "table" || item.type === "fixture") return buildFurniturePaletteSvg(item);
  return buildGenericPaletteSvg(item);
}

function buildUtilityPaletteSvg(item) {
  const color = item.color || "#d8e0e2";
  const shape = item.type === "spotlight"
    ? `<line x1="60" y1="14" x2="60" y2="29" stroke="#6d5200" stroke-width="4" stroke-linecap="round"/><polygon points="42,31 78,31 60,66" fill="${color}" stroke="#6d5200" stroke-width="3"/><path d="M44 75 Q60 88 76 75" fill="none" stroke="#d9a600" stroke-width="3"/><text x="60" y="98" text-anchor="middle" font-size="13" font-weight="700" fill="#172225">${item.watt || 0}W</text>`
    : `<rect x="34" y="22" width="52" height="52" rx="9" fill="#fff" stroke="${color}" stroke-width="5"/><circle cx="51" cy="48" r="4" fill="${color}"/><circle cx="69" cy="48" r="4" fill="${color}"/><line x1="60" y1="30" x2="60" y2="66" stroke="#d9e1e3" stroke-width="2"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="112" viewBox="0 0 120 112" role="img" aria-label="${escapeHtml(item.label)}">${shape}</svg>`;
}
function buildSignPaletteSvg(item) {
  const color = item.color || "#7bcb9d";
  const signW = Math.max(56, Math.min(92, item.width / 1500 * 82));
  const signH = Math.max(14, Math.min(30, (item.height || 300) / 600 * 28));
  const x = 60 - signW / 2;
  const y = 38 - signH / 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="112" viewBox="0 0 120 112" role="img" aria-label="${escapeHtml(item.label)}">
    <rect x="18" y="16" width="84" height="58" rx="4" fill="#f8faf9" stroke="#d9e1e3"/>
    <rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${signW.toFixed(1)}" height="${signH.toFixed(1)}" rx="2" fill="#fff" stroke="${color}" stroke-width="3"/>
    <line x1="${x.toFixed(1)}" y1="${(y + signH + 8).toFixed(1)}" x2="${(x + signW).toFixed(1)}" y2="${(y + signH + 8).toFixed(1)}" stroke="#9aa6a9" stroke-width="2"/>
    <text x="60" y="91" text-anchor="middle" font-size="10" font-weight="700" fill="#172225">サイン</text>
    <text x="60" y="110" text-anchor="middle" font-size="10" fill="#172225">W${item.width} H${item.height || 300}</text>
  </svg>`;
}

function buildChairPaletteSvg(item) {
  const color = item.color || "#9b8ad6";
  return `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="112" viewBox="0 0 120 112" role="img" aria-label="${escapeHtml(item.label)}">
    <rect x="10" y="10" width="100" height="86" rx="5" fill="#f8faf9"/>
    <rect x="42" y="23" width="36" height="24" rx="5" fill="${shade(color, 1.1)}" stroke="#5c5577" stroke-width="2"/>
    <polygon points="38,52 82,52 75,72 45,72" fill="${color}" stroke="#5c5577" stroke-width="2"/>
    <line x1="47" y1="71" x2="41" y2="91" stroke="#5c5577" stroke-width="3" stroke-linecap="round"/>
    <line x1="73" y1="71" x2="79" y2="91" stroke="#5c5577" stroke-width="3" stroke-linecap="round"/>
    <text x="60" y="105" text-anchor="middle" font-size="11" font-weight="700" fill="#172225">椅子</text>
  </svg>`;
}

function buildGenericPaletteSvg(item) {
  const color = item.color || "#d8e0e2";
  return `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="112" viewBox="0 0 120 112" role="img" aria-label="${escapeHtml(item.label)}">
    <rect x="18" y="28" width="84" height="44" rx="6" fill="${shade(color, 1.08)}" stroke="#7b8588" stroke-width="2"/>
    <text x="60" y="92" text-anchor="middle" font-size="11" font-weight="700" fill="#172225">${escapeHtml(typeLabel(item.type))}</text>
  </svg>`;
}


function isDisplayCounterItem(item) {
  const label = String(item.label || "");
  return label.includes("展示台") || label.includes("カウンター") || item.type === "fixture";
}
function buildFurniturePaletteSvg(item) {
  const color = item.color || "#d8e0e2";
  const maxWidth = 1800;
  const maxDepth = 900;
  const maxHeight = 1500;
  const w = Math.max(38, Math.min(92, item.width / maxWidth * 92));
  const d = Math.max(20, Math.min(46, item.depth / maxDepth * 46));
  const h = Math.max(14, Math.min(40, (item.height || defaultItemHeight(item)) / maxHeight * 40));
  const x = 60 - w / 2;
  const y = 22 + (46 - d) / 2;
  const topBack = y;
  const topFront = y + d * 0.58;
  const top = [
    [x + d * 0.44, topBack],
    [x + w, topBack + d * 0.22],
    [x + w - d * 0.44, topFront],
    [x, topFront - d * 0.22]
  ];
  const bottom = top.map(([px, py]) => [px, py + h]);
  const points = (pts) => pts.map(([px, py]) => `${px.toFixed(1)},${py.toFixed(1)}`).join(" ");
  const isCounter = isDisplayCounterItem(item);
  const body = isCounter
    ? buildDisplayCounterPaletteSvg(top, bottom, points, color)
    : buildTableLegPaletteSvg(top, bottom, points, color);
  const sizeText = `W${item.width} D${item.depth}`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="112" viewBox="0 0 120 112" role="img" aria-label="${escapeHtml(item.label)}">
    <rect x="10" y="10" width="100" height="86" rx="5" fill="#f8faf9"/>
    ${body}
    <line x1="14" y1="101" x2="106" y2="101" stroke="#adb8bb" stroke-width="2"/>
    <text x="60" y="91" text-anchor="middle" font-size="10" font-weight="700" fill="#172225">${escapeHtml(isCounter ? "展示台" : "机")}</text>
    <text x="60" y="110" text-anchor="middle" font-size="10" fill="#172225">${escapeHtml(sizeText)}</text>
  </svg>`;
}

function buildDisplayCounterPaletteSvg(top, bottom, points, color) {
  const frontTop = [top[3], top[2], bottom[2], bottom[3]];
  return `<polygon points="${points([top[0], top[1], bottom[1], bottom[0]])}" fill="#e7eceb" stroke="#7b8588" stroke-width="1.5"/>
    <polygon points="${points([top[1], top[2], bottom[2], bottom[1]])}" fill="#f6f8f7" stroke="#7b8588" stroke-width="1.5"/>
    <polygon points="${points(frontTop)}" fill="#ffffff" stroke="#7b8588" stroke-width="1.5"/>
    <polygon points="${points(top)}" fill="#ffffff" stroke="#7b8588" stroke-width="1.8"/>
    <line x1="${top[3][0].toFixed(1)}" y1="${(top[3][1] + 5).toFixed(1)}" x2="${top[2][0].toFixed(1)}" y2="${(top[2][1] + 5).toFixed(1)}" stroke="#c7d1d2" stroke-width="2"/>
    <line x1="${bottom[3][0].toFixed(1)}" y1="${bottom[3][1].toFixed(1)}" x2="${bottom[2][0].toFixed(1)}" y2="${bottom[2][1].toFixed(1)}" stroke="rgba(0,0,0,.2)" stroke-width="1.5"/>`;
}
function buildTableLegPaletteSvg(top, bottom, points, color) {
  const legBottomOffset = 23;
  const legWidth = 3.5;
  const legPoints = [
    [top[0][0] + 5, top[0][1] + 7],
    [top[1][0] - 7, top[1][1] + 7],
    [top[2][0] - 5, top[2][1] + 3],
    [top[3][0] + 7, top[3][1] + 3]
  ];
  const legs = legPoints.map(([lx, ly], index) => {
    const lean = index < 2 ? -2 : 2;
    return `<line x1="${lx.toFixed(1)}" y1="${ly.toFixed(1)}" x2="${(lx + lean).toFixed(1)}" y2="${(ly + legBottomOffset).toFixed(1)}" stroke="#646f72" stroke-width="${legWidth}" stroke-linecap="round"/>`;
  }).join("\n");
  return `${legs}
    <polygon points="${points(top)}" fill="${shade(color, 1.12)}" stroke="#7b8588" stroke-width="1.8"/>
    <polygon points="${points([top[3], top[2], [top[2][0], top[2][1] + 4], [top[3][0], top[3][1] + 4]])}" fill="${shade(color, 0.78)}" stroke="#7b8588" stroke-width="1.2"/>
    <line x1="${bottom[0][0].toFixed(1)}" y1="${(top[0][1] + 4).toFixed(1)}" x2="${bottom[1][0].toFixed(1)}" y2="${(top[1][1] + 4).toFixed(1)}" stroke="rgba(0,0,0,.16)" stroke-width="1"/>`;
}

function bindInputs() {
  $("presetSelect").addEventListener("change", (event) => applyPreset(event.target.value));
  ["eventName", "boothNo", "companyName", "contactName", "notes"].forEach((id) => {
    $(id).addEventListener("input", () => {
      state[id] = $(id).value;
      render();
    });
  });

  [["boothWidth", "width"], ["boothDepth", "depth"], ["wallHeight", "wallHeight"]].forEach(([id, key]) => {
    $(id).addEventListener("input", () => {
      state.preset = "custom";
      $("presetSelect").value = "custom";
      state.booth[key] = Number($(id).value);
      clampItems();
      render();
    });
  });

  ["wallSide", "aisleSide"].forEach((id) => {
    $(id).addEventListener("input", () => {
      state.booth[id] = $(id).value;
      keepWallAndAisleDifferent(id);
      syncBoothInputs();
      render();
    });
  });

  $("jointSide").addEventListener("change", () => {
    state.jointSide = $("jointSide").value;
    if (isImfEgfPreset()) {
      applyImfEgfLayout();
    } else {
      render();
    }
  });

  ["itemLabel", "itemWidth", "itemDepth", "itemHeight", "itemX", "itemY", "itemWatt"].forEach((id) => {
    $(id).addEventListener("input", updateSelectedFromForm);
  });
  $("rotateBtn").addEventListener("click", rotateSelected);
  $("deleteBtn").addEventListener("click", deleteSelected);
  $("bringForwardBtn").addEventListener("click", () => moveSelectedLayer(1));
  $("sendBackwardBtn").addEventListener("click", () => moveSelectedLayer(-1));
  $("bringToFrontBtn").addEventListener("click", () => moveSelectedLayer("front"));
  $("sendToBackBtn").addEventListener("click", () => moveSelectedLayer("back"));
  $("clearBtn").addEventListener("click", resetLayout);
  $("standardLayoutBtn").addEventListener("click", applyStandardLayout);
  $("printBtn").addEventListener("click", printHighQualityPdf);
  $("generate3dBtn").addEventListener("click", generate3dPreview);
  $("backToLayoutBtn").addEventListener("click", () => setView("layout"));
  $("reset3dViewBtn").addEventListener("click", resetThreeCamera);
  document.querySelectorAll("[data-three-camera]").forEach((button) => {
    button.addEventListener("click", () => setThreeCameraPreset(button.dataset.threeCamera));
  });
  $("editSelected3dBtn").addEventListener("click", () => setView("layout"));
  $("rotateSelected3dBtn").addEventListener("click", rotateSelected);
  $("deleteSelected3dBtn").addEventListener("click", deleteSelected);
  $("copyPromptBtn").addEventListener("click", copyImagePrompt);
  $("downloadLayoutPngBtn").addEventListener("click", downloadLayoutPng);
  $("download3dPngBtn").addEventListener("click", download3dPng);
  $("downloadPromptTxtBtn").addEventListener("click", downloadPromptTxt);
  $("downloadSpecJsonBtn").addEventListener("click", downloadSpecJson);
  $("downloadCodexPackBtn").addEventListener("click", downloadCodexPack);
  $("saveProjectBtn").addEventListener("click", saveProject);
  $("loadProjectBtn").addEventListener("click", () => $("projectFile").click());
  $("projectFile").addEventListener("change", loadProject);

  document.querySelectorAll(".view-btn").forEach((button) => {
    button.addEventListener("click", () => setView(button.dataset.view));
  });

  canvas.addEventListener("pointerdown", onPointerDown);
  canvas.addEventListener("pointermove", onPointerMove);
  canvas.addEventListener("pointerup", endDrag);
  canvas.addEventListener("pointercancel", endDrag);
  bindThreePreviewControls();
  document.addEventListener("keydown", onKeyDown);
}

function createHighResolutionLayoutDataUrl() {
  const originalWidth = canvas.width;
  const originalHeight = canvas.height;
  canvas.width = 4960;
  canvas.height = 3508;
  printRenderMode = true;
  drawCanvas();
  const dataUrl = canvas.toDataURL("image/png");
  printRenderMode = false;
  canvas.width = originalWidth;
  canvas.height = originalHeight;
  drawCanvas();
  return dataUrl;
}

function preparePrintLayoutImage() {
  const printImage = $("printLayoutImage");
  if (!printImage) return;
  printImage.src = createHighResolutionLayoutDataUrl();
}

function printHighQualityPdf() {
  setView("layout");
  preparePrintLayoutImage();
  window.print();
}

window.addEventListener("beforeprint", preparePrintLayoutImage);
function setView(view) {
  state.view = ["layout", "list", "preview3d"].includes(view) ? view : "layout";
  render();
}

function applyPreset(key) {
  const preset = presets[key];
  state.preset = key;
  state.eventName = preset.eventName;
  state.booth = {
    width: preset.width,
    depth: preset.depth,
    wallHeight: preset.wallHeight,
    wallSide: preset.wallSide,
    aisleSide: preset.aisleSide
  };
  $("presetSelect").value = key;
  $("eventName").value = state.eventName;
  syncBoothInputs();
  if (key === "jex") {
    state.notes = jexRuleNote;
    $("notes").value = state.notes;
    applyJexTwoBoothLayout(false);
  } else if (key === "imf" || key === "egf") {
    state.notes = key === "imf" ? imfRuleNote : egfRuleNote;
    $("notes").value = state.notes;
    state.jointSide = $("jointSide").value || "right";
    applyImfEgfLayout(false);
  } else if (key === "wof") {
    state.notes = wofRuleNote;
    $("notes").value = state.notes;
    applyWofTwoBoothLayout(false);
  } else {
    clampItems();
  }
  syncJointControls();
  render();
}

function syncBoothInputs() {
  $("boothWidth").value = state.booth.width;
  $("boothDepth").value = state.booth.depth;
  $("wallHeight").value = state.booth.wallHeight;
  $("wallSide").value = state.booth.wallSide || "top";
  $("aisleSide").value = state.booth.aisleSide;
  syncJointControls();
}

function keepWallAndAisleDifferent(changedKey) {
  if (state.booth.wallSide !== state.booth.aisleSide) return;
  const opposite = oppositeSide(state.booth[changedKey]);
  if (changedKey === "wallSide") {
    state.booth.aisleSide = opposite;
  } else {
    state.booth.wallSide = opposite;
  }
}

function syncTextInputs() {
  ["eventName", "boothNo", "companyName", "contactName", "notes"].forEach((id) => {
    $(id).value = state[id] || "";
  });
}

function syncJointControls() {
  $("jointSideField").classList.toggle("hidden", !isImfEgfPreset());
  $("jointSide").value = state.jointSide || "right";
}

function isImfEgfPreset() {
  return state.preset === "imf" || state.preset === "egf";
}

function addItem(template) {
  const item = {
    id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random()),
    type: template.type,
    label: template.label,
    width: template.width,
    depth: template.depth,
    height: template.height || 0,
    image: template.image || "",
    boldaCode: template.boldaCode || "",
    printTheme: template.printTheme || "",
    frontTexture: template.frontTexture || "",
    riserTexture: template.riserTexture || "",
    tierTextures: [...(template.tierTextures || [])],
    referenceImages: [...(template.referenceImages || [])],
    composite: Boolean(template.composite),
    standingImage: template.standingImage || "",
    seatedImage: template.seatedImage || "",
    color: template.color,
    watt: template.watt || 0,
    x: Math.max(0, Math.round((state.booth.width - template.width) / 2 / 50) * 50),
    y: Math.max(0, Math.round((state.booth.depth - template.depth) / 2 / 50) * 50)
  };
  state.items.push(item);
  state.selectedId = item.id;
  render();
}

function applyStandardLayout() {
  if (state.preset === "jex") {
    applyJexTwoBoothLayout(true);
    return;
  }
  if (state.preset === "wof") {
    const wofOk = state.booth.width === 5940 && state.booth.depth === 2500 && state.booth.wallHeight === 2400;
    checks.unshift({
      name: "WOF 2コマルール",
      level: wofOk ? "ok" : "warn",
      message: wofOk
        ? "WOF 2小間 ブースプランAの正式寸法 W5940 x D2500 x H2400 です。展示台4台、イス4脚、サインパネル1枚が標準です。"
        : "WOF 2コマの標準寸法から変更されています。必要に応じて標準レイアウトを置き直してください。"
    });
  }
  if (isImfEgfPreset()) {
    applyImfEgfLayout(true);
    return;
  }
  if (state.preset === "wof") {
    applyWofTwoBoothLayout(true);
    return;
  }
  const w = state.booth.width;
  const d = state.booth.depth;
  state.items = [
    makeItem("table", "受付机", 1200, 600, "#f2b84b", 150, d - 850),
    makeItem("fixture", "展示台", 900, 450, "#77a7d9", Math.max(150, w - 1050), 250),
    makeItem("fixture", "什器棚", 900, 350, "#77a7d9", 150, 250),
    makeItem("wall", "壁面サイン", Math.min(1600, w - 400), 80, "#7bcb9d", 200, 0, 0, 300),
    makeItem("spotlight", "スポットライト", 350, 350, "#ffd45f", Math.max(100, w / 2 - 175), 150, 100),
    makeItem("power", "コンセント", 300, 300, "#d85a5a", Math.max(100, w - 450), Math.max(100, d - 500), OUTLET_WATT)
  ];
  state.items.forEach(clampItem);
  state.selectedId = state.items[0].id;
  render();
}

function applyWofTwoBoothLayout(renderNow = true) {
  const w = state.booth.width;
  const d = state.booth.depth;
  state.items = [
    makeItem("wall", "サインパネル W1500xH300", 1500, 80, "#7bcb9d", Math.max(200, w / 2 - 750), 0, 0, 300),
    makeItem("table", "展示台 1 W1500xD600xH700", 1500, 600, "#f2b84b", 0, d - 650),
    makeItem("table", "展示台 2 W1500xD600xH700", 1500, 600, "#f2b84b", 1480, d - 650),
    makeItem("table", "展示台 3 W1500xD600xH700", 1500, 600, "#f2b84b", 2960, d - 650),
    makeItem("table", "展示台 4 W1500xD600xH700", 1500, 600, "#f2b84b", 4440, d - 650),
    makeItem("chair", "イス 1", 450, 450, "#9b8ad6", 550, d - 1200),
    makeItem("chair", "イス 2", 450, 450, "#9b8ad6", 2000, d - 1200),
    makeItem("chair", "イス 3", 450, 450, "#9b8ad6", 3450, d - 1200),
    makeItem("chair", "イス 4", 450, 450, "#9b8ad6", 4900, d - 1200),
    makeItem("spotlight", "アームスポット 1", 350, 350, "#ffd45f", 750, 120, 100),
    makeItem("spotlight", "アームスポット 2", 350, 350, "#ffd45f", 2200, 120, 100),
    makeItem("spotlight", "アームスポット 3", 350, 350, "#ffd45f", 3650, 120, 100),
    makeItem("spotlight", "アームスポット 4", 350, 350, "#ffd45f", 5100, 120, 100),
    makeItem("power", "2口コンセント 左", 300, 300, "#d85a5a", 160, d - 1150, OUTLET_WATT),
    makeItem("power", "2口コンセント 右", 300, 300, "#d85a5a", Math.max(160, w - 460), d - 1150, OUTLET_WATT)
  ];
  state.items.forEach(clampItem);
  state.selectedId = state.items[0]?.id || null;
  if (renderNow) render();
}

function applyImfEgfLayout(renderNow = true) {
  const w = state.booth.width;
  const d = state.booth.depth;
  const suzukiWidth = w * 0.25;
  const sannishiStart = state.jointSide === "left" ? suzukiWidth : 0;
  const suzukiStart = state.jointSide === "left" ? 0 : w - suzukiWidth;
  state.items = [
    makeItem("wall", "サンニシムラ社名板", 400, 80, "#7bcb9d", sannishiStart + 250, 0, 0, 300),
    makeItem("wall", "鈴木眼鏡様 社名板", 400, 80, "#7bcb9d", suzukiStart + Math.max(120, suzukiWidth / 2 - 200), 0, 0, 300),
    makeItem("table", "サンニシムラ展示台", 1800, 450, "#f2b84b", sannishiStart + 350, d - 700),
    makeItem("table", "サンニシムラ商談机", 1200, 900, "#f2b84b", sannishiStart + 2350, d - 1200),
    makeItem("fixture", "鈴木眼鏡様 展示台", Math.min(900, suzukiWidth - 250), 450, "#77a7d9", suzukiStart + 150, d - 700)
  ];
  state.items.forEach(clampItem);
  state.selectedId = state.items[0]?.id || null;
  if (renderNow) render();
}

function applyJexTwoBoothLayout(renderNow = true) {
  const w = state.booth.width;
  const d = state.booth.depth;
  const spotlightY = 80;
  const spacing = w / 8;
  state.items = [
    makeItem("wall", "社名板 左 W1800xH300", 1800, 80, "#7bcb9d", 300, 0, 0, 300),
    makeItem("wall", "社名板 右 W1800xH300", 1800, 80, "#7bcb9d", w - 2100, 0, 0, 300),
    makeItem("table", "JEX付属テーブル 左 W1500xD600", 1500, 600, "#f2b84b", 2100, d - 850),
    makeItem("table", "JEX付属テーブル 右 W1500xD600", 1500, 600, "#f2b84b", 4400, d - 850),
    makeItem("power", "100V2口コンセント", 300, 300, "#d85a5a", 350, d - 420, OUTLET_WATT)
  ];

  for (let i = 0; i < 8; i += 1) {
    state.items.push(makeItem("spotlight", `アームスポットライト ${i + 1}`, 280, 280, "#ffd45f", Math.round((spacing * i + spacing / 2 - 140) / 50) * 50, spotlightY, 100));
  }

  state.items.forEach(clampItem);
  state.selectedId = state.items[0]?.id || null;
  if (renderNow) render();
}

function makeItem(type, label, width, depth, color, x, y, watt = 0, height = 0, image = "") {
  return {
    id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random()),
    type,
    label,
    width,
    depth,
    height,
    color,
    watt,
    image,
    x,
    y,
    rotationQuarterTurns: 0
  };
}

function selectedItem() {
  return state.items.find((item) => item.id === state.selectedId) || null;
}

function updateSelectedFromForm() {
  const item = selectedItem();
  if (!item) return;
  item.label = $("itemLabel").value;
  item.width = Math.max(50, Number($("itemWidth").value) || 50);
  item.depth = Math.max(50, Number($("itemDepth").value) || 50);
  item.height = Math.max(20, Number($("itemHeight").value) || defaultItemHeight(item));
  item.x = Number($("itemX").value) || 0;
  item.y = Number($("itemY").value) || 0;
  if (item.type === "spotlight") {
    item.watt = Math.max(0, Number($("itemWatt").value) || 0);
  }
  clampItem(item);
  render();
}

function rotateSelected() {
  const item = selectedItem();
  if (!item) return;
  [item.width, item.depth] = [item.depth, item.width];
  item.rotationQuarterTurns = (itemRotationQuarterTurns(item) + 1) % 4;
  clampItem(item);
  render();
}

function moveSelectedLayer(direction) {
  const index = state.items.findIndex((item) => item.id === state.selectedId);
  if (index < 0) return;
  const [item] = state.items.splice(index, 1);
  let nextIndex = index;
  if (direction === "front") {
    nextIndex = state.items.length;
  } else if (direction === "back") {
    nextIndex = 0;
  } else {
    nextIndex = Math.max(0, Math.min(state.items.length, index + direction));
  }
  state.items.splice(nextIndex, 0, item);
  render();
}

function deleteSelected() {
  if (!state.selectedId) return;
  state.items = state.items.filter((item) => item.id !== state.selectedId);
  state.selectedId = null;
  render();
}

function onKeyDown(event) {
  const editingText = ["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement.tagName);
  if (editingText || !state.selectedId) return;
  if (event.key === "Delete" || event.key === "Backspace") {
    event.preventDefault();
    deleteSelected();
  }
}

function resetLayout() {
  if (!confirm("配置した備品をすべて削除しますか？")) return;
  state.items = [];
  state.selectedId = null;
  render();
}

function clampItems() {
  normalizeItems();
  state.items.forEach(clampItem);
}

function normalizeItems() {
  state.items.forEach((item) => {
    hydrateLegacyItem(item);
    item.rotationQuarterTurns = itemRotationQuarterTurns(item);
    if (item.type === "power") {
      item.watt = OUTLET_WATT;
      item.width = item.width || 300;
      item.depth = item.depth || 300;
    }
    if (item.type === "spotlight") {
      item.watt = Number(item.watt) || 100;
      item.width = item.width || 350;
      item.depth = item.depth || 350;
      item.height = item.height || 180;
    }
    if (item.type === "wall") {
      const inferredHeight = inferWallPanelHeight(item);
      item.height = !item.height || item.height >= 1000 ? inferredHeight : item.height;
    }
    if (state.preset === "jex" && item.type === "table" && String(item.label || "").includes("JEX付属テーブル")) {
      item.width = 1500;
      item.depth = 600;
      item.height = 0;
      item.label = item.label.includes("左") ? "JEX付属テーブル 左 W1500xD600" : "JEX付属テーブル 右 W1500xD600";
    }
  });
}

function hydrateLegacyItem(item) {
  if (item.type === "person") {
    const personTemplates = itemTypes.filter((entry) => entry.type === "person");
    const personTemplate = personTemplates.find((entry) => String(item.label || "").startsWith(entry.label.split(" ")[0]))
      || personTemplates.find((entry) => item.color && entry.color === item.color)
      || personTemplates[0];
    if (personTemplate) {
      item.height = item.height || personTemplate.height;
      item.standingImage = item.standingImage || personTemplate.standingImage;
      item.seatedImage = item.seatedImage || personTemplate.seatedImage;
      item.image = item.image || personTemplate.image;
    }
    return;
  }
  if (item.type !== "bolda" || item.frontTexture) return;

  const legacyLabel = String(item.label || "").toUpperCase().replace("ED-4", "ED04");
  let template = null;
  if (legacyLabel.includes("ED04")) {
    template = itemTypes.find((entry) => entry.label === "bolda ED04 試験枠・測定");
  } else if (legacyLabel.includes("TB13")) {
    template = itemTypes.find((entry) => entry.label === "bolda TB13 ヒーター展示");
  } else if (legacyLabel.includes("TB05")) {
    template = itemTypes.find((entry) => entry.label === "bolda TB05 工具");
  } else if (legacyLabel.includes("AS01")) {
    template = itemTypes.find((entry) => entry.label === "bolda AS01 Recommended Items");
  }
  if (!template) return;

  ["boldaCode", "printTheme", "frontTexture", "riserTexture", "composite", "image"].forEach((key) => {
    if (template[key] !== undefined && item[key] === undefined) item[key] = template[key];
  });
  if (!item.tierTextures && template.tierTextures) item.tierTextures = [...template.tierTextures];
  if (!item.referenceImages && template.referenceImages) item.referenceImages = [...template.referenceImages];
}

function inferWallPanelHeight(item) {
  const match = String(item.label || "").match(/H(\d+)/i);
  return match ? Number(match[1]) : 300;
}

function clampItem(item) {
  item.width = Math.min(item.width, state.booth.width);
  item.depth = Math.min(item.depth, state.booth.depth);
  item.x = Math.min(Math.max(0, item.x), state.booth.width - item.width);
  item.y = Math.min(Math.max(0, item.y), state.booth.depth - item.depth);
}

function render() {
  normalizeItems();
  syncHeader();
  syncSelectionEditor();
  syncView();
  drawCanvas();
  renderTable();
  renderAgents();
  autosave();
}

function syncHeader() {
  $("sheetTitle").textContent = state.eventName ? `${state.eventName} 展示ブース配置図` : "展示ブース配置図";
  $("metaBoothNo").textContent = state.boothNo || "-";
  $("metaCompany").textContent = state.companyName || "-";
  $("metaDate").textContent = new Date().toLocaleDateString("ja-JP");
  $("boothSpec").textContent = `W${state.booth.width} x D${state.booth.depth} x 壁H${state.booth.wallHeight}mm / 壁側: ${sideLabel(state.booth.wallSide)} / 通路側: ${sideLabel(state.booth.aisleSide)}`;
  $("printNotes").textContent = state.notes || "-";
}

function syncSelectionEditor() {
  const item = selectedItem();
  $("emptySelection").classList.toggle("hidden", !!item);
  $("selectionEditor").classList.toggle("hidden", !item);
  syncBoldaPreview(item);
  if (!item) return;
  $("itemLabel").value = item.label;
  $("itemWidth").value = item.width;
  $("itemDepth").value = item.depth;
  $("itemHeight").value = Math.round(item.height || defaultItemHeight(item));
  $("itemX").value = Math.round(item.x);
  $("itemY").value = Math.round(item.y);
  $("wattField").classList.toggle("hidden", item.type !== "spotlight");
  $("itemWatt").value = item.watt || 0;
}

function syncBoldaPreview(item) {
  const show = item && item.type === "bolda" && item.image;
  $("boldaPreview").classList.toggle("hidden", !show);
  if (!show) return;
  $("boldaPreviewImage").src = item.image;
  const printImage = item.frontTexture || item.riserTexture || item.tierTextures?.[0] || "";
  $("boldaPrintPreview").classList.toggle("hidden", !printImage);
  if (printImage) $("boldaPrintPreviewImage").src = printImage;
  $("boldaPreviewCaption").textContent = `${item.label} / ${itemSizeLabel(item)}${item.printTheme ? ` / 印刷: ${item.printTheme}` : ""}`;
}

function syncView() {
  document.querySelectorAll(".view-btn").forEach((button) => {
    button.classList.toggle("active", button.dataset.view === state.view);
  });
  $("layoutView").classList.toggle("hidden", state.view !== "layout");
  $("listView").classList.toggle("hidden", state.view !== "list");
  $("preview3dView").classList.toggle("hidden", state.view !== "preview3d");
  if (state.view === "preview3d") {
    $("preview3dTitle").textContent = `${state.eventName || "展示ブース"} 3D配置確認`;
    $("preview3dSpec").textContent = `W${state.booth.width} x D${state.booth.depth} x H${state.booth.wallHeight}mm / 通路: ${sideLabel(state.booth.aisleSide)}`;
    draw3dScene();
    syncThreeSelectionUi();
    $("imagePrompt").value = buildImagePrompt();
    renderRealBoothReferences();
    renderFurnitureImageReferences();
    renderBoldaImageReferences();
  }
}

function drawCanvas() {
  const padding = printRenderMode ? 44 : 58;
  const usableW = canvas.width - padding * 2;
  const usableH = canvas.height - padding * 2;
  scale = Math.min(usableW / state.booth.width, usableH / state.booth.depth);
  const boothPxW = state.booth.width * scale;
  const boothPxH = state.booth.depth * scale;
  origin = { x: (canvas.width - boothPxW) / 2, y: (canvas.height - boothPxH) / 2 };

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawGrid(boothPxW, boothPxH);
  drawBooth(boothPxW, boothPxH);
  drawJointSplit();
  state.items.forEach(drawItem);
  drawDimensions(boothPxW, boothPxH);
}

function drawGrid(boothPxW, boothPxH) {
  ctx.save();
  ctx.strokeStyle = "#eef2f3";
  ctx.lineWidth = 1;
  const step = 500 * scale;
  for (let x = origin.x; x <= origin.x + boothPxW + 0.5; x += step) {
    line(x, origin.y, x, origin.y + boothPxH);
  }
  for (let y = origin.y; y <= origin.y + boothPxH + 0.5; y += step) {
    line(origin.x, y, origin.x + boothPxW, y);
  }
  ctx.restore();
}

function drawBooth(boothPxW, boothPxH) {
  ctx.save();
  ctx.fillStyle = "#ffffff";
  ctx.strokeStyle = "#182629";
  ctx.lineWidth = 3;
  ctx.strokeRect(origin.x, origin.y, boothPxW, boothPxH);

  ["top", "bottom", "left", "right"].forEach((side) => {
    if (side === state.booth.aisleSide) return;
    ctx.strokeStyle = side === state.booth.wallSide ? "#23875b" : "#7bcb9d";
    ctx.lineWidth = side === state.booth.wallSide ? 10 : 5;
    drawSide(side, boothPxW, boothPxH);
  });

  ctx.fillStyle = "#334346";
  const boothLabelFont = printRenderMode ? 58 : 16;
  ctx.font = `${boothLabelFont}px sans-serif`;
  ctx.textAlign = "center";
  ctx.fillText(`壁側: ${sideLabel(state.booth.wallSide)} / 通路側: ${sideLabel(state.booth.aisleSide)}`, origin.x + boothPxW / 2, origin.y + boothPxH + (printRenderMode ? 88 : 36));
  ctx.restore();
}

function drawSide(side, boothPxW, boothPxH) {
  if (side === "top") line(origin.x, origin.y, origin.x + boothPxW, origin.y);
  if (side === "bottom") line(origin.x, origin.y + boothPxH, origin.x + boothPxW, origin.y + boothPxH);
  if (side === "left") line(origin.x, origin.y, origin.x, origin.y + boothPxH);
  if (side === "right") line(origin.x + boothPxW, origin.y, origin.x + boothPxW, origin.y + boothPxH);
}

function drawJointSplit() {
  if (!isImfEgfPreset()) return;
  const suzukiWidth = state.booth.width * 0.25;
  const splitXmm = state.jointSide === "left" ? suzukiWidth : state.booth.width - suzukiWidth;
  const suzukiXmm = state.jointSide === "left" ? 0 : splitXmm;
  const sannishiXmm = state.jointSide === "left" ? suzukiWidth : 0;
  const sannishiWidth = state.booth.width * 0.75;

  const splitX = origin.x + splitXmm * scale;
  const top = origin.y;
  const height = state.booth.depth * scale;
  const suzukiX = origin.x + suzukiXmm * scale;
  const suzukiW = suzukiWidth * scale;
  const sannishiX = origin.x + sannishiXmm * scale;
  const sannishiW = sannishiWidth * scale;

  ctx.save();
  ctx.fillStyle = "rgba(119, 167, 217, 0.12)";
  ctx.fillRect(sannishiX, top, sannishiW, height);
  ctx.fillStyle = "rgba(255, 212, 95, 0.18)";
  ctx.fillRect(suzukiX, top, suzukiW, height);

  ctx.setLineDash([10, 8]);
  ctx.strokeStyle = "#8a6500";
  ctx.lineWidth = 3;
  line(splitX, top, splitX, top + height);
  ctx.setLineDash([]);

  ctx.fillStyle = "#172225";
  ctx.font = `bold ${printRenderMode ? 64 : 16}px sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("サンニシムラ 1.5コマ", sannishiX + sannishiW / 2, top + height / 2);
  ctx.fillText("鈴木眼鏡様 0.5コマ", suzukiX + suzukiW / 2, top + height / 2);
  ctx.restore();
}

function drawItem(item) {
  if (item.type === "power") {
    drawPowerOutlet(item);
    return;
  }
  if (item.type === "spotlight") {
    drawSpotlight(item);
    return;
  }
  if (item.type === "person") {
    drawPersonMarker(item);
    return;
  }

  const x = origin.x + item.x * scale;
  const y = origin.y + item.y * scale;
  const w = item.width * scale;
  const h = item.depth * scale;
  const selected = item.id === state.selectedId;

  ctx.save();
  ctx.fillStyle = item.color;
  ctx.strokeStyle = selected ? "#111" : "rgba(0,0,0,0.45)";
  ctx.lineWidth = selected ? 3 : 1.5;
  ctx.fillRect(x, y, w, h);
  ctx.strokeRect(x, y, w, h);
  ctx.fillStyle = "#132124";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  drawItemText(item, x, y, w, h);
  ctx.restore();
}

function drawPersonMarker(item) {
  const x = origin.x + item.x * scale;
  const y = origin.y + item.y * scale;
  const w = item.width * scale;
  const h = item.depth * scale;
  const selected = item.id === state.selectedId;
  const seated = Boolean(getChairForPerson(item));
  const cx = x + w / 2;
  const cy = y + h / 2;
  const radius = Math.max(8, Math.min(w, h) * 0.42);

  ctx.save();
  ctx.fillStyle = seated ? "rgba(155, 138, 214, 0.24)" : `${item.color}33`;
  ctx.strokeStyle = selected ? "#111" : item.color;
  ctx.lineWidth = selected ? 3 : 2;
  ctx.setLineDash(seated ? [] : [6, 4]);
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillStyle = item.color;
  ctx.beginPath();
  ctx.arc(cx, cy - radius * 0.28, radius * 0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(cx, cy + radius * 0.18, radius * 0.38, Math.PI, 0);
  ctx.lineTo(cx + radius * 0.38, cy + radius * 0.4);
  ctx.lineTo(cx - radius * 0.38, cy + radius * 0.4);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "#132124";
  ctx.font = `bold ${printRenderMode ? 42 : 10}px sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "bottom";
  ctx.fillText(seated ? "着座 179cm" : "立位 179cm", cx, y + h - Math.max(3, h * 0.05));
  ctx.restore();
}

function drawItemText(item, x, y, w, h) {
  const name = compactLabel(item.label) || typeLabel(item.type);
  const size = compactSizeLabel(item);
  const padX = Math.max(printRenderMode ? 18 : 4, Math.min(w * 0.08, printRenderMode ? 42 : 10));
  const padY = Math.max(printRenderMode ? 14 : 4, Math.min(h * 0.12, printRenderMode ? 34 : 8));
  const availableW = Math.max(8, w - padX * 2);
  const availableH = Math.max(8, h - padY * 2);
  const lines = availableH < (printRenderMode ? 92 : 24) ? [name] : [name, size];
  let fontSize = Math.min(printRenderMode ? 68 : 14, availableH / (lines.length * 1.25));
  const minFont = printRenderMode ? 22 : 6;

  while (fontSize > minFont) {
    const tooWide = lines.some((lineText, index) => {
      ctx.font = `${index === 0 ? "bold " : ""}${fontSize}px sans-serif`;
      return ctx.measureText(lineText).width > availableW;
    });
    if (!tooWide) break;
    fontSize -= printRenderMode ? 2 : 0.5;
  }

  ctx.save();
  ctx.beginPath();
  ctx.rect(x + padX / 2, y + padY / 2, Math.max(1, w - padX), Math.max(1, h - padY));
  ctx.clip();
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const lineGap = fontSize * 1.16;
  const startY = y + h / 2 - ((lines.length - 1) * lineGap) / 2;
  lines.forEach((lineText, index) => {
    ctx.font = `${index === 0 ? "bold " : ""}${fontSize}px sans-serif`;
    ctx.fillText(fitCanvasText(lineText, availableW), x + w / 2, startY + index * lineGap);
  });
  ctx.restore();
}

function compactSizeLabel(item) {
  const width = Math.round(item.width);
  const depth = Math.round(item.depth);
  const height = item.height ? `xH${Math.round(item.height)}` : "";
  return `W${width}xD${depth}${height}`;
}

function fitCanvasText(text, maxWidth) {
  if (ctx.measureText(text).width <= maxWidth) return text;
  let fitted = String(text);
  while (fitted.length > 1 && ctx.measureText(`${fitted}...`).width > maxWidth) {
    fitted = fitted.slice(0, -1);
  }
  return fitted.length > 1 ? `${fitted}...` : fitted;
}
function compactLabel(label) {
  return String(label)
    .replace(/\s*W\d+.*$/i, "")
    .replace(/\s*\d+\s*$/, "")
    .trim();
}

function drawPowerOutlet(item) {
  const x = origin.x + item.x * scale;
  const y = origin.y + item.y * scale;
  const w = item.width * scale;
  const h = item.depth * scale;
  const selected = item.id === state.selectedId;
  const cx = x + w / 2;
  const cy = y + h / 2;
  const radius = Math.min(w, h) * 0.32;

  ctx.save();
  ctx.fillStyle = "#fff7f7";
  ctx.strokeStyle = selected ? "#111" : "#9a2f2f";
  ctx.lineWidth = selected ? 3 : 2;
  ctx.fillRect(x, y, w, h);
  ctx.strokeRect(x, y, w, h);

  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.fillStyle = "#ffffff";
  ctx.fill();
  ctx.strokeStyle = "#b43434";
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = "#b43434";
  const slotW = Math.max(3, radius * 0.18);
  const slotH = Math.max(10, radius * 0.9);
  roundedRect(cx - radius * 0.36 - slotW / 2, cy - slotH / 2, slotW, slotH, 2);
  ctx.fill();
  roundedRect(cx + radius * 0.36 - slotW / 2, cy - slotH / 2, slotW, slotH, 2);
  ctx.fill();

  ctx.restore();
}

function drawSpotlight(item) {
  const x = origin.x + item.x * scale;
  const y = origin.y + item.y * scale;
  const w = item.width * scale;
  const h = item.depth * scale;
  const selected = item.id === state.selectedId;

  ctx.save();
  ctx.fillStyle = "#fff9db";
  ctx.strokeStyle = selected ? "#111" : "#9a7600";
  ctx.lineWidth = selected ? 3 : 2;
  ctx.fillRect(x, y, w, h);
  ctx.strokeRect(x, y, w, h);

  ctx.beginPath();
  ctx.moveTo(x + w * 0.18, y + h * 0.2);
  ctx.lineTo(x + w * 0.82, y + h * 0.2);
  ctx.lineTo(x + w * 0.5, y + h * 0.62);
  ctx.closePath();
  ctx.fillStyle = "#ffd45f";
  ctx.fill();
  ctx.strokeStyle = "#6d5200";
  ctx.lineWidth = 2.5;
  ctx.stroke();

  ctx.fillStyle = "#5f4800";
  ctx.font = `bold ${printRenderMode ? 50 : 13}px sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(`${item.watt || 0}W`, x + w / 2, y + h * 0.82);
  ctx.restore();
}

function roundedRect(x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
}

function drawDimensions(boothPxW, boothPxH) {
  ctx.save();
  ctx.fillStyle = "#182629";
  ctx.font = `${printRenderMode ? 56 : 14}px sans-serif`;
  ctx.textAlign = "center";
  ctx.fillText(`${state.booth.width}mm`, origin.x + boothPxW / 2, origin.y - (printRenderMode ? 38 : 18));
  ctx.save();
  ctx.translate(origin.x - (printRenderMode ? 70 : 28), origin.y + boothPxH / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.fillText(`${state.booth.depth}mm`, 0, 0);
  ctx.restore();
  ctx.restore();
}

function line(x1, y1, x2, y2) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

function canvasToMm(event) {
  const rect = canvas.getBoundingClientRect();
  const x = ((event.clientX - rect.left) / rect.width) * canvas.width;
  const y = ((event.clientY - rect.top) / rect.height) * canvas.height;
  return { x: (x - origin.x) / scale, y: (y - origin.y) / scale };
}

function onPointerDown(event) {
  const point = canvasToMm(event);
  const item = [...state.items].reverse().find((candidate) =>
    point.x >= candidate.x &&
    point.x <= candidate.x + candidate.width &&
    point.y >= candidate.y &&
    point.y <= candidate.y + candidate.depth
  );
  state.selectedId = item ? item.id : null;
  if (item) {
    drag = { id: item.id, dx: point.x - item.x, dy: point.y - item.y };
    canvas.setPointerCapture(event.pointerId);
  }
  render();
}

function onPointerMove(event) {
  if (!drag) return;
  const item = selectedItem();
  if (!item) return;
  const point = canvasToMm(event);
  item.x = Math.round((point.x - drag.dx) / 50) * 50;
  item.y = Math.round((point.y - drag.dy) / 50) * 50;
  clampItem(item);
  render();
}

function endDrag() {
  drag = null;
}

function renderTable() {
  const tbody = $("itemTable");
  tbody.innerHTML = "";
  if (state.items.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6">配置された備品はありません。</td></tr>';
    return;
  }
  state.items.forEach((item) => {
    const tr = document.createElement("tr");
    const watt = item.type === "spotlight" ? `${item.watt || 0}W` : "-";
    tr.innerHTML = `<td>${typeLabel(item.type)}</td><td>${escapeHtml(item.label)}</td><td>${itemSizeLabel(item)}</td><td>X${Math.round(item.x)} / Y${Math.round(item.y)}mm</td><td>${watt}</td><td>1</td>`;
    tbody.append(tr);
  });
}

function renderAgents() {
  const checks = getChecks();
  $("agentChecks").innerHTML = checks.map((check) => `
    <div class="agent-card ${check.level}">
      <strong>${check.name}</strong>
      <span>${check.message}</span>
    </div>
  `).join("");
}

function getChecks() {
  const required = [];
  if (!state.eventName) required.push("展示会名");
  if (!state.boothNo) required.push("小間番号");
  if (!state.contactName) required.push("担当者");
  const outlets = state.items.filter((item) => item.type === "power");
  const spotlights = state.items.filter((item) => item.type === "spotlight");
  const powers = outlets.length + spotlights.length;
  const totalSpotlightWatt = spotlights.reduce((sum, item) => sum + (Number(item.watt) || 0), 0);
  const overlaps = countOverlaps();
  const people = state.items.filter((item) => item.type === "person");
  const seatedPeople = people.filter((item) => getChairForPerson(item)).length;
  const personCollisions = countPersonCollisions();
  const tightClearances = countTightPersonClearances();
  const checks = [
    {
      name: "寸法エージェント",
      level: state.booth.width && state.booth.depth && state.booth.wallHeight ? "ok" : "bad",
      message: `ブース W${state.booth.width} x D${state.booth.depth}、壁H${state.booth.wallHeight}mm。必要に応じて自由入力へ変更できます。`
    },
    {
      name: "配置エージェント",
      level: overlaps ? "warn" : "ok",
      message: overlaps ? `${overlaps}か所で備品が重なっています。ドラッグして間隔を空けてください。` : "備品はブース内に収まっています。"
    },
    {
      name: "導線エージェント",
      level: personCollisions ? "warn" : people.length ? (tightClearances ? "warn" : "ok") : "warn",
      message: personCollisions
        ? `人物が什器と${personCollisions}か所で衝突しています。椅子との着座重なりは除外済みです。`
        : people.length
          ? `身長1790mmの人物を${people.length}人配置中（着座${seatedPeople}人）。${tightClearances ? `${tightClearances}人は周囲800mmの通過目安が狭めです。` : "各人物の周囲に800mmの通過目安があります。"}`
          : "人物を配置すると、身長比較・着座・周囲800mmの導線目安を確認できます。"
    },
    {
      name: "電源エージェント",
      level: powers ? "ok" : "warn",
      message: powers
        ? `コンセント${outlets.length}点、照明${spotlights.length}点を配置済みです。${spotlights.length ? `照明合計 ${totalSpotlightWatt}W。` : ""}`
        : "電源位置が未配置です。必要な場合はコンセントを追加してください。"
    },
    {
      name: "提出エージェント",
      level: required.length ? "warn" : "ok",
      message: required.length ? `未入力: ${required.join("、")}` : "提出情報の基本項目が入力されています。"
    }
  ];
  if (state.preset === "jex") {
    const spotlights = state.items.filter((item) => item.type === "spotlight").length;
    const outlets = state.items.filter((item) => item.type === "power").length;
    const tables = state.items.filter((item) => item.type === "table").length;
    const jexOk = state.booth.width === 8000 && state.booth.depth === 2000 && spotlights >= 8 && outlets >= 1 && tables >= 2;
    checks.unshift({
      name: "JEXルール",
      level: jexOk ? "ok" : "warn",
      message: jexOk
        ? "JEX 3階レンタル装飾 2小間の基本構成です。W8000 x D2000、スポット8灯、100V2口コンセント、付属テーブルW1500 x D600を2台。"
        : "JEX 2小間の基本構成から変更されています。必要に応じて標準レイアウトを置き直してください。"
    });
  }
  if (isImfEgfPreset()) {
    const preset = presets[state.preset];
    const presetOk = state.booth.width === preset.width && state.booth.depth === preset.depth && state.booth.wallHeight === preset.wallHeight;
    checks.unshift({
      name: `${state.preset === "imf" ? "IMF" : "EGF"}共同出店ルール`,
      level: presetOk ? "ok" : "warn",
      message: presetOk
        ? `${state.preset === "imf" ? "IMF Bタイプ" : "EGF Aタイプ2コマ運用"} W${preset.width} x D${preset.depth}。サンニシムラ1.5コマ、鈴木眼鏡様0.5コマは${state.jointSide === "left" ? "左側" : "右側"}。電気使用は1.5kWまで事務局負担、器具・配線は申込対象です。`
        : "IMF/EGF 2コマの基準寸法から変更されています。必要に応じて標準レイアウトを置き直してください。"
    });
  }
  return checks;
}

function countOverlaps() {
  let count = 0;
  for (let i = 0; i < state.items.length; i += 1) {
    for (let j = i + 1; j < state.items.length; j += 1) {
      if (isOverlap(state.items[i], state.items[j]) && !isAllowedOverlap(state.items[i], state.items[j])) count += 1;
    }
  }
  return count;
}

function isAllowedOverlap(a, b) {
  const person = a.type === "person" ? a : b.type === "person" ? b : null;
  const chair = a.type === "chair" ? a : b.type === "chair" ? b : null;
  return Boolean(person && chair && getChairForPerson(person)?.id === chair.id);
}

function getChairForPerson(person) {
  if (!person || person.type !== "person") return null;
  let best = null;
  let bestArea = 0;
  state.items.filter((item) => item.type === "chair").forEach((chair) => {
    const area = overlapArea(person, chair);
    const needed = Math.min(person.width * person.depth, chair.width * chair.depth) * 0.32;
    if (area >= needed && area > bestArea) {
      best = chair;
      bestArea = area;
    }
  });
  return best;
}

function overlapArea(a, b) {
  const width = Math.max(0, Math.min(a.x + a.width, b.x + b.width) - Math.max(a.x, b.x));
  const depth = Math.max(0, Math.min(a.y + a.depth, b.y + b.depth) - Math.max(a.y, b.y));
  return width * depth;
}

function countPersonCollisions() {
  let count = 0;
  state.items.filter((item) => item.type === "person").forEach((person) => {
    state.items.forEach((other) => {
      if (person.id === other.id || other.type === "person" || ["power", "spotlight", "wall"].includes(other.type)) return;
      if (isOverlap(person, other) && !isAllowedOverlap(person, other)) count += 1;
    });
  });
  return count;
}

function countTightPersonClearances() {
  return state.items.filter((item) => item.type === "person" && !getChairForPerson(item)).filter((person) => {
    const clearance = {
      x: person.x + person.width / 2 - 400,
      y: person.y + person.depth / 2 - 400,
      width: 800,
      depth: 800
    };
    return state.items.some((other) => {
      if (person.id === other.id || ["person", "power", "spotlight", "wall", "chair"].includes(other.type)) return false;
      return isOverlap(clearance, other);
    });
  }).length;
}

function isOverlap(a, b) {
  return a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.depth &&
    a.y + a.depth > b.y;
}

function sideLabel(side) {
  return { top: "上", bottom: "下", left: "左", right: "右" }[side] || side;
}

function oppositeSide(side) {
  return { top: "bottom", bottom: "top", left: "right", right: "left" }[side] || "bottom";
}

function typeLabel(type) {
  return { table: "机", fixture: "什器", bolda: "自社什器 bolda", power: "コンセント", spotlight: "スポットライト", wall: "壁面", chair: "椅子", person: "導線確認用人物" }[type] || type;
}

function itemSizeLabel(item) {
  const base = `W${Math.round(item.width)} x D${Math.round(item.depth)}`;
  return item.height ? `${base} x H${Math.round(item.height)}mm` : `${base}mm`;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[char]));
}

function autosave() {
  localStorage.setItem("booth-layout-tool", JSON.stringify(state));
}

function loadAutosave() {
  const saved = localStorage.getItem("booth-layout-tool");
  if (!saved) return false;
  try {
    Object.assign(state, JSON.parse(saved));
    state.view = "layout";
    normalizeItems();
    if (state.preset === "jex") {
      const wasOldJex = state.booth.width !== presets.jex.width || state.booth.depth !== presets.jex.depth;
      const savedWallSide = state.booth.wallSide || presets.jex.wallSide;
      const savedAisleSide = state.booth.aisleSide || presets.jex.aisleSide;
      state.eventName = presets.jex.eventName;
      state.booth = {
        width: presets.jex.width,
        depth: presets.jex.depth,
        wallHeight: presets.jex.wallHeight,
        wallSide: savedWallSide,
        aisleSide: savedAisleSide
      };
      state.notes = normalizeRuleNote(state.notes, jexRuleNote);
      if (wasOldJex || state.items.length === 0) {
        applyJexTwoBoothLayout(false);
      } else {
        clampItems();
      }
    }
    if (state.preset === "wof") {
      const wasOldWof = state.booth.width !== presets.wof.width || state.booth.depth !== presets.wof.depth;
      const savedWallSide = state.booth.wallSide || presets.wof.wallSide;
      const savedAisleSide = state.booth.aisleSide || presets.wof.aisleSide;
      state.eventName = presets.wof.eventName;
      state.booth = {
        width: presets.wof.width,
        depth: presets.wof.depth,
        wallHeight: presets.wof.wallHeight,
        wallSide: savedWallSide,
        aisleSide: savedAisleSide
      };
      state.notes = normalizeRuleNote(state.notes, wofRuleNote);
      if (wasOldWof || state.items.length === 0) {
        applyWofTwoBoothLayout(false);
      } else {
        clampItems();
      }
    }
    if (state.preset === "imf" || state.preset === "egf") {
      const preset = presets[state.preset];
      const wasOldShared = state.booth.width !== preset.width || state.booth.depth !== preset.depth;
      const savedWallSide = state.booth.wallSide || preset.wallSide;
      const savedAisleSide = state.booth.aisleSide || preset.aisleSide;
      state.eventName = preset.eventName;
      state.booth = {
        width: preset.width,
        depth: preset.depth,
        wallHeight: preset.wallHeight,
        wallSide: savedWallSide,
        aisleSide: savedAisleSide
      };
      state.notes = normalizeRuleNote(state.notes, state.preset === "imf" ? imfRuleNote : egfRuleNote);
      state.jointSide = state.jointSide || "right";
      if (wasOldShared || state.items.length === 0) {
        applyImfEgfLayout(false);
      } else {
        clampItems();
      }
    }
    state.booth.wallSide = state.booth.wallSide || "top";
    state.booth.aisleSide = state.booth.aisleSide || "bottom";
    keepWallAndAisleDifferent("wallSide");
    $("presetSelect").value = state.preset || "custom";
    syncTextInputs();
    syncBoothInputs();
    return true;
  } catch {
    localStorage.removeItem("booth-layout-tool");
    return false;
  }
}

function saveProject() {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${state.eventName || "booth-layout"}-${state.boothNo || "draft"}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

function loadProject(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      Object.assign(state, JSON.parse(reader.result));
      syncTextInputs();
      syncBoothInputs();
      render();
    } catch {
      alert("読込できませんでした。保存したJSONファイルを選択してください。");
    }
  };
  reader.readAsText(file);
  event.target.value = "";
}

init();

function normalizeRuleNote(current, expected) {
  if (!current) return expected;
  if (current.includes("IMF/EGF 2コマ")) return expected;
  if (current.includes("WOF 2コマ: 標準プリセット")) return expected;
  if (current.includes("JEX 3階レンタル装飾 2小間")) return expected;
  if (current.includes("WOF 2小間 ブースプランA")) return expected;
  if (current.includes("IMF 2コマ: Bタイプ")) return expected;
  if (current.includes("EGF 2コマ: Aタイプ")) return expected;
  return current;
}

function generate3dPreview() {
  setView("preview3d");
}

function draw3dScene() {
  if (!window.THREE) {
    $("preview3dTitle").textContent = "3Dライブラリを読み込めませんでした";
    return;
  }
  ensureThreePreview();
  disposeThreeScene(threePreview.scene);
  const T = window.THREE;
  const scene = new T.Scene();
  const sceneVersion = ++threeSceneVersion;
  threeAssetPromises = [];
  threeExpectedAssetCount = 0;
  threeLoadedAssetCount = 0;
  threeFailedAssetCount = 0;
  const maxSize = Math.max(state.booth.width, state.booth.depth, state.booth.wallHeight);
  scene.background = new T.Color(0xd8d7d2);
  threePreview.scene = scene;

  addThreeLighting(scene, maxSize);
  addThreeHallFloor(scene, maxSize);
  addThreeBoothFloor(scene);
  addThreeBoothWalls(scene);
  state.items.forEach((item) => addThreeItem(scene, item));
  addThreeSelectionHighlight(scene);
  syncThreeOverlapWarning();

  configureThreeCamera(false);
  renderThreeScene();
  updateThreeAssetStatus();
  const assetsForScene = [...threeAssetPromises];
  threePreview.assetsReady = Promise.allSettled(assetsForScene).then(() => {
    if (threeSceneVersion !== sceneVersion || threePreview?.scene !== scene) return;
    updateThreeAssetStatus();
    renderThreeScene();
  });
}

function trackThreeAssetPromise(promise) {
  const assetVersion = threeSceneVersion;
  threeExpectedAssetCount += 1;
  updateThreeAssetStatus();
  const tracked = promise.then((value) => {
    if (assetVersion !== threeSceneVersion) return value;
    threeLoadedAssetCount += 1;
    if (!value) threeFailedAssetCount += 1;
    updateThreeAssetStatus();
    return value;
  }, () => {
    if (assetVersion !== threeSceneVersion) return null;
    threeLoadedAssetCount += 1;
    threeFailedAssetCount += 1;
    updateThreeAssetStatus();
    return null;
  });
  threeAssetPromises.push(tracked);
  return tracked;
}

function updateThreeAssetStatus() {
  const status = $("preview3dAssetStatus");
  if (!status) return;
  const visiblePeople = state.items.filter((item) => item.type === "person").length;
  const printFaces = state.items.reduce((sum, item) => sum + [item.frontTexture, item.riserTexture, ...(item.tierTextures || [])].filter(Boolean).length, 0);
  const pending = Math.max(0, threeExpectedAssetCount - threeLoadedAssetCount);
  status.classList.toggle("is-loading", pending > 0);
  status.classList.toggle("has-error", threeFailedAssetCount > 0);
  if (pending > 0) {
    status.textContent = `選択項目の人物・印刷素材を読込中 ${threeLoadedAssetCount}/${threeExpectedAssetCount}`;
  } else if (threeFailedAssetCount > 0) {
    status.textContent = `配置物 ${state.items.length}点のみ（人物 ${visiblePeople}人・印刷面 ${printFaces}面／一部素材は代替表示）`;
  } else {
    status.textContent = `配置物 ${state.items.length}点のみ・自動追加なし（人物 ${visiblePeople}人・印刷面 ${printFaces}面）`;
  }
}

async function waitForThreeAssets() {
  if (!threePreview?.assetsReady) return;
  await threePreview.assetsReady;
  renderThreeScene();
}

function ensureThreePreview() {
  if (threePreview) return;
  const T = window.THREE;
  const renderer = new T.WebGLRenderer({ canvas: preview3dCanvas, antialias: true, alpha: false, preserveDrawingBuffer: true });
  renderer.outputColorSpace = T.SRGBColorSpace;
  renderer.toneMapping = T.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.94;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = T.PCFShadowMap;
  const camera = new T.PerspectiveCamera(34, 1.58, 10, 100000);
  threePreview = { renderer, camera, scene: null, target: new T.Vector3(), yaw: 0, pitch: 0, zoom: 1, lateral: 0.34, assetsReady: Promise.resolve() };
}

function disposeThreeScene(scene) {
  if (!scene) return;
  scene.traverse((node) => {
    node.geometry?.dispose?.();
    const materials = Array.isArray(node.material) ? node.material : [node.material];
    materials.filter(Boolean).forEach((material) => {
      material.map?.dispose?.();
      material.dispose?.();
    });
  });
}

function addThreeLighting(scene, maxSize) {
  const T = window.THREE;
  scene.add(new T.HemisphereLight(0xffffff, 0x77716a, 1.35));
  const key = new T.DirectionalLight(0xfffdf8, 2.25);
  key.position.set(-maxSize * 0.45, maxSize * 1.5, maxSize * 0.7);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  key.shadow.camera.near = 10;
  key.shadow.camera.far = maxSize * 5;
  key.shadow.camera.left = -maxSize * 1.4;
  key.shadow.camera.right = maxSize * 1.4;
  key.shadow.camera.top = maxSize * 1.4;
  key.shadow.camera.bottom = -maxSize * 1.4;
  key.shadow.bias = -0.00015;
  scene.add(key);
  const fill = new T.DirectionalLight(0xdde8ee, 0.72);
  fill.position.set(maxSize, maxSize * 0.8, -maxSize);
  scene.add(fill);
}

function addThreeHallFloor(scene, maxSize) {
  const T = window.THREE;
  const ground = new T.Mesh(
    new T.PlaneGeometry(maxSize * 5, maxSize * 5),
    new T.MeshStandardMaterial({ color: 0xaaa8a3, roughness: 0.98, metalness: 0 })
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -24;
  ground.receiveShadow = true;
  scene.add(ground);
}

function addThreeBoothFloor(scene) {
  const T = window.THREE;
  const w = state.booth.width;
  const d = state.booth.depth;
  const floor = new T.Mesh(
    new T.BoxGeometry(w, 28, d),
    new T.MeshStandardMaterial({ color: 0xc3c0ba, roughness: 0.94, metalness: 0 })
  );
  floor.position.y = -10;
  floor.receiveShadow = true;
  scene.add(floor);

  const boundaryPoints = [
    -w / 2, 10, -d / 2, w / 2, 10, -d / 2,
    w / 2, 10, -d / 2, w / 2, 10, d / 2,
    w / 2, 10, d / 2, -w / 2, 10, d / 2,
    -w / 2, 10, d / 2, -w / 2, 10, -d / 2
  ];
  const boundaryGeometry = new T.BufferGeometry();
  boundaryGeometry.setAttribute("position", new T.Float32BufferAttribute(boundaryPoints, 3));
  scene.add(new T.LineSegments(boundaryGeometry, new T.LineBasicMaterial({ color: 0x746b5e })));
}

function addThreeBoothWalls(scene) {
  ["top", "right", "bottom", "left"].forEach((side) => {
    if (side === state.booth.aisleSide) return;
    const isMain = side === state.booth.wallSide;
    const height = isMain ? state.booth.wallHeight : Math.min(1200, state.booth.wallHeight);
    addThreeWall(scene, side, height, isMain);
  });
}

function addThreeWall(scene, side, height, isMain) {
  const T = window.THREE;
  const w = state.booth.width;
  const d = state.booth.depth;
  const thickness = 42;
  const horizontal = side === "top" || side === "bottom";
  const wall = new T.Mesh(
    new T.BoxGeometry(horizontal ? w : thickness, height, horizontal ? thickness : d),
    new T.MeshStandardMaterial({ color: isMain ? 0xf7f7f3 : 0xeeeeea, roughness: 0.76, metalness: 0.02 })
  );
  wall.position.set(
    side === "left" ? -w / 2 - thickness / 2 : side === "right" ? w / 2 + thickness / 2 : 0,
    height / 2,
    side === "top" ? -d / 2 - thickness / 2 : side === "bottom" ? d / 2 + thickness / 2 : 0
  );
  wall.castShadow = true;
  wall.receiveShadow = true;
  scene.add(wall);

  const span = horizontal ? w : d;
  for (let along = -span / 2; along <= span / 2 + 1; along += 990) {
    const post = new T.Mesh(
      new T.BoxGeometry(horizontal ? 18 : 24, height + 18, horizontal ? 24 : 18),
      new T.MeshStandardMaterial({ color: 0xbfc5c4, roughness: 0.4, metalness: 0.55 })
    );
    post.position.set(
      horizontal ? along : wall.position.x,
      height / 2,
      horizontal ? wall.position.z : along
    );
    post.castShadow = true;
    scene.add(post);
  }
}

function addThreeItem(scene, item) {
  if (item.type === "wall") return addThreeWallSign(scene, item);
  if (item.type === "spotlight") return addThreeSpotlight(scene, item);
  if (item.type === "power") return addThreeOutlet(scene, item);
  if (item.type === "person") return addThreePerson(scene, item);
  const displayItem = createThreeDisplayItem(item);
  if (item.type === "chair") return addThreeChair(scene, displayItem);
  if (item.type === "bolda") return addThreeBolda(scene, displayItem);
  if (item.type === "fixture" && String(item.label || "").includes("姿見")) return addThreeMirror(scene, displayItem);
  if (item.type === "fixture" && String(item.label || "").includes("棚")) return addThreeShelfFixture(scene, displayItem);
  if (isFoldingTableItem(item)) return addThreeFoldingTable(scene, displayItem);
  addThreeCounter(scene, displayItem);
}

function addThreeSelectionHighlight(scene) {
  if (!state.selectedId) return;
  const T = window.THREE;
  let target = null;
  scene.traverse((node) => {
    if (!target && node.userData?.itemId === state.selectedId) target = node;
  });
  if (!target) return;
  const helper = new T.BoxHelper(target, 0x008c83);
  helper.material.depthTest = false;
  helper.material.transparent = true;
  helper.material.opacity = 0.92;
  helper.renderOrder = 12;
  scene.add(helper);
}

function isFoldingTableItem(item) {
  const label = String(item.label || "");
  return item.type === "table" && !label.includes("展示台") && !label.includes("カウンター");
}

function threeStandardMaterial(color, options = {}) {
  const T = window.THREE;
  return new T.MeshStandardMaterial({ color, roughness: options.roughness ?? 0.72, metalness: options.metalness ?? 0.02 });
}

function addLocalBox(group, width, height, depth, x, y, z, material, castShadow = true) {
  const T = window.THREE;
  const mesh = new T.Mesh(new T.BoxGeometry(Math.max(1, width), Math.max(1, height), Math.max(1, depth)), material);
  mesh.position.set(x, y, z);
  mesh.castShadow = castShadow;
  mesh.receiveShadow = true;
  group.add(mesh);
  return mesh;
}

function itemRotationQuarterTurns(item) {
  const turns = Math.round(Number(item.rotationQuarterTurns) || 0);
  return ((turns % 4) + 4) % 4;
}

function aisleFacingQuarterTurns(side) {
  return ({ bottom: 0, top: 2, left: -1, right: 1 })[side] || 0;
}

function createThreeDisplayItem(item) {
  const planWidth = item.width;
  const planDepth = item.depth;
  const threeQuarterTurns = aisleFacingQuarterTurns(state.booth.aisleSide) + itemRotationQuarterTurns(item);
  const swapsLocalAxes = Math.abs(threeQuarterTurns) % 2 === 1;
  return {
    ...item,
    width: swapsLocalAxes ? planDepth : planWidth,
    depth: swapsLocalAxes ? planWidth : planDepth,
    planWidth,
    planDepth,
    threeQuarterTurns
  };
}

function createFacingGroup(item) {
  const T = window.THREE;
  const group = new T.Group();
  group.userData.itemId = item.id;
  const planWidth = item.planWidth ?? item.width;
  const planDepth = item.planDepth ?? item.depth;
  const quarterTurns = item.threeQuarterTurns ?? (aisleFacingQuarterTurns(state.booth.aisleSide) + itemRotationQuarterTurns(item));
  group.position.set(threeWorldX(item.x + planWidth / 2), 0, threeWorldZ(item.y + planDepth / 2));
  group.rotation.y = quarterTurns * Math.PI / 2;
  return group;
}

function addThreeCounter(scene, item) {
  const height = item.height || defaultItemHeight(item);
  const group = createFacingGroup(item);
  const body = threeStandardMaterial(0xe9eae7, { roughness: 0.72 });
  const white = threeStandardMaterial(0xffffff, { roughness: 0.58 });
  const reveal = threeStandardMaterial(0xaeb3b2, { roughness: 0.46, metalness: 0.12 });
  const bodyH = Math.max(120, height - 52);
  addLocalBox(group, item.width - 18, bodyH - 58, item.depth - 22, 0, 58 + (bodyH - 58) / 2, -6, body);
  addLocalBox(group, item.width + 26, 52, item.depth + 24, 0, height - 26, 0, white);
  addLocalBox(group, item.width - 50, 46, item.depth - 58, 0, 23, -4, reveal);
  addLocalBox(group, 16, bodyH - 96, 12, -item.width / 2 + 28, 64 + (bodyH - 96) / 2, item.depth / 2 - 15, reveal, false);
  addLocalBox(group, 16, bodyH - 96, 12, item.width / 2 - 28, 64 + (bodyH - 96) / 2, item.depth / 2 - 15, reveal, false);
  addLocalBox(group, item.width - 72, 10, 12, 0, height * 0.46, item.depth / 2 - 15, reveal, false);
  scene.add(group);
}

function addThreeMirror(scene, item) {
  const T = window.THREE;
  const group = createFacingGroup(item);
  const h = item.height || 1700;
  const frame = threeStandardMaterial(0x737b7d, { roughness: 0.3, metalness: 0.72 });
  const back = threeStandardMaterial(0xd6d9d8, { roughness: 0.62, metalness: 0.12 });
  const mirror = new T.MeshPhysicalMaterial({ color: 0xdbe9ee, roughness: 0.08, metalness: 0.78, clearcoat: 1, clearcoatRoughness: 0.08, side: T.DoubleSide });
  const mirrorH = Math.max(500, h - 190);
  const centerY = 135 + mirrorH / 2;
  addLocalBox(group, item.width, mirrorH + 42, 38, 0, centerY, 0, back);
  addLocalBox(group, item.width + 34, 28, 54, 0, 120, 0, frame);
  addLocalBox(group, item.width + 34, 28, 54, 0, 150 + mirrorH, 0, frame);
  addLocalBox(group, 28, mirrorH, 54, -item.width / 2 - 3, centerY, 0, frame);
  addLocalBox(group, 28, mirrorH, 54, item.width / 2 + 3, centerY, 0, frame);
  const glass = new T.Mesh(new T.PlaneGeometry(Math.max(80, item.width - 44), Math.max(360, mirrorH - 44)), mirror);
  glass.position.set(0, centerY, 22);
  group.add(glass);
  addLocalBox(group, item.width * 0.72, 34, item.depth * 0.84, 0, 24, 0, frame);
  scene.add(group);
}

function addThreeShelfFixture(scene, item) {
  const group = createFacingGroup(item);
  const h = item.height || 1400;
  const board = threeStandardMaterial(0xf3f4f1, { roughness: 0.76 });
  const edge = threeStandardMaterial(0xbac0c0, { roughness: 0.38, metalness: 0.48 });
  addLocalBox(group, item.width * 0.94, h, 30, 0, h / 2, -item.depth / 2 + 18, board);
  addLocalBox(group, 34, h, item.depth * 0.9, -item.width / 2 + 17, h / 2, 0, edge);
  addLocalBox(group, 34, h, item.depth * 0.9, item.width / 2 - 17, h / 2, 0, edge);
  const shelfCount = 4;
  for (let i = 0; i < shelfCount; i += 1) {
    const y = 220 + i * ((h - 300) / Math.max(1, shelfCount - 1));
    addLocalBox(group, item.width * 0.94, 28, item.depth * 0.88, 0, y, 8, board);
  }
  scene.add(group);
}

function syncThreeOverlapWarning() {
  const overlaps = countOverlaps();
  const warning = $("preview3dWarning");
  warning.classList.toggle("hidden", overlaps === 0);
  warning.textContent = overlaps ? `配置が${overlaps}か所重なっています` : "";
}

function addThreeFoldingTable(scene, item) {
  const T = window.THREE;
  const height = item.height || 700;
  const group = createFacingGroup(item);
  const top = threeStandardMaterial(0xf5f4ef, { roughness: 0.62 });
  const metal = threeStandardMaterial(0x8e9494, { roughness: 0.3, metalness: 0.72 });
  addLocalBox(group, item.width, 48, item.depth, 0, height - 24, 0, top);
  const ix = Math.min(150, item.width * 0.12);
  const iz = Math.min(120, item.depth * 0.2);
  [[-item.width / 2 + ix, -item.depth / 2 + iz], [item.width / 2 - ix, -item.depth / 2 + iz], [-item.width / 2 + ix, item.depth / 2 - iz], [item.width / 2 - ix, item.depth / 2 - iz]]
    .forEach(([x, z]) => addLocalCylinder(group, 16, height - 45, x, (height - 45) / 2, z, metal));
  addLocalBox(group, item.width * 0.76, 24, 24, 0, height * 0.43, 0, metal);
  scene.add(group);
}

function addLocalCylinder(group, radius, height, x, y, z, material, radialSegments = 14) {
  const T = window.THREE;
  const mesh = new T.Mesh(new T.CylinderGeometry(radius, radius, height, radialSegments), material);
  mesh.position.set(x, y, z);
  mesh.castShadow = true;
  group.add(mesh);
  return mesh;
}

function addThreeChair(scene, item) {
  const group = createFacingGroup(item);
  const seatH = 430;
  const totalH = item.height || 780;
  const frame = threeStandardMaterial(0x888f90, { roughness: 0.32, metalness: 0.66 });
  const shell = threeStandardMaterial(0xf1f1ed, { roughness: 0.68 });
  addLocalBox(group, item.width * 0.82, 46, item.depth * 0.72, 0, seatH, 10, shell);
  addLocalBox(group, item.width * 0.82, totalH - seatH, 42, 0, seatH + (totalH - seatH) / 2, -item.depth * 0.3, shell);
  const lx = item.width * 0.3;
  const lz = item.depth * 0.24;
  [[-lx, -lz], [lx, -lz], [-lx, lz], [lx, lz]].forEach(([x, z]) => addLocalCylinder(group, 13, seatH, x, seatH / 2, z, frame, 12));
  scene.add(group);
}

function addThreePerson(scene, item) {
  const T = window.THREE;
  const chair = item.isThreeReference ? null : getChairForPerson(item);
  const seated = Boolean(chair);
  const source = seated ? (item.seatedImage || item.image) : (item.standingImage || item.image);
  const anchor = chair || item;
  const fallbackPerson = addThreePersonFallback(scene, item, anchor, seated);
  if (!source) return fallbackPerson;
  const spriteMaterial = new T.SpriteMaterial({ color: 0xffffff, transparent: true, opacity: 0, alphaTest: 0.025, depthWrite: false, toneMapped: false });
  const sprite = new T.Sprite(spriteMaterial);
  sprite.userData.itemId = item.id;
  const physicalHeight = seated ? 1320 : 1790;
  sprite.center.set(0.5, 0);
  sprite.position.set(
    anchor.x + anchor.width / 2 - state.booth.width / 2,
    4,
    anchor.y + anchor.depth / 2 - state.booth.depth / 2
  );
  sprite.scale.set(seated ? 620 : 620, physicalHeight, 1);
  sprite.renderOrder = 4;
  scene.add(sprite);

  const sceneAtLoad = threePreview?.scene;
  trackThreeAssetPromise(new Promise((resolve) => {
    new T.TextureLoader().load(source, (texture) => {
      if (threePreview?.scene !== sceneAtLoad) {
        texture.dispose();
        resolve(null);
        return;
      }
      texture.colorSpace = T.SRGBColorSpace;
      texture.anisotropy = Math.min(8, threePreview?.renderer?.capabilities?.getMaxAnisotropy?.() || 1);
      sprite.material.map = texture;
      sprite.material.opacity = item.isThreeReference ? 0.94 : 1;
      sprite.material.needsUpdate = true;
      const aspect = texture.image?.width && texture.image?.height ? texture.image.width / texture.image.height : 0.4;
      sprite.scale.set(physicalHeight * aspect, physicalHeight, 1);
      fallbackPerson.visible = false;
      renderThreeScene();
      resolve(texture);
    }, undefined, () => resolve(null));
  }));

  const shadow = new T.Mesh(
    new T.CircleGeometry(seated ? 330 : 245, 40),
    new T.MeshBasicMaterial({ color: 0x202423, transparent: true, opacity: 0.16, depthWrite: false })
  );
  shadow.rotation.x = -Math.PI / 2;
  shadow.scale.y = 0.38;
  shadow.position.set(sprite.position.x, 3, sprite.position.z + 25);
  scene.add(shadow);

}

function addThreePersonFallback(scene, item, anchor, seated) {
  const T = window.THREE;
  const group = new T.Group();
  group.userData.itemId = item.id;
  group.position.set(
    anchor.x + anchor.width / 2 - state.booth.width / 2,
    0,
    anchor.y + anchor.depth / 2 - state.booth.depth / 2
  );
  const cloth = threeStandardMaterial(item.color || 0x437d99, { roughness: 0.72 });
  const skin = threeStandardMaterial(0xd6a37e, { roughness: 0.82 });
  const dark = threeStandardMaterial(0x283034, { roughness: 0.68 });
  const addSphere = (radius, x, y, z, material) => {
    const mesh = new T.Mesh(new T.SphereGeometry(radius, 20, 14), material);
    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    group.add(mesh);
    return mesh;
  };

  if (seated) {
    addLocalBox(group, 340, 420, 170, 0, 910, 0, cloth);
    addSphere(108, 0, 1210, 0, skin);
    [-1, 1].forEach((side) => {
      const arm = addLocalCylinder(group, 48, 430, side * 215, 890, 0, cloth, 14);
      arm.rotation.z = side * -0.18;
      addLocalBox(group, 145, 92, 330, side * 78, 655, 112, dark);
      addLocalCylinder(group, 58, 470, side * 105, 380, 155, dark, 14);
      addLocalBox(group, 145, 70, 260, side * 108, 52, 210, dark);
    });
  } else {
    addLocalBox(group, 360, 570, 180, 0, 1080, 0, cloth);
    addSphere(112, 0, 1635, 0, skin);
    [-1, 1].forEach((side) => {
      const arm = addLocalCylinder(group, 50, 610, side * 240, 1050, 0, cloth, 14);
      arm.rotation.z = side * -0.1;
      addLocalCylinder(group, 72, 760, side * 92, 380, 0, dark, 14);
      addLocalBox(group, 170, 74, 300, side * 92, 38, 52, dark);
    });
  }

  const shadow = new T.Mesh(
    new T.CircleGeometry(seated ? 320 : 240, 36),
    new T.MeshBasicMaterial({ color: 0x202423, transparent: true, opacity: 0.13, depthWrite: false })
  );
  shadow.rotation.x = -Math.PI / 2;
  shadow.scale.y = 0.42;
  shadow.position.y = 3;
  group.add(shadow);
  scene.add(group);
  return group;
}

function addThreeImagePlane(group, source, width, height, z, y, x = 0) {
  if (!source) return null;
  const T = window.THREE;
  const material = new T.MeshStandardMaterial({ color: 0xffffff, roughness: 0.68, metalness: 0, emissive: 0x202020, emissiveIntensity: 0.08, side: T.DoubleSide, transparent: true, opacity: 0, toneMapped: false, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 });
  const plane = new T.Mesh(new T.PlaneGeometry(Math.max(20, width), Math.max(20, height)), material);
  plane.position.set(x, y, z);
  plane.castShadow = false;
  group.add(plane);
  const sceneAtLoad = threePreview?.scene;
  trackThreeAssetPromise(new Promise((resolve) => {
    new T.TextureLoader().load(source, (texture) => {
      if (threePreview?.scene !== sceneAtLoad) {
        texture.dispose();
        resolve(null);
        return;
      }
      texture.colorSpace = T.SRGBColorSpace;
      texture.anisotropy = Math.min(8, threePreview?.renderer?.capabilities?.getMaxAnisotropy?.() || 1);
      material.map = texture;
      material.opacity = 1;
      material.transparent = false;
      material.needsUpdate = true;
      renderThreeScene();
      resolve(texture);
    }, undefined, () => resolve(null));
  }));
  return plane;
}

function addThreeBolda(scene, item) {
  const code = getBoldaCode(item);
  const group = createFacingGroup(item);
  const h = item.height || defaultItemHeight(item);
  const board = threeStandardMaterial(0xf5f5f2, { roughness: 0.8 });
  const top = threeStandardMaterial(0xffffff, { roughness: 0.62 });
  if (code === "TB05_AS01") {
    const baseH = h * (800 / 1100);
    const riserH = h - baseH;
    const riserD = Math.min(250, item.depth * 0.42);
    const riserZ = -item.depth / 2 + riserD / 2;
    addLocalBox(group, item.width, baseH, item.depth, 0, baseH / 2, 0, board);
    addLocalBox(group, item.width + 12, 24, item.depth + 12, 0, baseH - 12, 0, top);
    addLocalBox(group, item.width, riserH, riserD, 0, baseH + riserH / 2, riserZ, board);
    addLocalBox(group, item.width + 8, 20, riserD + 8, 0, h - 10, riserZ, top);
    addThreeImagePlane(group, item.frontTexture, item.width - 8, baseH - 8, item.depth / 2 + 4, baseH / 2);
    addThreeImagePlane(group, item.riserTexture, item.width - 8, riserH - 8, riserZ + riserD / 2 + 4, baseH + riserH / 2);
  } else if (code === "ED04") {
    const baseH = h * 0.64;
    const rise = (h - baseH) / 2;
    const middleDepth = item.depth * (2 / 3);
    const topDepth = item.depth / 3;
    const middleZ = -item.depth / 6;
    const topZ = -item.depth / 3;
    addLocalBox(group, item.width, baseH, item.depth, 0, baseH / 2, 0, board);
    addLocalBox(group, item.width, rise, middleDepth, 0, baseH + rise / 2, middleZ, top);
    addLocalBox(group, item.width, rise, topDepth, 0, baseH + rise + rise / 2, topZ, top);
    addThreeImagePlane(group, item.frontTexture, item.width - 8, baseH - 8, item.depth / 2 + 4, baseH / 2);
    addThreeImagePlane(group, item.tierTextures?.[0], item.width - 8, rise - 8, item.depth / 6 + 4, baseH + rise / 2);
    addThreeImagePlane(group, item.tierTextures?.[1], item.width - 8, rise - 8, -item.depth / 6 + 4, baseH + rise + rise / 2);
  } else if (code === "TB13") {
    const lowerH = h * 0.58;
    const cubbyH = h - lowerH - 34;
    addLocalBox(group, item.width, lowerH, item.depth, 0, lowerH / 2, 0, board);
    addLocalBox(group, item.width, 34, item.depth, 0, h - 17, 0, top);
    addLocalBox(group, 34, cubbyH, item.depth, -item.width / 2 + 17, lowerH + cubbyH / 2, 0, board);
    addLocalBox(group, 34, cubbyH, item.depth, item.width / 2 - 17, lowerH + cubbyH / 2, 0, board);
    addLocalBox(group, 30, cubbyH, item.depth, 0, lowerH + cubbyH / 2, 0, board);
    addLocalBox(group, item.width, 28, item.depth, 0, lowerH + 14, 0, board);
    addThreeImagePlane(group, item.frontTexture, item.width - 8, lowerH - 8, item.depth / 2 + 4, lowerH / 2);
  } else if (code === "SF03") {
    addLocalBox(group, Math.max(70, item.width * 0.24), h, 42, 0, h / 2, -item.depth / 2 + 24, board);
    for (let i = 0; i < 4; i += 1) {
      const y = 230 + i * ((h - 330) / 3);
      addLocalBox(group, item.width * 0.86, 30, item.depth * 0.72, 0, y, 20, top);
    }
  } else {
    addLocalBox(group, item.width, h, item.depth, 0, h / 2, 0, board);
    addLocalBox(group, item.width + 18, 30, item.depth + 18, 0, h - 15, 0, top);
    if (item.frontTexture) {
      addThreeImagePlane(group, item.frontTexture, item.width - 8, h - 8, item.depth / 2 + 4, h / 2);
    }
  }
  scene.add(group);
}

function addThreeWallSign(scene, item) {
  const T = window.THREE;
  const side = nearestBoothSide(item);
  const mount = getItemVerticalRange(item);
  const horizontal = side === "top" || side === "bottom";
  const available = horizontal ? state.booth.width : state.booth.depth;
  const length = Math.min(item.width, Math.max(200, available - 100));
  const center = wallAlongPosition(item, side, length);
  const sign = new T.Mesh(
    new T.BoxGeometry(horizontal ? length : 46, item.height || 300, horizontal ? 46 : length),
    threeStandardMaterial(0xffffff, { roughness: 0.58 })
  );
  sign.userData.itemId = item.id;
  sign.position.set(
    horizontal ? center : side === "left" ? -state.booth.width / 2 + 30 : state.booth.width / 2 - 30,
    (mount.bottom + mount.top) / 2,
    horizontal ? (side === "top" ? -state.booth.depth / 2 + 30 : state.booth.depth / 2 - 30) : center
  );
  sign.castShadow = true;
  scene.add(sign);

  const plane = createThreeTextPlane(state.companyName || item.label, length * 0.88, (item.height || 300) * 0.72, "#ffffff", "#172225", 48);
  plane.userData.itemId = item.id;
  plane.position.copy(sign.position);
  orientWallPlane(plane, side, 27);
  scene.add(plane);
}

function addThreeSpotlight(scene, item) {
  const T = window.THREE;
  const side = nearestBoothSide(item);
  const mount = getItemVerticalRange(item);
  const group = createWallMountedGroup(item, side, mount.center);
  const white = threeStandardMaterial(0xf4f3ee, { roughness: 0.42, metalness: 0.18 });
  const metal = threeStandardMaterial(0xb9bdbc, { roughness: 0.26, metalness: 0.7 });
  addLocalBox(group, 140, 180, 42, 0, 0, 18, white, false);
  addLocalBox(group, 32, 32, 380, 0, -18, 210, metal, false);
  const head = new T.Mesh(new T.CylinderGeometry(72, 105, 170, 20), white);
  head.rotation.x = Math.PI / 2;
  head.position.set(0, -90, 430);
  head.castShadow = false;
  group.add(head);
  const bulb = new T.Mesh(new T.CircleGeometry(74, 24), new T.MeshStandardMaterial({ color: 0xffe6a3, emissive: 0xffc34d, emissiveIntensity: 1.8 }));
  bulb.position.set(0, -90, 520);
  group.add(bulb);
  const glow = new T.PointLight(0xffd9a0, 12, 1500, 2);
  glow.position.set(0, -110, 520);
  group.add(glow);
  const badge = createThreeTextPlane(`${item.watt || 0}W`, 150, 72, "#e47b00", "#ffffff", 38);
  badge.position.set(0, -155, 42);
  group.add(badge);
  scene.add(group);
}

function addThreeOutlet(scene, item) {
  const side = nearestBoothSide(item);
  const mount = getItemVerticalRange(item);
  const group = createWallMountedGroup(item, side, mount.center);
  const plate = createOutletPlane();
  plate.position.set(0, 0, 25);
  group.add(plate);
  scene.add(group);
}

function createOutletPlane() {
  const T = window.THREE;
  const canvas2 = document.createElement("canvas");
  canvas2.width = 320;
  canvas2.height = 300;
  const c = canvas2.getContext("2d");
  c.fillStyle = "#fafafa";
  c.fillRect(10, 10, 300, 280);
  c.strokeStyle = "#a6aaab";
  c.lineWidth = 9;
  c.strokeRect(10, 10, 300, 280);
  c.fillStyle = "#25292a";
  [85, 235].forEach((x) => {
    c.fillRect(x - 24, 92, 18, 62);
    c.fillRect(x + 6, 92, 18, 62);
    c.beginPath();
    c.arc(x, 188, 15, 0, Math.PI * 2);
    c.fill();
  });
  const texture = new T.CanvasTexture(canvas2);
  texture.colorSpace = T.SRGBColorSpace;
  return new T.Mesh(new T.PlaneGeometry(150, 140), new T.MeshStandardMaterial({ map: texture, roughness: 0.62, side: T.DoubleSide }));
}

function createThreeTextPlane(text, width, height, background, foreground, fontSize) {
  const T = window.THREE;
  const canvas2 = document.createElement("canvas");
  canvas2.width = 1024;
  canvas2.height = 256;
  const c = canvas2.getContext("2d");
  c.fillStyle = background;
  c.fillRect(0, 0, canvas2.width, canvas2.height);
  c.strokeStyle = "#c7cdcd";
  c.lineWidth = 10;
  c.strokeRect(5, 5, canvas2.width - 10, canvas2.height - 10);
  c.fillStyle = foreground;
  c.font = `700 ${fontSize}px Arial, "Yu Gothic", sans-serif`;
  c.textAlign = "center";
  c.textBaseline = "middle";
  let display = String(text || "");
  while (c.measureText(display).width > 910 && display.length > 4) display = display.slice(0, -1);
  c.fillText(display, 512, 128);
  const texture = new T.CanvasTexture(canvas2);
  texture.colorSpace = T.SRGBColorSpace;
  return new T.Mesh(new T.PlaneGeometry(width, height), new T.MeshStandardMaterial({ map: texture, roughness: 0.62, transparent: false, side: T.DoubleSide }));
}

function createWallMountedGroup(item, side, elevation) {
  const T = window.THREE;
  const group = new T.Group();
  group.userData.itemId = item.id;
  const along = wallAlongPosition(item, side, 0);
  group.position.set(
    side === "left" ? -state.booth.width / 2 + 24 : side === "right" ? state.booth.width / 2 - 24 : along,
    elevation,
    side === "top" ? -state.booth.depth / 2 + 24 : side === "bottom" ? state.booth.depth / 2 - 24 : along
  );
  group.rotation.y = ({ top: 0, bottom: Math.PI, left: Math.PI / 2, right: -Math.PI / 2 })[side] || 0;
  return group;
}

function orientWallPlane(plane, side, offset) {
  if (side === "top") plane.position.z += offset;
  if (side === "bottom") { plane.position.z -= offset; plane.rotation.y = Math.PI; }
  if (side === "left") { plane.position.x += offset; plane.rotation.y = Math.PI / 2; }
  if (side === "right") { plane.position.x -= offset; plane.rotation.y = -Math.PI / 2; }
}

function wallAlongPosition(item, side, objectLength = 0) {
  if (side === "top" || side === "bottom") {
    const center = threeWorldX(item.x + item.width / 2);
    const limit = Math.max(0, (state.booth.width - objectLength) / 2);
    return Math.max(-limit, Math.min(limit, center));
  }
  const center = threeWorldZ(item.y + item.depth / 2);
  const limit = Math.max(0, (state.booth.depth - objectLength) / 2);
  return Math.max(-limit, Math.min(limit, center));
}

function nearestBoothSide(item) {
  const cx = item.x + item.width / 2;
  const cy = item.y + item.depth / 2;
  const distances = { top: cy, bottom: state.booth.depth - cy, left: cx, right: state.booth.width - cx };
  return Object.entries(distances).sort((a, b) => a[1] - b[1])[0][0];
}

function getItemVerticalRange(item) {
  const h = item.height || defaultItemHeight(item);
  if (item.type === "wall") {
    const top = Math.max(h + 150, state.booth.wallHeight - 260);
    return { bottom: Math.max(120, top - h), top, center: Math.max(120, top - h) + h / 2 };
  }
  if (item.type === "spotlight") {
    const center = Math.max(700, state.booth.wallHeight - 210);
    return { bottom: center - h / 2, top: center + h / 2, center };
  }
  if (item.type === "power") {
    const center = 250;
    return { bottom: 160, top: 340, center };
  }
  return { bottom: 0, top: h, center: h / 2 };
}

function threeWorldX(mm) {
  return mm - state.booth.width / 2;
}

function threeWorldZ(mm) {
  return mm - state.booth.depth / 2;
}

function configureThreeCamera(reset) {
  if (!threePreview) return;
  const T = window.THREE;
  if (reset) {
    threePreview.yaw = 0;
    threePreview.pitch = 0;
    threePreview.zoom = 1;
    threePreview.lateral = 0.34;
  }
  const w = state.booth.width;
  const d = state.booth.depth;
  const h = state.booth.wallHeight;
  const maxSize = Math.max(w, d);
  const side = state.booth.aisleSide;
  const outward = {
    bottom: new T.Vector3(0, 0, 1),
    top: new T.Vector3(0, 0, -1),
    left: new T.Vector3(-1, 0, 0),
    right: new T.Vector3(1, 0, 0)
  }[side] || new T.Vector3(0, 0, 1);
  const tangent = new T.Vector3(outward.z, 0, -outward.x);
  const target = new T.Vector3(0, Math.min(h * 0.38, 900), 0);
  const distance = (maxSize * 1.16 + Math.min(w, d) * 0.48) * threePreview.zoom;
  const base = target.clone()
    .add(outward.clone().multiplyScalar(distance))
    .add(tangent.multiplyScalar(maxSize * (threePreview.lateral ?? 0.34) * threePreview.zoom));
  base.y = Math.max(h * 0.98, maxSize * 0.46) * threePreview.zoom;
  const offset = base.clone().sub(target).applyAxisAngle(new T.Vector3(0, 1, 0), threePreview.yaw);
  offset.y += threePreview.pitch * maxSize;
  threePreview.target.copy(target);
  threePreview.camera.position.copy(target.clone().add(offset));
  threePreview.camera.lookAt(target);
}

function renderThreeScene() {
  if (!threePreview?.scene) return;
  const stage = preview3dCanvas.parentElement;
  const cssWidth = Math.max(760, Math.round(stage?.clientWidth || 980));
  const cssHeight = Math.round(cssWidth / 1.58);
  threePreview.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  threePreview.renderer.setSize(cssWidth, cssHeight, false);
  threePreview.camera.aspect = cssWidth / cssHeight;
  threePreview.camera.updateProjectionMatrix();
  threePreview.renderer.render(threePreview.scene, threePreview.camera);
}

function bindThreePreviewControls() {
  preview3dCanvas.addEventListener("pointerdown", (event) => {
    if (event.button !== 0) return;
    threeDrag = { x: event.clientX, y: event.clientY, startX: event.clientX, startY: event.clientY, moved: false };
    preview3dCanvas.setPointerCapture(event.pointerId);
  });
  preview3dCanvas.addEventListener("pointermove", (event) => {
    if (!threeDrag || !threePreview) return;
    const dx = event.clientX - threeDrag.x;
    const dy = event.clientY - threeDrag.y;
    const moved = threeDrag.moved || Math.hypot(event.clientX - threeDrag.startX, event.clientY - threeDrag.startY) > 5;
    threeDrag = { ...threeDrag, x: event.clientX, y: event.clientY, moved };
    if (!moved) return;
    threePreview.yaw += dx * 0.006;
    threePreview.pitch = Math.max(-0.32, Math.min(0.5, threePreview.pitch + dy * 0.0017));
    syncThreeCameraButtons("");
    configureThreeCamera(false);
    renderThreeScene();
  });
  preview3dCanvas.addEventListener("pointerup", (event) => {
    const finished = threeDrag;
    threeDrag = null;
    if (finished && !finished.moved) selectThreeItemAtPointer(event);
  });
  preview3dCanvas.addEventListener("pointercancel", () => { threeDrag = null; });
  preview3dCanvas.addEventListener("wheel", (event) => {
    if (!threePreview) return;
    event.preventDefault();
    threePreview.zoom = Math.max(0.68, Math.min(1.8, threePreview.zoom * (event.deltaY > 0 ? 1.08 : 0.92)));
    syncThreeCameraButtons("");
    configureThreeCamera(false);
    renderThreeScene();
  }, { passive: false });
  window.addEventListener("resize", () => {
    if (state.view === "preview3d") renderThreeScene();
  });
}

function resetThreeCamera() {
  if (!threePreview) {
    draw3dScene();
    return;
  }
  setThreeCameraPreset("default");
}

function setThreeCameraPreset(preset) {
  if (!threePreview) draw3dScene();
  if (!threePreview) return;
  const settings = {
    default: { yaw: 0, pitch: 0, zoom: 1, lateral: 0.34 },
    front: { yaw: 0, pitch: -0.08, zoom: 0.96, lateral: 0 },
    left: { yaw: 0, pitch: 0, zoom: 1, lateral: -0.38 },
    right: { yaw: 0, pitch: 0, zoom: 1, lateral: 0.38 },
    top: { yaw: 0, pitch: 0.5, zoom: 1.08, lateral: 0 }
  }[preset] || { yaw: 0, pitch: 0, zoom: 1, lateral: 0.34 };
  Object.assign(threePreview, settings);
  syncThreeCameraButtons(preset || "default");
  configureThreeCamera(false);
  renderThreeScene();
}

function syncThreeCameraButtons(activePreset) {
  document.querySelectorAll("[data-three-camera]").forEach((button) => {
    button.classList.toggle("active", button.dataset.threeCamera === activePreset);
  });
}

function selectThreeItemAtPointer(event) {
  if (!threePreview?.scene || !window.THREE) return;
  const T = window.THREE;
  const rect = preview3dCanvas.getBoundingClientRect();
  const pointer = new T.Vector2(
    ((event.clientX - rect.left) / rect.width) * 2 - 1,
    -((event.clientY - rect.top) / rect.height) * 2 + 1
  );
  const raycaster = new T.Raycaster();
  raycaster.setFromCamera(pointer, threePreview.camera);
  const intersections = raycaster.intersectObjects(threePreview.scene.children, true);
  let itemId = null;
  for (const intersection of intersections) {
    let node = intersection.object;
    while (node && node !== threePreview.scene) {
      if (node.userData?.itemId) {
        itemId = node.userData.itemId;
        break;
      }
      node = node.parent;
    }
    if (itemId) break;
  }
  state.selectedId = state.items.some((item) => item.id === itemId) ? itemId : null;
  preview3dCanvas.focus({ preventScroll: true });
  syncSelectionEditor();
  drawCanvas();
  renderTable();
  renderAgents();
  autosave();
  draw3dScene();
  syncThreeSelectionUi();
}

function syncThreeSelectionUi() {
  const item = selectedItem();
  const text = $("preview3dSelectionText");
  if (text) {
    text.textContent = item
      ? `選択中: ${item.label} / ${itemSizeLabel(item)} / X${Math.round(item.x)} Y${Math.round(item.y)}`
      : "3D内の什器をクリックすると選択できます";
  }
  ["editSelected3dBtn", "rotateSelected3dBtn", "deleteSelected3dBtn"].forEach((id) => {
    if ($(id)) $(id).disabled = !item;
  });
}

function createIsoProjector(cw, ch) {
  const isoX = 0.75;
  const isoY = 0.34;
  const zScale = 0.42;
  const wallH = state.booth.wallHeight;
  const raw = [
    rawIsoPoint(0, 0, 0, isoX, isoY, zScale),
    rawIsoPoint(state.booth.width, 0, 0, isoX, isoY, zScale),
    rawIsoPoint(state.booth.width, state.booth.depth, 0, isoX, isoY, zScale),
    rawIsoPoint(0, state.booth.depth, 0, isoX, isoY, zScale),
    rawIsoPoint(0, 0, wallH, isoX, isoY, zScale),
    rawIsoPoint(state.booth.width, 0, wallH, isoX, isoY, zScale),
    rawIsoPoint(state.booth.width, state.booth.depth, wallH, isoX, isoY, zScale),
    rawIsoPoint(0, state.booth.depth, wallH, isoX, isoY, zScale)
  ];
  const minX = Math.min(...raw.map((p) => p.x));
  const maxX = Math.max(...raw.map((p) => p.x));
  const minY = Math.min(...raw.map((p) => p.y));
  const maxY = Math.max(...raw.map((p) => p.y));
  const marginX = 70;
  const marginTop = 95;
  const marginBottom = 55;
  const scale3d = Math.min(
    (cw - marginX * 2) / Math.max(1, maxX - minX),
    (ch - marginTop - marginBottom) / Math.max(1, maxY - minY)
  );
  const offsetX = (cw - (maxX - minX) * scale3d) / 2 - minX * scale3d;
  const offsetY = marginTop - minY * scale3d;

  return {
    scale: scale3d,
    project(x, y, z = 0) {
      const rawPoint = rawIsoPoint(x, y, z, isoX, isoY, zScale);
      return { x: offsetX + rawPoint.x * scale3d, y: offsetY + rawPoint.y * scale3d };
    }
  };
}

function rawIsoPoint(x, y, z, isoX, isoY, zScale) {
  return { x: (x - y) * isoX, y: (x + y) * isoY - z * zScale };
}

function drawBoothWalls3d(ctx3, iso) {
  const sides = {
    top: [[0, 0], [state.booth.width, 0]],
    bottom: [[0, state.booth.depth], [state.booth.width, state.booth.depth]],
    left: [[0, 0], [0, state.booth.depth]],
    right: [[state.booth.width, 0], [state.booth.width, state.booth.depth]]
  };
  Object.entries(sides).forEach(([side, points]) => {
    if (side === state.booth.aisleSide) return;
    const isMainWall = side === state.booth.wallSide;
    drawWallSegment3d(ctx3, iso, points[0], points[1], isMainWall ? state.booth.wallHeight : Math.min(1200, state.booth.wallHeight), isMainWall);
  });
}

function drawWallSegment3d(ctx3, iso, a, b, height, isMainWall) {
  const p1 = iso.project(a[0], a[1], 0);
  const p2 = iso.project(b[0], b[1], 0);
  const p3 = iso.project(b[0], b[1], height);
  const p4 = iso.project(a[0], a[1], height);
  ctx3.fillStyle = isMainWall ? "#f8fbfa" : "#f2f4f3";
  polygon(ctx3, [p1, p2, p3, p4]);
  ctx3.strokeStyle = isMainWall ? "#73a990" : "#c9d0cf";
  ctx3.lineWidth = isMainWall ? 2 : 1;
  strokePolygon(ctx3, [p1, p2, p3, p4]);
}

function drawItem3d(ctx3, iso, item) {
  if (item.type === "wall") {
    drawWallPanelItem3d(ctx3, iso, item);
    return;
  }
  if (item.type === "spotlight") {
    drawSpotlightItem3d(ctx3, iso, item);
    return;
  }
  if (item.type === "power") {
    drawPowerOutletItem3d(ctx3, iso, item);
    return;
  }
  if (item.type === "chair") {
    drawChairItem3d(ctx3, iso, item);
    return;
  }
  if (item.type === "table" && !item.label.includes("展示台") && !item.height) {
    drawFoldingTableItem3d(ctx3, iso, item);
    return;
  }
  if (item.type === "bolda") {
    drawBoldaItem3d(ctx3, iso, item);
    return;
  }
  drawCounterItem3d(ctx3, iso, item);
}

function drawCounterItem3d(ctx3, iso, item) {
  const height = item.height || 700;
  drawSoftFootprintShadow(ctx3, iso, item, 0.2);
  drawBox3d(ctx3, iso, item.x, item.y, item.width, item.depth, height, {
    left: "#e9ece9",
    right: "#f5f6f3",
    top: "#ffffff",
    stroke: "rgba(54, 62, 62, 0.22)"
  });
}

function drawBoldaItem3d(ctx3, iso, item) {
  const code = getBoldaCode(item);
  if (code === "AS01") {
    drawBox3d(ctx3, iso, item.x, item.y, item.width, item.depth, item.height || 300, boldaBoxColors());
    return;
  }
  if (code === "SF03") {
    drawShelfStand3d(ctx3, iso, item);
    return;
  }
  drawSoftFootprintShadow(ctx3, iso, item, 0.18);
  drawBox3d(ctx3, iso, item.x, item.y, item.width, item.depth, item.height || 800, boldaBoxColors());
  if (code === "ED04") drawSteppedDisplay3d(ctx3, iso, item);
  if (code === "TB13") drawCubbyFace3d(ctx3, iso, item);
}

function boldaBoxColors() {
  return {
    left: "#e6e8e5",
    right: "#f2f4f1",
    top: "#ffffff",
    stroke: "rgba(54, 62, 62, 0.2)"
  };
}

function drawFoldingTableItem3d(ctx3, iso, item) {
  const topH = 700;
  drawSoftFootprintShadow(ctx3, iso, item, 0.16);
  drawBox3d(ctx3, iso, item.x, item.y, item.width, item.depth, 55, {
    left: "#e6e7e5",
    right: "#f5f5f2",
    top: "#ffffff",
    stroke: "rgba(45, 52, 52, 0.24)"
  }, topH);
  const legInsetX = Math.min(180, item.width * 0.12);
  const legInsetY = Math.min(130, item.depth * 0.18);
  [
    [item.x + legInsetX, item.y + legInsetY],
    [item.x + item.width - legInsetX, item.y + legInsetY],
    [item.x + legInsetX, item.y + item.depth - legInsetY],
    [item.x + item.width - legInsetX, item.y + item.depth - legInsetY]
  ].forEach(([lx, ly]) => drawLeg3d(ctx3, iso, lx, ly, topH));
}

function drawChairItem3d(ctx3, iso, item) {
  const seatH = 430;
  const seatW = item.width;
  const seatD = item.depth * 0.58;
  const seatX = item.x;
  const seatY = item.y + item.depth * 0.28;
  drawSoftFootprintShadow(ctx3, iso, item, 0.13);
  drawBox3d(ctx3, iso, seatX, seatY, seatW, seatD, 45, {
    left: "#e5e5df",
    right: "#f6f6f2",
    top: "#ffffff",
    stroke: "rgba(54, 62, 62, 0.2)"
  }, seatH);
  drawBox3d(ctx3, iso, item.x, item.y, item.width, 45, 360, {
    left: "#e5e5df",
    right: "#f4f4f0",
    top: "#ffffff",
    stroke: "rgba(54, 62, 62, 0.2)"
  }, seatH + 20);
  const legInset = Math.min(90, item.width * 0.18);
  [[seatX + legInset, seatY + 45], [seatX + seatW - legInset, seatY + 45], [seatX + legInset, seatY + seatD - 45], [seatX + seatW - legInset, seatY + seatD - 45]]
    .forEach(([lx, ly]) => drawLeg3d(ctx3, iso, lx, ly, seatH));
}

function drawShelfStand3d(ctx3, iso, item) {
  drawSoftFootprintShadow(ctx3, iso, item, 0.14);
  const h = item.height || 1490;
  const panelW = Math.min(item.width, 180);
  const px = item.x + item.width * 0.52;
  drawBox3d(ctx3, iso, px, item.y, panelW, item.depth, h, boldaBoxColors());
  for (let i = 1; i <= 4; i += 1) {
    const z = 180 + i * ((h - 260) / 4);
    drawBox3d(ctx3, iso, item.x, item.y + item.depth * 0.12, item.width * 0.78, item.depth * 0.5, 35, boldaBoxColors(), z);
  }
}

function drawSteppedDisplay3d(ctx3, iso, item) {
  const stepH = Math.min(180, (item.height || 1100) * 0.16);
  const rearY = item.y + item.depth * 0.52;
  drawBox3d(ctx3, iso, item.x, rearY, item.width, item.depth * 0.28, stepH, boldaBoxColors(), item.height || 800);
  drawBox3d(ctx3, iso, item.x, rearY + item.depth * 0.22, item.width, item.depth * 0.24, stepH, boldaBoxColors(), (item.height || 800) + stepH);
}

function drawCubbyFace3d(ctx3, iso, item) {
  const z = (item.height || 800) * 0.64;
  const y = item.y + item.depth;
  const p1 = iso.project(item.x + item.width * 0.12, y, z);
  const p2 = iso.project(item.x + item.width * 0.88, y, z);
  const p3 = iso.project(item.x + item.width * 0.88, y, z + 160);
  const p4 = iso.project(item.x + item.width * 0.12, y, z + 160);
  ctx3.save();
  ctx3.fillStyle = "rgba(180, 184, 178, 0.42)";
  polygon(ctx3, [p1, p2, p3, p4]);
  ctx3.strokeStyle = "rgba(54, 62, 62, 0.18)";
  strokePolygon(ctx3, [p1, p2, p3, p4]);
  const mid1 = iso.project(item.x + item.width * 0.5, y, z);
  const mid2 = iso.project(item.x + item.width * 0.5, y, z + 160);
  ctx3.beginPath();
  ctx3.moveTo(mid1.x, mid1.y);
  ctx3.lineTo(mid2.x, mid2.y);
  ctx3.stroke();
  ctx3.restore();
}

function drawPowerOutletItem3d(ctx3, iso, item) {
  const cx = item.x + item.width / 2;
  const cy = item.y + item.depth / 2;
  const nearWall = nearestHorizontalWall(item);
  const onWall = Math.abs(item.y) < 420 || Math.abs(item.y + item.depth - state.booth.depth) < 420;
  const y = onWall ? (nearWall === "top" ? 0 : state.booth.depth) : cy;
  const p = iso.project(cx, y, 220);
  ctx3.save();
  ctx3.fillStyle = "#ffffff";
  ctx3.strokeStyle = "#9a2f2f";
  ctx3.lineWidth = 1.5;
  roundedRectCanvas(ctx3, p.x - 12, p.y - 16, 24, 22, 4);
  ctx3.fill();
  ctx3.stroke();
  ctx3.fillStyle = "#c53333";
  roundedRectCanvas(ctx3, p.x - 7, p.y - 9, 3, 9, 1);
  ctx3.fill();
  roundedRectCanvas(ctx3, p.x + 4, p.y - 9, 3, 9, 1);
  ctx3.fill();
  ctx3.restore();
}

function drawBox3d(ctx3, iso, x, y, width, depth, height, colors, zBase = 0) {
  const base = [
    iso.project(x, y, zBase),
    iso.project(x + width, y, zBase),
    iso.project(x + width, y + depth, zBase),
    iso.project(x, y + depth, zBase)
  ];
  const top = [
    iso.project(x, y, zBase + height),
    iso.project(x + width, y, zBase + height),
    iso.project(x + width, y + depth, zBase + height),
    iso.project(x, y + depth, zBase + height)
  ];
  ctx3.save();
  ctx3.fillStyle = colors.left;
  polygon(ctx3, [base[0], base[1], top[1], top[0]]);
  ctx3.fillStyle = colors.right;
  polygon(ctx3, [base[1], base[2], top[2], top[1]]);
  ctx3.fillStyle = colors.top;
  polygon(ctx3, top);
  ctx3.strokeStyle = colors.stroke;
  ctx3.lineWidth = 1;
  strokePolygon(ctx3, top);
  strokePolygon(ctx3, [base[0], base[1], top[1], top[0]]);
  strokePolygon(ctx3, [base[1], base[2], top[2], top[1]]);
  ctx3.restore();
}

function drawLeg3d(ctx3, iso, x, y, height) {
  const top = iso.project(x, y, height);
  const bottom = iso.project(x, y, 0);
  ctx3.save();
  ctx3.strokeStyle = "#9ba09c";
  ctx3.lineWidth = 2;
  ctx3.beginPath();
  ctx3.moveTo(top.x, top.y);
  ctx3.lineTo(bottom.x, bottom.y);
  ctx3.stroke();
  ctx3.restore();
}

function drawSoftFootprintShadow(ctx3, iso, item, alpha) {
  const center = iso.project(item.x + item.width / 2, item.y + item.depth / 2, 0);
  const pxW = distance(iso.project(item.x, item.y, 0), iso.project(item.x + item.width, item.y, 0));
  const pxD = distance(iso.project(item.x, item.y, 0), iso.project(item.x, item.y + item.depth, 0));
  drawSoftShadow(ctx3, center.x, center.y + 7, Math.max(16, (pxW + pxD) * 0.24), Math.max(5, (pxW + pxD) * 0.055), alpha);
}
function getPreviewAssetSrc(item) {
  const base = "assets/furniture/preview-assets/";
  if (item.type === "person") return getChairForPerson(item) ? item.seatedImage : item.standingImage;
  if (item.type === "bolda") {
    const code = getBoldaCode(item);
    if (code) return `assets/bolda/preview-assets/${code}.png`;
  }
  if (item.type === "power") return "";
  if (item.type === "spotlight") return base + "spotlight-100w.png";
  if (item.type === "wall") return base + "sign-panel.png";
  if (item.type === "chair") return base + "chair.png";
  if (item.type === "fixture") {
    return item.label.includes("姿見") ? base + "sign-panel.png" : base + "counter-1500x600.png";
  }
  if (item.type === "table") {
    if (item.label.includes("展示台") || item.height) {
      if (item.width >= 1750 && item.depth >= 850) return base + "counter-1800x900.png";
      if (item.width >= 1750) return base + "counter-1800x600.png";
      if (item.depth >= 850) return base + "counter-1500x900.png";
      return base + "counter-1500x600.png";
    }
    return base + "table-long.png";
  }
  return "";
}

function loadPreviewAsset(src) {
  if (!previewAssetCache[src]) {
    const img = new Image();
    img.onload = () => {
      if (state.view === "preview3d") draw3dScene();
    };
    img.src = src;
    previewAssetCache[src] = img;
  }
  return previewAssetCache[src];
}

function drawImageAsset3d(ctx3, iso, item, src) {
  const img = loadPreviewAsset(src);
  if (!img.complete || !img.naturalWidth) return false;
  if (item.type === "wall") return drawWallImageAsset3d(ctx3, iso, item, img);
  if (item.type === "spotlight") return drawFloatingAsset3d(ctx3, iso, item, img, Math.max(360, state.booth.wallHeight - 260), 92);
  if (item.type === "power") return drawFloatingAsset3d(ctx3, iso, item, img, 180, 72);

  const height = item.height || defaultItemHeight(item);
  const cxMm = item.x + item.width / 2;
  const cyMm = item.y + item.depth / 2;
  const floorCenter = iso.project(cxMm, cyMm, 0);
  const topCenter = iso.project(cxMm, cyMm, height);
  const pxW = distance(iso.project(item.x, item.y, 0), iso.project(item.x + item.width, item.y, 0));
  const pxD = distance(iso.project(item.x, item.y, 0), iso.project(item.x, item.y + item.depth, 0));
  const assetW = Math.max(30, Math.min(170, (pxW + pxD) * 0.45));
  const aspect = img.naturalHeight / img.naturalWidth;
  const heightByZ = Math.abs(floorCenter.y - topCenter.y) + assetW * 0.22;
  const assetH = Math.max(28, Math.min(175, Math.max(assetW * aspect, heightByZ)));
  const x = floorCenter.x - assetW / 2;
  const y = floorCenter.y - assetH + 12;

  drawSoftShadow(ctx3, floorCenter.x, floorCenter.y + 8, Math.max(28, assetW * 0.42), Math.max(8, assetW * 0.1));
  ctx3.save();
  ctx3.shadowColor = "rgba(24, 32, 34, 0.20)";
  ctx3.shadowBlur = 14;
  ctx3.shadowOffsetY = 8;
  ctx3.drawImage(img, x, y, assetW, assetH);
  ctx3.restore();
  drawItem3dLabel(ctx3, item, floorCenter.x, y + assetH + 9);
  return true;
}

function drawWallImageAsset3d(ctx3, iso, item, img) {
  const height = item.height || inferWallPanelHeight(item);
  const zTop = Math.max(height + 120, state.booth.wallHeight - 120);
  const zBottom = Math.max(120, zTop - height);
  const wall = nearestHorizontalWall(item);
  const yMm = wall === "top" ? 0 : state.booth.depth;
  const left = iso.project(item.x, yMm, zBottom);
  const right = iso.project(item.x + item.width, yMm, zBottom);
  const topLeft = iso.project(item.x, yMm, zTop);
  const assetW = Math.max(68, distance(left, right));
  const assetH = Math.max(22, Math.abs(left.y - topLeft.y));
  const x = (left.x + right.x) / 2 - assetW / 2;
  const y = topLeft.y;
  ctx3.save();
  ctx3.shadowColor = "rgba(24, 32, 34, 0.18)";
  ctx3.shadowBlur = 8;
  ctx3.shadowOffsetY = 4;
  ctx3.drawImage(img, x, y, assetW, assetH);
  ctx3.restore();
  drawItem3dLabel(ctx3, item, x + assetW / 2, y - 8);
  return true;
}

function drawFloatingAsset3d(ctx3, iso, item, img, z, targetW) {
  const point = iso.project(item.x + item.width / 2, item.y + item.depth / 2, z);
  const aspect = img.naturalHeight / img.naturalWidth;
  const assetW = targetW;
  const assetH = assetW * aspect;
  ctx3.save();
  ctx3.shadowColor = "rgba(24, 32, 34, 0.18)";
  ctx3.shadowBlur = 10;
  ctx3.shadowOffsetY = 5;
  ctx3.drawImage(img, point.x - assetW / 2, point.y - assetH / 2, assetW, assetH);
  ctx3.restore();
  drawItem3dLabel(ctx3, item, point.x, point.y + assetH / 2 + 10);
  return true;
}

function drawSoftShadow(ctx3, x, y, rx, ry, alpha = 0.18) {
  ctx3.save();
  ctx3.fillStyle = `rgba(20, 24, 24, ${alpha})`;
  ctx3.beginPath();
  ctx3.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  ctx3.fill();
  ctx3.restore();
}

function drawItem3dLabel(ctx3, item, x, y) {
  return;
  ctx3.save();
  ctx3.fillStyle = "rgba(255,255,255,0.86)";
  ctx3.strokeStyle = "rgba(24,38,41,0.14)";
  const text = item.type === "spotlight" ? `${compactLabel(item.label)} ${item.watt || 0}W` : compactLabel(item.label);
  ctx3.font = "11px sans-serif";
  const w = Math.min(150, ctx3.measureText(text).width + 12);
  roundedRectCanvas(ctx3, x - w / 2, y - 12, w, 18, 6);
  ctx3.fill();
  ctx3.stroke();
  ctx3.fillStyle = "#172225";
  ctx3.textAlign = "center";
  ctx3.textBaseline = "middle";
  ctx3.fillText(text, x, y - 3);
  ctx3.restore();
}

function roundedRectCanvas(ctx3, x, y, width, height, radius) {
  ctx3.beginPath();
  ctx3.moveTo(x + radius, y);
  ctx3.lineTo(x + width - radius, y);
  ctx3.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx3.lineTo(x + width, y + height - radius);
  ctx3.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx3.lineTo(x + radius, y + height);
  ctx3.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx3.lineTo(x, y + radius);
  ctx3.quadraticCurveTo(x, y, x + radius, y);
}

function drawFloorGrid3d(ctx3, iso) {
  ctx3.save();
  ctx3.strokeStyle = "rgba(90, 92, 86, 0.16)";
  ctx3.lineWidth = 1;
  for (let x = 500; x < state.booth.width; x += 500) {
    const a = iso.project(x, 0, 0);
    const b = iso.project(x, state.booth.depth, 0);
    ctx3.beginPath();
    ctx3.moveTo(a.x, a.y);
    ctx3.lineTo(b.x, b.y);
    ctx3.stroke();
  }
  for (let y = 500; y < state.booth.depth; y += 500) {
    const a = iso.project(0, y, 0);
    const b = iso.project(state.booth.width, y, 0);
    ctx3.beginPath();
    ctx3.moveTo(a.x, a.y);
    ctx3.lineTo(b.x, b.y);
    ctx3.stroke();
  }
  ctx3.restore();
}

function distance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function drawFallbackItem3d(ctx3, iso, item) {
  if (item.type === "wall") {
    drawWallPanelItem3d(ctx3, iso, item);
    return;
  }
  if (item.type === "spotlight") {
    drawSpotlightItem3d(ctx3, iso, item);
    return;
  }
  const height = item.height || defaultItemHeight(item);
  const x1 = item.x;
  const y1 = item.y;
  const x2 = item.x + item.width;
  const y2 = item.y + item.depth;
  const base = [
    iso.project(x1, y1, 0),
    iso.project(x2, y1, 0),
    iso.project(x2, y2, 0),
    iso.project(x1, y2, 0)
  ];
  const top = [
    iso.project(x1, y1, height),
    iso.project(x2, y1, height),
    iso.project(x2, y2, height),
    iso.project(x1, y2, height)
  ];

  ctx3.fillStyle = shade(item.color, 0.82);
  polygon(ctx3, [base[0], base[1], top[1], top[0]]);
  ctx3.fillStyle = item.color;
  polygon(ctx3, [base[1], base[2], top[2], top[1]]);
  ctx3.fillStyle = shade(item.color, 1.08);
  polygon(ctx3, top);
  ctx3.strokeStyle = "rgba(0,0,0,.25)";
  strokePolygon(ctx3, top);
  strokePolygon(ctx3, [base[0], base[1], top[1], top[0]]);
  strokePolygon(ctx3, [base[1], base[2], top[2], top[1]]);

  if (item.type === "power") drawPowerMarker3d(ctx3, top);

  ctx3.strokeStyle = "rgba(0,0,0,.25)";
  ctx3.fillStyle = "#172225";
  ctx3.font = "11px sans-serif";
  const labelPoint = top[0];
  ctx3.fillText(compactLabel(item.label), labelPoint.x + 3, labelPoint.y - 5);
}

function drawWallPanelItem3d(ctx3, iso, item) {
  const height = item.height || inferWallPanelHeight(item);
  const zTop = Math.max(height, state.booth.wallHeight - 140);
  const zBottom = Math.max(0, zTop - height);
  const wall = nearestHorizontalWall(item);
  const y = wall === "top" ? 0 : state.booth.depth;
  const p1 = iso.project(item.x, y, zBottom);
  const p2 = iso.project(item.x + item.width, y, zBottom);
  const p3 = iso.project(item.x + item.width, y, zTop);
  const p4 = iso.project(item.x, y, zTop);

  ctx3.fillStyle = "#e9f7ef";
  polygon(ctx3, [p1, p2, p3, p4]);
  ctx3.strokeStyle = "#4f9c74";
  ctx3.lineWidth = 1.5;
  strokePolygon(ctx3, [p1, p2, p3, p4]);
  ctx3.fillStyle = "#194437";
  ctx3.font = "11px sans-serif";
  ctx3.fillText(compactLabel(item.label), p4.x + 4, p4.y - 5);
}

function drawSpotlightItem3d(ctx3, iso, item) {
  const cxMm = item.x + item.width / 2;
  const cyMm = item.y + item.depth / 2;
  const z = Math.max(300, state.booth.wallHeight - 260);
  const center = iso.project(cxMm, cyMm, z);
  const stem = iso.project(cxMm, cyMm, z + 120);
  ctx3.strokeStyle = "#6d5200";
  ctx3.lineWidth = 2;
  ctx3.beginPath();
  ctx3.moveTo(stem.x, stem.y);
  ctx3.lineTo(center.x, center.y);
  ctx3.stroke();

  ctx3.fillStyle = "#ffd45f";
  polygon(ctx3, [
    { x: center.x - 11, y: center.y - 7 },
    { x: center.x + 11, y: center.y - 7 },
    { x: center.x, y: center.y + 12 }
  ]);
  ctx3.strokeStyle = "#6d5200";
  strokePolygon(ctx3, [
    { x: center.x - 11, y: center.y - 7 },
    { x: center.x + 11, y: center.y - 7 },
    { x: center.x, y: center.y + 12 }
  ]);
  ctx3.fillStyle = "#172225";
  ctx3.font = "10px sans-serif";
  ctx3.fillText(`${item.watt || 0}W`, center.x + 10, center.y + 8);
}

function nearestHorizontalWall(item) {
  const itemCenterY = item.y + item.depth / 2;
  return itemCenterY <= state.booth.depth / 2 ? "top" : "bottom";
}

function drawSpotlightMarker3d(ctx3, top) {
  const cx = (top[0].x + top[2].x) / 2;
  const cy = (top[0].y + top[2].y) / 2;
  ctx3.fillStyle = "#6d5200";
  polygon(ctx3, [
    { x: cx - 7, y: cy - 7 },
    { x: cx + 7, y: cy - 7 },
    { x: cx, y: cy + 7 }
  ]);
}

function drawPowerMarker3d(ctx3, top) {
  const cx = (top[0].x + top[2].x) / 2;
  const cy = (top[0].y + top[2].y) / 2;
  ctx3.strokeStyle = "#9a2f2f";
  ctx3.lineWidth = 2;
  ctx3.beginPath();
  ctx3.arc(cx, cy, 7, 0, Math.PI * 2);
  ctx3.stroke();
}

function polygon(ctx3, points) {
  ctx3.beginPath();
  ctx3.moveTo(points[0].x, points[0].y);
  points.slice(1).forEach((p) => ctx3.lineTo(p.x, p.y));
  ctx3.closePath();
  ctx3.fill();
}

function strokePolygon(ctx3, points) {
  ctx3.beginPath();
  ctx3.moveTo(points[0].x, points[0].y);
  points.slice(1).forEach((p) => ctx3.lineTo(p.x, p.y));
  ctx3.closePath();
  ctx3.stroke();
}

function shade(hex, factor) {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.min(255, Math.round(((n >> 16) & 255) * factor));
  const g = Math.min(255, Math.round(((n >> 8) & 255) * factor));
  const b = Math.min(255, Math.round((n & 255) * factor));
  return `rgb(${r}, ${g}, ${b})`;
}

function defaultItemHeight(item) {
  if (item.type === "table") return 700;
  if (item.type === "fixture" && String(item.label || "").includes("姿見")) return 1700;
  if (item.type === "fixture" && String(item.label || "").includes("棚")) return 1400;
  if (item.type === "fixture") return 900;
  if (item.type === "chair") return 780;
  if (item.type === "wall") return inferWallPanelHeight(item);
  if (item.type === "spotlight") return 180;
  if (item.type === "power") return 180;
  return 800;
}

function buildImagePrompt() {
  const boldaRefs = getUsedBoldaReferences();
  const personRefs = getUsedPersonReferences();
  const boothPhotoReferences = realBoothReferenceImages.map((ref) => `${ref.label}: ${ref.path}`).join("; ");
  const items = state.items.map(buildPromptItemBlock).join("\n\n");
  const contacts = buildContactInstructions();
  const alignment = buildAlignmentInstructions();
  const camera = buildPromptCameraInstruction();
  const counts = buildPromptCountSummary();
  const references = boldaRefs.length
    ? `Attach and use these bolda shape and exact print-face images for the matching product codes:\n${boldaRefs.map((ref) => `- ${ref.name}: ${ref.path}; role: ${ref.role}${ref.printData ? `; source folder: ${ref.printData}` : ""}`).join("\n")}`
    : "No bolda reference images are used in this layout.";
  const peopleReferences = personRefs.length
    ? `Attach and use these exact character images without changing identity, clothing or costume:\n${personRefs.map((ref) => `- ${ref.name}: ${ref.path}; role: ${ref.role}`).join("\n")}`
    : "No people are specified in this layout. Do not add people.";
  const joint = isImfEgfPreset()
    ? `Joint booth split: Sannishimura uses 1.5 booths and Suzuki Megane uses 0.5 booth. Suzuki Megane is on the ${state.jointSide === "left" ? "left" : "right"} side. Preserve that allocation and do not move either company into the other area.`
    : "";
  return [
    "Use case: photorealistic-natural",
    "Asset type: interior-designer-quality exhibition booth proposal rendering",
    `Primary request: Create one photorealistic, buildable 3D rendering of the exact exhibition booth layout for ${state.eventName || "a trade show"}.`,
    "",
    "GEOMETRY PRIORITY",
    "Treat the attached 2D plan and every coordinate below as construction constraints, not inspiration. Establish the booth shell and all object volumes first, then add materials, graphics and products. Never improve the composition by moving, rotating, spreading, duplicating or resizing an object.",
    "All dimensions and coordinates below are millimetres.",
    `Booth shell: interior W${state.booth.width} x D${state.booth.depth}; main wall height H${state.booth.wallHeight}.`,
    `Plan coordinate system: origin X0 Y0 is the upper-left/back-left corner. X increases left-to-right. Y increases from the back edge toward the front/depth edge. Vertical height is Z, with floor Z0.`,
    `Main wall side: ${sideLabel(state.booth.wallSide)} (${sideEnglish(state.booth.wallSide)}). Fully open aisle side: ${sideLabel(state.booth.aisleSide)} (${sideEnglish(state.booth.aisleSide)}). The other non-aisle side panels may be H${Math.min(1200, state.booth.wallHeight)} unless the attached layout shows otherwise.`,
    `The customer-facing front of counters, tables and chairs points toward the ${sideEnglish(state.booth.aisleSide)} aisle.`,
    joint.trim(),
    "",
    "CAMERA AND OUTPUT",
    camera,
    "Use a 32-38mm full-frame equivalent lens. Keep vertical wall posts vertical, avoid fisheye distortion, fit the complete booth footprint inside the frame, and leave a small amount of exhibition hall context outside the aisle edge. Render at landscape 16:9 or 3:2, high detail, realistic scale and neutral white balance.",
    "",
    "REFERENCE IMAGE ROLES",
    "- 2D layout PNG: authoritative plan and object count. Match it exactly.",
    "- 3D preview PNG: authoritative booth orientation, wall/aisle relationship, object volumes and camera direction. It is not a texture reference.",
    `- Real-booth reference photographs (${boothPhotoReferences}): use only for hall atmosphere, lighting, floor, partitions, aluminium framing, shadows and realistic material finish. Never copy products, people, signs, furniture count or the old layout.`,
    `- Furniture reference image (${furnitureReferenceImage}): appearance of four-leg folding tables, white exhibition counters and relative W/D/H proportions.`,
    "- bolda assembled-shape images define geometry. Cropped print-face images define the exact visible artwork and must be applied only to the stated front/riser face.",
    "- Character images define the exact person appearance. Use the standing image for a free-standing person and the seated image only when the plan places that person on a chair.",
    "",
    "REAL-BOOTH MATERIAL AND MERCHANDISING STYLE",
    realBoothReferenceNotes.map((note) => `- ${note}`).join("\n"),
    "- Use white modular exhibition panels with slim aluminium posts, grey commercial carpet, clean overhead hall lighting, and soft contact shadows.",
    "- Keep every counter, table, shelf and riser empty unless a product or accessory is explicitly listed as its own placed object. Do not auto-populate surfaces.",
    "",
    `OBJECT COUNT CHECK: ${counts}. The final image must contain exactly these specified fixtures; do not omit or duplicate them.`,
    "",
    "PLACED OBJECT SPECIFICATION",
    items || "No movable objects placed.",
    "",
    references,
    peopleReferences,
    "",
    contacts,
    alignment,
    "",
    "BOLDA AND FURNITURE RULES",
    "- Render bolda products fully assembled as real white paper-board/cardboard counters or shelves. Never show flat development drawings, unfolded print sheets or generic substitute boxes.",
    "- Match ED04 as a W900 x D600 x H1100 three-level stepped display with exactly three usable horizontal display levels. Match TB13 as the two-cubby counter and TB05 as the W900 x D600 x H800 rectangular counter.",
    "- ED04 has three separate print themes. Keep Custom Fit, Screw Extraction & Hand Polishing, and Trial Frames & Measurement on their matching fixtures; never exchange or merge their panels.",
    "- A TB05 + AS01 composite is two real parts: one W900 x D600 x H800 TB05 base on floor Z0 and one W900 x D250 x H300 AS01 yokan-bar riser resting directly on the rear of its top at Z800. No air gap, no separate floor placement, total height H1100.",
    "- Preserve real width/depth/height proportions. W1500xD900 must visibly be 50% deeper than W1500xD600; W1800 must visibly be 20% wider than W1500 at the same camera depth.",
    "- Folding tables must have a full tabletop and four visible/supporting metal legs. Do not turn them into solid counters.",
    "- If matching print/artwork is supplied, wrap it only onto the correct visible front/side faces without changing the furniture geometry.",
    "",
    "FINAL VALIDATION BEFORE RENDERING",
    "- Confirm that every visible movable object appears in the placed-object specification. Delete any inferred merchandise, eyewear, tools, trays, bottles, people or decorative props.",
    "- Compare every footprint edge to the 2D plan and preserve touching/near-touching edges without artificial gaps.",
    "- Keep equal X or Y edges in straight rows. Keep all furniture level on floor Z0 and all wall equipment attached to its specified wall and Z range.",
    "- A plan marker for an outlet or spotlight is an annotation zone, not the physical size of the device. Never create a 300mm outlet box or a 350mm furniture block for a spotlight.",
    "- Signboards are shallow H300 wall-mounted panels at the stated Z elevation, not floor-to-ceiling wall panels.",
    "- Keep the specified aisle side fully open. Do not add doors, extra counters, unlisted people, decorative structures or ceiling truss. Preserve every explicitly listed person's position and standing/seated state.",
    "- Ensure spotlight wattage cues are legible where practical. Show outlets as outlet plates only, without wattage text. Render no unrelated text, logos or watermarks."
  ].filter(Boolean).join("\n");
}

function buildPromptItemBlock(item, index) {
  const x1 = Math.round(item.x);
  const y1 = Math.round(item.y);
  const x2 = Math.round(item.x + item.width);
  const y2 = Math.round(item.y + item.depth);
  const h = Math.round(item.height || defaultItemHeight(item));
  const vertical = getItemVerticalRange(item);
  const side = nearestBoothSide(item);
  const bolda = getBoldaDetail(item);
  const lines = [`${index + 1}. ${item.label} [${item.type}]`];

  if (["wall", "spotlight", "power"].includes(item.type)) {
    lines.push(`   - Plan annotation rectangle: X${x1}..${x2}, Y${y1}..${y2}. This rectangle locates the device; it is not the physical box size.`);
  } else {
    lines.push(`   - Exact floor footprint: X${x1}..${x2}, Y${y1}..${y2}; W${Math.round(item.width)} x D${Math.round(item.depth)}.`);
    lines.push(`   - Vertical extent: Z0..Z${h}; physical size W${Math.round(item.width)} x D${Math.round(item.depth)} x H${h}.`);
    lines.push(`   - Orientation: W dimension is parallel to X; D dimension is parallel to Y; front/customer face points ${sideEnglish(state.booth.aisleSide)} toward the aisle.`);
  }

  if (item.type === "wall") {
    lines.push(`   - Physical signboard: W${Math.round(item.width)} x D46 x H${h}; mount flat on the ${sideEnglish(side)} wall, vertical range Z${Math.round(vertical.bottom)}..Z${Math.round(vertical.top)}. It must remain a shallow panel and must not extend to the floor.`);
  } else if (item.type === "spotlight") {
    lines.push(`   - Physical fixture: compact wall-mounted arm spotlight, approximately W180 x arm projection D450 x head H180; mount on the ${sideEnglish(side)} wall with centre Z${Math.round(vertical.center)}; aim downward and inward toward the plan marker centre X${Math.round(item.x + item.width / 2)} Y${Math.round(item.y + item.depth / 2)}.`);
    lines.push(`   - Electrical cue: ${item.watt || 0}W must be visible; do not render a floor-standing object or tall column.`);
  } else if (item.type === "power") {
    lines.push(`   - Physical fixture: two-socket outlet plate approximately W150 x D35 x H180, mounted on the ${sideEnglish(side)} wall at Z${Math.round(vertical.bottom)}..Z${Math.round(vertical.top)} near plan marker centre X${Math.round(item.x + item.width / 2)} Y${Math.round(item.y + item.depth / 2)}.`);
    lines.push("   - Show the outlet plate only. Do not render wattage text, a wattage badge, or scale the outlet to the annotation rectangle.");
  } else if (item.type === "person") {
    const chair = getChairForPerson(item);
    if (chair) {
      lines.push(`   - Pose: seated naturally on ${chair.label} centred at X${Math.round(chair.x + chair.width / 2)} Y${Math.round(chair.y + chair.depth / 2)}; chair seat height about Z430; hips and knees bent near 90 degrees; both feet on floor; do not show the person standing or floating.`);
      lines.push(`   - Exact character reference: ${item.seatedImage}. Preserve the same face, glasses/helmet, clothing/costume and body appearance.`);
    } else {
      lines.push(`   - Pose: standing upright on floor Z0, real human height H1790mm. The W600 x D600 plan footprint is the occupied standing/turning zone, not a solid pedestal.`);
      lines.push(`   - Exact character reference: ${item.standingImage}. Preserve the same face, glasses/helmet, clothing/costume and body appearance.`);
    }
  } else {
    lines.push(`   - Appearance: ${buildItemVisualInstruction(item, bolda).replace(/^,\s*/, "") || "real exhibition furniture matching the stated dimensions"}.`);
  }
  if (bolda) {
    lines.push(`   - Matching assembled product reference: ${item.image?.split("/").pop() || bolda.code}; exact form: ${bolda.visual}.`);
    if (item.printTheme) lines.push(`   - Exact print theme: ${item.printTheme}. Do not replace, paraphrase or mix this theme with another fixture.`);
    if (item.frontTexture) lines.push(`   - Exact main front-face artwork: ${item.frontTexture}.`);
    if (item.tierTextures?.length) lines.push(`   - Exact stepped-riser artworks from lower to upper: ${item.tierTextures.join(", ")}.`);
    if (item.riserTexture) lines.push(`   - Exact AS01 riser artwork: ${item.riserTexture}; mount it on top of the TB05 base with no gap.`);
    if (bolda.printData) lines.push(`   - Matching artwork source: ${bolda.printData}. Apply only to correct visible faces.`);
  }
  return lines.join("\n");
}

function buildPromptCameraInstruction() {
  const w = state.booth.width;
  const d = state.booth.depth;
  const maxSize = Math.max(w, d);
  const z = Math.round(Math.max(state.booth.wallHeight * 1.08, maxSize * 0.46));
  const cameras = {
    bottom: { x: Math.round(w * 0.78), y: Math.round(d + maxSize * 1.15) },
    top: { x: Math.round(w * 0.22), y: Math.round(-maxSize * 1.15) },
    left: { x: Math.round(-maxSize * 1.15), y: Math.round(d * 0.78) },
    right: { x: Math.round(w + maxSize * 1.15), y: Math.round(d * 0.22) }
  };
  const camera = cameras[state.booth.aisleSide] || cameras.bottom;
  return `Camera is outside the ${sideEnglish(state.booth.aisleSide)} aisle, approximately plan X${camera.x} Y${camera.y} at Z${z}, looking toward target X${Math.round(w / 2)} Y${Math.round(d / 2)} Z${Math.round(Math.min(state.booth.wallHeight * 0.38, 900))}. Use an elevated front three-quarter viewpoint that clearly shows the floor plan and the main wall.`;
}

function buildPromptCountSummary() {
  const labels = { table: "tables/counters", fixture: "fixtures", bolda: "bolda fixtures", wall: "signboards", power: "outlets", spotlight: "spotlights", chair: "chairs", person: "people" };
  const counts = state.items.reduce((map, item) => {
    map[item.type] = (map[item.type] || 0) + 1;
    return map;
  }, {});
  return [`total ${state.items.length}`, ...Object.entries(counts).map(([type, count]) => `${labels[type] || type} ${count}`)].join(", ");
}

function sideEnglish(side) {
  return ({ top: "back/top (-Y)", bottom: "front/bottom (+Y)", left: "left (-X)", right: "right (+X)" })[side] || side;
}

function buildBoothSpecification() {
  return {
    schema: "booth-render-spec-v2",
    units: "mm",
    event: state.eventName,
    booth: {
      width: state.booth.width,
      depth: state.booth.depth,
      wallHeight: state.booth.wallHeight,
      wallSide: state.booth.wallSide,
      aisleSide: state.booth.aisleSide
    },
    coordinateSystem: { origin: "upper-left/back-left", x: "left-to-right", y: "back-to-aisle", z: "floor-up" },
    cameraInstruction: buildPromptCameraInstruction(),
    objects: state.items.map((item, index) => {
      const vertical = getItemVerticalRange(item);
      return {
        index: index + 1,
        label: item.label,
        type: item.type,
        planRectangle: { x1: Math.round(item.x), y1: Math.round(item.y), x2: Math.round(item.x + item.width), y2: Math.round(item.y + item.depth) },
        dimensions: { width: Math.round(item.width), depth: Math.round(item.depth), height: Math.round(item.height || defaultItemHeight(item)) },
        verticalRange: { z1: Math.round(vertical.bottom), z2: Math.round(vertical.top) },
        nearestWall: ["wall", "spotlight", "power"].includes(item.type) ? nearestBoothSide(item) : null,
        frontDirection: ["table", "fixture", "bolda", "chair", "person"].includes(item.type) ? state.booth.aisleSide : null,
        watt: item.watt || null,
        boldaCode: getBoldaCode(item) || null,
        printTheme: item.printTheme || null,
        printFaces: [item.frontTexture, ...(item.tierTextures || []), item.riserTexture].filter(Boolean),
        personPose: item.type === "person" ? (getChairForPerson(item) ? "seated" : "standing") : null,
        standingImage: item.standingImage || null,
        seatedImage: item.seatedImage || null,
        referenceImage: item.image || null
      };
    })
  };
}

function buildItemVisualInstruction(item, bolda) {
  if (item.type === "person") return `, visual form: the exact referenced 1790mm-tall character, ${getChairForPerson(item) ? "naturally seated on the overlapping chair" : "standing upright on the floor"}`;
  if (bolda) return `, visual form: assembled bolda fixture, ${bolda.visual}`;
  if (item.type === "table" && String(item.label || "").includes("展示台")) {
    return ", visual form: display counter/plinth with the exact footprint proportions and H700mm height; a W1500xD900 stand must look deeper than W1500xD600, and W1800 stands must look wider than W1500 stands";
  }
  if (item.type === "table") {
    return ", visual form: real rectangular table/counter with the exact width and depth proportions, not a generic cube";
  }
  if (item.type === "fixture") {
    return ", visual form: real display fixture with the exact width, depth and height proportions, not the same generic box as other fixtures";
  }
  return "";
}
function getUsedBoldaReferences() {
  const refs = new Map();
  state.items
    .filter((item) => item.type === "bolda" && item.image)
    .forEach((item) => {
      const detail = getBoldaDetail(item);
      const add = (path, role) => {
        if (!path || refs.has(path)) return;
        refs.set(path, { name: path.split("/").pop(), path, label: item.label, role, visual: detail?.visual || "", printData: detail?.printData || "" });
      };
      add(item.image, `assembled blank shape for ${item.label}`);
      add(item.frontTexture, `exact printed main front face for ${item.printTheme || item.label}`);
      (item.tierTextures || []).forEach((path, index) => add(path, `exact printed ED04 ${index === 0 ? "lower" : "upper"} riser face for ${item.printTheme}`));
      add(item.riserTexture, `exact printed AS01 yokan-bar front face mounted on the TB05 base for ${item.printTheme}`);
    });
  return [...refs.values()];
}

function getUsedPersonReferences() {
  const refs = new Map();
  state.items.filter((item) => item.type === "person").forEach((item) => {
    [
      [item.standingImage, `exact standing appearance for ${item.label}, physical height 1790mm`],
      [item.seatedImage, `exact seated appearance for ${item.label}, use only when placed on a chair`]
    ].forEach(([path, role]) => {
      if (path && !refs.has(path)) refs.set(path, { name: path.split("/").pop(), path, label: item.label, role });
    });
  });
  return [...refs.values()];
}

function getBoldaCode(item) {
  if (item.boldaCode && boldaDetails[item.boldaCode]) return item.boldaCode;
  const text = `${item.label || ""} ${item.image || ""}`;
  return Object.keys(boldaDetails).find((code) => text.includes(code)) || "";
}

function getBoldaDetail(item) {
  return boldaDetails[getBoldaCode(item)] || null;
}

function renderFurnitureImageReferences() {
  const wrap = $("furnitureImageRefs");
  if (!wrap) return;
  wrap.innerHTML = `
    <h3>机・展示台 参考画像</h3>
    <p>GPT image 2.0で画像生成する時は、この生成済み参考画像を一緒に添付してください。机は4本脚、展示台は白い展示会用カウンターとして扱います。</p>
    <img src="${escapeHtml(furnitureReferenceImage)}" alt="展示会用の机と展示台のGPT image 2.0生成参考画像">
  `;
}
function renderBoldaImageReferences() {
  const wrap = $("boldaImageRefs");
  if (!wrap) return;
  const refs = getUsedBoldaReferences();
  const personRefs = getUsedPersonReferences();
  if (!refs.length && !personRefs.length) {
    wrap.innerHTML = `<h3>生成参照画像</h3><p>配置中のbolda什器・人物はありません。</p>`;
    return;
  }
  wrap.innerHTML = `
    <h3>bolda・人物参照画像</h3>
    <p>GPT image 2.0で画像生成する時は、形状画像、実印刷面、人物画像をプロンプトと一緒に添付してください。</p>
    <div class="bolda-ref-grid">
      ${refs.map((ref) => `
        <figure>
          <img src="${escapeHtml(ref.path)}" alt="${escapeHtml(ref.label)}">
          <figcaption>${escapeHtml(ref.label)}<br>${escapeHtml(ref.role)}<br>${escapeHtml(ref.name)}</figcaption>
        </figure>
      `).join("")}
      ${personRefs.map((ref) => `
        <figure>
          <img src="${escapeHtml(ref.path)}" alt="${escapeHtml(ref.label)}">
          <figcaption>${escapeHtml(ref.label)}<br>${escapeHtml(ref.role)}</figcaption>
        </figure>
      `).join("")}
    </div>
  `;
}

function renderRealBoothReferences() {
  const wrap = $("realBoothRefs");
  if (!wrap) return;
  wrap.innerHTML = `
    <h3>実ブース参考写真</h3>
    <p>共有フォルダーに提出済みの実画像を参照素材として同梱しています。写真内の商品や旧レイアウトは再現せず、会場環境と素材感だけに使います。</p>
    <div class="real-booth-reference-grid">
      ${realBoothReferenceImages.map((ref) => `
        <figure>
          <img src="${escapeHtml(ref.path)}" alt="${escapeHtml(ref.label)}">
          <figcaption><strong>${escapeHtml(ref.label)}</strong><br>${escapeHtml(ref.role)}</figcaption>
        </figure>
      `).join("")}
    </div>
    <ul>
      ${realBoothReferencePolicyJa.map((note) => `<li>${escapeHtml(note)}</li>`).join("")}
    </ul>
  `;
}

function downloadLayoutPng() {
  downloadDataUrl(createHighResolutionLayoutDataUrl(), fileBaseName("layout") + ".png");
}

async function download3dPng() {
  const button = $("download3dPngBtn");
  const originalLabel = button?.textContent || "3DプレビューPNG";
  if (button) {
    button.disabled = true;
    button.textContent = "人物・印刷素材を準備中...";
  }
  try {
    const dataUrl = await createHighResolution3dDataUrl();
    downloadDataUrl(dataUrl, fileBaseName("3d-preview") + ".png");
  } finally {
    if (button) {
      button.disabled = false;
      button.textContent = originalLabel;
    }
  }
}

function downloadPromptTxt() {
  const prompt = $("imagePrompt").value || buildImagePrompt();
  downloadBlob(prompt, fileBaseName("prompt") + ".txt", "text/plain;charset=utf-8");
}

function downloadSpecJson() {
  downloadBlob(JSON.stringify(buildBoothSpecification(), null, 2), fileBaseName("dimensions") + ".json", "application/json;charset=utf-8");
}

async function createHighResolution3dDataUrl() {
  draw3dScene();
  await waitForThreeAssets();
  if (!threePreview?.scene) return preview3dCanvas.toDataURL("image/png");
  const renderer = threePreview.renderer;
  const camera = threePreview.camera;
  renderer.setPixelRatio(1);
  renderer.setSize(2560, 1620, false);
  camera.aspect = 2560 / 1620;
  camera.updateProjectionMatrix();
  renderer.render(threePreview.scene, camera);
  const dataUrl = preview3dCanvas.toDataURL("image/png");
  renderThreeScene();
  return dataUrl;
}

async function downloadCodexPack() {
  drawCanvas();
  const prompt = $("imagePrompt").value || buildImagePrompt();
  const layoutData = createHighResolutionLayoutDataUrl();
  const previewData = await createHighResolution3dDataUrl();
  const boldaRefs = getUsedBoldaReferences();
  const personRefs = getUsedPersonReferences();
  const specification = JSON.stringify(buildBoothSpecification(), null, 2);
  const html = `<!doctype html>
<html lang="ja">
<head>
  <meta charset="utf-8">
  <title>${escapeHtml(state.eventName || "展示ブース")} Codex用生成資料</title>
  <style>
    body { font-family: Arial, "Yu Gothic", sans-serif; margin: 24px; color: #172225; }
    h1, h2 { margin: 0 0 12px; }
    section { margin: 0 0 28px; }
    pre { white-space: pre-wrap; border: 1px solid #d8e0e2; padding: 12px; border-radius: 8px; background: #f7f9f9; }
    img { max-width: 100%; border: 1px solid #d8e0e2; border-radius: 8px; background: #fff; }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 12px; }
    figure { margin: 0; }
    figcaption { font-size: 12px; color: #536164; margin-top: 4px; }
  </style>
</head>
<body>
  <h1>${escapeHtml(state.eventName || "展示ブース")} Codex用生成資料</h1>
  <section>
    <h2>使い方</h2>
    <p>Codexへ貼る時は、このHTML、配置図PNG、3DプレビューPNG、表示されているbolda画像、今回送った実ブース写真をまとめて添付してください。プロンプトは下の全文を使います。</p>
  </section>
  <section>
    <h2>生成プロンプト</h2>
    <pre>${escapeHtml(prompt)}</pre>
  </section>
  <section>
    <h2>機械可読 寸法・座標仕様JSON</h2>
    <pre>${escapeHtml(specification)}</pre>
  </section>
  <section>
    <h2>配置図PNG</h2>
    <img src="${layoutData}" alt="2D layout">
  </section>
  <section>
    <h2>3DプレビューPNG</h2>
    <img src="${previewData}" alt="3D preview">
  </section>
  <section>
    <h2>bolda参照画像</h2>
    <div class="grid">
      ${boldaRefs.map((ref) => `
        <figure>
          <img src="${escapeHtml(absoluteAssetUrl(ref.path))}" alt="${escapeHtml(ref.label)}">
          <figcaption>${escapeHtml(ref.label)} / ${escapeHtml(ref.role)} / ${escapeHtml(ref.name)}</figcaption>
        </figure>
      `).join("") || "<p>配置中のbolda什器はありません。</p>"}
    </div>
  </section>
  <section>
    <h2>人物参照画像</h2>
    <div class="grid">
      ${personRefs.map((ref) => `
        <figure>
          <img src="${escapeHtml(absoluteAssetUrl(ref.path))}" alt="${escapeHtml(ref.label)}">
          <figcaption>${escapeHtml(ref.label)} / ${escapeHtml(ref.role)}</figcaption>
        </figure>
      `).join("") || "<p>配置中の人物はありません。</p>"}
    </div>
  </section>
  <section>
    <h2>実ブース参考写真（環境・素材感のみ）</h2>
    <div class="grid">
      ${realBoothReferenceImages.map((ref) => `
        <figure>
          <img src="${escapeHtml(absoluteAssetUrl(ref.path))}" alt="${escapeHtml(ref.label)}">
          <figcaption>${escapeHtml(ref.label)} / ${escapeHtml(ref.role)}</figcaption>
        </figure>
      `).join("")}
    </div>
    <ul>${realBoothReferencePolicyJa.map((note) => `<li>${escapeHtml(note)}</li>`).join("")}</ul>
  </section>
</body>
</html>`;
  downloadBlob(html, fileBaseName("codex-pack") + ".html", "text/html;charset=utf-8");
}

function fileBaseName(kind) {
  const event = (state.eventName || "booth").replace(/[\\/:*?"<>|]/g, "_").replace(/\s+/g, "_");
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  return `${event}_${kind}_${date}`;
}

function absoluteAssetUrl(path) {
  try {
    return new URL(path, window.location.href).href;
  } catch {
    return path;
  }
}

function downloadDataUrl(dataUrl, filename) {
  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = filename;
  document.body.append(a);
  a.click();
  a.remove();
}

function downloadBlob(content, filename, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  downloadDataUrl(url, filename);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function buildContactInstructions() {
  const closePairs = [];
  const tolerance = 80;
  const layoutItems = state.items.filter(isFurnitureForImageAdjacency);
  for (let i = 0; i < layoutItems.length; i += 1) {
    for (let j = i + 1; j < layoutItems.length; j += 1) {
      const a = layoutItems[i];
      const b = layoutItems[j];
      const xOverlap = rangesOverlap(a.x, a.x + a.width, b.x, b.x + b.width, tolerance);
      const yOverlap = rangesOverlap(a.y, a.y + a.depth, b.y, b.y + b.depth, tolerance);
      const rightTouch = Math.abs((a.x + a.width) - b.x) <= tolerance && yOverlap;
      const leftTouch = Math.abs((b.x + b.width) - a.x) <= tolerance && yOverlap;
      const bottomTouch = Math.abs((a.y + a.depth) - b.y) <= tolerance && xOverlap;
      const topTouch = Math.abs((b.y + b.depth) - a.y) <= tolerance && xOverlap;
      if (rightTouch) closePairs.push(`${a.label} touches ${b.label} side-by-side with no gap`);
      if (leftTouch) closePairs.push(`${b.label} touches ${a.label} side-by-side with no gap`);
      if (bottomTouch) closePairs.push(`${a.label} touches ${b.label} front-to-back with no gap`);
      if (topTouch) closePairs.push(`${b.label} touches ${a.label} front-to-back with no gap`);
    }
  }
  if (!closePairs.length) {
    return "Adjacency: no touching objects detected. Still preserve all coordinate spacing exactly.";
  }
  return `Adjacency that must be preserved:\n${closePairs.map((line) => `- ${line}`).join("\n")}`;
}

function isFurnitureForImageAdjacency(item) {
  return ["table", "fixture", "bolda", "chair"].includes(item.type);
}

function buildAlignmentInstructions() {
  const furniture = state.items.filter(isFurnitureForImageAdjacency);
  const lines = [];
  const groups = [
    groupByCloseValue(furniture, (item) => item.y, "back"),
    groupByCloseValue(furniture, (item) => item.y + item.depth, "front"),
    groupByCloseValue(furniture, (item) => item.x, "left"),
    groupByCloseValue(furniture, (item) => item.x + item.width, "right")
  ].flat();
  groups
    .filter((group) => group.items.length >= 3)
    .forEach((group) => {
      const labels = group.items.map((item) => item.label).join(", ");
      if (group.axis === "front") lines.push(`- ${labels} share the same front edge around Y${Math.round(group.value)}mm; render them as one clean straight row.`);
      if (group.axis === "back") lines.push(`- ${labels} share the same back edge around Y${Math.round(group.value)}mm; keep their rear line straight.`);
      if (group.axis === "left") lines.push(`- ${labels} share the same left edge around X${Math.round(group.value)}mm; keep them vertically aligned.`);
      if (group.axis === "right") lines.push(`- ${labels} share the same right edge around X${Math.round(group.value)}mm; keep them vertically aligned.`);
    });
  if (!lines.length) return "";
  return `Alignment that must be preserved:\n${[...new Set(lines)].join("\n")}`;
}

function groupByCloseValue(items, valueFn, axis) {
  const tolerance = 80;
  const sorted = items
    .map((item) => ({ item, value: valueFn(item) }))
    .sort((a, b) => a.value - b.value);
  const groups = [];
  sorted.forEach((entry) => {
    const current = groups[groups.length - 1];
    if (current && Math.abs(current.value - entry.value) <= tolerance) {
      current.items.push(entry.item);
      current.value = (current.value * (current.items.length - 1) + entry.value) / current.items.length;
    } else {
      groups.push({ value: entry.value, items: [entry.item] });
    }
  });
  return groups.map((group) => ({ ...group, axis }));
}

function rangesOverlap(a1, a2, b1, b2, tolerance = 0) {
  return Math.max(a1, b1) <= Math.min(a2, b2) + tolerance;
}

function copyImagePrompt() {
  const prompt = $("imagePrompt").value || buildImagePrompt();
  navigator.clipboard?.writeText(prompt);
}
