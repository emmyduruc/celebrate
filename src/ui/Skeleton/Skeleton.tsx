import { useEffect } from 'react';
import { View } from 'react-native';
import type { ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';

interface SkeletonProps {
  width?: number | `${number}%`;
  height?: number;
  radius?: number;
  className?: string;
  style?: ViewStyle;
}

export const Skeleton = ({ width, height = 16, radius = 8, className = '', style }: SkeletonProps) => {
  const opacity = useSharedValue(1);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.4, { duration: 800, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 800, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      false,
    );
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius: radius,
          backgroundColor: '#e2e8f0',
        },
        style,
        animatedStyle,
      ]}
      className={className}
    />
  );
}

export function SkeletonUserListItem() {
  return (
    <View className="flex-row items-center bg-white mx-4 mb-2 px-4 py-3 rounded-lg">
      <Skeleton width={48} height={48} radius={24} />
      <View className="flex-1 ml-3 gap-y-2">
        <Skeleton width="60%" height={14} />
        <Skeleton width="40%" height={12} />
      </View>
    </View>
  );
}
