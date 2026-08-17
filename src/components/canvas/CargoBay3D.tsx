import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { CartItem } from '../../types';

interface CargoBay3DProps {
  cart: CartItem[];
}

export const CargoBay3D: React.FC<CargoBay3DProps> = ({ cart }) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, mount.clientWidth / mount.clientHeight, 0.1, 1000);
    camera.position.z = 240;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    // Ambient & Rim Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x00f0ff, 3, 400);
    pointLight.position.set(50, 100, 100);
    scene.add(pointLight);

    // Floating Cargo Cubes for each item in cart
    const cubeGroup = new THREE.Group();
    scene.add(cubeGroup);

    const cubes: THREE.Mesh[] = [];

    cart.forEach((item, index) => {
      const geo = new THREE.BoxGeometry(28, 28, 28);
      const mat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(item.product.accentColor),
        emissive: new THREE.Color(item.product.accentColor),
        emissiveIntensity: 0.4,
        metalness: 0.8,
        roughness: 0.2,
        wireframe: false,
      });
      const mesh = new THREE.Mesh(geo, mat);

      // Random floating positions within anti-gravity chamber
      const angle = (index / Math.max(cart.length, 1)) * Math.PI * 2;
      mesh.position.set(Math.cos(angle) * 55, Math.sin(angle) * 45, (Math.random() - 0.5) * 30);

      cubeGroup.add(mesh);
      cubes.push(mesh);
    });

    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      cubeGroup.rotation.y = elapsed * 0.3;
      cubeGroup.rotation.x = Math.sin(elapsed * 0.5) * 0.2;

      cubes.forEach((c, i) => {
        c.rotation.x += 0.02 + i * 0.005;
        c.rotation.y += 0.03;
        c.position.y += Math.sin(elapsed * 2 + i) * 0.15;
      });

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      if (mount && renderer.domElement) {
        mount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [cart]);

  return <div ref={mountRef} className="w-full h-44 rounded-2xl bg-black/60 border border-cyber-cyan/30 overflow-hidden" />;
};
