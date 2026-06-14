"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

type CardSpec = {
  x: number;
  y: number;
  z: number;
  ry: number;
  scale: number;
  accent: number;
};

const cardSpecs: CardSpec[] = [
  { x: -2.6, y: 0.1, z: -0.45, ry: 0.35, scale: 0.88, accent: 0xd8a94f },
  { x: 0, y: 0.25, z: 0.1, ry: 0, scale: 1.1, accent: 0x50b79a },
  { x: 2.55, y: 0.03, z: -0.52, ry: -0.33, scale: 0.9, accent: 0xc17f7c },
];

export function ProceduralHero3D() {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x102321, 8, 16);

    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(0, 0.55, 8.4);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.shadowMap.enabled = true;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const root = new THREE.Group();
    scene.add(root);

    const ambient = new THREE.AmbientLight(0xffffff, 1.6);
    scene.add(ambient);

    const key = new THREE.DirectionalLight(0xfff0d0, 2.4);
    key.position.set(4, 6, 6);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    scene.add(key);

    const rim = new THREE.PointLight(0x50b79a, 2.2, 12);
    rim.position.set(-4, 2.8, 3);
    scene.add(rim);

    const floor = new THREE.Mesh(
      new THREE.CylinderGeometry(4.7, 5.2, 0.08, 80),
      new THREE.MeshStandardMaterial({
        color: 0x0a1716,
        roughness: 0.8,
        metalness: 0.02,
        transparent: true,
        opacity: 0.5,
      }),
    );
    floor.position.set(0, -2.15, -0.15);
    floor.receiveShadow = true;
    root.add(floor);

    cardSpecs.forEach((spec, index) => {
      const card = createWebsiteCard(spec.accent, index);
      card.position.set(spec.x, spec.y, spec.z);
      card.rotation.y = spec.ry;
      card.scale.setScalar(spec.scale);
      root.add(card);
    });

    const marketplace = createMarketplaceCubes();
    marketplace.position.set(0, -1.62, 1.05);
    marketplace.rotation.x = -0.18;
    root.add(marketplace);

    const categoryOrbit = createCategoryIcons();
    categoryOrbit.position.set(0, -0.15, -0.35);
    root.add(categoryOrbit);

    const pointer = { x: 0, y: 0 };
    const onPointerMove = (event: PointerEvent) => {
      const rect = mount.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      pointer.y = -((event.clientY - rect.top) / rect.height - 0.5) * 2;
    };
    mount.addEventListener("pointermove", onPointerMove);

    const resize = () => {
      const width = Math.max(320, mount.clientWidth);
      const height = Math.max(360, mount.clientHeight);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(mount);

    let frame = 0;
    let animationId = 0;
    const startedAt = performance.now();

    const render = () => {
      const time = (performance.now() - startedAt) / 1000;
      frame += 1;

      if (!prefersReducedMotion) {
        root.rotation.y += (pointer.x * 0.16 - root.rotation.y) * 0.035;
        root.rotation.x += (pointer.y * 0.06 - root.rotation.x) * 0.035;
        categoryOrbit.rotation.y = time * 0.38;
        marketplace.rotation.y = Math.sin(time * 0.65) * 0.08;

        root.children.forEach((child, index) => {
          if (child.userData.float) {
            child.position.y =
              child.userData.baseY + Math.sin(time * 1.15 + index) * 0.055;
          }
        });
      }

      renderer.render(scene, camera);
      animationId = window.requestAnimationFrame(render);

      if (frame === 4) {
        mount.dataset.rendered = "true";
      }
    };
    render();

    return () => {
      window.cancelAnimationFrame(animationId);
      observer.disconnect();
      mount.removeEventListener("pointermove", onPointerMove);
      renderer.dispose();
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          const materials = Array.isArray(object.material)
            ? object.material
            : [object.material];
          materials.forEach((material) => material.dispose());
        }
      });
      renderer.domElement.remove();
    };
  }, []);

  return (
    <div className="relative min-h-[430px] overflow-hidden rounded-lg border border-white/10 bg-[#102321] shadow-2xl">
      <div
        ref={mountRef}
        role="img"
        aria-label="Animated 3D ecommerce website template cards, category icons, and marketplace app cubes."
        className="absolute inset-0"
      />
      <div className="pointer-events-none absolute left-5 top-5 z-10">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#9fcfc0]">
          Live 3D Store Builder
        </p>
        <h2 className="mt-2 text-2xl font-bold text-white">
          Template scene preview
        </h2>
      </div>
      <div className="pointer-events-none absolute inset-x-5 bottom-5 z-10 rounded-lg border border-white/10 bg-black/30 p-4 text-white backdrop-blur">
        <p className="font-mono text-xs text-white/60">
          Procedural Three.js assets, no external model files
        </p>
        <p className="mt-2 text-sm text-white/82">
          Floating store templates, product cards, marketplace cubes, and
          business-category icons generated in code.
        </p>
      </div>
      <noscript>
        <div className="p-6 text-white">
          3D preview of ecommerce website cards, store categories, and
          marketplace app blocks.
        </div>
      </noscript>
    </div>
  );
}

function createWebsiteCard(accent: number, index: number) {
  const group = new THREE.Group();
  group.userData.float = true;
  group.userData.baseY = 0;

  const body = roundedBox(2.05, 2.65, 0.12, 0xffffff, 0.42, 0.08);
  body.castShadow = true;
  body.receiveShadow = true;
  group.add(body);

  const side = new THREE.Mesh(
    new THREE.BoxGeometry(0.08, 2.42, 0.15),
    new THREE.MeshStandardMaterial({ color: 0x143c3a, roughness: 0.48 }),
  );
  side.position.set(-0.87, 0, 0.08);
  side.castShadow = true;
  group.add(side);

  const hero = panel(1.45, 0.58, accent, 0.08);
  hero.position.set(0.18, 0.76, 0.1);
  group.add(hero);

  const nav = panel(1.52, 0.08, 0x143c3a, 0.08);
  nav.position.set(0.16, 1.15, 0.12);
  group.add(nav);

  for (let i = 0; i < 6; i += 1) {
    const product = panel(0.38, 0.46, i % 2 ? 0xe6e0d4 : 0xdadfdb, 0.06);
    product.position.set(-0.44 + (i % 3) * 0.48, 0.1 - Math.floor(i / 3) * 0.62, 0.13);
    group.add(product);

    const pill = panel(0.22, 0.045, i % 2 ? 0xd8a94f : 0x50b79a, 0.03);
    pill.position.set(product.position.x - 0.06, product.position.y - 0.31, 0.145);
    group.add(pill);
  }

  if (index === 1) {
    const chart = new THREE.Group();
    for (let i = 0; i < 4; i += 1) {
      const bar = panel(0.08, 0.18 + i * 0.08, 0x143c3a, 0.02);
      bar.position.set(0.65 + i * 0.12, -0.68 + i * 0.04, 0.15);
      chart.add(bar);
    }
    group.add(chart);
  }

  return group;
}

function createMarketplaceCubes() {
  const group = new THREE.Group();
  const colors = [0x50b79a, 0xd8a94f, 0xffffff, 0xc17f7c, 0x8bb7d0];
  for (let i = 0; i < 5; i += 1) {
    const cube = new THREE.Mesh(
      new THREE.BoxGeometry(0.38, 0.38, 0.38),
      new THREE.MeshStandardMaterial({
        color: colors[i],
        roughness: 0.42,
        metalness: 0.05,
      }),
    );
    cube.position.set((i - 2) * 0.55, Math.sin(i) * 0.08, 0);
    cube.rotation.set(0.25, 0.55 + i * 0.18, 0.15);
    cube.castShadow = true;
    cube.receiveShadow = true;
    group.add(cube);
  }
  return group;
}

function createCategoryIcons() {
  const group = new THREE.Group();
  const colors = [0xf4d0d2, 0x8bb7d0, 0xb9ddb7, 0xd8a94f, 0xc17f7c, 0xffffff];

  for (let i = 0; i < 6; i += 1) {
    const angle = (i / 6) * Math.PI * 2;
    const icon = new THREE.Group();
    const base = new THREE.Mesh(
      new THREE.CylinderGeometry(0.22, 0.22, 0.08, 24),
      new THREE.MeshStandardMaterial({ color: 0x143c3a, roughness: 0.55 }),
    );
    base.rotation.x = Math.PI / 2;
    icon.add(base);

    const shape =
      i % 3 === 0
        ? new THREE.ConeGeometry(0.14, 0.32, 4)
        : i % 3 === 1
          ? new THREE.SphereGeometry(0.15, 18, 12)
          : new THREE.BoxGeometry(0.24, 0.24, 0.24);
    const mesh = new THREE.Mesh(
      shape,
      new THREE.MeshStandardMaterial({ color: colors[i], roughness: 0.35 }),
    );
    mesh.position.y = 0.22;
    mesh.castShadow = true;
    icon.add(mesh);

    icon.position.set(Math.cos(angle) * 3.45, -0.38 + Math.sin(i) * 0.08, Math.sin(angle) * 0.85 - 1.0);
    icon.rotation.y = -angle;
    group.add(icon);
  }

  return group;
}

function panel(width: number, height: number, color: number, radius: number) {
  const mesh = roundedBox(width, height, 0.035, color, 0.62, 0.02);
  mesh.scale.z = 1;
  mesh.userData.radius = radius;
  return mesh;
}

function roundedBox(
  width: number,
  height: number,
  depth: number,
  color: number,
  roughness: number,
  metalness: number,
) {
  const shape = new THREE.Shape();
  const radius = Math.min(width, height) * 0.07;
  const x = -width / 2;
  const y = -height / 2;
  shape.moveTo(x + radius, y);
  shape.lineTo(x + width - radius, y);
  shape.quadraticCurveTo(x + width, y, x + width, y + radius);
  shape.lineTo(x + width, y + height - radius);
  shape.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  shape.lineTo(x + radius, y + height);
  shape.quadraticCurveTo(x, y + height, x, y + height - radius);
  shape.lineTo(x, y + radius);
  shape.quadraticCurveTo(x, y, x + radius, y);

  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: true,
    bevelSegments: 3,
    bevelSize: Math.min(width, height) * 0.015,
    bevelThickness: depth * 0.5,
  });
  geometry.center();

  return new THREE.Mesh(
    geometry,
    new THREE.MeshStandardMaterial({
      color,
      roughness,
      metalness,
    }),
  );
}
