import { render } from '@testing-library/react-native';
import { DetailRow } from '../DetailRow';

describe('DetailRow', () => {
  it('renders label and value', () => {
    const { getByText } = render(<DetailRow label="Email" value="test@example.com" />);
    expect(getByText('Email')).toBeTruthy();
    expect(getByText('test@example.com')).toBeTruthy();
  });
});
