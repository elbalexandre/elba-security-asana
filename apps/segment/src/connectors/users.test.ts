/**
 * DISCLAIMER:
 * The tests provided in this file are specifically designed for the `auth` connectors function.
 * Theses tests exists because the services & inngest functions using this connector mock it.
 * If you are using an SDK we suggest you to mock it not to implements calls using msw.
 * These file illustrate potential scenarios and methodologies relevant for SaaS integration.
 */

import { http } from 'msw';
import { describe, expect, test, beforeEach } from 'vitest';
import { server } from '../../vitest/setup-msw-handlers';
import { type SegmentUser, type Pagination, getUsers } from './users';
import type { SegmentError } from './commons/error';

const validToken = 'sgp_i49ylsHhZVox3nltdx1NTAOkUPvjuSSoEYfSAxJQ2RbiG4NQerHKnBKNcexuw36F';

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

  test('should return nextPage.next as null when end of list is reached', async () => {
    const result = await getUsers(validToken, null);
    expect(result.nextPage.next).toBeNull();
  });
});
