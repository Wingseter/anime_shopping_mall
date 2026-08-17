import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const MultiverseBackground: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x03060f, 0.0015);

    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      2000
    );
    camera.position.z = 800;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    // 2. Starfield & Nebula Particle System (5000 points)
    const particleCount = 4500;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const scales = new Float32Array(particleCount);

    const colorPalette = [
      new THREE.Color('#00f0ff'), // cyan
      new THREE.Color('#ff007f'), // pink
      new THREE.Color('#9d00ff'), // purple
      new THREE.Color('#ffd700'), // gold
      new THREE.Color('#ffffff'), // star white
    ];

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 2500;
      positions[i3 + 1] = (Math.random() - 0.5) * 2500;
      positions[i3 + 2] = (Math.random() - 0.5) * 2000;

      const randomColor = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      colors[i3] = randomColor.r;
      colors[i3 + 1] = randomColor.g;
      colors[i3 + 2] = randomColor.b;

      scales[i] = Math.random() * 3 + 1;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Particle Shader / Material
    const particleMaterial = new THREE.PointsMaterial({
      size: 4,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    });

    const starField = new THREE.Points(geometry, particleMaterial);
    scene.add(starField);

    // 3. Futuristic Quantum Rings (Sci-Fi Artifact Ring in Center)
    const ringGroup = new THREE.Group();
    const ringMat1 = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      wireframe: true,
      transparent: true,
      opacity: 0.25,
    });
    const ringMat2 = new THREE.MeshBasicMaterial({
      color: 0xff007f,
      wireframe: true,
      transparent: true,
      opacity: 0.2,
    });
    const ringMat3 = new THREE.MeshBasicMaterial({
      color: 0xffd700,
      wireframe: true,
      transparent: true,
      opacity: 0.2,
    });

    const torus1 = new THREE.Mesh(new THREE.TorusGeometry(320, 1.5, 16, 100), ringMat1);
    const torus2 = new THREE.Mesh(new THREE.TorusGeometry(420, 2.0, 16, 120), ringMat2);
    const torus3 = new THREE.Mesh(new THREE.TorusGeometry(520, 1.0, 16, 140), ringMat3);

    torus1.rotation.x = Math.PI / 3;
    torus2.rotation.y = Math.PI / 4;
    torus3.rotation.z = Math.PI / 6;

    ringGroup.add(torus1);
    ringGroup.add(torus2);
    ringGroup.add(torus3);
    ringGroup.position.z = -200;
    scene.add(ringGroup);

    // 4. Mouse Tracking & Scroll Speed Reaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    let lastScrollY = window.scrollY;
    let scrollSpeed = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX - window.innerWidth / 2) * 0.4;
      mouseY = (e.clientY - window.innerHeight / 2) * 0.4;
    };

    const handleScroll = () => {
      const currentScroll = window.scrollY;
      scrollSpeed = Math.abs(currentScroll - lastScrollY);
      lastScrollY = currentScroll;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll, { passive: true });

    // 5. Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse lerp
      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;

      camera.position.x = targetX;
      camera.position.y = -targetY;
      camera.lookAt(scene.position);

      // Rotate Starfield & Rings
      starField.rotation.y = elapsedTime * 0.03;
      starField.rotation.x = elapsedTime * 0.015;

      torus1.rotation.x += 0.005;
      torus1.rotation.y += 0.008;
      torus2.rotation.y -= 0.006;
      torus2.rotation.z += 0.004;
      torus3.rotation.z += 0.003;

      // Scroll Warp effect: speed up particles on scroll
      scrollSpeed *= 0.92;
      camera.position.z = 800 - Math.min(scrollSpeed * 15, 300);

      renderer.render(scene, camera);
    };

    animate();

    // 6. Handle Resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (mount && renderer.domElement) {
        mount.removeChild(renderer.domElement);
      }
      geometry.dispose();
      particleMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      style={{ opacity: 0.9 }}
    />
  );
};
