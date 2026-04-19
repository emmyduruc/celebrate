import { render, fireEvent } from '@testing-library/react-native';
import { Pressable } from 'react-native';
import { UserListItem } from '../UserListItem';
import { mockUser } from '@/__mocks__/server';
import { testIds } from '@constants/testIds';

describe('UserListItem', () => {
  it('renders full name and username', () => {
    const { getByText } = render(
      <UserListItem user={mockUser} onPress={jest.fn()} />,
    );
    expect(getByText('Emily Johnson')).toBeTruthy();
    expect(getByText('@emilys')).toBeTruthy();
  });

  it('calls onPress with the user when tapped', () => {
    const onPress = jest.fn();
    const { getByTestId } = render(
      <UserListItem user={mockUser} onPress={onPress} />,
    );
    fireEvent.press(getByTestId(testIds.userList.item(mockUser.id)));
    expect(onPress).toHaveBeenCalledWith(mockUser);
  });

  it('has an accessibility label with the full name', () => {
    const { getByLabelText } = render(
      <UserListItem user={mockUser} onPress={jest.fn()} />,
    );
    expect(getByLabelText('View profile of Emily Johnson')).toBeTruthy();
  });

  it('renders safely when firstName or lastName is empty', () => {
    const { getByText } = render(
      <UserListItem user={{ ...mockUser, firstName: '', lastName: '' }} onPress={jest.fn()} />,
    );
    expect(getByText('@emilys')).toBeTruthy();
  });

  it('applies reduced opacity when pressed', () => {
    const { UNSAFE_getByType } = render(
      <UserListItem user={mockUser} onPress={jest.fn()} />,
    );
    const pressable = UNSAFE_getByType(Pressable);
    const styleFn = pressable.props.style as (state: { pressed: boolean }) => object;
    expect(styleFn({ pressed: true })).toEqual({ opacity: 0.7 });
    expect(styleFn({ pressed: false })).toEqual({ opacity: 1 });
  });
});
