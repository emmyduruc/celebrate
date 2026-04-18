import { render, fireEvent } from '@testing-library/react-native';
import { Input } from './Input';

describe('Input', () => {
  it('renders a text input', () => {
    const { getByTestId } = render(<Input value="" onChangeText={jest.fn()} />);
    expect(getByTestId('input-field')).toBeTruthy();
  });

  it('shows label when provided', () => {
    const { getByText } = render(
      <Input label="Search" value="" onChangeText={jest.fn()} />,
    );
    expect(getByText('Search')).toBeTruthy();
  });

  it('shows clear button when clearable and value is non-empty', () => {
    const { getByTestId } = render(
      <Input clearable value="hello" onChangeText={jest.fn()} onClear={jest.fn()} />,
    );
    expect(getByTestId('input-clear-button')).toBeTruthy();
  });

  it('hides clear button when value is empty', () => {
    const { queryByTestId } = render(
      <Input clearable value="" onChangeText={jest.fn()} onClear={jest.fn()} />,
    );
    expect(queryByTestId('input-clear-button')).toBeNull();
  });

  it('calls onClear when clear button is pressed', () => {
    const onClear = jest.fn();
    const { getByTestId } = render(
      <Input clearable value="hello" onChangeText={jest.fn()} onClear={onClear} />,
    );
    fireEvent.press(getByTestId('input-clear-button'));
    expect(onClear).toHaveBeenCalledTimes(1);
  });

  it('shows error message when error prop is provided', () => {
    const { getByText } = render(
      <Input value="" onChangeText={jest.fn()} error="Required field" />,
    );
    expect(getByText('Required field')).toBeTruthy();
  });
});
