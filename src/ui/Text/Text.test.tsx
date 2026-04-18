import { render } from '@testing-library/react-native';
import { Text } from './Text';

describe('Text', () => {
  it('renders children', () => {
    const { getByText } = render(<Text>Hello</Text>);
    expect(getByText('Hello')).toBeTruthy();
  });

  it('applies heading variant classes', () => {
    const { getByText } = render(<Text variant="heading">Title</Text>);
    const element = getByText('Title');
    expect(element.props.className).toContain('text-2xl');
  });

  it('applies semibold weight', () => {
    const { getByText } = render(<Text weight="semibold">Bold</Text>);
    expect(getByText('Bold').props.className).toContain('font-semibold');
  });

  it('applies error color', () => {
    const { getByText } = render(<Text color="error">Error</Text>);
    expect(getByText('Error').props.className).toContain('text-error');
  });

  it('merges custom className', () => {
    const { getByText } = render(<Text className="mt-4">Custom</Text>);
    expect(getByText('Custom').props.className).toContain('mt-4');
  });
});
