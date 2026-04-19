import { render, fireEvent } from '@testing-library/react-native';
import { Text } from 'react-native';
import { ErrorBoundary } from '../ErrorBoundary';

const Bomb = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) throw new Error('Test error');
  return <Text>All good</Text>;
}

beforeEach(() => jest.spyOn(console, 'error').mockImplementation(() => {}));
afterEach(() => (console.error as jest.Mock).mockRestore());

describe('ErrorBoundary', () => {
  it('renders children when there is no error', () => {
    const { getByText } = render(
      <ErrorBoundary><Text>Hello</Text></ErrorBoundary>,
    );
    expect(getByText('Hello')).toBeTruthy();
  });

  it('shows error UI when a child throws', () => {
    const { getByText } = render(
      <ErrorBoundary><Bomb shouldThrow /></ErrorBoundary>,
    );
    expect(getByText('Something went wrong')).toBeTruthy();
    expect(getByText('Try again')).toBeTruthy();
  });

  it('resets to children after pressing Try again', () => {
    let shouldThrow = true;
    const Volatile = () => {
      if (shouldThrow) throw new Error('Test error');
      return <Text>All good</Text>;
    };
    const { getByText } = render(
      <ErrorBoundary><Volatile /></ErrorBoundary>,
    );
    shouldThrow = false;
    fireEvent.press(getByText('Try again'));
    expect(getByText('All good')).toBeTruthy();
  });
});
