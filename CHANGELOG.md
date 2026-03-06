# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2025-10-12

### Changed

- **BREAKING:** Upgraded to Expo SDK 54 (from SDK 51)
- Updated React Native to 0.76.6 (from 0.74.5)
- Updated React to 18.3.1 (from 18.2.0)
- Updated minimum iOS version to 15.1 (from 13.4)
- Updated minimum Android SDK to 23 (from 21)
- Updated Android compile/target SDK to 35 (from 33/34)
- Updated Kotlin to 2.0.21 (from 1.8.10)
- Updated Swift version to 5.9 (from 5.4)
- Updated Java compatibility to version 17 (from 11)
- Updated NDK version to 27.0.12077973 (from 26.1.10909125)

### Updated Dependencies

#### Main Library
- `expo-modules-core`: ^2.3.3 (from ^1.11.12)
- `expo-module-scripts`: ^3.6.0 (from ^3.4.1)
- `@biomejs/biome`: 1.9.4 (from 1.9.3)
- `@types/react`: ~18.3.12 (from ^18.0.25)

#### Example App
- `@react-navigation/native`: ^7.0.14 (from ^6.1.18)
- `@react-navigation/native-stack`: ^7.2.2 (from ^6.11.0)
- `react-native-get-random-values`: ~1.12.0 (from ~1.11.0)
- `react-native-gifted-chat`: ^2.6.4 (from ^2.6.3)
- `react-native-permissions`: ^5.2.1 (from ^4.1.5)
- `react-native-reanimated`: ~3.16.6 (from ~3.10.1)
- `react-native-safe-area-context`: ~4.14.0 (from 4.10.5)
- `react-native-screens`: ~4.4.0 (from 3.31.1)
- `@babel/core`: ^7.26.0 (from ^7.20.0)
- `typescript`: ~5.7.0 (from ~5.3.3)

### Fixed

- Resolved compatibility issues with Expo SDK 54
- Fixed crashes in the example app
- Updated native configurations for latest platform requirements

### Added

- Comprehensive migration guide in README
- Version compatibility information in README
- Changelog file for tracking version history

## [1.0.0] - 2024

### Added

- Initial release
- Support for Google's Nearby Connections API on Android
- Support for Apple's Multipeer Connectivity framework on iOS
- P2P device discovery and connection
- Text message exchange between connected devices
- Complete example app demonstrating library usage

