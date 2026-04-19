import { render, fireEvent } from '@testing-library/react-native';
import { Pressable, Text } from 'react-native';
import { Card } from '../Card';

describe('Card', () => {
  it('renders children in non-pressable mode', () => {
    const { getByText } = render(
      <Card><Text>Content</Text></Card>,
    );
    expect(getByText('Content')).toBeTruthy();
  });

  it('renders children in pressable mode', () => {
    const { getByText } = render(
      <Card pressable><Text>Content</Text></Card>,
    );
    expect(getByText('Content')).toBeTruthy();
  });

  it('calls onPress when pressable card is tapped', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <Card pressable onPress={onPress}><Text>Tap me</Text></Card>,
    );
    fireEvent.press(getByText('Tap me'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('accepts a custom className', () => {
    const { getByText } = render(
      <Card className="mt-4"><Text>Styled</Text></Card>,
    );
    expect(getByText('Styled')).toBeTruthy();
  });

  it('applies reduced opacity when pressed', () => {
    const { UNSAFE_getByType } = render(
      <Card pressable><Text>Content</Text></Card>,
    );
    const pressable = UNSAFE_getByType(Pressable);
    const styleFn = pressable.props.style as (state: { pressed: boolean }) => object;
    expect(styleFn({ pressed: true })).toEqual({ opacity: 0.85 });
    expect(styleFn({ pressed: false })).toEqual({ opacity: 1 });
  });
});
