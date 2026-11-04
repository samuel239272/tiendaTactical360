/** Original illustrative assets. No real manufacturer geometry or protection claims. */
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';
import { mkdir, writeFile } from 'node:fs/promises';

globalThis.FileReader = class {
  readAsArrayBuffer(blob) {
    blob.arrayBuffer().then((result) => {
      this.result = result;
      this.onloadend?.();
    });
  }
  readAsDataURL(blob) {
    blob.arrayBuffer().then((result) => {
      this.result = `data:${blob.type};base64,${Buffer.from(result).toString('base64')}`;
      this.onloadend?.();
    });
  }
};

const mat = (color, roughness = 0.8, metalness = 0.0) =>
  new THREE.MeshStandardMaterial({ color, roughness, metalness });
const rubber = mat('#272d28', 0.95),
  metal = mat('#444a41', 0.45, 0.55),
  foam = mat('#343832', 1);
function mesh(group, geometry, material, position = [0, 0, 0], rotation = [0, 0, 0], name = '') {
  const item = new THREE.Mesh(geometry, material);
  item.position.set(...position);
  item.rotation.set(...rotation);
  item.name = name;
  group.add(item);
  return item;
}
const geometryCache = new Map();
const box = (x, y, z) => {
  const key = `${x}/${y}/${z}`;
  if (!geometryCache.has(key))
    geometryCache.set(
      key,
      new RoundedBoxGeometry(x, y, z, 2, Math.min(0.025, x / 3, y / 3, z / 3)),
    );
  return geometryCache.get(key);
};
function curveTube(group, points, radius, material, name) {
  return mesh(
    group,
    new THREE.TubeGeometry(
      new THREE.CatmullRomCurve3(points.map((p) => new THREE.Vector3(...p))),
      40,
      radius,
      8,
      false,
    ),
    material,
    undefined,
    undefined,
    name,
  );
}
function shellPoint(u, v, offset = 0) {
  const phi = u * Math.PI * 2;
  const front = Math.cos(phi);
  const sideCut = Math.pow(Math.abs(Math.sin(phi)), 8) * 0.27;
  const maxTheta = 1.64 - front * 0.16 - sideCut;
  const theta = 0.015 + v * (maxTheta - 0.015);
  return [
    (1.02 + offset) * Math.sin(theta) * Math.sin(phi),
    0.02 + (1.17 + offset) * Math.cos(theta),
    (1.17 + offset) * Math.sin(theta) * Math.cos(phi),
  ];
}
function surface(u0, u1, v0, v1, offset = 0, nx = 96, ny = 38, reverse = false) {
  const positions = [],
    indices = [];
  for (let y = 0; y <= ny; y++)
    for (let x = 0; x <= nx; x++)
      positions.push(...shellPoint(u0 + ((u1 - u0) * x) / nx, v0 + ((v1 - v0) * y) / ny, offset));
  for (let y = 0; y < ny; y++)
    for (let x = 0; x < nx; x++) {
      const a = y * (nx + 1) + x,
        b = a + nx + 1;
      if (reverse) indices.push(a, a + 1, b, b, a + 1, b + 1);
      else indices.push(a, b, a + 1, b, b + 1, a + 1);
    }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  g.setIndex(indices);
  g.computeVertexNormals();
  return g;
}
function screws(group, position, side = 1) {
  mesh(
    group,
    new THREE.CylinderGeometry(0.045, 0.045, 0.023, 16),
    metal,
    position,
    [0, 0, Math.PI / 2],
    'Rail fastener',
  );
  mesh(group, box(0.005, 0.01, 0.049), rubber, [
    position[0] + 0.014 * side,
    position[1],
    position[2],
  ]);
}
function rail(group, side, zShift = 0) {
  const railColor = mat('#42483c', 0.8);
  for (let i = 0; i < 12; i++) {
    const z = -0.65 + i * 0.095 + zShift;
    const x = side * (1.04 - 0.16 * Math.pow(z, 2));
    const y = 0.14 + 0.14 * Math.pow(z, 2);
    mesh(
      group,
      box(0.12, 0.16, 0.1),
      railColor,
      [x, y, z],
      [0, side * z * 0.12, 0],
      'Accessory rail',
    );
    mesh(group, box(0.014, 0.04, 0.06), rubber, [x + side * 0.065, y + 0.015, z]);
  }
  screws(group, [side * 1.04, 0.16, 0.52 + zShift], side);
  screws(group, [side * 0.99, 0.22, -0.67 + zShift], side);
}
function pads(group) {
  const positions = [
    [0, 0.96, 0],
    [0.52, 0.7, 0.12],
    [-0.52, 0.7, 0.12],
    [0, 0.65, 0.72],
    [0, 0.58, -0.73],
  ];
  positions.forEach(([x, y, z], i) => {
    mesh(
      group,
      box(0.42, 0.12, 0.55),
      foam,
      [x, y, z],
      [z * 0.7, 0, -x * 0.9],
      `Interior pad ${i + 1}`,
    );
  });
}
function helmet(color) {
  const group = new THREE.Group();
  group.name = 'ATLAS original demonstrator';
  const shellMaterial = mat('#ffffff', 0.86, 0.08);
  shellMaterial.vertexColors = true;
  const geometry = surface(0, 1, 0, 1);
  const colors = [];
  const base = new THREE.Color(color);
  let seed = 718;
  for (let i = 0; i < geometry.attributes.position.count; i++) {
    seed = (seed * 16807) % 2147483647;
    const c = base.clone().multiplyScalar(0.975 + (seed / 2147483647) * 0.05);
    colors.push(c.r, c.g, c.b);
  }
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  mesh(group, geometry, shellMaterial, undefined, undefined, 'Exterior shell');
  mesh(
    group,
    surface(0, 1, 0, 1, -0.055, 96, 32, true),
    mat('#555c4b', 0.94),
    undefined,
    undefined,
    'Interior shell',
  );
  const edge = [];
  for (let i = 0; i <= 128; i++) edge.push(shellPoint(i / 128, 1, -0.018));
  curveTube(group, edge, 0.035, rubber, 'Continuous rim');
  const velcro = mat(new THREE.Color(color).multiplyScalar(0.42), 1);
  for (const [u0, u1, v0, v1] of [
    [0.16, 0.32, 0.45, 0.78],
    [0.68, 0.84, 0.45, 0.78],
    [0.41, 0.59, 0.55, 0.85],
    [0.02, 0.07, 0.12, 0.55],
    [0.93, 0.98, 0.12, 0.55],
  ]) {
    mesh(group, surface(u0, u1, v0, v1, 0.01, 20, 14), velcro, undefined, undefined, 'Loop panel');
  }
  rail(group, 1);
  rail(group, -1);
  const bracket = mat('#363d33', 0.7, 0.25);
  mesh(group, box(0.42, 0.42, 0.065), bracket, [0, 0.39, 1.115], [0.25, 0, 0], 'Front mount');
  mesh(group, box(0.24, 0.25, 0.08), metal, [0, 0.39, 1.16], [0.25, 0, 0]);
  mesh(group, box(0.13, 0.15, 0.015), rubber, [0, 0.4, 1.21], [0.25, 0, 0]);
  for (const x of [-0.15, 0.15])
    for (const y of [0.24, 0.54])
      mesh(
        group,
        new THREE.CylinderGeometry(0.024, 0.024, 0.025, 12),
        metal,
        [x, y, 1.17],
        [Math.PI / 2 + 0.25, 0, 0],
      );
  for (const s of [-1, 1]) {
    curveTube(
      group,
      [
        [s * 0.88, 0.08, 0.63],
        [s * 0.81, -0.34, 0.5],
        [s * 0.59, -0.76, 0.3],
        [s * 0.4, -0.83, 0.42],
      ],
      0.035,
      rubber,
      'Chin strap',
    );
    curveTube(
      group,
      [
        [s * 0.8, -0.07, -0.67],
        [s * 0.76, -0.47, -0.4],
        [s * 0.59, -0.76, 0.3],
      ],
      0.035,
      rubber,
      'Rear retention strap',
    );
  }
  mesh(group, box(0.72, 0.12, 0.25), rubber, [0, -0.84, 0.43], [0.12, 0, 0], 'Chin cup');
  mesh(group, box(0.15, 0.18, 0.11), metal, [0.6, -0.57, 0.34], [0, 0, 0.3], 'Strap buckle');
  pads(group);
  return group;
}
function railSet() {
  const group = new THREE.Group();
  rail(group, 1);
  rail(group, -1);
  group.scale.setScalar(1.2);
  return group;
}
function padSet() {
  const group = new THREE.Group();
  [
    [-0.6, 0, 0.4],
    [0, 0.06, 0.4],
    [0.6, 0, 0.4],
    [-0.4, 0.04, -0.3],
    [0.4, 0.04, -0.3],
    [0, 0.08, -0.9],
  ].forEach(([x, y, z], i) => {
    mesh(group, box(0.45, 0.18, 0.5), foam, [x, y, z], [0, i * 0.1, 0], `Comfort pad ${i + 1}`);
    mesh(group, box(0.38, 0.015, 0.43), mat('#454b40', 1), [x, y + 0.095, z], [0, i * 0.1, 0]);
  });
  return group;
}
function visor() {
  const group = new THREE.Group();
  const lens = new THREE.MeshPhysicalMaterial({
    color: '#849b8b',
    metalness: 0.15,
    roughness: 0.18,
    transparent: true,
    opacity: 0.72,
    side: THREE.DoubleSide,
  });
  mesh(
    group,
    new THREE.CylinderGeometry(1.12, 1.05, 0.67, 48, 1, true, -Math.PI * 0.39, Math.PI * 0.78),
    lens,
    [0, 0.1, 0],
    undefined,
    'Demonstration lens',
  );
  const top = [];
  for (let i = 0; i <= 40; i++) {
    const a = -Math.PI * 0.39 + (i / 40) * Math.PI * 0.78;
    top.push([Math.sin(a) * 1.12, 0.44, Math.cos(a) * 1.12]);
  }
  curveTube(group, top, 0.055, rubber, 'Lens frame');
  for (const s of [-1, 1])
    mesh(
      group,
      box(0.12, 0.23, 0.55),
      rubber,
      [s * 1.05, 0.3, 0.1],
      [0, s * 0.25, 0],
      'Side attachment',
    );
  return group;
}
await mkdir('public/models/helmets', { recursive: true });
await mkdir('public/models/accessories', { recursive: true });
const models = [
  ['helmets/atlas-olive', helmet('#76805e')],
  ['helmets/atlas-sand', helmet('#b09c77')],
  ['helmets/atlas-carbon', helmet('#434b47')],
  ['accessories/rail-kit', railSet()],
  ['accessories/comfort-kit', padSet()],
  ['accessories/visor', visor()],
];
for (const [name, group] of models) {
  const buffer = await new GLTFExporter().parseAsync(group, { binary: true });
  await writeFile(`public/models/${name}.glb`, Buffer.from(buffer));
  console.log(`${name}.glb · ${(buffer.byteLength / 1024).toFixed(0)} KB`);
}
