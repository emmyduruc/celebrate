import { renderHook, waitFor, act } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useUsers, useUser } from '../queries';
import { mockFetchSuccess, mockUsersResponse, mockUser } from '@/__mocks__/server';

function makeWrapper() {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false, gcTime: 0 } } });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={qc}>{children}</QueryClientProvider>
  );
}

beforeEach(() => jest.clearAllMocks());

describe('useUsers — paginated mode', () => {
  it('fetches and returns paginated users', async () => {
    mockFetchSuccess(mockUsersResponse);
    const { result } = renderHook(() => useUsers(''), { wrapper: makeWrapper() });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.users).toEqual(mockUsersResponse.users);
    expect(result.current.hasNextPage).toBe(false);
  });

  it('reports hasNextPage true when more pages exist', async () => {
    mockFetchSuccess({ ...mockUsersResponse, total: 100, skip: 0, limit: 30 });
    const { result } = renderHook(() => useUsers(''), { wrapper: makeWrapper() });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.hasNextPage).toBe(true);
  });

  it('exposes isFetching', async () => {
    mockFetchSuccess(mockUsersResponse);
    const { result } = renderHook(() => useUsers(''), { wrapper: makeWrapper() });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(typeof result.current.isFetching).toBe('boolean');
  });

  it('sets isError on fetch failure', async () => {
    (globalThis.fetch as jest.Mock).mockRejectedValueOnce(new Error('fail'));
    const { result } = renderHook(() => useUsers(''), { wrapper: makeWrapper() });
    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});

describe('useUsers — search mode', () => {
  it('returns search results and disables pagination', async () => {
    mockFetchSuccess(mockUsersResponse);
    const { result } = renderHook(() => useUsers('Emily'), { wrapper: makeWrapper() });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.users).toEqual(mockUsersResponse.users);
    expect(result.current.hasNextPage).toBe(false);
    expect(result.current.isFetchingNextPage).toBe(false);
  });

  it('supplements API results with cached paginated matches on title/department', async () => {
    // i am loading the paginated data
    mockFetchSuccess(mockUsersResponse);
    const wrapper = makeWrapper();
    const { result, rerender } = renderHook(({ q }: { q: string }) => useUsers(q), {
      initialProps: { q: '' },
      wrapper,
    });
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    mockFetchSuccess({ ...mockUsersResponse, users: [] });
    rerender({ q: 'Sales Manager' });
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.users.some((u) => u.company.title === 'Sales Manager')).toBe(true);
  });

  it('fetchNextPage resolves immediately in search mode', async () => {
    mockFetchSuccess(mockUsersResponse);
    const { result } = renderHook(() => useUsers('Emily'), { wrapper: makeWrapper() });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    await act(async () => {
      await result.current.fetchNextPage();
    });
  });
});

describe('useUser', () => {
  it('fetches a single user by id', async () => {
    mockFetchSuccess(mockUser);
    const { result } = renderHook(() => useUser(1), { wrapper: makeWrapper() });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.data).toEqual(mockUser);
  });

  it('sets isError when fetch fails', async () => {
    (globalThis.fetch as jest.Mock).mockRejectedValueOnce(new Error('fail'));
    const { result } = renderHook(() => useUser(99), { wrapper: makeWrapper() });
    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
