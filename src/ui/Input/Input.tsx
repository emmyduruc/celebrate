import { Pressable, TextInput, View } from 'react-native';
import type { TextInputProps } from 'react-native';
import { Text } from '@ui/Text';

interface InputProps extends TextInputProps {
  label?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  clearable?: boolean;
  error?: string;
  onClear?: () => void;
}

export function Input({
  label,
  leftIcon,
  rightIcon,
  clearable,
  error,
  onClear,
  value,
  className = '',
  ...rest
}: InputProps) {
  const showClear = clearable && value && value.length > 0;

  return (
    <View className={`w-full ${className}`}>
      {label ? (
        <Text variant="caption" weight="medium" className="mb-1 ml-1">
          {label}
        </Text>
      ) : null}
      <View
        className={`flex-row items-center bg-surface-secondary rounded-lg px-3 border ${
          error ? 'border-error' : 'border-transparent'
        }`}
      >
        {leftIcon ? <View className="mr-2">{leftIcon}</View> : null}
        <TextInput
          testID="input-field"
          className="flex-1 h-11 text-ink text-base"
          value={value}
          placeholderTextColor="#94a3b8"
          {...rest}
        />
        {showClear ? (
          <Pressable
            testID="input-clear-button"
            onPress={onClear}
            className="ml-2 p-1"
            accessibilityLabel="Clear input"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text variant="caption" color="tertiary">
              ✕
            </Text>
          </Pressable>
        ) : null}
        {!showClear && rightIcon ? <View className="ml-2">{rightIcon}</View> : null}
      </View>
      {error ? (
        <Text variant="caption" color="error" className="mt-1 ml-1">
          {error}
        </Text>
      ) : null}
    </View>
  );
}
