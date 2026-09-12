import ActionLink from '../../../components/common/ActionLink';
import Reveal from '../../../components/common/Reveal';
import { useTranslation } from '../../../i18n/useTranslation';
import { paths } from '../../../routes/paths';
import type { JourneyEntry } from '../../../services/sanity/types';

const JourneyPreview = ({ entries }: { entries: JourneyEntry[] }) => {
  const { t, localize } = useTranslation();

  return (
    <>
      <div className="border-t-2 border-line">
        {entries.map((entry, index) => (
          <Reveal key={`${entry.org}-${index}`} variant="up" delay={index * 60}>
            <div
              className="grid items-baseline gap-x-8 gap-y-2 border-b-2 border-line py-6"
              style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}
            >
              <div className="text-[11px] uppercase tracking-[.16em] text-muted">
                {localize(entry.period)}
              </div>
              <div className="text-[11px] uppercase tracking-[.16em] text-accent-2">
                {entry.kind === 'exp' ? t.experience : t.education}
              </div>
              <div className="sm:col-span-2 lg:col-span-1">
                <div className="text-[18px] font-extrabold tracking-[-.02em] text-ink">
                  {entry.org}
                </div>
                <div className="mt-1 text-[14.5px] text-muted">{localize(entry.role)}</div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      <div className="mt-9 flex justify-end">
        <ActionLink to={paths.path} variant="outline">
          {t.seePath}
        </ActionLink>
      </div>
    </>
  );
};

export default JourneyPreview;
