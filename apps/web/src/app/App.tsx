import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { RouterProvider } from 'react-router-dom';
import I18nProvider from '../i18n/I18nProvider';
import { router } from '../routes';

const App = () => (
  <I18nProvider>
    <RouterProvider router={router} />
    <Analytics />
    <SpeedInsights />
  </I18nProvider>
);

export default App;
