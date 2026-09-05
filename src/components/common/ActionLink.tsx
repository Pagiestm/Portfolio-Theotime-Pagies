import { ReactNode } from 'react';
import { Link } from 'react-router-dom';

const BASE =
  'inline-block border-2 px-[24px] py-[14px] text-[13.5px] font-bold uppercase tracking-[.05em] text-left cursor-pointer transition-all duration-200';

const VARIANTS: Record<string, string> = {
  solid: 'border-accent bg-accent text-ink hover:bg-transparent hover:text-accent-2',
  outline: 'border-line bg-transparent text-ink hover:border-accent hover:text-accent-2',
  underline:
    'border-0 border-b-2 border-accent bg-transparent px-0 py-[6px] text-ink hover:text-accent-2',
};

interface ActionLinkProps {
  to?: string;
  href?: string;
  variant?: string;
  className?: string;
  children?: ReactNode;
  onClick?: () => void;
  [key: string]: unknown;
}

const ActionLink = ({
  to,
  href,
  variant = 'solid',
  className = '',
  children,
  ...rest
}: ActionLinkProps) => {
  const cls = `${BASE} ${VARIANTS[variant]} ${className}`;

  if (to) {
    return (
      <Link to={to} className={cls} {...rest}>
        {children}
      </Link>
    );
  }
  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls} {...rest}>
        {children}
      </a>
    );
  }
  return (
    <button type="button" className={cls} {...rest}>
      {children}
    </button>
  );
};

export default ActionLink;
