import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';
import Reveal from '../../../components/common/Reveal';

/** Les captures d'un projet, en grille modulaire, cliquables pour agrandir. */
const ProjectGallery = ({ images, title }) => {
  if (!images.length) return null;

  return (
    <div
      className="grid gap-[2px] border-2 border-line"
      style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}
    >
      {images.map((src, index) => (
        <Reveal
          key={`${src}-${index}`}
          variant="up"
          delay={Math.min(index, 5) * 60}
          className="flex items-center justify-center bg-surface-2"
        >
          <Zoom>
            <img
              src={src}
              alt={`${title} — capture ${index + 1}`}
              loading="lazy"
              className="block h-full w-full object-contain"
            />
          </Zoom>
        </Reveal>
      ))}
    </div>
  );
};

export default ProjectGallery;
