import { useLoaderData } from 'react-router-dom';
import PageHeader from '../components/common/PageHeader';
import SkillGroupCard from '../features/skills/components/SkillGroupCard';
import { useTranslation } from '../i18n/useTranslation';
import type { PageHeader as PageHeaderContent, SkillGroup } from '../lib/sanity/types';

const SkillsPage = () => {
  const { localize } = useTranslation();
  const { header, groups } = useLoaderData() as {
    header?: PageHeaderContent;
    groups: SkillGroup[];
  };

  return (
    <section className="relative mx-auto max-w-shell overflow-hidden px-6 pb-[86px] pt-[68px]">
      <PageHeader
        kicker={localize(header?.kicker)}
        title={localize(header?.title)}
        body={localize(header?.body)}
      />

      <div
        className="relative mt-14 grid gap-[2px]"
        style={{
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          perspective: '1500px',
        }}
      >
        {groups.map((group, index) => (
          <SkillGroupCard key={index} group={group} delay={index * 70} />
        ))}
      </div>
    </section>
  );
};

export default SkillsPage;
