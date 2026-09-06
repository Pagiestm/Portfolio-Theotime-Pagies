import { PortableText, type PortableTextComponents } from '@portabletext/react';
import type { PortableTextBlock } from '@portabletext/react';

/**
 * Rendu du contenu riche d'un projet.
 *
 * Le style Modernist est appliqué ici plutôt que par une feuille `.prose` :
 * chaque type de bloc est associé explicitement à son rendu, ce qui évite les
 * surprises quand un nouveau style apparaît dans le Studio. Remplace aussi
 * l'ancien `dangerouslySetInnerHTML`, qui exposait le site au HTML stocké.
 */
const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p className="m-0 mb-4 text-[16.5px] text-muted">{children}</p>,
    h2: ({ children }) => (
      <h3 className="m-0 mb-3 mt-8 text-[18px] font-extrabold tracking-[-.02em]">{children}</h3>
    ),
    h3: ({ children }) => (
      <h3 className="m-0 mb-3 mt-7 text-[17px] font-extrabold tracking-[-.02em]">{children}</h3>
    ),
    h4: ({ children }) => (
      <p className="m-0 mb-2 mt-6 text-[12px] font-bold uppercase tracking-[.16em] text-accent-2">
        {children}
      </p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-4 border-l-2 border-accent py-1 pl-5 text-[16.5px] text-muted">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="m-0 mb-6 flex list-none flex-col gap-3 p-0">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="m-0 mb-6 flex list-none flex-col gap-3 p-0">{children}</ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => (
      <li className="relative pl-[22px] text-[16px] text-muted">
        <span className="absolute left-0 top-[9px] h-[7px] w-[7px] bg-accent" />
        {children}
      </li>
    ),
    number: ({ children }) => (
      <li className="relative pl-[22px] text-[16px] text-muted">
        <span className="absolute left-0 top-[9px] h-[7px] w-[7px] bg-accent-2" />
        {children}
      </li>
    ),
  },
  marks: {
    strong: ({ children }) => <strong className="font-bold text-ink">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    link: ({ children, value }) => (
      <a
        href={value?.href}
        target="_blank"
        rel="noopener noreferrer"
        className="border-b border-accent text-accent hover:text-accent-2"
      >
        {children}
      </a>
    ),
  },
};

const ProjectContent = ({ blocks }: { blocks?: PortableTextBlock[] | null }) => {
  if (!blocks?.length) return null;
  return <PortableText value={blocks} components={components} />;
};

export default ProjectContent;
