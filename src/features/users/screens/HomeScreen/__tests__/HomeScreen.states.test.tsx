import { render, fireEvent } from '@testing-library/react-native';
import { FlatList } from 'react-native';
import { HomeScreen } from '../HomeScreen';
import { mockUser } from '@/__mocks__/server';
import { testIds } from '@constants/testIds';

jest.mock('use-debounce', () => ({ useDebounce: (v: unknown) => [v] }));

const mockUseUsers = jest.fn();
jest.mock('../../../api/queries', () => ({
  useUsers: (...args: unknown[]) => mockUseUsers(...args),
}));

const mockNavigation = { navigate: jest.fn(), goBack: jest.fn() } as any;
const mockRoute = { params: undefined } as any;

const baseState = {
  users: [mockUser],
  isLoading: false,
  isFetching: false,
  isError: false,
  hasNextPage: false,
  isFetchingNextPage: false,
  fetchNextPage: jest.fn(),
  refetch: jest.fn(),
};

beforeEach(() => {
  jest.clearAllMocks();
  mockUseUsers.mockReturnValue(baseState);
});

describe('HomeScreen — footer states', () => {
  it('shows "Loading more…" footer when isFetchingNextPage is true', () => {
    mockUseUsers.mockReturnValue({ ...baseState, isFetchingNextPage: true, hasNextPage: true });
    const { getByText } = render(<HomeScreen navigation={mockNavigation} route={mockRoute} />);
    expect(getByText('Loading more…')).toBeTruthy();
  });

  it('shows "You\'ve seen everyone" when all pages are loaded', () => {
    mockUseUsers.mockReturnValue({ ...baseState, hasNextPage: false, users: [mockUser] });
    const { getByText } = render(<HomeScreen navigation={mockNavigation} route={mockRoute} />);
    expect(getByText("You've seen everyone")).toBeTruthy();
  });

  it('renders the user list', () => {
    const { getByText } = render(<HomeScreen navigation={mockNavigation} route={mockRoute} />);
    expect(getByText('Emily Johnson')).toBeTruthy();
  });
});

describe('HomeScreen — clear search', () => {
  it('clears the search input when clear button is pressed', () => {
    const { getByTestId, queryByTestId } = render(
      <HomeScreen navigation={mockNavigation} route={mockRoute} />,
    );
    fireEvent.changeText(getByTestId(testIds.home.searchInput), 'Emily');
    fireEvent.press(getByTestId(testIds.input.clearButton));
    expect(queryByTestId(testIds.input.clearButton)).toBeNull();
  });
});

describe('HomeScreen — user press', () => {
  it('navigates to UserDetail when a user item is pressed', () => {
    const { getByTestId } = render(<HomeScreen navigation={mockNavigation} route={mockRoute} />);
    fireEvent.press(getByTestId(testIds.userList.item(mockUser.id)));
    expect(mockNavigation.navigate).toHaveBeenCalledWith('UserDetail', { userId: mockUser.id });
  });
});

describe('HomeScreen — empty state', () => {
  it('shows "No results for" message when searching with no results', () => {
    mockUseUsers.mockReturnValue({ ...baseState, users: [] });
    const { getByText, getByTestId } = render(
      <HomeScreen navigation={mockNavigation} route={mockRoute} />,
    );
    fireEvent.changeText(getByTestId(testIds.home.searchInput), 'xyz');
    expect(getByText(/No results for/)).toBeTruthy();
  });

  it('shows "Pull down to refresh" when list is empty and not searching', () => {
    mockUseUsers.mockReturnValue({ ...baseState, users: [] });
    const { getByText } = render(<HomeScreen navigation={mockNavigation} route={mockRoute} />);
    expect(getByText('Pull down to refresh')).toBeTruthy();
  });
});

describe('HomeScreen — error state', () => {
  it('shows error message and Retry button', () => {
    mockUseUsers.mockReturnValue({ ...baseState, isError: true });
    const { getByText } = render(<HomeScreen navigation={mockNavigation} route={mockRoute} />);
    expect(getByText('Something went wrong')).toBeTruthy();
    expect(getByText('Retry')).toBeTruthy();
  });

  it('calls refetch when Retry is pressed', () => {
    const refetch = jest.fn();
    mockUseUsers.mockReturnValue({ ...baseState, isError: true, refetch });
    const { getByText } = render(<HomeScreen navigation={mockNavigation} route={mockRoute} />);
    fireEvent.press(getByText('Retry'));
    expect(refetch).toHaveBeenCalledTimes(1);
  });
});

describe('HomeScreen — FlatList callbacks', () => {
  it('calls fetchNextPage when end is reached and hasNextPage is true', () => {
    const fetchNextPage = jest.fn();
    mockUseUsers.mockReturnValue({ ...baseState, hasNextPage: true, fetchNextPage });
    const { UNSAFE_getByType } = render(
      <HomeScreen navigation={mockNavigation} route={mockRoute} />,
    );
    const flatList = UNSAFE_getByType(FlatList);
    flatList.props.onEndReached?.();
    expect(fetchNextPage).toHaveBeenCalledTimes(1);
  });

  it('does not call fetchNextPage when hasNextPage is false', () => {
    const fetchNextPage = jest.fn();
    mockUseUsers.mockReturnValue({ ...baseState, hasNextPage: false, fetchNextPage });
    const { UNSAFE_getByType } = render(
      <HomeScreen navigation={mockNavigation} route={mockRoute} />,
    );
    const flatList = UNSAFE_getByType(FlatList);
    flatList.props.onEndReached?.();
    expect(fetchNextPage).not.toHaveBeenCalled();
  });

  it('calls refetch when list is pulled to refresh', () => {
    const refetch = jest.fn();
    mockUseUsers.mockReturnValue({ ...baseState, refetch });
    const { UNSAFE_getByType } = render(
      <HomeScreen navigation={mockNavigation} route={mockRoute} />,
    );
    const flatList = UNSAFE_getByType(FlatList);
    flatList.props.onRefresh?.();
    expect(refetch).toHaveBeenCalledTimes(1);
  });
});
