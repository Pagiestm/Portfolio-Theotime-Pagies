import { Analytics } from '@vercel/analytics/react';
import { RouterProvider } from 'react-router-dom';
import I18nProvider from '../i18n/I18nProvider';
import { router } from '../routes';

const App = () => (
  <I18nProvider>
    <RouterProvider router={router} />
    <Analytics scriptSrc="/mesure/script.js" endpoint="/mesure" />
  </I18nProvider>
);

export default App;
