import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Product } from '../../types';

interface CinematicWorldProps {
  products: Product[];
  selectedIndex: number;
  isInspecting: boolean;
  isCartFlying: boolean;
  onSelectProductIndex: (index: number) => void;
  onDroneCartComplete: () => void;
}

export const CinematicWorld: React.FC<CinematicWorldProps> = ({
  products,
  selectedIndex,
  isInspecting,
  isCartFlying,
  onSelectProductIndex,
  onDroneCartComplete,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);

  // References for live prop updates inside animation loop
  const selectedIndexRef = useRef(selectedIndex);
  const isInspectingRef = useRef(isInspecting);
  const isCartFlyingRef = useRef(isCartFlying);
  const onSelectProductIndexRef = useRef(onSelectProductIndex);
  const onDroneCartCompleteRef = useRef(onDroneCartComplete);

  useEffect(() => {
    selectedIndexRef.current = selectedIndex;
    isInspectingRef.current = isInspecting;
    isCartFlyingRef.current = isCartFlying;
    onSelectProductIndexRef.current = onSelectProductIndex;
    onDroneCartCompleteRef.current = onDroneCartComplete;
  }, [selectedIndex, isInspecting, isCartFlying, onSelectProductIndex, onDroneCartComplete]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x02040b, 0.0012);

    const camera = new THREE.PerspectiveCamera(
      55,
      window.innerWidth / window.innerHeight,
      0.1,
      3000
    );
    camera.position.set(0, 180, 750);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    // 2. Lighting Rig
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const mainSpotLight = new THREE.SpotLight(0x00f0ff, 3.5, 1200, Math.PI / 4, 0.3, 1);
    mainSpotLight.position.set(0, 600, 300);
    scene.add(mainSpotLight);

    const pinkRimLight = new THREE.PointLight(0xff007f, 2.5, 900);
    pinkRimLight.position.set(-400, 200, 100);
    scene.add(pinkRimLight);

    const goldRimLight = new THREE.PointLight(0xffd700, 2.5, 900);
    goldRimLight.position.set(400, 200, 100);
    scene.add(goldRimLight);

    // 3. Starfield & Space Warp Particles
    const starCount = 3500;
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);
    const starCols = new Float32Array(starCount * 3);

    const palette = [
      new THREE.Color('#00f0ff'),
      new THREE.Color('#ff007f'),
      new THREE.Color('#ffd700'),
      new THREE.Color('#9d00ff'),
      new THREE.Color('#ffffff'),
    ];

    for (let i = 0; i < starCount; i++) {
      const i3 = i * 3;
      starPos[i3] = (Math.random() - 0.5) * 2600;
      starPos[i3 + 1] = (Math.random() - 0.5) * 2600;
      starPos[i3 + 2] = (Math.random() - 0.5) * 2200;

      const col = palette[Math.floor(Math.random() * palette.length)];
      starCols[i3] = col.r;
      starCols[i3 + 1] = col.g;
      starCols[i3 + 2] = col.b;
    }

    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(starCols, 3));

    const starMat = new THREE.PointsMaterial({
      size: 4,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    });
    const starField = new THREE.Points(starGeo, starMat);
    scene.add(starField);

    // 4. 3D Rotating Turntable Stage (거대 원형 단상)
    const turntableGroup = new THREE.Group();
    turntableGroup.position.set(0, -60, 0);
    scene.add(turntableGroup);

    // Turntable Base Cylinder
    const baseGeo = new THREE.CylinderGeometry(380, 420, 24, 64);
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0x080c1d,
      metalness: 0.85,
      roughness: 0.25,
      wireframe: false,
    });
    const baseMesh = new THREE.Mesh(baseGeo, baseMat);
    turntableGroup.add(baseMesh);

    // Glowing Edge Rings
    const edgeRing1 = new THREE.Mesh(
      new THREE.TorusGeometry(382, 3, 16, 100),
      new THREE.MeshBasicMaterial({ color: 0x00f0ff, wireframe: true })
    );
    edgeRing1.rotation.x = Math.PI / 2;
    edgeRing1.position.y = 12;
    turntableGroup.add(edgeRing1);

    const edgeRing2 = new THREE.Mesh(
      new THREE.TorusGeometry(320, 2, 16, 80),
      new THREE.MeshBasicMaterial({ color: 0xff007f })
    );
    edgeRing2.rotation.x = Math.PI / 2;
    edgeRing2.position.y = 13;
    turntableGroup.add(edgeRing2);

    // Center Core Beam Emitter
    const coreCylinder = new THREE.Mesh(
      new THREE.CylinderGeometry(60, 60, 400, 32, 1, true),
      new THREE.MeshBasicMaterial({
        color: 0x00f0ff,
        transparent: true,
        opacity: 0.25,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
      })
    );
    coreCylinder.position.y = 180;
    turntableGroup.add(coreCylinder);

    // 5. 3D Holographic Artifact Nodes (8 Relics in Orbit)
    const orbitRadius = 300;
    const itemCount = Math.min(products.length, 8);
    const artifactMeshes: THREE.Group[] = [];

    // Load textures or generate dynamic holographic 3D meshes
    products.slice(0, 8).forEach((prod, i) => {
      const angle = (i / itemCount) * Math.PI * 2;
      const itemGroup = new THREE.Group();

      // Position in circle around turntable
      itemGroup.position.x = Math.sin(angle) * orbitRadius;
      itemGroup.position.z = Math.cos(angle) * orbitRadius;
      itemGroup.position.y = 50;

      // 3D Outer Hologram Wireframe Cage
      const cageGeo = new THREE.OctahedronGeometry(36, 1);
      const cageMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(prod.accentColor),
        wireframe: true,
        transparent: true,
        opacity: 0.8,
      });
      const cage = new THREE.Mesh(cageGeo, cageMat);
      itemGroup.add(cage);

      // Inner Glowing Gem Core
      const coreGeo = new THREE.IcosahedronGeometry(22, 0);
      const coreMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(prod.accentColor),
        emissive: new THREE.Color(prod.accentColor),
        emissiveIntensity: 0.8,
        metalness: 0.9,
        roughness: 0.1,
      });
      const gemCore = new THREE.Mesh(coreGeo, coreMat);
      itemGroup.add(gemCore);

      // Orbital Aura Ring around item
      const itemRing = new THREE.Mesh(
        new THREE.TorusGeometry(48, 1.2, 8, 32),
        new THREE.MeshBasicMaterial({
          color: new THREE.Color(prod.glowColor || prod.accentColor),
          transparent: true,
          opacity: 0.6,
        })
      );
      itemRing.rotation.x = Math.PI / 3;
      itemGroup.add(itemRing);

      turntableGroup.add(itemGroup);
      artifactMeshes.push(itemGroup);
    });

    // 6. Flying Jet Drone Cart (날아오는 3D 사이버 드론 카트)
    const droneGroup = new THREE.Group();
    droneGroup.position.set(-1000, 1000, 0); // initial offscreen
    scene.add(droneGroup);

    // Drone Body Chassis
    const droneBody = new THREE.Mesh(
      new THREE.BoxGeometry(70, 20, 90),
      new THREE.MeshStandardMaterial({ color: 0x111827, metalness: 0.9, roughness: 0.2 })
    );
    droneGroup.add(droneBody);

    // Neon Wing Blades
    const leftWing = new THREE.Mesh(
      new THREE.BoxGeometry(40, 4, 30),
      new THREE.MeshBasicMaterial({ color: 0x00f0ff })
    );
    leftWing.position.set(-50, 0, -10);
    droneGroup.add(leftWing);

    const rightWing = new THREE.Mesh(
      new THREE.BoxGeometry(40, 4, 30),
      new THREE.MeshBasicMaterial({ color: 0x00f0ff })
    );
    rightWing.position.set(50, 0, -10);
    droneGroup.add(rightWing);

    // Twin Jet Thruster Flames
    const leftJet = new THREE.Mesh(
      new THREE.ConeGeometry(12, 45, 16),
      new THREE.MeshBasicMaterial({ color: 0xff007f, blending: THREE.AdditiveBlending })
    );
    leftJet.rotation.x = Math.PI / 2;
    leftJet.position.set(-25, -2, -60);
    droneGroup.add(leftJet);

    const rightJet = new THREE.Mesh(
      new THREE.ConeGeometry(12, 45, 16),
      new THREE.MeshBasicMaterial({ color: 0xff007f, blending: THREE.AdditiveBlending })
    );
    rightJet.rotation.x = Math.PI / 2;
    rightJet.position.set(25, -2, -60);
    droneGroup.add(rightJet);

    // Tractor Beam (원뿔형 중력 견인광선)
    const tractorBeamGeo = new THREE.ConeGeometry(80, 220, 32, 1, true);
    const tractorBeamMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.0,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
    });
    const tractorBeam = new THREE.Mesh(tractorBeamGeo, tractorBeamMat);
    tractorBeam.rotation.x = Math.PI;
    tractorBeam.position.set(0, -120, 0);
    droneGroup.add(tractorBeam);

    // 7. Interactive Controls (Mouse Drag & Wheel & Keys)
    let targetRotationY = 0;
    let isDragging = false;
    let previousMouseX = 0;

    const handleMouseDown = (e: MouseEvent) => {
      if ((e.target as HTMLElement).tagName !== 'CANVAS') return;
      isDragging = true;
      previousMouseX = e.clientX;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - previousMouseX;
      previousMouseX = e.clientX;
      targetRotationY += deltaX * 0.008;
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    const handleWheel = (e: WheelEvent) => {
      targetRotationY += e.deltaY * 0.0015;
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        targetRotationY -= Math.PI / 4;
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        targetRotationY += Math.PI / 4;
      }
    };

    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('wheel', handleWheel, { passive: true });
    window.addEventListener('keydown', handleKeyDown);

    // 8. Animation Loop
    let animId: number;
    const clock = new THREE.Clock();
    let droneAnimTime = 0;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Smooth Turntable Rotation Lerp
      turntableGroup.rotation.y += (targetRotationY - turntableGroup.rotation.y) * 0.08;

      // Rotate Starfield & Core Beam
      starField.rotation.y = elapsed * 0.02;
      coreCylinder.rotation.y = -elapsed * 0.05;

      // Calculate which item is closest to front (Camera View)
      if (!isDragging) {
        const currentAngle = (turntableGroup.rotation.y % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2);
        const segment = (Math.PI * 2) / itemCount;
        const normalizedIndex = Math.round((Math.PI * 2 - currentAngle) / segment) % itemCount;
        if (normalizedIndex !== selectedIndexRef.current && !isInspectingRef.current) {
          onSelectProductIndexRef.current(normalizedIndex);
        }
      }

      // Animate Relic Nodes & Handle Bullet-Time Fly-In
      artifactMeshes.forEach((mesh, idx) => {
        const isCurrent = idx === selectedIndexRef.current;

        // Individual item idle spin & bob
        mesh.rotation.y += 0.02;
        mesh.rotation.x = Math.sin(elapsed * 2 + idx) * 0.2;

        if (isCurrent && isInspectingRef.current) {
          // FLY IN TO SCREEN CAMERA (코앞으로 돌진!)
          const targetWorldPos = new THREE.Vector3(0, 80, 480);
          mesh.position.lerp(targetWorldPos, 0.12);
          mesh.scale.lerp(new THREE.Vector3(2.5, 2.5, 2.5), 0.12);
        } else {
          // Standard Orbit Position
          const angle = (idx / itemCount) * Math.PI * 2;
          const origX = Math.sin(angle) * orbitRadius;
          const origZ = Math.cos(angle) * orbitRadius;
          const origY = 50 + Math.sin(elapsed * 3 + idx) * 12;

          mesh.position.lerp(new THREE.Vector3(origX, origY, origZ), 0.1);
          mesh.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
        }
      });

      // 9. Flying Drone Cart Animation Sequence
      if (isCartFlyingRef.current) {
        droneAnimTime += delta;

        if (droneAnimTime < 0.6) {
          // Phase 1: Fly-In Swoop from top left
          const t = droneAnimTime / 0.6;
          droneGroup.position.set(-600 + t * 600, 500 - t * 250, 400 + t * 50);
          droneGroup.rotation.set(0.3, -0.2, 0.4 * (1 - t));
          tractorBeamMat.opacity = 0;
        } else if (droneAnimTime < 1.4) {
          // Phase 2: Hover above item & Engage Tractor Beam
          droneGroup.position.set(0, 250, 450);
          droneGroup.rotation.set(0, 0, Math.sin(elapsed * 10) * 0.05);

          // Tractor Beam Glow Pulse
          tractorBeamMat.opacity = Math.min(tractorBeamMat.opacity + 0.08, 0.7);

          // Shrink & Suck currently inspected item into drone
          const currentMesh = artifactMeshes[selectedIndexRef.current];
          if (currentMesh) {
            currentMesh.position.lerp(new THREE.Vector3(0, 220, 450), 0.15);
            currentMesh.scale.multiplyScalar(0.92);
          }
        } else if (droneAnimTime < 2.0) {
          // Phase 3: Warp Out Rocket Blast towards top right Cart HUD
          const t = (droneAnimTime - 1.4) / 0.6;
          tractorBeamMat.opacity = Math.max(tractorBeamMat.opacity - 0.15, 0);
          droneGroup.position.set(t * 800, 250 + t * 500, 450 - t * 600);
          droneGroup.rotation.set(-0.5, 0.4, -0.5);

          // Flame stretch
          leftJet.scale.set(1.5, 2.5, 1.5);
          rightJet.scale.set(1.5, 2.5, 1.5);
        } else {
          // Phase 4: Finish and trigger Cart Increment
          droneGroup.position.set(-1000, 1000, 0);
          tractorBeamMat.opacity = 0;
          droneAnimTime = 0;
          onDroneCartCompleteRef.current();
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);

      if (mount && renderer.domElement) {
        mount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [products]);

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 z-0 cursor-grab active:cursor-grabbing overflow-hidden"
    />
  );
};
