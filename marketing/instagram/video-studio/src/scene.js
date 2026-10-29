import * as THREE from "three";
import { gsap } from "gsap";
import { createTimeline } from "animejs";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
(async () => {
  const p = await (await fetch("project.json")).json();
  const duration = p.duration || 20;
  const q = duration / 20;
  const canvas = document.querySelector("canvas");
  const r = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: false,
    preserveDrawingBuffer: true,
  });
  r.setSize(1080, 1920);
  r.setPixelRatio(1);
  r.shadowMap.enabled = true;
  r.shadowMap.type = THREE.PCFSoftShadowMap;
  r.outputColorSpace = THREE.SRGBColorSpace;
  r.toneMapping = THREE.ACESFilmicToneMapping;
  r.toneMappingExposure = 1.25;
  const s = new THREE.Scene();
  s.background = new THREE.Color("#f2eddf");
  s.fog = new THREE.Fog("#f2eddf", 12, 28);
  const camera = new THREE.PerspectiveCamera(32, 1080 / 1920, 0.1, 60);
  s.add(new THREE.HemisphereLight("#fff9e9", "#666f40", 2.1));
  const key = new THREE.DirectionalLight("#fff1ce", 3.5);
  key.position.set(-5, 9, 7);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  Object.assign(key.shadow.camera, { left: -8, right: 8, top: 10, bottom: -8 });
  key.shadow.bias = -0.001;
  s.add(key);
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(90, 90),
    new THREE.MeshStandardMaterial({ color: "#e9dfc8", roughness: 0.91 }),
  );
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  s.add(ground);
  const wall = new THREE.Mesh(
    new THREE.PlaneGeometry(40, 25),
    new THREE.MeshStandardMaterial({ color: "#eee8d7", roughness: 1 }),
  );
  wall.position.set(0, 8, -3.2);
  wall.receiveShadow = true;
  s.add(wall);
  const plinth = new THREE.Mesh(
    new THREE.CylinderGeometry(3.1, 3.1, 0.18, 96),
    new THREE.MeshStandardMaterial({ color: "#ded4b8", roughness: 0.96 }),
  );
  plinth.position.set(0, 0.09, 0);
  plinth.receiveShadow = true;
  plinth.castShadow = true;
  s.add(plinth);
  // Photographic bottle silhouettes preserve the real packaging, not invented 3D labels.
  const loader = new THREE.TextureLoader();
  const bottles = [];
  for (let i = 0; i < 3; i++) {
    const tex = await loader.loadAsync("assets/" + p.flavors[i] + ".webp");
    tex.colorSpace = THREE.SRGBColorSpace;
    const aspect = tex.image.width / tex.image.height;
    const h = i === 0 ? 5.4 : 4.6;
    const m = new THREE.Mesh(
      new THREE.PlaneGeometry(h * aspect, h),
      new THREE.MeshBasicMaterial({
        map: tex,
        transparent: false,
        fog: false,
        alphaTest: 0.015,
        toneMapped: false,
        side: THREE.DoubleSide,
      }),
    );
    m.position.set(
      i === 0 ? 0 : i === 1 ? -1.8 : 1.8,
      h / 2 + 0.18,
      i === 0 ? 0.6 : 0,
    );
    s.add(m);
    bottles.push(m);
    // Soft contact shadow beneath each photographic bottle.
    const data = new Uint8Array(128 * 128 * 4);
    for (let y = 0; y < 128; y++)
      for (let x = 0; x < 128; x++) {
        let d = Math.hypot((x - 64) / 64, (y - 64) / 64);
        let o = (y * 128 + x) * 4;
        data[o] = 40;
        data[o + 1] = 42;
        data[o + 2] = 25;
        data[o + 3] = Math.max(0, 1 - d) * 85;
      }
    const shadowtex = new THREE.DataTexture(data, 128, 128);
    shadowtex.needsUpdate = true;
    const sh = new THREE.Mesh(
      new THREE.PlaneGeometry(2.6, 1.2),
      new THREE.MeshBasicMaterial({
        map: shadowtex,
        transparent: true,
        depthWrite: false,
      }),
    );
    sh.rotation.x = -Math.PI / 2;
    sh.position.set(m.position.x, 0.19, m.position.z);
    s.add(sh);
  }
  // Seeded surface condensation. The droplets refract the opaque photographic bottle,
  // not an unrelated background; a few grow and run under gravity in the macro shot.
  const pmrem = new THREE.PMREMGenerator(r);
  s.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  const dew = new THREE.Group();
  const drops = [];
  const water = new THREE.MeshPhysicalMaterial({
    color: "#ffffff",
    metalness: 0,
    roughness: 0.035,
    transmission: 1,
    thickness: 0.06,
    ior: 1.333,
    envMapIntensity: 1.2,
    clearcoat: 1,
    fog: false,
  });
  const bead = new THREE.SphereGeometry(1, 12, 10);
  const rand = (n) => {
    const v = Math.sin(n * 127.13 + 17.7) * 43758.5453;
    return v - Math.floor(v);
  };
  for (let i = 0; i < 38; i++) {
    const x = (rand(i + 1) - 0.5) * 1.38;
    const y = i < 35 ? 3.9 + rand(i + 100) * 0.66 : 0.35 + rand(i + 100) * 0.65;
    const radius = i % 17 === 0 ? 0.011 : 0.0025 + rand(i + 200) * 0.0045;
    const mesh = new THREE.Mesh(bead, water);
    mesh.position.set(x, y, 0.645 + radius * 0.6);
    mesh.scale.set(radius, radius * 1.35, radius * 0.38);
    dew.add(mesh);
    drops.push({ mesh, x, y, radius, seed: rand(i + 400) });
  }
  s.add(dew);
  // Out-of-focus botanical shadows and edge leaves anchor a warm, tropical product set.
  const leaves = new THREE.Group();
  for (let i = 0; i < 9; i++) {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.bezierCurveTo(-0.5, 0.7, -0.4, 1.6, 0, 2);
    shape.bezierCurveTo(0.4, 1.6, 0.5, 0.7, 0, 0);
    const leaf = new THREE.Mesh(
      new THREE.ShapeGeometry(shape),
      new THREE.MeshStandardMaterial({
        color: i % 2 ? "#355131" : "#526b3a",
        side: THREE.DoubleSide,
        roughness: 0.8,
      }),
    );
    leaf.position.set(-4.3 + i * 0.18, 2 + i * 0.65, -0.3);
    leaf.rotation.set(0.3, 0.3, i * 0.35 - 0.8);
    leaf.castShadow = true;
    leaves.add(leaf);
  }
  s.add(leaves);
  const state = { cx: 1.3, cy: 4.4, cz: 14.8, look: 3.8, side: 0, leaf: 0 };
  const motion = createTimeline({ autoplay: false });
  // Three deliberate camera setups; hard cuts preserve the same physical product.
  const cameraBeat = { a: 0, b: 0, c: 0 };
  motion
    .add(cameraBeat, { a: [0, 1], duration: duration * 350, ease: "linear" }, 0)
    .add(
      cameraBeat,
      { b: [0, 1], duration: duration * 430, ease: "linear" },
      duration * 350,
    )
    .add(
      cameraBeat,
      {
        c: [0, 1],
        duration: Math.max(1, duration * 220 - 650),
        ease: "linear",
      },
      duration * 780,
    );
  const head = document.querySelector("#heading"),
    origin = document.querySelector("#origin"),
    mark = document.querySelector("#mark"),
    closing = document.querySelector("#closing"),
    handle = document.querySelector("#handle");
  const clock = { t: 0 };
  function draw(t) {
    motion.seek(t * 1000);
    const macroStart = duration * 0.18,
      macroEnd = duration * (p.pourAsset ? 0.43 : 0.78);
    const progress = Math.max(
      0,
      Math.min(1, (t - macroStart) / (macroEnd - macroStart)),
    );

    if (t < duration * 0.18) {
      camera.position.set(
        1.1 - cameraBeat.a * 1.4,
        4.4,
        17 - cameraBeat.a * 4.2,
      );
      camera.lookAt(0, 3.8, 0);
      state.side = 0;
    } else if (t < duration * 0.78) {
      camera.position.set(-0.45 + progress * 0.9, 4.2, 8.8);
      camera.lookAt(0, 4 - progress * 0.2, 0);
      state.side = 0;
    } else {
      camera.position.set(
        -0.25 + cameraBeat.c * 0.5,
        4.9,
        18.5 - cameraBeat.c * 3.5,
      );
      camera.lookAt(0, 3.7, 0);
      state.side = 1;
    }
    dew.visible = t >= macroStart && t < macroEnd;
    for (let i = 0; i < drops.length; i++) {
      const d = drops[i];
      const grow = 0.62 + 0.38 * Math.min(1, progress * 1.7 + d.seed * 0.35);
      const run =
        i % 17 === 0
          ? Math.pow(Math.max(0, progress - 0.3 - d.seed * 0.18), 2) * 0.7
          : 0;
      d.mesh.position.y = d.y - run;
      d.mesh.scale.set(
        d.radius * grow,
        d.radius * grow * (1.35 + run * 1.5),
        d.radius * grow * 0.38,
      );
    }
    bottles[1].scale.setScalar(0.82 + 0.18 * state.side);
    bottles[2].scale.setScalar(0.82 + 0.18 * state.side);
    bottles[1].position.y = (4.6 * bottles[1].scale.y) / 2 + 0.18;
    bottles[2].position.y = (4.6 * bottles[2].scale.y) / 2 + 0.18;
    leaves.rotation.z = Math.sin(t * 0.22) * 0.015;
    r.render(s, camera);
  }
  const tl = gsap.timeline({ paused: true });
  tl.to(
    clock,
    { t: duration, duration, ease: "none", onUpdate: () => draw(clock.t) },
    0,
  );
  tl.fromTo(
    head,
    { opacity: 0, y: 30 },
    { opacity: 1, y: 0, duration: 0.7 },
    0.25 * q,
  ).to(head, { opacity: 0, y: -16, duration: 0.5 }, 3.5 * q);
  tl.fromTo(
    origin,
    { opacity: 0, y: 16 },
    { opacity: 1, y: 0, duration: 0.6 },
    7 * q,
  ).to(origin, { opacity: 0, duration: 0.5 }, 15 * q);
  for (const el of [mark, closing])
    tl.fromTo(
      el,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.65 },
      15.6 * q,
    );
  window.__timelines = { kombu: tl };
  window.__kombuSeek = (t) => {
    tl.seek(t);
    draw(t);
  };
  draw(0);
  window.__kombuReady = true;
})();
