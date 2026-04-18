import { Image, View } from 'react-native';
import { Text } from '@ui/Text';

type Size = 'sm' | 'md' | 'lg';

interface AvatarProps {
  uri?: string;
  initials: string;
  size?: Size;
}

const sizeConfig: Record<Size, { container: string; text: string; px: number }> = {
  sm: { container: 'w-8 h-8 rounded-full', text: 'text-xs', px: 32 },
  md: { container: 'w-12 h-12 rounded-full', text: 'text-base', px: 48 },
  lg: { container: 'w-20 h-20 rounded-full', text: 'text-2xl', px: 80 },
};

export function Avatar({ uri, initials, size = 'md' }: AvatarProps) {
  const config = sizeConfig[size];

  if (uri) {
    return (
      <Image
        testID="avatar-image"
        source={{ uri }}
        className={config.container}
        width={config.px}
        height={config.px}
        accessibilityLabel={`Avatar of ${initials}`}
      />
    );
  }

  return (
    <View
      testID="avatar-initials"
      className={`${config.container} bg-primary-100 items-center justify-center`}
      accessibilityLabel={`Avatar placeholder ${initials}`}
    >
      <Text variant="caption" weight="semibold" color="default" className={config.text}>
        {initials.toUpperCase()}
      </Text>
    </View>
  );
}
