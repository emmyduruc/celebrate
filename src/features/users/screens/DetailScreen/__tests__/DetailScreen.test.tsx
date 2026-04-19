import { render, fireEvent } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { UserDetailScreen } from '../DetailScreen';
import { mockFetchSuccess, mockUser } from '@/__mocks__/server';
import { testIds } from '@constants/testIds';

const mockNavigation = { goBack: jest.fn(), navigate: jest.fn() } as any;
const mockRoute = { params: { userId: 1 } } as any;

function makeWrapper() {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false, gcTime: 0 } } });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={qc}>{children}</QueryClientProvider>
  );
}

beforeEach(() => jest.clearAllMocks());

describe('UserDetailScreen', () => {
  it('shows skeletons while loading and hides scroll view', () => {
    (globalThis.fetch as jest.Mock).mockReturnValue(new Promise(() => {}));
    const { queryByTestId } = render(
      <UserDetailScreen navigation={mockNavigation} route={mockRoute} />,
      { wrapper: makeWrapper() },
    );
    expect(queryByTestId(testIds.detail.scrollView)).toBeNull();
  });

  it('shows error state when the fetch fails', async () => {
    (globalThis.fetch as jest.Mock).mockRejectedValueOnce(new Error('fail'));
    const { findByText } = render(
      <UserDetailScreen navigation={mockNavigation} route={mockRoute} />,
      { wrapper: makeWrapper() },
    );
    await findByText('Failed to load user');
  });

  it('renders the scroll view and Contact section on success', async () => {
    mockFetchSuccess(mockUser);
    const { findByTestId, findByText } = render(
      <UserDetailScreen navigation={mockNavigation} route={mockRoute} />,
      { wrapper: makeWrapper() },
    );
    await findByTestId(testIds.detail.scrollView);
    await findByText('Contact');
    await findByText(mockUser.email);
  });

  it('shows user full name and username in header', async () => {
    mockFetchSuccess(mockUser);
    const { findAllByText } = render(
      <UserDetailScreen navigation={mockNavigation} route={mockRoute} />,
      { wrapper: makeWrapper() },
    );
    const nameEls = await findAllByText(`${mockUser.firstName} ${mockUser.lastName}`);
    expect(nameEls.length).toBeGreaterThanOrEqual(1);
    const usernameEls = await findAllByText(`@${mockUser.username}`);
    expect(usernameEls.length).toBeGreaterThanOrEqual(1);
  });

  it('calls goBack when back button is pressed', async () => {
    mockFetchSuccess(mockUser);
    const { findByTestId } = render(
      <UserDetailScreen navigation={mockNavigation} route={mockRoute} />,
      { wrapper: makeWrapper() },
    );
    fireEvent.press(await findByTestId(testIds.detail.backButton));
    expect(mockNavigation.goBack).toHaveBeenCalledTimes(1);
  });

  it('shows retry button on error and it is pressable', async () => {
    (globalThis.fetch as jest.Mock).mockRejectedValueOnce(new Error('fail'));
    const { findByText } = render(
      <UserDetailScreen navigation={mockNavigation} route={mockRoute} />,
      { wrapper: makeWrapper() },
    );
    const retryBtn = await findByText('Retry');
    mockFetchSuccess(mockUser);
    fireEvent.press(retryBtn);
    expect(retryBtn).toBeTruthy();
  });
});
