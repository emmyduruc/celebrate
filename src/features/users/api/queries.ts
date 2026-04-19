import { useInfiniteQuery, useQuery, keepPreviousData } from '@tanstack/react-query';
import { userKeys } from './keys';
import { fetchUsers, fetchUserById, searchUsers } from './client';
import type { User, UsersResponse } from '../types';

const matchesQuery = (u: User, query: string): boolean => {
  return (
    `${u.firstName} ${u.lastName}`.toLowerCase().includes(query) ||
    u.username.toLowerCase().includes(query) ||
    u.company.title.toLowerCase().includes(query) ||
    u.company.department.toLowerCase().includes(query)
  );
};

export function useUsers(searchQuery: string) {
  const isSearching = searchQuery.trim().length > 0;
  const q = searchQuery.toLowerCase();

  const paginatedQuery = useInfiniteQuery({
    queryKey: userKeys.list({}),
    queryFn: ({ pageParam }) => fetchUsers(pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage: UsersResponse) => {
      const nextSkip = lastPage.skip + lastPage.limit;
      return nextSkip < lastPage.total ? nextSkip : undefined;
    },
    enabled: !isSearching,
    staleTime: 1000 * 60 * 2,
    placeholderData: keepPreviousData,
  });

  const apiSearchQuery = useQuery({
    queryKey: userKeys.list({ search: searchQuery }),
    queryFn: () => searchUsers(searchQuery),
    enabled: isSearching,
    staleTime: 1000 * 60 * 1,
    placeholderData: keepPreviousData,
  });

  if (isSearching) {
    const apiResults = apiSearchQuery.data?.users ?? [];

    const cachedUsers = paginatedQuery.data?.pages.flatMap((page) => page.users) ?? [];
    const apiIds = new Set(apiResults.map((u) => u.id));
    const localExtras = cachedUsers.filter((u) => !apiIds.has(u.id) && matchesQuery(u, q));

    return {
      users: [...apiResults, ...localExtras],
      isLoading: apiSearchQuery.isLoading,
      isFetching: apiSearchQuery.isFetching,
      isError: apiSearchQuery.isError,
      error: apiSearchQuery.error,
      hasNextPage: false,
      isFetchingNextPage: false,
      fetchNextPage: () => Promise.resolve(),
      refetch: apiSearchQuery.refetch,
    };
  }

  const users = paginatedQuery.data?.pages.flatMap((page) => page.users) ?? [];

  return {
    users,
    isLoading: paginatedQuery.isLoading,
    isFetching: paginatedQuery.isFetching,
    isError: paginatedQuery.isError,
    error: paginatedQuery.error,
    hasNextPage: paginatedQuery.hasNextPage,
    isFetchingNextPage: paginatedQuery.isFetchingNextPage,
    fetchNextPage: paginatedQuery.fetchNextPage,
    refetch: paginatedQuery.refetch,
  };
}

export const useUser = (id: number) => {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => fetchUserById(id),
    staleTime: 1000 * 60 * 5,
  });
};
