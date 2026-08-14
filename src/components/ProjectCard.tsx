import type { Locale } from '@/i18n';
import type { Project } from '@/data/types';

// Card tipográfico: nunca depende de imagem, e link ausente significa botão ausente.
export function ProjectCard({
  project,
  lang,
  labels,
}: {
  project: Project;
  lang: Locale;
  labels: { repo: string; demo: string; category: string };
}) {
  return (
    <article className="flex h-full flex-col border border-line p-5 transition-colors hover:border-accent">
      {project.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={project.image} alt="" className="mb-4 h-36 w-full rounded object-cover" />
      ) : null}

      <div className="font-mono flex items-center justify-between text-[0.65rem] uppercase tracking-wider">
        <span className="text-accent">{labels.category}</span>
        <span className="text-muted">{project.year}</span>
      </div>

      <h3 className="font-head mt-3 text-base font-semibold">{project.title[lang]}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{project.description[lang]}</p>

      <ul className="mt-4 flex flex-wrap gap-1.5">
        {project.stack.map((tech) => (
          <li
            key={tech}
            className="font-mono rounded border border-line px-1.5 py-0.5 text-[0.65rem] text-muted"
          >
            {tech}
          </li>
        ))}
      </ul>

      {(project.repoUrl || project.demoUrl) && (
        <div className="mt-4 flex gap-4 text-sm font-medium">
          {project.repoUrl && (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline"
            >
              {labels.repo} ↗
            </a>
          )}
          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline"
            >
              {labels.demo} ↗
            </a>
          )}
        </div>
      )}
    </article>
  );
}
