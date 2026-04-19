import { useMemo, useCallback } from 'react';
import {
  ScrollView,
  View,
  Pressable,
  type NativeSyntheticEvent,
  type NativeScrollEvent,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';

import { Text } from '@ui/Text';
import { Button } from '@ui/Button';
import { Skeleton } from '@ui/Skeleton';
import { useUser } from '../../api/queries';
import { testIds } from '@constants/testIds';
import type { UserDetailScreenProps } from '@navigation/types';
import { DetailRow } from './DetailRow';
import { DetailSection } from './DetailSection';
import { getDetailSections } from './getDetailSections';

const HEADER_MAX_HEIGHT = 200;
const HEADER_MIN_HEIGHT = 70;
const AVATAR_MAX_SIZE = 80;
const AVATAR_MIN_SIZE = 36;

export function UserDetailScreen({ navigation, route }: UserDetailScreenProps) {
  const { userId } = route.params;
  const { data: user, isLoading, isError, refetch } = useUser(userId);
  const scrollY = useSharedValue(0);
  const detailSections = useMemo(() => (user ? getDetailSections(user) : []), [user]);

  const handleScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      scrollY.value = e.nativeEvent.contentOffset.y;
    },
    [scrollY],
  );

  const headerStyle = useAnimatedStyle(() => {
    const height = interpolate(
      scrollY.value,
      [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
      [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
      Extrapolation.CLAMP,
    );
    return { height };
  });

  const avatarStyle = useAnimatedStyle(() => {
    const size = interpolate(
      scrollY.value,
      [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
      [AVATAR_MAX_SIZE, AVATAR_MIN_SIZE],
      Extrapolation.CLAMP,
    );
    const translateY = interpolate(
      scrollY.value,
      [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
      [0, -HEADER_MAX_HEIGHT / 4],
      Extrapolation.CLAMP,
    );
    return {
      width: size,
      height: size,
      borderRadius: size / 2,
      transform: [{ translateY }],
    };
  });

  const nameOpacityStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scrollY.value, [0, 30, 90], [1, 0.5, 0], Extrapolation.CLAMP);
    return { opacity };
  });

  const miniNameStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scrollY.value, [100, 120], [0, 1], Extrapolation.CLAMP);
    return { opacity };
  });

  return (
    <SafeAreaView className="flex-1 bg-surface-secondary" edges={['top']}>
      <Animated.View
        testID={testIds.detail.header}
        className="bg-primary-50 px-4 flex-row items-center overflow-hidden border-b border-primary-100"
        style={headerStyle}
      >
        <Pressable
          testID={testIds.detail.backButton}
          onPress={() => navigation.goBack()}
          className="absolute top-4 left-4 z-10 p-2"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          accessibilityLabel="Go back"
        >
          <Text variant="body" className="text-primary-600 font-semibold">
            ‹ Back
          </Text>
        </Pressable>

        <Animated.View className="items-center justify-center flex-1">
          <Animated.Image
            testID={testIds.detail.avatar}
            source={{ uri: isLoading ? undefined : user?.image }}
            style={avatarStyle}
          />
          <Animated.View style={nameOpacityStyle}>
            <Text variant="subheading" weight="bold" className="mt-2 text-center">
              {user ? `${user.firstName} ${user.lastName}` : ''}
            </Text>
            <Text variant="caption" color="secondary" className="text-center">
              {user ? `@${user.username}` : ''}
            </Text>
          </Animated.View>
        </Animated.View>

        <Animated.View
          className="absolute inset-0 items-center justify-center px-16"
          style={miniNameStyle}
        >
          <Text variant="subheading" weight="bold">
            {user ? `${user.firstName} ${user.lastName}` : ''}
          </Text>
        </Animated.View>
      </Animated.View>

      {isLoading && (
        <View className="px-4 pt-4 gap-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} width="100%" height={80} radius={12} />
          ))}
        </View>
      )}

      {isError && !isLoading && (
        <View className="flex-1 items-center justify-center px-8">
          <Text variant="subheading" weight="semibold" className="text-center mb-2">
            Failed to load user
          </Text>
          <Button onPress={() => void refetch()} className="mt-4">
            Retry
          </Button>
        </View>
      )}

      {user && !isLoading && !isError && (
        <ScrollView
          onScroll={handleScroll}
          scrollEventThrottle={16}
          style={{ flex: 1 }}
          contentContainerStyle={{ padding: 16, paddingBottom: 48, rowGap: 12 }}
          testID={testIds.detail.scrollView}
        >
          {detailSections.map((section) => (
            <DetailSection key={section.title} title={section.title} icon={section.icon}>
              {section.rows.map((row) => (
                <DetailRow key={row.label} label={row.label} value={row.value} />
              ))}
            </DetailSection>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
