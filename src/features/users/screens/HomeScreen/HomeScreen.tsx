import { useCallback, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  View,
  SafeAreaView,
} from 'react-native';
import { useDebounce } from 'use-debounce';

import { Input } from '@ui/Input';
import { Text } from '@ui/Text';
import { Button } from '@ui/Button';
import { SkeletonUserListItem } from '@ui/Skeleton';
import { UserListItem } from '../../components/UserListItem';
import { useUsers } from '../../api/queries';
import type { User } from '../../types';
import type { HomeScreenProps } from '@navigation/types';
import { testIds } from '@constants/testIds';

const SKELETON_COUNT = 8;

export function HomeScreen({ navigation }: HomeScreenProps) {
  const [searchText, setSearchText] = useState('');
  const [debouncedSearch] = useDebounce(searchText, 300);
  const listRef = useRef<FlatList>(null);

  const { users, isLoading, isError, hasNextPage, isFetchingNextPage, fetchNextPage, refetch } =
    useUsers(debouncedSearch);

  const handleUserPress = useCallback(
    (user: User) => {
      navigation.navigate('UserDetail', { userId: user.id });
    },
    [navigation],
  );

  const handleClear = useCallback(() => {
    setSearchText('');
  }, []);

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      void fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const renderItem = useCallback(
    ({ item, index }: { item: User; index: number }) => (
      <UserListItem user={item} index={index} onPress={handleUserPress} />
    ),
    [handleUserPress],
  );

  const keyExtractor = useCallback((item: User) => String(item.id), []);

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-surface-secondary">
        <View className="px-4 pt-4 pb-2">
          <Text variant="heading" weight="bold">
            Users
          </Text>
        </View>
        {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
          <SkeletonUserListItem key={i} />
        ))}
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView className="flex-1 bg-surface-secondary items-center justify-center px-8">
        <Text variant="subheading" weight="semibold" className="text-center mb-2">
          Something went wrong
        </Text>
        <Text variant="body" color="secondary" className="text-center mb-6">
          Could not load users. Please check your connection and try again.
        </Text>
        <Button onPress={() => void refetch()}>Retry</Button>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-surface-secondary">
      <View className="px-4 pt-4 pb-2">
        <Text variant="heading" weight="bold" className="mb-3">
          Users
        </Text>
        <Input
          testID={testIds.home.searchInput}
          placeholder="Search users…"
          value={searchText}
          onChangeText={setSearchText}
          clearable
          onClear={handleClear}
          returnKeyType="search"
          autoCorrect={false}
          autoCapitalize="none"
        />
      </View>

      <FlatList
        ref={listRef}
        data={users}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={{ paddingVertical: 8, paddingBottom: 32 }}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        onRefresh={() => void refetch()}
        refreshing={isLoading}
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center pt-24">
            <Text variant="subheading" weight="semibold" className="text-center mb-1">
              No users found
            </Text>
            <Text variant="body" color="secondary" className="text-center">
              {debouncedSearch ? `No results for "${debouncedSearch}"` : 'Pull down to refresh'}
            </Text>
          </View>
        }
        ListFooterComponent={
          isFetchingNextPage ? (
            <View className="py-4 items-center">
              <ActivityIndicator size="small" color="#2563eb" />
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
}
