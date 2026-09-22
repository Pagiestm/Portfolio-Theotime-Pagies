import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';
import Reveal from '../../../components/common/Reveal';
import { imageSrcSet, imageUrl } from '../../../services/sanity/image';
import type { SanityImage } from '../../../services/sanity/types';

const ProjectGallery = ({ images, title }: { images?: SanityImage[] | null; title: string }) => {
  if (!images?.length) return null;

  return (
    <div
      className="grid gap-[2px] border-2 border-line"
      style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(260px, 100%), 1fr))' }}
    >
      {images.map((image, index) => {
        const thumb = imageUrl(image, 720);
        const thumbSet = imageSrcSet(image, [400, 640, 900, 1200]);
        const full = imageUrl(image, undefined, 90);
        const fullSet = imageSrcSet(image, [1600, 2400, 3200], 90);
        if (!thumb) return null;

        return (
          <Reveal
            key={image._key ?? index}
            variant="up"
            delay={Math.min(index, 5) * 60}
            className="flex items-center justify-center bg-surface-2"
          >
            <Zoom zoomImg={{ src: full, srcSet: fullSet, sizes: '100vw' }}>
              <img
                src={thumb}
                srcSet={thumbSet}
                sizes="(max-width: 640px) 100vw, (max-width: 1000px) 50vw, 400px"
                alt={image.alt ?? `${title} - capture ${index + 1}`}
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
