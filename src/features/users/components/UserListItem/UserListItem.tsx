import { memo } from 'react';
import { Pressable, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

import { Avatar } from '@ui/Avatar';
import { Text } from '@ui/Text';
import { testIds } from '@constants/testIds';
import type { User } from '../../types';

interface Props {
  user: User;
  onPress: (user: User) => void;
}

export const UserListItem = memo(function UserListItem({ user, onPress }: Readonly<Props>) {
  const fullName = `${user.firstName} ${user.lastName}`;

  return (
    <Animated.View entering={FadeInDown.duration(180)}>
      <Pressable
        testID={testIds.userList.item(user.id)}
        className="flex-row items-center bg-white mx-4 mb-2 px-4 py-3.5 rounded-2xl"
        style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
        onPress={() => onPress(user)}
        accessibilityRole="button"
        accessibilityLabel={`View profile of ${fullName}`}
      >
        <Avatar
          uri={user.image}
          initials={`${user.firstName[0] ?? ''}${user.lastName[0] ?? ''}`}
          size="md"
        />
        <View className="flex-1 ml-3">
          <Text variant="body" weight="semibold" numberOfLines={1}>
            {fullName}
          </Text>
          <Text variant="caption" color="secondary" numberOfLines={1}>
            @{user.username}
          </Text>
          {user.company?.title ? (
            <Text variant="caption" color="tertiary" numberOfLines={1} className="mt-0.5">
              {user.company.title} · {user.company.department}
            </Text>
          ) : null}
        </View>
        <View className="w-6 h-6 rounded-full bg-primary-50 items-center justify-center ml-2">
          <Ionicons name="chevron-forward" size={12} color="#ea580c" />
        </View>
      </Pressable>
    </Animated.View>
  );
});
