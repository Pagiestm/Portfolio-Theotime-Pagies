import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { usePrefersReducedMotion } from '../../../hooks/useMediaQuery';

/**
 * Portage React de `scene3d.js` (variante « calm » de la maquette) : deux coques
 * filaires en contre-rotation, un anneau d'horizon et un halo de particules.
 * La scène réagit au pointeur et, si `scrollDriven`, à la progression du scroll.
 *
 * Rendu en three.js brut plutôt qu'en react-three-fiber : la boucle est impérative
 * et n'a aucun état React à réconcilier, la monter dans un `useEffect` est plus direct
 * et évite un re-render par frame.
 */
const HeroScene = ({
  accent = '#5c7fae',
  accent2 = '#c3cede',
  density = 700,
  scrollDriven = true,
  className = '',
}) => {
  const hostRef = useRef(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return undefined;

    const canvas = document.createElement('canvas');
    Object.assign(canvas.style, { display: 'block', width: '100%', height: '100%' });
    host.appendChild(canvas);

    const accentColor = new THREE.Color(accent);
    const accent2Color = new THREE.Color(accent2);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 120);
    camera.position.set(0, 0, 6.2);

    const group = new THREE.Group();
    scene.add(group);

    // Deux icosaèdres filaires en contre-rotation.
    const shells = [1.9, 2.55].map((radius, i) => {
      const shell = new THREE.LineSegments(
        new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(radius, 1)),
        new THREE.LineBasicMaterial({
          color: i ? accent2Color : accentColor,
          transparent: true,
          opacity: i ? 0.16 : 0.34,
        })
      );
      group.add(shell);
      return shell;
    });

    const horizon = new THREE.Mesh(
      new THREE.RingGeometry(3.0, 3.006, 128),
      new THREE.MeshBasicMaterial({
        color: accentColor,
        transparent: true,
        opacity: 0.2,
        side: THREE.DoubleSide,
      })
    );
    horizon.rotation.x = Math.PI / 2.35;
    group.add(horizon);

    // Halo de particules.
    const positions = new Float32Array(density * 3);
    for (let i = 0; i < density; i += 1) {
      const r = 3.1 + Math.random() * 5.6;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.62;
      positions[i * 3 + 2] = r * Math.cos(phi);
    }
    const dustGeometry = new THREE.BufferGeometry();
    dustGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const dust = new THREE.Points(
      dustGeometry,
      new THREE.PointsMaterial({
        color: accentColor,
        size: 0.03,
        transparent: true,
        opacity: 0.5,
        sizeAttenuation: true,
      })
    );
    scene.add(dust);

    scene.add(new THREE.AmbientLight(0xffffff, 0.35));
    const key = new THREE.PointLight(accentColor, 20, 24);
    key.position.set(3.4, 2.6, 4.2);
    scene.add(key);
    const rim = new THREE.PointLight(accent2Color, 10, 22);
    rim.position.set(-4, -2.4, 2.2);
    scene.add(rim);

    const BASE_Z = 7.8;
    let restZ = BASE_Z;

    const resize = () => {
      const w = host.clientWidth || 1;
      const h = host.clientHeight || 1;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      restZ = w < 560 ? BASE_Z + 1.4 : BASE_Z;
      camera.updateProjectionMatrix();
    };
    resize();

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);

    let visible = true;
    const visibility = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
    }, { threshold: 0 });
    visibility.observe(host);

    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
    const onPointerMove = (e) => {
      const r = host.getBoundingClientRect();
      pointer.tx = ((e.clientX - r.left) / Math.max(r.width, 1)) * 2 - 1;
      pointer.ty = ((e.clientY - r.top) / Math.max(r.height, 1)) * 2 - 1;
    };
    window.addEventListener('pointermove', onPointerMove, { passive: true });

    let scroll = 0;
    let scrollTarget = 0;
    const onScroll = () => {
      const max = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      scrollTarget = Math.min(window.scrollY / max, 1);
    };
    document.addEventListener('scroll', onScroll, { passive: true, capture: true });
    onScroll();

    const clock = new THREE.Clock();
    let raf = 0;

    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!visible) return;

      const t = reduced ? 0 : clock.getElapsedTime();
      pointer.x += (pointer.tx - pointer.x) * 0.045;
      pointer.y += (pointer.ty - pointer.y) * 0.045;
      scroll += (scrollTarget - scroll) * 0.06;
      const s = scrollDriven ? scroll : 0;

      camera.position.z = restZ - s * 1.5;
      camera.position.y = s * 0.9;
      camera.lookAt(0, 0, 0);

      group.rotation.y = t * 0.045 + pointer.x * 0.2 + s * 0.5;
      group.rotation.x = Math.sin(t * 0.12) * 0.05 + pointer.y * 0.11;
      group.scale.setScalar(1 - s * 0.1);

      shells[1].rotation.y = -t * 0.07;
      shells[1].rotation.z = t * 0.03;
      horizon.rotation.z = t * 0.05;
      horizon.scale.setScalar(1 + s * 0.3);

      dust.rotation.y = t * 0.035 + pointer.x * 0.12 + s * 0.8;
      dust.rotation.x = pointer.y * 0.08;

      renderer.render(scene, camera);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('scroll', onScroll, true);
      resizeObserver.disconnect();
      visibility.disconnect();
      scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          const materials = Array.isArray(obj.material) ? obj.material : [obj.material];
          materials.forEach((m) => m.dispose());
        }
      });
      renderer.dispose();
      canvas.remove();
    };
  }, [accent, accent2, density, scrollDriven, reduced]);

  return <div ref={hostRef} aria-hidden="true" className={`relative block h-full w-full ${className}`} />;
};

export default HeroScene;
