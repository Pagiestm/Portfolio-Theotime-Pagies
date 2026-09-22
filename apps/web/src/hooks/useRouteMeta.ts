import { useEffect } from 'react';
import { useLocation, useMatches } from 'react-router-dom';
import { ROUTE_META, type RouteMeta } from '../routes/meta';
import { paths } from '../routes/paths';

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
    const { origin } = window.location;
    const url = `${origin}${pathname}`;
    document.title = title;
    apply('meta[name="description"]', 'content', description);
    apply('meta[property="og:title"]', 'content', title);
    apply('meta[property="og:description"]', 'content', description);
    apply('meta[property="og:url"]', 'content', url);
    apply('meta[property="og:type"]', 'content', type);
    apply('link[rel="canonical"]', 'href', url);

    apply('meta[property="og:image"]', 'content', image ?? `${origin}/og.png`);
  }, [title, description, image, type, pathname]);
};
