import { userKeys } from '../keys';

describe('userKeys', () => {
  it('all returns the base key', () => {
    expect(userKeys.all).toEqual(['users']);
  });

  it('lists returns the list namespace key', () => {
    expect(userKeys.lists()).toEqual(['users', 'list']);
  });

  it('list includes filters in the key', () => {
    expect(userKeys.list({ search: 'Emily' })).toEqual(['users', 'list', { search: 'Emily' }]);
    expect(userKeys.list({})).toEqual(['users', 'list', {}]);
  });

  it('details returns the detail namespace key', () => {
    expect(userKeys.details()).toEqual(['users', 'detail']);
  });

  it('detail includes the id in the key', () => {
    expect(userKeys.detail(1)).toEqual(['users', 'detail', 1]);
    expect(userKeys.detail(42)).toEqual(['users', 'detail', 42]);
  });
});
