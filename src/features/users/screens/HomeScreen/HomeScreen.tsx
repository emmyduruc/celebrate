import { useCallback, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  View,
  Text as RNText,
} from 'react-native';
import type { ListRenderItemInfo } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDebounce } from 'use-debounce';
import { Ionicons } from '@expo/vector-icons';

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
const SKELETON_KEYS = Array.from({ length: SKELETON_COUNT }, (_, i) => `skeleton-${i}`);

const SearchIcon = () => <Ionicons name="search-outline" size={18} color="#ea580c" />;

export function HomeScreen({ navigation }: Readonly<HomeScreenProps>) {
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
    ({ item }: ListRenderItemInfo<User>) => <UserListItem user={item} onPress={handleUserPress} />,
    [handleUserPress],
  );

  const keyExtractor = useCallback((item: User) => String(item.id), []);

  const renderFooter = useCallback(() => {
    if (isFetchingNextPage) {
      return (
        <View className="py-6 items-center gap-y-2">
          <ActivityIndicator size="small" color="#ea580c" />
          <RNText style={{ fontSize: 12, color: '#94a3b8' }}>Loading more…</RNText>
        </View>
      );
    }
    if (!hasNextPage && users.length > 0 && !debouncedSearch) {
      return (
        <View className="py-6 items-center gap-y-1">
          <Ionicons name="checkmark-circle-outline" size={20} color="#ea580c" />
          <RNText style={{ fontSize: 12, color: '#94a3b8' }}>You've seen everyone</RNText>
        </View>
      );
    }
    return null;
  }, [isFetchingNextPage, hasNextPage, users.length, debouncedSearch]);

  let content: React.ReactNode;
  if (isError) {
    content = (
      <View className="flex-1 items-center justify-center px-8">
        <View className="w-16 h-16 rounded-full bg-primary-50 items-center justify-center mb-4">
          <Ionicons name="wifi-outline" size={32} color="#ea580c" />
        </View>
        <Text variant="subheading" weight="semibold" className="text-center mb-2">
          Something went wrong
        </Text>
        <Text variant="body" color="secondary" className="text-center mb-6">
          Could not load users. Please check your connection and try again.
        </Text>
        <Button onPress={() => void refetch()}>Retry</Button>
      </View>
    );
  } else if (isLoading) {
    content = (
      <View className="px-4 pt-2">
        {SKELETON_KEYS.map((key) => (
          <SkeletonUserListItem key={key} />
        ))}
      </View>
    );
  } else {
    content = (
      <FlatList
        ref={listRef}
        data={users}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={{ paddingVertical: 8, paddingBottom: 32 }}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        onRefresh={() => void refetch()}
        refreshing={false}
        removeClippedSubviews
        windowSize={10}
        maxToRenderPerBatch={10}
        updateCellsBatchingPeriod={50}
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center pt-24">
            <View className="w-14 h-14 rounded-full bg-primary-50 items-center justify-center mb-4">
              <Ionicons name="people-outline" size={28} color="#ea580c" />
            </View>
            <Text variant="subheading" weight="semibold" className="text-center mb-1">
              No users found
            </Text>
            <Text variant="body" color="secondary" className="text-center">
              {debouncedSearch ? `No results for "${debouncedSearch}"` : 'Pull down to refresh'}
            </Text>
          </View>
        }
        ListFooterComponent={renderFooter}
      />
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-surface-secondary" edges={['top']}>
      <View className="px-4 pt-5 pb-4 bg-white border-b border-slate-100">
        <View className="flex-row items-center mb-4">
          <View className="w-9 h-9 rounded-xl bg-primary-500 items-center justify-center mr-3">
            <Ionicons name="people" size={20} color="#ffffff" />
          </View>
          <View>
            <Text variant="heading" weight="bold" className="leading-tight">
              People
            </Text>
            <Text variant="caption" color="secondary">
              Discover and connect
            </Text>
          </View>
        </View>
        <Input
          testID={testIds.home.searchInput}
          placeholder="Search by name or username…"
          value={searchText}
          onChangeText={setSearchText}
          clearable
          onClear={handleClear}
          returnKeyType="search"
          autoCorrect={false}
          autoCapitalize="none"
          leftIcon={<SearchIcon />}
        />
      </View>

      {content}
    </SafeAreaView>
  );
}
