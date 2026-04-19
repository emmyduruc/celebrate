import { device, element, by, expect as detoxExpect, waitFor } from 'detox';
import { testIds } from '../../src/constants/testIds';

describe('Users flow', () => {
  beforeAll(async () => {
    await device.launchApp({ newInstance: true });
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should launch and display the home screen with a list of users', async () => {
    await waitFor(element(by.id(testIds.home.searchInput)))
      .toBeVisible()
      .withTimeout(5000);

    await waitFor(element(by.id(testIds.userList.item(1))))
      .toBeVisible()
      .withTimeout(10000);
  });

  it('should filter users when searching', async () => {
    await waitFor(element(by.id(testIds.home.searchInput)))
      .toBeVisible()
      .withTimeout(5000);

    await element(by.id(testIds.home.searchInput)).typeText('Emily');

    await waitFor(element(by.text('Emily Johnson')))
      .toBeVisible()
      .withTimeout(5000);
  });

  it('should clear search and restore full list', async () => {
    await waitFor(element(by.id(testIds.userList.item(1))))
      .toBeVisible()
      .withTimeout(10000);

    await element(by.id(testIds.home.searchInput)).typeText('Emily');

    await waitFor(element(by.id(testIds.input.clearButton)))
      .toBeVisible()
      .withTimeout(3000);

    await element(by.id(testIds.input.clearButton)).tap();

    await waitFor(element(by.id(testIds.userList.item(1))))
      .toBeVisible()
      .withTimeout(5000);
    await waitFor(element(by.id(testIds.userList.item(2))))
      .toBeVisible()
      .withTimeout(10000);
  });

  it('should navigate to the detail screen when a user is tapped', async () => {
    await waitFor(element(by.id(testIds.userList.item(1))))
      .toBeVisible()
      .withTimeout(10000);

    await element(by.id(testIds.userList.item(1))).tap();

    await waitFor(element(by.id(testIds.detail.scrollView)))
      .toBeVisible()
      .withTimeout(10000);

    await waitFor(element(by.id(testIds.detail.backButton)))
      .toBeVisible()
      .withTimeout(3000);
  });

  it('should show the avatar and header on the detail screen', async () => {
    await waitFor(element(by.id(testIds.userList.item(1))))
      .toBeVisible()
      .withTimeout(10000);

    await element(by.id(testIds.userList.item(1))).tap();

    await waitFor(element(by.id(testIds.detail.scrollView)))
      .toBeVisible()
      .withTimeout(10000);

    await detoxExpect(element(by.id(testIds.detail.avatar))).toBeVisible();
    await detoxExpect(element(by.id(testIds.detail.header))).toBeVisible();
  });

  it('should navigate back to the home screen', async () => {
    await waitFor(element(by.id(testIds.userList.item(1))))
      .toBeVisible()
      .withTimeout(10000);

    await element(by.id(testIds.userList.item(1))).tap();

    await waitFor(element(by.id(testIds.detail.backButton)))
      .toBeVisible()
      .withTimeout(10000);

    await element(by.id(testIds.detail.backButton)).tap();

    await waitFor(element(by.id(testIds.home.searchInput)))
      .toBeVisible()
      .withTimeout(5000);
  });
});
