import { Outlet } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import SceneBackground from '../features/scene/components/SceneBackground';

/** Coquille commune : fond 3D fixe, header sticky, contenu routé, footer. */
const MainLayout = () => (
  <div className="relative flex min-h-screen flex-col bg-bg">
    <SceneBackground />
    <ScrollToTop />
    <Header />
    <main className="relative z-[1] flex-1">
      <Outlet />
    </main>
    <Footer />
  </div>
);

export default MainLayout;
