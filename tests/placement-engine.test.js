const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const crypto = require('node:crypto');
const Domain = require('../booth-domain.js');

// Execute the actual app placement/pointer handlers, without a renderer or browser storage.
function app(withThree = false) {
  const elements = new Map();
  const noop = () => {};
  const context2d = new Proxy({ measureText: text => ({ width: text.length * 7 }) }, { get: (o, key) => o[key] || noop });
  function element(id) {
    if (!elements.has(id)) elements.set(id, {
      value: '', textContent: '', innerHTML: '', dataset: {}, style: {}, width: 1000, height: 700,
      classList: { add: noop, remove: noop, toggle: noop, contains: () => false },
      getContext: () => context2d, getBoundingClientRect: () => ({ left: 0, top: 0, width: 1000, height: 700 }),
      setPointerCapture: noop, releasePointerCapture: noop, hasPointerCapture: () => true,
      append: noop, setAttribute: noop, addEventListener: noop, focus: noop, click: noop,
      querySelectorAll: () => [], closest: () => element('closest'),
    });
    return elements.get(id);
  }
  const context = vm.createContext({
    window: { BoothDomain: Domain, addEventListener: noop, devicePixelRatio: 1 },
    document: { getElementById: element, querySelectorAll: () => [], querySelector: () => element('query'), createElement: () => element('created'), body: element('body') },
    console, crypto, structuredClone, alert: noop, confirm: () => true,
    localStorage: { getItem: () => null, setItem: noop }, Image: class {},
    setTimeout: () => 0, clearTimeout: noop, requestAnimationFrame: noop,
  });
  const source = fs.readFileSync(path.join(__dirname, '../app.js'), 'utf8').replace(/^init\(\);\s*$/m, '');
  if (withThree) {
    vm.runInContext(fs.readFileSync(path.join(__dirname, '../assets/vendor/three.bundle.min.js'), 'utf8'), context);
  }
  vm.runInContext(source, context);
  vm.runInContext(`
    render = () => { normalizeItems(); recordHistorySnapshot(); };
    drawCanvas = () => {};
    state.items = []; state.selectedId = null;
    state.booth = { ...state.booth, width: 6000, depth: 4000, aisleSide: 'bottom' };
    scale = .1; origin = { x: 0, y: 0 };
    recordHistorySnapshot();
    globalThis.api = {
      state, masters: itemTypes, addItem, makeMasterItem, rotateSelected, duplicateSelected, deleteSelected, updateSelectedFromForm,
      moveItemTo, finishItemPlacement, detachItemFromSupport, syncSupportedItems, placeItemOnSurface,
      placeNewItemSafely, detachSelectedFromSupport, getSupportTop, getSupportPlacementDefinition,
      placementTree, hasPlacementCollision, normalizeItems, clampItem, availableSupportSurfaces,
      onPointerDown, onPointerMove, endDrag, canvasView, canvasPointers,
      historyPast, historyFuture, undoDesignChange, redoDesignChange, applyLoadedState,
      compactLabel, paletteSearchText, paletteCategory, thinItemHandle, element: $,
      createFacingGroup, createThreeDisplayItem, addThreeRotatingNetDisplay, prepareThreePickTargets, THREE: window.THREE,
    };
  `, context);
  const api = context.api;
  api.master = identity => api.masters.find(x => x.masterId === identity || x.productCode === identity || x.scenarioKind === identity || x.label === identity || x.boldaCode === identity);
  api.add = identity => api.addItem(api.master(identity));
  api.drop = (item, x, y) => {
    const snapshot = api.placementTree(item).map(x => ({ ...x }));
    api.detachItemFromSupport(item);
    api.moveItemTo(item, x, y);
    return api.finishItemPlacement(item, snapshot);
  };
  return api;
}

test('01 薄い有孔ボードをtouchで選択・移動・回転・削除・Undo/Redo', () => {
  const a = app(); const board = a.add('B0897LVM4J');
  const event = { pointerId: 1, pointerType: 'touch', button: 0, clientX: (board.x + board.width / 2) * .1, clientY: board.y * .1 + 15, preventDefault() {} };
  a.state.selectedId = null; a.onPointerDown(event);
  assert.equal(a.state.selectedId, board.id);
  const x = board.x;
  a.onPointerMove({ ...event, clientX: event.clientX + 40 });
  a.endDrag({ ...event, type: 'pointerup' });
  assert.ok(board.x > x);
  const historyAfterDrag = a.historyPast.length;
  assert.equal(historyAfterDrag, 3, 'one completed drag = one undo entry');
  a.rotateSelected(); assert.equal(board.width, 1.6); assert.equal(board.depth, 450);
  a.deleteSelected(); assert.equal(a.state.items.length, 0);
  a.undoDesignChange(); assert.equal(a.state.items.length, 1);
  a.redoDesignChange(); assert.equal(a.state.items.length, 0);
});

test('PC: 薄いボードの見える名前ハンドルを、高い物の判定より優先してドラッグ', () => {
  for (const rotated of [false, true]) {
    const a = app(); const board = a.add('B0897LVM4J');
    if (rotated) a.rotateSelected();
    const handle = a.thinItemHandle(board);
    assert.equal(handle.width, 132); assert.equal(handle.height, 32);
    // Older selection walked Z order first; a lamp's hit target stole this click.
    a.state.items.push({ id: 'lamp', type: 'spotlight', x: board.x - 200, y: board.y - 200,
      width: 900, depth: 900, height: 200, z: 2200 });
    const e = { pointerId: 1, pointerType: 'mouse', button: 0,
      clientX: handle.x + handle.width / 2, clientY: handle.y + 2, preventDefault() {} };
    a.state.selectedId = null; a.onPointerDown(e);
    assert.equal(a.state.selectedId, board.id);
    const before = board.x;
    a.onPointerMove({ ...e, clientX: e.clientX + 40 }); a.endDrag({ ...e, type: 'pointerup' });
    assert.ok(board.x > before);
    assert.equal(Math.min(board.width, board.depth), 1.6, 'editing grip must not resize the real sheet');
  }
});

test('61-127-7-2: 公式外形・検索・机上設置・追従・回転・削除・復元', () => {
  const a = app(); const table = a.add('長机'); const rack = a.add('61-127-7-2');
  assert.deepEqual([rack.width, rack.depth, rack.height], [330, 330, 390]);
  assert.equal(rack.supportItemId, table.id); assert.equal(rack.z, 700);
  assert.equal(rack.supportSurface, false); assert.equal(rack.dimensionLocked, true);
  assert.equal(a.paletteCategory(rack), 'fixtures');
  assert.match(a.paletteSearchText(a.master('61-127-7-2')), /b016puu2re/);
  const before = rack.x; a.moveItemTo(table, table.x + 300, table.y); assert.equal(rack.x, before + 300);
  a.state.selectedId = rack.id; a.rotateSelected(); assert.equal(rack.rotationDeg, 90);
  assert.equal(a.hasPlacementCollision(rack), false);
  a.deleteSelected(); assert.ok(!a.state.items.some(x => x.id === rack.id));
  a.undoDesignChange(); assert.ok(a.state.items.some(x => x.id === rack.id));
  const saved = JSON.parse(JSON.stringify(a.state)); a.applyLoadedState(saved);
  const restored = a.state.items.find(x => x.id === rack.id);
  assert.equal(restored.supportItemId, table.id); assert.equal(restored.z, 700);
});

test('3D: 板の真横とネットの空洞を透明な操作領域で選択できる', () => {
  const a = app(true), T = a.THREE;
  for (const identity of ['B0897LVM4J', '61-127-7-2']) {
    const item = a.add(identity), display = a.createThreeDisplayItem(item);
    const scene = new T.Scene();
    const group = a.createFacingGroup(display); scene.add(group);
    const proxy = group.children.find(x => x.userData.pickDimensions);
    assert.ok(proxy); assert.equal(proxy.material.visible, false);
    const center = new T.Vector3(); scene.updateMatrixWorld(true); proxy.getWorldPosition(center);
    const camera = new T.PerspectiveCamera(50, 1.5, 1, 20000);
    camera.position.copy(center).add(new T.Vector3(4000, 0, 0)); camera.lookAt(center); camera.updateMatrixWorld(true);
    a.prepareThreePickTargets(scene, camera, 900, 'mouse');
    const ray = new T.Raycaster(); ray.setFromCamera(new T.Vector2(.01, 0), camera);
    assert.ok(ray.intersectObjects(scene.children, true).length, identity);
    assert.equal(item.depth, identity === 'B0897LVM4J' ? 1.6 : 330);
  }
});

test('3D: 回転ネットは円形台座・3面メッシュ付きで実寸外形内に描画', () => {
  const a = app(true), T = a.THREE, item = a.add('61-127-7-2'), scene = new T.Scene();
  a.addThreeRotatingNetDisplay(scene, a.createThreeDisplayItem(item));
  const bounds = new T.Box3().setFromObject(scene), size = bounds.getSize(new T.Vector3());
  assert.ok(size.x <= 330.1 && size.z <= 330.1 && size.y <= 390.1, JSON.stringify(size));
  const group = scene.children[0];
  assert.equal(group.children.filter(x => x.isGroup).length, 3);
});

test('02/04/05/07 ヒーター・PC・プリンター・912は天板上へ自動設置', () => {
  for (const identity of ['169', 'laptop', 'compact-printer', '912']) {
    const a = app(); const table = a.add('長机');
    a.state.selectedId = null; const item = a.add(identity);
    assert.ok(a.drop(item, table.x + 100, table.y + 100));
    assert.equal(item.supportItemId, table.id, identity);
    assert.equal(item.z, table.z + table.height, identity);
    assert.equal(a.hasPlacementCollision(item), false);
  }
});

test('03/10/11 展示台→AS01→商品、親移動・回転に子孫が追従', () => {
  const a = app(); const table = a.add('TB05'); const riser = a.add('AS01'); const product = a.add('912');
  assert.equal(riser.supportItemId, table.id); assert.equal(product.supportItemId, riser.id);
  assert.equal(riser.z, 800); assert.equal(product.z, 1100);
  const oldX = product.x; a.moveItemTo(table, table.x + 500, table.y);
  assert.equal(product.x, oldX + 500);
  const before = product.y; a.moveItemTo(riser, riser.x, riser.y + 100);
  assert.equal(product.y, before + 100);
  a.state.selectedId = table.id; a.rotateSelected();
  assert.equal(table.rotationDeg, 90); assert.equal(riser.rotationDeg, 90); assert.equal(product.rotationDeg, 90);
  assert.equal(product.supportItemId, riser.id); assert.equal(product.z, 1100);
  assert.equal(a.hasPlacementCollision(table), false);
});

test('06 271-Dと912の根拠付き外形・固定寸法・一般備品サイズ', () => {
  const a = app();
  for (const [identity, dimensions] of [['271-D', [160,180,350]], ['912', [160,110,180]], ['laptop', [340,240,220]], ['compact-printer',[400,350,180]], ['tablet',[250,175,10]], ['smartphone',[150,75,9]], ['monitor',[610,220,450]]]) {
    const item = a.master(identity);
    assert.deepEqual([item.width,item.depth,item.height], dimensions);
    assert.ok(item.dimensionSource);
    if (item.type === 'product') assert.equal(item.dimensionLocked, true);
  }
  assert.match(a.compactLabel('超音波洗浄器 No.912'), /912$/);
});

test('08/09 台A→台Bへの付け替え、床へ戻す、床へ降ろすボタンの重複回避', () => {
  const a = app(); const first = a.add('長机'); const second = a.add('受付机');
  a.moveItemTo(second, 100, 100);
  a.state.selectedId = first.id; const item = a.add('912');
  assert.ok(a.drop(item, second.x + 50, second.y + 50));
  assert.equal(item.supportItemId, second.id); assert.equal(item.z, second.height);
  assert.ok(a.drop(item, 5000, 3000)); assert.equal(item.z, 0); assert.equal(item.supportItemId, '');
  assert.ok(a.drop(item, second.x + 50, second.y + 50));
  a.state.selectedId = item.id; a.detachSelectedFromSupport();
  assert.equal(item.z, 0); assert.equal(item.supportItemId, ''); assert.equal(a.hasPlacementCollision(item), false);
});

test('満杯の台・机の重なりは元へ戻し、商品を床へ沈めない', () => {
  const a = app(); const table = a.add('TB05'); const full = a.add('AS01');
  const snapshot = { x: table.x, y: table.y };
  a.state.selectedId = null; const second = a.add('長机');
  assert.equal(a.drop(second, table.x, table.y), false);
  assert.equal(a.hasPlacementCollision(second), false);
  a.state.selectedId = full.id; const phone = a.add('smartphone');
  assert.equal(phone.z, 1100);
  assert.deepEqual({x:table.x,y:table.y}, snapshot);
});

test('複製は空き位置へ置き、台と子孫の親子関係を保持する', () => {
  const a = app(); const table = a.add('長机'); const item = a.add('912');
  a.state.selectedId = table.id; a.duplicateSelected();
  const copy = a.state.items.find(x => x.id === a.state.selectedId);
  const children = a.state.items.filter(x => x.supportItemId === copy.id);
  assert.equal(children.length, 1); assert.notEqual(children[0].id, item.id);
  assert.equal(children[0].z, copy.height); assert.equal(a.hasPlacementCollision(copy), false);
});

test('段付き台の上面は全外形より小さく、回転しても実上面に制限', () => {
  const a = app(); const table = a.add('ED04'); const top = a.getSupportTop(table);
  assert.equal(top.width, 900); assert.equal(top.depth, 200); assert.equal(top.height, 1100);
  const cleaner = a.add('912'); assert.equal(cleaner.z, 1100);
  assert.ok(cleaner.y + cleaner.depth <= top.y + top.depth);
  a.state.selectedId = table.id; a.rotateSelected();
  assert.equal(a.getSupportTop(table).width, 200);
  assert.equal(cleaner.supportItemId, table.id);
});

test('支持関係の循環を拒否し、寸法を勝手に縮めない', () => {
  const a = app(); const table = a.add('TB05'); const riser = a.add('AS01');
  assert.equal(a.getSupportPlacementDefinition(table, riser), null);
  const tooLarge = { id: 'large', width: 9000, depth: 8000, x: 10, y: 10 };
  a.clampItem(tooLarge); assert.equal(tooLarge.width, 9000); assert.equal(tooLarge.depth, 8000);
});

test('12 2本指ピンチ/パン、cancel時の復元、Undo履歴にジェスチャーを追加しない', () => {
  const a = app(); const item = a.add('912'); const old = { x: item.x, y: item.y };
  const event = { pointerId: 1, pointerType: 'touch', button: 0, clientX: (item.x + 80) * .1, clientY: (item.y + 55) * .1, preventDefault() {} };
  a.onPointerDown(event); a.onPointerMove({ ...event, clientX: event.clientX + 30 });
  a.endDrag({ ...event, type: 'pointercancel' });
  assert.deepEqual({x:item.x,y:item.y}, old);
  const before = a.historyPast.length;
  a.onPointerDown({ ...event, clientX: 0, clientY: 0 });
  a.onPointerDown({ ...event, pointerId: 2, clientX: 100, clientY: 0 });
  a.onPointerMove({ ...event, pointerId: 2, clientX: 200, clientY: 20 });
  assert.ok(a.canvasView.zoom > 1);
  a.endDrag({ ...event, pointerId: 2, type: 'pointerup' });
  a.endDrag({ ...event, type: 'pointerup' });
  assert.equal(a.historyPast.length, before); assert.equal(a.canvasPointers.size, 0);
});

test('v9保存・再読込後も3段の関連・実寸・上面高さを保持', () => {
  const a = app(); a.add('TB05'); a.add('AS01'); const product = a.add('912');
  const parsed = Domain.parseProjectDocument(JSON.stringify(Domain.createProjectDocument(a.state)));
  a.applyLoadedState(parsed.state); a.normalizeItems();
  const restored = a.state.items.find(x => x.id === product.id);
  assert.equal(restored.z, 1100); assert.equal(restored.supportItemId, product.supportItemId);
  assert.deepEqual([restored.width,restored.depth,restored.height],[160,110,180]);
});

test('満杯の机へのドロップは以前の床位置へ戻す', () => {
  const a = app(); const table = a.add('受付机');
  const full = a.addItem({ type: 'scenario', label: '天板を埋める箱', width: 1200, depth: 600, height: 100, surfacePlaceable: true });
  assert.equal(full.supportItemId, table.id);
  const cleaner = a.add('912'); const old = {x:cleaner.x,y:cleaner.y,z:cleaner.z};
  assert.equal(a.drop(cleaner, table.x + 20, table.y + 20), false);
  assert.deepEqual({x:cleaner.x,y:cleaner.y,z:cleaner.z}, old);
  assert.equal(cleaner.supportItemId, '');
});

test('棚の背板高さではなく棚板上面へ配置する', () => {
  const a = app(); const shelf = a.add('什器棚'); const cleaner = a.add('912');
  assert.equal(cleaner.z, 1334); assert.equal(cleaner.supportItemId, shelf.id);
});

test('親のサイズ変更で子が収まらない場合は全階層を復元する', () => {
  const a = app(); const table = a.add('長机'); const riser = a.add('AS01'); const cleaner = a.add('912');
  a.state.selectedId = table.id;
  const fields = { itemLabel:table.label, itemWidth:800, itemDepth:600, itemHeight:700, itemX:table.x, itemY:table.y, itemZ:0 };
  for (const [id,value] of Object.entries(fields)) a.element(id).value = String(value);
  a.updateSelectedFromForm();
  assert.equal(table.width,1800); assert.equal(riser.supportItemId,table.id); assert.equal(cleaner.supportItemId,riser.id); assert.equal(cleaner.z,1000);
});

test('一般備品の参考寸法を実測や消費電力の確認済みと偽らない', () => {
  const a = app();
  for (const kind of ['laptop','compact-printer','tablet','smartphone','monitor']) {
    assert.equal(a.master(kind).dimensionsConfirmed,false); assert.equal(a.master(kind).watt,0);
  }
  assert.equal(a.master('912').ratedOutputW,70); assert.equal(a.master('912').watt,0);
});

test('スナップの最大距離を超える端への大移動をしない', () => {
  assert.equal(Domain.findNearestFreeSupportPlacement({width:400,depth:300},{x:0,y:0,width:1000,depth:600,height:700},[],{offsetX:-250,offsetY:10,maxDistanceMm:180}),null);
});

test('品番・通称でも見つかり、有孔ボードは什器カテゴリにある', () => {
  const a = app();
  assert.match(a.paletteSearchText(a.master('912')), /912/);
  assert.match(a.paletteSearchText(a.master('AS01')), /ヨーカン棒/);
  assert.equal(a.paletteCategory(a.master('B0897LVM4J')), 'fixtures');
});

test('旧データのAS01・机の支持属性を復元し、PCの品種を取り違えない', () => {
  const a = app(); const table = a.add('長机'); const riser = a.add('AS01');
  table.supportSurface = false; riser.surfacePlaceable = false; riser.supportSurface = false;
  a.normalizeItems();
  assert.equal(table.supportSurface, true); assert.equal(riser.surfacePlaceable, true); assert.equal(riser.supportSurface, true);
  const pc = a.add('laptop'); pc.masterId = 'STD-053-SCENARIO'; pc.label = '旧ノートPC'; pc.width = 300;
  a.normalizeItems(); assert.equal(pc.scenarioKind,'laptop'); assert.equal(pc.width,300);
});
