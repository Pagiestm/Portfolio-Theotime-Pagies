import { useRouteLoaderData } from 'react-router-dom';
import type { SiteSettings } from '../services/sanity/types';

export const useSettings = (): SiteSettings => {
  const data = useRouteLoaderData('root') as { settings: SiteSettings } | undefined;
  return data?.settings ?? ({} as SiteSettings);
};

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
