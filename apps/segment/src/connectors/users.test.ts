import { http } from 'msw';
import { describe, expect, test, beforeEach } from 'vitest';
import { env } from '@/env';
import { server } from '../../vitest/setup-msw-handlers';
import { type SegmentUser, type Pagination, getUsers } from './users';
import type { SegmentError } from './commons/error';

const users: SegmentUser[] = [
  {
    id: `d2oLAmTuScRdhhAnrJJwN3`,
    name: `Ali Farooq`,
    email: `ali@alfabolt.com`,
  },
];

const pagination: Pagination = {
  current: '1',
  next: null,
  previous: null,
  totalEntries: users.length,
};

const validToken = env.SEGMENT_API_TOKEN;

describe('getUsers', () => {
  beforeEach(() => {
    server.use(
      http.get('https://api.segmentapis.com/users', ({ request }) => {
        if (request.headers.get('Authorization') !== `Bearer ${validToken}`) {
          return new Response(undefined, { status: 401 });
        }
        return new Response(JSON.stringify({ users, nextPage: pagination }), { status: 200 });
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
      const segmentError = error as SegmentError;
      expect(segmentError.message).toEqual('Could not retrieve users');
    }
  });

  test('should return nextPage as null when end of list is reached', async () => {
    const result = await getUsers(validToken, null);
    expect(result.nextPage.next).toBeNull();
  });
});
