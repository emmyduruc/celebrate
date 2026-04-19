import { render, fireEvent } from '@testing-library/react-native';
import { ActivityIndicator } from 'react-native';
import { Button } from '../Button';

describe('Button', () => {
  it('renders children text', () => {
    const { getByText } = render(<Button>Submit</Button>);
    expect(getByText('Submit')).toBeTruthy();
  });

  it('calls onPress when tapped', () => {
    const onPress = jest.fn();
    const { getByText } = render(<Button onPress={onPress}>Go</Button>);
    fireEvent.press(getByText('Go'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('shows ActivityIndicator when loading=true (primary)', () => {
    const { UNSAFE_getAllByType } = render(<Button loading>Submit</Button>);
    expect(UNSAFE_getAllByType(ActivityIndicator)).toHaveLength(1);
  });

  it('shows ActivityIndicator when loading=true (secondary variant)', () => {
    const { UNSAFE_getAllByType } = render(
      <Button loading variant="secondary">Submit</Button>,
    );
    expect(UNSAFE_getAllByType(ActivityIndicator)).toHaveLength(1);
  });

  it('shows ActivityIndicator when loading=true (ghost variant)', () => {
    const { UNSAFE_getAllByType } = render(
      <Button loading variant="ghost">Submit</Button>,
    );
    expect(UNSAFE_getAllByType(ActivityIndicator)).toHaveLength(1);
  });

  it('renders all size variants without error', () => {
    (['sm', 'md', 'lg'] as const).forEach((size) => {
      const { unmount } = render(<Button size={size}>Press</Button>);
      unmount();
    });
  });

  it('renders all style variants without error', () => {
    (['primary', 'secondary', 'ghost'] as const).forEach((variant) => {
      const { unmount } = render(<Button variant={variant}>Press</Button>);
      unmount();
    });
  });

  it('does not call onPress when disabled', () => {
    const onPress = jest.fn();
    const { getByText } = render(<Button disabled onPress={onPress}>Go</Button>);
    fireEvent.press(getByText('Go'));
    expect(onPress).not.toHaveBeenCalled();
  });
});
