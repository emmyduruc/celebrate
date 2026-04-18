import { render, fireEvent } from '@testing-library/react-native';
import { UserListItem } from './UserListItem';
import { mockUser } from '@/__mocks__/server';

describe('UserListItem', () => {
  it('renders full name and username', () => {
    const { getByText } = render(
      <UserListItem user={mockUser} index={0} onPress={jest.fn()} />,
    );
    expect(getByText('Emily Johnson')).toBeTruthy();
    expect(getByText('@emilys')).toBeTruthy();
  });

  it('calls onPress with the user when tapped', () => {
    const onPress = jest.fn();
    const { getByTestId } = render(
      <UserListItem user={mockUser} index={0} onPress={onPress} />,
    );
    fireEvent.press(getByTestId(`user-list-item-${mockUser.id}`));
    expect(onPress).toHaveBeenCalledWith(mockUser);
  });

  it('has an accessibility label with the full name', () => {
    const { getByLabelText } = render(
      <UserListItem user={mockUser} index={0} onPress={jest.fn()} />,
    );
    expect(getByLabelText('View profile of Emily Johnson')).toBeTruthy();
  });
});
