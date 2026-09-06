import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';
import Reveal from '../../../components/common/Reveal';
import { imageUrl } from '../../../lib/sanity/image';
import type { SanityImage } from '../../../lib/sanity/types';

/**
 * Les captures d'un projet, en grille modulaire, cliquables pour agrandir.
 *
 * Deux tailles sont demandées au CDN : une vignette pour la grille et une
 * version large pour le zoom, plutôt que de servir l'original à chaque fois.
 */
const ProjectGallery = ({ images, title }: { images?: SanityImage[] | null; title: string }) => {
  if (!images?.length) return null;

  return (
    <div
      className="grid gap-[2px] border-2 border-line"
      style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}
    >
      {images.map((image, index) => {
        const thumb = imageUrl(image, 720);
        const full = imageUrl(image, 1800);
        if (!thumb) return null;

        return (
          <Reveal
            key={image.asset?._ref ?? index}
            variant="up"
            delay={Math.min(index, 5) * 60}
            className="flex items-center justify-center bg-surface-2"
          >
            <Zoom zoomImg={{ src: full }}>
              <img
                src={thumb}
                alt={image.alt ?? `${title} — capture ${index + 1}`}
                loading="lazy"
                className="block h-full w-full object-contain"
              />
            </Zoom>
          </Reveal>
        );
      })}
    </div>
  );
};

export default ProjectGallery;
