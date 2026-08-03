import { Mail } from 'lucide-react';
import { getDictionary, type Locale } from '@/i18n';
import { profile } from '@/data/profile';
import { GithubIcon, LinkedinIcon } from '@/components/icons/BrandIcons';
import { Reveal } from '@/components/Reveal';
import { SectionHeading } from '@/components/SectionHeading';

// Sem formulário: mailto, LinkedIn e GitHub.
export function Contact({ lang }: { lang: Locale }) {
  const t = getDictionary(lang);

  const links = [
    {
      href: `mailto:${profile.email}`,
      icon: <Mail size={18} className="text-accent" aria-hidden />,
      label: t.contact.email,
      value: profile.email,
      external: false,
    },
    {
      href: profile.linkedin,
      icon: <LinkedinIcon size={18} className="text-accent" />,
      label: 'LinkedIn',
      value: 'andrew-figueiredo',
      external: true,
    },
    {
      href: profile.github,
      icon: <GithubIcon size={18} className="text-accent" />,
      label: 'GitHub',
      value: 'Andrew-Figueiredo',
      external: true,
    },
  ];

  return (
    <section className="border-t border-line">
      <div className="mx-auto max-w-5xl px-6 py-16">
        <Reveal>
          <SectionHeading id="contato" label={t.sections.contactTitle} />
          <p className="mb-8 max-w-[52ch] text-base text-muted">{t.contact.intro}</p>
          <ul className="grid gap-4 sm:grid-cols-3">
            {links.map(({ href, icon, label, value, external }) => (
              <li key={label}>
                <a
                  href={href}
                  {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  className="flex items-center gap-3 border border-line p-4 transition-colors hover:border-accent"
                >
                  {icon}
                  <span>
                    <span className="block text-sm font-medium">{label}</span>
                    <span className="block text-sm text-muted">{value}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
