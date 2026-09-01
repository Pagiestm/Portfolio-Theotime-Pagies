import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import HomePage from '../pages/HomePage';
import NotFoundPage from '../pages/NotFoundPage';
import ErrorPage from '../pages/ErrorPage';
import { paths } from './paths';

/**
 * L'accueil et la page 404 sont dans le bundle initial ; les autres pages
 * sont chargées à la demande. Cela sort notamment EmailJS, reCAPTCHA et la
 * galerie zoomable du premier chargement.
 */
const WorkPage = lazy(() => import('../pages/WorkPage'));
const ProjectPage = lazy(() => import('../pages/ProjectPage'));
const PathPage = lazy(() => import('../pages/PathPage'));
const SkillsPage = lazy(() => import('../pages/SkillsPage'));
const AboutPage = lazy(() => import('../pages/AboutPage'));
const ContactPage = lazy(() => import('../pages/ContactPage'));

/** Réserve la hauteur d'une page pendant son chargement, sans clignotement. */
const PageFallback = () => <div style={{ minHeight: '60vh' }} aria-busy="true" />;

const lazyRoute = (element) => <Suspense fallback={<PageFallback />}>{element}</Suspense>;

export const router = createBrowserRouter([
  {
    path: paths.home,
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: paths.work, element: lazyRoute(<WorkPage />) },
      { path: paths.projectPattern, element: lazyRoute(<ProjectPage />) },
      { path: paths.path, element: lazyRoute(<PathPage />) },
      { path: paths.skills, element: lazyRoute(<SkillsPage />) },
      { path: paths.about, element: lazyRoute(<AboutPage />) },
      { path: paths.contact, element: lazyRoute(<ContactPage />) },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);
