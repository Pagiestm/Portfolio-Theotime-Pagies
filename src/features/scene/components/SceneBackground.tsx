import { lazy, Suspense } from 'react';
import { scene } from '../../../config/site';

// three.js pèse l'essentiel du bundle : on le sort du chargement initial.
const HeroScene = lazy(() => import('./HeroScene'));

/**
 * Le fond fixe de toutes les pages : scène 3D atténuée, filets horizontaux,
 * montant vertical de la grille et voile de dégradés.
 */
const SceneBackground = () => (
  <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
    <div className="absolute inset-0 opacity-30">
      <Suspense fallback={null}>
        <HeroScene density={scene.backgroundDensity} scrollDriven={false} />
      </Suspense>
    </div>

    <div className="absolute inset-0 flex flex-col justify-between">
      {Array.from({ length: 8 }, (_, i) => (
        <span key={i} className="block h-px bg-line-soft" />
      ))}
    </div>

    <div className="absolute inset-0 mx-auto max-w-shell">
      <span
        className="absolute inset-y-0 left-6 block w-px"
        style={{
          background: 'linear-gradient(180deg,transparent,var(--color-line),transparent)',
        }}
      />
    </div>

    <div
      className="absolute inset-0"
      style={{
        background: `
          radial-gradient(1000px 640px at 80% -6%, rgba(92,127,174,.20), transparent 64%),
          radial-gradient(760px 520px at 2% 40%, rgba(25,34,49,.9), transparent 62%),
          linear-gradient(180deg, rgba(1,0,1,.42) 0%, rgba(1,0,1,.72) 100%)`,
      }}
    />
  </div>
);

export default SceneBackground;
