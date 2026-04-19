import { render } from '@testing-library/react-native';
import { Avatar } from '../Avatar';
import { testIds } from '@constants/testIds';

describe('Avatar', () => {
  it('renders an image when uri is provided', () => {
    const { getByTestId } = render(<Avatar uri="https://example.com/pic.png" initials="EJ" />);
    expect(getByTestId(testIds.avatar.image)).toBeTruthy();
  });

  it('renders initials fallback when uri is not provided', () => {
    const { getByTestId, getByText } = render(<Avatar initials="EJ" />);
    expect(getByTestId(testIds.avatar.initials)).toBeTruthy();
    expect(getByText('EJ')).toBeTruthy();
  });

  it('uppercases initials', () => {
    const { getByText } = render(<Avatar initials="ab" />);
    expect(getByText('AB')).toBeTruthy();
  });

  it('renders different sizes without error', () => {
    const sizes = ['sm', 'md', 'lg'] as const;
    sizes.forEach((size) => {
      const { unmount } = render(<Avatar initials="EJ" size={size} />);
      unmount();
    });
  });
});
