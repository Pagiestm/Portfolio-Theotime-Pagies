import Reveal from '../../../components/common/Reveal';
import TiltCard from '../../../components/common/TiltCard';
import { TECH } from '../../../constants/tech';
import { useTranslation } from '../../../i18n/useTranslation';
import type { SkillGroup } from '../../../lib/sanity/types';

/**
 * Un groupe de compétences : titre en filet accent, puis logo + nom par entrée.
 *
 * Volontairement sans niveau ni jauge. Une technologie sans logo connu
 * s'affiche avec son seul libellé plutôt que de disparaître.
 */
const SkillGroupCard = ({ group, delay = 0 }: { group: SkillGroup; delay?: number }) => {
  const { localize } = useTranslation();

  return (
    <Reveal variant="tilt" delay={delay} className="flex">
      <TiltCard className="flex-1 px-6 pb-8 pt-7">
        <div className="mb-[22px] flex items-center gap-3">
          <span className="h-[2px] w-[22px] flex-none bg-accent" />
          <h2 className="m-0 text-[12.5px] font-bold uppercase tracking-[.2em]">
            {localize(group.title)}
          </h2>
        </div>

        <ul className="m-0 flex list-none flex-col gap-3 p-0">
          {(group.items ?? []).map((item, index) => {
            const label = item.label ? localize(item.label) : item.tech?.label;
            if (!label) return null;
            const Icon = item.tech?.iconKey
              ? TECH[item.tech.iconKey as keyof typeof TECH]?.Icon
              : undefined;

            return (
              <li
                key={`${label}-${index}`}
                className="flex items-center gap-[14px] border-b border-line-soft pb-3"
              >
                {Icon ? (
                  <Icon className="flex-none text-[22px] text-accent-2" aria-hidden="true" />
                ) : (
                  <span className="h-[7px] w-[7px] flex-none bg-accent-2" aria-hidden="true" />
                )}
                <span className="text-[15.5px] font-semibold">{label}</span>
              </li>
            );
          })}
        </ul>
      </TiltCard>
    </Reveal>
  );
};

export default SkillGroupCard;
