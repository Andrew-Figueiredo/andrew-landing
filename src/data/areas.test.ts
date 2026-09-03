import { describe, expect, it } from 'vitest';
import { areas, areaBySlug, areaById, categoriesForArea } from './areas';

describe('areas', () => {
  it('tem as 3 áreas na ordem fullstack, ia-automacao, qa', () => {
    expect(areas.map((a) => a.id)).toEqual(['fullstack', 'ia-automacao', 'qa']);
  });

  it('cada área tem slug distinto em pt e distinto em en', () => {
    const ptSlugs = areas.map((a) => a.slug.pt);
    const enSlugs = areas.map((a) => a.slug.en);
    expect(new Set(ptSlugs).size).toBe(areas.length);
    expect(new Set(enSlugs).size).toBe(areas.length);
  });

  it('preenche os dois idiomas em label e em todo texto de hero', () => {
    for (const area of areas) {
      expect(area.label.pt.length).toBeGreaterThan(0);
      expect(area.label.en.length).toBeGreaterThan(0);
      for (const key of Object.keys(area.hero) as (keyof typeof area.hero)[]) {
        expect(area.hero[key].pt.length).toBeGreaterThan(0);
        expect(area.hero[key].en.length).toBeGreaterThan(0);
      }
    }
  });
});

describe('areaBySlug', () => {
  it('resolve a área certa a partir do slug em cada idioma', () => {
    expect(areaBySlug('pt', 'ia-automacao')?.id).toBe('ia-automacao');
    expect(areaBySlug('en', 'ai-automation')?.id).toBe('ia-automacao');
  });

  it('retorna undefined pra slug inexistente', () => {
    expect(areaBySlug('pt', 'nao-existe')).toBeUndefined();
  });
});

describe('areaById', () => {
  it('resolve a área certa a partir do id', () => {
    expect(areaById('qa').slug.pt).toBe('qa');
  });
});

describe('categoriesForArea', () => {
  it('mapeia fullstack pra fullstack e landing', () => {
    expect(categoriesForArea('fullstack')).toEqual(['fullstack', 'landing']);
  });

  it('mapeia ia-automacao só pra ia', () => {
    expect(categoriesForArea('ia-automacao')).toEqual(['ia']);
  });

  it('mapeia qa só pra qa', () => {
    expect(categoriesForArea('qa')).toEqual(['qa']);
  });
});
