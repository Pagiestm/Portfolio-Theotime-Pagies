import { Outlet, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import SceneBackground from '../features/scene/components/SceneBackground';
import AssistantWidget from '../features/assistant/components/AssistantWidget';
import { useTranslation } from '../i18n/useTranslation';
import { paths } from '../routes/paths';
import { useRouteMeta } from '../hooks/useRouteMeta';

const MainLayout = () => {
  const { t } = useTranslation();
  const { pathname } = useLocation();

  useRouteMeta();

  return (
    <div className="relative flex min-h-screen flex-col bg-bg">
      {/* Au clavier, sans ce lien il faut traverser tout le menu à chaque page. */}
      <a
        href="#contenu"
        className="sr-only z-50 focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:border-2 focus:border-accent focus:bg-surface focus:px-4 focus:py-2 focus:text-ink"
      >
        {t.skipToContent}
      </a>

      {/* three.js pèse l'essentiel du bundle : la scène animée ne se charge
          que sur l'accueil, les autres pages gardent le décor statique. */}
      <SceneBackground animated={pathname === paths.home} />
      <ScrollToTop />
      <Header />
      <main id="contenu" tabIndex={-1} className="relative z-1 flex-1">
        <Outlet />
      </main>
      <Footer />
      <AssistantWidget />
    </div>
  );
};

export default MainLayout;
