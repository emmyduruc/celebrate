export const testIds = {
  home: {
    searchInput: 'search-input',
  },

  userList: {
    item: (id: number) => `user-list-item-${id}`,
  },

  detail: {
    header: 'detail-header',
    backButton: 'back-button',
    avatar: 'detail-avatar',
    scrollView: 'detail-scroll-view',
  },

  input: {
    field: 'input-field',
    clearButton: 'input-clear-button',
  },

  avatar: {
    image: 'avatar-image',
    initials: 'avatar-initials',
  },
} as const;
