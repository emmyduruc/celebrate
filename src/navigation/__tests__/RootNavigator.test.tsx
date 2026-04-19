import { render } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RootNavigator } from '../RootNavigator';

jest.mock('@features/users/screens/HomeScreen', () => ({
  HomeScreen: () => null,
}));
jest.mock('@features/users/screens/DetailScreen', () => ({
  UserDetailScreen: () => null,
}));

const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });

describe('RootNavigator', () => {
  it('renders without crashing', () => {
    const { UNSAFE_root } = render(
      <QueryClientProvider client={qc}>
        <RootNavigator />
      </QueryClientProvider>,
    );
    expect(UNSAFE_root).toBeTruthy();
  });
});
