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
} from '../services/sanity/loaders';
import { paths } from './paths';
import { OWNER, ROUTE_META, trimDescription, type RouteMeta } from './meta';
import { imageUrl } from '../services/sanity/image';
import type { Project } from '../services/sanity/types';

const WorkPage = lazy(() => import('../pages/WorkPage'));
const ProjectPage = lazy(() => import('../pages/ProjectPage'));
const PathPage = lazy(() => import('../pages/PathPage'));
const SkillsPage = lazy(() => import('../pages/SkillsPage'));
const AboutPage = lazy(() => import('../pages/AboutPage'));
const ContactPage = lazy(() => import('../pages/ContactPage'));
const LegalPage = lazy(() => import('../pages/LegalPage'));

const PageFallback = () => <div style={{ minHeight: '60vh' }} aria-busy="true" />;

const lazyRoute = (element: ReactElement) => (
  <Suspense fallback={<PageFallback />}>{element}</Suspense>
);

const meta = (path: string) => ({ meta: ROUTE_META[path] });

const projectMeta = {
  meta: (data: unknown): RouteMeta => {
    const { project } = data as { project: Project };
    return {
      title: `${project.title} - ${OWNER}`,

      description: trimDescription(project.summary?.fr),
      image: imageUrl(project.cover ?? undefined, 1200),
      type: 'article',
    };
  },
};

export const router = createBrowserRouter([
  {
    id: 'root',
    path: paths.home,
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    loader: rootLoader,
    children: [
      { index: true, element: <HomePage />, loader: homeLoader, handle: meta(paths.home) },
      {
        path: paths.work,
        element: lazyRoute(<WorkPage />),
        loader: workLoader,
        handle: meta(paths.work),
      },
      {
        path: paths.projectPattern,
        element: lazyRoute(<ProjectPage />),
        loader: projectLoader,
        handle: projectMeta,
      },
      {
        path: paths.path,
        element: lazyRoute(<PathPage />),
        loader: pathLoader,
        handle: meta(paths.path),
      },
      {
        path: paths.skills,
        element: lazyRoute(<SkillsPage />),
        loader: skillsLoader,
        handle: meta(paths.skills),
      },
      {
        path: paths.about,
        element: lazyRoute(<AboutPage />),
        loader: aboutLoader,
        handle: meta(paths.about),
      },
      {
        path: paths.contact,
        element: lazyRoute(<ContactPage />),
        loader: contactLoader,
        handle: meta(paths.contact),
      },
      { path: paths.legal, element: lazyRoute(<LegalPage />), handle: meta(paths.legal) },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);
