# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2026-05-02

### Changed

- Upgraded to Expo SDK 55 (from SDK 51)
- Updated React Native to 0.83.x (from 0.73.x)
- Updated minimum iOS version to 15.1 (from 13.4)
- Updated minimum Android SDK to 23 (from 21)
- Updated Kotlin to 2.0.21 (from 1.8.10)
- Updated Swift version to 5.9 (from 5.4)
- Updated Java compatibility to version 17 (from 11)

### Added

- **Migrated from `expo-modules-core` to [Nitro Modules](https://nitro.margelo.com)** (`react-native-nitro-modules`) for direct synchronous native callbacks — lower latency for high-frequency events like `onTextReceived` and `onPeerFound`
- `react-native-nitro-modules` is now a required peer dependency
- Added `bluetoothUsagePermissionText` config plugin option — sets `NSBluetoothAlwaysUsageDescription` in `Info.plist` (required for MultipeerConnectivity on iOS 13+)
- GitHub Actions workflow for automated npm publish with provenance (`publish.yml`)

### Removed

- Removed `expo-modules-core` EventEmitter bus — replaced by direct callback properties on the native HybridObject

### Notes

- **New Architecture required.** Nitro Modules only works with the New Architecture, which is enabled by default since Expo SDK 52.

## [1.0.0] - 2024

### Added

- Initial release
- Support for Google's Nearby Connections API on Android
- Support for Apple's Multipeer Connectivity framework on iOS
- P2P device discovery and connection
- Text message exchange between connected devices
- Complete example app demonstrating library usage

