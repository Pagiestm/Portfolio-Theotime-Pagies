import Reveal from '../../../components/common/Reveal';
import TiltCard from '../../../components/common/TiltCard';
import { TECH } from '../../../constants/tech';
import { useTranslation } from '../../../i18n/useTranslation';

/** Un groupe de compétences : titre en filet accent, puis logo + nom par entrée. */
const SkillGroupCard = ({ group, delay = 0 }) => {
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
          {group.items.map((item) => {
            const entry = TECH[item.tech];
            if (!entry) return null;
            const { Icon } = entry;
            const label = item.label ? localize(item.label) : entry.label;

            return (
              <li
                key={item.tech}
                className="flex items-center gap-[14px] border-b border-line-soft pb-3"
              >
                <Icon className="flex-none text-[22px] text-accent-2" aria-hidden="true" />
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
