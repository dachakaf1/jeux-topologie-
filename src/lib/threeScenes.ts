import * as THREE from "three";
import type { SceneConfig, SceneKind } from "./sceneConfig";

const C = {
  cyan: 0x70e4dd,
  violet: 0xb39aff,
  gold: 0xf4c877,
  rose: 0xf78ba8,
  white: 0xf4f7ff,
  dim: 0x657493,
};

type Tracked = { material: THREE.Material; opacity: number; parts: string[]; required?: string };
type Tick = (time: number, delta: number, focus: string[]) => void;

export type BuiltScene = {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  update: (time: number, delta: number, focus: string[]) => void;
  dispose: () => void;
};

/** Each illustration is a concrete example, not a replacement for the general proof. */
export function buildScene(kind: SceneKind, labels?: Pick<SceneConfig, "pointLabels" | "regionLabels">): BuiltScene {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(39, 1.4, 0.1, 100);
  camera.position.set(kind === "subspace" ? 3.5 : 0, kind === "subspace" ? 3.2 : 1.1, 6.6);
  camera.lookAt(0, 0, 0);

  scene.add(new THREE.AmbientLight(0xffffff, 1.5));
  const light = new THREE.PointLight(0xb6b3ff, 32, 30);
  light.position.set(3, 5, 6);
  scene.add(light);
  const warmLight = new THREE.PointLight(0xffd38a, 18, 20);
  warmLight.position.set(-4, 1, 4);
  scene.add(warmLight);

  const tracked: Tracked[] = [];
  const ticks: Tick[] = [];
  const root = new THREE.Group();
  root.name = "concept-model";
  scene.add(root);

  function track<T extends THREE.Object3D>(object: T, ...parts: string[]): T {
    object.traverse((child) => {
      const withMaterial = child as THREE.Object3D & { material?: THREE.Material | THREE.Material[] };
      const materials = withMaterial.material ? (Array.isArray(withMaterial.material) ? withMaterial.material : [withMaterial.material]) : [];
      materials.forEach((material) => {
        material.transparent = true;
        tracked.push({ material, opacity: material.opacity, parts });
      });
    });
    return object;
  }

  function trackOptional<T extends THREE.Object3D>(object: T, required: string, ...parts: string[]): T {
    const start = tracked.length;
    track(object, ...parts);
    tracked.slice(start).forEach((item) => { item.required = required; item.material.opacity = 0; });
    return object;
  }

  function line(points: THREE.Vector3[], color: number, opacity: number, closed = false, dashed = false) {
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = dashed
      ? new THREE.LineDashedMaterial({ color, transparent: true, opacity, dashSize: 0.09, gapSize: 0.07, depthWrite: false })
      : new THREE.LineBasicMaterial({ color, transparent: true, opacity, depthWrite: false });
    const result = closed ? new THREE.LineLoop(geometry, material) : new THREE.Line(geometry, material);
    if (dashed) result.computeLineDistances();
    return result;
  }

  function circle(radius: number, color: number, opacity = 0.8, dashed = false) {
    const points = Array.from({ length: 96 }, (_, i) => {
      const angle = (i / 96) * Math.PI * 2;
      return new THREE.Vector3(Math.cos(angle) * radius, Math.sin(angle) * radius, 0);
    });
    return line(points, color, opacity, true, dashed);
  }

  function disk(radius: number, color: number, opacity: number) {
    return new THREE.Mesh(
      new THREE.CircleGeometry(radius, 64),
      new THREE.MeshBasicMaterial({ color, transparent: true, opacity, side: THREE.DoubleSide, depthWrite: false }),
    );
  }

  function label(text: string, color: string, scale = 1) {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 128;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.font = "600 72px Georgia, serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = color;
      ctx.shadowColor = color;
      ctx.shadowBlur = 8;
      ctx.fillText(text, 256, 64);
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, transparent: true, depthWrite: false, opacity: 0.95 }));
    sprite.scale.set(1.7 * scale, 0.55 * scale, 1);
    return sprite;
  }

  function point(x: number, y: number, z: number, color = C.gold, radius = 0.07) {
    const group = new THREE.Group();
    const core = new THREE.Mesh(
      new THREE.SphereGeometry(radius, 20, 14),
      new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 0.4, roughness: 0.35, transparent: true, opacity: 1 }),
    );
    const halo = new THREE.Mesh(
      new THREE.SphereGeometry(radius * 2.1, 16, 12),
      new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.1, depthWrite: false }),
    );
    group.add(core, halo);
    group.position.set(x, y, z);
    return group;
  }

  function bubble(radius: number, color: number, opacity = 0.12) {
    const group = new THREE.Group();
    const fill = new THREE.Mesh(
      new THREE.SphereGeometry(radius, 28, 20),
      new THREE.MeshBasicMaterial({ color, transparent: true, opacity, side: THREE.DoubleSide, depthWrite: false }),
    );
    group.add(fill);
    for (let j = 0; j < 5; j++) {
      const angle = (j / 5) * Math.PI;
      const points = Array.from({ length: 64 }, (_, i) => {
        const a = (i / 64) * Math.PI * 2;
        return new THREE.Vector3(Math.sin(a) * Math.cos(angle) * radius, Math.cos(a) * radius, Math.sin(a) * Math.sin(angle) * radius);
      });
      group.add(line(points, color, 0.42, true));
    }
    for (let j = -2; j <= 2; j++) {
      const latitude = j * 0.39;
      const points = Array.from({ length: 64 }, (_, i) => {
        const a = (i / 64) * Math.PI * 2;
        return new THREE.Vector3(Math.cos(a) * Math.cos(latitude) * radius, Math.sin(latitude) * radius, Math.sin(a) * Math.cos(latitude) * radius);
      });
      group.add(line(points, color, 0.32, true));
    }
    return group;
  }

  function namedPoint(text: string, x: number, y: number, z = 0, color = C.gold, parts = ["point"]) {
    const p = point(x, y, z, color);
    const l = label(text, "#f8e5b9", 0.75);
    l.position.set(x + 0.23, y + 0.28, z + 0.1);
    root.add(track(p, ...parts), track(l, ...parts));
  }

  function addStars() {
    const positions: number[] = [];
    for (let i = 0; i < 90; i++) {
      positions.push((Math.random() - 0.5) * 12, (Math.random() - 0.5) * 8, -2 - Math.random() * 3);
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    const stars = new THREE.Points(geometry, new THREE.PointsMaterial({ color: 0xa6b6dc, size: 0.018, transparent: true, opacity: 0.52, depthWrite: false }));
    scene.add(stars);
  }
  addStars();

  if (kind === "cover" || kind === "finite") {
    const region = disk(1.65, C.violet, 0.09);
    region.scale.set(1.22, 0.82, 1);
    region.position.z = -0.22;
    const outline = circle(1.65, C.violet, 0.55, true);
    outline.scale.copy(region.scale);
    outline.position.z = -0.19;
    root.add(track(region, "region"), track(outline, "region"));
    const name = label(kind === "cover" ? "A" : "E", "#d4c8ff", 0.8);
    name.position.set(-1.52, 1.05, 0);
    root.add(track(name, "region"));
    const positions = [[-0.95, 0.35], [0, -0.44], [0.95, 0.35]];
    const littleBalls: THREE.Group[] = [];
    positions.forEach(([x, y], i) => {
      const open = bubble(0.37, i % 2 ? C.violet : C.cyan, 0.09);
      open.position.set(x, y, 0.1);
      littleBalls.push(open);
      root.add(track(open, "open", `open-${i}`));
      namedPoint(["a", "b", "c"][i], x, y, 0.1, C.gold, ["point", "open", `point-${i}`]);
    });
    if (kind === "cover") {
      namedPoint("d", -2.35, -0.7, -0.1, C.dim, ["outside"]);
      namedPoint("e", 2.35, -0.7, -0.1, C.dim, ["outside"]);
    }
    ticks.push((time) => littleBalls.forEach((item, i) => item.scale.setScalar(1 + 0.035 * Math.sin(time * 1.3 + i))));
  }

  if (kind === "complement") {
    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(4.6, 3.3),
      new THREE.MeshBasicMaterial({ color: C.cyan, transparent: true, opacity: 0.07, side: THREE.DoubleSide, depthWrite: false }),
    );
    plane.position.z = -0.14;
    const disc = disk(1.05, C.violet, 0.35);
    const edge = circle(1.05, C.gold, 0.95);
    edge.position.z = 0.02;
    root.add(track(plane, "outside"), track(disc, "inside"), track(edge, "inside", "border"));
    const f = label("F", "#e9dbff"); f.position.set(0, 0.2, 0.15);
    const fc = label("Fᶜ", "#a2f3ed"); fc.position.set(1.68, 0.84, 0.1);
    root.add(track(f, "inside"), track(fc, "outside"));
    namedPoint("x", 0.25, -0.28, 0.08, C.gold, ["inside"]);
  }

  if (kind === "shrinking") {
    const balls: THREE.Group[] = [];
    [1.52, 1.19, 0.9, 0.63, 0.37].forEach((radius, i) => {
      const shell = bubble(radius, i % 2 ? C.cyan : C.violet, 0.035);
      balls.push(shell);
      root.add(track(shell, "open"));
    });
    namedPoint("0", 0, 0, 0, C.gold, ["point"]);
    ticks.push((time) => balls.forEach((b, i) => b.scale.setScalar(1 + 0.025 * Math.sin(time * 1.1 + i * 0.5))));
  }

  if (kind === "neighborhood" || kind === "basis") {
    const outer = bubble(1.48, C.violet, 0.07);
    root.add(track(outer, "outer"));
    const outerLabel = label(labels?.regionLabels?.[0] ?? "V", "#d6c7ff", 0.85); outerLabel.position.set(1.48, 1.1, 0);
    root.add(track(outerLabel, "outer"));
    const inner: THREE.Group[] = [];
    const radii = kind === "basis" ? [1.03, 0.76, 0.5, 0.28] : [0.72];
    radii.forEach((r, i) => {
      const b = bubble(r, i % 2 ? C.violet : C.cyan, 0.06);
      inner.push(b);
      root.add(track(b, "inner"));
    });
    const innerLabel = label(labels?.regionLabels?.[1] ?? (kind === "basis" ? "b" : "W"), "#b4fff9", 0.8);
    innerLabel.position.set(0.58, 0.48, 0.25);
    root.add(track(innerLabel, "inner"));
    namedPoint("x", 0, 0, 0.12, C.gold, ["point"]);
    ticks.push((time) => inner.forEach((b, i) => b.scale.setScalar(1 + 0.025 * Math.sin(time * 1.3 + i))));
  }

  if (kind === "separation") {
    const left = bubble(0.73, C.cyan, 0.11); left.position.x = -1.15;
    const right = bubble(0.73, C.rose, 0.11); right.position.x = 1.15;
    root.add(track(left, "left"), track(right, "right"));
    namedPoint(labels?.pointLabels?.[0] ?? "x", -1.15, 0, 0.12, C.gold, ["point", "left"]);
    namedPoint(labels?.pointLabels?.[1] ?? "y", 1.15, 0, 0.12, C.gold, ["point", "right"]);
    const ul = label(labels?.regionLabels?.[0] ?? "U", "#a6fff4", 0.85); ul.position.set(-1.58, 0.85, 0);
    const vl = label(labels?.regionLabels?.[1] ?? "V", "#ffc3d1", 0.85); vl.position.set(1.58, 0.85, 0);
    root.add(track(ul, "left"), track(vl, "right"));
    ticks.push((time) => {
      const scale = 1 + 0.035 * Math.sin(time * 1.1);
      left.scale.setScalar(scale); right.scale.setScalar(scale);
    });
  }

  if (kind === "boundary") {
    const outside = disk(2.55, C.violet, 0.035); outside.scale.set(1.08, 0.67, 1); outside.position.z = -0.17;
    const inside = disk(1.12, C.cyan, 0.25);
    const rim = circle(1.12, C.gold, 0.95, true); rim.position.z = 0.04;
    root.add(track(outside, "outside"), track(inside, "interior", "closure", "accumulation"), track(rim, "boundary", "closure", "accumulation"));
    namedPoint("p", 1.96, 0.48, 0.1, C.rose, ["isolated", "boundary", "closure"]);
    const halo = circle(0.22, C.rose, 0.55, true); halo.position.set(1.96, 0.48, 0.05);
    root.add(track(halo, "isolated"));
    const l = label("A°", "#9af8ee", 0.85); l.position.set(0, 0.1, 0.1);
    const b = label("∂A", "#ffe0a5", 0.75); b.position.set(-1.25, 0.96, 0.1);
    root.add(track(l, "interior", "closure", "accumulation"), track(b, "boundary"));
    const local = new THREE.Group();
    local.position.set(-0.32, 0.22, 0.15);
    local.add(disk(0.3, C.violet, 0.36), circle(0.3, C.violet, 0.9, true), point(0, 0, 0.03, C.gold, 0.045));
    root.add(trackOptional(local, "local", "local"));
    const subsetOpen = new THREE.Group();
    subsetOpen.position.set(0.35, -0.25, 0.16);
    subsetOpen.add(disk(0.26, C.violet, 0.36), circle(0.26, C.violet, 0.9, true));
    root.add(trackOptional(subsetOpen, "subset-open", "subset-open"));
    ticks.push((time) => { halo.scale.setScalar(1 + 0.07 * Math.sin(time * 1.7)); });
  }

  if (kind === "subspace") {
    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(4.25, 3.2),
      new THREE.MeshBasicMaterial({ color: C.violet, transparent: true, opacity: 0.16, side: THREE.DoubleSide, depthWrite: false }),
    );
    plane.rotation.x = -Math.PI / 2;
    const grid = new THREE.GridHelper(4.2, 10, C.violet, C.violet);
    (grid.material as THREE.Material).transparent = true;
    (grid.material as THREE.Material).opacity = 0.25;
    const sphere = bubble(1.22, C.gold, 0.045);
    const intersection = disk(1.21, C.cyan, 0.3);
    intersection.rotation.x = -Math.PI / 2;
    intersection.position.y = 0.015;
    const intersectionEdge = circle(1.21, C.cyan, 0.9, true);
    intersectionEdge.rotation.x = -Math.PI / 2;
    intersectionEdge.position.y = 0.03;
    root.add(track(plane, "plane"), track(grid, "plane"), track(sphere, "sphere"), track(intersection, "intersection"), track(intersectionEdge, "intersection"));
    const a = label("A", "#d6c7ff", 0.8); a.position.set(-1.9, 0.15, 1);
    const o = label("O", "#ffe0a5", 0.8); o.position.set(0.25, 1.43, 0);
    const cut = label("O ∩ A", "#a8fff6", 0.7); cut.position.set(0.15, 0.15, -0.65);
    root.add(track(a, "plane"), track(o, "sphere"), track(cut, "intersection"));
    namedPoint("a", 0.18, 0.07, 0.05, C.gold, ["intersection"]);
    ticks.push((time) => { sphere.rotation.y = Math.sin(time * 0.4) * 0.15; });
  }

  function pathBetween(start: THREE.Vector3, end: THREE.Vector3, height: number, color: number, part: string) {
    const control = start.clone().add(end).multiplyScalar(0.5).add(new THREE.Vector3(0, height, 0.45));
    const curve = new THREE.QuadraticBezierCurve3(start, control, end);
    const arc = line(curve.getPoints(50), color, 0.7, false, true);
    root.add(track(arc, part, "arrows"));
    const moving = point(start.x, start.y, start.z, color, 0.065);
    root.add(track(moving, part, "arrows"));
    return { curve, moving };
  }

  if (kind === "quotient") {
    const axis = line([new THREE.Vector3(-1.9, -1.35, 0), new THREE.Vector3(-1.9, 1.35, 0)], C.cyan, 0.85);
    root.add(track(axis, "source"));
    const start0 = new THREE.Vector3(-1.9, -0.65, 0);
    const start1 = new THREE.Vector3(-1.9, 0.65, 0);
    namedPoint("0", start0.x, start0.y, 0, C.cyan, ["source"]);
    namedPoint("1", start1.x, start1.y, 0, C.cyan, ["source"]);
    const ring = circle(0.88, C.gold, 0.95);
    ring.position.set(1.1, 0, 0);
    root.add(track(ring, "target"));
    const dest = new THREE.Vector3(1.98, 0, 0);
    namedPoint("[0] = [1]", dest.x, dest.y, dest.z, C.rose, ["class", "target"]);
    const circleLabel = label("S¹", "#ffe2a6", 0.8); circleLabel.position.set(1.08, -1.18, 0);
    root.add(track(circleLabel, "target"));
    const p0 = pathBetween(start0, dest, -0.48, C.cyan, "source");
    const p1 = pathBetween(start1, dest, 0.48, C.rose, "source");
    ticks.push((time) => {
      const phase = (time * 0.2) % 1;
      p0.moving.position.copy(p0.curve.getPoint(phase));
      p1.moving.position.copy(p1.curve.getPoint(phase));
    });
  }

  if (kind === "product") {
    const xAxis = line([new THREE.Vector3(-2, -1.2, 0), new THREE.Vector3(2, -1.2, 0)], C.cyan, 0.7);
    const yAxis = line([new THREE.Vector3(-1.9, -1.3, 0), new THREE.Vector3(-1.9, 1.5, 0)], C.rose, 0.7);
    root.add(track(xAxis, "u"), track(yAxis, "v"));
    const rect = new THREE.Mesh(
      new THREE.PlaneGeometry(1.8, 1.35),
      new THREE.MeshBasicMaterial({ color: C.gold, transparent: true, opacity: 0.2, side: THREE.DoubleSide, depthWrite: false }),
    );
    rect.position.set(0.05, 0.18, 0.02);
    const edges = line([
      new THREE.Vector3(-0.85, -0.495, 0.03), new THREE.Vector3(0.95, -0.495, 0.03),
      new THREE.Vector3(0.95, 0.855, 0.03), new THREE.Vector3(-0.85, 0.855, 0.03),
    ], C.gold, 0.85, true, true);
    root.add(track(rect, "product"), track(edges, "product"));
    const ux = line([new THREE.Vector3(-0.85, -1.2, 0.03), new THREE.Vector3(0.95, -1.2, 0.03)], C.cyan, 1);
    const vy = line([new THREE.Vector3(-1.9, -0.495, 0.03), new THREE.Vector3(-1.9, 0.855, 0.03)], C.rose, 1);
    root.add(track(ux, "u"), track(vy, "v"));
    const uLabel = label("U", "#a9fff6", 0.75); uLabel.position.set(0, -1.52, 0);
    const vLabel = label("V", "#ffc3d1", 0.75); vLabel.position.set(-2.18, 0.25, 0);
    const uvLabel = label("U × V", "#ffe3a9", 0.85); uvLabel.position.set(0, 1.16, 0);
    root.add(track(uLabel, "u"), track(vLabel, "v"), track(uvLabel, "product"));
    const pair = point(0, 0, 0.1, C.gold);
    root.add(track(pair, "product"));
    ticks.push((time) => pair.position.set(0.05 + Math.sin(time * 0.8) * 0.58, 0.18 + Math.cos(time * 0.65) * 0.42, 0.1));
  }

  if (kind === "mapping" || kind === "composition") {
    const count = kind === "mapping" ? 2 : 3;
    const xs = count === 2 ? [-1.45, 1.45] : [-1.95, 0, 1.95];
    const radius = count === 2 ? 0.76 : 0.55;
    const itemColors = [C.cyan, C.violet, C.gold];
    const names = count === 2 ? ["U", "V"] : ["E", "F", "H"];
    const namesParts = count === 2 ? ["source", "target"] : ["source", "middle", "target"];
    xs.forEach((x, i) => {
      const b = bubble(radius, itemColors[i], 0.08); b.position.x = x;
      root.add(track(b, namesParts[i]));
      const l = label(names[i], i === 0 ? "#a6fff4" : i === 1 ? "#d6c7ff" : "#ffe3a9", 0.85);
      l.position.set(x, -radius - 0.35, 0);
      root.add(track(l, namesParts[i]));
      const p = point(x, 0, 0.1, C.gold, 0.07);
      root.add(track(p, "points", namesParts[i]));
    });
    const paths: ReturnType<typeof pathBetween>[] = [];
    for (let i = 0; i < xs.length - 1; i++) {
      const start = new THREE.Vector3(xs[i] + radius * 0.65, 0, 0.1);
      const end = new THREE.Vector3(xs[i + 1] - radius * 0.65, 0, 0.1);
      paths.push(pathBetween(start, end, 0.62, C.gold, i === 0 ? "first" : "second"));
      const l = label(i === 0 ? "f" : "g", "#ffe3a9", 0.8);
      l.position.set((start.x + end.x) / 2, 0.66, 0.2);
      root.add(track(l, "arrows", i === 0 ? "first" : "second"));
    }
    ticks.push((time, _delta, focus) => paths.forEach(({ curve, moving }, i) => {
      const phase = (time * 0.28 + i * 0.5) % 1;
      moving.position.copy(curve.getPoint(focus.includes("inverse") ? 1 - phase : phase));
    }));
  }

  if (kind === "interval-disjoint" || kind === "interval-touch" || kind === "interval-adjacent") {
    const disjoint = kind === "interval-disjoint";
    const adjacent = kind === "interval-adjacent";
    const ends = disjoint ? [-1.7, -0.6, 0.6, 1.7] : [-1.7, 0, 0, 1.7];
    const axis = line([new THREE.Vector3(-2.25, 0, -0.1), new THREE.Vector3(2.25, 0, -0.1)], C.dim, 0.6);
    root.add(axis);
    function segment(from: number, to: number, color: number, part: string) {
      const mesh = new THREE.Mesh(
        new THREE.CylinderGeometry(0.035, 0.035, to - from, 16),
        new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 0.25, transparent: true, opacity: 0.95 }),
      );
      mesh.rotation.z = Math.PI / 2;
      mesh.position.set((from + to) / 2, 0, 0);
      root.add(track(mesh, part));
    }
    function endpoint(x: number, color: number, filled: boolean, part: string) {
      if (filled) {
        root.add(track(point(x, 0, 0.03, color, 0.07), part));
      } else {
        const ring = circle(0.085, color, 0.95);
        ring.position.set(x, 0, 0.04);
        root.add(track(ring, part));
      }
    }
    segment(ends[0], ends[1], C.cyan, "first");
    segment(ends[2], ends[3], C.violet, "second");
    endpoint(ends[0], C.cyan, adjacent, "first");
    endpoint(ends[1], C.cyan, adjacent, adjacent ? "center" : "first");
    if (disjoint) endpoint(ends[2], C.violet, false, "second");
    endpoint(ends[3], C.violet, adjacent, "second");
    const values = disjoint ? [[ends[0], "0"], [ends[1], "1"], [ends[2], "2"], [ends[3], "3"]] : [[ends[0], adjacent ? "0" : "−1"], [0, adjacent ? "1" : "0"], [ends[3], adjacent ? "2" : "1"]];
    values.forEach(([x, text]) => {
      const l = label(String(text), "#b4c0d4", 0.7);
      l.position.set(Number(x), -0.35, 0);
      root.add(l);
    });
    const aLabel = label("A", "#a4f7ed", 0.8); aLabel.position.set((ends[0] + ends[1]) / 2, 0.42, 0);
    const bLabel = label("B", "#d8c9ff", 0.8); bLabel.position.set((ends[2] + ends[3]) / 2, 0.42, 0);
    root.add(track(aLabel, "first"), track(bLabel, "second"));
    if (disjoint) {
      const missing = point(0, 0, 0.03, C.gold, 0.07);
      const l = label("1,5 ∉ A ∪ B", "#ffe1a4", 0.75); l.position.set(0, 0.72, 0);
      root.add(track(missing, "gap"), track(l, "gap"));
    } else if (!adjacent) {
      root.add(trackOptional(point(0, 0, 0.08, C.gold, 0.09), "closure", "closure"));
    } else {
      const hollow = circle(0.12, C.gold, 1); hollow.position.set(0, 0, 0.09);
      root.add(trackOptional(hollow, "missing", "missing"));
    }
  }

  if (kind === "finite-chain") {
    const region = circle(1.85, C.dim, 0.5, true); region.scale.set(1.15, 0.58, 1);
    root.add(track(region, "region"));
    const openA = bubble(0.42, C.cyan, 0.08); openA.position.set(-1.15, 0, 0.1);
    const openAB = bubble(0.72, C.violet, 0.07); openAB.scale.set(1.65, 0.72, 0.7); openAB.position.set(-0.57, 0, -0.05);
    root.add(track(openA, "open-a"), track(openAB, "open-ab"));
    const openB = bubble(0.38, C.cyan, 0.08); openB.position.set(0, 0, 0.1);
    root.add(trackOptional(openB, "open-b", "open-b"));
    const candidate = bubble(0.72, C.gold, 0.04); candidate.scale.set(1.65, 0.72, 0.7); candidate.position.set(-0.57, 0, -0.04);
    root.add(trackOptional(candidate, "candidate", "candidate"));
    const closedBC = bubble(0.72, C.gold, 0.07); closedBC.scale.set(1.65, 0.72, 0.7); closedBC.position.set(0.57, 0, 0.04);
    root.add(trackOptional(closedBC, "closed-bc", "closed-bc"));
    namedPoint("a", -1.15, 0, 0.18, C.gold, ["point-a"]);
    namedPoint("b", 0, 0, 0.18, C.gold, ["point-b"]);
    namedPoint("c", 1.15, 0, 0.18, C.gold, ["point-c"]);
    const e = label("E", "#cbd4e9", 0.8); e.position.set(-1.9, 0.95, 0);
    root.add(track(e, "region"));
  }

  if (kind === "dense") {
    const axis = line([new THREE.Vector3(-2.2, 0, 0), new THREE.Vector3(2.2, 0, 0)], C.dim, 0.65);
    root.add(axis);
    namedPoint("x", 0, 0, 0.14, C.gold, ["point"]);
    const rational: THREE.Group[] = [];
    const irrational: THREE.Group[] = [];
    [1.65, 1.05, 0.55, 0.26].forEach((distance, i) => {
      const q = point(-distance, 0.38, 0.05, C.cyan, 0.055);
      const r = point(distance, -0.38, 0.05, C.violet, 0.055);
      rational.push(q); irrational.push(r);
      root.add(track(q, "rational"), track(r, "irrational"));
      const guideQ = line([new THREE.Vector3(-distance, 0.38, 0), new THREE.Vector3(-distance, 0, 0)], C.cyan, 0.35, false, true);
      const guideR = line([new THREE.Vector3(distance, -0.38, 0), new THREE.Vector3(distance, 0, 0)], C.violet, 0.35, false, true);
      root.add(track(guideQ, "rational"), track(guideR, "irrational"));
      q.userData.base = -distance;
      r.userData.base = distance;
      q.userData.phase = i;
      r.userData.phase = i;
    });
    const qLabel = label("ℚ", "#a7fff6", 0.9); qLabel.position.set(-1.25, 0.83, 0);
    const rLabel = label("ℝ ∖ ℚ", "#d8c9ff", 0.8); rLabel.position.set(1.25, -0.84, 0);
    root.add(track(qLabel, "rational"), track(rLabel, "irrational"));
    ticks.push((time) => {
      rational.forEach((p) => { p.position.z = 0.05 + 0.04 * Math.sin(time + p.userData.phase); });
      irrational.forEach((p) => { p.position.z = 0.05 + 0.04 * Math.cos(time + p.userData.phase); });
    });
  }

  if (kind === "set-union") {
    const a = bubble(0.93, C.cyan, 0.12); a.position.x = -0.55;
    const b = bubble(0.93, C.violet, 0.12); b.position.x = 0.55;
    root.add(track(a, "first"), track(b, "second"));
    const closeA = bubble(0.94, C.gold, 0.015); closeA.position.x = -0.55;
    const closeB = bubble(0.94, C.gold, 0.015); closeB.position.x = 0.55;
    root.add(track(closeA, "closures"), track(closeB, "closures"));
    const al = label("A", "#b0fff6", 0.8); al.position.set(-0.95, -1.2, 0);
    const bl = label("B", "#d9caff", 0.8); bl.position.set(0.95, -1.2, 0);
    root.add(track(al, "first"), track(bl, "second"));
    ticks.push((time) => { a.rotation.y = time * 0.08; b.rotation.y = -time * 0.08; });
  }

  if (kind === "characteristic") {
    const a = bubble(0.73, C.cyan, 0.07); a.scale.set(0.6, 1.4, 0.7); a.position.set(-1.4, 0.55, 0);
    const ac = bubble(0.48, C.violet, 0.07); ac.position.set(-1.4, -0.95, 0);
    root.add(track(a, "first"), track(ac, "second"));
    const source = [new THREE.Vector3(-1.4, 0.85, 0), new THREE.Vector3(-1.4, 0.15, 0), new THREE.Vector3(-1.4, -0.95, 0)];
    source.forEach((p, i) => namedPoint(["a", "b", "c"][i], p.x, p.y, p.z, C.gold, [i === 2 ? "second" : "first"]));
    const one = new THREE.Vector3(1.45, 0.65, 0);
    const zero = new THREE.Vector3(1.45, -0.65, 0);
    namedPoint("1", one.x, one.y, 0, C.gold, ["one"]);
    namedPoint("0", zero.x, zero.y, 0, C.gold, ["zero"]);
    const paths = [
      pathBetween(source[0], one, 0.55, C.cyan, "first"),
      pathBetween(source[1], one, -0.2, C.cyan, "first"),
      pathBetween(source[2], zero, -0.45, C.violet, "second"),
    ];
    ticks.push((time, _delta, focus) => paths.forEach(({ curve, moving }, i) => {
      const phase = (time * 0.25 + i * 0.26) % 1;
      moving.position.copy(curve.getPoint(focus.includes("inverse") ? 1 - phase : phase));
    }));
  }

  if (kind === "torus") {
    const torus = new THREE.Group();
    const surface = new THREE.Mesh(
      new THREE.TorusGeometry(1.15, 0.42, 32, 96),
      new THREE.MeshStandardMaterial({ color: 0x654998, emissive: 0x30204c, emissiveIntensity: 0.35, metalness: 0.5, roughness: 0.38, transparent: true, opacity: 0.37, side: THREE.DoubleSide, depthWrite: false }),
    );
    torus.add(track(surface, "surface"));
    for (let i = 0; i < 32; i++) {
      const u = (i / 32) * Math.PI * 2;
      const pts = Array.from({ length: 60 }, (_, j) => {
        const v = (j / 60) * Math.PI * 2;
        return new THREE.Vector3((1.15 + 0.42 * Math.cos(v)) * Math.cos(u), (1.15 + 0.42 * Math.cos(v)) * Math.sin(u), 0.42 * Math.sin(v));
      });
      torus.add(track(line(pts, C.gold, 0.65, true), "wire", "surface"));
    }
    for (let j = 0; j < 18; j++) {
      const v = (j / 18) * Math.PI * 2;
      const pts = Array.from({ length: 100 }, (_, i) => {
        const u = (i / 100) * Math.PI * 2;
        return new THREE.Vector3((1.15 + 0.42 * Math.cos(v)) * Math.cos(u), (1.15 + 0.42 * Math.cos(v)) * Math.sin(u), 0.42 * Math.sin(v));
      });
      torus.add(track(line(pts, C.gold, 0.63, true), "wire", "surface"));
    }
    torus.rotation.x = 0.2;
    torus.rotation.y = -0.35;
    root.add(torus);
    ticks.push((time) => {
      const s = Math.sin(time * 0.7);
      torus.scale.set(1 + 0.2 * s, 1 - 0.14 * s, 1 + 0.12 * s);
    });
  }

  function update(time: number, delta: number, focus: string[]) {
    ticks.forEach((tick) => tick(time, delta, focus));
    const easing = 1 - Math.exp(-delta * 7);
    tracked.forEach(({ material, opacity, parts, required }) => {
      const selected = focus.length === 0 || parts.some((part) => focus.includes(part));
      const target = required && !focus.includes(required) ? 0 : opacity * (selected ? 1 : 0.13);
      material.opacity = THREE.MathUtils.lerp(material.opacity, target, easing);
    });
  }

  function dispose() {
    scene.traverse((object) => {
      const renderable = object as THREE.Object3D & { geometry?: THREE.BufferGeometry; material?: THREE.Material | THREE.Material[] };
      renderable.geometry?.dispose();
      const materials = renderable.material ? (Array.isArray(renderable.material) ? renderable.material : [renderable.material]) : [];
      materials.forEach((material) => {
        if ("map" in material && material.map instanceof THREE.Texture) material.map.dispose();
        material.dispose();
      });
    });
  }

  return { scene, camera, update, dispose };
}
