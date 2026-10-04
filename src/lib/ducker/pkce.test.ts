import { expect, it } from 'vitest';
import { challengeOf, randomUrlSafeToken } from '@/lib/ducker/pkce';

it('matches the RFC 7636 appendix B vector', async () => {
  expect(await challengeOf('dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk')).toBe(
    'E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM',
  );
});

it('challenge is base64url — no +, / or = padding', async () => {
  expect(await challengeOf(randomUrlSafeToken())).toMatch(/^[A-Za-z0-9_-]+$/);
});

it('verifier is base64url and at least 43 chars (RFC 7636 §4.1)', () => {
  const verifier = randomUrlSafeToken();
  expect(verifier).toMatch(/^[A-Za-z0-9_-]+$/);
  expect(verifier.length).toBeGreaterThanOrEqual(43);
});

it('every call yields a different verifier', () => {
  expect(new Set(Array.from({ length: 20 }, () => randomUrlSafeToken())).size).toBe(20);
});

it('the same verifier always yields the same challenge', async () => {
  const verifier = randomUrlSafeToken();
  expect(await challengeOf(verifier)).toBe(await challengeOf(verifier));
});
