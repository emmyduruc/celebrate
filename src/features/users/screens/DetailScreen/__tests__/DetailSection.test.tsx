import { render } from '@testing-library/react-native';
import { Text } from 'react-native';
import { DetailSection } from '../DetailSection';

describe('DetailSection', () => {
  it('renders the section title and its children', () => {
    const { getByText } = render(
      <DetailSection title="Contact" icon="mail-outline">
        <Text>child content</Text>
      </DetailSection>,
    );
    expect(getByText('Contact')).toBeTruthy();
    expect(getByText('child content')).toBeTruthy();
  });
});
