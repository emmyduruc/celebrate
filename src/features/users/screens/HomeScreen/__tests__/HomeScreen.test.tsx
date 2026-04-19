import { render, fireEvent, act } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HomeScreen } from '../HomeScreen';
import { mockFetchSuccess, mockUsersResponse } from '@/__mocks__/server';
import { testIds } from '@constants/testIds';

jest.mock('use-debounce', () => ({
  useDebounce: (value: unknown) => [value],
}));

const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({ navigate: mockNavigate }),
}));

const mockNavigation = { navigate: mockNavigate, goBack: jest.fn() } as never;
const mockRoute = { params: undefined } as never;

let queryClient: QueryClient;

function createWrapper() {
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe('HomeScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false, gcTime: 0 },
      },
    });
  });

  afterEach(async () => {
    await act(async () => {
      queryClient.clear();
    });
  });

  it('shows the People heading while loading', () => {
    // Never-resolving fetch keeps the screen in true loading state —
    // no async state update fires after the test ends.
    (globalThis.fetch as jest.Mock).mockReturnValue(new Promise(() => {}));
    const { getByText } = render(<HomeScreen navigation={mockNavigation} route={mockRoute} />, {
      wrapper: createWrapper(),
    });
    expect(getByText('People')).toBeTruthy();
  });

  it('renders user list after successful fetch', async () => {
    mockFetchSuccess(mockUsersResponse);
    const { findByText } = render(<HomeScreen navigation={mockNavigation} route={mockRoute} />, {
      wrapper: createWrapper(),
    });
    await findByText('Emily Johnson');
  });

  it('shows error state on fetch failure', async () => {
    (globalThis.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));
    const { findByText } = render(<HomeScreen navigation={mockNavigation} route={mockRoute} />, {
      wrapper: createWrapper(),
    });
    await findByText('Something went wrong');
  });

  it('debounces search and calls search endpoint', async () => {
    mockFetchSuccess(mockUsersResponse);
    const { findByTestId } = render(<HomeScreen navigation={mockNavigation} route={mockRoute} />, {
      wrapper: createWrapper(),
    });

    const searchInput = await findByTestId(testIds.home.searchInput);

    mockFetchSuccess(mockUsersResponse);
    await act(async () => {
      fireEvent.changeText(searchInput, 'Emily');
    });

    const calls = (globalThis.fetch as jest.Mock).mock.calls as [string][];
    const searchCall = calls.find(([url]) => url.includes('/users/search?q=Emily'));
    expect(searchCall).toBeDefined();
  });
});
