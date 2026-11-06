import Reveal from '../../../components/common/Reveal';
import { useTranslation } from '../../../i18n/useTranslation';
import type { Testimonial } from '../../../services/sanity/types';

const Testimonials = ({
  items,
  title,
  hideTitle = false,
  className = '',
}: {
  items: Testimonial[];
  title?: string;
  hideTitle?: boolean;
  className?: string;
}) => {
  const { t, localize } = useTranslation();

  if (items.length === 0) return null;

  return (
    <section className={className}>
      {hideTitle ? null : (
        <h2 className="m-0 mb-5 border-b-2 border-line pb-[14px] text-[12.5px] font-bold uppercase tracking-[.2em] text-accent-2">
          {title ?? t.testimonials}
        </h2>
      )}

      <div
        className="grid gap-[2px]"
        style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(440px, 100%), 1fr))' }}
      >
        {items.map((item, index) => (
          <Reveal key={item._id} variant="up" delay={index * 60}>
            <figure className="m-0 flex h-full flex-col gap-5 border-2 border-line bg-surface p-6">
              <blockquote className="m-0 flex-1 text-[15.5px] leading-[1.65] text-muted">
                {localize(item.quote)}
              </blockquote>
              <figcaption className="border-t-2 border-line pt-4">
                <div className="text-[15px] font-extrabold tracking-[-.01em] text-ink">
                  {item.author}
                </div>
                <div className="mt-1 text-[13.5px] text-muted">{localize(item.role)}</div>
                {item.relation ? (
                  <div className="mt-2 text-[11px] font-bold uppercase tracking-[.16em] text-accent-2">
                    {localize(item.relation)}
                  </div>
                ) : null}
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;
