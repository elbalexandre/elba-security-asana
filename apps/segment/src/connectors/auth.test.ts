import { http } from 'msw';
import { describe, expect, test, beforeEach } from 'vitest';
import { env } from '@/env';
import { server } from '../../vitest/setup-msw-handlers';
import { validateToken } from './auth';

const validToken = env.SEGMENT_API_TOKEN;

describe('validateToken', () => {
  beforeEach(() => {
    server.use(
      http.get('https://api.segmentapis.com/echo', ({ request }) => {
        if (request.headers.get('Authorization') !== `Bearer ${validToken}`) {
          return new Response(undefined, { status: 401 });
        }
        return new Response();
      })
    );
  });

  test('should return status code 200 when token is valid', async () => {
    const result = await validateToken(validToken);
    expect(result).toEqual(200);
  });

  test('should return status code 403 when token is invalid', async () => {
    const result = await validateToken('invalidToken');
    expect(result).toEqual(401);
  });
});
