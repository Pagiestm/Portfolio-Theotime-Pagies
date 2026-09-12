import ActionLink from '../../../components/common/ActionLink';
import Reveal from '../../../components/common/Reveal';
import { techIcon } from '../../../constants/tech';
import { useTranslation } from '../../../i18n/useTranslation';
import { paths } from '../../../routes/paths';
import type { TechnologyUsage } from '../../../utils/topTechnologies';

const TechBand = ({ items }: { items: TechnologyUsage[] }) => {
  const { t } = useTranslation();

  return (
    <>
      <div className="grid grid-cols-2 gap-[2px] sm:grid-cols-3 md:grid-cols-5">
        {items.map((tech, index) => {
          const Icon = techIcon(tech.iconKey);
          return (
            <Reveal key={tech.label} variant="up" delay={index * 40}>
              <div className="flex h-full flex-col gap-4 border-2 border-line bg-surface p-5 transition-colors hover:border-accent">
                <span className="text-accent">{Icon ? <Icon size={24} /> : null}</span>
                <div>
                  <div className="text-[15px] font-extrabold tracking-[-.01em] text-ink">
                    {tech.label}
                  </div>
                  <div className="mt-1 text-[11px] uppercase tracking-[.16em] text-muted">
                    {tech.count} {t.stackHint}
                  </div>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>

      <div className="mt-9 flex justify-end">
        <ActionLink to={paths.skills} variant="outline">
          {t.seeSkills}
        </ActionLink>
      </div>
    </>
  );
};

export default TechBand;
