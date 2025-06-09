# EcoLife Application

This project consists of : 
- a Mobile Application (React Native)
---

## 📚 Table Of Contents

- [Mobile App Setup](#a-backend-setup)
---

## A. Mobile App Setup
Refer to the following resources for guidance on setting up and developing the mobile app:

- [Ignite CLI Guide](https://docs.infinite.red/ignite-cli/Guide/)
- [React Native Components and APIs](https://reactnative.dev/docs/components-and-apis)
- [Expo Documentation](https://docs.expo.dev/)

### 1. Prerequisites

- [Node.js](https://nodejs.org/)
- [pnpm](https://pnpm.io/) (recommended) or [npm](https://www.npmjs.com/) / [yarn](https://yarnpkg.com/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/) (`npm install -g expo-cli`)
- Android Studio and/or Xcode (for running on emulators/simulators or devices)

### 2. Install Dependencies

Navigate to the ./Mobile App directory and install dependencies:

```sh
cd Application/MobileApp
pnpm install
# or
npm install
# or
yarn install
```

### 3. Running the App

#### Run on Android

```sh
pnpm android
# or
npm run android
# or
yarn android
```

#### Run on iOS

```sh
pnpm ios
# or
npm run ios
# or
yarn ios
```

#### Run on Web

```sh
pnpm web
# or
npm run web
# or
yarn web
```

### 4. Building the App

You can use [EAS Build](https://docs.expo.dev/build/introduction/) for production builds:

```sh
pnpm run build:android:prod
pnpm run build:ios:prod
```

See more build scripts in [Application/MobileApp/package.json](./MobileApp/package.json).

### 5. Running Tests

```sh
pnpm test
# or
npm test
# or
yarn test
```

### 6. End-to-End Testing (Maestro)

Ensure [Maestro](https://maestro.mobile.dev/) is installed, then run:

```sh
pnpm run test:maestro
```
---
For more details, see [Application/MobileApp/README.md](./MobileApp/README.md).

