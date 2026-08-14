'use client';

import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { getDictionary, type Locale } from '@/i18n';
import { projects } from '@/data/projects';
import type { ProjectCategory } from '@/data/types';
import { ProjectCard } from '@/components/ProjectCard';
import { SectionHeading } from '@/components/SectionHeading';

type Filter = 'all' | ProjectCategory;
const ORDER: ProjectCategory[] = ['ia', 'fullstack', 'landing'];

export function Projects({ lang }: { lang: Locale }) {
  const t = getDictionary(lang);
  const reduced = useReducedMotion();
  const [filter, setFilter] = useState<Filter>('all');
  const [expanded, setExpanded] = useState(false);

  const categoryLabel: Record<ProjectCategory, string> = {
    ia: t.projects.filterIa,
    fullstack: t.projects.filterFullstack,
    landing: t.projects.filterLanding,
  };

  const filters: { key: Filter; label: string }[] = [
    { key: 'all', label: t.projects.filterAll },
    { key: 'ia', label: t.projects.filterIa },
    { key: 'fullstack', label: t.projects.filterFullstack },
    { key: 'landing', label: t.projects.filterLanding },
  ];

  const sorted = [...projects].sort(
    (a, b) => ORDER.indexOf(a.category) - ORDER.indexOf(b.category) || b.year - a.year,
  );
  const byFilter = filter === 'all' ? sorted : sorted.filter((p) => p.category === filter);
  const visible = expanded ? byFilter : byFilter.slice(0, 6);

  return (
    <section className="border-t border-line bg-bg-soft">
      <div className="mx-auto max-w-5xl px-6 py-16">
        <SectionHeading id="projetos" label={t.sections.projectsTitle} />

        <div role="group" aria-label={t.projects.ariaFilter} className="mb-8 flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f.key}
              type="button"
              aria-pressed={filter === f.key}
              onClick={() => {
                setFilter(f.key);
                setExpanded(false);
              }}
              className={
                filter === f.key
                  ? 'rounded-md border border-accent bg-accent px-3 py-1.5 text-sm font-medium text-white'
                  : 'rounded-md border border-line px-3 py-1.5 text-sm font-medium text-muted transition-colors hover:border-accent hover:text-accent'
              }
            >
              {f.label}
            </button>
          ))}
        </div>

        <motion.div layout={!reduced} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {visible.map((p) => (
              <motion.div
                key={p.id}
                layout={!reduced}
                initial={reduced ? false : { opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={reduced ? undefined : { opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.2 }}
              >
                <ProjectCard
                  project={p}
                  lang={lang}
                  labels={{
                    repo: t.projects.repo,
                    demo: t.projects.demo,
                    category: categoryLabel[p.category],
                  }}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {byFilter.length > 6 && (
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="mt-8 rounded-md border border-line px-4 py-2 text-sm font-medium transition-colors hover:border-accent hover:text-accent"
          >
            {expanded ? t.projects.showLess : t.projects.showAll}
          </button>
        )}
      </div>
    </section>
  );
}
