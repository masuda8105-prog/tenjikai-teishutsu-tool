(function initBoothDomain(root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.BoothDomain = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function createBoothDomain() {
  "use strict";

  const PROJECT_SCHEMA = "exhibition-booth-project";
  const PROJECT_VERSION = 9;
  const VALID_GRID_SIZES = Object.freeze([10, 50, 100]);
  const VALID_OPERATION_MODES = Object.freeze(["design", "operating", "crowded"]);

  function finiteNumber(value, fallback = 0) {
    const number = Number(value);
    return Number.isFinite(number) ? number : fallback;
  }

  function normalizeRotationDegrees(value) {
    const degrees = Math.round(finiteNumber(value, 0) / 90) * 90;
    return ((degrees % 360) + 360) % 360;
  }

  function sanitizeGridSize(value, fallback = 50) {
    const grid = finiteNumber(value, fallback);
    return VALID_GRID_SIZES.includes(grid) ? grid : fallback;
  }

  function normalizeOperationMode(value) {
    return VALID_OPERATION_MODES.includes(value) ? value : "design";
  }

  function isActiveInOperationMode(item, mode) {
    const currentMode = normalizeOperationMode(mode);
    const activationMode = ["always", "operating", "crowded"].includes(item?.activationMode) ? item.activationMode : "always";
    if (activationMode === "always") return true;
    if (activationMode === "operating") return currentMode === "operating" || currentMode === "crowded";
    return currentMode === "crowded";
  }

  function snapMm(value, gridSize = 50, enabled = true) {
    const number = finiteNumber(value, 0);
    if (!enabled) return Math.round(number);
    const grid = sanitizeGridSize(gridSize);
    return Math.round(number / grid) * grid;
  }

  function rectanglesOverlap(a, b) {
    return a.x < b.x + b.width &&
      a.x + a.width > b.x &&
      a.y < b.y + b.depth &&
      a.y + a.depth > b.y;
  }

  function rectangleDistance(a, b) {
    const gapX = Math.max(a.x - (b.x + b.width), b.x - (a.x + a.width), 0);
    const gapY = Math.max(a.y - (b.y + b.depth), b.y - (a.y + a.depth), 0);
    return Math.hypot(gapX, gapY);
  }

  function wallClearances(item, booth) {
    return {
      top: finiteNumber(item.y),
      right: finiteNumber(booth.width) - (finiteNumber(item.x) + finiteNumber(item.width)),
      bottom: finiteNumber(booth.depth) - (finiteNumber(item.y) + finiteNumber(item.depth)),
      left: finiteNumber(item.x)
    };
  }

  function isOutOfBounds(item, booth) {
    const clearances = wallClearances(item, booth);
    return Object.values(clearances).some((value) => value < 0);
  }

  function rectangleCenter(item) {
    return {
      x: finiteNumber(item.x) + finiteNumber(item.width) / 2,
      y: finiteNumber(item.y) + finiteNumber(item.depth) / 2
    };
  }

  function calculateSupportPlacement(item, support, options = {}) {
    const itemWidth = Math.max(0, finiteNumber(item?.width));
    const itemDepth = Math.max(0, finiteNumber(item?.depth));
    const supportWidth = Math.max(0, finiteNumber(support?.width));
    const supportDepth = Math.max(0, finiteNumber(support?.depth));
    const centeredOffsetX = (supportWidth - itemWidth) / 2;
    const centeredOffsetY = (supportDepth - itemDepth) / 2;
    const offsetX = finiteNumber(options.offsetX, centeredOffsetX);
    const offsetY = finiteNumber(options.offsetY, centeredOffsetY);
    const zOffsetMm = Math.max(0, finiteNumber(options.zOffsetMm, Math.max(0, finiteNumber(support?.height))));
    const overhang = {
      left: Math.max(0, -offsetX),
      right: Math.max(0, offsetX + itemWidth - supportWidth),
      top: Math.max(0, -offsetY),
      bottom: Math.max(0, offsetY + itemDepth - supportDepth)
    };
    const maximumOverhangMm = Math.max(...Object.values(overhang));
    const allowOverhang = options.allowOverhang === true;
    return {
      complete: itemWidth > 0 && itemDepth > 0 && supportWidth > 0 && supportDepth > 0,
      fits: itemWidth > 0 && itemDepth > 0 && supportWidth > 0 && supportDepth > 0 && (allowOverhang || maximumOverhangMm === 0),
      allowOverhang,
      offsetX,
      offsetY,
      zOffsetMm,
      x: finiteNumber(support?.x) + offsetX,
      y: finiteNumber(support?.y) + offsetY,
      z: Math.max(0, finiteNumber(support?.z)) + zOffsetMm,
      overhang,
      maximumOverhangMm
    };
  }

  function orthogonalRoute(source, target, mode = "x-then-y") {
    const start = rectangleCenter(source);
    const end = rectangleCenter(target);
    const bend = mode === "y-then-x"
      ? { x: start.x, y: end.y }
      : { x: end.x, y: start.y };
    const points = [start, bend, end];
    return points.filter((point, index) => index === 0 || point.x !== points[index - 1].x || point.y !== points[index - 1].y);
  }

  function polylineLength(points) {
    return (points || []).slice(1).reduce((sum, point, index) => {
      const previous = points[index];
      return sum + Math.hypot(finiteNumber(point.x) - finiteNumber(previous.x), finiteNumber(point.y) - finiteNumber(previous.y));
    }, 0);
  }

  function pointInsideRectangle(point, rectangle, includeBoundary = true) {
    const left = finiteNumber(rectangle.x);
    const top = finiteNumber(rectangle.y);
    const right = left + finiteNumber(rectangle.width);
    const bottom = top + finiteNumber(rectangle.depth);
    if (includeBoundary) return point.x >= left && point.x <= right && point.y >= top && point.y <= bottom;
    return point.x > left && point.x < right && point.y > top && point.y < bottom;
  }

  function orientation(a, b, c) {
    const value = (b.y - a.y) * (c.x - b.x) - (b.x - a.x) * (c.y - b.y);
    if (Math.abs(value) < 1e-9) return 0;
    return value > 0 ? 1 : 2;
  }

  function pointOnSegment(a, point, b) {
    return point.x <= Math.max(a.x, b.x) && point.x >= Math.min(a.x, b.x) &&
      point.y <= Math.max(a.y, b.y) && point.y >= Math.min(a.y, b.y);
  }

  function segmentsIntersect(a, b, c, d) {
    const o1 = orientation(a, b, c);
    const o2 = orientation(a, b, d);
    const o3 = orientation(c, d, a);
    const o4 = orientation(c, d, b);
    if (o1 !== o2 && o3 !== o4) return true;
    if (o1 === 0 && pointOnSegment(a, c, b)) return true;
    if (o2 === 0 && pointOnSegment(a, d, b)) return true;
    if (o3 === 0 && pointOnSegment(c, a, d)) return true;
    return o4 === 0 && pointOnSegment(c, b, d);
  }

  function segmentIntersectsRectangle(start, end, rectangle) {
    if (pointInsideRectangle(start, rectangle) || pointInsideRectangle(end, rectangle)) return true;
    const left = finiteNumber(rectangle.x);
    const top = finiteNumber(rectangle.y);
    const right = left + finiteNumber(rectangle.width);
    const bottom = top + finiteNumber(rectangle.depth);
    const corners = [
      { x: left, y: top },
      { x: right, y: top },
      { x: right, y: bottom },
      { x: left, y: bottom }
    ];
    return corners.some((corner, index) => segmentsIntersect(start, end, corner, corners[(index + 1) % corners.length]));
  }

  function routeIntersectsRectangle(points, rectangle) {
    return (points || []).slice(1).some((point, index) => segmentIntersectsRectangle(points[index], point, rectangle));
  }

  function segmentRectangleInterval(start, end, rectangle) {
    const left = finiteNumber(rectangle.x);
    const top = finiteNumber(rectangle.y);
    const right = left + finiteNumber(rectangle.width);
    const bottom = top + finiteNumber(rectangle.depth);
    const dx = finiteNumber(end.x) - finiteNumber(start.x);
    const dy = finiteNumber(end.y) - finiteNumber(start.y);
    const p = [-dx, dx, -dy, dy];
    const q = [finiteNumber(start.x) - left, right - finiteNumber(start.x), finiteNumber(start.y) - top, bottom - finiteNumber(start.y)];
    let enter = 0;
    let exit = 1;
    for (let index = 0; index < 4; index += 1) {
      if (Math.abs(p[index]) < 1e-9) {
        if (q[index] < 0) return null;
        continue;
      }
      const ratio = q[index] / p[index];
      if (p[index] < 0) enter = Math.max(enter, ratio);
      else exit = Math.min(exit, ratio);
      if (enter > exit) return null;
    }
    return { enter, exit };
  }

  function lineOfSightBlocked(source, target, obstacle) {
    const interval = segmentRectangleInterval(source, target, obstacle);
    if (!interval) return false;
    const sourceZ = finiteNumber(source.z);
    const targetZ = finiteNumber(target.z);
    const zAtEnter = sourceZ + (targetZ - sourceZ) * interval.enter;
    const zAtExit = sourceZ + (targetZ - sourceZ) * interval.exit;
    const sightBottom = Math.min(zAtEnter, zAtExit);
    const sightTop = Math.max(zAtEnter, zAtExit);
    const obstacleBottom = finiteNumber(obstacle.bottom, 0);
    const obstacleTop = finiteNumber(obstacle.top, 0);
    return sightTop >= obstacleBottom && sightBottom <= obstacleTop;
  }

  function facingSideContainsPoint(item, side, point) {
    const center = rectangleCenter(item);
    if (side === "top") return finiteNumber(point.y) <= center.y;
    if (side === "bottom") return finiteNumber(point.y) >= center.y;
    if (side === "left") return finiteNumber(point.x) <= center.x;
    if (side === "right") return finiteNumber(point.x) >= center.x;
    return false;
  }

  function expandRectangle(rectangle, margin) {
    const value = Math.max(0, finiteNumber(margin));
    return {
      x: finiteNumber(rectangle.x) - value,
      y: finiteNumber(rectangle.y) - value,
      width: finiteNumber(rectangle.width) + value * 2,
      depth: finiteNumber(rectangle.depth) + value * 2
    };
  }

  function findGridPath(options) {
    const booth = options?.booth || {};
    const width = Math.max(1, finiteNumber(booth.width, 1));
    const depth = Math.max(1, finiteNumber(booth.depth, 1));
    const cellSize = Math.max(10, Math.round(finiteNumber(options?.cellSize, 100)));
    const clearanceMm = Math.max(0, finiteNumber(options?.clearanceMm, 800));
    const radius = clearanceMm / 2;
    const columns = Math.max(1, Math.floor(width / cellSize));
    const rows = Math.max(1, Math.floor(depth / cellSize));
    const obstacles = (options?.obstacles || []).map((obstacle) => expandRectangle(obstacle, radius));
    const cellPoint = (index) => {
      const column = index % columns;
      const row = Math.floor(index / columns);
      return { x: Math.min(width - radius, Math.max(radius, (column + 0.5) * cellSize)), y: Math.min(depth - radius, Math.max(radius, (row + 0.5) * cellSize)) };
    };
    const isOpen = (index) => {
      const point = cellPoint(index);
      if (point.x < radius || point.x > width - radius || point.y < radius || point.y > depth - radius) return false;
      return !obstacles.some((obstacle) => pointInsideRectangle(point, obstacle));
    };
    const nearestOpenIndex = (point) => {
      let bestIndex = -1;
      let bestDistance = Infinity;
      // Grid rounding may move the representative point by at most one cell.
      // Do not jump across an obstructed approach area and report a false route.
      const maximumDistance = cellSize;
      for (let index = 0; index < columns * rows; index += 1) {
        if (!isOpen(index)) continue;
        const candidate = cellPoint(index);
        const distance = Math.hypot(candidate.x - finiteNumber(point.x), candidate.y - finiteNumber(point.y));
        if (distance < bestDistance) {
          bestIndex = index;
          bestDistance = distance;
        }
      }
      return bestDistance <= maximumDistance ? bestIndex : -1;
    };
    const startIndex = nearestOpenIndex(options?.start || { x: 0, y: 0 });
    const endIndex = nearestOpenIndex(options?.end || { x: width, y: depth });
    if (startIndex < 0 || endIndex < 0) return { found: false, points: [], lengthMm: null, visitedCells: 0, cellSize, clearanceMm };
    const queue = [startIndex];
    const previous = new Int32Array(columns * rows);
    previous.fill(-2);
    previous[startIndex] = -1;
    let cursor = 0;
    while (cursor < queue.length && previous[endIndex] === -2) {
      const current = queue[cursor++];
      const column = current % columns;
      const row = Math.floor(current / columns);
      const neighbours = [];
      if (column > 0) neighbours.push(current - 1);
      if (column + 1 < columns) neighbours.push(current + 1);
      if (row > 0) neighbours.push(current - columns);
      if (row + 1 < rows) neighbours.push(current + columns);
      neighbours.forEach((next) => {
        if (previous[next] !== -2 || !isOpen(next)) return;
        previous[next] = current;
        queue.push(next);
      });
    }
    if (previous[endIndex] === -2) return { found: false, points: [], lengthMm: null, visitedCells: queue.length, cellSize, clearanceMm };
    const reversed = [];
    for (let index = endIndex; index >= 0; index = previous[index]) reversed.push(cellPoint(index));
    const points = reversed.reverse();
    return { found: true, points, lengthMm: Math.max(0, points.length - 1) * cellSize, visitedCells: queue.length, cellSize, clearanceMm };
  }

  function analyzeOrthogonalSpace(options) {
    const booth = options?.booth || {};
    const width = Math.max(1, finiteNumber(booth.width, 1));
    const depth = Math.max(1, finiteNumber(booth.depth, 1));
    const clipRectangle = (source, index, prefix) => {
      const sourceX = finiteNumber(source?.x);
      const sourceY = finiteNumber(source?.y);
      const sourceWidth = Math.max(0, finiteNumber(source?.width));
      const sourceDepth = Math.max(0, finiteNumber(source?.depth));
      const x1 = Math.max(0, Math.min(width, sourceX));
      const y1 = Math.max(0, Math.min(depth, sourceY));
      const x2 = Math.max(0, Math.min(width, sourceX + sourceWidth));
      const y2 = Math.max(0, Math.min(depth, sourceY + sourceDepth));
      if (x2 <= x1 || y2 <= y1) return null;
      return { id: String(source?.id || `${prefix}-${index + 1}`), x1, y1, x2, y2 };
    };
    const obstacles = (options?.obstacles || []).map((item, index) => clipRectangle(item, index, "obstacle")).filter(Boolean);
    const zones = (options?.zones || []).map((item, index) => clipRectangle(item, index, "zone")).filter(Boolean);
    const xCoordinates = new Set([0, width]);
    const yCoordinates = new Set([0, depth]);
    [...obstacles, ...zones].forEach((rectangle) => {
      xCoordinates.add(rectangle.x1);
      xCoordinates.add(rectangle.x2);
      yCoordinates.add(rectangle.y1);
      yCoordinates.add(rectangle.y2);
    });
    const xs = [...xCoordinates].sort((a, b) => a - b);
    const ys = [...yCoordinates].sort((a, b) => a - b);
    const columns = xs.length - 1;
    const rows = ys.length - 1;
    const cells = [];
    for (let row = 0; row < rows; row += 1) {
      for (let column = 0; column < columns; column += 1) {
        const x = xs[column];
        const y = ys[row];
        const cellWidth = xs[column + 1] - x;
        const cellDepth = ys[row + 1] - y;
        const center = { x: x + cellWidth / 2, y: y + cellDepth / 2 };
        const occupied = obstacles.some((rectangle) => center.x > rectangle.x1 && center.x < rectangle.x2 && center.y > rectangle.y1 && center.y < rectangle.y2);
        const zoneIds = zones.filter((rectangle) => center.x > rectangle.x1 && center.x < rectangle.x2 && center.y > rectangle.y1 && center.y < rectangle.y2).map((rectangle) => rectangle.id);
        cells.push({ x, y, width: cellWidth, depth: cellDepth, areaMm2: cellWidth * cellDepth, occupied, reachable: false, zoneIds });
      }
    }
    const entrySide = ["top", "right", "bottom", "left"].includes(options?.entrySide) ? options.entrySide : null;
    const entryPoints = Array.isArray(options?.entryPoints) ? options.entryPoints : [];
    const isBoundarySeed = (cell) => entrySide === "top" ? cell.y === 0
      : entrySide === "bottom" ? cell.y + cell.depth === depth
        : entrySide === "left" ? cell.x === 0
          : entrySide === "right" ? cell.x + cell.width === width
            : false;
    const pointSeedsCell = (cell) => entryPoints.some((point) => {
      const x = finiteNumber(point?.x, -1);
      const y = finiteNumber(point?.y, -1);
      return x >= cell.x && x <= cell.x + cell.width && y >= cell.y && y <= cell.y + cell.depth;
    });
    const queue = [];
    cells.forEach((cell, index) => {
      if (!cell.occupied && (isBoundarySeed(cell) || pointSeedsCell(cell))) {
        cell.reachable = true;
        queue.push(index);
      }
    });
    let cursor = 0;
    while (cursor < queue.length) {
      const currentIndex = queue[cursor++];
      const column = currentIndex % columns;
      const row = Math.floor(currentIndex / columns);
      const neighbours = [];
      if (column > 0) neighbours.push(currentIndex - 1);
      if (column + 1 < columns) neighbours.push(currentIndex + 1);
      if (row > 0) neighbours.push(currentIndex - columns);
      if (row + 1 < rows) neighbours.push(currentIndex + columns);
      neighbours.forEach((nextIndex) => {
        const next = cells[nextIndex];
        if (next.occupied || next.reachable) return;
        next.reachable = true;
        queue.push(nextIndex);
      });
    }
    const occupiedAreaMm2 = cells.filter((cell) => cell.occupied).reduce((sum, cell) => sum + cell.areaMm2, 0);
    const reachableAreaMm2 = cells.filter((cell) => !cell.occupied && cell.reachable).reduce((sum, cell) => sum + cell.areaMm2, 0);
    const freeAreaMm2 = width * depth - occupiedAreaMm2;
    const zoneSummaries = zones.map((zone) => {
      const zoneCells = cells.filter((cell) => cell.zoneIds.includes(zone.id));
      const areaMm2 = zoneCells.reduce((sum, cell) => sum + cell.areaMm2, 0);
      const occupiedMm2 = zoneCells.filter((cell) => cell.occupied).reduce((sum, cell) => sum + cell.areaMm2, 0);
      const reachableMm2 = zoneCells.filter((cell) => !cell.occupied && cell.reachable).reduce((sum, cell) => sum + cell.areaMm2, 0);
      return { id: zone.id, areaMm2, occupiedMm2, freeMm2: areaMm2 - occupiedMm2, reachableMm2, deadMm2: areaMm2 - occupiedMm2 - reachableMm2 };
    });
    return {
      boothAreaMm2: width * depth,
      occupiedAreaMm2,
      freeAreaMm2,
      reachableAreaMm2,
      deadAreaMm2: freeAreaMm2 - reachableAreaMm2,
      cells,
      zones: zoneSummaries
    };
  }

  function calculateInventoryCapacity(options) {
    const source = options || {};
    const values = {
      zoneWidthMm: Math.max(0, finiteNumber(source.zoneWidthMm, 0)),
      zoneDepthMm: Math.max(0, finiteNumber(source.zoneDepthMm, 0)),
      totalUnits: Math.max(0, Math.ceil(finiteNumber(source.totalUnits, 0))),
      unitsPerCarton: Math.max(0, Math.ceil(finiteNumber(source.unitsPerCarton, 0))),
      replenishmentCount: Math.max(0, Math.floor(finiteNumber(source.replenishmentCount, 0))),
      cartonWidthMm: Math.max(0, finiteNumber(source.cartonWidthMm, 0)),
      cartonDepthMm: Math.max(0, finiteNumber(source.cartonDepthMm, 0)),
      cartonHeightMm: Math.max(0, finiteNumber(source.cartonHeightMm, 0)),
      maxStackHeightMm: Math.max(0, finiteNumber(source.maxStackHeightMm, 0))
    };
    const requiredPositive = [
      "zoneWidthMm", "zoneDepthMm", "totalUnits", "unitsPerCarton",
      "cartonWidthMm", "cartonDepthMm", "cartonHeightMm", "maxStackHeightMm"
    ];
    const missingFields = requiredPositive.filter((key) => !(values[key] > 0));
    if (missingFields.length) {
      return {
        ...values,
        complete: false,
        missingFields,
        totalCartons: null,
        peakCartons: null,
        cartonsPerLayer: null,
        layers: null,
        capacityCartons: null,
        capacityUnits: null,
        shortageCartons: null,
        shortageUnits: null,
        utilizationRatio: null,
        orientation: null
      };
    }

    const orientations = [
      {
        name: "normal",
        cartonWidthMm: values.cartonWidthMm,
        cartonDepthMm: values.cartonDepthMm,
        columns: Math.floor(values.zoneWidthMm / values.cartonWidthMm),
        rows: Math.floor(values.zoneDepthMm / values.cartonDepthMm)
      },
      {
        name: "rotated",
        cartonWidthMm: values.cartonDepthMm,
        cartonDepthMm: values.cartonWidthMm,
        columns: Math.floor(values.zoneWidthMm / values.cartonDepthMm),
        rows: Math.floor(values.zoneDepthMm / values.cartonWidthMm)
      }
    ].map((entry) => ({ ...entry, cartonsPerLayer: entry.columns * entry.rows }));
    const orientation = orientations.sort((a, b) => b.cartonsPerLayer - a.cartonsPerLayer)[0];
    const layers = Math.floor(values.maxStackHeightMm / values.cartonHeightMm);
    const capacityCartons = orientation.cartonsPerLayer * layers;
    const totalCartons = Math.ceil(values.totalUnits / values.unitsPerCarton);
    const peakCartons = Math.ceil(totalCartons / (values.replenishmentCount + 1));
    const peakUnits = Math.ceil(values.totalUnits / (values.replenishmentCount + 1));
    const capacityUnits = capacityCartons * values.unitsPerCarton;
    const shortageCartons = Math.max(0, peakCartons - capacityCartons);
    const shortageUnits = Math.max(0, peakUnits - capacityUnits);
    return {
      ...values,
      complete: true,
      missingFields: [],
      totalCartons,
      peakCartons,
      peakUnits,
      cartonsPerLayer: orientation.cartonsPerLayer,
      layers,
      capacityCartons,
      capacityUnits,
      shortageCartons,
      shortageUnits,
      utilizationRatio: capacityCartons > 0 ? peakCartons / capacityCartons : null,
      orientation
    };
  }

  function createProjectDocument(state) {
    return {
      schema: PROJECT_SCHEMA,
      version: PROJECT_VERSION,
      units: "mm",
      savedAt: new Date().toISOString(),
      state: JSON.parse(JSON.stringify(state))
    };
  }

  function parseProjectDocument(input) {
    const value = typeof input === "string" ? JSON.parse(input) : input;
    if (!value || typeof value !== "object") throw new Error("PROJECT_INVALID");
    if (value.schema === PROJECT_SCHEMA) {
      if (!value.state || typeof value.state !== "object") throw new Error("PROJECT_STATE_MISSING");
      return { state: value.state, version: finiteNumber(value.version, 1), legacy: false };
    }
    if (value.booth && Array.isArray(value.items)) {
      return { state: value, version: 1, legacy: true };
    }
    throw new Error("PROJECT_SCHEMA_UNSUPPORTED");
  }

  return Object.freeze({
    PROJECT_SCHEMA,
    PROJECT_VERSION,
    VALID_GRID_SIZES,
    VALID_OPERATION_MODES,
    finiteNumber,
    normalizeRotationDegrees,
    sanitizeGridSize,
    normalizeOperationMode,
    isActiveInOperationMode,
    snapMm,
    rectanglesOverlap,
    rectangleDistance,
    wallClearances,
    isOutOfBounds,
    rectangleCenter,
    calculateSupportPlacement,
    orthogonalRoute,
    polylineLength,
    segmentIntersectsRectangle,
    routeIntersectsRectangle,
    segmentRectangleInterval,
    lineOfSightBlocked,
    facingSideContainsPoint,
    expandRectangle,
    findGridPath,
    analyzeOrthogonalSpace,
    calculateInventoryCapacity,
    createProjectDocument,
    parseProjectDocument
  });
});
