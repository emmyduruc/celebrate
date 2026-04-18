import { Pressable, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { Avatar } from '@ui/Avatar';
import { Text } from '@ui/Text';
import { testIds } from '@constants/testIds';
import type { User } from '../../types';

interface Props {
  user: User;
  index: number;
  onPress: (user: User) => void;
}

export function UserListItem({ user,index, onPress }: Props) {
  const fullName = `${user.firstName} ${user.lastName}`;

  return (
    <Animated.View entering={FadeInDown.delay(index * 30).springify()}>
      <Pressable
        testID={testIds.userList.item(user.id)}
        className="flex-row items-center bg-white mx-4 mb-2 px-4 py-3 rounded-lg active:opacity-70"
        style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
        onPress={() => onPress(user)}
        accessibilityRole="button"
        accessibilityLabel={`View profile of ${fullName}`}
      >
        <Avatar uri={user.image} initials={`${user.firstName[0] ?? ''}${user.lastName[0] ?? ''}`} size="md" />
        <View className="flex-1 ml-3">
          <Text variant="body" weight="semibold" numberOfLines={1}>
            {fullName}
          </Text>
          <Text variant="caption" color="secondary" numberOfLines={1}>
            @{user.username}
          </Text>
        </View>
        <Text variant="caption" color="tertiary">
          ›
        </Text>
      </Pressable>
    </Animated.View>
  );
}
