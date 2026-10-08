'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import { ArrowTopRightOnSquareIcon, CodeBracketIcon } from '@heroicons/react/24/outline';
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
    blockquote: ({ children }: React.ComponentProps<'blockquote'>) => (
        <blockquote className="border-l-4 border-accent/50 pl-4 italic my-4 text-neutral-600 dark:text-neutral-500">
            {children}
        </blockquote>
    ),
    strong: ({ children }: React.ComponentProps<'strong'>) => <strong className="font-semibold text-primary">{children}</strong>,
    em: ({ children }: React.ComponentProps<'em'>) => <em className="italic">{children}</em>,
    code: ({ children }: React.ComponentProps<'code'>) => (
        <code className="px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-[0.95em]">{children}</code>
    ),
};

function Figure({ figure, priority = false }: { figure: ProjectFigure; priority?: boolean }) {
    return (
        <figure className="flex flex-col">
            <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white p-2 sm:p-3 overflow-hidden">
                <Image
                    src={figure.src}
                    alt={figure.alt || figure.caption || ''}
                    width={figure.width}
                    height={figure.height}
                    priority={priority}
                    className="w-full h-auto"
                />
            </div>
            {figure.caption && (
                <figcaption className="mt-2 text-sm leading-snug text-neutral-500 dark:text-neutral-500">
                    {figure.caption}
                </figcaption>
            )}
        </figure>
    );
}

function Project({ item, index, embedded }: { item: ProjectItem; index: number; embedded: boolean }) {
    const [hero, ...rest] = item.figures || [];
    const meta = [item.venue, item.year ? String(item.year) : undefined].filter(Boolean).join(' · ');

    return (
        <motion.article
            id={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 * Math.min(index, 3) }}
            className="scroll-mt-24"
        >
            <div className="flex flex-wrap items-center gap-2 mb-3">
                {meta && (
                    <span className="text-xs font-medium uppercase tracking-wide text-accent bg-accent/10 px-2.5 py-1 rounded-full">
                        {meta}
                    </span>
                )}
                {item.tags?.map((tag) => (
                    <span
                        key={tag}
                        className="text-xs text-neutral-500 bg-neutral-50 dark:bg-neutral-800/50 px-2 py-1 rounded border border-neutral-100 dark:border-neutral-800"
                    >
                        {tag}
                    </span>
                ))}
            </div>

            <h2 className={`${embedded ? 'text-xl' : 'text-2xl sm:text-3xl'} font-serif font-bold text-primary leading-snug mb-3`}>
                {item.title}
            </h2>

            <p className={`${embedded ? 'text-base' : 'text-lg'} text-neutral-600 dark:text-neutral-500 leading-relaxed mb-4`}>
                {item.summary}
            </p>

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
                            className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-4 py-3"
                        >
                            <dd className="text-xl sm:text-2xl font-serif font-bold text-primary leading-tight">{stat.value}</dd>
                            <dt className="mt-1 text-xs text-neutral-500 leading-snug">{stat.label}</dt>
                        </div>
                    ))}
                </dl>
            )}

            {hero && (
                <div className="mb-6">
                    <Figure figure={hero} priority={index === 0} />
                </div>
            )}

            <div className="text-neutral-700 dark:text-neutral-600 leading-relaxed">
                <ReactMarkdown components={markdownComponents}>{item.content}</ReactMarkdown>
            </div>

            {rest.length > 0 && (
                <div className="mt-6 grid gap-5 grid-cols-1 md:grid-cols-2">
                    {rest.map((figure) => (
                        <div
                            key={figure.src}
                            className={figure.wide ? 'md:col-span-2' : rest.length === 1 ? 'md:col-span-2 md:max-w-2xl md:mx-auto w-full' : ''}
                        >
                            <Figure figure={figure} />
                        </div>
                    ))}
                </div>
            )}
        </motion.article>
    );
}

export default function ProjectsPage({ config, embedded = false }: { config: ProjectsPageConfig; embedded?: boolean }) {
    const items = config.items || [];

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
                {items.length > 1 && (
                    <nav aria-label="Projects" className="mt-5 flex flex-wrap gap-2">
                        {items.map((item) => (
                            <a
                                key={item.id}
                                href={`#${item.id}`}
                                className="text-sm px-3 py-1.5 rounded-full border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-accent hover:border-accent/40 hover:bg-accent/10 transition-colors"
                            >
                                {item.short || item.title}
                            </a>
                        ))}
                    </nav>
                )}
            </div>

            <div className="space-y-14 divide-y divide-neutral-200 dark:divide-neutral-800 [&>*+*]:pt-14">
                {items.map((item, index) => (
                    <Project key={item.id} item={item} index={index} embedded={embedded} />
                ))}
            </div>
        </motion.div>
    );
}
