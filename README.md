# Celebrate — React Native User Directory

A React Native app that fetches a list of users from a public API, lets you search through them, and tap into a detailed profile view. Built with Expo, TanStack Query, NativeWind, and fully tested with Jest + Detox.

---

## Prerequisites

Before anything, make sure you have the following installed:

- **Node.js** (v18+)
- **Yarn** (`npm install -g yarn`)
- **Expo CLI** (`npm install -g expo-cli`)
- **Xcode** (for iOS — Mac only)
- **Android Studio** (for Android)
- **CocoaPods** (for iOS — `sudo gem install cocoapods`)

---

## Getting Started

### 1. Clone and install dependencies

```bash
git clone <repo-url>
cd celebrate
yarn install
```

### 2. iOS — install pods

```bash
cd ios && pod install && cd ..
```

---

## Running the App

### iOS Simulator

```bash
yarn ios
```

This builds the app and opens it in the iOS Simulator. First build takes a few minutes — subsequent ones are much faster.

### Android Emulator

Before running on Android, you need to tell the project where your Android SDK lives.

**Set up `android/local.properties`:**

Open (or create) the file `android/local.properties` and add this line:

```
sdk.dir=/Users/{your-mac-username}/Library/Android/sdk
```

Replace `{your-mac-username}` with your actual username. You can find it by running:

```bash
echo $HOME
```

So if your home is `/Users/john`, it would be:

```
sdk.dir=/Users/john/Library/Android/sdk
```

**Set the Android SDK environment variable:**

Detox (and many Android tools) also need `ANDROID_SDK_ROOT` set in your shell. Add these lines to your `~/.zshrc` (or `~/.bashrc`):

```bash
export ANDROID_SDK_ROOT=$HOME/Library/Android/sdk
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_SDK_ROOT/emulator
export PATH=$PATH:$ANDROID_SDK_ROOT/platform-tools
```

Then reload your shell:

```bash
source ~/.zshrc
```

Then run:

```bash
yarn android
```

This builds the APK and installs it on your running Android emulator.

> **Tip:** Make sure your emulator is already open in Android Studio before running this command.

### Start the Metro bundler only (no build)

If you already have a dev build installed on a device or simulator:

```bash
yarn start
```

---

## Running Tests

### Unit & Integration Tests

```bash
yarn test
```

Runs all Jest tests across the codebase. Tests live in `__tests__/` folders inside each feature or component directory.

**Watch mode** (reruns on file changes — great while developing):

```bash
yarn test:watch
```

**With coverage report:**

```bash
yarn test:coverage
```

Coverage output goes to the `coverage/` folder. Open `coverage/lcov-report/index.html` in a browser to see the full breakdown.

---

## Running E2E Tests (Detox)

### iOS E2E

**Step 1 — build the app for Detox:**

```bash
yarn e2e:build:ios
```

**Step 2 — run the tests:**

```bash
yarn e2e:test:ios
```

The tests run on an **iPhone 16** simulator. Make sure Xcode is installed and the simulator is available.

### Android E2E

**Step 1 — build:**

```bash
yarn e2e:build:android
```

**Step 2 — run the tests:**

```bash
yarn e2e:test:android
```

Android E2E runs on a **Medium Phone API 36.1** emulator (`avdName: Medium_Phone_API_36.1`). Make sure that AVD exists in your Android Studio virtual device manager before running.

> **Note:** The first build always takes a while...  grab a coffee. After that, `yarn e2e:test:*` alone is fast.

---

## Other Useful Commands

| Command | What it does |
|---|---|
| `yarn lint` | Check for lint errors |
| `yarn lint:fix` | Auto-fix lint errors |
| `yarn format` | Format all source files with Prettier |
| `yarn typecheck` | Run TypeScript without emitting catches type errors |

---

## Project Structure

```
src/
├── __mocks__/          # Global mock setup for fetch and test data
├── constants/          # API base URL, pagination config
├── features/
│   └── users/
│       ├── api/        # fetchUsers, searchUsers, TanStack Query hooks
│       │   └── __tests__/
│       ├── components/ # UserListItem card
│       │   └── __tests__/
│       └── screens/
│           ├── HomeScreen/   # User list, search input, pagination
│           │   └── __tests__/
│           └── DetailScreen/ # Full user profile view
│               └── __tests__/
├── lib/
│   ├── api/            # httpClient wrapper, ApiError class
│   └── query/          # Shared QueryClient instance
├── navigation/         # React Navigation stack setup
└── ui/                 # Reusable components: Text, Button, Input, Card, Avatar, Skeleton...
    └── */
        └── __tests__/
e2e/
└── specs/              # Detox end-to-end test specs
```

---

## Key Decisions & Tradeoffs

### Data Fetching — Infinite Scroll + Search Hybrid

The user list uses `useInfiniteQuery` for paginated browsing (30 users per page). When you type in the search box, it switches to `useQuery` pointing at the `/users/search?q=` endpoint on DummyJSON.

The tricky part: the API search only matches on names. So if you've scrolled and loaded users into cache, a search for a job title or department wouldn't find them through the API alone.

The solution is a hybrid: the app merges the API's search results with any locally cached users that match the query on name, username, company title, or department. This means you get fast API results for names, plus coverage of fields the API doesn't search without making extra network calls.

The tradeoff is that this local supplement only works for users already in the cache (i.e. those you've scrolled past). Someone on page 10 who hasn't been loaded yet won't show up in a department search. With more time, a full server-side search across all fields would be the right fix.

### Search — Debounced Input

The search input is debounced (300ms by default via `use-debounce`) before triggering the query. This avoids firing a network request on every single keystroke, which would be noisy and slow. The tradeoff is a small perceived delay before results update.

### Scroll-Based Header Collapse (Reanimated)

The detail screen header shrinks as you scroll using Reanimated's shared values and derived values — all running on the UI thread, keeping animations smooth even when the JS thread is busy.

The catch is that Reanimated worklets don't run in the Jest environment at all, so the animation logic itself can't be unit tested. Those lines are explicitly marked with `/* istanbul ignore next */` to keep coverage honest.

### Architecture — Feature-First, Not Layer-First

Files are grouped by feature (`features/users/`) rather than by type (all components in one folder, all hooks in another). This makes it easy to find everything related to one part of the app in one place, and means a feature can be reasoned about, tested, or removed in isolation.

### Error Handling

Errors propagate via TanStack Query's `isError` flag and a typed `ApiError` class. The `httpClient` throws `ApiError` for any non-2xx HTTP response, with the status code and message attached. Components check `isError` and show an inline error state rather than crashing. An `ErrorBoundary` wraps the navigator as a last-resort catch for any unexpected render-time throws.

---

## What I'd Improve With More Time
**Input ui element has werid padding reflect on placeholder
**Full server-side search** — the current hybrid search supplements local cache but can't reach unloaded pages. A backend search across all fields would fix that.

**Skeleton loading per item** — the home screen shows a loading spinner while the first page loads. Per-item skeletons (already have the `Skeleton` component) would make the loading state feel much more polished.

**Pull-to-refresh on the detail screen** — the list supports pull-to-refresh, but the detail screen doesn't. Easy to add, just didn't get to it.

**Stale-while-revalidate indicators** — TanStack Query revalidates in the background but the UI doesn't signal this. A subtle indicator when data is being refreshed in the background would help users know they're seeing the latest.

**Android E2E coverage** — all E2E tests are iOS only right now. Android Detox setup is in place but the tests haven't been validated on it, i dont have much time

---

## Architecture Overview

```
App.tsx
  └── QueryClientProvider (TanStack Query)
       └── RootNavigator (React Navigation Native Stack)
            ├── HomeScreen
            │    ├── useUsers(searchQuery)      ← merged paginated + search hook
            │    ├── Input (debounced search)
            │    └── FlatList → UserListItem (tap → DetailScreen)
            └── DetailScreen
                 ├── useUser(id)               ← single user query
                 ├── Reanimated scroll header
                 └── DetailSection / DetailRow (field display)
```

Data flow is one-way: screens call hooks, hooks call the API client, results come back through React Query's cache. Components never fetch directly.
