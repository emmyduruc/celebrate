import { ScrollView, View, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';

import { Text } from '@ui/Text';
import { Card } from '@ui/Card';
import { Button } from '@ui/Button';
import { Skeleton } from '@ui/Skeleton';
import { useUser } from '../../api/queries';
import { testIds } from '@constants/testIds';
import type { UserDetailScreenProps } from '@navigation/types';

const HEADER_MAX_HEIGHT = 200;
const HEADER_MIN_HEIGHT = 70;
const AVATAR_MAX_SIZE = 80;
const AVATAR_MIN_SIZE = 36;

const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

export function UserDetailScreen({ navigation, route }: UserDetailScreenProps) {
  const { userId } = route.params;
  const { data: user, isLoading, isError, refetch } = useUser(userId);
  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

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
    const opacity = interpolate(
      scrollY.value,
      [0, 40, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
      [1, 0.6, 0],
      Extrapolation.CLAMP,
    );
    return { opacity };
  });

  const miniNameStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT - 20, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
      [0, 1],
      Extrapolation.CLAMP,
    );
    return { opacity };
  });

  return (
    <SafeAreaView className="flex-1 bg-surface-secondary" edges={['top']}>
      <Animated.View
        testID={testIds.detail.header}
        className="bg-white px-4 flex-row items-center overflow-hidden"
        style={headerStyle}
      >
        <Pressable
          testID={testIds.detail.backButton}
          onPress={() => navigation.goBack()}
          className="absolute top-4 left-4 z-10 p-2"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          accessibilityLabel="Go back"
        >
          <Text variant="body" color="default">
            ‹ Back
          </Text>
        </Pressable>

        <Animated.View
          className="items-center justify-center flex-1"
          style={headerStyle}
        >
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
          className="absolute bottom-4 left-0 right-0 items-center"
          style={miniNameStyle}
        >
          <Text variant="body" weight="semibold">
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
        <AnimatedScrollView
          onScroll={scrollHandler}
          scrollEventThrottle={16}
          contentContainerStyle={{ padding: 16, paddingBottom: 48, gap: 12 }}
          testID={testIds.detail.scrollView}
        >
          <DetailSection title="Contact">
            <DetailRow label="Email" value={user.email} />
            <DetailRow label="Phone" value={user.phone} />
            <DetailRow label="Username" value={`@${user.username}`} />
          </DetailSection>

          <DetailSection title="Personal">
            <DetailRow label="Age" value={String(user.age)} />
            <DetailRow label="Gender" value={user.gender} />
            <DetailRow label="Blood Group" value={user.bloodGroup} />
            <DetailRow label="Eye Color" value={user.eyeColor} />
            <DetailRow label="Hair" value={`${user.hair.color} ${user.hair.type}`} />
            <DetailRow label="University" value={user.university} />
          </DetailSection>

          <DetailSection title="Address">
            <DetailRow label="Street" value={user.address.address} />
            <DetailRow label="City" value={user.address.city} />
            <DetailRow label="State" value={`${user.address.state} (${user.address.stateCode})`} />
            <DetailRow label="Postal Code" value={user.address.postalCode} />
            <DetailRow label="Country" value={user.address.country} />
          </DetailSection>

          <DetailSection title="Company">
            <DetailRow label="Name" value={user.company.name} />
            <DetailRow label="Department" value={user.company.department} />
            <DetailRow label="Title" value={user.company.title} />
          </DetailSection>

          <DetailSection title="Banking">
            <DetailRow label="Card Type" value={user.bank.cardType} />
            <DetailRow label="Currency" value={user.bank.currency} />
            <DetailRow
              label="Card Number"
              value={`**** **** **** ${user.bank.cardNumber.slice(-4)}`}
            />
          </DetailSection>
        </AnimatedScrollView>
      )}
    </SafeAreaView>
  );
}

const DetailSection = ({ title, children }: { title: string; children: React.ReactNode }) => {
  return (
    <Card>
      <Text variant="caption" weight="semibold" color="secondary" className="mb-3 uppercase tracking-wide">
        {title}
      </Text>
      <View className="gap-y-2">{children}</View>
    </Card>
  );
}

const DetailRow = ({ label, value }: { label: string; value: string }) => {
  return (
    <View className="flex-row justify-between gap-x-4">
      <Text variant="caption" color="secondary" className="shrink-0">
        {label}
      </Text>
      <Text variant="caption" weight="medium" className="flex-1 text-right" numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}
