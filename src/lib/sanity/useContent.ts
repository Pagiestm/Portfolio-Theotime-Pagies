import { useRouteLoaderData } from 'react-router-dom';
import type { SiteSettings } from './types';

/**
 * Les réglages du site, chargés une seule fois par la route racine.
 *
 * L'en-tête, le pied de page et la liste des canaux de contact y accèdent
 * sans que chaque page ait à les redemander.
 */
export const useSettings = (): SiteSettings => {
  const data = useRouteLoaderData('root') as { settings: SiteSettings } | undefined;
  return data?.settings ?? ({} as SiteSettings);
};

/** Les canaux de contact, dérivés des réglages. */
export const useChannels = () => {
  const settings = useSettings();
  return [
    settings.email && { label: 'Email', value: settings.email, href: `mailto:${settings.email}` },
    settings.github && {
      label: 'GitHub',
      value: settings.github.replace(/^https?:\/\//, '').replace(/\/$/, ''),
      href: settings.github,
    },
    settings.linkedin && {
      label: 'LinkedIn',
      value: decodeURIComponent(settings.linkedin.replace(/^https?:\/\//, '').replace(/\/$/, '')),
      href: settings.linkedin,
    },
    settings.siteUrl && {
      label: 'Portfolio',
      value: settings.siteUrl.replace(/^https?:\/\//, '').replace(/\/$/, ''),
      href: settings.siteUrl,
    },
  ].filter(Boolean) as Array<{ label: string; value: string; href: string }>;
};
