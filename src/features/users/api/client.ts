import { httpClient } from '@lib/api';
import { PAGINATION } from '@constants/api';
import type { User, UsersResponse } from '../types';

export async function fetchUsers(skip: number): Promise<UsersResponse> {
  return httpClient.get<UsersResponse>(`/users?limit=${PAGINATION.PAGE_SIZE}&skip=${skip}`);
}

export async function searchUsers(query: string): Promise<UsersResponse> {
  return httpClient.get<UsersResponse>(`/users/search?q=${encodeURIComponent(query)}`);
}

export async function fetchUserById(id: number): Promise<User> {
  return httpClient.get<User>(`/users/${id}`);
}
