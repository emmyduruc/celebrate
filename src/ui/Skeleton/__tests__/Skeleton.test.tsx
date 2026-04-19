import { render } from '@testing-library/react-native';
import { Skeleton, SkeletonUserListItem } from '../Skeleton';

describe('Skeleton', () => {
  it('renders with explicit width and height', () => {
    const { UNSAFE_root } = render(<Skeleton width={100} height={20} />);
    expect(UNSAFE_root).toBeTruthy();
  });

  it('renders without width (defaults to undefined)', () => {
    const { UNSAFE_root } = render(<Skeleton height={20} />);
    expect(UNSAFE_root).toBeTruthy();
  });

  it('renders with a percentage width', () => {
    const { UNSAFE_root } = render(<Skeleton width="60%" height={14} />);
    expect(UNSAFE_root).toBeTruthy();
  });

  it('renders with an explicit style override', () => {
    const { UNSAFE_root } = render(<Skeleton width={80} style={{ marginTop: 4 }} />);
    expect(UNSAFE_root).toBeTruthy();
  });
});

describe('SkeletonUserListItem', () => {
  it('renders without crashing', () => {
    const { UNSAFE_root } = render(<SkeletonUserListItem />);
    expect(UNSAFE_root).toBeTruthy();
  });
});
