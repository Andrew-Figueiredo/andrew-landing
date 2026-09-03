import { describe, expect, it } from 'vitest';
import { projects } from './projects';
import { experience } from './experience';
import { services } from './services';
import { skillGroups } from './skills';
import { areas } from './areas';

describe('áreas', () => {
  const areaIds = areas.map((a) => a.id);

  it('todo Service e todo SkillGroup com área usam uma área válida', () => {
    for (const s of services) {
      expect(areaIds).toContain(s.area);
    }
    for (const g of skillGroups) {
      if (g.area !== undefined) {
        expect(areaIds).toContain(g.area);
      }
    }
  });

  it('toda área tem pelo menos um Service', () => {
    for (const id of areaIds) {
      expect(services.some((s) => s.area === id)).toBe(true);
    }
  });
});

describe('projects', () => {
  it('mantém a distribuição prevista de 2 IA, 4 fullstack e 3 landing, com QA aditivo', () => {
    const count = (c: string) => projects.filter((p) => p.category === c).length;
    expect(count('ia')).toBe(2);
    expect(count('fullstack')).toBe(4);
    expect(count('landing')).toBe(3);
    expect(count('qa')).toBeGreaterThanOrEqual(2);
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
