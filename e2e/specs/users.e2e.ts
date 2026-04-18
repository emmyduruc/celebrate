import { device, element, by, expect as detoxExpect, waitFor } from 'detox';

describe('Users flow', () => {
  beforeAll(async () => {
    await device.launchApp({ newInstance: true });
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should launch and display the home screen with a list of users', async () => {
    await waitFor(element(by.id('search-input')))
      .toBeVisible()
      .withTimeout(5000);

    // At least one user row should be visible
    await waitFor(element(by.id('user-list-item-1')))
      .toBeVisible()
      .withTimeout(10000);
  });

  it('should filter users when searching', async () => {
    await waitFor(element(by.id('search-input')))
      .toBeVisible()
      .withTimeout(5000);

    await element(by.id('search-input')).typeText('Emily');

    await waitFor(element(by.text('Emily Johnson')))
      .toBeVisible()
      .withTimeout(5000);
  });

  it('should clear search and restore full list', async () => {
    await element(by.id('search-input')).typeText('Emily');

    await waitFor(element(by.id('input-clear-button')))
      .toBeVisible()
      .withTimeout(3000);

    await element(by.id('input-clear-button')).tap();

    // Multiple users should be visible again
    await waitFor(element(by.id('user-list-item-1')))
      .toBeVisible()
      .withTimeout(5000);
    await waitFor(element(by.id('user-list-item-2')))
      .toBeVisible()
      .withTimeout(5000);
  });

  it('should navigate to the detail screen when a user is tapped', async () => {
    await waitFor(element(by.id('user-list-item-1')))
      .toBeVisible()
      .withTimeout(10000);

    await element(by.id('user-list-item-1')).tap();

    // Detail scroll view should appear
    await waitFor(element(by.id('detail-scroll-view')))
      .toBeVisible()
      .withTimeout(5000);

    // Back button should be visible
    await waitFor(element(by.id('back-button')))
      .toBeVisible()
      .withTimeout(3000);
  });

  it('should collapse the header when scrolling on the detail screen', async () => {
    await waitFor(element(by.id('user-list-item-1')))
      .toBeVisible()
      .withTimeout(10000);

    await element(by.id('user-list-item-1')).tap();

    await waitFor(element(by.id('detail-scroll-view')))
      .toBeVisible()
      .withTimeout(5000);

    // Header starts at max height — avatar should be visible
    await detoxExpect(element(by.id('detail-avatar'))).toBeVisible();

    // Scroll down to collapse the header
    await element(by.id('detail-scroll-view')).scroll(200, 'down');

    // Header should still exist but avatar may no longer be at full size
    await detoxExpect(element(by.id('detail-header'))).toBeVisible();
  });

  it('should navigate back to the home screen', async () => {
    await waitFor(element(by.id('user-list-item-1')))
      .toBeVisible()
      .withTimeout(10000);

    await element(by.id('user-list-item-1')).tap();

    await waitFor(element(by.id('back-button')))
      .toBeVisible()
      .withTimeout(5000);

    await element(by.id('back-button')).tap();

    await waitFor(element(by.id('search-input')))
      .toBeVisible()
      .withTimeout(5000);
  });
});
