import { FormEvent, Fragment, ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaCommentDots } from 'react-icons/fa';
import { usePrefersReducedMotion } from '../../../hooks/useMediaQuery';
import { useTranslation } from '../../../i18n/useTranslation';
import { useAssistant, type AssistantMessage } from '../hooks/useAssistant';
import { useTypewriter } from '../hooks/useTypewriter';

const LINK = /\[([^\]]+)\]\((\/[^)\s]*|https?:\/\/[^)\s]+)\)/g;

const BOLD = /\*\*([^*]+)\*\*/g;

const withBold = (text: string, keyPrefix: string): ReactNode[] =>
  text.split(BOLD).map((part, i) =>
    i % 2 === 1 ? (
      <strong key={`${keyPrefix}-b${i}`} className="font-bold text-ink">
        {part}
      </strong>
    ) : (
      part
    )
  );

/**
 * Le modèle répond en texte avec des liens Markdown vers les pages du site.
 * On ne rend que cela, pas un moteur Markdown complet : un lien interne
 * devient une navigation React Router, un lien externe un `<a>`.
 */
const renderAnswer = (text: string, onNavigate: () => void): ReactNode =>
  text.split('\n').map((line, i) => {
    const nodes: ReactNode[] = [];
    let last = 0;
    for (const match of line.matchAll(LINK)) {
      const [raw, label, href] = match;
      nodes.push(...withBold(line.slice(last, match.index), `${i}-${match.index}`));
      nodes.push(
        href.startsWith('/') ? (
          <Link
            key={`${i}-${match.index}`}
            to={href}
            onClick={onNavigate}
            className="border-b border-accent text-accent-2 hover:text-ink"
          >
            {label}
          </Link>
        ) : (
          <a
            key={`${i}-${match.index}`}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="border-b border-accent text-accent-2 hover:text-ink"
          >
            {label}
          </a>
        )
      );
      last = (match.index ?? 0) + raw.length;
    }
    nodes.push(...withBold(line.slice(last), `${i}-end`));
    const bullet = /^\s*[-*•]\s+/.test(line);
    return (
      <Fragment key={i}>
        {bullet ? (
          <span className="mr-2 inline-block h-[6px] w-[6px] bg-accent align-middle" />
        ) : null}
        {bullet
          ? nodes.map((n) => (typeof n === 'string' ? n.replace(/^\s*[-*•]\s+/, '') : n))
          : nodes}
        {i < text.split('\n').length - 1 ? <br /> : null}
      </Fragment>
    );
  });

/** Trois carrés qui pulsent en décalé pendant que la réponse se prépare. */
const Thinking = ({ label, animate }: { label: string; animate: boolean }) => (
  <div className="flex items-center gap-3 text-[12px] uppercase tracking-[.16em] text-muted">
    {label}
    <span className="flex gap-[4px]" aria-hidden>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className={`block h-[7px] w-[7px] bg-accent ${animate ? 'animate-pulse' : ''}`}
          style={{ animationDelay: `${i * 160}ms` }}
        />
      ))}
    </span>
  </div>
);

const Message = ({
  message,
  animate,
  onNavigate,
  onProgress,
  onDone,
}: {
  message: AssistantMessage;
  animate: boolean;
  onNavigate: () => void;
  onProgress: () => void;
  onDone: (id: number) => void;
}) => {
  const { t } = useTranslation();
  const mine = message.role === 'user';
  const { visible, done } = useTypewriter(message.text, animate && !mine);

  useEffect(() => {
    if (done) onDone(message.id);
    else onProgress();
  }, [visible, done, onProgress, onDone, message.id]);

  return (
    <div className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[88%] border-2 px-4 py-3 text-[14.5px] leading-relaxed ${
          mine ? 'border-line bg-surface text-ink' : 'border-accent bg-surface-2 text-ink'
        }`}
      >
        {mine ? message.text : renderAnswer(visible, onNavigate)}
        {!done && (
          <span
            className="ml-[2px] inline-block h-[14px] w-[7px] animate-pulse bg-accent align-middle"
            aria-hidden
          />
        )}
        {done && message.sources && message.sources.length > 0 && (
          <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-line pt-3">
            <span className="text-[10px] font-bold uppercase tracking-[.16em] text-muted">
              {t.assistantSources}
            </span>
            {message.sources.map((s) => (
              <Link
                key={s.path}
                to={s.path}
                onClick={onNavigate}
                className="border border-line px-2 py-[3px] text-[11px] font-semibold uppercase tracking-[.06em] text-muted hover:border-accent hover:text-ink"
              >
                {s.title}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const AssistantWidget = () => {
  const { t, lang } = useTranslation();
  const { messages, status, errorCode, ask, reset } = useAssistant(lang);
  const reduced = usePrefersReducedMotion();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  /**
   * Seule la réponse qui vient d'arriver s'écrit progressivement ; celles déjà
   * lues restent entières, y compris après une réouverture du panneau. La
   * décision se prend pendant le rendu, pas dans un effet : la machine à écrire
   * fixe son point de départ au premier rendu du message.
   */
  const seen = useRef(new Set<number>());
  const last = messages[messages.length - 1];
  const typingId =
    !reduced && last?.role === 'assistant' && !seen.current.has(last.id) ? last.id : null;
  const markSeen = useCallback((id: number) => {
    seen.current.add(id);
  }, []);

  const scrollToEnd = useCallback(() => endRef.current?.scrollIntoView({ block: 'end' }), []);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    scrollToEnd();
  }, [messages, status, scrollToEnd]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    ask(draft);
    setDraft('');
  };

  const close = () => setOpen(false);

  return (
    <>
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label={t.assistantOpen}
          className="fixed bottom-4 right-4 z-[50] flex h-12 w-12 cursor-pointer items-center justify-center border-2 border-accent bg-accent text-ink transition-colors hover:bg-transparent hover:text-accent-2 sm:bottom-6 sm:right-6 sm:h-auto sm:w-auto sm:gap-3 sm:px-4 sm:py-3 sm:text-[12px] sm:font-bold sm:uppercase sm:tracking-[.1em]"
        >
          <FaCommentDots size={18} aria-hidden className="sm:hidden" />
          <span className="hidden h-[8px] w-[8px] bg-ink sm:inline-block" aria-hidden />
          <span className="hidden sm:inline">{t.assistantOpen}</span>
        </button>
      )}

      {/*
       * Même mécanique que le menu mobile du Header : le panneau reste monté et
       * glisse depuis la droite par transition CSS, ce qui anime aussi la
       * fermeture. `inert` le retire du focus et des lecteurs d'écran quand il
       * est fermé.
       */}
      <div
        role="presentation"
        onClick={close}
        className={`fixed inset-0 z-[90] bg-bg/70 ${reduced ? '' : 'transition-opacity duration-300'} ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />
      <section
        role="dialog"
        aria-modal={open}
        aria-labelledby="assistant-title"
        inert={!open}
        className={`fixed inset-y-0 right-0 z-[100] flex h-[100dvh] w-full flex-col border-l-2 border-line bg-surface-2 sm:w-[440px] ${
          reduced ? '' : 'transition-transform duration-300 ease-in-out'
        } ${open ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <header className="flex items-start justify-between gap-4 border-b-2 border-line px-4 py-4 sm:px-6 sm:py-5">
          <div>
            <div className="mb-2 text-[11px] font-bold uppercase tracking-[.2em] text-accent-2">
              {t.assistantKicker}
            </div>
            <h2 id="assistant-title" className="m-0 text-[20px] font-extrabold tracking-[-.02em]">
              {t.assistantTitle}
            </h2>
          </div>
          <button
            type="button"
            onClick={close}
            className="cursor-pointer border-2 border-line px-3 py-2 text-[11px] font-bold uppercase tracking-[.1em] text-muted hover:border-accent hover:text-ink"
          >
            {t.assistantClose}
          </button>
        </header>

        <div
          className="flex-1 space-y-4 overflow-y-auto px-4 py-4 sm:px-6 sm:py-5"
          aria-live="polite"
        >
          {messages.length === 0 && (
            <div>
              <p className="m-0 mb-5 text-[14.5px] text-muted">{t.assistantIntro}</p>
              <div className="flex flex-col gap-2">
                {t.assistantSuggestions.map((s: string) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => ask(s)}
                    className="cursor-pointer border-2 border-line px-4 py-3 text-left text-[13.5px] text-ink transition-colors hover:border-accent"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m) => (
            <Message
              key={m.id}
              message={m}
              animate={m.id === typingId}
              onNavigate={close}
              onProgress={scrollToEnd}
              onDone={markSeen}
            />
          ))}

          {status === 'loading' && <Thinking label={t.assistantThinking} animate={!reduced} />}
          {status === 'error' && errorCode && (
            <p className="m-0 text-[14px] text-accent-2" role="alert">
              {t.assistantErrors[errorCode]}
            </p>
          )}
          <div ref={endRef} />
        </div>

        <form
          onSubmit={submit}
          className="border-t-2 border-line px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4 sm:px-6"
        >
          <label htmlFor="assistant-input" className="sr-only">
            {t.assistantTitle}
          </label>
          <div className="flex gap-[2px]">
            <input
              id="assistant-input"
              ref={inputRef}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              maxLength={300}
              placeholder={t.assistantPlaceholder}
              disabled={status === 'loading'}
              className="min-w-0 flex-1 border-2 border-line bg-surface px-4 py-3 text-[14px] text-ink outline-none placeholder:text-muted focus:border-accent disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={status === 'loading' || !draft.trim()}
              className="cursor-pointer border-2 border-accent bg-accent px-4 text-[12px] font-bold uppercase tracking-[.1em] text-ink hover:bg-transparent hover:text-accent-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {t.assistantSend}
            </button>
          </div>
          <div className="mt-3 flex items-center justify-between gap-3 text-[11px] text-muted">
            <span>{t.assistantDisclaimer}</span>
            {messages.length > 0 && (
              <button
                type="button"
                onClick={reset}
                className="cursor-pointer whitespace-nowrap font-bold uppercase tracking-[.1em] underline underline-offset-4 hover:text-ink"
              >
                {t.assistantNew}
              </button>
            )}
          </div>
        </form>
      </section>
    </>
  );
};

export default AssistantWidget;
