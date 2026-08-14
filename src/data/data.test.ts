import { describe, expect, it } from 'vitest';
import { projects } from './projects';
import { experience } from './experience';
import { services } from './services';
import { skillGroups } from './skills';

describe('posicionamento', () => {
  it('mantém três frentes principais e a qualidade como única secundária', () => {
    expect(services.filter((s) => s.weight === 'primary').map((s) => s.id)).toEqual([
      'dev',
      'ai',
      'automation',
    ]);
    expect(services.filter((s) => s.weight === 'secondary').map((s) => s.id)).toEqual(['quality']);
  });

  it('põe a qualidade depois das três frentes na ordem das skills', () => {
    const ordem = skillGroups.map((g) => g.id);
    const qualidade = ordem.indexOf('quality');
    for (const frente of ['web', 'backend', 'ai', 'automation']) {
      expect(qualidade).toBeGreaterThan(ordem.indexOf(frente));
    }
    // E antes dos grupos de apoio, senão fica enterrada.
    for (const apoio of ['data', 'infra', 'methods']) {
      expect(qualidade).toBeLessThan(ordem.indexOf(apoio));
    }
  });
});

describe('projects', () => {
  it('mantém a distribuição prevista de 2 IA, 4 fullstack e 3 landing', () => {
    const count = (c: string) => projects.filter((p) => p.category === c).length;
    expect(count('ia')).toBe(2);
    expect(count('fullstack')).toBe(4);
    expect(count('landing')).toBe(3);
  });

  it('tem exatamente 6 projetos em destaque', () => {
    expect(projects.filter((p) => p.featured)).toHaveLength(6);
  });

  it('não repete id', () => {
    const ids = projects.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('nunca guarda link vazio, que viraria botão morto', () => {
    for (const p of projects) {
      expect(p.repoUrl ?? 'ok').not.toBe('');
      expect(p.demoUrl ?? 'ok').not.toBe('');
    }
  });

  it('preenche os dois idiomas em título e descrição', () => {
    for (const p of projects) {
      expect(p.title.pt.length).toBeGreaterThan(0);
      expect(p.title.en.length).toBeGreaterThan(0);
      expect(p.description.pt.length).toBeGreaterThan(0);
      expect(p.description.en.length).toBeGreaterThan(0);
    }
  });
});

describe('experience', () => {
  it('marca como atuais apenas CODATA e Keep Chat', () => {
    const current = experience
      .filter((e) => e.current)
      .map((e) => e.id)
      .sort();
    expect(current).toEqual(['codata', 'keepchat']);
  });

  it('agrupa os três cargos da ENACOM num bloco só', () => {
    const enacom = experience.find((e) => e.id === 'enacom');
    expect(enacom?.roles).toHaveLength(3);
  });

  it('não deixa nenhum item sem bullets', () => {
    for (const item of experience) {
      for (const role of item.roles) {
        expect(role.bullets.length).toBeGreaterThan(0);
      }
    }
  });
});
