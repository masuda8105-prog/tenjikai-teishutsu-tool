const Domain = window.BoothDomain;
if (!Domain) throw new Error("BoothDomain failed to load");

const AUTOSAVE_KEY = "booth-layout-tool-v9";
const PREVIOUS_AUTOSAVE_KEYS = ["booth-layout-tool-v8", "booth-layout-tool-v7", "booth-layout-tool-v6", "booth-layout-tool-v5", "booth-layout-tool-v4", "booth-layout-tool-v3", "booth-layout-tool"];

const presets = {
  wof: { label: "WOF 東京 2コマ", eventName: "WOF 東京 2コマ", width: 5940, depth: 2500, wallHeight: 2400, wallSide: "top", aisleSide: "bottom" },
  imf: { label: "IMF 大阪秋 2コマ", eventName: "IMF 大阪秋 2コマ", width: 9000, depth: 4500, wallHeight: 2100, wallSide: "top", aisleSide: "bottom" },
  egf: { label: "EGF 大阪春 2コマ", eventName: "EGF 大阪春 2コマ", width: 6000, depth: 3600, wallHeight: 2100, wallSide: "top", aisleSide: "bottom" },
  jex: { label: "JEX 東京 2階装飾・2小間", eventName: "JEX 東京 2階装飾・2小間", width: 8000, depth: 2000, wallHeight: 2100, heightLimitMm: 2700, floorLoadKgPerM2: 1000, wallSide: "top", aisleSide: "bottom", sideWallHeightMm: 900, sideReturnDepthMm: 990, wallPanelCount: 8, wallPanelWidthMm: 990, wallColorHex: "#343434", wallFrameColorHex: "#111111" },
  neotokyo: { label: "NEO TOKYO 2026 2コマ・Plan A", eventName: "NEO TOKYO EYEWEAR SHOW 2026", width: 6000, depth: 2700, wallHeight: 0, heightLimitMm: 2400, floorLoadKgPerM2: 500, wallSide: "top", aisleSide: "bottom", spaceOnly: true, plannedBackPanelWidthMm: 6000, plannedBackPanelHeightMm: 2400, plannedBackPanelThicknessMm: 50, plannedBackPanelStatus: "provisional-user-request" },
  wide: { label: "横長 2小間", eventName: "横長 2小間", width: 6000, depth: 3000, wallHeight: 2400, wallSide: "top", aisleSide: "bottom" },
  deep: { label: "奥行き広め", eventName: "奥行き広め", width: 3000, depth: 4500, wallHeight: 2400, wallSide: "top", aisleSide: "bottom" },
  custom: { label: "自由入力", eventName: "自由入力", width: 3000, depth: 3000, wallHeight: 2400, wallSide: "top", aisleSide: "bottom" }
};

const jexRuleNote = "JEX 2階レンタル装飾 シンプルパッケージ・2小間: W8000 x D2000、黒色壁面システムパネルW990 x H2100を8枚、外側の袖壁H900、黒布巻きテーブルW1500 x D600 x H700を2台。床面カーペットと電気は付属しません。装飾・展示物はH2700以下、天井構造不可、床アンカー不可、床耐荷重1000kg/㎡。電源・照明・追加備品は申込確定後に個別配置してください。根拠: JEX出展案内 p.7-11、出展要項、2階装飾2小間。";
const imfRuleNote = "IMF 2コマ: W9000 x D4500 x H2100。サンニシムラ1.5コマ（W6750）、鈴木眼鏡様0.5コマ（W2250）の共同出店。電気使用は1.5kWまで事務局負担、1.5kW超の電気使用料および小間内配線工事・コンセント等は出展社負担。装飾物の高さは2.1m以下、装飾は小間内、通路側への突出は禁止。";
const egfRuleNote = "EGF 2コマ: Aタイプ1コマ W3000 x D3600 x H2100を2コマ運用として W6000 x D3600 x H2100。サンニシムラ1.5コマ、鈴木眼鏡様0.5コマの共同出店。電気使用は1.5kW 100Vまでは事務局負担、1.5kW超の電気使用料およびコンセント等の小間内配線工事は出展社負担。";
const wofRuleNote = "WOF 2小間 ブースプランA: 間口W5940 x 奥行D2500 x 高さH2400。標準装備: 背面W5940 x H2400オクタパネル、袖面W990 x H2400オクタパネル1枚、W990 x H1200オクタパネル1枚、展示台W1500 x D600 x H700を4台、イス4脚、サインパネルW1500 x H300を1枚。";
const neoTokyoRuleNote = "NEO TOKYO EYEWEAR SHOW 2026 出展マニュアル確認済み: 1コマW3000 x D2700mm（コマ位置により変形あり）の2コマ横連結としてW6000 x D2700mm、公式引渡しはスペース渡し、装飾高上限H2400mm、床積載荷重500kg/㎡。申込予定はPlan A（1コマ一式）1セット: 商品展示テーブルW1500 x D750 x H830を2台、商談テーブルW1000 x D600 x H730を1台、椅子4脚、スタンドライト1SET、電源1SET。追加レンタル予定は展示テーブルD W1500 x D750 x H820を3台。ユーザー指定により自社装飾の全幅背面パネルW6000 x H2400 x D50を計画表示し、共通アイテムの壁面吊り下げ看板W1400 x H500 x D20を背面中央へ配置する。ただし背面パネルの施工方式・分割・厚みD50は資料未確認の仮設定で、施工会社図面受領後に確定すること。椅子・ライト・電源は外形寸法が資料にないため一覧だけに記録し、平面位置・3D形状は未推測。根拠: 【NEO TOKYO】/【2026】/NEOTOKYO出展マニュアル2026_FIX.pdf p.17-20。";

const rawFixtureMasters = [
  { type: "fixture", label: "常設備品（名称を編集）", width: 900, depth: 450, height: 900, color: "#77a7d9" },
  { type: "fixture", label: "レンタル備品（名称を編集）", width: 900, depth: 450, height: 900, color: "#77a7d9" },
  { type: "table", label: "長机", width: 1800, depth: 600, color: "#f2b84b" },
  { type: "table", label: "受付机", width: 1200, depth: 600, color: "#f2b84b" },
  { type: "table", label: "展示台 W1500xD600", width: 1500, depth: 600, height: 700, color: "#f2b84b" },
  { type: "table", label: "展示台 W1500xD750xH820", width: 1500, depth: 750, height: 820, color: "#f2b84b" },
  { type: "table", masterId: "JEX-2F-TABLE-BLACK-1500", label: "JEX 2F付属 会議テーブル（黒布巻き） W1500xD600xH700", width: 1500, depth: 600, height: 700, color: "#252525", material: "黒布巻き", dimensionLocked: true, dimensionSource: "JEX出展案内 p.10-11 / 2Fシンプルパッケージ2小間", model3d: { kind: "parametric-official-envelope", accuracy: "verified-envelope/package-reference" }, setupInfo: { status: "reference-source", instructions: ["2小間で2台付属", "黒布巻き", "配置位置は初期案。提出前に確定"] } },
  { type: "table", masterId: "NEO-PLAN-A-DISPLAY-1500", label: "NEO Plan A 商品展示テーブル W1500xD750xH830", width: 1500, depth: 750, height: 830, color: "#f2b84b", material: "資料に材質記載なし", dimensionLocked: true, dimensionSource: "NEOTOKYO出展マニュアル2026_FIX.pdf p.20 / Plan A" },
  { type: "table", masterId: "NEO-PLAN-A-MEETING-1000", label: "NEO Plan A 商談テーブル W1000xD600xH730", width: 1000, depth: 600, height: 730, color: "#e6a93e", material: "資料に材質記載なし", dimensionLocked: true, dimensionSource: "NEOTOKYO出展マニュアル2026_FIX.pdf p.20 / Plan A" },
  { type: "table", masterId: "NEO-RENTAL-D-1500", label: "NEO レンタル展示テーブルD W1500xD750xH820", width: 1500, depth: 750, height: 820, color: "#e6b65b", material: "ツヤありホワイト（出展マニュアル記載）", dimensionLocked: true, dimensionSource: "NEOTOKYO出展マニュアル2026_FIX.pdf p.21 / レンタル備品D" },
  { type: "product", productCategory: "gacha-machine", productCode: "A0002", masterId: "AMUZU-A0002", label: "ガチャコップ 白 メダル仕様 A0002", width: 240, depth: 370, height: 440, weightKg: 5, color: "#eef1ef", material: "ABS外装、鉄、アクリル、アルミ、塩ビ、ダイキャスト、ポリアセタール樹脂（公式記載）", dimensionLocked: true, dimensionSource: "あミューズ A0002公式商品ページ / 本体サイズW240×D370×H440mm", sourceUrl: "https://www.a-muzu.com/category/GACHA_MACHINE_001/A0002.html", surfacePlaceable: true, model3d: { kind: "parametric-official-envelope", accuracy: "verified-envelope/reference-page-detail" }, setupInfo: { status: "official-source", instructions: ["卓上設置タイプ", "電源不要", "約5kg", "A0007設置時は公式公称高さ約530mmを使用"] } },
  { type: "product", productCategory: "gacha-stand", productCode: "A0007", masterId: "AMUZU-A0007", label: "ガチャコップ専用 簡易卓上台 白 A0007", width: 250, depth: 315, height: 100, color: "#f6f4ec", material: "紙製（公式記載）", dimensionLocked: true, dimensionSource: "あミューズ A0007公式商品ページ / 組立後W250×D315×H100mm", sourceUrl: "https://www.a-muzu.com/item/A0007.html", surfacePlaceable: true, supportSurface: true, model3d: { kind: "parametric-official-envelope", accuracy: "verified-envelope/reference-page-detail" }, productPlacementPositions: [{ itemMasterId: "AMUZU-A0002", zOffsetMm: 90, allowOverhang: true, source: "A0007公式記載のマシン設置時高さ約530mm - A0002本体H440mm" }], setupInfo: { status: "official-source", instructions: ["カプセル受けを含む奥行315mm", "A0002との組合せ時は公称全高約530mm"] } },
  { type: "product", productCategory: "capsule-recovery-box", productCode: "E1237", masterId: "AMUZU-E1237", label: "簡易カプセル回収ボックス E1237", width: 275, depth: 275, height: 460, color: "#d4a65d", material: "段ボール（公式記載）", dimensionLocked: true, dimensionSource: "あミューズ E1237公式商品ページ / 組立後W275×D275×H460mm", sourceUrl: "https://www.a-muzu.com/item/E1237.html", surfacePlaceable: false, model3d: { kind: "parametric-official-envelope", accuracy: "verified-envelope/reference-page-detail" }, setupInfo: { status: "official-source", instructions: ["回収口直径約85mm", "対応カプセル75mmまで", "床置き運用"] } },
  { type: "product", productCategory: "aluminum-pegboard", productCode: "B0897LVM4J", masterId: "AMAZON-B0897LVM4J", label: "アルミ有孔ボード シルバー P25 W450xH450xT1.6", width: 450, depth: 1.6, height: 450, color: "#c4c7c6", material: "アルミ・シルバー", dimensionLocked: true, dimensionSource: "Amazon.co.jp ASIN B0897LVM4J / 450×450×1.6mm・穴間ピッチ25mm・穴径5mm", sourceUrl: "https://www.amazon.co.jp/dp/B0897LVM4J", image: "assets/images/products/aluminum-pegboard-b0897lvm4j.jpg", surfacePlaceable: true, visibilityRole: "product", model3d: { kind: "parametric-official-envelope", accuracy: "verified-sheet-envelope/reference-page-detail" }, setupInfo: { status: "official-source", instructions: ["机上で縦置き", "板単体T1.6mm", "スタンド・固定具は商品ページ寸法に含まれないため別途用意し、固定方法を設営前に確認", "穴間ピッチ25mm・穴径5mm"] } },
  { type: "product", productCategory: "mist-bottle", productCode: "1064", masterId: "SANNI-1064", label: "メガネミスト No.1064（全体外形 要実測）", width: 90, depth: 60, height: 225, color: "#17356f", material: "容器・トリガー材質は未登録", dimensionLocked: false, dimensionAccuracy: "partial-verified", dimensionSource: "IB-300SN印刷範囲図で容器本体φ54.7×H165.2mmを確認。トリガー込みW90×D60×H225mmは展示計画用の暫定外形で、現物実測が必要", catalogReference: "2026/【新製品】/【No.1064】メガネミスト / No.1064チラシ・IB-300SN印刷範囲", image: "assets/products/mist-1064.png", surfacePlaceable: true, visibilityRole: "product", model3d: { kind: "parametric-catalog-reference", accuracy: "verified-bottle-body/provisional-trigger-envelope" }, setupInfo: { status: "reference-source", instructions: ["容量300mL", "机上展示", "トリガー込み全外形を現物実測後に確定"] } },
  { type: "product", productCategory: "frame-heater-169", productCode: "169", masterId: "SANNI-169", label: "フレームヒーター No.169 クリーム", width: 125, depth: 125, height: 200, color: "#e4d5ad", material: "カタログに材質記載なし", dimensionLocked: true, dimensionSource: "サンニシムラ総合カタログ2025-2027 p.202 / 底の直径125×H200mm", catalogReference: "総合カタログ2025-2027 p.202", image: "assets/products/heater-169.png", surfacePlaceable: true, watt: 380, visibilityRole: "product", model3d: { kind: "parametric-catalog-reference", accuracy: "verified-envelope/catalog-photo-detail" }, setupInfo: { status: "catalog-source", instructions: ["100V 50/60Hz", "消費電力380W", "水滴を熱源へ落とさない"] } },
  { type: "product", productCategory: "frame-heater-767", productCode: "767", masterId: "SANNI-767", label: "サーモレックス No.767", width: 185, depth: 160, height: 160, color: "#e9eceb", material: "カタログに材質記載なし", dimensionLocked: true, dimensionSource: "サンニシムラ総合カタログ2025-2027 p.203 / W185×D160×H160mm", catalogReference: "総合カタログ2025-2027 p.203", image: "assets/products/heater-767.png", surfacePlaceable: true, watt: 270, visibilityRole: "product", model3d: { kind: "parametric-catalog-reference", accuracy: "verified-envelope/catalog-photo-detail" }, setupInfo: { status: "catalog-source", instructions: ["100V", "消費電力270W", "温度80〜140℃", "水滴を熱源へ落とさない"] } },
  { type: "product", productCategory: "buff-motor-694", productCode: "694", masterId: "SANNI-694", label: "デジモーター No.694", width: 300, depth: 180, height: 200, color: "#e9dfbd", material: "カタログに材質記載なし", dimensionLocked: true, dimensionSource: "サンニシムラ総合カタログ2025-2027 p.218 / W300×D180×H200mm", catalogReference: "総合カタログ2025-2027 p.218", image: "assets/products/buffer-694.png", surfacePlaceable: true, watt: 200, visibilityRole: "product", model3d: { kind: "parametric-catalog-reference", accuracy: "verified-envelope/catalog-photo-detail" }, setupInfo: { status: "catalog-source", instructions: ["100V", "消費電力200W", "0〜4,000rpm", "連続定格"] } },
  { type: "product", productCategory: "buff-motor-95", productCode: "95", masterId: "SANNI-95", label: "吸塵バフモーター No.95", width: 370, depth: 312, height: 237, color: "#d7c99f", material: "カタログに材質記載なし", dimensionLocked: true, dimensionSource: "サンニシムラ総合カタログ2025-2027 p.218 / W370×D312×H237mm", catalogReference: "総合カタログ2025-2027 p.218", image: "assets/products/buffer-95.png", surfacePlaceable: true, watt: 230, visibilityRole: "product", model3d: { kind: "parametric-catalog-reference", accuracy: "verified-envelope/catalog-photo-detail" }, setupInfo: { status: "catalog-source", instructions: ["100V", "主モーター200W＋吸塵モーター15W×2＝計画負荷230W", "連続25分"] } },
  { type: "product", productCategory: "buff-motor-1010", productCode: "1010", masterId: "SANNI-1010", label: "省スペース吸塵バフモーター No.1010", width: 232, depth: 239, height: 417, color: "#ded3ad", material: "カタログに材質記載なし", dimensionLocked: true, dimensionSource: "サンニシムラ総合カタログ2025-2027 p.219 / W232×D239×H417mm", catalogReference: "総合カタログ2025-2027 p.219", image: "assets/products/buffer-1010.png", surfacePlaceable: true, watt: 127, visibilityRole: "product", model3d: { kind: "parametric-catalog-reference", accuracy: "verified-envelope/catalog-photo-detail" }, setupInfo: { status: "catalog-source", instructions: ["100V", "消費電力50Hz 127W・60Hz 125W（計画は最大127W）", "連続定格"] } },
  { type: "product", productCategory: "buff-motor-989", productCode: "989", masterId: "SANNI-989", label: "眼鏡バフモーター No.989", width: 340, depth: 135, height: 215, color: "#e4dfcf", material: "カタログに材質記載なし", dimensionLocked: true, dimensionSource: "サンニシムラ総合カタログ2025-2027 p.219 / W340×D135×H215mm", catalogReference: "総合カタログ2025-2027 p.219", image: "assets/products/buffer-989.png", surfacePlaceable: true, watt: 120, visibilityRole: "product", model3d: { kind: "parametric-catalog-reference", accuracy: "verified-envelope/catalog-photo-detail" }, setupInfo: { status: "catalog-source", instructions: ["100V", "消費電力120W", "連続30分"] } },
  { type: "product", productCategory: "processing-storage-rack", productCode: "271-D", masterId: "SANNI-271-D", label: "加工整理箱・カラーケース用ラック No.271-D", width: 160, depth: 180, height: 350, color: "#edf1f2", material: "アクリル（公式記載）", dimensionLocked: true, dimensionSource: "サンニシムラ公式製品ページ / 外寸W160×D180×H350mm", sourceUrl: "https://www.san-nishimura.co.jp/product/item/加工整理箱・カラーケース用ラック/", image: "assets/products/rack-271-d.png", surfacePlaceable: true, placementType: "surface", allowedSurfaceTypes: ["tabletop", "display-top", "riser-top"], visibilityRole: "product", model3d: { kind: "parametric-official-envelope", accuracy: "verified-envelope/official-product-image" }, setupInfo: { status: "official-source", instructions: ["No.271用5段通常タイプ", "机・展示台上へ正立", "前後どちらからも出し入れできる向きで配置"] } },
  { type: "product", productCategory: "ultrasonic-cleaner", productCode: "912", masterId: "SANNI-912", label: "超音波洗浄器 No.912", width: 160, depth: 110, height: 180, color: "#eef1f1", material: "白色ボディ・ステンレス洗浄槽", dimensionLocked: true, dimensionSource: "サンニシムラ公式製品ページ / 外径W160×D110×H180mm（突起物含まず）", sourceUrl: "https://www.san-nishimura.co.jp/product/item/超音波洗浄器-912/", image: "assets/products/ultrasonic-cleaner-912.png", surfacePlaceable: true, placementType: "surface", allowedSurfaceTypes: ["tabletop", "display-top", "riser-top"], ratedOutputW: 70, watt: 0, visibilityRole: "product", model3d: { kind: "parametric-official-envelope", accuracy: "verified-envelope/official-product-image" }, setupInfo: { status: "official-source", instructions: ["省スペース型業務用眼鏡洗浄器", "操作面を来場者・スタッフ側へ向けて正立", "洗浄槽開口を上向きに保持", "AC100V・定格出力70W・電源コード2m"] } },
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
  { type: "bolda", label: "bolda TB13 ヒーター展示", width: 900, depth: 500, height: 800, color: "#5fb7b2", image: "assets/bolda/TB13.png", boldaCode: "TB13", printTheme: "電子ヒーター", frontTexture: "assets/bolda/textures/tb13-heater.png?v=20260825-3", referenceImages: ["assets/bolda/print-references/sample_TB13.png"], setupInfo: { status: "reference-source", instructions: ["全体W900×D500×H800", "下部印刷面H650", "上部棚H150", "開口2室・各約W413×H100", "板厚約25mm", "前面商品画像は提供PSDの埋め込み元画像から下切れなしで再出力"] } },
  { type: "bolda", label: "bolda VB01_600CB", width: 600, depth: 600, height: 600, color: "#5fb7b2", image: "assets/bolda/VB01_600CB.png" },
  { type: "wall", label: "サイン", width: 1200, depth: 80, height: 300, color: "#7bcb9d" },
  { type: "wall", masterId: "SANNI-WALL-SIGN-1400", label: "サンニシムラ 壁面吊り下げ看板 W1400xH500xD20", width: 1400, depth: 20, height: 500, color: "#f6f6f2", material: "共通アイテム現物看板", dimensionLocked: true, dimensionSource: "共通アイテム/【看板】/デザインイメージ.png・NEO TOKYO実会場写真・壁面吊り下げ看板_1400x500x20.ai", frontTexture: "assets/images/signs/sannishimura-wall-sign-1400x500x20.png?v=20260825-1", model3d: { kind: "parametric-source-artwork", accuracy: "verified-envelope/exact-front-artwork" }, setupInfo: { status: "reference-source", instructions: ["背面壁へ水平取付", "実寸W1400×H500×D20mm", "固定金具・壁面耐荷重は施工会社確認"] } },
  { type: "power", label: "コンセント", width: 300, depth: 300, color: "#d85a5a", watt: 0 },
  { type: "powerstrip", label: "電源タップ（名称・定格を編集）", width: 300, depth: 150, color: "#e38354", watt: 0 },
  { type: "device", label: "接続機器（名称・寸法・消費電力を編集）", width: 300, depth: 300, color: "#8a9fb5", watt: 0 },
  { type: "spotlight", label: "スポットライト", width: 350, depth: 350, color: "#ffd45f", watt: 100 },
  { type: "chair", label: "椅子", width: 450, depth: 450, color: "#9b8ad6" },
  { type: "zone", label: "接客スペース（必要面積を登録）", width: 1500, depth: 1200, height: 0, color: "#3b9e8f", spaceCategory: "contact", activationMode: "always", requiredAreaMm2: 0, inventoryTotalUnits: 0, inventoryUnitsPerCarton: 0, inventoryReplenishmentCount: 0, inventoryCartonWidthMm: 0, inventoryCartonDepthMm: 0, inventoryCartonHeightMm: 0, inventoryMaxStackHeightMm: 0, inventoryDimensionsConfirmed: false },
  { type: "scenario", label: "営業物品（名称・実測寸法を編集）", width: 300, depth: 300, height: 300, color: "#b98a52", operationalCategory: "stock", activationMode: "operating", dimensionsConfirmed: false },
  // 展示計画用の汎用備品寸法。特定メーカー値ではなく、一般的な13〜15型PC・小型A4プリンター・27型モニター等の外形包絡です。
  { type: "scenario", scenarioKind: "laptop", label: "ノートパソコン（13〜15型・開いた状態）", width: 340, depth: 240, height: 220, color: "#677d92", surfacePlaceable: true, placementType: "surface", operationalCategory: "pc", activationMode: "always", dimensionsConfirmed: false, dimensionAccuracy: "planning-average", dimensionSource: "一般的な13〜15型ノートPCの展示計画用外形 W340×D240×H220mm", watt: 0 },
  { type: "scenario", scenarioKind: "compact-printer", label: "A4小型プリンター", width: 400, depth: 350, height: 180, color: "#e9ecec", surfacePlaceable: true, placementType: "surface", operationalCategory: "pc", activationMode: "always", dimensionsConfirmed: false, dimensionAccuracy: "planning-average", dimensionSource: "一般的なA4対応小型プリンターの展示計画用外形 W400×D350×H180mm", watt: 0 },
  { type: "scenario", scenarioKind: "tablet", label: "タブレット（11型程度）", width: 250, depth: 175, height: 10, color: "#45545c", surfacePlaceable: true, placementType: "surface", operationalCategory: "pc", activationMode: "always", dimensionsConfirmed: false, dimensionAccuracy: "planning-average", dimensionSource: "一般的な11型タブレットの展示計画用外形 W250×D175×H10mm", watt: 0 },
  { type: "scenario", scenarioKind: "smartphone", label: "スマートフォン", width: 150, depth: 75, height: 9, color: "#303a40", surfacePlaceable: true, placementType: "surface", operationalCategory: "pc", activationMode: "always", dimensionsConfirmed: false, dimensionAccuracy: "planning-average", dimensionSource: "一般的なスマートフォンの展示計画用外形 W150×D75×H9mm", watt: 0 },
  { type: "scenario", scenarioKind: "monitor", label: "モニター（27型程度・スタンド込み）", width: 610, depth: 220, height: 450, color: "#3f4d54", surfacePlaceable: true, placementType: "surface", operationalCategory: "pc", activationMode: "always", dimensionsConfirmed: false, dimensionAccuracy: "planning-average", dimensionSource: "一般的な27型モニターのスタンド込み展示計画用外形 W610×D220×H450mm", watt: 0 },
  { type: "scenario", scenarioKind: "document-tray-3", label: "3段書類トレー（要実測）", width: 270, depth: 350, height: 260, color: "#8f9b9f", surfacePlaceable: true, operationalCategory: "promotion", activationMode: "operating", dimensionsConfirmed: false },
  { type: "scenario", scenarioKind: "trash-bin", label: "ゴミ箱（要実測）", width: 250, depth: 250, height: 350, color: "#697579", operationalCategory: "waste", activationMode: "operating", dimensionsConfirmed: false },
  { type: "scenario", scenarioKind: "stock-carton", label: "在庫ダンボール（要実測）", width: 500, depth: 350, height: 300, color: "#b98a52", operationalCategory: "stock", activationMode: "operating", dimensionsConfirmed: false },
  { type: "scenario", scenarioKind: "paper-bag-stock", label: "紙袋ストック（要実測）", width: 400, depth: 250, height: 450, color: "#b7a27f", operationalCategory: "bag", activationMode: "operating", dimensionsConfirmed: false },
  { type: "scenario", scenarioKind: "staff-bag", label: "スタッフバッグ置き（要実測）", width: 450, depth: 220, height: 350, color: "#7d6c87", operationalCategory: "bag", activationMode: "operating", dimensionsConfirmed: false },
  { type: "person", label: "人物A 179cm", width: 600, depth: 600, height: 1790, color: "#ef6fa8", image: "assets/people/person-a-standing-crop.png", standingImage: "assets/people/person-a-standing-crop.png", seatedImage: "assets/people/person-a-seated-crop.png" },
  { type: "person", label: "人物B 179cm", width: 600, depth: 600, height: 1790, color: "#3b69d8", image: "assets/people/person-b-standing-crop.png", standingImage: "assets/people/person-b-standing-crop.png", seatedImage: "assets/people/person-b-seated-crop.png" },
  // Append new masters: old STD IDs depend on the existing array order.
  { type: "product", productCategory: "rotating-net-display", productCode: "61-127-7-2", masterId: "STORE-EXPRESS-61-127-7-2",
    label: "樹脂製卓上回転ネットディスプレイ 黒 61-127-7-2", width: 330, depth: 330, height: 390,
    color: "#30343a", material: "回転台・POP立て：ABS樹脂、クリップ：PP、すべり止め：エラストマー樹脂",
    dimensionLocked: true, dimensionSource: "ストア・エキスプレス公式 61-127-7-2（2026-09-04確認）本体W33×D33×H39cm、ネット面W30×H37.2cm、ピッチ3cm、線径3.8mm、台座φ28.5cm",
    sourceUrl: "https://www.store-express.com/shop/g/g61-127-7-2/", purchaseUrl: "https://www.amazon.co.jp/dp/B016PUU2RE",
    searchAliases: ["回転什器", "卓上ネット", "回転有孔", "ストアエキスプレス", "B016PUU2RE", "6142-128"],
    surfacePlaceable: true, supportSurface: false, visibilityRole: "product",
    model3d: { kind: "rotating-net-display", accuracy: "verified-envelope/reference-based-detail", baseDiameterMm: 285, meshPitchMm: 30, wireDiameterMm: 3.8 },
    setupInfo: { status: "official-source", instructions: ["本体セット黒・幅330×奥行330×高さ390mm", "回転台・POP立て・カード用クリップ6個", "フック・ディスプレイボックスは別売（このモデルには含まない）", "耐荷重2kg／枚。上面への積み重ねには非対応", "組立後は分解不可。フック付きの必要空間は別途確認"] } },
  { type: "product", productCategory: "acrylic-sign-stand", productCode: "SSD-2737-00", masterId: "SEKISEI-SSD-2737-00",
    label: "セキセイ サインスタンド A4縦・片面 SSD-2737-00", width: 211, depth: 69, height: 296,
    color: "#d9ebed", material: "アクリル樹脂（厚み1.7mm）", paletteGroup: "equipment",
    dimensionLocked: true, dimensionSource: "セキセイ公式 SSD-2737（2026-09-04確認）外寸W211×D69×H296mm。収容サイズA4縦210×297mmとは別",
    sourceUrl: "https://www.sedia.co.jp/product/ssd2712-2737/", purchaseUrl: "https://www.amazon.co.jp/dp/B002DBXZME",
    searchAliases: ["SEKISEI", "SSD-2737", "A4", "POP", "ポップスタンド", "サインスタンド", "B002DBXZME", "4974214143081"],
    surfacePlaceable: true, supportSurface: false, visibilityRole: "pop",
    model3d: { kind: "acrylic-sign-stand", accuracy: "verified-envelope/reference-based-detail", thicknessMm: 1.7, pickVolume: true },
    setupInfo: { status: "official-source", instructions: ["A4縦置き・片面用の卓上サインスタンド", "外寸211×69×296mmで配置", "3Dの傾斜・折り返し形状は写真に基づく概略。中紙は無地の表示見本", "上面への積み重ねには非対応"] } },
  { type: "product", productCategory: "wooden-tool-stand", productCode: "383", masterId: "SANNI-383",
    label: "工具台 No.383", width: 208, depth: 117, height: 135, color: "#d9b479", material: "木製",
    dimensionLocked: true, dimensionSource: "サンニシムラ公式 工具台 No.383（2026-09-04確認）208(W)×117(D)×135(H)mm",
    sourceUrl: "https://www.san-nishimura.co.jp/product/item/工具台-2/", searchAliases: ["No.383", "木製工具台", "ヤットコ", "ドライバー", "サンニシムラ"],
    surfacePlaceable: true, supportSurface: false, visibilityRole: "product",
    model3d: { kind: "wooden-tool-stand", accuracy: "verified-envelope/reference-based-detail", driverHoles: 9, pickVolume: true },
    setupInfo: { status: "official-source", instructions: ["ヤットコ・ドライバーを立てて収納する木製工具台", "工具台単体。工具・ドライバーはモデルに含まない", "板厚・穴径・横桟位置は公式写真に基づく概略。上面への積み重ねには非対応"] } },
  { type: "product", productCategory: "wooden-tool-stand", productCode: "718", masterId: "SANNI-718",
    label: "工具台 No.718（小型）", width: 133, depth: 115, height: 133, color: "#d9b479", material: "木製",
    dimensionLocked: true, dimensionSource: "サンニシムラ公式 工具台 No.718（2026-09-04確認）133(W)×115(D)×133(H)mm",
    sourceUrl: "https://www.san-nishimura.co.jp/product/item/工具台-3/", searchAliases: ["No.718", "木製工具台", "小型工具台", "ヤットコ", "ドライバー", "サンニシムラ"],
    surfacePlaceable: true, supportSurface: false, visibilityRole: "product",
    model3d: { kind: "wooden-tool-stand", accuracy: "verified-envelope/reference-based-detail", driverHoles: 5, pickVolume: true },
    setupInfo: { status: "official-source", instructions: ["横幅を縮めた小型の木製工具台", "工具台単体。工具・ドライバーはモデルに含まない", "板厚・穴径・横桟位置は公式写真に基づく概略。上面への積み重ねには非対応"] } },
  ...[
    { code: "MIST-A2X3", label: "メガネミスト 大型POP A2縦3枚・一体", panels: 3, slice: 0, slices: 1 },
    { code: "MIST-A2-L", label: "メガネミスト POP A2左・キャッチコピー", panels: 1, slice: 0, slices: 3 },
    { code: "MIST-A2-C", label: "メガネミスト POP A2中央・ボトル", panels: 1, slice: 1, slices: 3 },
    { code: "MIST-A2-R", label: "メガネミスト POP A2右・使用シーン", panels: 1, slice: 2, slices: 3 }
  ].map(({ code, label, panels, slice, slices }) => ({
    type: "product", productCategory: "printed-pop-panel", productCode: code, masterId: `SANNI-${code}`,
    label, width: 420 * panels, depth: 5, height: 594, color: "#f8f8f2", paletteGroup: "equipment",
    material: "A2仕上がりに裁断したハレパネ（板厚5mm仮設定・固定具別途）",
    dimensionLocked: true, dimensionAccuracy: "partial-verified",
    dimensionSource: "ユーザー指定A2縦3枚。仕上がり1枚W420×H594mm、3枚W1260×H594mm。市販ハレパネA2の未裁断外形455×605mmとは別。板厚5mmは計画用仮設定",
    sourceUrl: "https://www.platinum-pen.co.jp/products/harepane/11191/",
    searchAliases: ["大型POP", "ポップ", "ハレパネ", "A2", "A2縦3枚", "メガネミスト", "1064", "MEGANE MIST"],
    frontTexture: "assets/pop/megane-mist-a2-triptych-v1.png", printTheme: "メガネミスト A2縦3枚",
    surfacePlaceable: true, supportSurface: false, visibilityRole: "pop",
    model3d: { kind: "printed-pop-panel", accuracy: "user-defined-trim-size/provisional-thickness", panelCount: panels, artworkSlice: slice, artworkSlices: slices, pickVolume: true },
    modelNote: "A2仕上がり420×594mmに裁断する計画。板厚5mmは仮設定。正面は生成したPOP原稿、背面は白。自立・固定金具の構造はモデル化していません。",
    placementNotice: `板単体・固定具別途。${panels === 3 ? "一体版は幅1260mm以上の天板が必要。小さい什器にはA2左・中央・右を分けて配置。" : "左・中央・右の順で並べ、連結・転倒防止を別途確認。"}`,
    setupInfo: { status: "user-defined", instructions: ["A2縦420×594mm仕上がり。未裁断のハレパネとは寸法が異なる", "印刷順は左・中央・右。幅と高さを変えず100%で出力", "板厚5mm仮設定。実際の板厚・連結方法・什器への固定具・後方の必要空間を設営前に確認", "板単体は自立しません。転倒防止と会場の高さ制限を確認"] }
  }))
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
    visual: "exact W900 x D500 x H800 white bolda TB13 counter: a full H650 printed lower body, then a 25mm lower shelf board, two shallow open cubbies each approximately W413 x H100 separated and bordered by 25mm boards, then a 25mm top board; the openings occupy only the upper H150 band and must not be enlarged",
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

const boldaDimensionSources = Object.freeze({
  AS01: "AS01_900x250x300_8.4KAB_print_format_ol.zip",
  ED04: "ED04_900x600x1100_8.4KAB_print_format_ol.zip",
  SF03: "SF03_350X400X1490_print_format_ol.zip",
  TB05: "TB05_900x600x800_8.4KAB_print_format_ol.zip",
  TB13: "TB13_02_900x500x800_8.4KAB_print_format_ol.zip",
  VB01_600CB: "VB01_600CB_600x600x600_8.4KAB_print_format_ol.zip",
  TB05_AS01: "TB05 900x600x800 + AS01 900x250x300（提供フォーマット2点）"
});

function masterIdSuffix(item) {
  const theme = String(item.printTheme || item.label || "STANDARD").toUpperCase();
  if (theme.includes("CUSTOM") || theme.includes("装着感")) return "CUSTOM";
  if (theme.includes("SCREW") || theme.includes("ネジ")) return "SCREW";
  if (theme.includes("TRIAL") || theme.includes("試験")) return "TRIAL";
  if (theme.includes("RECOMMENDED")) return "RECOMMENDED";
  if (theme.includes("NEW")) return "NEW";
  if (theme.includes("ドライバー")) return "DRIVERS";
  if (theme.includes("ヒーター")) return "HEATER";
  if (theme.includes("工具")) return "TOOLS";
  return "STANDARD";
}

function supportsPlacementSurfaceByDefault(item) {
  if (!item) return false;
  if (item.supportSurface === true || item.type === "table" || item.type === "bolda") return true;
  return item.type === "fixture" && /展示台|什器棚|カウンター/.test(String(item.label || ""));
}

function defaultSurfaceType(item) {
  if (item?.surfaceType) return item.surfaceType;
  if (item?.type === "table") return "tabletop";
  if (item?.type === "product") return "riser-top";
  return "display-top";
}

function normalizeFixtureMaster(item, index) {
  // Only reference dimensions are generic averages. Power must be entered from the actual equipment.
  if (item.dimensionAccuracy === "planning-average") item = { ...item, watt: 0 };
  const code = item.boldaCode || (item.type === "bolda" ? Object.keys(boldaDetails).find((candidate) => `${item.label} ${item.image}`.includes(candidate)) : "");
  const masterId = item.masterId || (item.type === "bolda"
    ? `BOLDA-${code || `UNVERIFIED-${index + 1}`}-${masterIdSuffix(item)}`
    : `STD-${String(index + 1).padStart(3, "0")}-${item.type.toUpperCase()}`);
  const printFaces = [item.frontTexture, ...(item.tierTextures || []), item.riserTexture].filter(Boolean);
  const supportSurface = supportsPlacementSurfaceByDefault(item);
  const surfacePlaceable = item.surfacePlaceable === true || code === "AS01" || code === "VB01_600CB";
  return Object.freeze({
    ...item,
    masterId,
    height: item.height || (item.type === "table" ? 700 : 0),
    surfacePlaceable,
    searchAliases: Object.freeze([...(item.searchAliases || []), ...(code === "AS01" ? ["ヨーカン棒", "小型展示台"] : []), ...(item.productCategory === "ultrasonic-cleaner" ? ["超音波洗浄機"] : []), ...(item.scenarioKind === "laptop" ? ["PC", "パソコン"] : [])]),
    placementType: item.placementType || (surfacePlaceable ? "surface" : "floor"),
    supportSurface,
    surfaceType: supportSurface ? defaultSurfaceType(item) : "",
    allowedSurfaceTypes: Object.freeze([...(item.allowedSurfaceTypes || ["tabletop", "display-top", "riser-top"])]),
    // Usable top face follows the existing reference-based 3D shape, not its bounding box.
    supportTop: Object.freeze(item.supportTop || ({
      ED04: { x: 0, y: 0, width: 1, depth: 1 / 3, height: 1 },
      TB05_AS01: { x: 0, y: 0, width: 1, depth: 250 / 600, height: 1 },
      SF03: { x: .07, y: .19, width: .86, depth: .72, height: 1405 / 1490 }
    }[code] || (item.type === "fixture" && /什器棚/.test(item.label)
      ? { x: .03, y: .06 + 8 / item.depth, width: .94, depth: .88, height: ((item.height || 1400) - 66) / (item.height || 1400) }
      : { x: 0, y: 0, width: 1, depth: 1, height: 1 }))),
    material: item.material || (item.type === "bolda" ? "材質の確定情報は未登録（提供印刷フォーマット参照）" : "未登録"),
    shape2d: Object.freeze({ kind: "rectangle", width: item.width, depth: item.depth }),
    model3d: Object.freeze(item.model3d || {
      kind: item.type === "bolda" ? "parametric-reference" : "parametric-generic",
      accuracy: item.type === "bolda" ? "verified-envelope/reference-based-detail" : "generic"
    }),
    dimensionLocked: item.dimensionLocked === true || item.type === "bolda",
    dimensionSource: item.dimensionSource || (item.type === "bolda" ? (boldaDimensionSources[code] || "提供資料内に寸法根拠を特定できていません") : "未登録"),
    productPlacementPositions: Object.freeze((item.productPlacementPositions || []).map((position) => Object.freeze({ ...position }))),
    popPlacementPositions: Object.freeze(printFaces.map((source, faceIndex) => ({ faceIndex, source }))),
    setupInfo: Object.freeze(item.setupInfo
      ? { ...item.setupInfo, instructions: Object.freeze([...(item.setupInfo.instructions || [])]) }
      : { status: "not-registered", instructions: Object.freeze([]) })
  });
}

const itemTypes = Object.freeze(rawFixtureMasters.map(normalizeFixtureMaster));

const monitorScreens = Object.freeze({
  "megane-mist": Object.freeze({ label: "メガネミスト画像", source: "assets/screens/megane-mist-hero-v1.png", width: 1672, height: 941 })
});

function getMonitorScreen(item) {
  return item?.scenarioKind === "monitor" ? monitorScreens[item.monitorScreenId] || null : null;
}

function updateMonitorScreen() {
  const item = selectedItem();
  if (item?.scenarioKind !== "monitor") return;
  item.monitorScreenId = Object.hasOwn(monitorScreens, $("itemMonitorScreen").value) ? $("itemMonitorScreen").value : "";
  render();
}

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
  booth: { width: 3000, depth: 3000, wallHeight: 2400, heightLimitMm: 2400, floorLoadKgPerM2: 0, wallSide: "top", aisleSide: "bottom", spaceOnly: false, sideWallHeightMm: 1200, sideReturnDepthMm: 3000, wallPanelCount: 0, wallPanelWidthMm: 990, wallColorHex: "#f7f7f3", wallFrameColorHex: "#bfc5c4", plannedBackPanelWidthMm: 0, plannedBackPanelHeightMm: 0, plannedBackPanelThicknessMm: 0, plannedBackPanelStatus: "" },
  gridSize: 50,
  snapEnabled: true,
  viewerEyeHeight: 1600,
  routeClearanceMm: 800,
  routeGridMm: 100,
  operationMode: "design",
  powerCircuits: [{ id: "circuit-1", name: "回路1", voltageV: 100, capacityW: 0 }],
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
let operationalAudit = null;
let spaceAudit = null;
let inventoryAudit = null;
const historyPast = [];
const historyFuture = [];
let historyApplying = false;
let paletteCategoryFilter = "fixtures";
let mobilePaletteCategoryFilter = "fixtures";
let dropPreview = null;
const canvasPointers = new Map();
let canvasGesture = null;
let canvasPan = null;
const canvasView = { zoom: 1, panX: 0, panY: 0 };
let dimensionsVisible = false;
let advancedMode = false;

const $ = (id) => document.getElementById(id);

function init() {
  initializeSimpleUi();
  Object.entries(presets).forEach(([key, preset]) => {
    const option = document.createElement("option");
    option.value = key;
    option.textContent = preset.label;
    $("presetSelect").append(option);
  });

  renderPalettes();

  bindInputs();
  if (!loadAutosave()) {
    applyPreset("wof");
    state.selectedId = null;
  }
  render();
  new ResizeObserver(resizeLayoutCanvas).observe(canvas);
  new ResizeObserver(() => { if (state.view === "preview3d" && threePreview) { configureThreeCamera(false); renderThreeScene(); } }).observe(preview3dCanvas);
}

function initializeSimpleUi() {
  ["submissionInfoSection", "powerSection", "agentsSection", "operationModeStatus", "fixtureMasterInfo", "selectedMeasurements", "resetMasterDimensionsBtn", "wattField", "circuitField", "ratedCapacityField", "powerConnectionFields", "personRoleField", "activationModeField", "scenarioFields", "spaceFields", "visibilityRoleField", "visibilitySettings", "generate3dBtn", "downloadPromptTxtBtn", "downloadSpecJsonBtn", "downloadCodexPackBtn", "preview3dSpec", "preview3dAssetStatus", "boldaPreview", "downloadLayoutPngBtn", "download3dPngBtn"].forEach((id) => $(id)?.classList.add("advanced-only"));
  ["itemX", "itemZ", "routeClearanceMm", "gridSizeSelect", "bringForwardBtn", "bringToFrontBtn"].forEach((id) => $(id)?.closest(".two-col, .button-row")?.classList.add("advanced-only"));
  $("operationMode").closest("label").classList.add("advanced-only");
  document.querySelectorAll(".image-prompt, .real-booth-refs, .furniture-image-refs, .bolda-image-refs, .preview3d-eye-height").forEach((element) => element.classList.add("advanced-only"));
}

function resizeLayoutCanvas() {
  if (printRenderMode || state.view !== "layout") return;
  const rect = canvas.getBoundingClientRect();
  if (rect.width < 1 || rect.height < 1) return;
  canvas.width = Math.round(rect.width);
  canvas.height = Math.round(rect.height);
  drawCanvas();
}

function resetCanvasView() {
  Object.assign(canvasView, { zoom: 1, panX: 0, panY: 0 });
  resizeLayoutCanvas();
}

function paletteVisual(item) {
  if (item.model3d?.kind === "printed-pop-panel") {
    const slices = item.model3d.artworkSlices, index = item.model3d.artworkSlice;
    const position = slices > 1 ? index / (slices - 1) * 100 : 50;
    return `<span class="palette-image-stack"><span role="img" aria-label="${escapeHtml(item.label)} 印刷面" style="display:block;width:100%;aspect-ratio:${item.width}/${item.height};background: white url('${escapeHtml(item.frontTexture)}') ${position}% center / ${slices * 100}% 100% no-repeat"></span></span>`;
  }
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
  if (item.type === "product") return buildProductPaletteSvg(item);
  if (item.type === "scenario" && item.scenarioKind) return buildScenarioPaletteSvg(item);
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
      if (key === "wallHeight") {
        state.booth.spaceOnly = !(state.booth.wallHeight > 0);
        state.booth.heightLimitMm = Math.max(0, state.booth.wallHeight);
      }
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

  $("gridSizeSelect").addEventListener("change", () => {
    state.gridSize = Domain.sanitizeGridSize($("gridSizeSelect").value);
    syncGridInputs();
    render();
  });
  $("snapEnabled").addEventListener("change", () => {
    state.snapEnabled = $("snapEnabled").checked;
    render();
  });
  $("routeClearanceMm").addEventListener("input", () => {
    state.routeClearanceMm = Math.max(300, Math.min(2000, Domain.finiteNumber($("routeClearanceMm").value, 800)));
    render();
  });
  $("routeGridMm").addEventListener("change", () => {
    state.routeGridMm = [50, 100, 200].includes(Number($("routeGridMm").value)) ? Number($("routeGridMm").value) : 100;
    render();
  });
  $("operationMode").addEventListener("change", () => {
    state.operationMode = Domain.normalizeOperationMode($("operationMode").value);
    render();
  });

  $("jointSide").addEventListener("change", () => {
    state.jointSide = $("jointSide").value;
    if (isImfEgfPreset()) {
      applyImfEgfLayout();
    } else {
      render();
    }
  });

  ["itemLabel", "itemWidth", "itemDepth", "itemHeight", "itemX", "itemY", "itemZ", "itemWatt", "itemRatedCapacity", "itemPowerSourceId", "itemCableRouteMode", "itemCableSlack", "itemCircuitId", "itemPersonRole", "itemActivationMode", "itemOperationalCategory", "itemSpaceCategory", "itemRequiredAreaM2", "itemInventoryTotalUnits", "itemInventoryUnitsPerCarton", "itemInventoryReplenishmentCount", "itemInventoryCartonWidth", "itemInventoryCartonDepth", "itemInventoryCartonHeight", "itemInventoryMaxStackHeight", "itemVisibilityRole", "itemTargetViewHeight", "itemTargetFrontSide"].forEach((id) => {
    $(id).addEventListener("input", updateSelectedFromForm);
  });
  ["itemX", "itemY"].forEach((id) => {
    $(id).addEventListener("change", () => {
      if (autoPlaceItemOnDropSupport(selectedItem())) render();
    });
  });
  $("itemDimensionsConfirmed").addEventListener("change", updateSelectedFromForm);
  $("itemInventoryDimensionsConfirmed").addEventListener("change", updateSelectedFromForm);
  $("addPowerCircuitBtn").addEventListener("click", addPowerCircuit);
  $("powerCircuitEditor").addEventListener("input", (event) => updatePowerCircuitFromEditor(event, false));
  $("powerCircuitEditor").addEventListener("change", updatePowerCircuitFromEditor);
  $("powerCircuitEditor").addEventListener("click", onPowerCircuitEditorClick);
  $("rotateBtn").addEventListener("click", rotateSelected);
  $("duplicateBtn").addEventListener("click", duplicateSelected);
  $("resetMasterDimensionsBtn").addEventListener("click", resetSelectedToMasterDimensions);
  $("placeOnSupportBtn").addEventListener("click", placeSelectedOnSupport);
  $("detachFromSupportBtn").addEventListener("click", detachSelectedFromSupport);
  $("itemSupportId").addEventListener("change", syncSurfacePlacementPreview);
  $("itemMonitorScreen").addEventListener("change", updateMonitorScreen);
  $("deleteBtn").addEventListener("click", deleteSelected);
  $("undoBtn").addEventListener("click", undoDesignChange);
  $("redoBtn").addEventListener("click", redoDesignChange);
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
  $("viewerEyeHeight").addEventListener("input", () => {
    state.viewerEyeHeight = Math.max(1000, Math.min(2200, Domain.finiteNumber($("viewerEyeHeight").value, 1600)));
    render();
  });
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

  $("itemSearch").addEventListener("input", renderPalettes);
  $("mobileItemSearch").addEventListener("input", renderPalettes);
  document.querySelectorAll("[data-palette-category]").forEach((button) => {
    button.addEventListener("click", () => {
      paletteCategoryFilter = button.dataset.paletteCategory;
      document.querySelectorAll("[data-palette-category]").forEach((candidate) => candidate.classList.toggle("active", candidate === button));
      renderPalettes();
    });
  });
  document.querySelectorAll("[data-mobile-palette-category]").forEach((button) => {
    button.addEventListener("click", () => {
      mobilePaletteCategoryFilter = button.dataset.mobilePaletteCategory;
      document.querySelectorAll("[data-mobile-palette-category]").forEach((candidate) => candidate.classList.toggle("active", candidate === button));
      renderPalettes();
    });
  });
  $("mobileAddBtn").addEventListener("click", openMobileAddDrawer);
  $("mobileAddCloseBtn").addEventListener("click", closeMobileDrawers);
  $("mobileViewBtn").addEventListener("click", () => setView(state.view === "preview3d" ? "layout" : "preview3d"));
  $("mobileUndoBtn").addEventListener("click", undoDesignChange);
  $("mobileSettingsBtn").addEventListener("click", () => openMobilePanel("settings"));
  $("mobileSaveBtn").addEventListener("click", saveProject);
  $("mobileRotateBtn").addEventListener("click", rotateSelected);
  $("mobileDuplicateBtn").addEventListener("click", duplicateSelected);
  $("mobileDeleteBtn").addEventListener("click", deleteSelected);
  $("mobileDetailsBtn").addEventListener("click", () => openMobilePanel("selection"));
  $("mobilePanelCloseBtn").addEventListener("click", closeMobilePanel);
  $("mobileAdvancedBtn").addEventListener("click", () => $("advancedModeBtn").click());
  $("mobileLoadBtn").addEventListener("click", () => $("projectFile").click());
  $("mobileClearBtn").addEventListener("click", resetLayout);
  $("confirmCancelBtn").addEventListener("click", () => $("editorConfirmDialog").close());
  $("confirmAcceptBtn").addEventListener("click", () => {
    $("editorConfirmDialog").close();
    const action = askEditorConfirmation.action;
    askEditorConfirmation.action = null;
    if (action) action();
  });
  $("advancedModeBtn").addEventListener("click", () => {
    advancedMode = !advancedMode;
    document.body.classList.toggle("advanced-mode", advancedMode);
    $("advancedModeBtn").setAttribute("aria-pressed", String(advancedMode));
    $("advancedModeBtn").textContent = advancedMode ? "詳細を閉じる" : "詳細設定";
    render();
  });
  $("dimensionsBtn").addEventListener("click", () => {
    dimensionsVisible = !dimensionsVisible;
    $("dimensionsBtn").setAttribute("aria-pressed", String(dimensionsVisible));
    drawCanvas();
  });
  $("fitCanvasBtn").addEventListener("click", resetCanvasView);
  [["zoomInBtn", 1.25], ["zoomOutBtn", .8]].forEach(([id, factor]) => $(id).addEventListener("click", () => {
    canvasView.zoom = Math.min(6, Math.max(.65, canvasView.zoom * factor));
    drawCanvas();
  }));
  $("visitorViewBtn").addEventListener("click", () => {
    setView("preview3d");
    setThreeCameraPreset("visitor");
  });
  canvas.addEventListener("wheel", (event) => {
    event.preventDefault();
    canvasView.zoom = Math.min(6, Math.max(.65, canvasView.zoom * Math.exp(-event.deltaY * .002)));
    drawCanvas();
  }, { passive: false });

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

function openMobileAddDrawer() {
  closeMobilePanel();
  $("mobileAddDrawer").classList.remove("hidden");
  syncMobileUi();
}

function closeMobileDrawers() {
  $("mobileAddDrawer").classList.add("hidden");
  syncMobileUi();
}

function openMobilePanel(mode) {
  closeMobileDrawers();
  document.body.classList.toggle("mobile-editor-open", mode === "selection");
  document.body.classList.toggle("mobile-settings-open", mode === "settings");
  if (mode === "settings") $("boothSettingsDetails").open = true;
  document.querySelector(".panel")?.scrollTo({ top: 0, behavior: "smooth" });
}

function closeMobilePanel() {
  document.body.classList.remove("mobile-editor-open", "mobile-settings-open");
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
  resizeLayoutCanvas();
}

function applyPreset(key) {
  const preset = presets[key];
  state.preset = key;
  state.eventName = preset.eventName;
  state.booth = {
    width: preset.width,
    depth: preset.depth,
    wallHeight: preset.wallHeight,
    heightLimitMm: preset.heightLimitMm || preset.wallHeight,
    floorLoadKgPerM2: preset.floorLoadKgPerM2 || 0,
    wallSide: preset.wallSide,
    aisleSide: preset.aisleSide,
    spaceOnly: preset.spaceOnly === true,
    sideWallHeightMm: Math.max(0, Domain.finiteNumber(preset.sideWallHeightMm, Math.min(1200, preset.wallHeight || 0))),
    sideReturnDepthMm: Math.max(0, Domain.finiteNumber(preset.sideReturnDepthMm, preset.depth)),
    wallPanelCount: Math.max(0, Math.floor(Domain.finiteNumber(preset.wallPanelCount, 0))),
    wallPanelWidthMm: Math.max(0, Domain.finiteNumber(preset.wallPanelWidthMm, 990)),
    wallColorHex: preset.wallColorHex || "#f7f7f3",
    wallFrameColorHex: preset.wallFrameColorHex || "#bfc5c4",
    plannedBackPanelWidthMm: Math.max(0, Domain.finiteNumber(preset.plannedBackPanelWidthMm, 0)),
    plannedBackPanelHeightMm: Math.max(0, Domain.finiteNumber(preset.plannedBackPanelHeightMm, 0)),
    plannedBackPanelThicknessMm: Math.max(0, Domain.finiteNumber(preset.plannedBackPanelThicknessMm, 0)),
    plannedBackPanelStatus: String(preset.plannedBackPanelStatus || "")
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
  } else if (key === "neotokyo") {
    state.notes = neoTokyoRuleNote;
    $("notes").value = state.notes;
    applyNeoTokyoLayout(false);
  } else {
    if ([jexRuleNote, imfRuleNote, egfRuleNote, wofRuleNote, neoTokyoRuleNote].includes(state.notes)) {
      state.notes = "";
      $("notes").value = "";
    }
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
  syncGridInputs();
  syncJointControls();
}

function buildScenarioPaletteSvg(item) {
  const color = item.color || "#d5963a";
  const shapes = {
    laptop: `<polygon points="28,67 92,67 82,82 38,82" fill="#67747a" stroke="#28373c" stroke-width="2"/><rect x="36" y="29" width="48" height="37" rx="3" fill="#263238" stroke="#172225" stroke-width="3"/><rect x="40" y="33" width="40" height="29" fill="#91c9d4"/>`,
    "compact-printer": `<rect x="27" y="42" width="66" height="38" rx="7" fill="#e9ecec" stroke="#526166" stroke-width="3"/><rect x="38" y="27" width="44" height="25" fill="#fff" stroke="#8a9699" stroke-width="2"/><path d="M41 69H79" stroke="#526166" stroke-width="4"/>`,
    tablet: `<rect x="30" y="26" width="60" height="58" rx="6" fill="#263238" stroke="#526166" stroke-width="3"/><rect x="35" y="31" width="50" height="46" fill="#83bcc8"/>`,
    smartphone: `<rect x="43" y="21" width="34" height="67" rx="7" fill="#273237" stroke="#111" stroke-width="3"/><rect x="47" y="28" width="26" height="49" fill="#87c3cd"/>`,
    monitor: `<rect x="22" y="23" width="76" height="48" rx="3" fill="#293235" stroke="#172225" stroke-width="3"/><rect x="27" y="28" width="66" height="38" fill="#83bcc8"/><path d="M60 72V84M42 86H78" stroke="#526166" stroke-width="5"/>`,
    "document-tray-3": `<rect x="31" y="24" width="58" height="60" rx="3" fill="#eff2f1" stroke="#526166" stroke-width="3"/><path d="M34 40H86M34 57H86M34 74H86" stroke="${color}" stroke-width="4"/>`,
    "trash-bin": `<path d="M36 30H84L78 84H42Z" fill="${color}" stroke="#6d542d" stroke-width="3"/><ellipse cx="60" cy="30" rx="24" ry="7" fill="#293234"/>`,
    "stock-carton": `<rect x="29" y="32" width="62" height="50" fill="#c99755" stroke="#6d542d" stroke-width="3"/><path d="M60 32V82M29 47H91" stroke="#8a673d" stroke-width="2"/>`,
    "paper-bag-stock": `<path d="M32 41H88V84H32Z" fill="#e8d5aa" stroke="#8a673d" stroke-width="3"/><path d="M44 43C44 20 76 20 76 43" fill="none" stroke="#8a673d" stroke-width="4"/>`,
    "staff-bag": `<rect x="28" y="41" width="64" height="42" rx="7" fill="${color}" stroke="#5b4327" stroke-width="3"/><path d="M43 42C43 20 77 20 77 42" fill="none" stroke="#5b4327" stroke-width="5"/>`
  };
  return `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="112" viewBox="0 0 120 112" role="img" aria-label="${escapeHtml(item.label)}">
    <rect x="10" y="10" width="100" height="86" rx="5" fill="#f8faf9"/>
    ${shapes[item.scenarioKind] || `<rect x="28" y="30" width="64" height="50" fill="${color}" opacity=".55"/>`}
    <text x="60" y="107" text-anchor="middle" font-size="10" font-weight="700" fill="#172225">${escapeHtml(scenarioKindLabel(item.scenarioKind))}</text>
  </svg>`;
}

function buildProductPaletteSvg(item) {
  const code = escapeHtml(item.productCode || "商品");
  let shape = "";
  if (item.model3d?.kind === "rotating-net-display") {
    shape = '<defs><pattern id="mesh" width="6" height="6" patternUnits="userSpaceOnUse"><path d="M6 0H0V6" fill="none" stroke="#454d51" stroke-width="1.2"/></pattern></defs><ellipse cx="60" cy="88" rx="27" ry="7" fill="#30343a"/><path d="M34 25L60 18L86 25L60 36Z" fill="#ebefec" stroke="#30343a" stroke-width="3"/><path d="M34 25V77L60 88L86 77V25L60 36Z" fill="url(#mesh)" stroke="#30343a" stroke-width="3"/><path d="M60 36V88" stroke="#30343a" stroke-width="4"/>';
  } else if (item.model3d?.kind === "acrylic-sign-stand") {
    shape = '<path d="M32 88L47 20H88L78 78L93 88Z" fill="#e4f1f4" stroke="#829ba3" stroke-width="2"/><path d="M47 24H84L74 77H36Z" fill="#fff" stroke="#c2d4d8"/><text x="60" y="56" text-anchor="middle" font-size="14" fill="#6e858d">A4</text><path d="M32 88L36 79H78" fill="none" stroke="#829ba3"/>';
  } else if (item.model3d?.kind === "wooden-tool-stand") {
    const side = item.width < item.height * 1.1 ? 36 : 24;
    const holes = Array.from({ length: item.model3d.driverHoles }, (_, i) => `<ellipse cx="${side + 10 + (100 - 2 * side) * i / (item.model3d.driverHoles - 1)}" cy="69" rx="2.5" ry="1.7" fill="#805c36"/>`).join("");
    shape = `<path d="M${side} 87V38Q${side + 5} 13 ${side + 12} 35V84M${120 - side} 87V38Q${115 - side} 13 ${108 - side} 35V84" fill="#dbb57c" stroke="#b08a53" stroke-width="3"/><path d="M${side + 9} 34H${111 - side}M${side + 9} 51H${111 - side}M${side + 9} 61H${111 - side}" stroke="#dab477" stroke-width="7"/><path d="M${side + 6} 68H${114 - side}V79H${side + 6}Z" fill="#e4c392" stroke="#b08a53"/>${holes}`;
  } else if (item.productCategory === "gacha-machine") {
    shape = '<rect x="39" y="18" width="42" height="72" rx="4" fill="#f4f5f2" stroke="#6f7979" stroke-width="2"/><rect x="44" y="22" width="32" height="34" rx="5" fill="#d8f1f4" stroke="#6f7979" stroke-width="2"/><circle cx="60" cy="70" r="6" fill="#c7ccd0" stroke="#5b6264" stroke-width="2"/><rect x="47" y="79" width="26" height="7" rx="2" fill="#d5d9da"/>';
  } else if (item.productCategory === "gacha-stand") {
    shape = '<polygon points="32,52 78,44 89,57 43,66" fill="#fff" stroke="#7c8585" stroke-width="2"/><polygon points="43,66 89,57 89,76 43,85" fill="#f1efe8" stroke="#7c8585" stroke-width="2"/><path d="M32 52 L43 66 L43 85 L32 71 Z" fill="#e5e3dc" stroke="#7c8585" stroke-width="2"/>';
  } else if (item.productCategory === "processing-storage-rack") {
    shape = '<rect x="39" y="19" width="42" height="72" fill="#eaf3f5" fill-opacity=".45" stroke="#718084" stroke-width="2"/><path d="M39 34H81M39 48H81M39 62H81M39 76H81" stroke="#718084" stroke-width="2"/>';
  } else if (item.productCategory === "ultrasonic-cleaner") {
    shape = '<path d="M32 38H88L82 85H38Z" fill="#eef1f1" stroke="#647175" stroke-width="2"/><rect x="38" y="27" width="44" height="23" fill="#77878b" stroke="#3f4a4d" stroke-width="2"/><rect x="44" y="66" width="32" height="12" rx="5" fill="#fff" stroke="#9aa4a7"/>';
  } else {
    shape = '<rect x="38" y="24" width="44" height="64" fill="#d4a65d" stroke="#75542a" stroke-width="2"/><circle cx="60" cy="43" r="10" fill="#f7f1e5" stroke="#75542a" stroke-width="2"/><path d="M44 66 H76" stroke="#946a32" stroke-width="2"/>';
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="112" viewBox="0 0 120 112" role="img" aria-label="${escapeHtml(item.label)}"><rect x="10" y="10" width="100" height="86" rx="5" fill="#f8faf9"/>${shape}<text x="60" y="107" text-anchor="middle" font-size="10" font-weight="700" fill="#172225">${code} W${item.width} D${item.depth} H${item.height}</text></svg>`;
}

function syncGridInputs() {
  state.gridSize = Domain.sanitizeGridSize(state.gridSize);
  state.snapEnabled = state.snapEnabled !== false;
  $("gridSizeSelect").value = String(state.gridSize);
  $("snapEnabled").checked = state.snapEnabled;
  state.routeClearanceMm = Math.max(300, Math.min(2000, Domain.finiteNumber(state.routeClearanceMm, 800)));
  state.routeGridMm = [50, 100, 200].includes(Number(state.routeGridMm)) ? Number(state.routeGridMm) : 100;
  $("routeClearanceMm").value = state.routeClearanceMm;
  $("routeGridMm").value = String(state.routeGridMm);
  ["itemX", "itemY"].forEach((id) => $(id).step = String(state.gridSize));
}

function isItemActive(item, mode = state.operationMode) {
  return Domain.isActiveInOperationMode(item, mode);
}

function activeItems() {
  return state.items.filter((item) => isItemActive(item));
}

function operationModeLabel(mode) {
  return { design: "設計モード", operating: "営業中モード", crowded: "混雑時モード" }[mode] || "設計モード";
}

function activationModeLabel(mode) {
  return { always: "全モード", operating: "営業中・混雑時", crowded: "混雑時のみ" }[mode] || "全モード";
}

function operationalCategoryLabel(category) {
  return {
    stock: "在庫・予備品", packing: "ダンボール・梱包材", bag: "バッグ・紙袋", waste: "ゴミ箱・廃棄物",
    promotion: "販促物・ガチャ用品", pc: "PC・端末", cable: "ケーブル養生領域", other: "その他"
  }[category] || "その他";
}

function scenarioKindLabel(kind) {
  return {
    laptop: "ノートパソコン",
    "compact-printer": "A4小型プリンター",
    tablet: "タブレット",
    smartphone: "スマートフォン",
    monitor: "モニター",
    "document-tray-3": "3段書類トレー",
    "trash-bin": "ゴミ箱",
    "stock-carton": "在庫ダンボール",
    "paper-bag-stock": "紙袋ストック",
    "staff-bag": "スタッフバッグ"
  }[kind] || "状態別物品";
}

function spaceCategoryLabel(category) {
  return { contact: "接客スペース", staff: "スタッフ専用領域", inventory: "在庫予約領域" }[category] || "接客スペース";
}

function formatSquareMetres(areaMm2) {
  return (Math.round(Math.max(0, Domain.finiteNumber(areaMm2, 0)) / 10000) / 100).toFixed(2);
}

function syncOperationMode() {
  state.operationMode = Domain.normalizeOperationMode(state.operationMode);
  $("operationMode").value = state.operationMode;
  const scenarioItems = state.items.filter((item) => item.type === "scenario");
  const activeScenario = scenarioItems.filter((item) => isItemActive(item));
  const activeCrowd = state.items.filter((item) => item.type === "person" && item.personRole === "crowd" && isItemActive(item));
  const zoneItems = state.items.filter((item) => item.type === "zone");
  const activeZones = zoneItems.filter((item) => isItemActive(item));
  $("operationModeStatus").textContent = `${operationModeLabel(state.operationMode)}｜営業物品 ${activeScenario.length}/${scenarioItems.length}点・用途領域 ${activeZones.length}/${zoneItems.length}点を有効化${state.operationMode === "crowded" ? `｜混雑負荷 ${activeCrowd.length}人` : ""}。無効項目は編集用に薄く表示し、状態別の衝突・視認・動線・床面積、3D・PDFから除外します。ブース範囲は全項目で確認します。`;
}

function normalizePowerCircuits() {
  if (!Array.isArray(state.powerCircuits)) state.powerCircuits = [];
  state.powerCircuits = state.powerCircuits.map((source, index) => ({
    id: String(source.id || `circuit-${index + 1}`),
    name: String(source.name || `回路${index + 1}`),
    voltageV: Math.max(0, Domain.finiteNumber(source.voltageV, 100)),
    capacityW: Math.max(0, Domain.finiteNumber(source.capacityW, 0))
  }));
}

function syncPowerCircuitEditor() {
  normalizePowerCircuits();
  const editor = $("powerCircuitEditor");
  editor.innerHTML = state.powerCircuits.length
    ? state.powerCircuits.map((circuit) => `
      <div class="power-circuit-card" data-circuit-id="${escapeHtml(circuit.id)}">
        <label>回路名<input data-circuit-field="name" type="text" value="${escapeHtml(circuit.name)}"></label>
        <div class="two-col">
          <label>電圧 V<input data-circuit-field="voltageV" type="number" min="0" step="1" value="${circuit.voltageV || ""}" placeholder="未登録"></label>
          <label>容量 W<input data-circuit-field="capacityW" type="number" min="0" step="100" value="${circuit.capacityW || ""}" placeholder="未登録"></label>
        </div>
        <button class="danger circuit-delete" data-circuit-action="delete" type="button">回路を削除</button>
      </div>
    `).join("")
    : '<p class="muted">回路がありません。施工会社の確定情報に合わせて追加してください。</p>';
}

function addPowerCircuit() {
  state.powerCircuits.push({
    id: crypto.randomUUID ? crypto.randomUUID() : `circuit-${Date.now()}`,
    name: `回路${state.powerCircuits.length + 1}`,
    voltageV: 100,
    capacityW: 0
  });
  render();
}

function paletteCategory(item) {
  if (["fixtures", "products", "equipment", "planning"].includes(item.paletteGroup)) return item.paletteGroup;
  if (["aluminum-pegboard", "rotating-net-display"].includes(item.productCategory)) return "fixtures";
  if (["table", "fixture", "bolda", "wall", "chair"].includes(item.type)) return "fixtures";
  if (item.type === "product") return "products";
  if (item.type === "scenario" || item.type === "device") return "equipment";
  return "planning";
}

function paletteSearchText(item) {
  return [item.label, item.productCode, item.masterId, item.productCategory, scenarioKindLabel(item.scenarioKind), ...(item.searchAliases || [])]
    .filter(Boolean)
    .join(" ")
    .normalize("NFKC")
    .toLocaleLowerCase("ja");
}

function renderPaletteInto(containerId, category, query, closeAfterAdd = false) {
  const container = $(containerId);
  if (!container) return;
  const normalizedQuery = String(query || "").normalize("NFKC").trim().toLocaleLowerCase("ja");
  const items = itemTypes.filter((item) => normalizedQuery ? paletteSearchText(item).includes(normalizedQuery) : (category === "all" || paletteCategory(item) === category));
  container.innerHTML = "";
  items.forEach((item) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "palette-item";
    button.dataset.masterId = item.masterId;
    const detail = paletteDetail(item);
    button.innerHTML = `${paletteVisual(item)}<span>${escapeHtml(item.boldaCode === "AS01" ? item.label.replace("bolda AS01", "ヨーカン棒 AS01") : item.label)}</span>${detail ? `<small>${detail}</small>` : ""}`;
    button.addEventListener("click", () => {
      addItem(item);
      if (closeAfterAdd) closeMobileDrawers();
    });
    container.append(button);
  });
  if (!items.length) container.innerHTML = '<p class="palette-empty">該当する項目がありません。</p>';
}

function renderPalettes() {
  renderPaletteInto("itemPalette", paletteCategoryFilter, $("itemSearch")?.value || "");
  renderPaletteInto("mobileItemPalette", mobilePaletteCategoryFilter, $("mobileItemSearch")?.value || "", true);
}

function updatePowerCircuitFromEditor(event, renderNow = true) {
  const field = event.target.dataset.circuitField;
  const card = event.target.closest("[data-circuit-id]");
  if (!field || !card) return;
  const circuit = state.powerCircuits.find((entry) => entry.id === card.dataset.circuitId);
  if (!circuit) return;
  if (field === "name") circuit.name = event.target.value.trim() || "名称未登録";
  if (field === "voltageV" || field === "capacityW") circuit[field] = Math.max(0, Domain.finiteNumber(event.target.value, 0));
  if (renderNow) {
    render();
  } else {
    renderSubmissionSummary();
    renderAgents();
    autosave();
  }
}

function onPowerCircuitEditorClick(event) {
  if (event.target.dataset.circuitAction !== "delete") return;
  const card = event.target.closest("[data-circuit-id]");
  if (!card) return;
  const circuitId = card.dataset.circuitId;
  const referenced = state.items.filter((item) => item.circuitId === circuitId);
  if (referenced.length) {
    alert(`この回路は${referenced.length}点のコンセントから参照されています。先に接続回路を未割当にしてください。`);
    return;
  }
  state.powerCircuits = state.powerCircuits.filter((entry) => entry.id !== circuitId);
  render();
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
  const preferredSupport = selectedItem();
  const item = {
    id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random()),
    type: template.type,
    masterId: template.masterId,
    productCategory: template.productCategory || "",
    productCode: template.productCode || "",
    sourceUrl: template.sourceUrl || "",
    catalogReference: template.catalogReference || "",
    dimensionAccuracy: template.dimensionAccuracy || "",
    scenarioKind: template.scenarioKind || "",
    monitorScreenId: template.monitorScreenId || "",
    weightKg: Math.max(0, Domain.finiteNumber(template.weightKg, 0)),
    surfacePlaceable: template.surfacePlaceable === true,
    supportSurface: template.supportSurface === true,
    placementType: template.placementType || (template.surfacePlaceable ? "surface" : "floor"),
    surfaceType: template.surfaceType || "",
    allowedSurfaceTypes: [...(template.allowedSurfaceTypes || ["tabletop", "display-top", "riser-top"])],
    supportItemId: "",
    supportOffsetX: 0,
    supportOffsetY: 0,
    supportZOffsetMm: 0,
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
    material: template.material || "",
    dimensionLocked: template.dimensionLocked === true,
    dimensionSource: template.dimensionSource || "",
    model3d: template.model3d ? { ...template.model3d } : undefined,
    setupInfo: template.setupInfo ? { ...template.setupInfo, instructions: [...(template.setupInfo.instructions || [])] } : undefined,
    watt: template.watt || 0,
    circuitId: template.circuitId || "",
    powerSourceId: template.powerSourceId || "",
    ratedCapacityW: template.ratedCapacityW || 0,
    cableRouteMode: template.cableRouteMode === "y-then-x" ? "y-then-x" : "x-then-y",
    cableSlackMm: Math.max(0, Domain.finiteNumber(template.cableSlackMm, 0)),
    personRole: template.personRole || "reference",
    activationMode: ["always", "operating", "crowded"].includes(template.activationMode) ? template.activationMode : "always",
    operationalCategory: template.operationalCategory || "other",
    spaceCategory: template.spaceCategory || "contact",
    requiredAreaMm2: Math.max(0, Domain.finiteNumber(template.requiredAreaMm2, 0)),
    inventoryTotalUnits: Math.max(0, Math.ceil(Domain.finiteNumber(template.inventoryTotalUnits, 0))),
    inventoryUnitsPerCarton: Math.max(0, Math.ceil(Domain.finiteNumber(template.inventoryUnitsPerCarton, 0))),
    inventoryReplenishmentCount: Math.max(0, Math.floor(Domain.finiteNumber(template.inventoryReplenishmentCount, 0))),
    inventoryCartonWidthMm: Math.max(0, Domain.finiteNumber(template.inventoryCartonWidthMm, 0)),
    inventoryCartonDepthMm: Math.max(0, Domain.finiteNumber(template.inventoryCartonDepthMm, 0)),
    inventoryCartonHeightMm: Math.max(0, Domain.finiteNumber(template.inventoryCartonHeightMm, 0)),
    inventoryMaxStackHeightMm: Math.max(0, Domain.finiteNumber(template.inventoryMaxStackHeightMm, 0)),
    inventoryDimensionsConfirmed: template.inventoryDimensionsConfirmed === true,
    dimensionsConfirmed: template.dimensionsConfirmed === true,
    visibilityRole: template.visibilityRole || "none",
    targetViewHeightMm: Math.max(0, Domain.finiteNumber(template.targetViewHeightMm, 0)),
    targetFrontSide: ["top", "right", "bottom", "left"].includes(template.targetFrontSide) ? template.targetFrontSide : "",
    x: Math.max(0, Domain.snapMm((state.booth.width - template.width) / 2, state.gridSize, state.snapEnabled)),
    y: Math.max(0, Domain.snapMm((state.booth.depth - template.depth) / 2, state.gridSize, state.snapEnabled)),
    z: 0,
    rotationDeg: 0,
    rotationQuarterTurns: 0
  };
  state.items.push(item);
  if (!placeNewItemSafely(item, preferredSupport)) {
    state.items.pop();
    showEditorMessage("置ける空きがありません。ブースや配置を見直してください。");
    return null;
  }
  state.selectedId = item.id;
  render();
  return item;
}

function placeItemOnSurface(item, support, maxDistanceMm = Infinity) {
  if (!item.surfacePlaceable) return false;
  const definition = getSupportPlacementDefinition(item, support);
  if (!definition?.placement.fits) return false;
  const placement = definition.kind === "official-fixed" ? definition.placement : freeSurfacePlacement(item, support, maxDistanceMm);
  if (!placement) return false;
  Object.assign(item, { supportItemId: support.id, supportOffsetX: placement.offsetX, supportOffsetY: placement.offsetY, supportZOffsetMm: placement.zOffsetMm });
  syncSupportedItems();
  return !hasPlacementCollision(item);
}

function placeOnFreeFloor(item) {
  detachItemFromSupport(item);
  const ids = new Set(placementTree(item).map((entry) => entry.id));
  const top = Math.max(...placementTree(item).map((entry) => getItemVerticalRange(entry).top));
  const obstacles = state.items.filter((entry) => !ids.has(entry.id) && !["zone", "person", "power", "spotlight", "wall"].includes(entry.type) && getItemVerticalRange(entry).bottom < top);
  if (["zone", "person", "power", "spotlight", "wall"].includes(item.type)) return true;
  const placement = Domain.findNearestFreeSupportPlacement(item,
    { x: 0, y: 0, z: 0, width: state.booth.width, depth: state.booth.depth, height: 0 }, obstacles,
    { offsetX: item.x, offsetY: item.y, zOffsetMm: 0, stepMm: 100 });
  if (!placement) return false;
  item.x = placement.x;
  item.y = placement.y;
  syncSupportedItems();
  return !hasPlacementCollision(item);
}

function placeNewItemSafely(item, preferredSupport) {
  if (item.width > state.booth.width || item.depth > state.booth.depth) return false;
  const snapshot = placementTree(item).map((entry) => ({ ...entry }));
  if (preferredSupport && placeItemOnSurface(item, preferredSupport)) return true;
  restorePlacementItems(snapshot);
  if (autoPlaceItemOnDropSupport(item) && !hasPlacementCollision(item)) return true;
  restorePlacementItems(snapshot);
  return placeOnFreeFloor(item);
}

function applyStandardLayout() {
  if (state.preset === "neotokyo") {
    applyNeoTokyoLayout(true);
    return;
  }
  if (state.preset === "jex") {
    applyJexTwoBoothLayout(true);
    return;
  }
  if (state.preset === "wof") {
    applyWofTwoBoothLayout(true);
    return;
  }
  if (isImfEgfPreset()) {
    applyImfEgfLayout(true);
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
    makeItem("power", "コンセント", 300, 300, "#d85a5a", Math.max(100, w - 450), Math.max(100, d - 500), 0)
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
    makeItem("table", "展示台 1 W1500xD600xH700", 1500, 600, "#f2b84b", 200, 250, 0, 700),
    makeItem("table", "展示台 2 W1500xD600xH700", 1500, 600, "#f2b84b", w - 1700, 250, 0, 700),
    makeItem("table", "展示台 3 W1500xD600xH700", 1500, 600, "#f2b84b", 200, d - 850, 0, 700),
    makeItem("table", "展示台 4 W1500xD600xH700", 1500, 600, "#f2b84b", w - 1700, d - 850, 0, 700),
    makeItem("chair", "イス 1", 450, 450, "#9b8ad6", 1900, 450),
    makeItem("chair", "イス 2", 450, 450, "#9b8ad6", w - 2350, 450),
    makeItem("chair", "イス 3", 450, 450, "#9b8ad6", 1900, d - 950),
    makeItem("chair", "イス 4", 450, 450, "#9b8ad6", w - 2350, d - 950),
    makeItem("spotlight", "アームスポット 1", 350, 350, "#ffd45f", 750, 120, 100),
    makeItem("spotlight", "アームスポット 2", 350, 350, "#ffd45f", 2200, 120, 100),
    makeItem("spotlight", "アームスポット 3", 350, 350, "#ffd45f", 3650, 120, 100),
    makeItem("spotlight", "アームスポット 4", 350, 350, "#ffd45f", 5100, 120, 100),
    makeItem("power", "2口コンセント 左", 300, 300, "#d85a5a", 160, d - 1150, 0),
    makeItem("power", "2口コンセント 右", 300, 300, "#d85a5a", Math.max(160, w - 460), d - 1150, 0)
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
  state.items = [
    makeMasterItem("JEX 2F付属 会議テーブル（黒布巻き） W1500xD600xH700", "JEX 2F付属 黒布巻きテーブル 1", w / 2 - 1500, d - 800),
    makeMasterItem("JEX 2F付属 会議テーブル（黒布巻き） W1500xD600xH700", "JEX 2F付属 黒布巻きテーブル 2", w / 2, d - 800)
  ];
  state.items.forEach(clampItem);
  state.selectedId = state.items[0]?.id || null;
  if (renderNow) render();
}

function makeItem(type, label, width, depth, color, x, y, watt = 0, height = 0, image = "") {
  return {
    id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random()),
    type,
    productCategory: "",
    productCode: "",
    sourceUrl: "",
    catalogReference: "",
    dimensionAccuracy: "",
    scenarioKind: "",
    weightKg: 0,
    surfacePlaceable: false,
    supportSurface: type === "table",
    placementType: "floor",
    surfaceType: type === "table" ? "tabletop" : "",
    allowedSurfaceTypes: ["tabletop", "display-top", "riser-top"],
    supportItemId: "",
    supportOffsetX: 0,
    supportOffsetY: 0,
    supportZOffsetMm: 0,
    label,
    width,
    depth,
    height,
    color,
    watt,
    circuitId: "",
    powerSourceId: "",
    ratedCapacityW: 0,
    cableRouteMode: "x-then-y",
    cableSlackMm: 0,
    personRole: "reference",
    activationMode: "always",
    operationalCategory: "other",
    spaceCategory: "contact",
    requiredAreaMm2: 0,
    inventoryTotalUnits: 0,
    inventoryUnitsPerCarton: 0,
    inventoryReplenishmentCount: 0,
    inventoryCartonWidthMm: 0,
    inventoryCartonDepthMm: 0,
    inventoryCartonHeightMm: 0,
    inventoryMaxStackHeightMm: 0,
    inventoryDimensionsConfirmed: false,
    dimensionsConfirmed: type !== "scenario",
    visibilityRole: "none",
    targetViewHeightMm: 0,
    targetFrontSide: "",
    image,
    x,
    y,
    z: 0,
    rotationDeg: 0,
    rotationQuarterTurns: 0
  };
}

function makeMasterItem(masterLabel, label, x, y, z = 0) {
  const master = itemTypes.find((entry) => entry.label === masterLabel);
  if (!master) throw new Error(`什器マスターが見つかりません: ${masterLabel}`);
  return {
    ...makeItem(master.type, label || master.label, master.width, master.depth, master.color, x, y, master.watt || 0, master.height || 0, master.image || ""),
    masterId: master.masterId,
    productCategory: master.productCategory || "",
    productCode: master.productCode || "",
    sourceUrl: master.sourceUrl || "",
    catalogReference: master.catalogReference || "",
    dimensionAccuracy: master.dimensionAccuracy || "",
    weightKg: master.weightKg || 0,
    surfacePlaceable: master.surfacePlaceable === true,
    supportSurface: master.supportSurface === true,
    placementType: master.placementType || (master.surfacePlaceable ? "surface" : "floor"),
    surfaceType: master.surfaceType || "",
    allowedSurfaceTypes: [...(master.allowedSurfaceTypes || ["tabletop", "display-top", "riser-top"])],
    material: master.material || "",
    dimensionLocked: master.dimensionLocked === true,
    dimensionSource: master.dimensionSource || "",
    model3d: master.model3d ? { ...master.model3d } : undefined,
    setupInfo: master.setupInfo ? { ...master.setupInfo, instructions: [...(master.setupInfo.instructions || [])] } : undefined,
    frontTexture: master.frontTexture || "",
    riserTexture: master.riserTexture || "",
    tierTextures: [...(master.tierTextures || [])],
    referenceImages: [...(master.referenceImages || [])],
    visibilityRole: master.visibilityRole || "none",
    z
  };
}

function applyNeoTokyoLayout(renderNow = true) {
  state.items = [
    makeMasterItem("NEO Plan A 商品展示テーブル W1500xD750xH830", "Plan A 商品展示テーブル 1", 0, 1950),
    makeMasterItem("NEO Plan A 商品展示テーブル W1500xD750xH830", "Plan A 商品展示テーブル 2", 1500, 1950),
    makeMasterItem("NEO Plan A 商談テーブル W1000xD600xH730", "Plan A 商談テーブル", 1000, 350),
    makeMasterItem("NEO レンタル展示テーブルD W1500xD750xH820", "追加レンタル展示テーブルD 1", 3000, 150),
    makeMasterItem("NEO レンタル展示テーブルD W1500xD750xH820", "追加レンタル展示テーブルD 2", 4500, 150),
    makeMasterItem("NEO レンタル展示テーブルD W1500xD750xH820", "追加レンタル展示テーブルD 3", 3750, 1000),
    makeMasterItem("サンニシムラ 壁面吊り下げ看板 W1400xH500xD20", "サンニシムラ 壁面吊り下げ看板", 2300, 0, 1650)
  ];
  state.items.forEach(clampItem);
  state.selectedId = state.items[0]?.id || null;
  if (renderNow) render();
}

function selectedItem() {
  return state.items.find((item) => item.id === state.selectedId) || null;
}

function getFixtureMaster(item) {
  if (item?.type === "scenario" && item.scenarioKind) {
    const scenarioMaster = itemTypes.find((master) => master.type === "scenario" && master.scenarioKind === item.scenarioKind);
    if (scenarioMaster) return scenarioMaster;
  }
  if (!item) return null;
  const byId = itemTypes.find((master) => master.masterId === item.masterId);
  // A category may contain several products. Never let its first entry replace a different code.
  const byProductIdentity = item.productCode && itemTypes.find((master) => master.type === item.type && master.productCode === item.productCode);
  if (byProductIdentity) return byProductIdentity;
  if (item.type === "product" && byId?.type === "product" && !item.productCode) return byId;
  const categoryMatches = !item.productCode && item.productCategory
    ? itemTypes.filter((master) => master.type === item.type && master.productCategory === item.productCategory) : [];
  if (categoryMatches.length === 1) return categoryMatches[0];
  const label = String(item.label || "");
  const knownLabelMaster = itemTypes.find((master) => {
    if (master.type !== item.type) return false;
    if (label.startsWith("Plan A 商品展示テーブル")) return master.masterId === "NEO-PLAN-A-DISPLAY-1500";
    if (label === "Plan A 商談テーブル") return master.masterId === "NEO-PLAN-A-MEETING-1000";
    if (label.startsWith("追加レンタル展示テーブルD")) return master.masterId === "NEO-RENTAL-D-1500";
    if (label.includes("JEX") && label.includes("テーブル")) return master.masterId === "JEX-2F-TABLE-BLACK-1500";
    if (label.includes("サンニシムラ 壁面吊り下げ看板")) return master.masterId === "SANNI-WALL-SIGN-1400";
    return master.label === label;
  });
  if (knownLabelMaster) return knownLabelMaster;
  if (byId && byId.type === item.type && (!byId.dimensionLocked || dimensionsMatchMaster(item, byId))) return byId;
  if (item.type !== "bolda") return null;
  return itemTypes.find((master) => master.type === "bolda" && master.label === item.label)
    || itemTypes.find((master) => master.type === "bolda" && master.boldaCode === item.boldaCode && master.printTheme === item.printTheme)
    || null;
}

function supportChildren(itemOrId) {
  const id = typeof itemOrId === "string" ? itemOrId : itemOrId?.id;
  return state.items.filter((item) => item.supportItemId === id);
}

function createsSupportCycle(itemId, supportId) {
  let currentId = supportId;
  const visited = new Set();
  while (currentId && !visited.has(currentId)) {
    if (currentId === itemId) return true;
    visited.add(currentId);
    currentId = state.items.find((item) => item.id === currentId)?.supportItemId || "";
  }
  return false;
}

function getSupportPlacementDefinition(item, support) {
  if (!item || !support || item.id === support.id || createsSupportCycle(item.id, support.id)) return null;
  const supportMaster = getFixtureMaster(support);
  const exactPosition = supportMaster?.productPlacementPositions?.find((position) => position.itemMasterId === item.masterId);
  if (exactPosition) {
    return {
      kind: "official-fixed",
      source: exactPosition.source || supportMaster.dimensionSource,
      placement: Domain.calculateSupportPlacement(item, support, {
        zOffsetMm: exactPosition.zOffsetMm,
        allowOverhang: exactPosition.allowOverhang === true
      })
    };
  }
  const allowedSurfaceTypes = item.allowedSurfaceTypes || ["tabletop", "display-top", "riser-top"];
  const surfaceType = support.surfaceType || defaultSurfaceType(support);
  if (!support.supportSurface || !allowedSurfaceTypes.includes(surfaceType)) return null;
  const surface = getSupportTop(support);
  const placement = Domain.calculateSupportPlacement(item, surface, { zOffsetMm: surface.height });
  placement.offsetX += surface.x - support.x;
  placement.offsetY += surface.y - support.y;
  return {
    kind: "support-surface",
    source: `${support.label}の登録支持面W/D/H`,
    surface,
    placement
  };
}

function getSupportTop(support) {
  const profile = getFixtureMaster(support)?.supportTop || { x: 0, y: 0, width: 1, depth: 1, height: 1 };
  const display = createThreeDisplayItem(support);
  let x = profile.x * display.width, y = profile.y * display.depth;
  let width = profile.width * display.width, depth = profile.depth * display.depth;
  let boundsW = display.width, boundsD = display.depth;
  for (let turn = 0; turn < ((display.threeQuarterTurns % 4 + 4) % 4); turn += 1) {
    [x, y, width, depth, boundsW, boundsD] = [boundsD - y - depth, x, depth, width, boundsD, boundsW];
  }
  return { ...support, x: support.x + x, y: support.y + y, width, depth, height: (support.height || defaultItemHeight(support)) * profile.height };
}

function freeSurfacePlacement(item, support, maxDistanceMm = Infinity) {
  const surface = getSupportTop(support);
  const placement = Domain.findNearestFreeSupportPlacement(item, surface,
    supportChildren(support).filter((other) => other.id !== item.id), {
      offsetX: item.x - surface.x, offsetY: item.y - surface.y,
      zOffsetMm: surface.height, stepMm: 25, maxDistanceMm
    });
  if (placement) {
    placement.offsetX += surface.x - support.x;
    placement.offsetY += surface.y - support.y;
  }
  return placement;
}

function availableSupportSurfaces(item) {
  if (!item?.surfacePlaceable) return [];
  return state.items.filter((support) => getSupportPlacementDefinition(item, support)?.placement.fits);
}

function findBestDropSupport(item) {
  if (!item?.surfacePlaceable) return null;
  const candidate = Domain.selectBestSupportForDrop(item, availableSupportSurfaces(item).map((support) => {
    const definition = getSupportPlacementDefinition(item, support);
    return { support: definition.surface || support, rootSupport: support, kind: definition.kind, placement: definition.placement };
  }));
  return candidate ? { ...candidate, surface: candidate.support, support: candidate.rootSupport } : null;
}

function autoPlaceItemOnDropSupport(item) {
  const candidate = getDropPlacement(item);
  if (!candidate?.placement || candidate.blocked) return false;
  const { support, kind, placement } = candidate;
  item.supportItemId = support.id;
  if (kind === "official-fixed") {
    item.supportOffsetX = placement.offsetX;
    item.supportOffsetY = placement.offsetY;
    item.supportZOffsetMm = placement.zOffsetMm;
  } else {
    item.supportOffsetX = placement.offsetX;
    item.supportOffsetY = placement.offsetY;
    item.supportZOffsetMm = placement.zOffsetMm;
  }
  syncSupportedItems();
  return true;
}

function getDropPlacement(item, maxDistanceMm = 180) {
  const candidate = findBestDropSupport(item);
  if (!candidate) return null;
  if (candidate.kind === "official-fixed") return candidate;
  const { support } = candidate;
  const placement = freeSurfacePlacement(item, support, maxDistanceMm);
  return { ...candidate, placement: placement || candidate.placement, blocked: !placement };
}

function placementTree(root) {
  const result = [];
  const pending = [root];
  const visited = new Set();
  while (pending.length) {
    const item = pending.pop();
    if (!item || visited.has(item.id)) continue;
    visited.add(item.id);
    result.push(item);
    pending.push(...supportChildren(item));
  }
  return result;
}

function hasPlacementCollision(root) {
  const moving = placementTree(root);
  const ids = new Set(moving.map((item) => item.id));
  const solid = (item) => !["zone", "person", "power", "spotlight", "wall"].includes(item.type);
  return moving.filter(solid).some((item) => state.items.some((other) => {
    if (ids.has(other.id) || !solid(other) || createsSupportCycle(other.id, item.id) || createsSupportCycle(item.id, other.id)) return false;
    const a = getItemVerticalRange(item), b = getItemVerticalRange(other);
    return a.bottom < b.top - 0.1 && a.top > b.bottom + 0.1 && Domain.rectanglesOverlap(item, other);
  }));
}

function restorePlacementItems(snapshot) {
  snapshot.forEach((saved) => {
    const item = state.items.find((entry) => entry.id === saved.id);
    if (item) Object.assign(item, saved);
  });
  syncSupportedItems();
}

function finishItemPlacement(item, snapshot) {
  if (!item) return false;
  const candidate = getDropPlacement(item);
  if (candidate?.blocked) {
    restorePlacementItems(snapshot);
    showEditorMessage("この面には空きがありません。少し位置を変えてください。");
    return false;
  }
  if (candidate) autoPlaceItemOnDropSupport(item);
  else if (item.surfacePlaceable) detachItemFromSupport(item);
  if (hasPlacementCollision(item)) {
    restorePlacementItems(snapshot);
    showEditorMessage("ここはほかの物と重なります。元の位置に戻しました。");
    return false;
  }
  return true;
}

function showEditorMessage(message) {
  const status = $("editorMessage");
  if (!status) return;
  status.textContent = message;
  clearTimeout(showEditorMessage.timer);
  showEditorMessage.timer = setTimeout(() => { status.textContent = ""; }, 4500);
}

function askEditorConfirmation(message, action) {
  $("confirmMessage").textContent = message;
  askEditorConfirmation.action = action;
  $("editorConfirmDialog").showModal();
}

function detachItemFromSupport(item, clampToBooth = true, syncNow = true) {
  if (!item) return;
  item.supportItemId = "";
  item.supportOffsetX = 0;
  item.supportOffsetY = 0;
  item.supportZOffsetMm = 0;
  item.z = 0;
  if (clampToBooth) clampItem(item);
  if (syncNow) syncSupportedItems();
}

function syncSupportedItems() {
  const byId = new Map(state.items.map((item) => [item.id, item]));
  state.items.forEach((item) => {
    if (!item.supportItemId) return;
    const support = byId.get(item.supportItemId);
    if (!support || createsSupportCycle(item.id, support.id)) detachItemFromSupport(item, false, false);
  });
  for (let pass = 0; pass < state.items.length; pass += 1) {
    let changed = false;
    state.items.forEach((item) => {
      if (!item.supportItemId) return;
      const support = byId.get(item.supportItemId);
      if (!support) return;
      const definition = getSupportPlacementDefinition(item, support);
      if (!definition?.placement.fits) {
        detachItemFromSupport(item, false, false);
        changed = true;
        return;
      }
      if (definition.kind === "official-fixed") {
        item.supportOffsetX = definition.placement.offsetX;
        item.supportOffsetY = definition.placement.offsetY;
        item.supportZOffsetMm = definition.placement.zOffsetMm;
      } else {
        const surface = definition.surface;
        const minX = surface.x - support.x, minY = surface.y - support.y;
        item.supportOffsetX = Math.max(minX, Math.min(minX + surface.width - item.width, Domain.finiteNumber(item.supportOffsetX, definition.placement.offsetX)));
        item.supportOffsetY = Math.max(minY, Math.min(minY + surface.depth - item.depth, Domain.finiteNumber(item.supportOffsetY, definition.placement.offsetY)));
        item.supportZOffsetMm = surface.height;
      }
      const nextX = support.x + item.supportOffsetX;
      const nextY = support.y + item.supportOffsetY;
      const nextZ = (support.z || 0) + item.supportZOffsetMm;
      if (item.x !== nextX || item.y !== nextY || item.z !== nextZ) changed = true;
      item.x = nextX;
      item.y = nextY;
      item.z = nextZ;
    });
    if (!changed) break;
  }
}

function moveItemTo(item, x, y) {
  if (!item) return;
  if (item.supportItemId) {
    const support = state.items.find((candidate) => candidate.id === item.supportItemId);
    const definition = getSupportPlacementDefinition(item, support);
    if (!support || !definition?.placement.fits) {
      detachItemFromSupport(item, false, false);
      item.x = x;
      item.y = y;
      clampItem(item);
    } else if (definition.kind === "support-surface") {
      const surface = definition.surface;
      item.supportOffsetX = Math.max(surface.x - support.x, Math.min(surface.x - support.x + surface.width - item.width, x - support.x));
      item.supportOffsetY = Math.max(surface.y - support.y, Math.min(surface.y - support.y + surface.depth - item.depth, y - support.y));
    }
  } else {
    item.x = x;
    item.y = y;
    clampItem(item);
  }
  syncSupportedItems();
}

function placeSelectedOnSupport() {
  const item = selectedItem();
  const support = state.items.find((candidate) => candidate.id === $("itemSupportId").value);
  const definition = getSupportPlacementDefinition(item, support);
  if (!item || !support || !definition?.placement.fits) {
    alert("選択した台には実寸のまま載せられません。台のW/Dまたは組合せを確認してください。");
    return;
  }
  const snapshot = placementTree(item).map((entry) => ({ ...entry }));
  if (!placeItemOnSurface(item, support)) {
    restorePlacementItems(snapshot);
    showEditorMessage("この台には空きがありません。別の台を選んでください。");
  }
  render();
}

function detachSelectedFromSupport() {
  const item = selectedItem();
  if (!item?.supportItemId) return;
  const snapshot = placementTree(item).map((entry) => ({ ...entry }));
  if (!placeOnFreeFloor(item)) {
    restorePlacementItems(snapshot);
    showEditorMessage("床に空きがありません。先に置く場所を空けてください。");
  }
  render();
}

function expectedMasterPlanDimensions(item, master) {
  const oddTurn = itemRotationQuarterTurns(item) % 2 === 1;
  return oddTurn
    ? { width: master.depth, depth: master.width, height: master.height || 0 }
    : { width: master.width, depth: master.depth, height: master.height || 0 };
}

function dimensionsMatchMaster(item, master) {
  if (!master) return true;
  const expected = expectedMasterPlanDimensions(item, master);
  return item.width === expected.width && item.depth === expected.depth && (item.height || 0) === expected.height;
}

function resetSelectedToMasterDimensions() {
  const item = selectedItem();
  const master = getFixtureMaster(item);
  if (!item || !master) return;
  const expected = expectedMasterPlanDimensions(item, master);
  item.width = expected.width;
  item.depth = expected.depth;
  item.height = expected.height;
  clampItem(item);
  render();
}

function paletteDetail(item) {
  if (item.model3d?.kind === "printed-pop-panel") return `W${item.width}×H${item.height}mm・板厚5mm仮・固定具別途`;
  if (item.dimensionAccuracy === "planning-average") return `参考サイズ W${item.width}×D${item.depth}×H${item.height}mm`;
  if (item.type === "zone") return `用途領域 ${formatSquareMetres(item.width * item.depth)}㎡・必要面積を要登録`;
  if (item.type === "scenario") return `仮W${item.width}×D${item.depth}×H${item.height || "未登録"}mm・実測必須`;
  if (item.type === "spotlight") return `${item.watt}W`;
  if (item.type === "power") return "回路容量は未登録";
  if (item.type === "powerstrip") return "定格容量は未登録";
  if (item.type === "device") return "消費電力・寸法を要入力";
  return itemSizeLabel(item);
}

function updateSelectedFromForm() {
  const item = selectedItem();
  if (!item) return;
  const snapshot = placementTree(item).map((entry) => ({ ...entry }));
  const master = getFixtureMaster(item);
  const desiredX = Number($("itemX").value) || 0;
  const desiredY = Number($("itemY").value) || 0;
  item.label = $("itemLabel").value;
  if (!master?.dimensionLocked) {
    item.width = Math.max(1, Number($("itemWidth").value) || 1);
    item.depth = Math.max(1, Number($("itemDepth").value) || 1);
    const heightInput = $("itemHeight").value.trim();
    item.height = heightInput ? Math.max(1, Number(heightInput) || 1) : 0;
  }
  if (!item.supportItemId) item.z = Math.max(0, Number($("itemZ").value) || 0);
  if (supportsWattInput(item)) {
    item.watt = Math.max(0, Number($("itemWatt").value) || 0);
  }
  if (item.type === "power") item.circuitId = $("itemCircuitId").value;
  if (item.type === "powerstrip") item.ratedCapacityW = Math.max(0, Number($("itemRatedCapacity").value) || 0);
  if (isPoweredLoad(item)) {
    item.powerSourceId = $("itemPowerSourceId").value;
    item.cableRouteMode = $("itemCableRouteMode").value === "y-then-x" ? "y-then-x" : "x-then-y";
    item.cableSlackMm = Math.max(0, Number($("itemCableSlack").value) || 0);
  }
  if (item.type === "person") item.personRole = $("itemPersonRole").value;
  if (["person", "scenario", "zone"].includes(item.type)) item.activationMode = $("itemActivationMode").value;
  if (item.type === "scenario") {
    item.operationalCategory = $("itemOperationalCategory").value;
    item.dimensionsConfirmed = $("itemDimensionsConfirmed").checked;
  }
  if (item.type === "zone") {
    item.height = 0;
    item.z = 0;
    item.spaceCategory = $("itemSpaceCategory").value;
    item.requiredAreaMm2 = Math.max(0, Domain.finiteNumber($("itemRequiredAreaM2").value, 0) * 1000000);
    item.inventoryTotalUnits = Math.max(0, Math.ceil(Domain.finiteNumber($("itemInventoryTotalUnits").value, 0)));
    item.inventoryUnitsPerCarton = Math.max(0, Math.ceil(Domain.finiteNumber($("itemInventoryUnitsPerCarton").value, 0)));
    item.inventoryReplenishmentCount = Math.max(0, Math.floor(Domain.finiteNumber($("itemInventoryReplenishmentCount").value, 0)));
    item.inventoryCartonWidthMm = Math.max(0, Domain.finiteNumber($("itemInventoryCartonWidth").value, 0));
    item.inventoryCartonDepthMm = Math.max(0, Domain.finiteNumber($("itemInventoryCartonDepth").value, 0));
    item.inventoryCartonHeightMm = Math.max(0, Domain.finiteNumber($("itemInventoryCartonHeight").value, 0));
    item.inventoryMaxStackHeightMm = Math.max(0, Domain.finiteNumber($("itemInventoryMaxStackHeight").value, 0));
    item.inventoryDimensionsConfirmed = $("itemInventoryDimensionsConfirmed").checked;
  }
  if (canBeVisibilityTarget(item)) {
    item.visibilityRole = $("itemVisibilityRole").value;
    item.targetViewHeightMm = Math.max(0, Number($("itemTargetViewHeight").value) || 0);
    item.targetFrontSide = $("itemTargetFrontSide").value;
  }
  moveItemTo(item, desiredX, desiredY);
  if (item.width > state.booth.width || item.depth > state.booth.depth || snapshot.some((entry) => entry.supportItemId && !state.items.find((candidate) => candidate.id === entry.id)?.supportItemId) || hasPlacementCollision(item)) {
    restorePlacementItems(snapshot);
    showEditorMessage("その寸法・位置では物が重なるか、台に収まりません。変更を戻しました。");
  }
  render();
}

function rotateSelected() {
  const item = selectedItem();
  if (!item) return;
  const support = state.items.find((candidate) => candidate.id === item.supportItemId);
  const currentDefinition = getSupportPlacementDefinition(item, support);
  if (currentDefinition?.kind === "official-fixed") {
    alert("メーカー指定の組合せ配置です。向きを変える場合は支持台側を先に回転してください。");
    return;
  }
  const snapshot = placementTree(item).map((entry) => ({ ...entry }));
  const oldById = new Map(snapshot.map((entry) => [entry.id, entry]));
  placementTree(item).forEach((entry) => {
    const old = oldById.get(entry.id);
    [entry.width, entry.depth] = [old.depth, old.width];
    entry.rotationDeg = Domain.normalizeRotationDegrees((old.rotationDeg || itemRotationQuarterTurns(old) * 90) + 90);
    entry.rotationQuarterTurns = entry.rotationDeg / 90;
    const oldParent = oldById.get(old.supportItemId);
    if (oldParent) {
      entry.supportOffsetX = oldParent.depth - old.supportOffsetY - old.depth;
      entry.supportOffsetY = old.supportOffsetX;
    }
  });
  const old = snapshot[0];
  moveItemTo(item, old.x + (old.width - item.width) / 2, old.y + (old.depth - item.depth) / 2);
  if (item.width > state.booth.width || item.depth > state.booth.depth || (support && !getSupportPlacementDefinition(item, support)?.placement.fits) || hasPlacementCollision(item)) {
    restorePlacementItems(snapshot);
    showEditorMessage("回転する空きがありません。位置を変えてから回転してください。");
  }
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
  const tree = placementTree(selectedItem());
  const ids = new Set(tree.map((item) => item.id));
  const remove = () => {
    state.items = state.items.filter((item) => !ids.has(item.id));
    state.selectedId = null;
    syncSupportedItems();
    render();
  };
  if (tree.length > 1) askEditorConfirmation(`上に載っている${tree.length - 1}点も一緒に削除します。元に戻すで復元できます。`, remove);
  else remove();
}

function duplicateSelected() {
  const source = selectedItem();
  if (!source) return;
  const tree = placementTree(source);
  const ids = new Map(tree.map((entry) => [entry.id, crypto.randomUUID()]));
  const copies = tree.map((entry) => ({ ...structuredClone(entry), id: ids.get(entry.id), supportItemId: ids.get(entry.supportItemId) || "" }));
  const copy = copies[0];
  copy.label = `${source.label}（複製）`;
  copy.x += 50;
  copy.y += 50;
  state.items.push(...copies);
  if (!placeNewItemSafely(copy, state.items.find((entry) => entry.id === source.supportItemId))) {
    state.items = state.items.filter((entry) => !copies.includes(entry));
    showEditorMessage("複製を置く空きがありません。");
    return;
  }
  state.selectedId = copy.id;
  render();
}

function onKeyDown(event) {
  const editingText = ["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement.tagName);
  const command = event.ctrlKey || event.metaKey;
  if (!editingText && command && event.key.toLowerCase() === "z") {
    event.preventDefault();
    if (event.shiftKey) redoDesignChange(); else undoDesignChange();
    return;
  }
  if (!editingText && command && event.key.toLowerCase() === "y") {
    event.preventDefault();
    redoDesignChange();
    return;
  }
  if (!editingText && command && event.key.toLowerCase() === "d" && state.selectedId) {
    event.preventDefault();
    duplicateSelected();
    return;
  }
  if (editingText || !state.selectedId) return;
  if (event.key === "Delete" || event.key === "Backspace") {
    event.preventDefault();
    deleteSelected();
  }
}

function resetLayout() {
  askEditorConfirmation("配置したものをすべて削除します。元に戻すで復元できます。", () => {
    state.items = [];
    state.selectedId = null;
    resetCanvasView();
    closeMobilePanel();
    render();
  });
}

function clampItems() {
  normalizeItems();
  state.items.filter((item) => !item.supportItemId).forEach(clampItem);
  syncSupportedItems();
}

function normalizeItems() {
  state.items.forEach((item) => {
    hydrateLegacyItem(item);
    const master = getFixtureMaster(item);
    const migratedMaster = Boolean(master && item.masterId !== master.masterId);
    if (master) item.masterId = master.masterId;
    item.productCategory = String(item.productCategory || master?.productCategory || "");
    item.productCode = String(item.productCode || master?.productCode || "");
    item.sourceUrl = String(item.sourceUrl || master?.sourceUrl || "");
    item.catalogReference = String(item.catalogReference || master?.catalogReference || "");
    item.dimensionAccuracy = String(item.dimensionAccuracy || master?.dimensionAccuracy || "");
    item.scenarioKind = String(item.scenarioKind || master?.scenarioKind || "");
    item.monitorScreenId = item.scenarioKind === "monitor" && Object.hasOwn(monitorScreens, item.monitorScreenId) ? item.monitorScreenId : "";
    item.weightKg = Math.max(0, Domain.finiteNumber(item.weightKg, master?.weightKg || 0));
    if (master && (migratedMaster || !item.material)) item.material = master.material || "";
    if (master && (migratedMaster || !item.dimensionSource)) item.dimensionSource = master.dimensionSource || "";
    if (master?.frontTexture && (master.dimensionLocked || !item.frontTexture)) item.frontTexture = master.frontTexture;
    item.surfacePlaceable = master ? master.surfacePlaceable === true : item.surfacePlaceable === true;
    item.supportSurface = master ? master.supportSurface === true : supportsPlacementSurfaceByDefault(item);
    item.placementType = String(item.placementType || master?.placementType || (item.surfacePlaceable ? "surface" : "floor"));
    item.surfaceType = item.supportSurface ? String(item.surfaceType || master?.surfaceType || defaultSurfaceType(item)) : "";
    item.allowedSurfaceTypes = [...(Array.isArray(item.allowedSurfaceTypes) ? item.allowedSurfaceTypes : master?.allowedSurfaceTypes || ["tabletop", "display-top", "riser-top"] )];
    item.supportItemId = String(item.supportItemId || "");
    item.supportOffsetX = Domain.finiteNumber(item.supportOffsetX, 0);
    item.supportOffsetY = Domain.finiteNumber(item.supportOffsetY, 0);
    item.supportZOffsetMm = Math.max(0, Domain.finiteNumber(item.supportZOffsetMm, 0));
    item.rotationDeg = Domain.normalizeRotationDegrees(item.rotationDeg ?? (Number(item.rotationQuarterTurns) || 0) * 90);
    item.rotationQuarterTurns = item.rotationDeg / 90;
    item.z = Math.max(0, Domain.finiteNumber(item.z, 0));
    item.circuitId = String(item.circuitId || "");
    item.powerSourceId = String(item.powerSourceId || "");
    item.ratedCapacityW = Math.max(0, Domain.finiteNumber(item.ratedCapacityW, 0));
    item.cableRouteMode = item.cableRouteMode === "y-then-x" ? "y-then-x" : "x-then-y";
    item.cableSlackMm = Math.max(0, Domain.finiteNumber(item.cableSlackMm, 0));
    item.personRole = ["reference", "visitor", "staff", "crowd"].includes(item.personRole) ? item.personRole : "reference";
    item.activationMode = ["always", "operating", "crowded"].includes(item.activationMode) ? item.activationMode : "always";
    item.operationalCategory = ["stock", "packing", "bag", "waste", "promotion", "pc", "cable", "other"].includes(item.operationalCategory) ? item.operationalCategory : "other";
    item.spaceCategory = ["contact", "staff", "inventory"].includes(item.spaceCategory) ? item.spaceCategory : "contact";
    item.requiredAreaMm2 = Math.max(0, Domain.finiteNumber(item.requiredAreaMm2, 0));
    item.inventoryTotalUnits = Math.max(0, Math.ceil(Domain.finiteNumber(item.inventoryTotalUnits, 0)));
    item.inventoryUnitsPerCarton = Math.max(0, Math.ceil(Domain.finiteNumber(item.inventoryUnitsPerCarton, 0)));
    item.inventoryReplenishmentCount = Math.max(0, Math.floor(Domain.finiteNumber(item.inventoryReplenishmentCount, 0)));
    item.inventoryCartonWidthMm = Math.max(0, Domain.finiteNumber(item.inventoryCartonWidthMm, 0));
    item.inventoryCartonDepthMm = Math.max(0, Domain.finiteNumber(item.inventoryCartonDepthMm, 0));
    item.inventoryCartonHeightMm = Math.max(0, Domain.finiteNumber(item.inventoryCartonHeightMm, 0));
    item.inventoryMaxStackHeightMm = Math.max(0, Domain.finiteNumber(item.inventoryMaxStackHeightMm, 0));
    item.inventoryDimensionsConfirmed = item.inventoryDimensionsConfirmed === true;
    item.dimensionsConfirmed = item.type === "scenario" ? item.dimensionsConfirmed === true : true;
    item.visibilityRole = ["none", "main-product", "product", "pop"].includes(item.visibilityRole) ? item.visibilityRole : "none";
    item.targetViewHeightMm = Math.max(0, Domain.finiteNumber(item.targetViewHeightMm, 0));
    item.targetFrontSide = ["top", "right", "bottom", "left"].includes(item.targetFrontSide) ? item.targetFrontSide : "";
    if (item.type === "power") {
      item.watt = 0;
      item.width = item.width || 300;
      item.depth = item.depth || 300;
    }
    if (item.type === "zone") {
      item.height = 0;
      item.z = 0;
    }
    if (item.type === "powerstrip") {
      item.watt = 0;
      item.width = item.width || 300;
      item.depth = item.depth || 150;
    }
    if (item.type === "device") {
      item.watt = Math.max(0, Domain.finiteNumber(item.watt, 0));
      item.width = item.width || 300;
      item.depth = item.depth || 300;
    }
    if (item.type === "spotlight") {
      item.watt = Math.max(0, Domain.finiteNumber(item.watt, 100));
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
      item.height = 700;
      item.material = "黒布巻き";
      item.label = item.label.includes("左") ? "JEX 2F付属 黒布巻きテーブル 1" : "JEX 2F付属 黒布巻きテーブル 2";
    }
  });
  syncSupportedItems();
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
  if (item.supportItemId) return;
  // Never shrink catalog dimensions to fit a booth.
  item.x = Math.min(Math.max(0, item.x), Math.max(0, state.booth.width - item.width));
  item.y = Math.min(Math.max(0, item.y), Math.max(0, state.booth.depth - item.depth));
}

function render() {
  normalizePowerCircuits();
  normalizeItems();
  syncOperationMode();
  operationalAudit = getOperationalAudit();
  spaceAudit = getSpaceAudit();
  inventoryAudit = getInventoryAudit();
  recordHistorySnapshot();
  syncHeader();
  syncPowerCircuitEditor();
  syncSelectionEditor();
  syncMobileUi();
  syncView();
  drawCanvas();
  renderTable();
  renderSubmissionSummary();
  renderAgents();
  syncHistoryButtons();
  autosave();
}

function historySnapshot() {
  return JSON.stringify({ ...state, selectedId: null, view: "layout" });
}

function recordHistorySnapshot() {
  if (historyApplying || drag) return;
  const snapshot = historySnapshot();
  if (historyPast[historyPast.length - 1] === snapshot) return;
  historyPast.push(snapshot);
  if (historyPast.length > 60) historyPast.shift();
  historyFuture.length = 0;
}

function restoreHistorySnapshot(snapshot) {
  const previousSelectedId = state.selectedId;
  historyApplying = true;
  try {
    applyLoadedState(JSON.parse(snapshot));
    if (state.items.some((item) => item.id === previousSelectedId)) state.selectedId = previousSelectedId;
    render();
  } finally {
    historyApplying = false;
  }
  syncHistoryButtons();
}

function undoDesignChange() {
  if (historyPast.length < 2) return;
  historyFuture.push(historyPast.pop());
  restoreHistorySnapshot(historyPast[historyPast.length - 1]);
}

function redoDesignChange() {
  if (!historyFuture.length) return;
  const snapshot = historyFuture.pop();
  historyPast.push(snapshot);
  restoreHistorySnapshot(snapshot);
}

function syncHistoryButtons() {
  $("undoBtn").disabled = historyPast.length < 2;
  $("redoBtn").disabled = historyFuture.length === 0;
  if ($("mobileUndoBtn")) $("mobileUndoBtn").disabled = historyPast.length < 2;
}

function syncMobileUi() {
  const item = selectedItem();
  const selectionSheet = $("mobileSelectionSheet");
  selectionSheet.classList.toggle("hidden", !item || state.view !== "layout" || !$("mobileAddDrawer").classList.contains("hidden"));
  if (item) {
    $("mobileSelectionName").textContent = compactLabel(item.label);
    const support = state.items.find((candidate) => candidate.id === item.supportItemId);
    $("mobileSelectionMeta").textContent = `${itemSizeLabel(item)}・${Domain.normalizeRotationDegrees(item.rotationDeg)}°${support ? `・${support.label}の上` : "・床置き"}`;
  }
  $("mobileViewBtn").textContent = state.view === "preview3d" ? "配置図" : "3D・表示";
}

function syncHeader() {
  $("workspaceTitle").textContent = state.eventName || "ブースをつくる";
  $("sheetTitle").textContent = state.eventName ? `${state.eventName} 展示ブース配置図` : "展示ブース配置図";
  $("metaBoothNo").textContent = state.boothNo || "-";
  $("metaCompany").textContent = state.companyName || "-";
  $("metaDate").textContent = new Date().toLocaleDateString("ja-JP");
  $("boothSpec").textContent = state.booth.spaceOnly
    ? `W${state.booth.width} x D${state.booth.depth}mm / 公式スペース渡し・装飾高上限H${state.booth.heightLimitMm || "未登録"}mm${hasPlannedBackPanel() ? ` / 自社計画背面パネル W${state.booth.plannedBackPanelWidthMm} x H${state.booth.plannedBackPanelHeightMm} x D${state.booth.plannedBackPanelThicknessMm}mm（仮）` : ""} / 通路側: ${sideLabel(state.booth.aisleSide)} / 状態: ${operationModeLabel(state.operationMode)}`
    : `W${state.booth.width} x D${state.booth.depth} x 壁H${state.booth.wallHeight}mm / 壁側: ${sideLabel(state.booth.wallSide)} / 通路側: ${sideLabel(state.booth.aisleSide)} / 状態: ${operationModeLabel(state.operationMode)}`;
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
  $("itemHeight").value = item.height ? Math.round(item.height) : "";
  $("itemHeight").placeholder = item.height ? "" : `未登録（3D仮寸法 ${defaultItemHeight(item)}mm）`;
  $("itemX").value = Math.round(item.x);
  $("itemY").value = Math.round(item.y);
  $("itemZ").value = Math.round(item.z || 0);
  $("itemRotation").value = `${Domain.normalizeRotationDegrees(item.rotationDeg)}°`;
  const master = getFixtureMaster(item);
  ["itemWidth", "itemDepth"].forEach((id) => $(id).disabled = Boolean(master?.dimensionLocked));
  $("itemHeight").disabled = Boolean(master?.dimensionLocked) || item.type === "zone";
  $("itemZ").disabled = Boolean(item.supportItemId) || item.type === "zone";
  $("resetMasterDimensionsBtn").classList.toggle("hidden", !master?.dimensionLocked || dimensionsMatchMaster(item, master));
  syncSelectedMeasurements(item);
  syncFixtureMasterInfo(item, master);
  syncSurfacePlacementEditor(item);
  $("monitorScreenFields").classList.toggle("hidden", item.scenarioKind !== "monitor");
  $("itemMonitorScreen").value = item.monitorScreenId || "";
  $("wattField").classList.toggle("hidden", !supportsWattInput(item));
  $("wattFieldLabel").textContent = item.type === "spotlight"
    ? "照明消費電力 W"
    : item.scenarioKind === "laptop" ? "ACアダプタ消費電力 W" : "機器消費電力 W";
  $("itemWatt").value = item.watt || 0;
  $("circuitField").classList.toggle("hidden", item.type !== "power");
  $("itemCircuitId").innerHTML = `<option value="">未割当</option>${state.powerCircuits.map((circuit) => `<option value="${escapeHtml(circuit.id)}">${escapeHtml(circuit.name)} / ${circuit.capacityW ? `${circuit.capacityW}W` : "容量未登録"}</option>`).join("")}`;
  $("itemCircuitId").value = item.circuitId || "";
  $("ratedCapacityField").classList.toggle("hidden", item.type !== "powerstrip");
  $("itemRatedCapacity").value = item.ratedCapacityW || "";
  const powered = isPoweredLoad(item);
  $("powerConnectionFields").classList.toggle("hidden", !powered);
  if (powered) syncPowerConnectionEditor(item);
  $("personRoleField").classList.toggle("hidden", item.type !== "person");
  $("itemPersonRole").value = item.personRole || "reference";
  const modeScoped = ["person", "scenario", "zone"].includes(item.type);
  $("activationModeField").classList.toggle("hidden", !modeScoped);
  $("itemActivationMode").value = item.activationMode || "always";
  $("scenarioFields").classList.toggle("hidden", item.type !== "scenario");
  $("itemOperationalCategory").value = item.operationalCategory || "other";
  $("itemDimensionsConfirmed").checked = item.dimensionsConfirmed === true;
  $("spaceFields").classList.toggle("hidden", item.type !== "zone");
  $("itemSpaceCategory").value = item.spaceCategory || "contact";
  $("itemRequiredAreaM2").value = item.requiredAreaMm2 ? formatSquareMetres(item.requiredAreaMm2) : "";
  const inventoryZone = item.type === "zone" && item.spaceCategory === "inventory";
  $("inventoryFields").classList.toggle("hidden", !inventoryZone);
  $("itemInventoryTotalUnits").value = item.inventoryTotalUnits || "";
  $("itemInventoryUnitsPerCarton").value = item.inventoryUnitsPerCarton || "";
  $("itemInventoryReplenishmentCount").value = item.inventoryReplenishmentCount || 0;
  $("itemInventoryCartonWidth").value = item.inventoryCartonWidthMm || "";
  $("itemInventoryCartonDepth").value = item.inventoryCartonDepthMm || "";
  $("itemInventoryCartonHeight").value = item.inventoryCartonHeightMm || "";
  $("itemInventoryMaxStackHeight").value = item.inventoryMaxStackHeightMm || "";
  $("itemInventoryDimensionsConfirmed").checked = item.inventoryDimensionsConfirmed === true;
  syncSelectedSpaceResult(item);
  syncSelectedInventoryResult(item);
  const targetCapable = canBeVisibilityTarget(item);
  $("visibilityRoleField").classList.toggle("hidden", !targetCapable);
  $("itemVisibilityRole").value = item.visibilityRole || "none";
  const visibilityEnabled = targetCapable && item.visibilityRole !== "none";
  $("visibilitySettings").classList.toggle("hidden", !visibilityEnabled);
  if (visibilityEnabled) {
    $("itemTargetViewHeight").value = item.targetViewHeightMm || "";
    $("itemTargetFrontSide").value = item.targetFrontSide || "";
    syncSelectedVisibilityResult(item);
  }
}

function syncSurfacePlacementEditor(item) {
  const wrap = $("surfacePlacementFields");
  const show = item?.surfacePlaceable === true;
  wrap.classList.toggle("hidden", !show);
  if (!show) return;
  const supports = availableSupportSurfaces(item);
  const currentSupport = state.items.find((candidate) => candidate.id === item.supportItemId);
  $("itemSupportId").innerHTML = supports.length
    ? supports.map((support) => `<option value="${escapeHtml(support.id)}">${escapeHtml(support.label)}</option>`).join("")
    : '<option value="">実寸適合する机・専用台なし</option>';
  if (currentSupport && supports.some((support) => support.id === currentSupport.id)) $("itemSupportId").value = currentSupport.id;
  $("placeOnSupportBtn").disabled = !supports.length;
  $("detachFromSupportBtn").classList.toggle("hidden", !item.supportItemId);
  syncSurfacePlacementPreview();
}

function syncSurfacePlacementPreview() {
  const item = selectedItem();
  const info = $("surfacePlacementInfo");
  if (!item?.surfacePlaceable) {
    info.textContent = "";
    return;
  }
  const support = state.items.find((candidate) => candidate.id === $("itemSupportId").value);
  const definition = getSupportPlacementDefinition(item, support);
  if (!support || !definition?.placement.fits) {
    info.textContent = "先に実寸が収まる机または専用台を配置してください。" + (getFixtureMaster(item)?.placementNotice || "");
    return;
  }
  const placement = definition.placement;
  if (!advancedMode) {
    info.textContent = (item.supportItemId ? `${state.items.find((entry) => entry.id === item.supportItemId)?.label || "台"}の上に配置中` : "床に配置中。台へドラッグしても載せられます。") + (getFixtureMaster(item)?.placementNotice ? ` ${getFixtureMaster(item).placementNotice}` : "");
    return;
  }
  const overhang = placement.maximumOverhangMm > 0 ? `｜メーカー指定張り出し 最大${placement.maximumOverhangMm}mm` : "｜天板内に収容";
  const current = item.supportItemId === support.id ? "配置中" : "配置候補";
  const position = current === "配置中" ? item : placement;
  info.textContent = `${current}: ${support.label}｜X${Math.round(position.x)} Y${Math.round(position.y)} Z${Math.round(position.z)}mm｜上端H${Math.round(position.z + item.height)}mm${overhang}`;
}

function canBeVisibilityTarget(item) {
  return Boolean(item && ["table", "fixture", "bolda", "wall", "device", "product"].includes(item.type));
}

function visibilityRoleLabel(role) {
  return { "main-product": "メイン商品", product: "商品", pop: "POP" }[role] || "未設定";
}

function personRoleLabel(role) {
  return { reference: "寸法比較", visitor: "来場者", staff: "スタッフ", crowd: "混雑負荷" }[role] || "寸法比較";
}

function syncSelectedVisibilityResult(item) {
  const result = operationalAudit?.targets.find((entry) => entry.item.id === item.id);
  if (!result) {
    $("visibilityResult").textContent = "注視高さと表示面の正面を登録すると、視線遮蔽と到達経路を検査します。";
    return;
  }
  const visibilityText = result.missingSettings.length
    ? `判定不能: ${result.missingSettings.join("・")}`
    : `視認 ${result.visibleViews}/${result.viewpoints.length}視点${result.blockers.length ? `｜遮蔽物: ${result.blockers.map((entry) => entry.label).join("、")}` : "｜遮蔽なし"}`;
  const visitorText = result.visitorPath?.found ? `来場者経路 約${Math.round(result.visitorPath.lengthMm)}mm` : "来場者経路なし";
  const staffText = result.staffPath ? (result.staffPath.found ? `スタッフ経路 約${Math.round(result.staffPath.lengthMm)}mm` : "スタッフ経路なし") : "スタッフ起点未登録";
  $("visibilityResult").textContent = `${visibilityText}｜${visitorText}｜${staffText}`;
}

function syncSelectedSpaceResult(item) {
  const wrap = $("spaceResult");
  if (item?.type !== "zone") {
    wrap.textContent = "";
    return;
  }
  const result = spaceAudit?.zones.find((entry) => entry.item.id === item.id);
  if (!result) {
    wrap.textContent = "現在の状態では無効です。保存・編集は維持しますが、床面積検査と提出対象から除外します。";
    return;
  }
  const required = item.requiredAreaMm2 > 0 ? `${formatSquareMetres(item.requiredAreaMm2)}㎡` : "未登録";
  wrap.textContent = `計画${formatSquareMetres(result.areaMm2)}㎡｜障害物${formatSquareMetres(result.occupiedMm2)}㎡｜通路到達${formatSquareMetres(result.publicReachableMm2)}㎡｜スタッフ到達${result.staffReachableMm2 === null ? "起点未登録" : `${formatSquareMetres(result.staffReachableMm2)}㎡`}｜必要${required}`;
}

function syncSelectedInventoryResult(item) {
  const wrap = $("inventoryResult");
  if (item?.type !== "zone" || item.spaceCategory !== "inventory") {
    wrap.textContent = "";
    return;
  }
  const entry = inventoryAudit?.entries.find((candidate) => candidate.item.id === item.id);
  if (!entry) {
    wrap.textContent = "現在の状態では無効です。登録値は保存されますが容量検査から除外します。";
    return;
  }
  if (!entry.capacity.complete) {
    wrap.textContent = `判定不能: ${inventoryMissingFieldLabels(entry.capacity.missingFields).join("・")}`;
    return;
  }
  const capacity = entry.capacity;
  wrap.textContent = `必要ピーク${capacity.peakCartons}箱（総${capacity.totalCartons}箱・均等補充${capacity.replenishmentCount}回）｜容量${capacity.capacityCartons}箱（1段${capacity.cartonsPerLayer}箱×${capacity.layers}段）${capacity.shortageCartons ? `｜不足${capacity.shortageCartons}箱` : "｜不足なし"}`;
}

function isPoweredLoad(item) {
  return Boolean(item && (
    ["spotlight", "device", "powerstrip"].includes(item.type) ||
    (item.type === "scenario" && item.operationalCategory === "pc") ||
    isProductElectricalLoad(item)
  ));
}

function isProductElectricalLoad(item) {
  return Boolean(item?.type === "product" && (
    String(item.productCategory || "").startsWith("frame-heater-") ||
    String(item.productCategory || "").startsWith("buff-motor-") ||
    item.productCategory === "ultrasonic-cleaner"
  ));
}

function supportsWattInput(item) {
  return Boolean(item && (
    ["spotlight", "device"].includes(item.type) ||
    (item.type === "scenario" && item.operationalCategory === "pc") ||
    isProductElectricalLoad(item)
  ));
}

function availablePowerSources(item) {
  const allowedTypes = item.type === "powerstrip" ? ["power"] : ["power", "powerstrip"];
  return state.items.filter((candidate) => candidate.id !== item.id && allowedTypes.includes(candidate.type));
}

function getPowerSource(item) {
  return state.items.find((candidate) => candidate.id === item.powerSourceId) || null;
}

function syncPowerConnectionEditor(item) {
  const sources = availablePowerSources(item);
  $("itemPowerSourceId").innerHTML = `<option value="">未接続</option>${sources.map((source) => `<option value="${escapeHtml(source.id)}">${escapeHtml(source.label)}（${typeLabel(source.type)}）</option>`).join("")}`;
  $("itemPowerSourceId").value = sources.some((source) => source.id === item.powerSourceId) ? item.powerSourceId : "";
  $("itemCableRouteMode").value = item.cableRouteMode || "x-then-y";
  $("itemCableSlack").value = Math.round(item.cableSlackMm || 0);
  const route = getCableRouteData(item);
  $("powerRouteInfo").textContent = route
    ? `配線長 ${Math.round(route.totalLengthMm)}mm（平面${Math.round(route.planLengthMm)} + 高低差${Math.round(route.verticalLengthMm)} + 余長${Math.round(route.slackMm)}）${route.crossings.length ? `｜什器横断: ${route.crossings.map((entry) => entry.label).join("、")}` : "｜什器横断なし"}`
    : "給電元を選ぶと、直交配線長と什器横断をmm単位で検査します。";
}

function getCableRouteData(item) {
  if (!isPoweredLoad(item)) return null;
  const source = getPowerSource(item);
  if (!source) return null;
  const points = Domain.orthogonalRoute(source, item, item.cableRouteMode);
  const planLengthMm = Domain.polylineLength(points);
  const verticalLengthMm = Math.abs(getItemVerticalRange(source).center - getItemVerticalRange(item).center);
  const slackMm = Math.max(0, Domain.finiteNumber(item.cableSlackMm, 0));
  const ignoredTypes = ["wall", "power", "spotlight", "person", "zone"];
  const crossings = state.items.filter((obstacle) =>
    obstacle.id !== item.id && obstacle.id !== source.id && !ignoredTypes.includes(obstacle.type) && Domain.routeIntersectsRectangle(points, obstacle)
  );
  return { item, source, points, planLengthMm, verticalLengthMm, slackMm, totalLengthMm: planLengthMm + verticalLengthMm + slackMm, crossings };
}

function resolveCircuitForLoad(item) {
  const source = getPowerSource(item);
  if (!source) return null;
  const outlet = source.type === "power" ? source : source.type === "powerstrip" ? getPowerSource(source) : null;
  if (!outlet || outlet.type !== "power") return null;
  return state.powerCircuits.find((circuit) => circuit.id === outlet.circuitId) || null;
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
  document.body.classList.toggle("view-preview3d", state.view === "preview3d");
  document.querySelectorAll(".view-btn").forEach((button) => {
    button.classList.toggle("active", button.dataset.view === state.view);
  });
  $("layoutView").classList.toggle("hidden", state.view !== "layout");
  $("listView").classList.toggle("hidden", state.view !== "list");
  $("preview3dView").classList.toggle("hidden", state.view !== "preview3d");
  if (state.view === "preview3d") {
    $("preview3dTitle").textContent = `${state.eventName || "展示ブース"} 3D配置確認`;
    $("preview3dSpec").textContent = state.booth.spaceOnly
      ? `W${state.booth.width} x D${state.booth.depth}mm / 公式スペース渡し${hasPlannedBackPanel() ? `＋自社計画背面パネルW${state.booth.plannedBackPanelWidthMm} x H${state.booth.plannedBackPanelHeightMm}mm（仮）` : ""} / 装飾高上限H${state.booth.heightLimitMm || "未登録"}mm / 通路: ${sideLabel(state.booth.aisleSide)} / ${operationModeLabel(state.operationMode)}`
      : `W${state.booth.width} x D${state.booth.depth} x H${state.booth.wallHeight}mm / 通路: ${sideLabel(state.booth.aisleSide)} / ${operationModeLabel(state.operationMode)}`;
    $("viewerEyeHeight").value = Math.round(state.viewerEyeHeight || 1600);
    draw3dScene();
    syncThreeSelectionUi();
    $("imagePrompt").value = buildImagePrompt();
    renderRealBoothReferences();
    renderFurnitureImageReferences();
    renderBoldaImageReferences();
  }
}

function layoutCanvasPadding() {
  return printRenderMode ? 44 : dimensionsVisible ? 58 : canvas.width < 600 ? 24 : 40;
}

function drawCanvas() {
  const padding = layoutCanvasPadding();
  const usableW = canvas.width - padding * 2;
  const usableH = canvas.height - padding * 2;
  const baseScale = Math.min(usableW / state.booth.width, usableH / state.booth.depth);
  scale = baseScale * (printRenderMode ? 1 : canvasView.zoom);
  const boothPxW = state.booth.width * scale;
  const boothPxH = state.booth.depth * scale;
  origin = {
    x: (canvas.width - boothPxW) / 2 + (printRenderMode ? 0 : canvasView.panX),
    y: (canvas.height - boothPxH) / 2 + (printRenderMode ? 0 : canvasView.panY)
  };

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawGrid(boothPxW, boothPxH);
  drawBooth(boothPxW, boothPxH);
  drawJointSplit();
  state.items.filter((item) => item.type === "zone").forEach(drawItem);
  if (advancedMode || printRenderMode) {
    drawSpaceAnalysis();
    drawPowerRoutes();
    drawOperationalOverlays();
  }
  state.items.filter((item) => item.type !== "zone").sort((a, b) => getItemVerticalRange(a).bottom - getItemVerticalRange(b).bottom).forEach(drawItem);
  if (!printRenderMode) drawDropPreview();
  if (!printRenderMode && dimensionsVisible) drawSelectedMeasurements(selectedItem());
  if (!printRenderMode) drawSelectionOutline(selectedItem());
  if (!printRenderMode) state.items.forEach(drawThinItemHandle);
  if (dimensionsVisible || printRenderMode) drawDimensions(boothPxW, boothPxH);
}

// A real 1.6 mm sheet is sub-pixel in a booth plan. Give thin objects a visible
// editing handle, separate from their physical footprint and printed dimensions.
function thinItemHandle(item) {
  if (!["product", "fixture", "wall", "device", "scenario"].includes(item.type)) return null;
  const pixelRatio = canvas.width / Math.max(1, canvas.getBoundingClientRect().width);
  if (Math.min(item.width, item.depth) * scale >= 8 * pixelRatio) return null;
  const width = 132 * pixelRatio, height = 32 * pixelRatio;
  return { x: origin.x + (item.x + item.width / 2) * scale - width / 2,
    y: origin.y + (item.y + item.depth / 2) * scale - height / 2, width, height, pixelRatio };
}

function drawThinItemHandle(item) {
  const handle = thinItemHandle(item);
  if (!handle) return;
  const { x, y, width, height, pixelRatio } = handle;
  ctx.save();
  ctx.fillStyle = item.id === state.selectedId ? "#d9f4ee" : "#ffffff";
  ctx.strokeStyle = "#007f78";
  ctx.lineWidth = 1.5 * pixelRatio;
  ctx.fillRect(x, y, width, height);
  ctx.strokeRect(x, y, width, height);
  ctx.fillStyle = "#075f58";
  ctx.font = `bold ${11 * pixelRatio}px sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(fitCanvasText(`↔ ${compactLabel(item.label)}`, width - 12 * pixelRatio), x + width / 2, y + height / 2);
  ctx.restore();
}

function drawDropPreview() {
  if (!dropPreview?.support || !dropPreview?.placement) return;
  const support = dropPreview.surface || dropPreview.support;
  const placement = dropPreview.placement;
  ctx.save();
  ctx.fillStyle = dropPreview.blocked ? "rgba(183, 67, 55, .12)" : "rgba(19, 147, 123, 0.12)";
  ctx.strokeStyle = dropPreview.blocked ? "#b74337" : "rgba(0, 111, 127, 0.88)";
  ctx.lineWidth = 2;
  ctx.setLineDash([7, 5]);
  ctx.fillRect(origin.x + support.x * scale, origin.y + support.y * scale, support.width * scale, support.depth * scale);
  ctx.strokeRect(origin.x + placement.x * scale, origin.y + placement.y * scale, (selectedItem()?.width || 0) * scale, (selectedItem()?.depth || 0) * scale);
  ctx.setLineDash([]);
  ctx.fillStyle = "#006f7f";
  ctx.font = "bold 11px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(dropPreview.blocked ? "ここには収まりません" : "ここに置けます", origin.x + (placement.x + (selectedItem()?.width || 0) / 2) * scale, origin.y + placement.y * scale - 7);
  ctx.restore();
}

function drawSelectionOutline(item) {
  if (!item) return;
  const centerX = origin.x + (item.x + item.width / 2) * scale;
  const centerY = origin.y + (item.y + item.depth / 2) * scale;
  const width = Math.max(22, item.width * scale + 8);
  const height = Math.max(22, item.depth * scale + 8);
  ctx.save();
  ctx.strokeStyle = "#007f78";
  ctx.lineWidth = 2.5;
  ctx.setLineDash([]);
  ctx.strokeRect(centerX - width / 2, centerY - height / 2, width, height);
  [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([sx, sy]) => {
    ctx.fillStyle = "#fff";
    ctx.strokeStyle = "#007f78";
    ctx.beginPath();
    ctx.arc(centerX + sx * width / 2, centerY + sy * height / 2, 3.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  });
  ctx.restore();
}

function drawGrid(boothPxW, boothPxH) {
  ctx.save();
  const grid = dimensionsVisible || printRenderMode ? Domain.sanitizeGridSize(state.gridSize) : 500;
  for (let mm = 0; mm <= state.booth.width; mm += grid) {
    const major500 = mm % 500 === 0;
    const major100 = mm % 100 === 0;
    ctx.strokeStyle = major500 ? "#cbd7d9" : major100 ? "#dfe7e8" : "rgba(223,231,232,.42)";
    ctx.lineWidth = major500 ? 1.2 : 1;
    const x = origin.x + mm * scale;
    line(x, origin.y, x, origin.y + boothPxH);
  }
  for (let mm = 0; mm <= state.booth.depth; mm += grid) {
    const major500 = mm % 500 === 0;
    const major100 = mm % 100 === 0;
    ctx.strokeStyle = major500 ? "#cbd7d9" : major100 ? "#dfe7e8" : "rgba(223,231,232,.42)";
    ctx.lineWidth = major500 ? 1.2 : 1;
    const y = origin.y + mm * scale;
    line(origin.x, y, origin.x + boothPxW, y);
  }
  ctx.restore();
}

function drawSelectedMeasurements(item) {
  if (!item) return;
  const x = origin.x + item.x * scale;
  const y = origin.y + item.y * scale;
  const w = item.width * scale;
  const h = item.depth * scale;
  const clearances = Domain.wallClearances(item, state.booth);
  ctx.save();
  ctx.strokeStyle = "#006f7f";
  ctx.fillStyle = "#005461";
  ctx.lineWidth = 1;
  ctx.setLineDash([4, 3]);
  ctx.font = "bold 10px sans-serif";
  ctx.textAlign = "center";
  line(origin.x, y + h / 2, x, y + h / 2);
  line(x + w, y + h / 2, origin.x + state.booth.width * scale, y + h / 2);
  line(x + w / 2, origin.y, x + w / 2, y);
  line(x + w / 2, y + h, x + w / 2, origin.y + state.booth.depth * scale);
  ctx.setLineDash([]);
  ctx.fillText(`左 ${Math.round(clearances.left)}`, (origin.x + x) / 2, y + h / 2 - 4);
  ctx.fillText(`右 ${Math.round(clearances.right)}`, (x + w + origin.x + state.booth.width * scale) / 2, y + h / 2 - 4);
  ctx.fillText(`上 ${Math.round(clearances.top)}`, x + w / 2, Math.max(origin.y + 11, (origin.y + y) / 2));
  ctx.fillText(`下 ${Math.round(clearances.bottom)}`, x + w / 2, Math.min(origin.y + state.booth.depth * scale - 4, (y + h + origin.y + state.booth.depth * scale) / 2));
  ctx.restore();
}

function drawBooth(boothPxW, boothPxH) {
  ctx.save();
  ctx.fillStyle = "#ffffff";
  ctx.strokeStyle = "#182629";
  ctx.lineWidth = 3;
  ctx.strokeRect(origin.x, origin.y, boothPxW, boothPxH);

  if (!state.booth.spaceOnly) {
    ["top", "bottom", "left", "right"].forEach((side) => {
      if (side === state.booth.aisleSide) return;
      ctx.strokeStyle = state.booth.wallColorHex || (side === state.booth.wallSide ? "#23875b" : "#7bcb9d");
      ctx.lineWidth = side === state.booth.wallSide ? 10 : 5;
      drawShellSide2d(side, boothPxW, boothPxH);
    });
  } else if (hasPlannedBackPanel()) {
    ctx.strokeStyle = "#5d7fb4";
    ctx.lineWidth = 10;
    drawSide(state.booth.wallSide, boothPxW, boothPxH);
  }

  ctx.fillStyle = "#334346";
  const boothLabelFont = printRenderMode ? 58 : 16;
  ctx.font = `${boothLabelFont}px sans-serif`;
  ctx.textAlign = "center";
  ctx.fillText(state.booth.spaceOnly ? `${hasPlannedBackPanel() ? "公式スペース渡し / 自社計画背面パネル（仮）" : "スペース渡し（壁未登録）"} / 通路側: ${sideLabel(state.booth.aisleSide)}` : `壁側: ${sideLabel(state.booth.wallSide)} / 通路側: ${sideLabel(state.booth.aisleSide)}`, origin.x + boothPxW / 2, origin.y + boothPxH + (printRenderMode ? 88 : 36));
  ctx.restore();
}

function hasPlannedBackPanel() {
  return state.booth.plannedBackPanelWidthMm > 0 && state.booth.plannedBackPanelHeightMm > 0;
}

function effectiveShellHeight() {
  if (hasPlannedBackPanel()) return state.booth.plannedBackPanelHeightMm;
  return state.booth.spaceOnly ? (state.booth.heightLimitMm || 0) : state.booth.wallHeight;
}

function drawSide(side, boothPxW, boothPxH) {
  if (side === "top") line(origin.x, origin.y, origin.x + boothPxW, origin.y);
  if (side === "bottom") line(origin.x, origin.y + boothPxH, origin.x + boothPxW, origin.y + boothPxH);
  if (side === "left") line(origin.x, origin.y, origin.x, origin.y + boothPxH);
  if (side === "right") line(origin.x + boothPxW, origin.y, origin.x + boothPxW, origin.y + boothPxH);
}

function drawJointSplit() {
  if (state.preset === "neotokyo") {
    const splitX = origin.x + 3000 * scale;
    const top = origin.y;
    const height = state.booth.depth * scale;
    ctx.save();
    ctx.setLineDash([8, 7]);
    ctx.strokeStyle = "#8a6500";
    ctx.lineWidth = printRenderMode ? 7 : 2;
    line(splitX, top, splitX, top + height);
    ctx.setLineDash([]);
    ctx.fillStyle = "#6d5200";
    ctx.font = `bold ${printRenderMode ? 42 : 11}px sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillText("1コマ目 W3000", origin.x + 1500 * scale, top + Math.max(6, height * 0.02));
    ctx.fillText("2コマ目 W3000", origin.x + 4500 * scale, top + Math.max(6, height * 0.02));
    ctx.restore();
    return;
  }
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

function drawShellSide2d(side, boothPxW, boothPxH) {
  if (side === state.booth.wallSide || !state.booth.sideReturnDepthMm) {
    drawSide(side, boothPxW, boothPxH);
    return;
  }
  const returnPx = state.booth.sideReturnDepthMm * scale;
  if ((state.booth.wallSide === "top" || state.booth.wallSide === "bottom") && (side === "left" || side === "right")) {
    const x = side === "left" ? origin.x : origin.x + boothPxW;
    if (state.booth.wallSide === "top") line(x, origin.y, x, origin.y + Math.min(boothPxH, returnPx));
    else line(x, origin.y + boothPxH, x, origin.y + boothPxH - Math.min(boothPxH, returnPx));
    return;
  }
  if ((state.booth.wallSide === "left" || state.booth.wallSide === "right") && (side === "top" || side === "bottom")) {
    const y = side === "top" ? origin.y : origin.y + boothPxH;
    if (state.booth.wallSide === "left") line(origin.x, y, origin.x + Math.min(boothPxW, returnPx), y);
    else line(origin.x + boothPxW, y, origin.x + boothPxW - Math.min(boothPxW, returnPx), y);
    return;
  }
  drawSide(side, boothPxW, boothPxH);
}

function drawPowerRoutes() {
  state.items.filter(isPoweredLoad).forEach((item) => {
    const route = getCableRouteData(item);
    if (!route) return;
    ctx.save();
    ctx.strokeStyle = route.crossings.length ? "#b43434" : item.id === state.selectedId ? "#006f7f" : "#d26834";
    ctx.fillStyle = route.crossings.length ? "#8f2424" : "#8a421f";
    ctx.lineWidth = printRenderMode ? 14 : item.id === state.selectedId ? 4 : 2.5;
    ctx.setLineDash(printRenderMode ? [28, 18] : [9, 6]);
    ctx.beginPath();
    route.points.forEach((point, index) => {
      const x = origin.x + point.x * scale;
      const y = origin.y + point.y * scale;
      if (index === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    });
    ctx.stroke();
    ctx.setLineDash([]);
    const labelPoint = route.points[Math.floor(route.points.length / 2)];
    ctx.font = `bold ${printRenderMode ? 42 : 10}px sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "bottom";
    ctx.fillText(`配線 ${Math.round(route.totalLengthMm)}mm`, origin.x + labelPoint.x * scale, origin.y + labelPoint.y * scale - (printRenderMode ? 18 : 4));
    ctx.restore();
  });
}

function drawOperationalOverlays() {
  const selected = selectedItem();
  if (!selected || selected.visibilityRole === "none") return;
  const result = operationalAudit?.targets.find((entry) => entry.item.id === selected.id);
  if (!result) return;
  const target = Domain.rectangleCenter(selected);
  result.viewpointResults.forEach((entry) => {
    ctx.save();
    ctx.strokeStyle = entry.visible ? "rgba(31, 143, 92, .72)" : "rgba(180, 52, 52, .72)";
    ctx.lineWidth = printRenderMode ? 10 : 1.5;
    ctx.setLineDash(entry.visible ? [] : (printRenderMode ? [24, 16] : [6, 4]));
    line(origin.x + entry.viewpoint.x * scale, origin.y + entry.viewpoint.y * scale, origin.x + target.x * scale, origin.y + target.y * scale);
    ctx.restore();
  });
  drawMovementPath(result.visitorPath, "#176bb3", "来場者");
  drawMovementPath(result.staffPath, "#7847a8", "スタッフ");
}

function drawMovementPath(path, color, label) {
  if (!path?.found || !path.points.length) return;
  ctx.save();
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = printRenderMode ? 13 : 3;
  ctx.beginPath();
  path.points.forEach((point, index) => {
    const x = origin.x + point.x * scale;
    const y = origin.y + point.y * scale;
    if (index === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  });
  ctx.stroke();
  const midpoint = path.points[Math.floor(path.points.length / 2)];
  ctx.font = `bold ${printRenderMode ? 40 : 10}px sans-serif`;
  ctx.textAlign = "center";
  ctx.fillText(`${label} 約${Math.round(path.lengthMm)}mm`, origin.x + midpoint.x * scale, origin.y + midpoint.y * scale - (printRenderMode ? 16 : 4));
  ctx.restore();
}

function drawSpaceAnalysis() {
  if (!spaceAudit?.deadCells.length) return;
  ctx.save();
  ctx.fillStyle = printRenderMode ? "rgba(180, 52, 52, .20)" : "rgba(180, 52, 52, .13)";
  ctx.strokeStyle = "rgba(143, 36, 36, .38)";
  ctx.lineWidth = printRenderMode ? 5 : 1;
  spaceAudit.deadCells.forEach((cell) => {
    const x = origin.x + cell.x * scale;
    const y = origin.y + cell.y * scale;
    const w = cell.width * scale;
    const h = cell.depth * scale;
    ctx.fillRect(x, y, w, h);
    ctx.beginPath();
    ctx.moveTo(x, y + h);
    ctx.lineTo(x + w, y);
    ctx.stroke();
  });
  ctx.restore();
}

function drawItem(item) {
  const active = isItemActive(item);
  if (printRenderMode && !active) return;
  if (item.type === "zone") {
    drawSpaceZone(item);
    return;
  }
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
  ctx.globalAlpha = active ? 1 : 0.28;
  ctx.fillStyle = item.color;
  ctx.strokeStyle = selected ? "#111" : "rgba(0,0,0,0.45)";
  ctx.lineWidth = selected ? 3 : 1.5;
  ctx.setLineDash(active ? [] : [6, 4]);
  ctx.fillRect(x, y, w, h);
  ctx.strokeRect(x, y, w, h);
  ctx.setLineDash([]);
  ctx.fillStyle = item.model3d?.kind === "rotating-net-display" ? "#ffffff" : "#132124";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  drawItemText(item, x, y, w, h);
  drawVisibilityBadge(item, x, y, w, h);
  drawActivationBadge(item, x, y, w, h);
  drawSupportBadge(item, x, y, w, h);
  ctx.restore();
}

function drawSupportBadge(item, x, y, w, h) {
  if (!advancedMode && !printRenderMode) return;
  if (!item.supportItemId) return;
  ctx.save();
  ctx.globalAlpha = 1;
  ctx.fillStyle = "#075f58";
  ctx.font = `bold ${printRenderMode ? 34 : 9}px sans-serif`;
  ctx.textAlign = "right";
  ctx.textBaseline = "top";
  ctx.fillText(`机上 Z${Math.round(item.z || 0)}`, x + w - Math.max(3, w * 0.03), y + Math.max(3, h * 0.03));
  ctx.restore();
}

function drawSpaceZone(item) {
  const x = origin.x + item.x * scale;
  const y = origin.y + item.y * scale;
  const w = item.width * scale;
  const h = item.depth * scale;
  const active = isItemActive(item);
  const selected = item.id === state.selectedId;
  const color = { contact: "#188778", staff: "#6b55a3", inventory: "#9a6b37" }[item.spaceCategory] || "#188778";
  ctx.save();
  ctx.globalAlpha = active ? 1 : 0.28;
  ctx.fillStyle = `${color}20`;
  ctx.strokeStyle = selected ? "#111" : color;
  ctx.lineWidth = selected ? 3 : 2;
  ctx.setLineDash(active ? [8, 5] : [4, 5]);
  ctx.fillRect(x, y, w, h);
  ctx.strokeRect(x, y, w, h);
  ctx.setLineDash([]);
  ctx.fillStyle = color;
  ctx.font = `bold ${printRenderMode ? 42 : 11}px sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const capacity = item.spaceCategory === "inventory"
    ? inventoryAudit?.entries.find((entry) => entry.item.id === item.id)?.capacity
    : null;
  const capacityText = capacity?.complete ? ` ${capacity.capacityCartons}/${capacity.peakCartons}箱` : "";
  ctx.fillText(fitCanvasText(`${spaceCategoryLabel(item.spaceCategory)} ${formatSquareMetres(item.width * item.depth)}㎡${capacityText}`, Math.max(10, w - 8)), x + w / 2, y + h / 2);
  drawActivationBadge(item, x, y, w, h);
  ctx.restore();
}

function drawActivationBadge(item, x, y, w, h) {
  if (!advancedMode && !printRenderMode) return;
  if (!["scenario", "person", "zone"].includes(item.type) || item.activationMode === "always") return;
  ctx.save();
  ctx.globalAlpha = 1;
  ctx.fillStyle = isItemActive(item) ? "#5f3a0a" : "#5d6668";
  ctx.font = `bold ${printRenderMode ? 34 : 9}px sans-serif`;
  ctx.textAlign = "right";
  ctx.textBaseline = "bottom";
  ctx.fillText(isItemActive(item) ? operationModeLabel(state.operationMode) : "現在は無効", x + w - Math.max(3, w * 0.03), y + h - Math.max(3, h * 0.03));
  ctx.restore();
}

function drawVisibilityBadge(item, x, y, w, h) {
  if (!advancedMode && !printRenderMode) return;
  if (!canBeVisibilityTarget(item) || item.visibilityRole === "none") return;
  const badge = visibilityRoleLabel(item.visibilityRole);
  ctx.save();
  ctx.fillStyle = item.visibilityRole === "main-product" ? "#9b2c2c" : item.visibilityRole === "pop" ? "#805d00" : "#006f7f";
  ctx.font = `bold ${printRenderMode ? 36 : 9}px sans-serif`;
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.fillText(badge, x + Math.max(3, w * 0.03), y + Math.max(3, h * 0.03));
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
  const active = isItemActive(item);
  ctx.globalAlpha = active ? 1 : 0.25;
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
  ctx.fillText(`${seated ? "着座" : "立位"} 179cm / ${personRoleLabel(item.personRole)}${active ? "" : " / 現在無効"}`, cx, y + h - Math.max(3, h * 0.05));
  ctx.restore();
}

function drawItemText(item, x, y, w, h) {
  const name = compactLabel(item.label) || typeLabel(item.type);
  const size = compactSizeLabel(item);
  const padX = Math.max(printRenderMode ? 18 : 4, Math.min(w * 0.08, printRenderMode ? 42 : 10));
  const padY = Math.max(printRenderMode ? 14 : 4, Math.min(h * 0.12, printRenderMode ? 34 : 8));
  const availableW = Math.max(8, w - padX * 2);
  const availableH = Math.max(8, h - padY * 2);
  const lines = (!dimensionsVisible && !printRenderMode) || availableH < (printRenderMode ? 92 : 24) ? [name] : [name, size];
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
    .replace(/^bolda AS01/, "ヨーカン棒 AS01")
    .replace(/\s*W\d+.*$/i, "")
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
  if (advancedMode || printRenderMode) ctx.fillText(`${item.watt || 0}W`, x + w / 2, y + h * 0.82);
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
  canvas.focus({ preventScroll: true });
  if (event.button > 0) return;
  canvasPointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
  canvas.setPointerCapture(event.pointerId);
  if (canvasPointers.size > 1) {
    if (drag) restorePlacementItems(drag.snapshot);
    drag = null;
    canvasPan = null;
    dropPreview = null;
    const points = [...canvasPointers.values()];
    const center = { clientX: (points[0].x + points[1].x) / 2, clientY: (points[0].y + points[1].y) / 2 };
    canvasGesture = { distance: Math.max(1, Math.hypot(points[1].x - points[0].x, points[1].y - points[0].y)), zoom: canvasView.zoom, anchor: canvasToMm(center) };
    drawCanvas();
    return;
  }
  const point = canvasToMm(event);
  const minimumTargetMm = (event.pointerType === "touch" ? 44 : 24) * canvas.width / canvas.getBoundingClientRect().width / scale;
  const hit = (candidate) => {
    const padX = Math.max(0, (minimumTargetMm - candidate.width) / 2);
    const padY = Math.max(0, (minimumTargetMm - candidate.depth) / 2);
    return point.x >= candidate.x - padX && point.x <= candidate.x + candidate.width + padX &&
      point.y >= candidate.y - padY && point.y <= candidate.y + candidate.depth + padY;
  };
  const reversed = state.items
    .map((candidate, index) => ({ candidate, index }))
    .sort((a, b) => getItemVerticalRange(b.candidate).bottom - getItemVerticalRange(a.candidate).bottom || b.index - a.index)
    .map((entry) => entry.candidate);
  // Handles are painted last. Their exact visible rectangles must win even
  // when a lamp, table or other object's enlarged hit target is above the sheet.
  const canvasPoint = { x: origin.x + point.x * scale, y: origin.y + point.y * scale };
  const handleItem = [...state.items].reverse().find((candidate) => {
    const handle = thinItemHandle(candidate);
    return handle && canvasPoint.x >= handle.x && canvasPoint.x <= handle.x + handle.width &&
      canvasPoint.y >= handle.y && canvasPoint.y <= handle.y + handle.height;
  });
  const item = handleItem || reversed.find((candidate) => candidate.type !== "zone" && hit(candidate))
    || reversed.find((candidate) => candidate.type === "zone" && hit(candidate));
  state.selectedId = item ? item.id : null;
  if (item) {
    drag = { id: item.id, pointerId: event.pointerId, dx: point.x - item.x, dy: point.y - item.y,
      startClientX: event.clientX, startClientY: event.clientY, moved: false,
      snapshot: placementTree(item).map((entry) => ({ ...entry })) };
  } else {
    canvasPan = { pointerId: event.pointerId, x: event.clientX, y: event.clientY, panX: canvasView.panX, panY: canvasView.panY };
  }
  render();
}

function onPointerMove(event) {
  if (canvasPointers.has(event.pointerId)) canvasPointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
  const rect = canvas.getBoundingClientRect();
  if (canvasGesture && canvasPointers.size > 1) {
    const points = [...canvasPointers.values()];
    const distance = Math.hypot(points[1].x - points[0].x, points[1].y - points[0].y);
    canvasView.zoom = Math.max(0.65, Math.min(6, canvasGesture.zoom * distance / canvasGesture.distance));
    const inset = layoutCanvasPadding() * 2;
    const newScale = Math.min((canvas.width - inset) / state.booth.width, (canvas.height - inset) / state.booth.depth) * canvasView.zoom;
    const x = ((points[0].x + points[1].x) / 2 - rect.left) * canvas.width / rect.width;
    const y = ((points[0].y + points[1].y) / 2 - rect.top) * canvas.height / rect.height;
    canvasView.panX = x - canvasGesture.anchor.x * newScale - (canvas.width - state.booth.width * newScale) / 2;
    canvasView.panY = y - canvasGesture.anchor.y * newScale - (canvas.height - state.booth.depth * newScale) / 2;
    drawCanvas();
    return;
  }
  if (canvasPan?.pointerId === event.pointerId) {
    canvasView.panX = canvasPan.panX + (event.clientX - canvasPan.x) * canvas.width / rect.width;
    canvasView.panY = canvasPan.panY + (event.clientY - canvasPan.y) * canvas.height / rect.height;
    drawCanvas();
    return;
  }
  if (!drag) return;
  if (drag.pointerId !== event.pointerId) return;
  if (!drag.moved && Math.hypot(event.clientX - drag.startClientX, event.clientY - drag.startClientY) < 5) return;
  drag.moved = true;
  const item = state.items.find((candidate) => candidate.id === drag.id);
  if (!item) return;
  const point = canvasToMm(event);
  const nextX = Domain.snapMm(point.x - drag.dx, state.gridSize, state.snapEnabled);
  const nextY = Domain.snapMm(point.y - drag.dy, state.gridSize, state.snapEnabled);
  if (item.supportItemId && (nextX !== item.x || nextY !== item.y)) detachItemFromSupport(item, false, false);
  moveItemTo(item, nextX, nextY);
  dropPreview = getDropPlacement(item);
  if (dropPreview && !dropPreview.blocked) {
    item.z = dropPreview.placement.z;
    syncSupportedItems();
  } else if (item.surfacePlaceable) {
    item.z = 0;
    syncSupportedItems();
  }
  drawCanvas();
}

function endDrag(event) {
  canvasPointers.delete(event.pointerId);
  if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
  if (canvasGesture) {
    if (canvasPointers.size < 2) canvasGesture = null;
    canvasPan = null;
    return;
  }
  canvasPan = null;
  const finished = drag;
  const droppedItem = finished ? state.items.find((item) => item.id === finished.id) : null;
  drag = null;
  dropPreview = null;
  if (finished?.moved) {
    if (event.type === "pointerup") finishItemPlacement(droppedItem, finished.snapshot);
    else restorePlacementItems(finished.snapshot);
  }
  render();
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
    tr.tabIndex = 0;
    tr.setAttribute("role", "button");
    tr.setAttribute("aria-label", `${item.label}を選択`);
    tr.classList.toggle("selected-row", item.id === state.selectedId);
    const power = itemPowerSummaryText(item);
    const modeNote = ["scenario", "person", "zone"].includes(item.type) && item.activationMode !== "always" ? `<br><small>${escapeHtml(activationModeLabel(item.activationMode))}${isItemActive(item) ? "・有効" : "・現在無効"}</small>` : "";
    const support = state.items.find((candidate) => candidate.id === item.supportItemId);
    const supportNote = support ? `<br><small>机上: ${escapeHtml(support.label)}</small>` : "";
    tr.innerHTML = `<td>${typeLabel(item.type)}</td><td>${escapeHtml(item.label)}${modeNote}${supportNote}</td><td>${itemSizeLabel(item)}</td><td>X${Math.round(item.x)} / Y${Math.round(item.y)} / Z${Math.round(item.z || 0)}mm / ${Domain.normalizeRotationDegrees(item.rotationDeg)}°</td><td>${escapeHtml(power)}</td><td>1</td>`;
    const selectRow = () => {
      state.selectedId = item.id;
      render();
    };
    tr.addEventListener("click", selectRow);
    tr.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      selectRow();
    });
    tbody.append(tr);
  });
}

function itemPowerSummaryText(item) {
  if (item.type === "power") {
    const circuit = state.powerCircuits.find((entry) => entry.id === item.circuitId);
    return circuit ? `${circuit.name} / ${circuit.capacityW ? `${circuit.capacityW}W` : "容量未登録"}` : "回路未割当";
  }
  if (!isPoweredLoad(item)) return "-";
  const source = getPowerSource(item);
  const route = getCableRouteData(item);
  const load = item.type === "powerstrip"
    ? `定格${item.ratedCapacityW ? `${item.ratedCapacityW}W` : "未登録"}`
    : item.watt > 0 ? `${item.watt}W` : "消費電力未登録";
  return `${load} / ${source ? source.label : "未接続"}${route ? ` / 配線${Math.round(route.totalLengthMm)}mm` : ""}`;
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

function syntheticAisleViewpoints() {
  const radius = state.routeClearanceMm / 2;
  const side = state.booth.aisleSide;
  const horizontal = side === "top" || side === "bottom";
  const span = horizontal ? state.booth.width : state.booth.depth;
  return [0.25, 0.5, 0.75].map((ratio, index) => {
    const along = Math.max(radius, Math.min(span - radius, span * ratio));
    return {
      id: `aisle-sample-${index + 1}`,
      label: `通路入口サンプル${index + 1}`,
      x: side === "left" ? radius : side === "right" ? state.booth.width - radius : along,
      y: side === "top" ? radius : side === "bottom" ? state.booth.depth - radius : along,
      z: state.viewerEyeHeight,
      synthetic: true
    };
  });
}

function personViewpoint(item) {
  const center = Domain.rectangleCenter(item);
  return { id: item.id, label: item.label, x: center.x, y: center.y, z: state.viewerEyeHeight, synthetic: false };
}

function movementObstacleItems(target) {
  return state.items.filter((item) => {
    if (!isItemActive(item) || item.id === target.id || ["power", "spotlight", "zone"].includes(item.type)) return false;
    if (item.type === "person") return item.personRole === "crowd";
    const vertical = getItemVerticalRange(item);
    return vertical.bottom < 1800 && vertical.top > 0;
  });
}

function targetApproachPoint(item) {
  if (!item.targetFrontSide) return null;
  const center = Domain.rectangleCenter(item);
  const radius = state.routeClearanceMm / 2;
  const point = { x: center.x, y: center.y };
  if (item.targetFrontSide === "top") point.y = item.y - radius;
  if (item.targetFrontSide === "bottom") point.y = item.y + item.depth + radius;
  if (item.targetFrontSide === "left") point.x = item.x - radius;
  if (item.targetFrontSide === "right") point.x = item.x + item.width + radius;
  if (point.x < radius || point.x > state.booth.width - radius || point.y < radius || point.y > state.booth.depth - radius) return null;
  return point;
}

function bestMovementPath(starts, end, obstacles) {
  if (!starts.length || !end) return null;
  const results = starts.map((start) => ({
    start,
    ...Domain.findGridPath({
      booth: state.booth,
      start,
      end,
      obstacles,
      cellSize: state.routeGridMm,
      clearanceMm: state.routeClearanceMm
    })
  }));
  return results.filter((result) => result.found).sort((a, b) => a.lengthMm - b.lengthMm)[0]
    || results.sort((a, b) => b.visitedCells - a.visitedCells)[0];
}

function getOperationalAudit() {
  const currentItems = activeItems();
  const targets = currentItems.filter((item) => canBeVisibilityTarget(item) && item.visibilityRole !== "none");
  const visitors = currentItems.filter((item) => item.type === "person" && item.personRole === "visitor");
  const staff = currentItems.filter((item) => item.type === "person" && item.personRole === "staff");
  const crowd = currentItems.filter((item) => item.type === "person" && item.personRole === "crowd");
  const viewpoints = visitors.length ? visitors.map(personViewpoint) : syntheticAisleViewpoints();
  const unknownObstacleHeights = currentItems.filter((item) => !["power", "spotlight", "wall", "person", "zone"].includes(item.type) && !item.height);
  const targetResults = targets.map((item) => {
    const missingSettings = [];
    if (!(item.targetViewHeightMm > 0)) missingSettings.push("注視高さ未登録");
    if (!item.targetFrontSide) missingSettings.push("表示面の正面未登録");
    const targetCenter = Domain.rectangleCenter(item);
    const targetPoint = { ...targetCenter, z: item.targetViewHeightMm || getItemVerticalRange(item).center };
    const obstacleItems = currentItems.filter((obstacle) => !["power", "spotlight", "zone"].includes(obstacle.type) && obstacle.id !== item.id && !(obstacle.type === "person" && obstacle.personRole === "reference"));
    const viewpointResults = viewpoints.map((viewpoint) => {
      const facing = item.targetFrontSide ? Domain.facingSideContainsPoint(item, item.targetFrontSide, viewpoint) : false;
      const blockers = missingSettings.length ? [] : obstacleItems.filter((obstacle) => {
        if (obstacle.id === viewpoint.id) return false;
        const vertical = getItemVerticalRange(obstacle);
        return Domain.lineOfSightBlocked(viewpoint, targetPoint, { ...obstacle, bottom: vertical.bottom, top: vertical.top });
      });
      return { viewpoint, facing, blockers, visible: !missingSettings.length && facing && blockers.length === 0 };
    });
    const blockers = [...new Map(viewpointResults.flatMap((entry) => entry.blockers).map((entry) => [entry.id, entry])).values()];
    const approach = targetApproachPoint(item);
    const movementObstacles = movementObstacleItems(item).map((obstacle) => ({ x: obstacle.x, y: obstacle.y, width: obstacle.width, depth: obstacle.depth }));
    const visitorStarts = visitors.length ? visitors.map((entry) => Domain.rectangleCenter(entry)) : syntheticAisleViewpoints();
    const staffStarts = staff.map((entry) => Domain.rectangleCenter(entry));
    return {
      item,
      missingSettings,
      viewpoints,
      viewpointResults,
      visibleViews: viewpointResults.filter((entry) => entry.visible).length,
      blockers,
      approach,
      visitorPath: bestMovementPath(visitorStarts, approach, movementObstacles),
      staffPath: staffStarts.length ? bestMovementPath(staffStarts, approach, movementObstacles) : null
    };
  });
  return { targets: targetResults, viewpoints, visitors, staff, crowd, unknownObstacleHeights };
}

function visibilityAuditStatus(audit) {
  if (!audit.targets.length) return { level: "warn", message: "視認対象が未登録です。什器・商品・POPを選び、評価区分、注視高さ、表示面の正面を登録してください。" };
  const missing = audit.targets.filter((entry) => entry.missingSettings.length);
  if (missing.length) return { level: "warn", message: `問題箇所: ${missing.map((entry) => `${entry.item.label}（${entry.missingSettings.join("・")}）`).join("、")}。理由: 正確な視線方向と遮蔽高さを計算できません。改善案: 実測した注視高さと表示面の正面を登録してください。` };
  const invisibleMain = audit.targets.filter((entry) => entry.item.visibilityRole === "main-product" && entry.visibleViews === 0);
  if (invisibleMain.length) return { level: "bad", message: `問題箇所: ${invisibleMain.map((entry) => entry.item.label).join("、")}。理由: メイン商品が登録視点${audit.viewpoints.length}点のいずれからも正面視認できません。改善案: 正面方向、遮蔽物、展示高さ、配置を見直してください。` };
  const invisible = audit.targets.filter((entry) => entry.visibleViews === 0);
  if (invisible.length) return { level: "warn", message: `問題箇所: ${invisible.map((entry) => entry.item.label).join("、")}。理由: 正面外または什器で遮蔽されています。改善案: 表示面を来場者側へ向け、遮蔽物を移動してください。` };
  const lowCoverage = audit.targets.filter((entry) => entry.visibleViews < Math.min(2, entry.viewpoints.length));
  if (lowCoverage.length) return { level: "warn", message: `問題箇所: ${lowCoverage.map((entry) => `${entry.item.label} ${entry.visibleViews}/${entry.viewpoints.length}視点`).join("、")}。理由: 視認できる入口位置が限定されています。改善案: 表示面角度または周辺什器を見直してください。` };
  const provisional = audit.unknownObstacleHeights.length;
  return { level: provisional ? "warn" : "ok", message: `${audit.targets.length}対象を${audit.viewpoints.length}視点から正面・高さ・遮蔽で確認しました。${provisional ? `高さ未登録${provisional}点は3D仮寸法で判定しているため要確認です。` : "全対象を2視点以上から確認できます。"}` };
}

function movementAuditStatus(audit) {
  if (!audit.targets.length) return { level: "warn", message: "到達対象が未登録です。視認対象を登録すると、通路側から対象正面までの連続経路を探索します。" };
  const noApproach = audit.targets.filter((entry) => !entry.approach);
  if (noApproach.length) return { level: "bad", message: `問題箇所: ${noApproach.map((entry) => entry.item.label).join("、")}。理由: 登録正面側に必要幅${state.routeClearanceMm}mmの接近点を確保できません。改善案: 対象を壁・境界から離すか、正面方向を見直してください。` };
  const visitorBlocked = audit.targets.filter((entry) => !entry.visitorPath?.found);
  if (visitorBlocked.length) return { level: "bad", message: `問題箇所: ${visitorBlocked.map((entry) => entry.item.label).join("、")}。理由: 通路入口から必要幅${state.routeClearanceMm}mmの連続経路がありません。改善案: 什器間隔または対象正面の接客スペースを広げてください。` };
  const staffBlocked = audit.staff.length ? audit.targets.filter((entry) => !entry.staffPath?.found) : [];
  if (staffBlocked.length) return { level: "bad", message: `問題箇所: ${staffBlocked.map((entry) => entry.item.label).join("、")}。理由: スタッフ起点から必要幅${state.routeClearanceMm}mmで到達できません。改善案: スタッフ位置・什器間隔・接近面を見直してください。` };
  if (!audit.staff.length) return { level: "warn", message: `来場者経路は${audit.targets.length}対象で確保しています（必要幅${state.routeClearanceMm}mm、${state.routeGridMm}mm刻み）。スタッフ役割の人物が未登録のため、スタッフ動線は未判定です。` };
  return { level: "ok", message: `来場者・スタッフとも${audit.targets.length}対象へ必要幅${state.routeClearanceMm}mmで到達できます（${state.routeGridMm}mm刻みの設計探索）。` };
}

function getElectricalAudit() {
  const outlets = state.items.filter((item) => item.type === "power");
  const loads = state.items.filter(isPoweredLoad);
  const consumingLoads = loads.filter((item) => item.type !== "powerstrip");
  const strips = loads.filter((item) => item.type === "powerstrip");
  const unconnected = loads.filter((item) => !item.powerSourceId);
  const brokenSources = loads.filter((item) => item.powerSourceId && !getPowerSource(item));
  const unregisteredWatt = consumingLoads.filter((item) => !(Number(item.watt) > 0));
  const unregisteredStripRating = strips.filter((item) => !(Number(item.ratedCapacityW) > 0));
  const unassignedOutlets = outlets.filter((item) => !state.powerCircuits.some((circuit) => circuit.id === item.circuitId));
  const unknownCapacityCircuits = state.powerCircuits.filter((circuit) =>
    outlets.some((outlet) => outlet.circuitId === circuit.id) && !(Number(circuit.capacityW) > 0)
  );
  const routes = loads.map(getCableRouteData).filter(Boolean);
  const crossingRoutes = routes.filter((route) => route.crossings.length);

  const stripOverloads = strips.map((strip) => {
    const loadW = consumingLoads.filter((item) => item.powerSourceId === strip.id).reduce((sum, item) => sum + (Number(item.watt) || 0), 0);
    return { strip, loadW };
  }).filter(({ strip, loadW }) => strip.ratedCapacityW > 0 && loadW > strip.ratedCapacityW);

  const circuitLoads = new Map(state.powerCircuits.map((circuit) => [circuit.id, 0]));
  consumingLoads.forEach((item) => {
    const circuit = resolveCircuitForLoad(item);
    if (circuit) circuitLoads.set(circuit.id, (circuitLoads.get(circuit.id) || 0) + (Number(item.watt) || 0));
  });
  const circuitOverloads = state.powerCircuits.map((circuit) => ({ circuit, loadW: circuitLoads.get(circuit.id) || 0 }))
    .filter(({ circuit, loadW }) => circuit.capacityW > 0 && loadW > circuit.capacityW);

  const totalLoadW = consumingLoads.reduce((sum, item) => sum + (Number(item.watt) || 0), 0);
  return {
    outlets, loads, consumingLoads, strips, unconnected, brokenSources, unregisteredWatt, unregisteredStripRating,
    unassignedOutlets, unknownCapacityCircuits, routes, crossingRoutes, stripOverloads, circuitOverloads, circuitLoads, totalLoadW
  };
}

function electricalAuditMessage(audit) {
  if (audit.circuitOverloads.length) {
    const detail = audit.circuitOverloads.map(({ circuit, loadW }) => `${circuit.name} ${loadW}W/${circuit.capacityW}W`).join("、");
    return { level: "bad", message: `問題箇所: ${detail}。理由: 登録回路容量を超過しています。改善案: 接続機器を別回路へ分散するか、施工会社確認済みの回路容量へ更新してください。` };
  }
  if (audit.stripOverloads.length) {
    const detail = audit.stripOverloads.map(({ strip, loadW }) => `${strip.label} ${loadW}W/${strip.ratedCapacityW}W`).join("、");
    return { level: "bad", message: `問題箇所: ${detail}。理由: 電源タップの登録定格容量を超過しています。改善案: 負荷を分散し、定格と会場施工条件を再確認してください。` };
  }
  if (audit.brokenSources.length) {
    return { level: "bad", message: `問題箇所: ${audit.brokenSources.map((item) => item.label).join("、")}。理由: 保存された給電元IDが現在の配置に存在しません。改善案: 給電元を再選択してください。` };
  }
  if (audit.crossingRoutes.length) {
    const detail = audit.crossingRoutes.slice(0, 3).map((route) => `${route.item.label}→${route.crossings.map((item) => item.label).join("/")}`).join("、");
    return { level: "bad", message: `問題箇所: ${detail}。理由: 計画配線が床置き什器を横断しています。改善案: X→Y/Y→Xを切り替えるか、什器・給電元を移動し、養生方法を施工会社と確定してください。` };
  }
  const missing = [];
  if (audit.unconnected.length) missing.push(`未接続${audit.unconnected.length}点`);
  if (audit.unregisteredWatt.length) missing.push(`消費電力未登録${audit.unregisteredWatt.length}点`);
  if (audit.unregisteredStripRating.length) missing.push(`タップ定格未登録${audit.unregisteredStripRating.length}点`);
  if (audit.unassignedOutlets.length) missing.push(`回路未割当コンセント${audit.unassignedOutlets.length}点`);
  if (audit.unknownCapacityCircuits.length) missing.push(`容量未登録回路${audit.unknownCapacityCircuits.length}件`);
  if (missing.length) {
    return { level: "warn", message: `問題箇所: ${missing.join("、")}。理由: 容量超過と必要ケーブル長を確定できません。改善案: 施工会社の回路容量、各機器W数、給電元、タップ定格を登録してください。現在の登録負荷合計は${audit.totalLoadW}Wです。` };
  }
  if (!audit.outlets.length && !audit.loads.length) {
    return { level: "warn", message: "問題箇所: 電源設計未登録。理由: 電源が必要か判定できません。改善案: 不要なら備考へ明記し、必要なら回路・コンセント・接続機器を登録してください。" };
  }
  return { level: "ok", message: `登録負荷合計${audit.totalLoadW}W、接続${audit.routes.length}経路。回路・タップ容量超過と什器横断はありません。` };
}

function getScenarioAudit() {
  const all = state.items.filter((item) => item.type === "scenario");
  const active = all.filter((item) => isItemActive(item));
  const unconfirmed = active.filter((item) => !item.dimensionsConfirmed);
  const stock = active.filter((item) => item.operationalCategory === "stock");
  const pcPlaceholders = active.filter((item) => item.operationalCategory === "pc" && !isPoweredLoad(item));
  const crowd = activeItems().filter((item) => item.type === "person" && item.personRole === "crowd");
  const floorAreaMm2 = active.reduce((sum, item) => sum + item.width * item.depth, 0);
  const stockVolumeMm3 = stock.reduce((sum, item) => sum + item.width * item.depth * (item.height || defaultItemHeight(item)), 0);
  return { all, active, unconfirmed, stock, pcPlaceholders, crowd, floorAreaMm2, stockVolumeMm3 };
}

function scenarioAuditStatus(audit) {
  if (state.operationMode === "design") {
    return { level: "ok", message: `設計モードです。営業中・混雑時だけ有効な物品${audit.all.filter((item) => !isItemActive(item)).length}点は検査・3D・PDFから除外しています。` };
  }
  if (audit.unconfirmed.length) {
    return { level: "warn", message: `問題箇所: ${audit.unconfirmed.map((item) => item.label).join("、")}。理由: 営業物品のW/D/Hが実測確認されていません。改善案: 実測寸法へ変更し「寸法を実測・確認済み」を有効にしてください。` };
  }
  if (!audit.stock.length) {
    return { level: "warn", message: `問題箇所: ${operationModeLabel(state.operationMode)}の在庫・予備品スペース。理由: 状態別物品として登録されていません。改善案: 営業物品を追加し、区分を「在庫・予備品」、実測寸法を登録してください。` };
  }
  if (state.operationMode === "crowded" && !audit.crowd.length) {
    return { level: "warn", message: "問題箇所: 混雑時の来場者占有。理由: 混雑負荷の人物が未登録です。改善案: 人物を複製し、人物役割を「混雑負荷」、表示状態を「混雑時のみ」にしてください。" };
  }
  if (audit.pcPlaceholders.length) {
    return { level: "warn", message: `問題箇所: ${audit.pcPlaceholders.map((item) => item.label).join("、")}。理由: 占有領域は登録されていますが、消費電力と給電元は未管理です。改善案: 電源が必要なPC・端末は「接続機器」でも登録し、回路へ接続してください。` };
  }
  return { level: "ok", message: `${operationModeLabel(state.operationMode)}で営業物品${audit.active.length}点、占有面積${Math.round(audit.floorAreaMm2 / 10000) / 100}㎡、在庫領域${audit.stock.length}点を実測寸法で確認しました。` };
}

function spaceObstacleItems() {
  return activeItems().filter((item) => {
    if (["zone", "power", "spotlight"].includes(item.type)) return false;
    if (item.type === "person") return item.personRole === "crowd";
    const vertical = getItemVerticalRange(item);
    return vertical.bottom < 1800 && vertical.top > 0;
  });
}

function getSpaceAudit() {
  const allZones = state.items.filter((item) => item.type === "zone");
  const activeZones = allZones.filter((item) => isItemActive(item));
  const obstacles = spaceObstacleItems().map((item) => ({ id: item.id, x: item.x, y: item.y, width: item.width, depth: item.depth }));
  const zonePlans = activeZones.map((item) => ({ id: item.id, x: item.x, y: item.y, width: item.width, depth: item.depth }));
  const staff = activeItems().filter((item) => item.type === "person" && item.personRole === "staff");
  const staffPoints = staff.map((item) => Domain.rectangleCenter(item));
  const common = { booth: state.booth, obstacles, zones: zonePlans };
  const publicAnalysis = Domain.analyzeOrthogonalSpace({ ...common, entrySide: state.booth.aisleSide });
  const operationalAnalysis = publicAnalysis;
  const staffAnalysis = staffPoints.length ? Domain.analyzeOrthogonalSpace({ ...common, entryPoints: staffPoints }) : null;
  const staffAccessibility = staff.map((item) => {
    const center = Domain.rectangleCenter(item);
    const cell = publicAnalysis.cells.find((entry) => center.x >= entry.x && center.x <= entry.x + entry.width && center.y >= entry.y && center.y <= entry.y + entry.depth);
    return { item, accessibleFromAisle: Boolean(cell && !cell.occupied && cell.reachable) };
  });
  const zones = activeZones.map((item) => {
    const publicResult = publicAnalysis.zones.find((entry) => entry.id === item.id);
    const operationalResult = operationalAnalysis.zones.find((entry) => entry.id === item.id);
    const staffResult = staffAnalysis?.zones.find((entry) => entry.id === item.id) || null;
    return {
      item,
      areaMm2: operationalResult?.areaMm2 || item.width * item.depth,
      occupiedMm2: operationalResult?.occupiedMm2 || 0,
      freeMm2: operationalResult?.freeMm2 || 0,
      publicReachableMm2: publicResult?.reachableMm2 || 0,
      staffReachableMm2: staffResult ? staffResult.reachableMm2 : null,
      operationalReachableMm2: operationalResult?.reachableMm2 || 0,
      deadMm2: operationalResult?.deadMm2 || 0
    };
  });
  return {
    allZones,
    activeZones,
    zones,
    obstacles,
    staff,
    staffAccessibility,
    publicAnalysis,
    operationalAnalysis,
    staffAnalysis,
    deadCells: operationalAnalysis.cells.filter((cell) => !cell.occupied && !cell.reachable)
  };
}

function inventoryMissingFieldLabels(fields) {
  const labels = {
    zoneWidthMm: "在庫領域W",
    zoneDepthMm: "在庫領域D",
    totalUnits: "総商品数",
    unitsPerCarton: "箱入数",
    cartonWidthMm: "箱W",
    cartonDepthMm: "箱D",
    cartonHeightMm: "箱H",
    maxStackHeightMm: "最大積上高"
  };
  return (fields || []).map((key) => labels[key] || key);
}

function getInventoryAudit() {
  const all = state.items.filter((item) => item.type === "zone" && item.spaceCategory === "inventory");
  const active = all.filter((item) => isItemActive(item));
  const spaces = spaceAudit || getSpaceAudit();
  const entries = active.map((item) => ({
    item,
    space: spaces.zones.find((entry) => entry.item.id === item.id) || null,
    capacity: Domain.calculateInventoryCapacity({
      zoneWidthMm: item.width,
      zoneDepthMm: item.depth,
      totalUnits: item.inventoryTotalUnits,
      unitsPerCarton: item.inventoryUnitsPerCarton,
      replenishmentCount: item.inventoryReplenishmentCount,
      cartonWidthMm: item.inventoryCartonWidthMm,
      cartonDepthMm: item.inventoryCartonDepthMm,
      cartonHeightMm: item.inventoryCartonHeightMm,
      maxStackHeightMm: item.inventoryMaxStackHeightMm
    })
  }));
  return {
    all,
    active,
    entries,
    incomplete: entries.filter((entry) => !entry.capacity.complete),
    unconfirmed: entries.filter((entry) => !entry.item.inventoryDimensionsConfirmed),
    occupied: entries.filter((entry) => (entry.space?.occupiedMm2 || 0) > 0),
    overHeight: entries.filter((entry) => (state.booth.heightLimitMm || state.booth.wallHeight || 0) > 0 && entry.item.inventoryMaxStackHeightMm > (state.booth.heightLimitMm || state.booth.wallHeight)),
    shortages: entries.filter((entry) => entry.capacity.complete && entry.capacity.shortageCartons > 0)
  };
}

function inventoryAuditStatus(audit) {
  if (!audit.active.length) {
    return { level: "warn", message: `問題箇所: ${operationModeLabel(state.operationMode)}の在庫容量。理由: 有効な在庫予約領域がなく、必要商品数を収容できるか判定できません。改善案: 用途領域を追加して「在庫予約領域」を選び、実際の箱情報を登録してください。` };
  }
  if (audit.incomplete.length) {
    return { level: "warn", message: `問題箇所: ${audit.incomplete.map((entry) => `${entry.item.label}（${inventoryMissingFieldLabels(entry.capacity.missingFields).join("・")}）`).join("、")}。理由: 箱数・平面収容数・積上段数を確定できません。改善案: 商品数量、箱入数、実測箱W/D/H、補充回数、現場で許容された最大積上高を登録してください。` };
  }
  if (audit.unconfirmed.length) {
    return { level: "warn", message: `問題箇所: ${audit.unconfirmed.map((entry) => entry.item.label).join("、")}。理由: 箱寸法または最大積上高が確認済みになっていません。改善案: 梱包仕様・現物・会場安全条件と照合し「箱寸法・積上高を確認済み」を有効にしてください。` };
  }
  if (audit.occupied.length) {
    return { level: "bad", message: `問題箇所: ${audit.occupied.map((entry) => `${entry.item.label}（障害物${formatSquareMetres(entry.space.occupiedMm2)}㎡）`).join("、")}。理由: 容量計算に使った矩形へ什器・営業物品が重なっています。改善案: 在庫領域または障害物を移動し、箱を置ける全矩形を確保してください。` };
  }
  if (audit.overHeight.length) {
    const limit = state.booth.heightLimitMm || state.booth.wallHeight;
    return { level: "bad", message: `問題箇所: ${audit.overHeight.map((entry) => `${entry.item.label} 積上H${entry.item.inventoryMaxStackHeightMm}mm`).join("、")}。理由: 登録装飾高上限H${limit}mmを超えています。改善案: 最大積上高を安全条件内へ下げ、必要なら在庫領域を増やしてください。` };
  }
  if (audit.shortages.length) {
    return { level: "bad", message: `問題箇所: ${audit.shortages.map((entry) => `${entry.item.label} ${entry.capacity.capacityCartons}箱/${entry.capacity.peakCartons}箱（不足${entry.capacity.shortageCartons}箱）`).join("、")}。理由: 登録領域・積上高では均等補充計画時の最大同時箱数を収容できません。改善案: 在庫領域を広げる、許容根拠のある積上高へ見直す、または実行可能な補充計画を増やしてください。` };
  }
  const totalCapacity = audit.entries.reduce((sum, entry) => sum + entry.capacity.capacityCartons, 0);
  const totalPeak = audit.entries.reduce((sum, entry) => sum + entry.capacity.peakCartons, 0);
  return { level: "ok", message: `在庫領域${audit.entries.length}点で必要ピーク${totalPeak}箱に対し${totalCapacity}箱を収容できます。箱は平面90°回転を比較し、最大積上高以内の整数段、補充は会期中に均等分割する計画として算出しています。` };
}

function spaceAuditStatus(audit) {
  if (!audit.activeZones.length) {
    return { level: "warn", message: `問題箇所: ${operationModeLabel(state.operationMode)}の用途領域。理由: 接客・スタッフ・在庫の計画面積が未登録です。改善案: 「接客スペース」を追加し、実際の運用基準に基づく必要面積を入力してください。` };
  }
  const contactZones = audit.zones.filter((entry) => entry.item.spaceCategory === "contact");
  if (!contactZones.length) {
    return { level: "warn", message: "問題箇所: 接客スペース。理由: 用途領域に接客区分がありません。改善案: 来場者とスタッフが滞在する矩形領域と必要面積を登録してください。" };
  }
  const occupied = audit.zones.filter((entry) => entry.occupiedMm2 > 0);
  if (occupied.length) {
    return { level: "bad", message: `問題箇所: ${occupied.map((entry) => `${entry.item.label}（障害物${formatSquareMetres(entry.occupiedMm2)}㎡）`).join("、")}。理由: 計画用途領域に什器・壁・営業物品が重なっています。改善案: 領域または障害物を移動し、有効面積を確保してください。` };
  }
  const zoneOverlaps = [];
  for (let index = 0; index < audit.activeZones.length; index += 1) {
    for (let otherIndex = index + 1; otherIndex < audit.activeZones.length; otherIndex += 1) {
      const a = audit.activeZones[index];
      const b = audit.activeZones[otherIndex];
      if (Domain.rectanglesOverlap(a, b)) zoneOverlaps.push([a, b]);
    }
  }
  if (zoneOverlaps.length) {
    return { level: "bad", message: `問題箇所: ${zoneOverlaps.map(([a, b]) => `${a.label}×${b.label}`).join("、")}。理由: 用途領域が重なり、同じ床面積を二重計上します。改善案: 境界を分離するか、一つの用途領域として必要面積を再登録してください。` };
  }
  const missingRequired = audit.zones.filter((entry) => !(entry.item.requiredAreaMm2 > 0));
  if (missingRequired.length) {
    return { level: "warn", message: `問題箇所: ${missingRequired.map((entry) => entry.item.label).join("、")}。理由: 必要面積が未登録のため不足判定できません。改善案: 想定人数・運用・社内基準・会場規定から必要面積㎡を確定して入力してください。` };
  }
  const staffZones = audit.zones.filter((entry) => entry.item.spaceCategory === "staff");
  if (staffZones.length && !audit.staff.length) {
    return { level: "warn", message: "問題箇所: スタッフ専用領域。理由: スタッフ起点人物が未登録で、専用領域までの業務到達性を判定できません。改善案: 人物役割「スタッフ起点」を実際の待機位置へ配置してください。" };
  }
  const inaccessibleStaff = audit.staffAccessibility.filter((entry) => !entry.accessibleFromAisle);
  if (inaccessibleStaff.length) {
    return { level: "bad", message: `問題箇所: ${inaccessibleStaff.map((entry) => entry.item.label).join("、")}。理由: スタッフ起点自体へ通路側から連続して到達できません。改善案: 間仕切りに実幅の開口を設けるか、スタッフ待機位置を到達可能床へ移動してください。人物を閉鎖領域へ置くだけでは到達可能と判定しません。` };
  }
  const insufficient = audit.zones.filter((entry) => {
    const required = entry.item.requiredAreaMm2;
    const reachable = entry.item.spaceCategory === "contact"
      ? entry.publicReachableMm2
      : entry.item.spaceCategory === "staff" && entry.staffReachableMm2 !== null
        ? entry.staffReachableMm2
        : entry.operationalReachableMm2;
    return reachable < required;
  });
  if (insufficient.length) {
    return { level: "bad", message: `問題箇所: ${insufficient.map((entry) => {
      const available = entry.item.spaceCategory === "contact" ? entry.publicReachableMm2 : entry.item.spaceCategory === "staff" && entry.staffReachableMm2 !== null ? entry.staffReachableMm2 : entry.operationalReachableMm2;
      return `${entry.item.label} ${formatSquareMetres(available)}㎡/${formatSquareMetres(entry.item.requiredAreaMm2)}㎡`;
    }).join("、")}。理由: 到達可能な有効面積が登録必要面積を下回ります。改善案: 領域を広げ、遮断・重複する什器を移動してください。` };
  }
  if (audit.operationalAnalysis.deadAreaMm2 > 0) {
    const ratio = Math.round(audit.operationalAnalysis.deadAreaMm2 / audit.operationalAnalysis.boothAreaMm2 * 1000) / 10;
    return { level: "warn", message: `問題箇所: 通路側から到達できない床${formatSquareMetres(audit.operationalAnalysis.deadAreaMm2)}㎡（ブース${ratio}%）。理由: 什器で分断されたデッドスペース候補です。改善案: 2Dの赤い網掛けを確認し、意図した閉鎖領域なら用途を記録、不要なら通路を接続してください。` };
  }
  return { level: "ok", message: `床${formatSquareMetres(audit.operationalAnalysis.boothAreaMm2)}㎡のうち障害物${formatSquareMetres(audit.operationalAnalysis.occupiedAreaMm2)}㎡、到達可能床${formatSquareMetres(audit.operationalAnalysis.reachableAreaMm2)}㎡、デッドスペース候補0.00㎡。用途領域${audit.zones.length}点は登録必要面積を満たします。` };
}

function supportPlacementAuditStatus() {
  const surfaceItems = activeItems().filter((item) => item.surfacePlaceable);
  if (!surfaceItems.length) return { level: "ok", message: "机上配置対象の商品はありません。" };
  const unsupported = surfaceItems.filter((item) => !item.supportItemId);
  const invalid = surfaceItems.filter((item) => {
    if (!item.supportItemId) return false;
    const support = state.items.find((candidate) => candidate.id === item.supportItemId);
    const definition = getSupportPlacementDefinition(item, support);
    if (!support || !definition?.placement.fits) return true;
    const expectedZ = (support.z || 0) + (definition.kind === "official-fixed" ? definition.placement.zOffsetMm : support.height || defaultItemHeight(support));
    return Math.abs(item.z - expectedZ) > 0.01;
  });
  if (invalid.length) {
    return { level: "bad", message: `問題箇所: ${invalid.map((item) => item.label).join("、")}。理由: 支持台との実寸関係またはZ位置が不正です。改善案: 机上配置から実寸適合する台を選び直してください。` };
  }
  if (unsupported.length) {
    return { level: "warn", message: `問題箇所: ${unsupported.map((item) => item.label).join("、")}。理由: 卓上用商品ですが支持する机・専用台が未指定です。改善案: 商品を選択し「机上・専用台への配置」から実寸適合する台へ載せてください。` };
  }
  const officialPairs = surfaceItems.filter((item) => {
    const support = state.items.find((candidate) => candidate.id === item.supportItemId);
    return getSupportPlacementDefinition(item, support)?.kind === "official-fixed";
  }).length;
  return { level: "ok", message: `卓上用商品${surfaceItems.length}点は支持台に追従し、Z位置と天板内収容を確認済みです。メーカー指定組合せ${officialPairs}点。` };
}

function getChecks() {
  const required = [];
  if (!state.eventName) required.push("展示会名");
  if (!state.boothNo) required.push("小間番号");
  if (!state.contactName) required.push("担当者");
  const outlets = state.items.filter((item) => item.type === "power");
  const spotlights = state.items.filter((item) => item.type === "spotlight");
  const electrical = getElectricalAudit();
  const electricalStatus = electricalAuditMessage(electrical);
  const visibilityStatus = visibilityAuditStatus(operationalAudit || getOperationalAudit());
  const movementStatus = movementAuditStatus(operationalAudit || getOperationalAudit());
  const scenario = getScenarioAudit();
  const scenarioStatus = scenarioAuditStatus(scenario);
  const spaces = spaceAudit || getSpaceAudit();
  const spaceStatus = spaceAuditStatus(spaces);
  const inventories = inventoryAudit || getInventoryAudit();
  const inventoryStatus = inventoryAuditStatus(inventories);
  const supportStatus = supportPlacementAuditStatus();
  const overlapPairs = findOverlapPairs();
  const overlaps = overlapPairs.length;
  const outOfBounds = state.items.filter((item) => Domain.isOutOfBounds(item, state.booth));
  const aisleOpening = getAisleOpeningMm();
  const people = activeItems().filter((item) => item.type === "person");
  const seatedPeople = people.filter((item) => getChairForPerson(item)).length;
  const personCollisions = countPersonCollisions();
  const tightClearances = countTightPersonClearances();
  const heightLimitMm = Math.max(0, state.booth.heightLimitMm || state.booth.wallHeight || 0);
  const overHeight = heightLimitMm
    ? activeItems().filter((item) => item.type !== "zone" && getItemVerticalRange(item).top > heightLimitMm)
    : [];
  const checks = [
    {
      name: "寸法エージェント",
      level: state.booth.width && state.booth.depth && (state.booth.wallHeight || state.booth.spaceOnly) ? "ok" : "bad",
      message: state.booth.spaceOnly
        ? `ブース W${state.booth.width} x D${state.booth.depth}mm、スペース渡し（壁高・壁面未登録）。装飾高上限H${state.booth.heightLimitMm || "未登録"}mm。`
        : `ブース W${state.booth.width} x D${state.booth.depth}、壁H${state.booth.wallHeight}mm。必要に応じて自由入力へ変更できます。`
    },
    {
      name: "配置エージェント",
      level: outOfBounds.length ? "bad" : overlaps ? "warn" : "ok",
      message: outOfBounds.length
        ? `問題箇所: ${outOfBounds.map((item) => item.label).join("、")}。理由: ブース範囲外です。改善案: X/YまたはW/Dを見直し、壁距離を0mm以上にしてください。`
        : overlaps
          ? `問題箇所: ${overlapPairs.slice(0, 3).map(([a, b]) => `${a.label}×${b.label}`).join("、")}${overlaps > 3 ? `ほか${overlaps - 3}件` : ""}。理由: 立体占有範囲が重なっています。改善案: 移動または高さ位置を見直してください。`
          : "ブース範囲外と立体衝突はありません。"
    },
    {
      name: "机上配置エージェント",
      level: supportStatus.level,
      message: supportStatus.message
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
      name: "高さ制限エージェント",
      level: !heightLimitMm ? "warn" : overHeight.length ? "bad" : "ok",
      message: !heightLimitMm
        ? "装飾高上限が未登録です。会場マニュアルまたは施工規定の実数値を入力データへ登録してください。"
        : overHeight.length
          ? `問題箇所: ${overHeight.map((item) => `${item.label} 上端H${Math.round(getItemVerticalRange(item).top)}mm`).join("、")}。理由: 登録装飾高上限H${heightLimitMm}mmを超えています。改善案: HまたはZを下げ、会場承認条件へ合わせてください。`
          : `全配置物の上端は登録装飾高上限H${heightLimitMm}mm以内です。`
    },
    {
      name: "通路幅エージェント",
      level: aisleOpening < 900 ? "warn" : "ok",
      message: aisleOpening < 900
        ? `問題箇所: 通路側から奥行900mmの入口帯。理由: 最大連続開口が${Math.round(aisleOpening)}mmで、設計目安900mm未満です。改善案: 通路側の什器を移動し、会場規定で必要な開口を確保してください。`
        : `通路側から奥行900mmの入口帯に、最大連続開口${Math.round(aisleOpening)}mmを確保しています（900mmは設計目安。会場規定を優先）。`
    },
    {
      name: "視認性エージェント",
      level: visibilityStatus.level,
      message: visibilityStatus.message
    },
    {
      name: "到達動線エージェント",
      level: movementStatus.level,
      message: movementStatus.message
    },
    {
      name: "営業状態エージェント",
      level: scenarioStatus.level,
      message: scenarioStatus.message
    },
    {
      name: "床面積・用途領域エージェント",
      level: spaceStatus.level,
      message: spaceStatus.message
    },
    {
      name: "在庫容量エージェント",
      level: inventoryStatus.level,
      message: inventoryStatus.message
    },
    {
      name: "電源エージェント",
      level: electricalStatus.level,
      message: electricalStatus.message
    },
    {
      name: "提出エージェント",
      level: required.length ? "warn" : "ok",
      message: required.length ? `未入力: ${required.join("、")}` : "提出情報の基本項目が入力されています。"
    }
  ];
  const placedBolda = state.items.filter((item) => item.type === "bolda");
  if (placedBolda.length) {
    const exactTb13Count = placedBolda.filter((item) => getBoldaCode(item) === "TB13").length;
    const provisionalCount = placedBolda.length - exactTb13Count;
    checks.splice(1, 0, {
      name: "bolda精度",
      level: provisionalCount ? "warn" : "ok",
      message: provisionalCount
        ? `TB13 ${exactTb13Count}点は提供テンプレートどおりのW900×D500×H800、下部H650、2開口各約W413×H100、板厚25mmです。ほか${provisionalCount}点は外形W/D/Hのみ照合済みで、段差・棚板等は暫定3Dです。正確化にはメーカー3D/CADと組立図が必要です。`
        : `TB13 ${exactTb13Count}点は提供テンプレートどおりのW900×D500×H800、下部H650、2開口各約W413×H100、板厚25mmです。前面商品画像も提供PSDの埋め込み元画像から下切れなしで表示します。`
    });
  }
  if (state.preset === "jex") {
    const spotlights = state.items.filter((item) => item.type === "spotlight").length;
    const outlets = state.items.filter((item) => item.type === "power").length;
    const tables = state.items.filter((item) => item.type === "table" && item.width === 1500 && item.depth === 600 && item.height === 700 && String(item.material || "").includes("黒布")).length;
    const jexOk = state.booth.width === 8000 && state.booth.depth === 2000 && state.booth.wallHeight === 2100 && state.booth.heightLimitMm === 2700 && state.booth.floorLoadKgPerM2 === 1000 && state.booth.sideWallHeightMm === 900 && state.booth.sideReturnDepthMm === 990 && state.booth.wallPanelCount === 8 && spotlights === 0 && outlets === 0 && tables === 2;
    checks.unshift({
      name: "JEXルール",
      level: jexOk ? "ok" : "warn",
      message: jexOk
        ? "JEX 2階シンプルパッケージ・2小間の基本構成です。W8000 x D2000、黒壁パネルW990 x H2100を8枚、外側袖壁H900、黒布巻きテーブルW1500 x D600 x H700を2台。床カーペット・電気は付属しません。"
        : "JEX 2階装飾・2小間の基本外形、壁、備品数または『電気なし』条件から変更されています。標準レイアウトを置き直すか変更根拠を記録してください。"
    });
  }
  if (state.preset === "wof") {
    const tables = state.items.filter((item) => item.type === "table" && item.width === 1500 && item.depth === 600).length;
    const chairs = state.items.filter((item) => item.type === "chair").length;
    const wofOk = state.booth.width === 5940 && state.booth.depth === 2500 && state.booth.wallHeight === 2400 && tables >= 4 && chairs >= 4;
    checks.unshift({
      name: "WOF 2コマルール",
      level: wofOk ? "ok" : "warn",
      message: wofOk
        ? "正式外形W5940 x D2500 x H2400と、展示台W1500 x D600を4台・イス4脚を確認しました。配置位置は提出前に会場図・申込内容と照合してください。"
        : "WOFの正式外形または標準備品数と一致しません。標準レイアウトを置き直すか、変更根拠を備考へ記録してください。"
    });
  }
  if (state.preset === "neotokyo") {
    const planDisplayTables = state.items.filter((item) => item.masterId && item.label.startsWith("Plan A 商品展示テーブル") && item.width === 1500 && item.depth === 750 && item.height === 830).length;
    const planMeetingTables = state.items.filter((item) => item.label === "Plan A 商談テーブル" && item.width === 1000 && item.depth === 600 && item.height === 730).length;
    const rentalTables = state.items.filter((item) => item.label.startsWith("追加レンタル展示テーブルD") && item.width === 1500 && item.depth === 750 && item.height === 820).length;
    const signs = state.items.filter((item) => item.masterId === "SANNI-WALL-SIGN-1400" && item.width === 1400 && item.depth === 20 && item.height === 500).length;
    const presetOk = state.booth.width === 6000 && state.booth.depth === 2700 && state.booth.wallHeight === 0 && state.booth.heightLimitMm === 2400 && state.booth.floorLoadKgPerM2 === 500 && state.booth.spaceOnly === true && state.booth.plannedBackPanelWidthMm === 6000 && state.booth.plannedBackPanelHeightMm === 2400 && planDisplayTables === 2 && planMeetingTables === 1 && rentalTables === 3 && signs === 1;
    checks.unshift({
      name: "NEO TOKYO 2026ルール",
      level: presetOk ? "ok" : "warn",
      message: presetOk
        ? "2コマ横連結W6000 x D2700、公式スペース渡し、装飾高上限H2400、床積載荷重500kg/㎡、Plan Aの寸法確認済み机3台、追加レンタル展示テーブルD 3台を確認しました。ユーザー指定の自社計画背面パネルと実寸看板も表示中です。パネル施工仕様は未確定です。"
        : "NEO TOKYO 2コマ・Plan A・追加レンタル机の基準構成から変更されています。標準レイアウトを置き直すか、変更根拠を備考へ記録してください。"
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
  return findOverlapPairs().length;
}

function renderSubmissionSummary() {
  const currentItems = activeItems();
  const fixtures = currentItems.filter((item) => !["power", "powerstrip", "device", "spotlight", "zone"].includes(item.type));
  const groups = new Map();
  fixtures.forEach((item) => {
    const key = [item.masterId || "UNREGISTERED", item.label, item.width, item.depth, item.height || 0].join("|");
    if (!groups.has(key)) groups.set(key, { item, count: 0 });
    groups.get(key).count += 1;
  });
  $("fixtureSummaryBody").innerHTML = groups.size
    ? [...groups.values()].map(({ item, count }) => `<tr><td>${escapeHtml(item.masterId || "未登録")}<br>${escapeHtml(item.label)}</td><td>${escapeHtml(itemSizeLabel(item))}</td><td>${count}</td></tr>`).join("")
    : '<tr><td colspan="3">什器・備品なし</td></tr>';
  if (state.preset === "neotokyo") {
    $("fixtureSummaryBody").insertAdjacentHTML("beforeend", '<tr><td>NEO Plan A 椅子</td><td>外形寸法未記載・配置未確定</td><td>4</td></tr>');
  }

  const powerGroups = new Map();
  currentItems.filter((item) => ["power", "powerstrip", "device", "spotlight"].includes(item.type)).forEach((item) => {
    const spec = itemPowerSummaryText(item);
    const key = `${item.type}|${item.label}|${spec}`;
    if (!powerGroups.has(key)) powerGroups.set(key, { item, spec, count: 0 });
    powerGroups.get(key).count += 1;
  });
  $("powerSummaryBody").innerHTML = powerGroups.size
    ? [...powerGroups.values()].map(({ item, spec, count }) => `<tr><td>${escapeHtml(item.label)}</td><td>${escapeHtml(spec)}</td><td>${count}</td></tr>`).join("")
    : '<tr><td colspan="3">電源・照明なし</td></tr>';
  if (state.preset === "neotokyo") {
    if (!powerGroups.size) $("powerSummaryBody").innerHTML = "";
    $("powerSummaryBody").insertAdjacentHTML("beforeend", '<tr><td>NEO Plan A スタンドライト</td><td>1SET・外形/灯数/消費電力未記載・配置未確定</td><td>1</td></tr><tr><td>NEO Plan A 電源</td><td>1SET・口数/容量/位置未記載・配置未確定</td><td>1</td></tr>');
  }
  const audit = getElectricalAudit();
  const routeLength = audit.routes.reduce((sum, route) => sum + route.totalLengthMm, 0);
  const circuitSummary = state.powerCircuits.map((circuit) => `${circuit.name}: ${audit.circuitLoads.get(circuit.id) || 0}W/${circuit.capacityW ? `${circuit.capacityW}W` : "容量未登録"}`).join("、");
  $("powerSummaryNote").textContent = `登録負荷合計 ${audit.totalLoadW}W。計画配線 ${audit.routes.length}経路・合計${Math.round(routeLength)}mm。${circuitSummary || "回路未登録"}。配線長は平面直交距離＋取付高低差＋登録余長です。`;

  const wallItems = currentItems.filter((item) => ["wall", "power", "spotlight"].includes(item.type));
  const floorItems = currentItems.filter((item) => !["wall", "power", "spotlight", "zone"].includes(item.type));
  const steps = [
    state.booth.spaceOnly
      ? `ブース外形 W${state.booth.width} x D${state.booth.depth}mm、装飾高上限H${state.booth.heightLimitMm || "未登録"}mmを墨出し確認。公式引渡しはスペースのみで壁面は未支給。${hasPlannedBackPanel() ? `自社計画背面パネルW${state.booth.plannedBackPanelWidthMm} x H${state.booth.plannedBackPanelHeightMm} x D${state.booth.plannedBackPanelThicknessMm}mm（仮）は施工会社承認図と照合してから設置。` : ""}`
      : `ブース外形 W${state.booth.width} x D${state.booth.depth} x 壁H${state.booth.wallHeight}mm、壁側${sideLabel(state.booth.wallSide)}・通路側${sideLabel(state.booth.aisleSide)}を墨出し確認。`,
    ...wallItems.map((item) => `${item.label}: X${Math.round(item.x)} Y${Math.round(item.y)} Z${Math.round(getItemVerticalRange(item).center)}mm付近へ取付。`),
    ...floorItems.map((item) => `${item.label}: X${Math.round(item.x)} Y${Math.round(item.y)} Z${Math.round(item.z || 0)}mm、${Domain.normalizeRotationDegrees(item.rotationDeg)}°で配置。`)
  ];
  $("setupSequenceList").innerHTML = steps.map((step) => `<li>${escapeHtml(step)}</li>`).join("");
  const missingSetup = currentItems.filter((item) => item.type !== "zone").filter((item) => {
    const master = getFixtureMaster(item);
    return !master || master.setupInfo.status !== "registered";
  }).length;
  $("setupDataWarning").textContent = state.preset === "neotokyo"
    ? `${missingSetup}点は組立手順・必要工具・固定方法が未登録です。自社計画背面パネルのD50、分割、構造、固定方法、耐荷重は資料未確認の仮設定です。Plan Aの椅子4脚・スタンドライト1SET・電源1SETも外形/位置/電気仕様が資料にないため未配置です。施工会社承認図と事務局の最終備品仕様を入手後に確定してください。`
    : missingSetup
      ? `${missingSetup}点は組立手順・必要工具・固定方法が未登録です。現場設営指示として確定する前に、メーカー組立図と会場施工規定を添付してください。`
    : "全配置物にマスター設営情報が登録されています。";
  renderVisibilitySummary();
  renderScenarioSummary();
  renderSpaceSummary();
  renderInventorySummary();
}

function renderVisibilitySummary() {
  const audit = operationalAudit || getOperationalAudit();
  $("visibilitySummaryBody").innerHTML = audit.targets.length
    ? audit.targets.map((entry) => {
      const visibility = entry.missingSettings.length ? entry.missingSettings.join("・") : `${entry.visibleViews}/${entry.viewpoints.length}視点`;
      const visitor = entry.visitorPath?.found ? `来場者 約${Math.round(entry.visitorPath.lengthMm)}mm` : "来場者 到達不可";
      const staff = entry.staffPath ? (entry.staffPath.found ? `スタッフ 約${Math.round(entry.staffPath.lengthMm)}mm` : "スタッフ 到達不可") : "スタッフ未登録";
      return `<tr><td>${escapeHtml(entry.item.label)}</td><td>${escapeHtml(visibilityRoleLabel(entry.item.visibilityRole))}</td><td>${escapeHtml(visibility)}</td><td>${escapeHtml(`${visitor} / ${staff}`)}</td></tr>`;
    }).join("")
    : '<tr><td colspan="4">視認対象未登録</td></tr>';
  const sourceNote = audit.visitors.length ? `来場者人物${audit.visitors.length}人の視点` : "通路入口の自動サンプル3視点";
  $("visibilitySummaryNote").textContent = `${operationModeLabel(state.operationMode)}｜${sourceNote}、視点高さ${state.viewerEyeHeight}mm。動線必要幅${state.routeClearanceMm}mm、${state.routeGridMm}mm刻みの設計探索です。避難・施工の正式判定は会場規定を優先してください。`;
}

function renderScenarioSummary() {
  const audit = getScenarioAudit();
  $("scenarioSummaryBody").innerHTML = audit.all.length
    ? audit.all.map((item) => `<tr><td>${escapeHtml(item.label)}</td><td>${escapeHtml(operationalCategoryLabel(item.operationalCategory))}</td><td>${escapeHtml(activationModeLabel(item.activationMode))}${isItemActive(item) ? "・有効" : "・無効"}</td><td>${item.dimensionsConfirmed ? "実測確認済み" : "未確認（仮寸法）"}</td></tr>`).join("")
    : '<tr><td colspan="4">状態別物品未登録</td></tr>';
  $("scenarioSummaryNote").textContent = `${operationModeLabel(state.operationMode)}で${audit.active.length}点を検査・3D・PDFへ反映。占有面積${Math.round(audit.floorAreaMm2 / 10000) / 100}㎡、在庫領域${audit.stock.length}点。無効物品は保存されますが提出対象外です。`;
}

function renderSpaceSummary() {
  const audit = spaceAudit || getSpaceAudit();
  $("spaceSummaryBody").innerHTML = audit.zones.length
    ? audit.zones.map((entry) => {
      const reachable = entry.item.spaceCategory === "contact"
        ? `${formatSquareMetres(entry.publicReachableMm2)}㎡（通路）`
        : entry.item.spaceCategory === "staff"
          ? entry.staffReachableMm2 === null ? "スタッフ起点未登録" : `${formatSquareMetres(entry.staffReachableMm2)}㎡（スタッフ）`
          : `${formatSquareMetres(entry.operationalReachableMm2)}㎡（業務）`;
      const effective = `${formatSquareMetres(entry.freeMm2)}㎡ / ${reachable}`;
      const required = entry.item.requiredAreaMm2 > 0 ? `${formatSquareMetres(entry.item.requiredAreaMm2)}㎡` : "未登録";
      return `<tr><td>${escapeHtml(entry.item.label)}</td><td>${escapeHtml(spaceCategoryLabel(entry.item.spaceCategory))}</td><td>${formatSquareMetres(entry.areaMm2)}㎡</td><td>${escapeHtml(effective)}</td><td>${escapeHtml(required)}</td></tr>`;
    }).join("")
    : '<tr><td colspan="5">現在の状態に有効な用途領域なし</td></tr>';
  const analysis = audit.operationalAnalysis;
  $("spaceSummaryNote").textContent = `${operationModeLabel(state.operationMode)}｜ブース${formatSquareMetres(analysis.boothAreaMm2)}㎡、障害物${formatSquareMetres(analysis.occupiedAreaMm2)}㎡、通路側から到達可能${formatSquareMetres(analysis.reachableAreaMm2)}㎡、デッドスペース候補${formatSquareMetres(analysis.deadAreaMm2)}㎡。90度矩形の全境界で分割したmm²集計です。スタッフ起点自体の通路到達性も検査します。斜め形状・扉・段差は別途実測確認してください。`;
}

function renderInventorySummary() {
  const audit = inventoryAudit || getInventoryAudit();
  $("inventorySummaryBody").innerHTML = audit.entries.length
    ? audit.entries.map((entry) => {
      const capacity = entry.capacity;
      const packageSpec = capacity.complete
        ? `${capacity.totalUnits}点 / ${capacity.unitsPerCarton}点入 / 総${capacity.totalCartons}箱`
        : `未登録: ${inventoryMissingFieldLabels(capacity.missingFields).join("・")}`;
      const stack = capacity.complete
        ? `箱W${capacity.cartonWidthMm} x D${capacity.cartonDepthMm} x H${capacity.cartonHeightMm} / 上限H${capacity.maxStackHeightMm} / ${capacity.layers}段`
        : "判定不能";
      const result = capacity.complete
        ? `${capacity.capacityCartons}箱 / 必要ピーク${capacity.peakCartons}箱${capacity.shortageCartons ? ` / 不足${capacity.shortageCartons}箱` : " / 適合"}`
        : "判定不能";
      return `<tr><td>${escapeHtml(entry.item.label)}</td><td>${escapeHtml(packageSpec)}</td><td>${escapeHtml(stack)}</td><td>${escapeHtml(result)}</td></tr>`;
    }).join("")
    : '<tr><td colspan="4">現在の状態に有効な在庫予約領域なし</td></tr>';
  $("inventorySummaryNote").textContent = "平面は箱の90°回転2方向を比較し、積上げは整数段で算出します。必要ピーク箱数は総箱数を（補充回数+1）で均等分割した計画値です。実際の補充便が均等でない場合は、総商品数へ最大同時保管数を入力してください。耐荷重・消防・避難・荷崩れ防止条件は別途確認が必要です。";
}

function findOverlapPairs() {
  const pairs = [];
  const items = activeItems();
  for (let i = 0; i < items.length; i += 1) {
    for (let j = i + 1; j < items.length; j += 1) {
      if (isOverlap(items[i], items[j]) && !isAllowedOverlap(items[i], items[j])) pairs.push([items[i], items[j]]);
    }
  }
  return pairs;
}

function getAisleOpeningMm() {
  const side = state.booth.aisleSide;
  const horizontal = side === "top" || side === "bottom";
  const length = horizontal ? state.booth.width : state.booth.depth;
  const entryDepth = 900;
  const intervals = activeItems()
    .filter((item) => !["wall", "spotlight", "power", "zone"].includes(item.type))
    .filter((item) => item.type !== "person" || item.personRole === "crowd")
    .filter((item) => {
      if (side === "top") return item.y < entryDepth;
      if (side === "bottom") return state.booth.depth - (item.y + item.depth) < entryDepth;
      if (side === "left") return item.x < entryDepth;
      return state.booth.width - (item.x + item.width) < entryDepth;
    })
    .map((item) => horizontal
      ? [Math.max(0, item.x), Math.min(length, item.x + item.width)]
      : [Math.max(0, item.y), Math.min(length, item.y + item.depth)])
    .filter(([start, end]) => end > start)
    .sort((a, b) => a[0] - b[0]);
  if (!intervals.length) return length;
  let cursor = 0;
  let largestGap = 0;
  intervals.forEach(([start, end]) => {
    largestGap = Math.max(largestGap, start - cursor);
    cursor = Math.max(cursor, end);
  });
  return Math.max(largestGap, length - cursor);
}

function isAllowedOverlap(a, b) {
  if (a.type === "zone" || b.type === "zone") return true;
  if (a.supportItemId === b.id || b.supportItemId === a.id) return true;
  const person = a.type === "person" ? a : b.type === "person" ? b : null;
  const chair = a.type === "chair" ? a : b.type === "chair" ? b : null;
  if (person && chair && getChairForPerson(person)?.id === chair.id) return true;
  const aRange = getItemVerticalRange(a);
  const bRange = getItemVerticalRange(b);
  return aRange.top <= bRange.bottom || bRange.top <= aRange.bottom;
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
  activeItems().filter((item) => item.type === "person").forEach((person) => {
    activeItems().forEach((other) => {
      if (person.id === other.id || other.type === "person" || ["power", "spotlight", "wall", "zone"].includes(other.type)) return;
      if (isOverlap(person, other) && !isAllowedOverlap(person, other)) count += 1;
    });
  });
  return count;
}

function countTightPersonClearances() {
  return activeItems().filter((item) => item.type === "person" && !getChairForPerson(item)).filter((person) => {
    const clearance = {
      x: person.x + person.width / 2 - 400,
      y: person.y + person.depth / 2 - 400,
      width: 800,
      depth: 800
    };
    return activeItems().some((other) => {
      if (person.id === other.id || ["person", "power", "spotlight", "wall", "chair", "zone"].includes(other.type)) return false;
      return isOverlap(clearance, other);
    });
  }).length;
}

function isOverlap(a, b) {
  return Domain.rectanglesOverlap(a, b);
}

function sideLabel(side) {
  return { top: "上", bottom: "下", left: "左", right: "右" }[side] || side;
}

function oppositeSide(side) {
  return { top: "bottom", bottom: "top", left: "right", right: "left" }[side] || "bottom";
}

function typeLabel(type) {
  return { table: "机", fixture: "什器", product: "商品", bolda: "自社什器 bolda", power: "コンセント", powerstrip: "電源タップ", device: "接続機器", spotlight: "スポットライト", wall: "壁面", chair: "椅子", person: "人物", scenario: "展示備品", zone: "用途領域" }[type] || type;
}

function itemSizeLabel(item) {
  const base = `W${formatMmValue(item.width)} x D${formatMmValue(item.depth)}`;
  if (item.type === "zone") return `${base}mm / ${formatSquareMetres(item.width * item.depth)}㎡`;
  return item.height ? `${base} x H${formatMmValue(item.height)}mm` : `${base} x H未登録`;
}

function formatMmValue(value) {
  const number = Domain.finiteNumber(value, 0);
  return Number.isInteger(number) ? String(number) : number.toFixed(2).replace(/0+$/, "").replace(/\.$/, "");
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
  if (drag) return;
  try {
    localStorage.setItem(AUTOSAVE_KEY, JSON.stringify(Domain.createProjectDocument(state)));
    $("autosaveStatus").textContent = "自動保存済み";
    $("mobileAutosaveStatus").textContent = "自動保存済み";
  } catch (error) {
    $("autosaveStatus").textContent = "自動保存不可・保存ボタンをご利用ください";
    $("mobileAutosaveStatus").textContent = "自動保存不可・保存してください";
    console.warn("Autosave failed", error);
  }
}

function loadAutosave() {
  try {
    const saved = [AUTOSAVE_KEY, ...PREVIOUS_AUTOSAVE_KEYS].map((key) => localStorage.getItem(key)).find(Boolean);
    if (!saved) return false;
    const parsed = Domain.parseProjectDocument(saved);
    applyLoadedState(parsed.state);
    return true;
  } catch (error) {
    console.warn("Autosave could not be loaded", error);
    return false;
  }
}

function applyLoadedState(incoming) {
  if (!incoming || typeof incoming !== "object" || !incoming.booth || !Array.isArray(incoming.items)) {
    throw new Error("保存データの必須項目がありません");
  }
  const fallbackBooth = state.booth;
  const nextBooth = incoming.booth;
  const presetBooth = presets[presets[incoming.preset] ? incoming.preset : "custom"] || {};
  const sides = ["top", "bottom", "left", "right"];
  state.preset = presets[incoming.preset] ? incoming.preset : "custom";
  state.eventName = String(incoming.eventName || "");
  state.boothNo = String(incoming.boothNo || "");
  state.companyName = String(incoming.companyName || "");
  state.contactName = String(incoming.contactName || "");
  const presetDefaultNote = { jex: jexRuleNote, imf: imfRuleNote, egf: egfRuleNote, wof: wofRuleNote, neotokyo: neoTokyoRuleNote }[state.preset];
  state.notes = presetDefaultNote ? normalizeRuleNote(String(incoming.notes || ""), presetDefaultNote) : String(incoming.notes || "");
  state.jointSide = incoming.jointSide === "left" ? "left" : "right";
  state.gridSize = Domain.sanitizeGridSize(incoming.gridSize);
  state.snapEnabled = incoming.snapEnabled !== false;
  state.viewerEyeHeight = Math.max(1000, Math.min(2200, Domain.finiteNumber(incoming.viewerEyeHeight, 1600)));
  state.routeClearanceMm = Math.max(300, Math.min(2000, Domain.finiteNumber(incoming.routeClearanceMm, 800)));
  state.routeGridMm = [50, 100, 200].includes(Number(incoming.routeGridMm)) ? Number(incoming.routeGridMm) : 100;
  state.operationMode = Domain.normalizeOperationMode(incoming.operationMode);
  state.powerCircuits = Array.isArray(incoming.powerCircuits)
    ? incoming.powerCircuits.map((entry) => ({ ...entry }))
    : [{ id: "circuit-1", name: "回路1", voltageV: 100, capacityW: 0 }];
  normalizePowerCircuits();
  state.booth = {
    width: Math.max(500, Domain.finiteNumber(nextBooth.width, fallbackBooth.width)),
    depth: Math.max(500, Domain.finiteNumber(nextBooth.depth, fallbackBooth.depth)),
    wallHeight: Math.max(0, Domain.finiteNumber(nextBooth.wallHeight, fallbackBooth.wallHeight)),
    heightLimitMm: Math.max(0, Domain.finiteNumber(nextBooth.heightLimitMm, nextBooth.wallHeight || fallbackBooth.wallHeight)),
    floorLoadKgPerM2: Math.max(0, Domain.finiteNumber(nextBooth.floorLoadKgPerM2, fallbackBooth.floorLoadKgPerM2 || 0)),
    wallSide: sides.includes(nextBooth.wallSide) ? nextBooth.wallSide : "top",
    aisleSide: sides.includes(nextBooth.aisleSide) ? nextBooth.aisleSide : "bottom",
    spaceOnly: nextBooth.spaceOnly === true,
    sideWallHeightMm: Math.max(0, Domain.finiteNumber(nextBooth.sideWallHeightMm, presetBooth.sideWallHeightMm ?? Math.min(1200, nextBooth.wallHeight || fallbackBooth.wallHeight))),
    sideReturnDepthMm: Math.max(0, Domain.finiteNumber(nextBooth.sideReturnDepthMm, presetBooth.sideReturnDepthMm ?? nextBooth.depth ?? fallbackBooth.depth)),
    wallPanelCount: Math.max(0, Math.floor(Domain.finiteNumber(nextBooth.wallPanelCount, presetBooth.wallPanelCount ?? 0))),
    wallPanelWidthMm: Math.max(0, Domain.finiteNumber(nextBooth.wallPanelWidthMm, presetBooth.wallPanelWidthMm ?? 990)),
    wallColorHex: String(nextBooth.wallColorHex ?? presetBooth.wallColorHex ?? "#f7f7f3"),
    wallFrameColorHex: String(nextBooth.wallFrameColorHex ?? presetBooth.wallFrameColorHex ?? "#bfc5c4"),
    plannedBackPanelWidthMm: Math.max(0, Domain.finiteNumber(nextBooth.plannedBackPanelWidthMm, presetBooth.plannedBackPanelWidthMm ?? 0)),
    plannedBackPanelHeightMm: Math.max(0, Domain.finiteNumber(nextBooth.plannedBackPanelHeightMm, presetBooth.plannedBackPanelHeightMm ?? 0)),
    plannedBackPanelThicknessMm: Math.max(0, Domain.finiteNumber(nextBooth.plannedBackPanelThicknessMm, presetBooth.plannedBackPanelThicknessMm ?? 0)),
    plannedBackPanelStatus: String(nextBooth.plannedBackPanelStatus ?? presetBooth.plannedBackPanelStatus ?? "")
  };
  state.items = incoming.items.map((source, index) => ({
    ...source,
    id: String(source.id || `loaded-${index + 1}-${Date.now()}`),
    type: String(source.type || "fixture"),
    label: String(source.label || `配置物 ${index + 1}`),
    width: Math.max(1, Domain.finiteNumber(source.width, 50)),
    depth: Math.max(1, Domain.finiteNumber(source.depth, 50)),
    height: Math.max(0, Domain.finiteNumber(source.height, 0)),
    x: Domain.finiteNumber(source.x, 0),
    y: Domain.finiteNumber(source.y, 0),
    z: Math.max(0, Domain.finiteNumber(source.z, 0)),
    rotationDeg: Domain.normalizeRotationDegrees(source.rotationDeg ?? (Number(source.rotationQuarterTurns) || 0) * 90)
  }));
  state.selectedId = state.items.some((item) => item.id === incoming.selectedId) ? incoming.selectedId : null;
  state.view = "layout";
  normalizeItems();
  keepWallAndAisleDifferent("wallSide");
  $("presetSelect").value = state.preset;
  syncTextInputs();
  syncBoothInputs();
}

function saveProject() {
  const project = Domain.createProjectDocument(state);
  downloadBlob(
    JSON.stringify(project, null, 2),
    `${state.eventName || "booth-layout"}-${state.boothNo || "draft"}.json`,
    "application/json;charset=utf-8"
  );
}

function loadProject(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const parsed = Domain.parseProjectDocument(reader.result);
      applyLoadedState(parsed.state);
      render();
    } catch (error) {
      console.warn("Project load failed", error);
      alert("読込できませんでした。対応する保存JSONか確認してください。");
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
  if (current.includes("JEX 2階レンタル装飾")) return expected;
  if (current.includes("NEO TOKYO EYEWEAR SHOW 2026 出展マニュアル確認済み") && current.includes("最終割当小間が変形")) return expected;
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
  activeItems().forEach((item) => addThreeItem(scene, item));
  if (advancedMode) {
    addThreePowerRoutes(scene);
    addThreeOperationalOverlays(scene);
  }
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
  const currentItems = activeItems();
  const visiblePeople = currentItems.filter((item) => item.type === "person").length;
  const printFaces = currentItems.reduce((sum, item) => sum + [item.frontTexture, item.riserTexture, ...(item.tierTextures || [])].filter(Boolean).length, 0);
  const pending = Math.max(0, threeExpectedAssetCount - threeLoadedAssetCount);
  status.classList.toggle("is-loading", pending > 0);
  status.classList.toggle("has-error", threeFailedAssetCount > 0);
  if (pending > 0) {
    status.textContent = `選択項目の人物・印刷素材を読込中 ${threeLoadedAssetCount}/${threeExpectedAssetCount}`;
  } else if (threeFailedAssetCount > 0) {
    status.textContent = `${operationModeLabel(state.operationMode)} 配置物 ${currentItems.length}点のみ（人物 ${visiblePeople}人・印刷面 ${printFaces}面／一部素材は代替表示）`;
  } else {
    status.textContent = `${operationModeLabel(state.operationMode)} 配置物 ${currentItems.length}点のみ・自動追加なし（人物 ${visiblePeople}人・印刷面 ${printFaces}面）`;
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
  threePreview = { renderer, camera, scene: null, target: new T.Vector3(), yaw: 0, pitch: 0, zoom: 1, lateral: 0.34, cameraMode: "orbit", assetsReady: Promise.resolve() };
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
  if (state.booth.spaceOnly) {
    if (hasPlannedBackPanel()) {
      addThreeWall(scene, state.booth.wallSide, state.booth.plannedBackPanelHeightMm, true, {
        span: Math.min(state.booth.plannedBackPanelWidthMm, state.booth.wallSide === "top" || state.booth.wallSide === "bottom" ? state.booth.width : state.booth.depth),
        thickness: state.booth.plannedBackPanelThicknessMm || 50,
        wallColor: "#f4f4f1",
        frameColor: "#aeb4b3"
      });
    }
    return;
  }
  ["top", "right", "bottom", "left"].forEach((side) => {
    if (side === state.booth.aisleSide) return;
    const isMain = side === state.booth.wallSide;
    const height = isMain ? state.booth.wallHeight : Math.min(state.booth.sideWallHeightMm || 1200, state.booth.wallHeight);
    const options = isMain ? {} : sideReturnWallOptions(side);
    addThreeWall(scene, side, height, isMain, options);
  });
}

function sideReturnWallOptions(side) {
  const w = state.booth.width;
  const d = state.booth.depth;
  const desired = Math.max(0, state.booth.sideReturnDepthMm || (side === "left" || side === "right" ? d : w));
  if ((state.booth.wallSide === "top" || state.booth.wallSide === "bottom") && (side === "left" || side === "right")) {
    const span = Math.min(d, desired);
    return { span, alongCenter: state.booth.wallSide === "top" ? -d / 2 + span / 2 : d / 2 - span / 2 };
  }
  if ((state.booth.wallSide === "left" || state.booth.wallSide === "right") && (side === "top" || side === "bottom")) {
    const span = Math.min(w, desired);
    return { span, alongCenter: state.booth.wallSide === "left" ? -w / 2 + span / 2 : w / 2 - span / 2 };
  }
  return {};
}

function addThreeWall(scene, side, height, isMain, options = {}) {
  const T = window.THREE;
  const w = state.booth.width;
  const d = state.booth.depth;
  const thickness = Math.max(1, options.thickness || 42);
  const horizontal = side === "top" || side === "bottom";
  const span = Math.min(options.span || (horizontal ? w : d), horizontal ? w : d);
  const alongCenter = Domain.finiteNumber(options.alongCenter, 0);
  const wallColor = options.wallColor || state.booth.wallColorHex || "#f7f7f3";
  const frameColor = options.frameColor || state.booth.wallFrameColorHex || "#bfc5c4";
  const wall = new T.Mesh(
    new T.BoxGeometry(horizontal ? span : thickness, height, horizontal ? thickness : span),
    new T.MeshStandardMaterial({ color: wallColor, roughness: 0.76, metalness: 0.02 })
  );
  wall.position.set(
    side === "left" ? -w / 2 - thickness / 2 : side === "right" ? w / 2 + thickness / 2 : horizontal ? alongCenter : 0,
    height / 2,
    side === "top" ? -d / 2 - thickness / 2 : side === "bottom" ? d / 2 + thickness / 2 : horizontal ? 0 : alongCenter
  );
  wall.castShadow = true;
  wall.receiveShadow = true;
  scene.add(wall);

  const panelPitch = Math.max(100, state.booth.wallPanelWidthMm || 990);
  for (let along = -span / 2; along <= span / 2 + 1; along += panelPitch) {
    const post = new T.Mesh(
      new T.BoxGeometry(horizontal ? 18 : 24, height + 18, horizontal ? 24 : 18),
      new T.MeshStandardMaterial({ color: frameColor, roughness: 0.4, metalness: 0.55 })
    );
    post.position.set(
      horizontal ? alongCenter + along : wall.position.x,
      height / 2,
      horizontal ? wall.position.z : alongCenter + along
    );
    post.castShadow = true;
    scene.add(post);
  }
}

function addThreeItem(scene, item) {
  if (item.type === "zone") return addThreeSpaceZone(scene, item);
  if (item.type === "wall") return addThreeWallSign(scene, item);
  if (item.type === "spotlight") return addThreeSpotlight(scene, item);
  if (item.type === "power") return addThreeOutlet(scene, item);
  if (item.type === "person") return addThreePerson(scene, item);
  const displayItem = createThreeDisplayItem(item);
  if (item.type === "scenario") return addThreeOperationalItem(scene, displayItem);
  if (item.type === "powerstrip") return addThreePowerStrip(scene, displayItem);
  if (item.type === "device") return addThreeGenericDevice(scene, displayItem);
  if (item.type === "product") return addThreeOfficialProduct(scene, displayItem);
  if (item.type === "chair") return addThreeChair(scene, displayItem);
  if (item.type === "bolda") return addThreeBolda(scene, displayItem);
  if (item.type === "fixture" && String(item.label || "").includes("姿見")) return addThreeMirror(scene, displayItem);
  if (item.type === "fixture" && String(item.label || "").includes("棚")) return addThreeShelfFixture(scene, displayItem);
  if (isFoldingTableItem(item)) return addThreeFoldingTable(scene, displayItem);
  addThreeCounter(scene, displayItem);
}

function addThreeSpaceZone(scene, item) {
  const T = window.THREE;
  const color = { contact: 0x188778, staff: 0x6b55a3, inventory: 0x9a6b37 }[item.spaceCategory] || 0x188778;
  const volumeHeight = item.spaceCategory === "inventory" ? Math.max(0, item.inventoryMaxStackHeightMm || 0) : 0;
  const mesh = new T.Mesh(
    new T.BoxGeometry(item.width, volumeHeight || 8, item.depth),
    new T.MeshStandardMaterial({ color, transparent: true, opacity: volumeHeight ? 0.16 : 0.28, roughness: 0.9, metalness: 0, depthWrite: false, wireframe: volumeHeight > 0 })
  );
  mesh.position.set(threeWorldX(item.x + item.width / 2), volumeHeight ? volumeHeight / 2 : 8, threeWorldZ(item.y + item.depth / 2));
  mesh.userData.itemId = item.id;
  mesh.receiveShadow = true;
  mesh.renderOrder = 2;
  scene.add(mesh);
}

function addThreePowerRoutes(scene) {
  const T = window.THREE;
  state.items.filter(isPoweredLoad).forEach((item) => {
    const route = getCableRouteData(item);
    if (!route) return;
    const floorY = 24;
    const sourceY = getItemVerticalRange(route.source).center;
    const targetY = getItemVerticalRange(item).center;
    const points = [
      new T.Vector3(threeWorldX(route.points[0].x), sourceY, threeWorldZ(route.points[0].y)),
      new T.Vector3(threeWorldX(route.points[0].x), floorY, threeWorldZ(route.points[0].y)),
      ...route.points.slice(1).map((point) => new T.Vector3(threeWorldX(point.x), floorY, threeWorldZ(point.y))),
      new T.Vector3(threeWorldX(route.points[route.points.length - 1].x), targetY, threeWorldZ(route.points[route.points.length - 1].y))
    ];
    const geometry = new T.BufferGeometry().setFromPoints(points);
    const material = new T.LineBasicMaterial({ color: route.crossings.length ? 0xb43434 : 0xd26834, depthTest: false, transparent: true, opacity: 0.95 });
    const lineObject = new T.Line(geometry, material);
    lineObject.userData.itemId = item.id;
    lineObject.renderOrder = 10;
    scene.add(lineObject);
  });
}

function addThreeOperationalOverlays(scene) {
  const T = window.THREE;
  (operationalAudit?.targets || []).forEach((entry) => {
    if (!(entry.item.targetViewHeightMm > 0)) return;
    const center = Domain.rectangleCenter(entry.item);
    const color = entry.item.visibilityRole === "main-product" ? 0xb43434 : entry.item.visibilityRole === "pop" ? 0xa87700 : 0x007c76;
    const marker = new T.Mesh(new T.SphereGeometry(42, 18, 12), new T.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 0.35 }));
    marker.position.set(threeWorldX(center.x), entry.item.targetViewHeightMm, threeWorldZ(center.y));
    marker.userData.itemId = entry.item.id;
    scene.add(marker);
    if (entry.item.id !== state.selectedId) return;
    entry.viewpointResults.forEach((view) => {
      const geometry = new T.BufferGeometry().setFromPoints([
        new T.Vector3(threeWorldX(view.viewpoint.x), view.viewpoint.z, threeWorldZ(view.viewpoint.y)),
        new T.Vector3(threeWorldX(center.x), entry.item.targetViewHeightMm, threeWorldZ(center.y))
      ]);
      const lineObject = new T.Line(geometry, new T.LineBasicMaterial({ color: view.visible ? 0x1f8f5c : 0xb43434, transparent: true, opacity: 0.72, depthTest: false }));
      lineObject.renderOrder = 11;
      scene.add(lineObject);
    });
    addThreeMovementPath(scene, entry.visitorPath, 0x176bb3);
    addThreeMovementPath(scene, entry.staffPath, 0x7847a8);
  });
}

function addThreeMovementPath(scene, path, color) {
  if (!path?.found || !path.points.length) return;
  const T = window.THREE;
  const geometry = new T.BufferGeometry().setFromPoints(path.points.map((point) => new T.Vector3(threeWorldX(point.x), 30, threeWorldZ(point.y))));
  const lineObject = new T.Line(geometry, new T.LineBasicMaterial({ color, depthTest: false }));
  lineObject.renderOrder = 11;
  scene.add(lineObject);
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
  const turns = Math.round(Domain.normalizeRotationDegrees(item.rotationDeg ?? (Number(item.rotationQuarterTurns) || 0) * 90) / 90);
  return ((turns % 4) + 4) % 4;
}

function syncSelectedMeasurements(item) {
  const clearances = Domain.wallClearances(item, state.booth);
  const nearest = state.items
    .filter((other) => other.id !== item.id && isItemActive(other) && !["wall", "spotlight", "power", "zone"].includes(other.type))
    .map((other) => ({ other, distance: Domain.rectangleDistance(item, other) }))
    .sort((a, b) => a.distance - b.distance)[0];
  $("selectedMeasurements").textContent = [
    `壁距離 上${Math.round(clearances.top)} / 右${Math.round(clearances.right)} / 下${Math.round(clearances.bottom)} / 左${Math.round(clearances.left)}mm`,
    nearest ? `最短什器間距離 ${Math.round(nearest.distance)}mm（${nearest.other.label}）` : "他の床置き什器なし"
  ].join("｜");
}

function syncFixtureMasterInfo(item, master) {
  const wrap = $("fixtureMasterInfo");
  if (item.type === "zone") {
    const inventoryNote = item.spaceCategory === "inventory"
      ? " 箱は登録した実測W/D/Hだけを使い、平面90°回転2方向と整数積上段を比較します。3Dのワイヤー枠は登録最大積上高であり、箱形状や耐荷重は推測しません。"
      : "";
    wrap.innerHTML = `<strong>用途領域｜${escapeHtml(spaceCategoryLabel(item.spaceCategory))}</strong>床上の計画矩形で、什器ではありません。衝突障害物にはせず、登録W/D、通路側・スタッフ起点からの到達性、重複障害物をmm²で集計します。必要面積は推測せず運用基準を登録してください。${escapeHtml(inventoryNote)}`;
    return;
  }
  if (item.type === "scenario") {
    const shapeNote = item.scenarioKind
      ? `${scenarioKindLabel(item.scenarioKind)}として識別できるパラメトリック3Dを、登録W/D/H内に表示します。メーカー固有形状ではありません。`
      : "3Dは登録W/D/Hの半透明占有領域です。";
    wrap.innerHTML = `<strong>状態別物品｜${escapeHtml(item.dimensionsConfirmed ? "実測確認済み" : "仮寸法・要実測")}</strong>${escapeHtml(operationalCategoryLabel(item.operationalCategory))}。${escapeHtml(activationModeLabel(item.activationMode))}に衝突・視認・動線へ反映します。${escapeHtml(shapeNote)}`;
    return;
  }
  if (!master) {
    wrap.innerHTML = `<strong>什器マスター未登録</strong>この配置物はプリセット内の個別定義です。材質・商品位置・POP位置・設営情報は未登録です。`;
    return;
  }
  const matchesMaster = dimensionsMatchMaster(item, master);
  const dimensionState = master.dimensionLocked
    ? (matchesMaster ? "マスター寸法一致" : "マスター寸法と不一致")
    : (matchesMaster ? "マスター初期寸法一致（編集可）" : "個別寸法登録（マスター初期値から変更）");
  const modelNote = master.modelNote || (master.type === "bolda"
    ? (getBoldaCode(item) === "TB13"
      ? "提供テンプレートから、外形W900×D500×H800、下部H650、2開口各約W413×H100、板厚25mmを反映済みです。前面商品画像は提供PSDの埋め込み元画像から下切れなしで再出力しています。製造CAD・内部折り構造は未確認です。"
      : "外形W/D/Hは提供ファイル名で確認済み。段差・棚板等の詳細3D形状は組立画像基準で、製造CAD未確認です。")
    : master.type === "product"
      ? (master.dimensionAccuracy === "partial-verified"
        ? "容器本体寸法は資料確認済み。トリガー込み外形は暫定値で、現物実測後に確定してください。3Dは暫定外形内の参照形状です。"
        : "登録W/D/Hは商品資料で確認済み。3Dは正確な外形寸法内の参照簡略形状で、製造CADではありません。")
      : "汎用3D形状。正確な製品型番・図面は未登録です。");
  const sourceLink = master.sourceUrl?.startsWith("https://") ? `<br>公式情報: <a href="${escapeHtml(master.sourceUrl)}" target="_blank" rel="noreferrer">商品ページを開く</a>` : "";
  const catalogText = master.catalogReference ? `<br>商品資料: ${escapeHtml(master.catalogReference)}` : "";
  const setupText = master.setupInfo?.instructions?.length ? `<br>設営情報: ${escapeHtml(master.setupInfo.instructions.join(" / "))}` : "";
  wrap.innerHTML = `
    <strong>${escapeHtml(master.masterId)}｜${escapeHtml(dimensionState)}</strong>
    材質: ${escapeHtml(master.material)}<br>
    寸法根拠: ${escapeHtml(master.dimensionSource)}<br>
    POP面: ${master.popPlacementPositions.length}面 / 商品設置位置: ${master.productPlacementPositions.length ? `${master.productPlacementPositions.length}か所` : "未登録"}<br>
    <span class="${master.type === "bolda" || master.dimensionAccuracy === "partial-verified" ? "accuracy-warn" : ""}">${escapeHtml(modelNote)}</span>${sourceLink}${catalogText}${setupText}
  `;
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
  group.position.set(threeWorldX(item.x + planWidth / 2), item.z || 0, threeWorldZ(item.y + planDepth / 2));
  group.rotation.y = quarterTurns * Math.PI / 2;
  if (Math.min(item.width, item.depth) < 24 || item.model3d?.pickVolume || item.model3d?.kind === "rotating-net-display") {
    // Invisible picking volume: net holes and thin edges remain selectable.
    // Material visibility does not disable Three's mesh raycasting.
    const pick = addLocalBox(group, item.width, item.height, item.depth, 0, item.height / 2, 0,
      new T.MeshBasicMaterial({ visible: false }), false);
    pick.userData.pickDimensions = { width: item.width, height: item.height, depth: item.depth };
  }
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

function addThreePowerStrip(scene, item) {
  const group = createFacingGroup(item);
  const height = item.height || defaultItemHeight(item);
  const body = threeStandardMaterial(0xf3f1ec, { roughness: 0.56 });
  const socket = threeStandardMaterial(0x3a3f40, { roughness: 0.48 });
  addLocalBox(group, item.width, height, item.depth, 0, height / 2, 0, body);
  const socketCount = Math.max(2, Math.min(6, Math.floor(item.width / 75)));
  for (let index = 0; index < socketCount; index += 1) {
    const x = -item.width / 2 + item.width * (index + 1) / (socketCount + 1);
    addLocalBox(group, 28, 5, Math.min(54, item.depth * 0.48), x, height + 3, 0, socket, false);
  }
  scene.add(group);
}

function addThreeGenericDevice(scene, item) {
  const group = createFacingGroup(item);
  const height = item.height || defaultItemHeight(item);
  const body = threeStandardMaterial(0x8a9fb5, { roughness: 0.72 });
  const face = threeStandardMaterial(0xeaf0f4, { roughness: 0.58 });
  addLocalBox(group, item.width, height, item.depth, 0, height / 2, 0, body);
  addLocalBox(group, item.width * 0.72, height * 0.46, 8, 0, height * 0.56, item.depth / 2 + 5, face, false);
  scene.add(group);
}

function addThreeOfficialProduct(scene, item) {
  if (item.model3d?.kind === "printed-pop-panel") return addThreePrintedPopPanel(scene, item);
  if (item.model3d?.kind === "acrylic-sign-stand") return addThreeAcrylicSignStand(scene, item);
  if (item.model3d?.kind === "wooden-tool-stand") return addThreeWoodenToolStand(scene, item);
  if (item.productCategory === "gacha-machine") return addThreeGachaMachine(scene, item);
  if (item.productCategory === "gacha-stand") return addThreeGachaStand(scene, item);
  if (item.productCategory === "capsule-recovery-box") return addThreeCapsuleRecoveryBox(scene, item);
  if (item.productCategory === "mist-bottle") return addThreeMistBottle(scene, item);
  if (item.productCategory === "aluminum-pegboard") return addThreeAluminumPegboard(scene, item);
  if (item.model3d?.kind === "rotating-net-display") return addThreeRotatingNetDisplay(scene, item);
  if (item.productCategory === "processing-storage-rack") return addThreeProcessingRack(scene, item);
  if (item.productCategory === "ultrasonic-cleaner") return addThreeUltrasonicCleaner(scene, item);
  if (item.productCategory.startsWith("frame-heater-")) return addThreeFrameHeater(scene, item);
  if (item.productCategory.startsWith("buff-motor-")) return addThreeBuffMotor(scene, item);
  addThreeCounter(scene, item);
}

function addThreePrintedPopPanel(scene, item) {
  const T = window.THREE, group = createFacingGroup(item);
  const count = item.model3d.panelCount, panelWidth = item.width / count;
  const board = threeStandardMaterial(0xf7f7f2, { roughness: .9 });
  for (let index = 0; index < count; index++) {
    addLocalBox(group, panelWidth, item.height, item.depth,
      -item.width / 2 + panelWidth * (index + .5), item.height / 2, 0, board);
  }
  const print = addThreeImagePlane(group, item.frontTexture, item.width, item.height, item.depth / 2, item.height / 2);
  if (print) {
    // Crop the original texture by UVs; never stretch the full panorama onto each A2 sheet.
    const uv = print.geometry.getAttribute("uv"), slices = item.model3d.artworkSlices;
    for (let i = 0; i < uv.count; i++) uv.setX(i, (item.model3d.artworkSlice + uv.getX(i)) / slices);
    uv.needsUpdate = true;
    print.material.side = T.FrontSide;
    print.userData.artworkSlice = item.model3d.artworkSlice;
  }
  scene.add(group);
  return group;
}

function addThreeAcrylicSignStand(scene, item) {
  const T = window.THREE, group = createFacingGroup(item);
  const t = item.model3d.thicknessMm;
  const acrylic = new T.MeshPhysicalMaterial({ color: 0xd9edf0, transparent: true, opacity: .42, roughness: .15, depthWrite: false });
  const edge = threeStandardMaterial(0x9ebbc3, { roughness: .3 });
  addLocalBox(group, item.width, t, item.depth, 0, t / 2, 0, acrylic);
  // Inclination is illustrative; dimensions used by placement remain the official outer envelope.
  const rise = item.height - t * 2, lean = item.depth * .55;
  const panelHeight = Math.hypot(rise, lean), panel = new T.Group();
  panel.rotation.x = -Math.atan2(lean, rise);
  panel.position.set(0, t + rise / 2, item.depth * .16);
  addLocalBox(panel, item.width, panelHeight, t, 0, 0, 0, acrylic);
  addLocalBox(panel, item.width - 8, panelHeight - 9, 1, 0, 0, 0, threeStandardMaterial(0xfdfdfa, { roughness: .86 }));
  for (const x of [-item.width / 2 + 1, item.width / 2 - 1]) addLocalBox(panel, 2, panelHeight, t, x, 0, 0, edge, false);
  group.add(panel);
  scene.add(group);
}

function addThreeWoodenToolStand(scene, item) {
  const T = window.THREE, group = createFacingGroup(item);
  const wood = threeStandardMaterial(item.color, { roughness: .83 });
  const rail = threeStandardMaterial(0xe4c392, { roughness: .8 });
  const wall = item.depth * .085, radius = item.depth / 2, straight = item.height - radius;
  // Both sizes share the rounded side panels, plier rails and perforated front holder.
  // Internal proportions come from the official photos, not a manufacturing drawing.
  for (const x of [-item.width / 2 + wall / 2, item.width / 2 - wall / 2]) {
    addLocalBox(group, wall, straight, item.depth, x, straight / 2, 0, wood);
    const cap = new T.Mesh(new T.CylinderGeometry(radius, radius, wall, 40), wood);
    cap.rotation.z = Math.PI / 2; cap.position.set(x, straight, 0);
    cap.castShadow = true; cap.receiveShadow = true; group.add(cap);
  }
  const innerWidth = item.width - wall * 2;
  for (const [height, z] of [[.87, -.25], [.63, -.25], [.54, .07]])
    addLocalBox(group, innerWidth, item.height * .12, wall, 0, item.height * height, item.depth * z, rail);
  const holderDepth = item.depth * .24, holderHeight = item.height * .23;
  const shape = new T.Shape();
  shape.moveTo(-innerWidth / 2, -holderDepth / 2); shape.lineTo(innerWidth / 2, -holderDepth / 2);
  shape.lineTo(innerWidth / 2, holderDepth / 2); shape.lineTo(-innerWidth / 2, holderDepth / 2); shape.closePath();
  const count = item.model3d.driverHoles, holeRadius = Math.min(5, innerWidth / (count * 3.6));
  for (let i = 0; i < count; i++) {
    const hole = new T.Path();
    hole.absarc(-innerWidth / 2 + innerWidth * (i + .5) / count, 0, holeRadius, 0, Math.PI * 2, true);
    shape.holes.push(hole);
  }
  const holder = new T.Mesh(new T.ExtrudeGeometry(shape, { depth: holderHeight, bevelEnabled: false, curveSegments: 12 }), rail);
  holder.rotation.x = -Math.PI / 2;
  holder.position.set(0, item.height * .23, item.depth * .31);
  holder.castShadow = true; holder.receiveShadow = true; group.add(holder);
  scene.add(group);
}

function addThreeProcessingRack(scene, item) {
  const T = window.THREE;
  const group = createFacingGroup(item);
  const acrylic = new T.MeshPhysicalMaterial({ color: 0xe6f2f4, transparent: true, opacity: 0.34, roughness: 0.12, transmission: 0.28, depthWrite: false });
  const edge = threeStandardMaterial(0xc1cbce, { roughness: 0.34, metalness: 0.08 });
  const wall = Math.max(4, Math.min(8, item.width * 0.035));
  addLocalBox(group, wall, item.height, item.depth, -item.width / 2 + wall / 2, item.height / 2, 0, acrylic);
  addLocalBox(group, wall, item.height, item.depth, item.width / 2 - wall / 2, item.height / 2, 0, acrylic);
  for (let shelf = 0; shelf <= 5; shelf += 1) {
    addLocalBox(group, item.width, wall, item.depth, 0, shelf * (item.height - wall) / 5 + wall / 2, 0, shelf === 0 || shelf === 5 ? edge : acrylic);
  }
  scene.add(group);
}

function addThreeUltrasonicCleaner(scene, item) {
  const group = createFacingGroup(item);
  const shell = threeStandardMaterial(0xe9eeee, { roughness: 0.52 });
  const steel = threeStandardMaterial(0x8b9698, { roughness: 0.24, metalness: 0.74 });
  const dark = threeStandardMaterial(0x252e31, { roughness: 0.48 });
  const bodyH = item.height * 0.8;
  addLocalBox(group, item.width, bodyH, item.depth, 0, bodyH / 2, 0, shell);
  addLocalBox(group, item.width * 0.88, item.height * 0.2, item.depth * 0.82, 0, bodyH + item.height * 0.1, 0, steel);
  addLocalBox(group, item.width * 0.74, 1, item.depth * 0.66, 0, item.height - .5, 0, dark, false);
  addLocalBox(group, item.width * 0.6, item.height * 0.14, 5, 0, bodyH * 0.48, item.depth / 2 + 2, threeStandardMaterial(0xf8f8f4, { roughness: 0.68 }), false);
  scene.add(group);
}

function addThreeRotatingNetDisplay(scene, item) {
  const T = window.THREE;
  const group = createFacingGroup(item);
  const dark = threeStandardMaterial(item.color, { roughness: .68 });
  const clip = threeStandardMaterial(0xd9dee0, { roughness: .4 });
  const model = item.model3d;
  const baseRadius = model.baseDiameterMm / 2;
  addLocalCylinder(group, baseRadius, 10, 0, 5, 0, dark, 48);
  addLocalCylinder(group, 17, item.height - 12, 0, (item.height - 12) / 2, 0, dark, 16);
  // Three mesh faces and a round rotating foot follow the official photo.
  // Frame/clip details are illustrative; the outer 330×330×390 envelope is fixed.
  const vertices = [[-item.width / 2 + 8, -item.depth / 2 + 8],
    [item.width / 2 - 8, -item.depth / 2 + 8], [0, item.depth / 2 - 8]];
  const bottom = 30, top = item.height - 18, meshHeight = top - bottom;
  vertices.forEach(([x1, z1], index) => {
    const [x2, z2] = vertices[(index + 1) % vertices.length];
    const face = new T.Group();
    const length = Math.hypot(x2 - x1, z2 - z1);
    face.position.set((x1 + x2) / 2, 0, (z1 + z2) / 2);
    face.rotation.y = -Math.atan2(z2 - z1, x2 - x1);
    for (const x of [-length / 2, length / 2]) addLocalBox(face, 9, meshHeight, 9, x, (top + bottom) / 2, 0, dark);
    for (const y of [bottom, top]) addLocalBox(face, length, 10, 9, 0, y, 0, dark);
    for (let x = -length / 2 + model.meshPitchMm; x < length / 2; x += model.meshPitchMm)
      addLocalBox(face, model.wireDiameterMm, meshHeight, model.wireDiameterMm, x, (top + bottom) / 2, 0, dark, false);
    for (let y = bottom + model.meshPitchMm; y < top; y += model.meshPitchMm)
      addLocalBox(face, length, model.wireDiameterMm, model.wireDiameterMm, 0, y, 0, dark, false);
    for (const x of [-length / 3, length / 3]) addLocalBox(face, 10, 14, 6, x, top + 7, 0, clip, false);
    group.add(face);
  });
  addLocalBox(group, 42, 8, 12, 0, item.height - 4, 0, clip, false);
  scene.add(group);
}

function addThreeAluminumPegboard(scene, item) {
  const group = createFacingGroup(item);
  const thickness = Math.max(1, item.depth);
  const silver = threeStandardMaterial(0xc4c7c6, { roughness: 0.34, metalness: 0.78 });
  addLocalBox(group, item.width, item.height, thickness, 0, item.height / 2, 0, silver);
  addThreeImagePlane(group, item.image, item.width, item.height, thickness / 2 + 1, item.height / 2);
  scene.add(group);
}

function addThreeGachaMachine(scene, item) {
  const T = window.THREE;
  const group = createFacingGroup(item);
  const h = item.height;
  const shell = threeStandardMaterial(0xf2f3ef, { roughness: 0.6 });
  const metal = threeStandardMaterial(0xb6bdbd, { roughness: 0.28, metalness: 0.7 });
  const clear = new T.MeshPhysicalMaterial({ color: 0xd8f2f4, transparent: true, opacity: 0.34, roughness: 0.12, transmission: 0.34, depthWrite: false });
  const baseH = Math.min(165, h * 0.38);
  addLocalBox(group, item.width, baseH, item.depth, 0, baseH / 2, 0, shell);
  addLocalBox(group, item.width * 0.92, h - baseH - 18, item.depth * 0.68, 0, baseH + (h - baseH - 18) / 2, -item.depth * 0.08, clear);
  addLocalBox(group, item.width, 18, item.depth * 0.72, 0, h - 9, -item.depth * 0.06, shell);
  const handle = new T.Mesh(new T.CylinderGeometry(26, 26, 22, 20), metal);
  handle.rotation.x = Math.PI / 2;
  handle.position.set(0, baseH * 0.58, item.depth / 2 - 12);
  handle.userData.itemId = item.id;
  group.add(handle);
  addLocalBox(group, item.width * 0.56, 14, 24, 0, 30, item.depth / 2 - 12, metal, false);
  scene.add(group);
}

function addThreeGachaStand(scene, item) {
  const group = createFacingGroup(item);
  const paper = threeStandardMaterial(0xf7f5ed, { roughness: 0.9 });
  const edge = threeStandardMaterial(0xc7c4ba, { roughness: 0.82 });
  addLocalBox(group, item.width, item.height, item.depth, 0, item.height / 2, 0, paper);
  addLocalBox(group, item.width - 18, 8, item.depth - 18, 0, item.height - 4, 0, edge, false);
  scene.add(group);
}

function addThreeCapsuleRecoveryBox(scene, item) {
  const T = window.THREE;
  const group = createFacingGroup(item);
  const cardboard = threeStandardMaterial(0xc9944e, { roughness: 0.94 });
  const print = threeStandardMaterial(0x9c6d32, { roughness: 0.86 });
  addLocalBox(group, item.width, item.height, item.depth, 0, item.height / 2, 0, cardboard);
  const ring = new T.Mesh(new T.TorusGeometry(Math.min(42.5, item.width * 0.18), 5, 10, 30), print);
  ring.position.set(0, item.height * 0.72, item.depth / 2 + 1);
  ring.userData.itemId = item.id;
  group.add(ring);
  addLocalBox(group, item.width * 0.64, 12, 8, 0, item.height * 0.35, item.depth / 2 + 1, print, false);
  scene.add(group);
}

function addThreeMistBottle(scene, item) {
  const group = createFacingGroup(item);
  const bottle = threeStandardMaterial(0x17356f, { roughness: 0.44 });
  const label = threeStandardMaterial(0xf2f5f6, { roughness: 0.72 });
  const trigger = threeStandardMaterial(0x20282b, { roughness: 0.58 });
  const bodyDiameter = Math.min(54.7, item.width, item.depth);
  const bodyHeight = Math.min(165.2, item.height * 0.78);
  addLocalCylinder(group, bodyDiameter / 2, bodyHeight, 0, bodyHeight / 2, 0, bottle, 24);
  addLocalBox(group, bodyDiameter * 0.76, bodyHeight * 0.48, bodyDiameter / 2 + 2, 0, bodyHeight * 0.49, bodyDiameter / 4, label, false);
  const neckHeight = Math.min(27, Math.max(12, item.height - bodyHeight - 30));
  addLocalCylinder(group, bodyDiameter * 0.26, neckHeight, 0, bodyHeight + neckHeight / 2, 0, trigger, 18);
  const headHeight = Math.max(12, item.height - bodyHeight - neckHeight);
  addLocalBox(group, Math.min(item.width * 0.72, 65), headHeight * 0.45, Math.min(item.depth * 0.82, 49), -item.width * 0.08, bodyHeight + neckHeight + headHeight * 0.35, 0, trigger);
  addLocalBox(group, Math.min(item.width * 0.46, 40), headHeight * 0.22, Math.min(item.depth * 0.68, 38), item.width * 0.2, bodyHeight + neckHeight + headHeight * 0.61, 0, trigger);
  scene.add(group);
}

function addThreeFrameHeater(scene, item) {
  const group = createFacingGroup(item);
  const cream = threeStandardMaterial(0xe6d7b3, { roughness: 0.66 });
  const dark = threeStandardMaterial(0x30383a, { roughness: 0.48 });
  const metal = threeStandardMaterial(0xaeb5b5, { roughness: 0.28, metalness: 0.66 });
  if (item.productCategory === "frame-heater-169") {
    const radius = Math.min(item.width, item.depth) / 2;
    addLocalCylinder(group, radius * 0.96, item.height * 0.84, 0, item.height * 0.42, 0, cream, 28);
    addLocalCylinder(group, radius * 0.82, item.height * 0.08, 0, item.height * 0.88, 0, metal, 28);
    addLocalCylinder(group, radius * 0.66, item.height * 0.08, 0, item.height * 0.96, 0, dark, 28);
    addLocalBox(group, item.width * 0.25, item.height * 0.13, item.depth * 0.09, 0, item.height * 0.25, item.depth * 0.47, dark, false);
  } else {
    addLocalBox(group, item.width, item.height * 0.58, item.depth, 0, item.height * 0.29, 0, cream);
    addLocalBox(group, item.width * 0.82, item.height * 0.2, item.depth * 0.86, 0, item.height * 0.67, -item.depth * 0.04, metal);
    addLocalCylinder(group, Math.min(item.width, item.depth) * 0.3, item.height * 0.18, 0, item.height * 0.87, -item.depth * 0.04, dark, 28);
    addLocalBox(group, item.width * 0.24, item.height * 0.1, item.depth * 0.08, item.width * 0.27, item.height * 0.25, item.depth * 0.46, dark, false);
  }
  scene.add(group);
}

function addThreeBuffMotor(scene, item) {
  const group = createFacingGroup(item);
  const body = threeStandardMaterial(0xdacda6, { roughness: 0.68 });
  const metal = threeStandardMaterial(0x777f80, { roughness: 0.3, metalness: 0.68 });
  const wheel = threeStandardMaterial(0xddd7c9, { roughness: 0.9 });
  const dark = threeStandardMaterial(0x252d2f, { roughness: 0.5 });
  if (item.productCategory === "buff-motor-1010") {
    addLocalBox(group, item.width, item.height, item.depth, 0, item.height / 2, 0, body);
    addLocalBox(group, item.width * 0.72, item.height * 0.34, 8, 0, item.height * 0.66, item.depth / 2 - 3, dark, false);
    addLocalHorizontalCylinder(group, item.height * 0.1, item.width * 0.54, 0, item.height * 0.67, item.depth * 0.28, wheel, 24);
  } else if (item.productCategory === "buff-motor-95") {
    addLocalBox(group, item.width, item.height * 0.9, item.depth, 0, item.height * 0.45, 0, body);
    addLocalBox(group, item.width * 0.75, item.height * 0.56, 8, 0, item.height * 0.54, item.depth / 2 - 3, dark, false);
    addLocalHorizontalCylinder(group, item.height * 0.18, item.width * 0.58, 0, item.height * 0.55, item.depth * 0.24, wheel, 24);
    addLocalBox(group, item.width * 0.2, item.height * 0.1, item.depth * 0.1, 0, item.height * 0.22, item.depth * 0.46, metal, false);
  } else {
    addLocalBox(group, item.width * 0.46, item.height * 0.46, item.depth * 0.55, 0, item.height * 0.39, 0, body);
    addLocalBox(group, item.width * 0.72, item.height * 0.08, item.depth * 0.72, 0, item.height * 0.04, 0, metal);
    addLocalHorizontalCylinder(group, item.height * 0.2, item.width * 0.76, 0, item.height * 0.54, 0, metal, 24);
    const wheelX = item.width * 0.39;
    const wheelRadius = Math.min(item.height * 0.34, item.depth * 0.46);
    [-wheelX, wheelX].forEach((x) => addLocalHorizontalCylinder(group, wheelRadius, item.width * 0.1, x, item.height * 0.54, 0, wheel, 28));
  }
  scene.add(group);
}

function addThreeOperationalItem(scene, item) {
  if (!item.scenarioKind) return addThreeScenarioPlaceholder(scene, item);
  const T = window.THREE;
  const group = createFacingGroup(item);
  const body = threeStandardMaterial(item.color || 0x7c8588, { roughness: 0.72 });
  const dark = threeStandardMaterial(0x293235, { roughness: 0.5 });
  const light = threeStandardMaterial(0xe9eeed, { roughness: 0.8 });
  const h = item.height || defaultItemHeight(item);
  if (item.scenarioKind === "laptop") {
    addLocalBox(group, item.width, Math.max(10, h * 0.07), item.depth * 0.74, 0, h * 0.035, item.depth * 0.12, body);
    addLocalBox(group, item.width * 0.92, h * 0.9, Math.max(8, item.depth * 0.045), 0, h * 0.55, -item.depth * 0.35, dark);
    addLocalBox(group, item.width * 0.84, h * 0.7, Math.max(5, item.depth * 0.025), 0, h * 0.51, -item.depth * 0.32, threeStandardMaterial(0x79aeb9, { roughness: 0.3 }), false);
    addLocalBox(group, item.width * 0.72, 4, item.depth * 0.34, 0, h * 0.08, item.depth * 0.12, dark, false);
  } else if (item.scenarioKind === "compact-printer") {
    addLocalBox(group, item.width, h, item.depth, 0, h / 2, 0, light);
    addLocalBox(group, item.width * 0.72, h * 0.08, 2, 0, h * 0.7, item.depth / 2 - 1, dark, false);
    addLocalBox(group, item.width * 0.64, 1, item.depth * 0.48, 0, h - .5, -item.depth * 0.18, threeStandardMaterial(0xffffff, { roughness: 0.9 }), false);
  } else if (item.scenarioKind === "tablet" || item.scenarioKind === "smartphone") {
    addLocalBox(group, item.width, h, item.depth, 0, h / 2, 0, dark);
    addLocalBox(group, item.width * 0.9, 1, item.depth * 0.84, 0, h - .5, 0, threeStandardMaterial(0x79aeb9, { roughness: 0.24 }), false);
  } else if (item.scenarioKind === "monitor") {
    const screenH = h * 0.68;
    addLocalBox(group, item.width, screenH, Math.max(24, item.depth * 0.12), 0, h - screenH / 2, -item.depth * 0.18, dark);
    const screen = getMonitorScreen(item), screenWidth = item.width * .9, screenHeight = screenH * .82;
    addLocalBox(group, screenWidth, screenHeight, 5, 0, h - screenH / 2, -item.depth * .11,
      threeStandardMaterial(screen ? 0x080b10 : 0x79aeb9, { roughness: .28 }), false);
    if (screen) {
      const fit = Math.min(screenWidth / screen.width, screenHeight / screen.height);
      const print = addThreeImagePlane(group, screen.source, screen.width * fit, screen.height * fit,
        -item.depth * .11 + 2.6, h - screenH / 2);
      print.userData.monitorScreen = item.monitorScreenId;
      print.material.side = T.FrontSide;
      print.material.roughness = .25;
    }
    addLocalBox(group, item.width * 0.08, h * 0.28, item.depth * 0.12, 0, h * 0.2, 0, body);
    addLocalBox(group, item.width * 0.38, h * 0.05, item.depth * 0.7, 0, h * 0.025, 0, body);
  } else if (item.scenarioKind === "document-tray-3") {
    addLocalBox(group, item.width, h, 12, 0, h / 2, -item.depth / 2 + 6, body);
    addLocalBox(group, 12, h, item.depth, -item.width / 2 + 6, h / 2, 0, body);
    addLocalBox(group, 12, h, item.depth, item.width / 2 - 6, h / 2, 0, body);
    for (let i = 0; i < 4; i += 1) addLocalBox(group, item.width, 12, item.depth, 0, i * (h - 12) / 3 + 6, 0, light);
  } else if (item.scenarioKind === "trash-bin") {
    const wall = Math.max(8, Math.min(16, item.width * 0.06));
    addLocalBox(group, item.width, wall, item.depth, 0, wall / 2, 0, body);
    addLocalBox(group, wall, h, item.depth, -item.width / 2 + wall / 2, h / 2, 0, body);
    addLocalBox(group, wall, h, item.depth, item.width / 2 - wall / 2, h / 2, 0, body);
    addLocalBox(group, item.width - wall * 2, h, wall, 0, h / 2, -item.depth / 2 + wall / 2, body);
    addLocalBox(group, item.width - wall * 2, h, wall, 0, h / 2, item.depth / 2 - wall / 2, body);
    addLocalBox(group, item.width - wall * 2, 4, item.depth - wall * 2, 0, h - 2, 0, dark, false);
  } else if (item.scenarioKind === "stock-carton") {
    addLocalBox(group, item.width, h, item.depth, 0, h / 2, 0, threeStandardMaterial(0xc79758, { roughness: 0.92 }));
    addLocalBox(group, Math.max(8, item.width * 0.035), 3, item.depth, 0, h - 1.5, 0, threeStandardMaterial(0x8f6c42, { roughness: 0.86 }), false);
  } else if (item.scenarioKind === "paper-bag-stock") {
    [-0.2, 0, 0.2].forEach((factor) => addLocalBox(group, item.width * 0.44, h * 0.74, Math.max(8, item.depth * 0.2), factor * item.width, h * 0.37, factor * item.depth, light));
    const handle = new T.Mesh(new T.TorusGeometry(item.width * 0.12, Math.max(4, item.width * 0.015), 10, 28, Math.PI), body);
    handle.position.set(0, h * 0.76, 0);
    handle.userData.itemId = item.id;
    group.add(handle);
  } else if (item.scenarioKind === "staff-bag") {
    addLocalBox(group, item.width, h * 0.76, item.depth, 0, h * 0.38, 0, body);
    const handle = new T.Mesh(new T.TorusGeometry(item.width * 0.21, Math.max(7, item.width * 0.025), 12, 28, Math.PI), dark);
    handle.position.set(0, h * 0.68, 0);
    handle.userData.itemId = item.id;
    group.add(handle);
  }
  scene.add(group);
}

function addThreeScenarioPlaceholder(scene, item) {
  const T = window.THREE;
  const group = createFacingGroup(item);
  const height = item.height || defaultItemHeight(item);
  const material = new T.MeshStandardMaterial({
    color: item.dimensionsConfirmed ? 0x9a6b37 : 0xd5963a,
    roughness: 0.82,
    metalness: 0,
    transparent: true,
    opacity: item.dimensionsConfirmed ? 0.78 : 0.46
  });
  addLocalBox(group, item.width, height, item.depth, 0, height / 2, 0, material);
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
  const electrical = getElectricalAudit();
  const electricalProblems = electrical.crossingRoutes.length + electrical.circuitOverloads.length + electrical.stripOverloads.length;
  const warning = $("preview3dWarning");
  warning.classList.toggle("hidden", overlaps === 0 && electricalProblems === 0);
  warning.textContent = [overlaps ? `配置重なり${overlaps}件` : "", electricalProblems ? `配線・容量問題${electricalProblems}件` : ""].filter(Boolean).join(" / ");
}

function addThreeFoldingTable(scene, item) {
  if (String(item.material || "").includes("黒布") || String(item.label || "").includes("黒布巻き")) return addThreeClothedTable(scene, item);
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

function addThreeClothedTable(scene, item) {
  const height = item.height || 700;
  const group = createFacingGroup(item);
  const cloth = threeStandardMaterial(0x202120, { roughness: 0.96, metalness: 0 });
  const top = threeStandardMaterial(0x181918, { roughness: 0.9, metalness: 0 });
  addLocalBox(group, item.width, Math.max(1, height - 30), item.depth, 0, (height - 30) / 2, 0, cloth);
  addLocalBox(group, item.width, 30, item.depth, 0, height - 15, 0, top);
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

function addLocalHorizontalCylinder(group, radius, length, x, y, z, material, radialSegments = 18) {
  const mesh = addLocalCylinder(group, radius, length, x, y, z, material, radialSegments);
  mesh.rotation.z = Math.PI / 2;
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
    const lowerH = h * (650 / 800);
    const boardThickness = h * (25 / 800);
    const cubbyH = h * (100 / 800);
    const sideBoard = item.width * (25 / 900);
    const centerBoard = item.width * (25 / 900);
    addLocalBox(group, item.width, lowerH, item.depth, 0, lowerH / 2, 0, board);
    addLocalBox(group, item.width, boardThickness, item.depth, 0, lowerH + boardThickness / 2, 0, top);
    addLocalBox(group, sideBoard, cubbyH, item.depth, -item.width / 2 + sideBoard / 2, lowerH + boardThickness + cubbyH / 2, 0, board);
    addLocalBox(group, sideBoard, cubbyH, item.depth, item.width / 2 - sideBoard / 2, lowerH + boardThickness + cubbyH / 2, 0, board);
    addLocalBox(group, centerBoard, cubbyH, item.depth, 0, lowerH + boardThickness + cubbyH / 2, 0, board);
    addLocalBox(group, item.width, boardThickness, item.depth, 0, h - boardThickness / 2, 0, top);
    addThreeImagePlane(group, item.frontTexture, item.width, lowerH, item.depth / 2 + 1, lowerH / 2);
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
  const signHeight = item.height || 300;
  const thickness = Math.max(1, item.depth || 20);
  const group = createWallMountedGroup(item, side, mount.center);
  group.position.set(
    horizontal ? center : side === "left" ? -state.booth.width / 2 + thickness / 2 : state.booth.width / 2 - thickness / 2,
    mount.center,
    horizontal ? (side === "top" ? -state.booth.depth / 2 + thickness / 2 : state.booth.depth / 2 - thickness / 2) : center
  );
  addLocalBox(group, length, signHeight, thickness, 0, 0, 0, threeStandardMaterial(0xf6f6f2, { roughness: 0.58 }));
  if (item.frontTexture) {
    addThreeImagePlane(group, item.frontTexture, length, signHeight, thickness / 2 + 1, 0);
  } else {
    const plane = createThreeTextPlane(state.companyName || item.label, length * 0.88, signHeight * 0.72, "#ffffff", "#172225", 48);
    plane.userData.itemId = item.id;
    plane.position.set(0, 0, thickness / 2 + 1);
    group.add(plane);
  }
  scene.add(group);
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
    if (item.z > 0) return { bottom: item.z, top: item.z + h, center: item.z + h / 2 };
    const top = Math.max(h + 150, effectiveShellHeight() - 260);
    return { bottom: Math.max(120, top - h), top, center: Math.max(120, top - h) + h / 2 };
  }
  if (item.type === "spotlight") {
    const center = item.z > 0 ? item.z : Math.max(700, effectiveShellHeight() - 210);
    return { bottom: center - h / 2, top: center + h / 2, center };
  }
  if (item.type === "power") {
    const center = item.z > 0 ? item.z : 250;
    return { bottom: center - 90, top: center + 90, center };
  }
  const bottom = item.z || 0;
  return { bottom, top: bottom + h, center: bottom + h / 2 };
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
  const viewport = preview3dCanvas.getBoundingClientRect();
  if (viewport.width && viewport.height) threePreview.camera.aspect = viewport.width / viewport.height;
  if (reset) {
    threePreview.yaw = 0;
    threePreview.pitch = 0;
    threePreview.zoom = 1;
    threePreview.lateral = 0.34;
    threePreview.cameraMode = "orbit";
  }
  const w = state.booth.width;
  const d = state.booth.depth;
  const h = effectiveShellHeight();
  const maxSize = Math.max(w, d);
  const side = state.booth.aisleSide;
  const outward = {
    bottom: new T.Vector3(0, 0, 1),
    top: new T.Vector3(0, 0, -1),
    left: new T.Vector3(-1, 0, 0),
    right: new T.Vector3(1, 0, 0)
  }[side] || new T.Vector3(0, 0, 1);
  const tangent = new T.Vector3(outward.z, 0, -outward.x);
  if (threePreview.cameraMode === "visitor") {
    const eyeHeight = Math.max(1000, Math.min(2200, state.viewerEyeHeight || 1600));
    const inwardDepth = side === "top" || side === "bottom" ? d : w;
    const frontage = side === "top" || side === "bottom" ? w : d;
    const horizontalTan = Math.tan(55 * Math.PI / 360) * threePreview.camera.aspect;
    const cameraDistance = inwardDepth / 2 + Math.max(800, frontage / (2 * horizontalTan) * 1.08) * threePreview.zoom;
    const targetDistance = Math.min(inwardDepth * 0.3, 1400);
    const position = outward.clone().multiplyScalar(cameraDistance);
    position.y = eyeHeight;
    const target = outward.clone().multiplyScalar(-targetDistance);
    target.y = Math.max(800, eyeHeight - 600);
    threePreview.camera.fov = 55;
    threePreview.camera.updateProjectionMatrix();
    threePreview.target.copy(target);
    threePreview.camera.position.copy(position);
    threePreview.camera.lookAt(target);
    return;
  }
  threePreview.camera.fov = 34;
  threePreview.camera.updateProjectionMatrix();
  const target = new T.Vector3(0, Math.min(h * 0.38, 900), 0);
  const distance = (maxSize * 1.16 + Math.min(w, d) * 0.48) * threePreview.zoom * Math.max(1, 1.58 / threePreview.camera.aspect);
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
  const rect = preview3dCanvas.getBoundingClientRect();
  const cssWidth = Math.max(1, Math.round(rect.width));
  const cssHeight = Math.max(1, Math.round(rect.height));
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
    threePreview.cameraMode = "orbit";
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
    default: { yaw: 0, pitch: 0, zoom: 1, lateral: 0.34, cameraMode: "orbit" },
    front: { yaw: 0, pitch: -0.08, zoom: 0.96, lateral: 0, cameraMode: "orbit" },
    left: { yaw: 0, pitch: 0, zoom: 1, lateral: -0.38, cameraMode: "orbit" },
    right: { yaw: 0, pitch: 0, zoom: 1, lateral: 0.38, cameraMode: "orbit" },
    top: { yaw: 0, pitch: 0.5, zoom: 1.08, lateral: 0, cameraMode: "orbit" },
    visitor: { yaw: 0, pitch: 0, zoom: 1, lateral: 0, cameraMode: "visitor" }
  }[preset] || { yaw: 0, pitch: 0, zoom: 1, lateral: 0.34, cameraMode: "orbit" };
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
  prepareThreePickTargets(threePreview.scene, threePreview.camera, rect.height, event.pointerType);
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

function prepareThreePickTargets(scene, camera, viewportHeight, pointerType) {
  scene.updateMatrixWorld(true);
  camera.updateMatrixWorld(true);
  const T = window.THREE;
  scene.traverse((node) => {
    const dimensions = node.userData?.pickDimensions;
    if (!dimensions) return;
    const center = node.getWorldPosition(new T.Vector3()).applyMatrix4(camera.matrixWorldInverse);
    const minimum = 2 * Math.max(1, -center.z) * Math.tan(camera.fov * Math.PI / 360) /
      Math.max(1, viewportHeight) * (pointerType === "touch" ? 44 : 28);
    node.scale.set(...["width", "height", "depth"].map((axis) => dimensions[axis] < 24
      ? Math.max(1, minimum / Math.max(1, dimensions[axis])) : 1));
  });
  scene.updateMatrixWorld(true);
}

function syncThreeSelectionUi() {
  const item = selectedItem();
  const text = $("preview3dSelectionText");
  if (text) {
    const operational = item?.type === "person"
      ? ` / ${personRoleLabel(item.personRole)} / ${activationModeLabel(item.activationMode)}`
      : item?.type === "scenario"
        ? ` / ${operationalCategoryLabel(item.operationalCategory)} / ${activationModeLabel(item.activationMode)} / ${item.dimensionsConfirmed ? "実測済み" : "仮寸法"}`
        : item?.type === "zone"
          ? ` / ${spaceCategoryLabel(item.spaceCategory)} / 必要${item.requiredAreaMm2 > 0 ? `${formatSquareMetres(item.requiredAreaMm2)}㎡` : "未登録"}${item.spaceCategory === "inventory" ? ` / 在庫${inventoryAudit?.entries.find((entry) => entry.item.id === item.id)?.capacity.complete ? `${inventoryAudit.entries.find((entry) => entry.item.id === item.id).capacity.capacityCartons}箱容量` : "容量未判定"}` : ""} / ${activationModeLabel(item.activationMode)}`
          : item && item.visibilityRole !== "none" ? ` / ${visibilityRoleLabel(item.visibilityRole)} Z${item.targetViewHeightMm || "未登録"}` : "";
    text.textContent = item
      ? `選択中: ${item.label} / ${itemSizeLabel(item)} / X${Math.round(item.x)} Y${Math.round(item.y)} Z${Math.round(item.z || 0)} / ${Domain.normalizeRotationDegrees(item.rotationDeg)}°${operational}${isItemActive(item) ? "" : " / 現在モードでは非表示"}`
      : "3D内の什器をクリックすると選択できます";
    if (!advancedMode) text.textContent = item ? `${compactLabel(item.label)}・${itemSizeLabel(item)}` : "ものを選んで配置図で編集できます";
  }
  ["editSelected3dBtn", "rotateSelected3dBtn", "deleteSelected3dBtn"].forEach((id) => {
    if ($(id)) $(id).disabled = !item;
  });
}

function createIsoProjector(cw, ch) {
  const isoX = 0.75;
  const isoY = 0.34;
  const zScale = 0.42;
  const wallH = effectiveShellHeight();
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
  if (state.booth.spaceOnly) {
    if (!hasPlannedBackPanel()) return;
    const planned = boothWallSegment(state.booth.wallSide, state.booth.plannedBackPanelWidthMm, 0);
    drawWallSegment3d(ctx3, iso, planned[0], planned[1], state.booth.plannedBackPanelHeightMm, true, "#f4f4f1", "#8092ae");
    return;
  }
  const sides = {
    top: [[0, 0], [state.booth.width, 0]],
    bottom: [[0, state.booth.depth], [state.booth.width, state.booth.depth]],
    left: [[0, 0], [0, state.booth.depth]],
    right: [[state.booth.width, 0], [state.booth.width, state.booth.depth]]
  };
  Object.entries(sides).forEach(([side, points]) => {
    if (side === state.booth.aisleSide) return;
    const isMainWall = side === state.booth.wallSide;
    let segment = points;
    if (!isMainWall && state.booth.sideReturnDepthMm) {
      const options = sideReturnWallOptions(side);
      const horizontal = side === "top" || side === "bottom";
      const fullSpan = horizontal ? state.booth.width : state.booth.depth;
      segment = boothWallSegment(side, options.span || fullSpan, options.alongCenter || 0);
    }
    drawWallSegment3d(ctx3, iso, segment[0], segment[1], isMainWall ? state.booth.wallHeight : Math.min(state.booth.sideWallHeightMm || 1200, state.booth.wallHeight), isMainWall, state.booth.wallColorHex, state.booth.wallFrameColorHex);
  });
}

function boothWallSegment(side, span, alongCenter = 0) {
  if (side === "top") return [[state.booth.width / 2 + alongCenter - span / 2, 0], [state.booth.width / 2 + alongCenter + span / 2, 0]];
  if (side === "bottom") return [[state.booth.width / 2 + alongCenter - span / 2, state.booth.depth], [state.booth.width / 2 + alongCenter + span / 2, state.booth.depth]];
  if (side === "left") return [[0, state.booth.depth / 2 + alongCenter - span / 2], [0, state.booth.depth / 2 + alongCenter + span / 2]];
  return [[state.booth.width, state.booth.depth / 2 + alongCenter - span / 2], [state.booth.width, state.booth.depth / 2 + alongCenter + span / 2]];
}

function drawWallSegment3d(ctx3, iso, a, b, height, isMainWall, wallColor = "#f8fbfa", frameColor = "#73a990") {
  const p1 = iso.project(a[0], a[1], 0);
  const p2 = iso.project(b[0], b[1], 0);
  const p3 = iso.project(b[0], b[1], height);
  const p4 = iso.project(a[0], a[1], height);
  ctx3.fillStyle = wallColor || (isMainWall ? "#f8fbfa" : "#f2f4f3");
  polygon(ctx3, [p1, p2, p3, p4]);
  ctx3.strokeStyle = frameColor || (isMainWall ? "#73a990" : "#c9d0cf");
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
  if (item.type === "table" && (String(item.material || "").includes("黒布") || String(item.label || "").includes("黒布巻き"))) {
    drawBlackClothedTable3d(ctx3, iso, item);
    return;
  }
  if (code === "TB13") {
    drawTb13Item3d(ctx3, iso, item);
    return;
  }
  drawSoftFootprintShadow(ctx3, iso, item, 0.18);
  drawBox3d(ctx3, iso, item.x, item.y, item.width, item.depth, item.height || 800, boldaBoxColors());
  if (code === "ED04") drawSteppedDisplay3d(ctx3, iso, item);
}

function drawBlackClothedTable3d(ctx3, iso, item) {
  const height = item.height || 700;
  drawSoftFootprintShadow(ctx3, iso, item, 0.18);
  drawBox3d(ctx3, iso, item.x, item.y, item.width, item.depth, height, {
    left: "#171817",
    right: "#242524",
    top: "#303130",
    stroke: "rgba(0,0,0,0.55)"
  });
}

function drawTb13Item3d(ctx3, iso, item) {
  const h = item.height || 800;
  const lowerH = h * (650 / 800);
  const board = h * (25 / 800);
  const openingH = h * (100 / 800);
  const sideW = item.width * (25 / 900);
  drawSoftFootprintShadow(ctx3, iso, item, 0.18);
  drawBox3d(ctx3, iso, item.x, item.y, item.width, item.depth, lowerH, boldaBoxColors());
  drawCubbyFace3d(ctx3, iso, item);
  drawBox3d(ctx3, iso, item.x, item.y, item.width, item.depth, board, boldaBoxColors(), lowerH);
  drawBox3d(ctx3, iso, item.x, item.y, sideW, item.depth, openingH, boldaBoxColors(), lowerH + board);
  drawBox3d(ctx3, iso, item.x + item.width - sideW, item.y, sideW, item.depth, openingH, boldaBoxColors(), lowerH + board);
  drawBox3d(ctx3, iso, item.x + item.width / 2 - sideW / 2, item.y, sideW, item.depth, openingH, boldaBoxColors(), lowerH + board);
  drawBox3d(ctx3, iso, item.x, item.y, item.width, item.depth, board, boldaBoxColors(), h - board);
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
  const h = item.height || 800;
  const z = h * (675 / 800);
  const openingH = h * (100 / 800);
  const y = item.y + item.depth;
  const left = item.x + item.width * (25 / 900);
  const openingW = item.width * (412.5 / 900);
  ctx3.save();
  ctx3.fillStyle = "rgba(94, 99, 98, 0.42)";
  ctx3.strokeStyle = "rgba(54, 62, 62, 0.32)";
  [left, left + openingW + item.width * (25 / 900)].forEach((x) => {
    const opening = [iso.project(x, y, z), iso.project(x + openingW, y, z), iso.project(x + openingW, y, z + openingH), iso.project(x, y, z + openingH)];
    polygon(ctx3, opening);
    strokePolygon(ctx3, opening);
  });
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
  if (item.type === "product" && item.image) return item.image;
  if (item.type === "bolda") {
    const code = getBoldaCode(item);
    if (code) return `assets/bolda/preview-assets/${code}.png`;
  }
  if (item.type === "power") return "";
  if (item.type === "spotlight") return base + "spotlight-100w.png";
  if (item.type === "wall") return item.frontTexture || base + "sign-panel.png";
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
  const vertical = getItemVerticalRange(item);
  const zTop = vertical.top;
  const zBottom = vertical.bottom;
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
  if (item.type === "powerstrip") return 50;
  if (item.type === "device") return 100;
  if (item.type === "scenario") return 300;
  if (item.type === "zone") return 8;
  return 800;
}

function buildImagePrompt() {
  const boldaRefs = getUsedBoldaReferences();
  const personRefs = getUsedPersonReferences();
  const boothPhotoReferences = realBoothReferenceImages.map((ref) => `${ref.label}: ${ref.path}`).join("; ");
  const items = activeItems().filter((item) => item.type !== "zone").map(buildPromptItemBlock).join("\n\n");
  const contacts = buildContactInstructions();
  const alignment = buildAlignmentInstructions();
  const camera = buildPromptCameraInstruction();
  const counts = buildPromptCountSummary();
  const references = boldaRefs.length
    ? `Attach and use these fixture shape, exact print-face and monitor screen images for the matching items:\n${boldaRefs.map((ref) => `- ${ref.name}: ${ref.path}; role: ${ref.role}${ref.printData ? `; source folder: ${ref.printData}` : ""}`).join("\n")}`
    : "No fixture print or monitor screen reference images are used in this layout.";
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
    `Operational state: ${operationModeLabel(state.operationMode)}. Include only objects active in this state; never add hidden-state objects.`,
    "",
    "GEOMETRY PRIORITY",
    "Treat the attached 2D plan and every coordinate below as construction constraints, not inspiration. Establish the booth shell and all object volumes first, then add materials, graphics and products. Never improve the composition by moving, rotating, spreading, duplicating or resizing an object.",
    "All dimensions and coordinates below are millimetres.",
    state.booth.spaceOnly
      ? `Booth shell: exact floor allocation W${state.booth.width} x D${state.booth.depth}; official space-only handover. No wall or panel is supplied by the organizer. Maximum decoration height is H${state.booth.heightLimitMm || "unregistered"}.${hasPlannedBackPanel() ? ` Separately render the user-planned self-decoration back panel W${state.booth.plannedBackPanelWidthMm} x H${state.booth.plannedBackPanelHeightMm} x D${state.booth.plannedBackPanelThicknessMm} on the ${sideEnglish(state.booth.wallSide)} side; its construction method and thickness remain provisional.` : ""}`
      : `Booth shell: interior W${state.booth.width} x D${state.booth.depth}; main wall height H${state.booth.wallHeight}.`,
    `Plan coordinate system: origin X0 Y0 is the upper-left/back-left corner. X increases left-to-right. Y increases from the back edge toward the front/depth edge. Vertical height is Z, with floor Z0.`,
    state.booth.spaceOnly
      ? `Do not infer organizer-supplied walls, side panels, fascia, light, power outlet or fixtures.${hasPlannedBackPanel() ? " Render only the separately specified user-planned back panel and placed wall signs." : ""} Aisle reference side: ${sideLabel(state.booth.aisleSide)} (${sideEnglish(state.booth.aisleSide)}).`
      : `Main wall side: ${sideLabel(state.booth.wallSide)} (${sideEnglish(state.booth.wallSide)}). Fully open aisle side: ${sideLabel(state.booth.aisleSide)} (${sideEnglish(state.booth.aisleSide)}). Other side returns are H${Math.min(state.booth.sideWallHeightMm || 1200, state.booth.wallHeight)} and extend only D${state.booth.sideReturnDepthMm || state.booth.depth} from the main wall.`,
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
    "- Use the registered booth wall colors and panel dimensions; use grey commercial carpet, clean overhead hall lighting, and soft contact shadows. Do not turn a registered black wall shell into white panels.",
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
    "- Match ED04 as a W900 x D600 x H1100 three-level stepped display with exactly three usable horizontal display levels. Match TB13 exactly as W900 x D500 x H800: lower printed body H650, 25mm lower shelf board, exactly two openings each approximately W413 x H100 with 25mm side/center boards, and 25mm top board. Never enlarge the openings. Match TB05 as W900 x D600 x H800.",
    "- TB13 front artwork must fill the full W900 x H650 lower face. Use the corrected supplied-PSD-derived texture as-is: keep the exact heater photograph fully visible through its lower feet, with no cropping, stretching, invented extension, or orange/brown strip below it.",
    "- ED04 has three separate print themes. Keep Custom Fit, Screw Extraction & Hand Polishing, and Trial Frames & Measurement on their matching fixtures; never exchange or merge their panels.",
    "- A TB05 + AS01 composite is two real parts: one W900 x D600 x H800 TB05 base on floor Z0 and one W900 x D250 x H300 AS01 yokan-bar riser resting directly on the rear of its top at Z800. No air gap, no separate floor placement, total height H1100.",
    "- Preserve real width/depth/height proportions. W1500xD900 must visibly be 50% deeper than W1500xD600; W1800 must visibly be 20% wider than W1500 at the same camera depth.",
    "- Folding tables must have a full tabletop and four visible/supporting metal legs. Do not turn them into solid counters.",
    "- If matching print/artwork is supplied, wrap it only onto the correct visible front/side faces without changing the furniture geometry.",
    "",
    "FINAL VALIDATION BEFORE RENDERING",
    "- Confirm that every visible movable object appears in the placed-object specification. Delete any inferred merchandise, eyewear, tools, trays, bottles, people or decorative props.",
    "- Compare every footprint edge to the 2D plan and preserve touching/near-touching edges without artificial gaps.",
    "- Keep equal X or Y edges in straight rows. Keep floor-standing roots level on Z0. Keep every supported tabletop object at its specified support Z and never drop it to the floor or float it above the surface. Keep all wall equipment attached to its specified wall and Z range.",
    "- A plan marker for an outlet or spotlight is an annotation zone, not the physical size of the device. Never create a 300mm outlet box or a 350mm furniture block for a spotlight.",
    "- Signboards use each item's registered W/D/H and exact front artwork at the stated Z elevation; they are shallow wall-mounted panels, not floor-to-ceiling walls.",
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
  const heightKnown = item.height > 0;
  const vertical = getItemVerticalRange(item);
  const side = nearestBoothSide(item);
  const bolda = getBoldaDetail(item);
  const lines = [`${index + 1}. ${item.label} [${item.type}]`];

  if (["wall", "spotlight", "power"].includes(item.type)) {
    lines.push(`   - Plan annotation rectangle: X${x1}..${x2}, Y${y1}..${y2}. This rectangle locates the device; it is not the physical box size.`);
  } else {
    lines.push(`   - Exact floor footprint: X${x1}..${x2}, Y${y1}..${y2}; W${Math.round(item.width)} x D${Math.round(item.depth)}.`);
    lines.push(heightKnown
      ? `   - Vertical extent: Z${Math.round(item.z || 0)}..Z${Math.round((item.z || 0) + h)}; registered physical size W${Math.round(item.width)} x D${Math.round(item.depth)} x H${h}.`
      : `   - Height is not registered. The local 3D preview uses provisional H${h} only; confirm the actual height before build or image generation.`);
    lines.push(`   - Orientation: plan W is parallel to X and plan D to Y after ${Domain.normalizeRotationDegrees(item.rotationDeg)}° rotation; front/customer face points ${sideEnglish(state.booth.aisleSide)} toward the aisle.`);
    const support = state.items.find((candidate) => candidate.id === item.supportItemId);
    if (support) {
      const definition = getSupportPlacementDefinition(item, support);
      lines.push(`   - Supported placement: rests on ${support.label}; support relationship ${definition?.kind === "official-fixed" ? "manufacturer-specified fixed combination" : "contained within the registered tabletop"}; item bottom is exact Z${Math.round(item.z || 0)}. Do not place this object on the floor.`);
    }
  }

  if (item.type === "wall") {
    lines.push(`   - Physical signboard: W${Math.round(item.width)} x D${item.depth} x H${h}; mount flat on the ${sideEnglish(side)} wall, vertical range Z${Math.round(vertical.bottom)}..Z${Math.round(vertical.top)}. It must remain a shallow panel and must not extend to the floor.`);
    if (item.frontTexture) lines.push(`   - Exact sign front artwork: ${item.frontTexture}. Apply it unaltered across the complete W${Math.round(item.width)} x H${h} front face.`);
  } else if (item.type === "spotlight") {
    lines.push(`   - Physical fixture: compact wall-mounted arm spotlight, approximately W180 x arm projection D450 x head H180; mount on the ${sideEnglish(side)} wall with centre Z${Math.round(vertical.center)}; aim downward and inward toward the plan marker centre X${Math.round(item.x + item.width / 2)} Y${Math.round(item.y + item.depth / 2)}.`);
    lines.push(`   - Electrical cue: ${item.watt || 0}W must be visible; do not render a floor-standing object or tall column.`);
  } else if (item.type === "power") {
    lines.push(`   - Physical fixture: two-socket outlet plate approximately W150 x D35 x H180, mounted on the ${sideEnglish(side)} wall at Z${Math.round(vertical.bottom)}..Z${Math.round(vertical.top)} near plan marker centre X${Math.round(item.x + item.width / 2)} Y${Math.round(item.y + item.depth / 2)}.`);
    lines.push("   - Show the outlet plate only. Do not render wattage text, a wattage badge, or scale the outlet to the annotation rectangle.");
  } else if (item.type === "powerstrip") {
    const source = getPowerSource(item);
    const route = getCableRouteData(item);
    lines.push(`   - Electrical power strip: rated capacity ${item.ratedCapacityW ? `${item.ratedCapacityW}W` : "not registered"}; source ${source ? source.label : "not connected"}; planned cable length ${route ? `${Math.round(route.totalLengthMm)}mm` : "not registered"}.`);
    lines.push("   - The local model is generic. Do not infer socket count, plug shape or manufacturer model; replace it with the confirmed product specification before build.");
  } else if (item.type === "device") {
    const source = getPowerSource(item);
    const route = getCableRouteData(item);
    lines.push(`   - Electrical load: ${item.watt ? `${item.watt}W` : "wattage not registered"}; source ${source ? source.label : "not connected"}; planned cable length ${route ? `${Math.round(route.totalLengthMm)}mm` : "not registered"}.`);
    lines.push("   - The local model is a generic placeholder. Do not infer product geometry; use the registered dimensions and replace it with a confirmed model when available.");
  } else if (item.type === "person") {
    const chair = getChairForPerson(item);
    if (chair) {
      lines.push(`   - Pose: seated naturally on ${chair.label} centred at X${Math.round(chair.x + chair.width / 2)} Y${Math.round(chair.y + chair.depth / 2)}; chair seat height about Z430; hips and knees bent near 90 degrees; both feet on floor; do not show the person standing or floating.`);
      lines.push(`   - Exact character reference: ${item.seatedImage}. Preserve the same face, glasses/helmet, clothing/costume and body appearance.`);
    } else {
      lines.push(`   - Pose: standing upright on floor Z0, real human height H1790mm. The W600 x D600 plan footprint is the occupied standing/turning zone, not a solid pedestal.`);
      lines.push(`   - Exact character reference: ${item.standingImage}. Preserve the same face, glasses/helmet, clothing/costume and body appearance.`);
    }
    lines.push(`   - Operational role: ${personRoleLabel(item.personRole)}; active ${activationModeLabel(item.activationMode)}. Use this person as ${item.personRole === "visitor" ? "a visitor viewpoint" : item.personRole === "staff" ? "a staff movement origin" : item.personRole === "crowd" ? "a crowd obstruction for visibility and movement" : "scale reference only"}.`);
  } else if (item.type === "scenario") {
    lines.push(`   - Operational occupied zone: ${operationalCategoryLabel(item.operationalCategory)}; active ${activationModeLabel(item.activationMode)}; dimensions ${item.dimensionsConfirmed ? "measured and confirmed" : "PROVISIONAL and not confirmed"}.`);
    lines.push(item.scenarioKind
      ? `   - Recognizable generic form: ${scenarioKindLabel(item.scenarioKind)}, constrained to the registered W/D/H. This is not a manufacturer-specific model; do not add branding or alter the envelope.`
      : "   - Do not infer a manufacturer, exact product shape, quantity or contents. Use only this registered occupied volume until reference data is supplied.");
  } else {
    lines.push(`   - Appearance: ${buildItemVisualInstruction(item, bolda).replace(/^,\s*/, "") || "real exhibition furniture matching the stated dimensions"}.`);
  }
  if (canBeVisibilityTarget(item) && item.visibilityRole !== "none") {
    lines.push(`   - Visibility target: ${visibilityRoleLabel(item.visibilityRole)}; exact target height Z${item.targetViewHeightMm || "NOT-REGISTERED"}mm; display front side ${item.targetFrontSide ? sideEnglish(item.targetFrontSide) : "NOT-REGISTERED"}. Do not infer missing target settings.`);
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
  const shellHeight = effectiveShellHeight();
  const z = Math.round(Math.max(shellHeight * 1.08, maxSize * 0.46));
  const cameras = {
    bottom: { x: Math.round(w * 0.78), y: Math.round(d + maxSize * 1.15) },
    top: { x: Math.round(w * 0.22), y: Math.round(-maxSize * 1.15) },
    left: { x: Math.round(-maxSize * 1.15), y: Math.round(d * 0.78) },
    right: { x: Math.round(w + maxSize * 1.15), y: Math.round(d * 0.22) }
  };
  const camera = cameras[state.booth.aisleSide] || cameras.bottom;
  return `Camera is outside the ${sideEnglish(state.booth.aisleSide)} aisle, approximately plan X${camera.x} Y${camera.y} at Z${z}, looking toward target X${Math.round(w / 2)} Y${Math.round(d / 2)} Z${Math.round(Math.min(shellHeight * 0.38, 900))}. Use an elevated front three-quarter viewpoint that clearly shows the floor plan${state.booth.spaceOnly ? (hasPlannedBackPanel() ? " and the separately specified planned back panel without inventing other walls" : " without inventing walls") : " and the main wall"}.`;
}

function buildPromptCountSummary() {
  const labels = { table: "tables/counters", fixture: "fixtures", product: "registered real products", bolda: "bolda fixtures", wall: "signboards", power: "outlets", powerstrip: "power strips", device: "electrical devices", spotlight: "spotlights", chair: "chairs", person: "people", scenario: "operational occupied zones" };
  const currentItems = activeItems().filter((item) => item.type !== "zone");
  const counts = currentItems.reduce((map, item) => {
    map[item.type] = (map[item.type] || 0) + 1;
    return map;
  }, {});
  return [`total ${currentItems.length}`, ...Object.entries(counts).map(([type, count]) => `${labels[type] || type} ${count}`)].join(", ");
}

function sideEnglish(side) {
  return ({ top: "back/top (-Y)", bottom: "front/bottom (+Y)", left: "left (-X)", right: "right (+X)" })[side] || side;
}

function buildBoothSpecification() {
  const currentSpaceAudit = spaceAudit || getSpaceAudit();
  const currentInventoryAudit = inventoryAudit || getInventoryAudit();
  return {
    schema: "booth-render-spec-v8",
    units: "mm",
    event: state.eventName,
    operationMode: state.operationMode,
    booth: {
      width: state.booth.width,
      depth: state.booth.depth,
      wallHeight: state.booth.wallHeight,
      heightLimitMm: state.booth.heightLimitMm || null,
      floorLoadKgPerM2: state.booth.floorLoadKgPerM2 || null,
      wallSide: state.booth.wallSide,
      aisleSide: state.booth.aisleSide,
      handover: state.booth.spaceOnly ? "space-only" : "wall-shell",
      spaceOnly: state.booth.spaceOnly === true
    },
    coordinateSystem: { origin: "upper-left/back-left", x: "left-to-right", y: "back-to-aisle", z: "floor-up" },
    cameraInstruction: buildPromptCameraInstruction(),
    electrical: {
      circuits: state.powerCircuits.map((circuit) => ({ ...circuit, capacityW: circuit.capacityW || null })),
      routes: state.items.filter(isPoweredLoad).map((item) => {
        const route = getCableRouteData(item);
        return {
          loadId: item.id,
          sourceId: item.powerSourceId || null,
          mode: item.cableRouteMode,
          slackMm: item.cableSlackMm || 0,
          points: route ? route.points.map((point) => ({ x: Math.round(point.x), y: Math.round(point.y) })) : [],
          planLengthMm: route ? Math.round(route.planLengthMm) : null,
          verticalLengthMm: route ? Math.round(route.verticalLengthMm) : null,
          totalLengthMm: route ? Math.round(route.totalLengthMm) : null,
          crossingObjectIds: route ? route.crossings.map((entry) => entry.id) : []
        };
      })
    },
    operationalAnalysis: {
      operationMode: state.operationMode,
      viewerEyeHeightMm: state.viewerEyeHeight,
      requiredRouteWidthMm: state.routeClearanceMm,
      routeGridMm: state.routeGridMm,
      viewpoints: (operationalAudit?.viewpoints || []).map((point) => ({ id: point.id, label: point.label, x: Math.round(point.x), y: Math.round(point.y), z: Math.round(point.z), synthetic: point.synthetic })),
      targets: (operationalAudit?.targets || []).map((entry) => ({
        objectId: entry.item.id,
        role: entry.item.visibilityRole,
        viewHeightMm: entry.item.targetViewHeightMm || null,
        frontSide: entry.item.targetFrontSide || null,
        visibleViewCount: entry.visibleViews,
        totalViewCount: entry.viewpoints.length,
        blockerObjectIds: entry.blockers.map((item) => item.id),
        visitorPathLengthMm: entry.visitorPath?.found ? Math.round(entry.visitorPath.lengthMm) : null,
        staffPathLengthMm: entry.staffPath?.found ? Math.round(entry.staffPath.lengthMm) : null
      }))
    },
    scenarioAnalysis: {
      activeObjectIds: activeItems().map((item) => item.id),
      scenarioObjectIds: getScenarioAudit().all.map((item) => item.id),
      activeScenarioObjectIds: getScenarioAudit().active.map((item) => item.id),
      unconfirmedDimensionObjectIds: getScenarioAudit().unconfirmed.map((item) => item.id),
      stockObjectIds: getScenarioAudit().stock.map((item) => item.id),
      activeCrowdPersonIds: getScenarioAudit().crowd.map((item) => item.id)
    },
    spaceAnalysis: {
      method: "exact-orthogonal-boundary-partition-mm2",
      boothAreaMm2: currentSpaceAudit.operationalAnalysis.boothAreaMm2,
      occupiedAreaMm2: currentSpaceAudit.operationalAnalysis.occupiedAreaMm2,
      reachableAreaMm2: currentSpaceAudit.operationalAnalysis.reachableAreaMm2,
      deadSpaceCandidateAreaMm2: currentSpaceAudit.operationalAnalysis.deadAreaMm2,
      zones: currentSpaceAudit.zones.map((entry) => ({
        objectId: entry.item.id,
        category: entry.item.spaceCategory,
        plannedAreaMm2: entry.areaMm2,
        occupiedAreaMm2: entry.occupiedMm2,
        publicReachableAreaMm2: entry.publicReachableMm2,
        staffReachableAreaMm2: entry.staffReachableMm2,
        operationalReachableAreaMm2: entry.operationalReachableMm2,
        requiredAreaMm2: entry.item.requiredAreaMm2 || null
      }))
    },
    inventoryAnalysis: {
      method: "axis-aligned-carton-packing-two-plan-orientations-integer-stack-layers",
      replenishmentAssumption: "total cartons divided evenly across initial stock plus replenishment count",
      zones: currentInventoryAudit.entries.map((entry) => ({
        objectId: entry.item.id,
        dimensionsConfirmed: entry.item.inventoryDimensionsConfirmed === true,
        complete: entry.capacity.complete,
        missingFields: entry.capacity.missingFields,
        totalUnits: entry.capacity.totalUnits,
        unitsPerCarton: entry.capacity.unitsPerCarton,
        replenishmentCount: entry.capacity.replenishmentCount,
        cartonDimensionsMm: {
          width: entry.capacity.cartonWidthMm,
          depth: entry.capacity.cartonDepthMm,
          height: entry.capacity.cartonHeightMm
        },
        maxStackHeightMm: entry.capacity.maxStackHeightMm,
        totalCartons: entry.capacity.totalCartons,
        peakCartons: entry.capacity.peakCartons,
        cartonsPerLayer: entry.capacity.cartonsPerLayer,
        layers: entry.capacity.layers,
        capacityCartons: entry.capacity.capacityCartons,
        shortageCartons: entry.capacity.shortageCartons,
        orientation: entry.capacity.orientation?.name || null
      }))
    },
    objects: state.items.map((item, index) => {
      const vertical = getItemVerticalRange(item);
      return {
        index: index + 1,
        id: item.id,
        fixtureMasterId: item.masterId || null,
        productCode: item.productCode || null,
        sourceUrl: item.sourceUrl || null,
        catalogReference: item.catalogReference || null,
        dimensionAccuracy: item.dimensionAccuracy || null,
        scenarioKind: item.scenarioKind || null,
        weightKg: item.weightKg || null,
        label: item.label,
        type: item.type,
        planRectangle: { x1: Math.round(item.x), y1: Math.round(item.y), x2: Math.round(item.x + item.width), y2: Math.round(item.y + item.depth) },
        dimensions: { width: Math.round(item.width), depth: Math.round(item.depth), height: item.height ? Math.round(item.height) : null },
        modelHeightAssumption: item.height ? null : Math.round(defaultItemHeight(item)),
        verticalRange: { z1: Math.round(vertical.bottom), z2: Math.round(vertical.top) },
        transform: {
          x: Math.round(item.x),
          y: Math.round(item.y),
          z: Math.round(item.z || 0),
          rotationDeg: Domain.normalizeRotationDegrees(item.rotationDeg)
        },
        nearestWall: ["wall", "spotlight", "power"].includes(item.type) ? nearestBoothSide(item) : null,
        frontDirection: ["table", "fixture", "product", "bolda", "chair", "person"].includes(item.type) ? state.booth.aisleSide : null,
        supportPlacement: item.supportItemId ? {
          supportObjectId: item.supportItemId,
          offsetX: item.supportOffsetX,
          offsetY: item.supportOffsetY,
          zOffsetMm: item.supportZOffsetMm,
          relationship: getSupportPlacementDefinition(item, state.items.find((candidate) => candidate.id === item.supportItemId))?.kind || "unresolved"
        } : null,
        watt: item.watt || null,
        circuitId: item.circuitId || null,
        powerSourceId: item.powerSourceId || null,
        ratedCapacityW: item.ratedCapacityW || null,
        cableRouteMode: isPoweredLoad(item) ? item.cableRouteMode : null,
        cableSlackMm: isPoweredLoad(item) ? item.cableSlackMm || 0 : null,
        personRole: item.type === "person" ? item.personRole : null,
        activationMode: item.activationMode || "always",
        activeInCurrentMode: isItemActive(item),
        operationalCategory: item.type === "scenario" ? item.operationalCategory : null,
        dimensionsConfirmed: item.type === "scenario" ? item.dimensionsConfirmed === true : null,
        spaceCategory: item.type === "zone" ? item.spaceCategory : null,
        requiredAreaMm2: item.type === "zone" ? item.requiredAreaMm2 || null : null,
        inventoryPlan: item.type === "zone" && item.spaceCategory === "inventory" ? {
          totalUnits: item.inventoryTotalUnits || null,
          unitsPerCarton: item.inventoryUnitsPerCarton || null,
          replenishmentCount: item.inventoryReplenishmentCount || 0,
          cartonWidthMm: item.inventoryCartonWidthMm || null,
          cartonDepthMm: item.inventoryCartonDepthMm || null,
          cartonHeightMm: item.inventoryCartonHeightMm || null,
          maxStackHeightMm: item.inventoryMaxStackHeightMm || null,
          dimensionsConfirmed: item.inventoryDimensionsConfirmed === true
        } : null,
        visibilityRole: canBeVisibilityTarget(item) ? item.visibilityRole : null,
        targetViewHeightMm: canBeVisibilityTarget(item) ? item.targetViewHeightMm || null : null,
        targetFrontSide: canBeVisibilityTarget(item) ? item.targetFrontSide || null : null,
        boldaCode: getBoldaCode(item) || null,
        printTheme: item.printTheme || null,
        printFaces: [item.frontTexture, ...(item.tierTextures || []), item.riserTexture].filter(Boolean),
        monitorScreen: getMonitorScreen(item),
        personPose: item.type === "person" ? (getChairForPerson(item) ? "seated" : "standing") : null,
        standingImage: item.standingImage || null,
        seatedImage: item.seatedImage || null,
        referenceImage: item.image || null
      };
    })
  };
}

function buildItemVisualInstruction(item, bolda) {
  if (getMonitorScreen(item)) return `, visual form: monitor displaying the exact image ${getMonitorScreen(item).source}, keep image aspect ratio without cropping; letterbox if needed`;
  if (item.model3d?.kind === "printed-pop-panel") return `, visual form: vertical printed foam-board POP; white rear; original panorama ${item.frontTexture}, horizontal slice ${item.model3d.artworkSlice + 1} of ${item.model3d.artworkSlices}; board thickness provisional, mounting hardware not specified`;
  if (item.type === "person") return `, visual form: the exact referenced 1790mm-tall character, ${getChairForPerson(item) ? "naturally seated on the overlapping chair" : "standing upright on the floor"}`;
  if (bolda) return `, visual form: assembled bolda fixture, ${bolda.visual}`;
  if (item.type === "product") {
    const forms = {
      "gacha-machine": "official A0002 tabletop Gacha Cop machine inside the exact W240 x D370 x H440mm envelope; white body; do not change overall dimensions or invent a different machine model",
      "gacha-stand": "official A0007 white paper tabletop stand inside the exact W250 x D315 x H100mm envelope; depth includes the capsule receiver",
      "capsule-recovery-box": "official E1237 cardboard capsule recovery box inside the exact W275 x D275 x H460mm envelope; circular collection opening approximately 85mm",
      "mist-bottle": "No.1064 glasses mist bottle; verified bottle body diameter 54.7 x H165.2mm; trigger-included planning envelope is provisional and must not be presented as verified",
      "aluminum-pegboard": "Amazon ASIN B0897LVM4J silver aluminum pegboard standing vertically on a tabletop; exact board W450 x H450 x T1.6mm, hole pitch P25 and hole diameter 5mm; show the exact supplied product image and do not invent a stand inside the board envelope",
      "frame-heater-169": "No.169 frame heater inside the catalog-verified diameter 125 x H200mm envelope",
      "frame-heater-767": "No.767 Thermorex frame heater inside the catalog-verified W185 x D160 x H160mm envelope",
      "buff-motor-694": "No.694 Digimotor inside the catalog-verified W300 x D180 x H200mm envelope",
      "buff-motor-95": "No.95 dust-collecting buff motor inside the catalog-verified W370 x D312 x H237mm envelope",
      "buff-motor-1010": "No.1010 compact dust-collecting buff motor inside the catalog-verified W232 x D239 x H417mm envelope",
      "buff-motor-989": "No.989 eyeglass buff motor inside the catalog-verified W340 x D135 x H215mm envelope"
    };
    return `, visual form: ${forms[item.productCategory] || "registered real product using only the official dimensions"}; source ${item.sourceUrl || "not registered"}`;
  }
  if (item.type === "table" && String(item.label || "").includes("展示台")) {
    return `, visual form: display counter/plinth with the exact footprint proportions and ${item.height ? `H${Math.round(item.height)}mm` : "height not registered (confirm before build)"}; a W1500xD900 stand must look deeper than W1500xD600, and W1800 stands must look wider than W1500 stands`;
  }
  if (item.type === "table") {
    return ", visual form: real rectangular table/counter with the exact width and depth proportions, not a generic cube";
  }
  if (item.type === "fixture") {
    return ", visual form: real display fixture with the exact width, depth and height proportions, not the same generic box as other fixtures";
  }
  if (item.type === "scenario") {
    return `, visual form: ${item.scenarioKind ? `${scenarioKindLabel(item.scenarioKind)} as a recognizable generic form constrained to` : `state-specific occupied volume for ${operationalCategoryLabel(item.operationalCategory)} using only`} the registered W/D/H; ${item.dimensionsConfirmed ? "dimensions confirmed" : "dimensions provisional"}; do not invent a manufacturer-specific product`;
  }
  if (item.type === "zone") {
    return `, visual form: non-physical floor planning overlay for ${spaceCategoryLabel(item.spaceCategory)}; never render it as furniture, wall or raised structure`;
  }
  return "";
}
function getUsedBoldaReferences() {
  const refs = new Map();
  activeItems()
    .filter((item) => (item.type === "bolda" && item.image) || item.model3d?.kind === "printed-pop-panel" || getMonitorScreen(item))
    .forEach((item) => {
      const detail = getBoldaDetail(item);
      const add = (path, role) => {
        if (!path || refs.has(path)) return;
        refs.set(path, { name: path.split("/").pop(), path, label: item.label, role, visual: detail?.visual || "", printData: detail?.printData || "" });
      };
      add(item.image, `assembled blank shape for ${item.label}`);
      add(item.frontTexture, `exact printed main front face for ${item.printTheme || item.label}`);
      const screen = getMonitorScreen(item);
      if (screen) add(screen.source, `exact monitor screen artwork; preserve ${screen.width}:${screen.height} aspect ratio, no crop`);
      (item.tierTextures || []).forEach((path, index) => add(path, `exact printed ED04 ${index === 0 ? "lower" : "upper"} riser face for ${item.printTheme}`));
      add(item.riserTexture, `exact printed AS01 yokan-bar front face mounted on the TB05 base for ${item.printTheme}`);
    });
  return [...refs.values()];
}

function getUsedPersonReferences() {
  const refs = new Map();
  activeItems().filter((item) => item.type === "person").forEach((item) => {
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
    wrap.innerHTML = `<h3>生成参照画像</h3><p>配置中の什器印刷面・画面画像・人物の参照画像はありません。</p>`;
    return;
  }
  wrap.innerHTML = `
    <h3>什器・POP・モニター・人物参照画像</h3>
    <p>GPT image 2.0で画像生成する時は、形状画像、実印刷面、画面画像、人物画像をプロンプトと一緒に添付してください。</p>
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
    <h2>什器・POP・モニター参照画像</h2>
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
  const layoutItems = activeItems().filter(isFurnitureForImageAdjacency);
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
  const furniture = activeItems().filter(isFurnitureForImageAdjacency);
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
