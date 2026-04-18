import { ActivityIndicator, Pressable } from 'react-native';
import type { PressableProps } from 'react-native';
import { Text } from '@ui/Text';

type Variant = 'primary' | 'secondary' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends PressableProps {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  children: React.ReactNode;
}

const variantClasses: Record<Variant, { container: string; text: string }> = {
  primary: {
    container: 'bg-primary-600 active:bg-primary-700',
    text: 'white',
  },
  secondary: {
    container: 'bg-surface-secondary border border-primary-600 active:bg-surface-tertiary',
    text: 'default',
  },
  ghost: {
    container: 'bg-transparent active:bg-surface-tertiary',
    text: 'default',
  },
};

const sizeClasses: Record<Size, string> = {
  sm: 'px-3 py-1.5 rounded',
  md: 'px-4 py-2.5 rounded-md',
  lg: 'px-6 py-3.5 rounded-lg',
};

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  children,
  ...rest
}: ButtonProps) {
  const variantConfig = variantClasses[variant];
  const isDisabled = disabled ?? loading;

  return (
    <Pressable
      disabled={isDisabled}
      className={`flex-row items-center justify-center ${variantConfig.container} ${sizeClasses[size]} ${
        isDisabled ? 'opacity-50' : ''
      }`}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' ? '#ffffff' : '#2563eb'}
          className="mr-2"
        />
      ) : null}
      <Text variant="body" weight="semibold" color={variantConfig.text as 'default' | 'white'}>
        {children}
      </Text>
    </Pressable>
  );
}
