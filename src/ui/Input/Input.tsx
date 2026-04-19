import { useState } from 'react';
import { Pressable, TextInput, View } from 'react-native';
import type { TextInputProps } from 'react-native';
import { Text } from '@ui/Text';
import { testIds } from '@constants/testIds';

interface InputProps extends TextInputProps {
  label?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  clearable?: boolean;
  error?: string;
  onClear?: () => void;
}

 const BORDER_VARIANT = {
    default: 'border-slate-200',
    error: 'border-red-400',
    focused: 'border-blue-500',
  } as const;

export const Input = ({
  label,
  leftIcon,
  rightIcon,
  clearable,
  error,
  onClear,
  value,
  className = '',
  onFocus,
  onBlur,
  ...rest
}: InputProps)=> {
  const [isFocused, setIsFocused] = useState(false);
  const showClear = clearable && value && value.length > 0;
  
  let borderColor: typeof BORDER_VARIANT[keyof typeof BORDER_VARIANT] = BORDER_VARIANT.default;
  if (error) borderColor = BORDER_VARIANT.error;
  else if (isFocused) borderColor = BORDER_VARIANT.focused;

  return (
    <View className={`w-full items-center ${className}`}>
      {label ? (
        <Text variant="subheading" weight="medium" className="ml-0.5 text-left w-full mb-1 text-slate-700">
          {label}
        </Text>
      ) : null}
      <View
        className={`flex-row items-center bg-white rounded-xl px-3 h-12 border ${borderColor}`}
      >
        {leftIcon ? <View className="mr-2 opacity-60">{leftIcon}</View> : null}
        <TextInput
          testID={testIds.input.field}
          className="flex-1 pb-2 text-slate-800 text-base"
          value={value}
          onFocus={(e) => {
            setIsFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            onBlur?.(e);
          }}
          placeholderTextColor="#94a3b8"
          {...rest}
        />
        {showClear ? (
          <Pressable
            testID={testIds.input.clearButton}
            onPress={onClear}
            className="ml-2 w-6 h-6 rounded-full bg-slate-200 items-center justify-center"
            accessibilityLabel="Clear input"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text variant="caption" color="secondary" className="text-xs leading-none">
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
