import { http } from 'msw';
import { describe, expect, test, beforeEach } from 'vitest';
import { server } from '../../vitest/setup-msw-handlers';
import { type SegmentUser, getUsers } from './users';
import type { SegmentError } from './commons/error';

const validToken = 'sgp_i49ylsHhZVox3nltdx1NTAOkUPvjuSSoEYfSAxJQ2RbiG4NQerHKnBKNcexuw36F';

const users: SegmentUser[] = [
  {
    id: `d2oLAmTuScRdhhAnrJJwN3`,
    name: `Ali Farooq`,
    email: `ali@alfabolt.com`,
  },
];

describe('getUsers', () => {
  beforeEach(() => {
    server.use(
      http.get('https://api.segmentapis.com/users', ({ request }) => {
        if (request.headers.get('Authorization') !== `Bearer ${validToken}`) {
          return new Response(undefined, { status: 401 });
        }
        return new Response(JSON.stringify({ users }), { status: 200 });
      })
    );
  });

  test('should fetch users when token is valid', async () => {
    const result = await getUsers(validToken, null);
    expect(result.users).toEqual(users);
  });

  test('should throw SegmentError when token is invalid', async () => {
    try {
      await getUsers('invalidToken', null);
    } catch (error) {
      const SegmentError = error as SegmentError;
      expect(SegmentError.message).toEqual('Could not retrieve users');
    }
  });
});
