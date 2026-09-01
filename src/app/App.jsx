import { RouterProvider } from 'react-router-dom';
import I18nProvider from '../i18n/I18nProvider';
import { router } from '../routes';

/** Racine applicative : les providers transverses, puis le routeur. */
const App = () => (
  <I18nProvider>
    <RouterProvider router={router} />
  </I18nProvider>
);

export default App;
