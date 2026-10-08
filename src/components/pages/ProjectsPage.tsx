'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import {
    ArrowTopRightOnSquareIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    CodeBracketIcon,
    XMarkIcon,
} from '@heroicons/react/24/outline';
import { ProjectsPageConfig, ProjectItem, ProjectFigure } from '@/types/page';

const markdownComponents = {
    h3: ({ children }: React.ComponentProps<'h3'>) => (
        <h3 className="text-lg font-semibold text-primary mt-7 mb-2">{children}</h3>
    ),
    h4: ({ children }: React.ComponentProps<'h4'>) => (
        <h4 className="text-base font-semibold text-primary mt-5 mb-2">{children}</h4>
    ),
    p: ({ children }: React.ComponentProps<'p'>) => <p className="mb-3 last:mb-0">{children}</p>,
    ul: ({ children }: React.ComponentProps<'ul'>) => <ul className="list-disc pl-5 mb-3 space-y-1.5">{children}</ul>,
    ol: ({ children }: React.ComponentProps<'ol'>) => <ol className="list-decimal pl-5 mb-3 space-y-1.5">{children}</ol>,
    li: ({ children }: React.ComponentProps<'li'>) => <li className="pl-1">{children}</li>,
    a: ({ ...props }) => (
        <a
            {...props}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent font-medium transition-all duration-200 rounded hover:bg-accent/10 hover:shadow-sm"
        />
    ),
    strong: ({ children }: React.ComponentProps<'strong'>) => <strong className="font-semibold text-primary">{children}</strong>,
    em: ({ children }: React.ComponentProps<'em'>) => <em className="italic">{children}</em>,
    code: ({ children }: React.ComponentProps<'code'>) => (
        <code className="px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-[0.95em]">{children}</code>
    ),
};

function metaLine(item: ProjectItem) {
    return [item.venue, item.year ? String(item.year) : undefined].filter(Boolean).join(' · ');
}

function Figure({ figure }: { figure: ProjectFigure }) {
    return (
        <figure className="flex flex-col">
            <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white p-2 sm:p-3 overflow-hidden">
                <Image
                    src={figure.src}
                    alt={figure.alt || figure.caption || ''}
                    width={figure.width}
                    height={figure.height}
                    className="w-full h-auto"
                />
            </div>
            {figure.caption && (
                <figcaption className="mt-2 text-sm leading-snug text-neutral-500">{figure.caption}</figcaption>
            )}
        </figure>
    );
}

function Tags({ tags, max }: { tags?: string[]; max?: number }) {
    if (!tags?.length) return null;
    const shown = max ? tags.slice(0, max) : tags;
    return (
        <>
            {shown.map((tag) => (
                <span
                    key={tag}
                    className="text-xs text-neutral-500 bg-neutral-50 dark:bg-neutral-800/50 px-2 py-1 rounded border border-neutral-100 dark:border-neutral-800"
                >
                    {tag}
                </span>
            ))}
        </>
    );
}

function ProjectCard({ item, index, onOpen }: { item: ProjectItem; index: number; onOpen: () => void }) {
    const thumb = item.thumbnail || item.figures?.[0];
    const meta = metaLine(item);

    return (
        <motion.button
            type="button"
            onClick={onOpen}
            aria-haspopup="dialog"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.08 * index }}
            className="group text-left flex flex-col rounded-2xl overflow-hidden bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
            {thumb && (
                <div className="relative aspect-[16/10] w-full bg-white border-b border-neutral-200 dark:border-neutral-800 overflow-hidden">
                    <Image
                        src={thumb.src}
                        alt=""
                        fill
                        sizes="(min-width: 768px) 420px, 100vw"
                        className="object-contain p-3 transition-transform duration-300 group-hover:scale-[1.03]"
                    />
                </div>
            )}
            <div className="flex flex-col flex-1 p-5">
                {meta && (
                    <span className="self-start text-[11px] font-medium uppercase tracking-wide text-accent bg-accent/10 px-2.5 py-1 rounded-full mb-3">
                        {meta}
                    </span>
                )}
                <h2 className="text-xl font-serif font-bold text-primary leading-snug">{item.short || item.title}</h2>
                {item.short && (
                    <p className="mt-1 text-sm text-neutral-500 leading-snug line-clamp-2">{item.title}</p>
                )}
                <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed line-clamp-4">
                    {item.summary}
                </p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                    <Tags tags={item.tags} max={3} />
                </div>
                <span className="mt-auto pt-4 text-sm font-medium text-accent inline-flex items-center gap-1">
                    Read more
                    <ChevronRightIcon className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </span>
            </div>
        </motion.button>
    );
}

function ProjectDetail({
    item,
    onClose,
    onPrev,
    onNext,
    prevLabel,
    nextLabel,
}: {
    item: ProjectItem;
    onClose: () => void;
    onPrev?: () => void;
    onNext?: () => void;
    prevLabel?: string;
    nextLabel?: string;
}) {
    const closeRef = useRef<HTMLButtonElement>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const [hero, ...rest] = item.figures || [];
    const meta = metaLine(item);
    const titleId = `project-title-${item.id}`;

    useEffect(() => {
        closeRef.current?.focus();
        scrollRef.current?.scrollTo({ top: 0 });
    }, [item.id]);

    return (
        <motion.div
            className="fixed inset-0 z-[60] flex items-stretch sm:items-start justify-center sm:p-6 md:p-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
        >
            <div className="absolute inset-0 bg-neutral-900/60 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
            <motion.div
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                initial={{ opacity: 0, y: 32, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 24, scale: 0.98 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="relative w-full max-w-4xl max-h-full sm:max-h-[calc(100vh-3rem)] md:max-h-[calc(100vh-5rem)] flex flex-col bg-white dark:bg-neutral-900 sm:rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden"
            >
                <div className="flex items-center justify-between gap-3 px-5 sm:px-8 py-3 border-b border-neutral-200 dark:border-neutral-800">
                    <span className="text-xs font-medium uppercase tracking-wide text-accent truncate">{meta}</span>
                    <button
                        ref={closeRef}
                        type="button"
                        onClick={onClose}
                        aria-label="Close"
                        className="shrink-0 p-1.5 rounded-lg text-neutral-500 hover:text-primary hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                    >
                        <XMarkIcon className="w-5 h-5" />
                    </button>
                </div>

                <div ref={scrollRef} className="overflow-y-auto overscroll-contain px-5 sm:px-8 py-6 sm:py-8">
                    <h2 id={titleId} className="text-2xl sm:text-3xl font-serif font-bold text-primary leading-snug mb-3">
                        {item.title}
                    </h2>
                    <div className="flex flex-wrap gap-1.5 mb-4">
                        <Tags tags={item.tags} />
                    </div>
                    <p className="text-lg text-neutral-600 dark:text-neutral-300 leading-relaxed mb-5">{item.summary}</p>

                    {(item.paper || item.code) && (
                        <div className="flex flex-wrap gap-2 mb-6">
                            {item.paper && (
                                <a
                                    href={item.paper}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 text-primary hover:bg-accent/10 hover:border-accent/40 transition-colors"
                                >
                                    <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                                    Paper
                                </a>
                            )}
                            {item.code && (
                                <a
                                    href={item.code}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 text-primary hover:bg-accent/10 hover:border-accent/40 transition-colors"
                                >
                                    <CodeBracketIcon className="w-4 h-4" />
                                    Code
                                </a>
                            )}
                        </div>
                    )}

                    {item.stats && item.stats.length > 0 && (
                        <dl className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                            {item.stats.map((stat) => (
                                <div
                                    key={stat.label}
                                    className="flex flex-col-reverse rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/40 px-4 py-3"
                                >
                                    <dt className="mt-1 text-xs text-neutral-500 leading-snug">{stat.label}</dt>
                                    <dd className="text-xl sm:text-2xl font-serif font-bold text-primary leading-tight">{stat.value}</dd>
                                </div>
                            ))}
                        </dl>
                    )}

                    {hero && (
                        <div className="mb-6">
                            <Figure figure={hero} />
                        </div>
                    )}

                    <div className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                        <ReactMarkdown components={markdownComponents}>{item.content}</ReactMarkdown>
                    </div>

                    {rest.length > 0 && (
                        <div className="mt-6 grid gap-5 grid-cols-1 md:grid-cols-2">
                            {rest.map((figure) => (
                                <div
                                    key={figure.src}
                                    className={figure.wide || rest.length === 1 ? 'md:col-span-2' : ''}
                                >
                                    <Figure figure={figure} />
                                </div>
                            ))}
                        </div>
                    )}

                    {(onPrev || onNext) && (
                        <nav
                            aria-label="Other projects"
                            className="mt-10 pt-5 border-t border-neutral-200 dark:border-neutral-800 flex justify-between gap-3"
                        >
                            {onPrev ? (
                                <button
                                    type="button"
                                    onClick={onPrev}
                                    className="inline-flex items-center gap-1 text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-accent transition-colors"
                                >
                                    <ChevronLeftIcon className="w-4 h-4" />
                                    {prevLabel}
                                </button>
                            ) : <span />}
                            {onNext ? (
                                <button
                                    type="button"
                                    onClick={onNext}
                                    className="inline-flex items-center gap-1 text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-accent transition-colors"
                                >
                                    {nextLabel}
                                    <ChevronRightIcon className="w-4 h-4" />
                                </button>
                            ) : <span />}
                        </nav>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
}

export default function ProjectsPage({ config, embedded = false }: { config: ProjectsPageConfig; embedded?: boolean }) {
    const items = useMemo(() => config.items || [], [config.items]);
    const [openId, setOpenId] = useState<string | null>(null);
    const lastTrigger = useRef<HTMLElement | null>(null);
    const openIndex = items.findIndex((i) => i.id === openId);
    const openItem = openIndex >= 0 ? items[openIndex] : null;

    const setHash = (id: string | null) => {
        if (embedded) return;
        const url = window.location.pathname + window.location.search + (id ? `#${id}` : '');
        window.history.replaceState(null, '', url);
    };

    const open = (id: string) => {
        lastTrigger.current = document.activeElement as HTMLElement | null;
        setOpenId(id);
        setHash(id);
    };

    const close = useCallback(() => {
        setOpenId(null);
        if (!embedded) {
            window.history.replaceState(null, '', window.location.pathname + window.location.search);
        }
        lastTrigger.current?.focus();
    }, [embedded]);

    // Deep links: /projects/#huddle opens that project.
    useEffect(() => {
        if (embedded) return;
        const fromHash = () => {
            const id = decodeURIComponent(window.location.hash.slice(1));
            if (id && items.some((i) => i.id === id)) setOpenId(id);
        };
        fromHash();
        window.addEventListener('hashchange', fromHash);
        return () => window.removeEventListener('hashchange', fromHash);
    }, [embedded, items]);

    // Esc to close, arrow keys to move between projects, lock page scroll while open.
    useEffect(() => {
        if (!openItem) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') close();
            if (e.key === 'ArrowRight' && openIndex < items.length - 1) {
                setOpenId(items[openIndex + 1].id);
                setHash(items[openIndex + 1].id);
            }
            if (e.key === 'ArrowLeft' && openIndex > 0) {
                setOpenId(items[openIndex - 1].id);
                setHash(items[openIndex - 1].id);
            }
        };
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        window.addEventListener('keydown', onKey);
        return () => {
            document.body.style.overflow = prevOverflow;
            window.removeEventListener('keydown', onKey);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [openItem, openIndex, close, items]);

    const go = (i: number) => {
        setOpenId(items[i].id);
        setHash(items[i].id);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
        >
            <div className={embedded ? 'mb-4' : 'mb-8'}>
                <h1 className={`${embedded ? 'text-2xl' : 'text-4xl'} font-serif font-bold text-primary mb-4`}>{config.title}</h1>
                {config.description && (
                    <div className={`${embedded ? 'text-base' : 'text-lg'} text-neutral-600 dark:text-neutral-500 max-w-2xl leading-relaxed`}>
                        <ReactMarkdown components={markdownComponents}>{config.description}</ReactMarkdown>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {items.map((item, index) => (
                    <ProjectCard key={item.id} item={item} index={index} onOpen={() => open(item.id)} />
                ))}
            </div>

            <AnimatePresence>
                {openItem && (
                    <ProjectDetail
                        key="project-detail"
                        item={openItem}
                        onClose={close}
                        onPrev={openIndex > 0 ? () => go(openIndex - 1) : undefined}
                        onNext={openIndex < items.length - 1 ? () => go(openIndex + 1) : undefined}
                        prevLabel={openIndex > 0 ? items[openIndex - 1].short || items[openIndex - 1].title : undefined}
                        nextLabel={openIndex < items.length - 1 ? items[openIndex + 1].short || items[openIndex + 1].title : undefined}
                    />
                )}
            </AnimatePresence>
        </motion.div>
    );
}
