import { mockFetchSuccess, mockUser, mockUsersResponse } from '@/__mocks__/server';
import { fetchUsers, searchUsers, fetchUserById } from '../client';

beforeEach(() => jest.clearAllMocks());

describe('fetchUsers', () => {
  it('calls the paginated users endpoint and returns data', async () => {
    mockFetchSuccess(mockUsersResponse);
    const result = await fetchUsers(0);
    expect(result).toEqual(mockUsersResponse);
    const [url] = (globalThis.fetch as jest.Mock).mock.calls[0] as [string];
    expect(url).toContain('/users?limit=30&skip=0');
  });

  it('passes skip offset correctly', async () => {
    mockFetchSuccess(mockUsersResponse);
    await fetchUsers(30);
    const [url] = (globalThis.fetch as jest.Mock).mock.calls[0] as [string];
    expect(url).toContain('skip=30');
  });
});

describe('searchUsers', () => {
  it('calls the search endpoint with encoded query', async () => {
    mockFetchSuccess(mockUsersResponse);
    const result = await searchUsers('Emily');
    expect(result).toEqual(mockUsersResponse);
    const [url] = (globalThis.fetch as jest.Mock).mock.calls[0] as [string];
    expect(url).toContain('/users/search?q=Emily');
  });
});

describe('fetchUserById', () => {
  it('calls the user endpoint and returns the user', async () => {
    mockFetchSuccess(mockUser);
    const result = await fetchUserById(1);
    expect(result).toEqual(mockUser);
    const [url] = (globalThis.fetch as jest.Mock).mock.calls[0] as [string];
    expect(url).toContain('/users/1');
  });
});
