import { ReactNode } from 'react';
import Reveal from './Reveal';

interface PageHeaderProps {
  kicker?: ReactNode;
  title?: ReactNode;
  body?: ReactNode;
  note?: ReactNode;
  children?: ReactNode;
}

const PageHeader = ({ kicker, title, body, note, children }: PageHeaderProps) => (
  <Reveal variant="up" className="relative">
    {kicker && (
      <div className="mb-4 text-[12px] font-bold uppercase tracking-[.2em] text-accent-2">
        {kicker}
      </div>
    )}
    <h1 className="m-0 mb-[22px] text-[clamp(36px,5.6vw,70px)] font-black leading-none tracking-[-.035em]">
      {title}
    </h1>
    {body && <p className="m-0 mb-[14px] max-w-[58ch] text-[18px] text-muted">{body}</p>}
    {note && <p className="m-0 text-[13px] uppercase tracking-[.18em] text-muted opacity-80">{note}</p>}
    {children}
  </Reveal>
);

export default PageHeader;
