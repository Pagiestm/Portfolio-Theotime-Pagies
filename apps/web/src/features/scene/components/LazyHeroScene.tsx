import { ComponentProps, lazy, Suspense } from 'react';
import type HeroSceneComponent from './HeroScene';

const HeroScene = lazy(() => import('./HeroScene'));

const LazyHeroScene = (props: ComponentProps<typeof HeroSceneComponent>) => (
  <Suspense fallback={null}>
    <HeroScene {...props} />
  </Suspense>
);

export default LazyHeroScene;
