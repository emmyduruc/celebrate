import { render, fireEvent, act } from '@testing-library/react-native';
import { TextInput, Text } from 'react-native';
import { Input } from '../Input';
import { testIds } from '@constants/testIds';

describe('Input', () => {
  it('renders a text input', () => {
    const { getByTestId } = render(<Input value="" onChangeText={jest.fn()} />);
    expect(getByTestId(testIds.input.field)).toBeTruthy();
  });

  it('shows label when provided', () => {
    const { getByText } = render(<Input label="Search" value="" onChangeText={jest.fn()} />);
    expect(getByText('Search')).toBeTruthy();
  });

  it('shows clear button when clearable and value is non-empty', () => {
    const { getByTestId } = render(
      <Input clearable value="hello" onChangeText={jest.fn()} onClear={jest.fn()} />,
    );
    expect(getByTestId(testIds.input.clearButton)).toBeTruthy();
  });

  it('hides clear button when value is empty', () => {
    const { queryByTestId } = render(
      <Input clearable value="" onChangeText={jest.fn()} onClear={jest.fn()} />,
    );
    expect(queryByTestId(testIds.input.clearButton)).toBeNull();
  });

  it('calls onClear when clear button is pressed', () => {
    const onClear = jest.fn();
    const { getByTestId } = render(
      <Input clearable value="hello" onChangeText={jest.fn()} onClear={onClear} />,
    );
    fireEvent.press(getByTestId(testIds.input.clearButton));
    expect(onClear).toHaveBeenCalledTimes(1);
  });

  it('shows error message when error prop is provided', () => {
    const { getByText } = render(
      <Input value="" onChangeText={jest.fn()} error="Required field" />,
    );
    expect(getByText('Required field')).toBeTruthy();
  });

  it('renders rightIcon when no value is present and clearable is false', () => {
    const { getByText } = render(
      <Input value="" onChangeText={jest.fn()} rightIcon={<Text>icon</Text>} />,
    );
    expect(getByText('icon')).toBeTruthy();
  });

  it('hides rightIcon when clear button is shown', () => {
    const { queryByText } = render(
      <Input
        clearable
        value="hello"
        onChangeText={jest.fn()}
        onClear={jest.fn()}
        rightIcon={<Text>icon</Text>}
      />,
    );
    expect(queryByText('icon')).toBeNull();
  });

  it('calls onFocus and onBlur callbacks and toggles focused state', () => {
    const onFocus = jest.fn();
    const onBlur = jest.fn();
    const { UNSAFE_getByType } = render(
      <Input value="" onChangeText={jest.fn()} onFocus={onFocus} onBlur={onBlur} />,
    );
    const input = UNSAFE_getByType(TextInput);
    act(() => {
      input.props.onFocus?.({ nativeEvent: {} });
    });
    expect(onFocus).toHaveBeenCalledTimes(1);
    act(() => {
      input.props.onBlur?.({ nativeEvent: {} });
    });
    expect(onBlur).toHaveBeenCalledTimes(1);
  });
});
