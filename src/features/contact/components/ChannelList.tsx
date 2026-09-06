import { useChannels } from '../../../lib/sanity/useContent';

/** Les points de contact, en lignes pleine largeur à filets 2px. */
const ChannelList = () => {
  const channels = useChannels();

  return (
    <div className="border-t-2 border-line">
      {channels.map((channel) => (
        <a
          key={channel.label}
          href={channel.href}
          target={channel.href.startsWith('mailto:') ? undefined : '_blank'}
          rel="noopener noreferrer"
          className="flex items-center justify-between gap-4 border-b-2 border-line px-2 py-5 text-ink transition-all duration-200 hover:bg-surface hover:pl-5 hover:text-ink"
        >
          <span className="w-[88px] flex-none text-[11px] uppercase tracking-[.16em] text-muted">
            {channel.label}
          </span>
          <span className="min-w-0 flex-1 break-words text-[16px] font-bold">{channel.value}</span>
          <span className="flex-none text-[19px] text-accent">↗</span>
        </a>
      ))}
    </div>
  );
};

export default ChannelList;
