const test = require("node:test");
const assert = require("node:assert/strict");
const domain = require("../booth-domain.js");

test("10/50/100mmグリッドへ正確にスナップする", () => {
  assert.equal(domain.snapMm(126, 10), 130);
  assert.equal(domain.snapMm(126, 50), 150);
  assert.equal(domain.snapMm(126, 100), 100);
  assert.equal(domain.snapMm(126.4, 50, false), 126);
});

test("回転角を90度単位の0..270度へ正規化する", () => {
  assert.equal(domain.normalizeRotationDegrees(-90), 270);
  assert.equal(domain.normalizeRotationDegrees(450), 90);
  assert.equal(domain.normalizeRotationDegrees(181), 180);
});

test("接触と衝突を区別し、矩形間距離をmmで返す", () => {
  const a = { x: 0, y: 0, width: 900, depth: 600 };
  const touching = { x: 900, y: 0, width: 300, depth: 300 };
  const overlapping = { x: 899, y: 0, width: 300, depth: 300 };
  const separated = { x: 1200, y: 1000, width: 300, depth: 300 };
  assert.equal(domain.rectanglesOverlap(a, touching), false);
  assert.equal(domain.rectanglesOverlap(a, overlapping), true);
  assert.equal(domain.rectangleDistance(a, touching), 0);
  assert.equal(Math.round(domain.rectangleDistance(a, separated)), 500);
});

test("壁距離とはみ出しをmmで判定する", () => {
  const booth = { width: 3000, depth: 3000 };
  assert.deepEqual(domain.wallClearances({ x: 100, y: 200, width: 900, depth: 600 }, booth), {
    top: 200, right: 2000, bottom: 2200, left: 100
  });
  assert.equal(domain.isOutOfBounds({ x: 2200, y: 200, width: 900, depth: 600 }, booth), true);
});

test("v9保存データと旧形式を可逆に読み込む", () => {
  const state = {
    booth: { width: 3000, depth: 3000 },
    powerCircuits: [{ id: "c1", name: "回路A", voltageV: 100, capacityW: 1500 }],
    items: [{ id: "a", x: 125, y: 275, powerSourceId: "outlet-1", cableRouteMode: "x-then-y", cableSlackMm: 500 }]
  };
  const document = domain.createProjectDocument(state);
  const parsed = domain.parseProjectDocument(JSON.stringify(document));
  assert.equal(parsed.version, 9);
  assert.equal(parsed.legacy, false);
  assert.deepEqual(parsed.state, state);

  const legacy = domain.parseProjectDocument(JSON.stringify(state));
  assert.equal(legacy.legacy, true);
  assert.deepEqual(legacy.state, state);
});

test("机上物を支持面中央へ実寸配置し、支持面のZを加算する", () => {
  const table = { x: 1000, y: 500, z: 0, width: 1500, depth: 750, height: 820 };
  const machine = { width: 240, depth: 370, height: 440 };
  const placement = domain.calculateSupportPlacement(machine, table);
  assert.equal(placement.complete, true);
  assert.equal(placement.fits, true);
  assert.equal(placement.x, 1630);
  assert.equal(placement.y, 690);
  assert.equal(placement.z, 820);
  assert.equal(placement.maximumOverhangMm, 0);
});

test("メーカー指定のA0002＋A0007組合せだけ、実測外形の張り出しと公称設置高を保持する", () => {
  const stand = { x: 200, y: 300, z: 830, width: 250, depth: 315, height: 100 };
  const machine = { width: 240, depth: 370, height: 440 };
  const rejected = domain.calculateSupportPlacement(machine, stand, { zOffsetMm: 90 });
  assert.equal(rejected.fits, false);
  assert.equal(rejected.maximumOverhangMm, 27.5);

  const approved = domain.calculateSupportPlacement(machine, stand, { zOffsetMm: 90, allowOverhang: true });
  assert.equal(approved.fits, true);
  assert.equal(approved.x, 205);
  assert.equal(approved.y, 272.5);
  assert.equal(approved.z, 920);
  assert.equal(approved.z + machine.height, 1360);
});

test("在庫箱は平面90度回転を比較し、補充回数込みの最大同時箱数と容量を算出する", () => {
  const result = domain.calculateInventoryCapacity({
    zoneWidthMm: 1200,
    zoneDepthMm: 800,
    totalUnits: 640,
    unitsPerCarton: 10,
    replenishmentCount: 1,
    cartonWidthMm: 400,
    cartonDepthMm: 300,
    cartonHeightMm: 250,
    maxStackHeightMm: 1000
  });
  assert.equal(result.complete, true);
  assert.equal(result.orientation.name, "rotated");
  assert.equal(result.cartonsPerLayer, 8);
  assert.equal(result.layers, 4);
  assert.equal(result.capacityCartons, 32);
  assert.equal(result.totalCartons, 64);
  assert.equal(result.peakCartons, 32);
  assert.equal(result.shortageCartons, 0);
});

test("在庫容量不足と未登録入力を合格扱いにしない", () => {
  const shortage = domain.calculateInventoryCapacity({
    zoneWidthMm: 1200,
    zoneDepthMm: 800,
    totalUnits: 800,
    unitsPerCarton: 10,
    replenishmentCount: 0,
    cartonWidthMm: 400,
    cartonDepthMm: 300,
    cartonHeightMm: 250,
    maxStackHeightMm: 1000
  });
  assert.equal(shortage.capacityCartons, 32);
  assert.equal(shortage.peakCartons, 80);
  assert.equal(shortage.shortageCartons, 48);

  const missing = domain.calculateInventoryCapacity({ zoneWidthMm: 1200, zoneDepthMm: 800 });
  assert.equal(missing.complete, false);
  assert.ok(missing.missingFields.includes("cartonWidthMm"));
  assert.equal(missing.capacityCartons, null);
});

test("設計・営業中・混雑時の有効物品を互換性を保って判定する", () => {
  assert.equal(domain.isActiveInOperationMode({}, "design"), true);
  assert.equal(domain.isActiveInOperationMode({ activationMode: "operating" }, "design"), false);
  assert.equal(domain.isActiveInOperationMode({ activationMode: "operating" }, "operating"), true);
  assert.equal(domain.isActiveInOperationMode({ activationMode: "operating" }, "crowded"), true);
  assert.equal(domain.isActiveInOperationMode({ activationMode: "crowded" }, "operating"), false);
  assert.equal(domain.isActiveInOperationMode({ activationMode: "crowded" }, "crowded"), true);
  assert.equal(domain.normalizeOperationMode("unknown"), "design");
});

test("電源から機器までの直交配線経路と平面長をmmで算出する", () => {
  const outlet = { x: 0, y: 0, width: 300, depth: 300 };
  const device = { x: 1000, y: 700, width: 400, depth: 200 };
  const routeXy = domain.orthogonalRoute(outlet, device, "x-then-y");
  const routeYx = domain.orthogonalRoute(outlet, device, "y-then-x");
  assert.deepEqual(routeXy, [{ x: 150, y: 150 }, { x: 1200, y: 150 }, { x: 1200, y: 800 }]);
  assert.deepEqual(routeYx, [{ x: 150, y: 150 }, { x: 150, y: 800 }, { x: 1200, y: 800 }]);
  assert.equal(domain.polylineLength(routeXy), 1700);
  assert.equal(domain.polylineLength(routeYx), 1700);
});

test("配線経路が什器矩形を横切る場合だけ検出する", () => {
  const route = [{ x: 100, y: 100 }, { x: 900, y: 100 }, { x: 900, y: 900 }];
  assert.equal(domain.routeIntersectsRectangle(route, { x: 400, y: 50, width: 200, depth: 200 }), true);
  assert.equal(domain.routeIntersectsRectangle(route, { x: 400, y: 400, width: 200, depth: 200 }), false);
  assert.equal(domain.routeIntersectsRectangle(route, { x: 850, y: 500, width: 200, depth: 200 }), true);
});

test("視線の高さを考慮して什器遮蔽を判定する", () => {
  const source = { x: 0, y: 500, z: 1600 };
  const target = { x: 2000, y: 500, z: 1000 };
  const plan = { x: 900, y: 400, width: 200, depth: 200, bottom: 0 };
  assert.equal(domain.lineOfSightBlocked(source, target, { ...plan, top: 1200 }), false);
  assert.equal(domain.lineOfSightBlocked(source, target, { ...plan, top: 1400 }), true);
  assert.equal(domain.lineOfSightBlocked(source, target, { x: 900, y: 800, width: 200, depth: 100, bottom: 0, top: 2000 }), false);
});

test("登録した正面側にある視点だけを正面視点として扱う", () => {
  const target = { x: 800, y: 400, width: 400, depth: 200 };
  assert.equal(domain.facingSideContainsPoint(target, "bottom", { x: 1000, y: 1000 }), true);
  assert.equal(domain.facingSideContainsPoint(target, "bottom", { x: 1000, y: 0 }), false);
  assert.equal(domain.facingSideContainsPoint(target, "left", { x: 0, y: 500 }), true);
});

test("必要幅を膨張した障害物で到達可能経路を探索する", () => {
  const booth = { width: 2000, depth: 1000 };
  const open = domain.findGridPath({
    booth,
    start: { x: 100, y: 500 },
    end: { x: 1900, y: 500 },
    cellSize: 100,
    clearanceMm: 200,
    obstacles: [{ x: 900, y: 0, width: 200, depth: 350 }]
  });
  assert.equal(open.found, true);
  assert.ok(open.lengthMm >= 1800);

  const blocked = domain.findGridPath({
    booth,
    start: { x: 100, y: 500 },
    end: { x: 1900, y: 500 },
    cellSize: 100,
    clearanceMm: 200,
    obstacles: [{ x: 900, y: 0, width: 200, depth: 1000 }]
  });
  assert.equal(blocked.found, false);
});

test("塞がれた対象正面から離れた空きセルへ飛び越えない", () => {
  const result = domain.findGridPath({
    booth: { width: 3000, depth: 2500 },
    start: { x: 400, y: 2100 },
    end: { x: 1500, y: 900 },
    obstacles: [{ x: 1100, y: 500, width: 800, depth: 800 }],
    cellSize: 100,
    clearanceMm: 800
  });
  assert.equal(result.found, false);
});

test("矩形境界分割で到達床・障害物・デッドスペース候補をmm²集計する", () => {
  const result = domain.analyzeOrthogonalSpace({
    booth: { width: 1000, depth: 1000 },
    entrySide: "bottom",
    obstacles: [{ id: "barrier", x: 0, y: 500, width: 1000, depth: 100 }],
    zones: [{ id: "contact", x: 100, y: 100, width: 300, depth: 200 }]
  });
  assert.equal(result.boothAreaMm2, 1000000);
  assert.equal(result.occupiedAreaMm2, 100000);
  assert.equal(result.reachableAreaMm2, 400000);
  assert.equal(result.deadAreaMm2, 500000);
  assert.deepEqual(result.zones[0], {
    id: "contact",
    areaMm2: 60000,
    occupiedMm2: 0,
    freeMm2: 60000,
    reachableMm2: 0,
    deadMm2: 60000
  });
});

test("スタッフ起点を追加すると閉じた領域を業務到達可能として集計する", () => {
  const result = domain.analyzeOrthogonalSpace({
    booth: { width: 1000, depth: 1000 },
    entrySide: "bottom",
    entryPoints: [{ x: 200, y: 200 }],
    obstacles: [{ x: 0, y: 500, width: 1000, depth: 100 }]
  });
  assert.equal(result.freeAreaMm2, 900000);
  assert.equal(result.reachableAreaMm2, 900000);
  assert.equal(result.deadAreaMm2, 0);
});
