import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { parseContactRequest } from '../src/models/contact.model.ts';
import { HttpError } from '../src/models/errors.model.ts';

const valide = { name: 'Alice', email: 'alice@exemple.fr', message: 'Bonjour' };

const refus = (body: unknown, motif: string) => {
  assert.throws(
    () => parseContactRequest(body),
    (error: unknown) => error instanceof HttpError && error.status === 400,
    motif
  );
};

describe('parseContactRequest', () => {
  it('accepte un message complet et nettoie les espaces', () => {
    const request = parseContactRequest({ ...valide, name: '  Alice  ' });
    assert.equal(request.name, 'Alice');
    assert.equal(request.automated, false);
  });

  it('refuse un corps qui n’est pas un objet', () => {
    refus(null, 'null accepté');
    refus('texte', 'chaîne acceptée');
  });

  it('refuse un champ vide ou absent', () => {
    refus({ ...valide, name: '   ' }, 'nom vide accepté');
    refus({ ...valide, message: undefined }, 'message absent accepté');
  });

  it('refuse une adresse mal formée', () => {
    refus({ ...valide, email: 'alice arobase exemple' }, 'adresse invalide acceptée');
  });

  it('refuse un message démesuré', () => {
    refus({ ...valide, message: 'a'.repeat(5001) }, 'message trop long accepté');
  });

  it('signale un envoi automatisé quand le champ piège est rempli', () => {
    const request = parseContactRequest({ ...valide, trap: 'https://spam.example' });
    assert.equal(request.automated, true);
  });

  it('ignore un champ piège vide', () => {
    assert.equal(parseContactRequest({ ...valide, trap: '  ' }).automated, false);
  });

  it('retient la langue du site, français par défaut', () => {
    assert.equal(parseContactRequest(valide).lang, 'fr');
    assert.equal(parseContactRequest({ ...valide, lang: 'en' }).lang, 'en');
    assert.equal(parseContactRequest({ ...valide, lang: 'kr' }).lang, 'fr');
  });
});
