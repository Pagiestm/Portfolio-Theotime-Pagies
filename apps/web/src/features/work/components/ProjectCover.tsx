import type { CSSProperties } from 'react';

/**
 * L'image d'en-tête d'un projet, et ce qu'on affiche quand elle manque.
 *
 * `cover` n'est pas obligatoire dans le Studio : sans repli, la carte laissait
 * un cadre vide de 220 px qui se lisait comme une image cassée. On dessine donc
 * un monogramme sur une trame diagonale — assez neutre pour ne pas se faire
 * passer pour du contenu, assez construit pour paraître voulu.
 *
 * Les deux appelants passent leurs bordures et leur hauteur par `className` :
 * la carte et la page projet ne les cadrent pas pareil.
 */
const initialsOf = (title: string) =>
  title
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase();

const ProjectCover = ({
  src,
  title,
  className = '',
  style,
  loading = 'lazy',
}: {
  src?: string;
  title: string;
  className?: string;
  style?: CSSProperties;
  loading?: 'lazy' | 'eager';
}) => (
  <div className={`flex items-center justify-center bg-surface-2 ${className}`} style={style}>
    {src ? (
      // object-contain : ce sont des captures d'écran, les recadrer les rend illisibles.
      <img src={src} alt={title} loading={loading} className="block h-full w-full object-contain" />
    ) : (
      // Le titre est déjà rendu en toutes lettres par les deux appelants : le
      // monogramme n'apporte rien à un lecteur d'écran.
      <div
        aria-hidden="true"
        className="flex h-full w-full items-center justify-center"
        style={{
          backgroundImage:
            'repeating-linear-gradient(135deg, var(--color-line-soft) 0 1px, transparent 1px 12px)',
        }}
      >
        <span className="text-[clamp(30px,5vw,58px)] font-black tracking-[-.04em] text-line">
          {initialsOf(title)}
        </span>
      </div>
    )}
  </div>
);

export default ProjectCover;
