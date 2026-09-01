import { lazy, Suspense } from 'react';
import ProgressRail from '../../../components/common/ProgressRail';
import { chapters } from '../data/chapters';
import { useScrollProgress } from '../../../hooks/useScrollProgress';
import { useTranslation } from '../../../i18n/useTranslation';
import { scene } from '../../../config/site';

const HeroScene = lazy(() => import('../../scene/components/HeroScene'));

const HEADER_HEIGHT = 68;
const clamp = (v) => Math.max(0, Math.min(1, v));

/**
 * Calcule l'état visuel d'un chapitre pour une progression donnée.
 * Transcription directe de `_stage()` dans Portfolio.dc.html.
 */
const chapterState = (index, progress, count) => {
  const segment = 1 / count;
  const raw = (progress - index * segment) / segment;
  const local = index === 0 ? Math.max(raw, 0.001) : raw;

  let opacity = 0;
  let translateY = 70;

  if (local > -0.45 && local < 1.45) {
    const fadeIn = index === 0 ? 1 : clamp((local + 0.02) / 0.32);
    const fadeOut = clamp((1.1 - local) / 0.34);
    opacity = Math.min(fadeIn, fadeOut);
    const eased = clamp(local);
    translateY = index === 0 ? eased * -56 : (0.62 - eased) * -74;
  }

  // Effet « machine à écrire » : on découvre le texte de gauche à droite.
  const typed =
    index === 0 ? clamp((local + 0.345) / 0.34) : clamp((local - 0.04) / 0.42);

  return { opacity, translateY, typed, caretVisible: typed > 0.02 && typed < 0.995 };
};

const HeroStage = () => {
  const { t, localize } = useTranslation();
  const { stageRef, pinRef, progress, scrollToProgress } = useScrollProgress({
    stickyOffset: HEADER_HEIGHT,
  });

  const count = chapters.length;
  const activeIndex = Math.min(count - 1, Math.floor(progress * count + 0.0001));

  // 0.45 vise le milieu du segment du chapitre plutôt que sa toute première frame.
  const goToChapter = (index) => scrollToProgress((index + 0.45) / count);

  return (
    <section ref={stageRef} className="relative" style={{ height: '440vh' }}>
      <div
        ref={pinRef}
        className="sticky overflow-hidden border-b-2 border-line"
        style={{ top: HEADER_HEIGHT, height: `calc(100vh - ${HEADER_HEIGHT}px)`, minHeight: 540 }}
      >
        <div className="absolute inset-0">
          <Suspense fallback={null}>
            <HeroScene density={scene.density} />
          </Suspense>
        </div>

        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: `
              radial-gradient(60% 60% at 74% 46%, rgba(92,127,174,.16), transparent 70%),
              linear-gradient(90deg,rgba(1,0,1,.94) 0%,rgba(1,0,1,.66) 44%,rgba(1,0,1,.30) 72%,rgba(1,0,1,.62) 100%)`,
          }}
        />

        <div className="absolute inset-0 mx-auto max-w-shell px-6">
          {chapters.map((chapter, index) => {
            const state = chapterState(index, progress, count);
            return (
              <div
                key={index}
                className="absolute inset-x-6 top-1/2"
                style={{
                  maxWidth: 'min(620px, max(300px, 58%))',
                  containerType: 'inline-size',
                  opacity: state.opacity,
                  transform: `translateY(-50%) translate3d(0, ${state.translateY.toFixed(1)}px, 0)`,
                  pointerEvents: state.opacity > 0.65 ? 'auto' : 'none',
                }}
              >
                <div className="mb-[18px] flex items-center gap-3">
                  <span className="h-[2px] w-10 flex-none bg-accent" />
                  <span className="text-[11.5px] font-bold uppercase tracking-[.22em] text-accent-2">
                    {localize(chapter.kicker)}
                  </span>
                </div>
                <h2 className="m-0 mb-[26px] text-[clamp(34px,12cqw,86px)] font-black leading-[.94] tracking-[-.045em]">
                  {localize(chapter.title)}
                </h2>
                <div className="max-w-[46ch] border-l-2 border-accent py-1 pl-5">
                  <span
                    className="inline-block text-[clamp(15px,1.3vw,19px)] text-muted"
                    style={{ clipPath: `inset(0 ${((1 - state.typed) * 100).toFixed(1)}% -0.2em 0)` }}
                  >
                    {localize(chapter.bubble)}
                  </span>
                  <span
                    aria-hidden="true"
                    className="ml-[3px] inline-block h-[1.05em] w-[9px] bg-accent-2 align-[-0.18em]"
                    style={{ opacity: state.caretVisible ? 1 : 0 }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <ProgressRail
          hint={t.scrollHint}
          index={activeIndex}
          total={count}
          progress={progress}
        />

        <div className="absolute top-1/2 flex -translate-y-1/2 flex-col gap-[10px] right-[clamp(24px,4vw,60px)]">
          {chapters.map((chapter, index) => (
            <button
              key={index}
              type="button"
              onClick={() => goToChapter(index)}
              aria-label={localize(chapter.kicker)}
              className={`h-3 w-3 cursor-pointer border-2 p-0 transition-colors duration-200 ${
                index === activeIndex ? 'border-accent bg-accent' : 'border-line bg-transparent hover:border-accent'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroStage;
