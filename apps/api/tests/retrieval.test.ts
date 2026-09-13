import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import type { Corpus, Project } from '../src/models/content.model.ts';
import { buildContext, selectProjects, tokenize } from '../src/services/retrieval.service.ts';

const project = (slug: string, stack: string[], summary: string, endDate: string): Project => ({
  title: slug,
  slug,
  category: 'school',
  stack,
  summary: { fr: summary },
  contentFr: '',
  endDate,
});

const projects = [
  project('solidhive', ['NestJS', 'Stripe'], 'Dons et billets payés avec Stripe.', '2026-05-01'),
  project('mygpt', ['NestJS', 'Vue.js'], 'Assistant conversationnel.', '2025-05-01'),
  project('pendu', ['React'], 'Jeu du pendu.', '2024-02-01'),
];

describe('tokenize', () => {
  it('ignore la casse, les accents et les mots courts', () => {
    assert.deepEqual(tokenize('A-t-il déjà mis Stripe en production ?'), [
      'deja',
      'mis',
      'stripe',
      'production',
    ]);
  });
});

describe('selectProjects', () => {
  it('remonte les projets dont la stack ou le résumé contiennent la question', () => {
    const picked = selectProjects(projects, 'Stripe en production ?', 'fr').map((p) => p.slug);
    assert.deepEqual(picked, ['solidhive']);
  });

  it('retombe sur les plus récents quand rien ne correspond', () => {
    const picked = selectProjects(projects, 'cuisine', 'fr').map((p) => p.slug);
    assert.deepEqual(picked, ['solidhive', 'mygpt', 'pendu']);
  });
});

describe('buildContext', () => {
  it('sépare les réalisations détaillées des autres et cite leurs chemins', () => {
    const corpus: Corpus = { projects, settings: { name: 'T.', role: { fr: 'Dev' } } };
    const context = buildContext(corpus, 'NestJS', 'fr');
    const detailed = context.split('## Réalisations détaillées')[1]?.split('## Autres')[0] ?? '';
    assert.match(detailed, /\/realisations\/solidhive/);
    assert.match(detailed, /\/realisations\/mygpt/);
    assert.doesNotMatch(detailed, /\/realisations\/pendu/);
    assert.match(context, /## Autres réalisations[\s\S]*\/realisations\/pendu/);
  });
});
