import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { userKeys } from './keys';
import { fetchUsers, fetchUserById, searchUsers } from './client';
import type { UsersResponse } from '../types';

export function useUsers(searchQuery: string) {
  const isSearching = searchQuery.trim().length > 0;

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
  });

  const searchQuery_ = useQuery({
    queryKey: userKeys.list({ search: searchQuery }),
    queryFn: () => searchUsers(searchQuery),
    enabled: isSearching,
    staleTime: 1000 * 60 * 1,
  });

  if (isSearching) {
    return {
      users: searchQuery_.data?.users ?? [],
      isLoading: searchQuery_.isLoading,
      isError: searchQuery_.isError,
      error: searchQuery_.error,
      hasNextPage: false,
      isFetchingNextPage: false,
      fetchNextPage: () => Promise.resolve(),
      refetch: searchQuery_.refetch,
    };
  }

  const users =
    paginatedQuery.data?.pages.flatMap((page) => page.users) ?? [];

  return {
    users,
    isLoading: paginatedQuery.isLoading,
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
}
