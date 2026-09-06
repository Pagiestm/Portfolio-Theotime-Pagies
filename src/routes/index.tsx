import { lazy, Suspense, type ReactElement } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import HomePage from '../pages/HomePage';
import NotFoundPage from '../pages/NotFoundPage';
import ErrorPage from '../pages/ErrorPage';
import {
  aboutLoader,
  contactLoader,
  homeLoader,
  pathLoader,
  projectLoader,
  rootLoader,
  skillsLoader,
  workLoader,
} from '../lib/sanity/loaders';
import { paths } from './paths';

/**
 * L'accueil et la page 404 sont dans le bundle initial ; les autres pages
 * sont chargées à la demande. Cela sort notamment EmailJS, reCAPTCHA et la
 * galerie zoomable du premier chargement.
 *
 * Le contenu vient de Sanity via les `loader` de chaque route : il est prêt
 * avant le rendu, donc aucune page n'a d'état de chargement à gérer.
 */
const WorkPage = lazy(() => import('../pages/WorkPage'));
const ProjectPage = lazy(() => import('../pages/ProjectPage'));
const PathPage = lazy(() => import('../pages/PathPage'));
const SkillsPage = lazy(() => import('../pages/SkillsPage'));
const AboutPage = lazy(() => import('../pages/AboutPage'));
const ContactPage = lazy(() => import('../pages/ContactPage'));

/** Réserve la hauteur d'une page pendant son chargement, sans clignotement. */
const PageFallback = () => <div style={{ minHeight: '60vh' }} aria-busy="true" />;

const lazyRoute = (element: ReactElement) => (
  <Suspense fallback={<PageFallback />}>{element}</Suspense>
);

export const router = createBrowserRouter([
  {
    id: 'root',
    path: paths.home,
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    loader: rootLoader,
    children: [
      { index: true, element: <HomePage />, loader: homeLoader },
      { path: paths.work, element: lazyRoute(<WorkPage />), loader: workLoader },
      {
        path: paths.projectPattern,
        element: lazyRoute(<ProjectPage />),
        loader: projectLoader,
      },
      { path: paths.path, element: lazyRoute(<PathPage />), loader: pathLoader },
      { path: paths.skills, element: lazyRoute(<SkillsPage />), loader: skillsLoader },
      { path: paths.about, element: lazyRoute(<AboutPage />), loader: aboutLoader },
      { path: paths.contact, element: lazyRoute(<ContactPage />), loader: contactLoader },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);
