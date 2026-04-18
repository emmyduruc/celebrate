import { Pressable, View } from 'react-native';
import type { PressableProps, ViewProps } from 'react-native';

interface CardProps extends ViewProps {
  pressable?: false;
  children: React.ReactNode;
  className?: string;
}

interface PressableCardProps extends PressableProps {
  pressable: true;
  children: React.ReactNode;
  className?: string;
}

type Props = CardProps | PressableCardProps;

export function Card({ children, pressable, className = '', ...rest }: Props) {
  const baseClasses = `bg-white rounded-lg p-4 ${className}`;

  if (pressable) {
    return (
      <Pressable
        className={baseClasses}
        style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}
        {...(rest as PressableProps)}
      >
        {children}
      </Pressable>
    );
  }

  return (
    <View className={baseClasses} {...(rest as ViewProps)}>
      {children}
    </View>
  );
}
