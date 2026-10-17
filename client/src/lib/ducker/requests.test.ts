import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { exchangeCode, fetchProfile } from '@/lib/ducker/requests';

const config = {
  issuer: 'http://localhost:3000',
  clientId: 'game-client',
  scope: 'openid',
  profileUrl: 'http://localhost:3000/profile',
};

const fetchMock = vi.fn();
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });

describe('requests', () => {
  beforeEach(() => {
    fetchMock.mockReset();
    vi.stubGlobal('fetch', fetchMock);
  });
  afterEach(() => vi.unstubAllGlobals());

  it('POSTs the token form without a client_secret and with a timeout signal', async () => {
    fetchMock.mockResolvedValue(json({ access_token: 'at' }));
    await expect(exchangeCode(config, 'c1', 'v1')).resolves.toEqual({ accessToken: 'at' });
    const [url, init] = fetchMock.mock.calls[0]!;
    expect(String(url)).toBe('http://localhost:3000/oauth/token');
    expect(init.method).toBe('POST');
    expect(init.signal).toBeInstanceOf(AbortSignal);
    const body = new URLSearchParams(init.body as URLSearchParams);
    expect(Object.fromEntries(body)).toEqual({
      grant_type: 'authorization_code',
      code: 'c1',
      code_verifier: 'v1',
      redirect_uri: `${window.location.origin}/`,
      client_id: 'game-client',
    });
    expect(body.has('client_secret')).toBe(false);
  });

  it('throws on a non-ok token response', async () => {
    fetchMock.mockResolvedValue(json({}, 400));
    await expect(exchangeCode(config, 'c', 'v')).rejects.toThrow('token_exchange_failed_400');
  });

  it('throws when a 200 response has no string access_token', async () => {
    fetchMock.mockResolvedValue(json({ access_token: 5 }));
    await expect(exchangeCode(config, 'c', 'v')).rejects.toThrow();
    fetchMock.mockResolvedValue(json({}));
    await expect(exchangeCode(config, 'c', 'v')).rejects.toThrow();
  });

  it.each([null, { sub: '' }, { sub: 'u1', name: 5 }, { sub: 'u1', email_verified: 'yes' }])(
    'rejects a malformed userinfo body (%o)',
    async (body) => {
      fetchMock.mockResolvedValue(json(body));
      await expect(fetchProfile(config, 'at')).rejects.toThrow('userinfo_invalid');
    },
  );

  it('accepts a minimal valid userinfo', async () => {
    fetchMock.mockResolvedValue(json({ sub: 'u1' }));
    await expect(fetchProfile(config, 'at')).resolves.toEqual({ sub: 'u1' });
  });

  it('fetches userinfo with the bearer token and a timeout signal; non-ok throws', async () => {
    fetchMock.mockResolvedValue(json({ sub: 'u1' }));
    await expect(fetchProfile(config, 'at')).resolves.toEqual({ sub: 'u1' });
    const [url, init] = fetchMock.mock.calls[0]!;
    expect(String(url)).toBe('http://localhost:3000/oauth/userinfo');
    expect(init.headers).toEqual({ Authorization: 'Bearer at' });
    expect(init.signal).toBeInstanceOf(AbortSignal);
    fetchMock.mockResolvedValue(json({}, 401));
    await expect(fetchProfile(config, 'at')).rejects.toThrow('userinfo_failed_401');
  });
});
