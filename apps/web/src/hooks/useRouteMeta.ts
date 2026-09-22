import { useEffect } from 'react';
import { useLocation, useMatches } from 'react-router-dom';
import { ROUTE_META, type RouteMeta } from '../routes/meta';
import { paths } from '../routes/paths';

/**
 * Applique à l'en-tête du document les métadonnées déclarées par la route
 * courante, dans son `handle`.
 *
 * Le pré-rendu du build donne à chaque route son HTML et ses métadonnées, mais
 * il ne couvre que le premier chargement : en navigation interne, React Router
 * ne recharge pas la page et le titre resterait celui de la précédente - gênant
 * pour l'onglet, l'historique, et annoncé tel quel par les lecteurs d'écran.
 *
 * On retient la correspondance la plus profonde qui déclare des métadonnées :
 * une page projet l'emporte ainsi sur la mise en page qui l'enveloppe. Une route
 * qui n'en déclare aucune, comme la 404, retombe sur celles de l'accueil.
 */
type MetaHandle = { meta?: RouteMeta | ((data: unknown) => RouteMeta) };

const apply = (selector: string, attribute: string, value: string) => {
  document.head.querySelector(selector)?.setAttribute(attribute, value);
};

export const useRouteMeta = () => {
  const matches = useMatches();
  const { pathname } = useLocation();

  const match = [...matches].reverse().find((entry) => (entry.handle as MetaHandle)?.meta);
  const declared = (match?.handle as MetaHandle | undefined)?.meta;
  const meta =
    typeof declared === 'function' ? declared(match?.data) : (declared ?? ROUTE_META[paths.home]);

  const { title, description, image, type = 'website' } = meta;

  useEffect(() => {
    // L'origine du navigateur est toujours la bonne, quel que soit le domaine
    // servi : rien à tenir à jour si l'adresse du site change.
    const { origin } = window.location;
    const url = `${origin}${pathname}`;
    document.title = title;
    apply('meta[name="description"]', 'content', description);
    apply('meta[property="og:title"]', 'content', title);
    apply('meta[property="og:description"]', 'content', description);
    apply('meta[property="og:url"]', 'content', url);
    apply('meta[property="og:type"]', 'content', type);
    apply('link[rel="canonical"]', 'href', url);
    // Sans ce repli, revenir d'une page projet vers une page statique laisserait
    // l'image du projet dans l'en-tête.
    apply('meta[property="og:image"]', 'content', image ?? `${origin}/og.png`);
  }, [title, description, image, type, pathname]);
};
