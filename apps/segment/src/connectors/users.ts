import { SegmentError } from './commons/error';

export type SegmentUser = {
  id: string;
  name: string;
  email: string;
};

export type Pagination = {
  current: string;
  next: string | null;
  previous: string | null;
  totalEntries: number;
};

type GetUsersResponseData = { users: SegmentUser[]; nextPage: Pagination };

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
    throw new SegmentError('Could not retrieve users', { response });
  }
  return response.json() as Promise<GetUsersResponseData>;
};
