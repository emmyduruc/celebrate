import { cleanup } from 'detox';

afterAll(async () => {
  await cleanup();
});
