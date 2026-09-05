import PageHeader from '../components/common/PageHeader';
import SkillGroupCard from '../features/skills/components/SkillGroupCard';
import { skillGroups } from '../features/skills/data/skillGroups';
import { useTranslation } from '../i18n/useTranslation';

const SkillsPage = () => {
  const { t } = useTranslation();

  return (
    <section className="relative mx-auto max-w-shell overflow-hidden px-6 pb-[86px] pt-[68px]">
      <PageHeader kicker={t.skillsKicker} title={t.skillsTitle} body={t.skillsBody} />

      <div
        className="relative mt-14 grid gap-[2px]"
        style={{
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          perspective: '1500px',
        }}
      >
        {skillGroups.map((group, index) => (
          <SkillGroupCard key={index} group={group} delay={index * 70} />
        ))}
      </div>
    </section>
  );
};

export default SkillsPage;
