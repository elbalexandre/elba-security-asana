/**
 * DISCLAIMER:
 * This is an example connector, the function has a poor implementation. When requesting against API endpoint we might prefer
 * to valid the response data received using zod than unsafely assign types to it.
 * This might not fit your usecase if you are using a SDK to connect to the Saas.
 * These file illustrate potential scenarios and methodologies relevant for SaaS integration.
 */

import { MySaasError } from './commons/error';

export type SegmentUser = {
  id: string;
  name: string;
  email: string;
};

type GetUsersResponseData = { users: SegmentUser[]; nextPage: number | null };

export const getUsers = async (token: string, page: number | null) => {
  // Setting default value for pagination.count
  const count = 200;

  const response = await fetch(
    `https://api.segmentapis.com/users?pagination.count=${count}&pagination.cursor=${page}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  if (!response.ok) {
    throw new MySaasError('Could not retrieve users', { response });
  }
  return response.json() as Promise<GetUsersResponseData>;
};
