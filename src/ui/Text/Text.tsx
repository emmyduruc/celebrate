import { Text as RNText } from 'react-native';
import type { TextProps as RNTextProps } from 'react-native';

type Variant = 'heading' | 'subheading' | 'body' | 'caption';
type Weight = 'regular' | 'medium' | 'semibold' | 'bold';
type Color = 'default' | 'secondary' | 'tertiary' | 'disabled' | 'error' | 'white';

interface TextProps extends RNTextProps {
  variant?: Variant;
  weight?: Weight;
  color?: Color;
  children: React.ReactNode;
}

const variantClasses: Record<Variant, string> = {
  heading: 'text-2xl leading-8',
  subheading: 'text-lg leading-7',
  body: 'text-base leading-6',
  caption: 'text-sm leading-5',
};

const weightClasses: Record<Weight, string> = {
  regular: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
};

const colorClasses: Record<Color, string> = {
  default: 'text-ink',
  secondary: 'text-ink-secondary',
  tertiary: 'text-ink-tertiary',
  disabled: 'text-ink-disabled',
  error: 'text-error',
  white: 'text-white',
};

export function Text({
  variant = 'body',
  weight = 'regular',
  color = 'default',
  className = '',
  children,
  ...rest
}: TextProps) {
  const classes = [
    variantClasses[variant],
    weightClasses[weight],
    colorClasses[color],
    className,
  ].join(' ');

  return (
    <RNText className={classes} {...rest}>
      {children}
    </RNText>
  );
}
