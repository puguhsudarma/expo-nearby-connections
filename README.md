# expo-nearby-connections

[![npm version](https://img.shields.io/npm/v/expo-nearby-connections.svg)](https://www.npmjs.com/package/expo-nearby-connections)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Platform: Android](https://img.shields.io/badge/Platform-Android-green.svg)](https://developer.android.com)
[![Platform: iOS](https://img.shields.io/badge/Platform-iOS-lightgrey.svg)](https://developer.apple.com)

An [Expo](https://expo.dev) library for peer-to-peer connections between nearby devices. Uses [Google Nearby Connections](https://developers.google.com/nearby/connections/overview) on Android and [Apple Multipeer Connectivity](https://developer.apple.com/documentation/multipeerconnectivity) on iOS.

> **Note:** Cross-platform P2P between Android and iOS is not supported.

## Compatible Versions

| expo-nearby-connections | expo  | react-native |
| :---------------------: | :---: | :----------: |
|          1.1.0          | 55    |    0.83.x    |
|          1.0.0          | 51    |    0.73.x    |

> **New Architecture required.** expo-nearby-connections 1.1.0 uses [Nitro Modules](https://nitro.margelo.com), which requires New Architecture (enabled by default since Expo SDK 52).

## Installation

```bash
npx expo install expo-nearby-connections react-native-nitro-modules
```

Or with npm/yarn/pnpm:

```bash
npm install expo-nearby-connections react-native-nitro-modules
# or
yarn add expo-nearby-connections react-native-nitro-modules
# or
pnpm add expo-nearby-connections react-native-nitro-modules
```

## Setup

### 1. Add the config plugin

In your `app.json` or `app.config.ts`:

```json
{
  "plugins": [
    [
      "expo-nearby-connections",
      {
        "bonjourServicesName": "my-app",
        "localNetworkUsagePermissionText": "$(PRODUCT_NAME) needs local network access to discover nearby devices",
        "bluetoothUsagePermissionText": "$(PRODUCT_NAME) uses Bluetooth to discover and connect to nearby devices"
      }
    ]
  ]
}
```

All plugin options are optional. Without options, default permission strings are used.

| Option | Platform | Description |
| ------ | -------- | ----------- |
| `bonjourServicesName` | iOS | Bonjour service name (defaults to app name) |
| `localNetworkUsagePermissionText` | iOS | `NSLocalNetworkUsageDescription` |
| `bluetoothUsagePermissionText` | iOS | `NSBluetoothAlwaysUsageDescription` |

### 2. Prebuild

```bash
npx expo prebuild --clean
```

Run prebuild again whenever you change the plugin config.

## Permissions

This library does not handle runtime permissions. Use [react-native-permissions](https://github.com/zoontek/react-native-permissions) or similar.

### iOS

```ts
import { PERMISSIONS, checkMultiple, requestMultiple } from "react-native-permissions";

const permissions = [
  PERMISSIONS.IOS.BLUETOOTH,
  PERMISSIONS.IOS.LOCAL_NETWORK,
];
```

### Android

```ts
import { PERMISSIONS, checkMultiple, requestMultiple } from "react-native-permissions";

const permissions = [
  PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION,
  PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
  PERMISSIONS.ANDROID.BLUETOOTH_ADVERTISE,
  PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
  PERMISSIONS.ANDROID.BLUETOOTH_SCAN,
  PERMISSIONS.ANDROID.NEARBY_WIFI_DEVICES,
];
```

## API

### Types

```ts
enum Strategy {
  P2P_CLUSTER = 1,        // many-to-many mesh
  P2P_STAR = 2,           // one hub, multiple spokes (default)
  P2P_POINT_TO_POINT = 3, // 1-to-1
}

interface BasePeer {
  peerId: string;
  name: string;
}
```

### Advertise

#### `startAdvertise(name, strategy?)`

Starts broadcasting so nearby discoverers can find this device.

```ts
import { startAdvertise, Strategy } from "expo-nearby-connections";

const peerId = await startAdvertise("My Device", Strategy.P2P_STAR);
```

#### `stopAdvertise()`

```ts
import { stopAdvertise } from "expo-nearby-connections";

await stopAdvertise();
```

### Discover

#### `startDiscovery(name, strategy?)`

Starts scanning for nearby advertisers.

```ts
import { startDiscovery, Strategy } from "expo-nearby-connections";

const peerId = await startDiscovery("My Device", Strategy.P2P_STAR);
```

#### `stopDiscovery()`

```ts
import { stopDiscovery } from "expo-nearby-connections";

await stopDiscovery();
```

### Connection

#### `requestConnection(advertisePeerId)`

Sends a connection request to an advertiser found via `onPeerFound`.

```ts
import { requestConnection } from "expo-nearby-connections";

await requestConnection(peerId);
```

#### `acceptConnection(targetPeerId)`

Accepts an incoming connection request (called on the advertiser side).

```ts
import { acceptConnection } from "expo-nearby-connections";

await acceptConnection(peerId);
```

#### `rejectConnection(targetPeerId)`

Rejects an incoming connection request.

```ts
import { rejectConnection } from "expo-nearby-connections";

await rejectConnection(peerId);
```

#### `disconnect(targetPeerId?)`

Disconnects from a connected peer.

- **Android**: if `targetPeerId` is provided, disconnects only that endpoint; omitting it calls `stopAllEndpoints()`.
- **iOS**: `targetPeerId` is always ignored — `MCSession.disconnect()` terminates the entire session.

```ts
import { disconnect } from "expo-nearby-connections";

await disconnect(peerId); // Android: disconnect specific peer
await disconnect();       // Android: disconnect all / iOS: disconnect session
```

### Messaging

#### `sendText(targetPeerId, text)`

Sends a UTF-8 text message to a connected peer.

```ts
import { sendText } from "expo-nearby-connections";

await sendText(peerId, "Hello!");
```

### Events

All event listeners return an `Unsubscribe` function. Call it to remove the listener.

#### `onPeerFound(callback)`

Fires when a discoverer finds an advertiser.

```ts
import { onPeerFound } from "expo-nearby-connections";

const unsubscribe = onPeerFound(({ peerId, name }) => {
  console.log("Found:", name);
});

unsubscribe(); // cleanup
```

#### `onPeerLost(callback)`

Fires when a previously discovered advertiser goes out of range.

```ts
import { onPeerLost } from "expo-nearby-connections";

const unsubscribe = onPeerLost(({ peerId }) => {
  // remove from list
});
```

#### `onInvitationReceived(callback)`

Fires on the advertiser when a discoverer calls `requestConnection`.

```ts
import { onInvitationReceived } from "expo-nearby-connections";

const unsubscribe = onInvitationReceived(({ peerId, name }) => {
  // prompt user to accept/reject
});
```

#### `onConnected(callback)`

Fires on both sides when a connection is fully established.

```ts
import { onConnected } from "expo-nearby-connections";

const unsubscribe = onConnected(({ peerId, name }) => {
  // connection ready
});
```

#### `onDisconnected(callback)`

Fires when a peer disconnects.

```ts
import { onDisconnected } from "expo-nearby-connections";

const unsubscribe = onDisconnected(({ peerId }) => {
  // remove from connected list
});
```

#### `onTextReceived(callback)`

Fires when a text message arrives from a connected peer.

```ts
import { onTextReceived } from "expo-nearby-connections";

const unsubscribe = onTextReceived(({ peerId, text }) => {
  console.log("Message from", peerId, ":", text);
});
```

## Usage example

### Advertiser side

```tsx
import { useEffect, useState } from "react";
import {
  startAdvertise,
  stopAdvertise,
  onInvitationReceived,
  onConnected,
  onDisconnected,
  acceptConnection,
} from "expo-nearby-connections";

function AdvertiserScreen() {
  const [myPeerId, setMyPeerId] = useState<string>();

  useEffect(() => {
    startAdvertise("My Device").then(setMyPeerId);
    return () => { stopAdvertise(); };
  }, []);

  useEffect(() => {
    const unsub = onInvitationReceived(({ peerId }) => {
      acceptConnection(peerId);
    });
    return unsub;
  }, []);
}
```

### Discoverer side

```tsx
import { useEffect, useState } from "react";
import {
  startDiscovery,
  stopDiscovery,
  onPeerFound,
  onPeerLost,
  requestConnection,
  type BasePeer,
} from "expo-nearby-connections";

function DiscovererScreen() {
  const [peers, setPeers] = useState<BasePeer[]>([]);

  useEffect(() => {
    startDiscovery("My Device");
    return () => { stopDiscovery(); };
  }, []);

  useEffect(() => {
    const unsubFound = onPeerFound((peer) => {
      setPeers((prev) => [...prev, peer]);
    });
    const unsubLost = onPeerLost(({ peerId }) => {
      setPeers((prev) => prev.filter((p) => p.peerId !== peerId));
    });
    return () => { unsubFound(); unsubLost(); };
  }, []);

  const connect = (peerId: string) => requestConnection(peerId);
}
```

## Development

```bash
# from repo root
pnpm install
pnpm build

# run example app
cd example
pnpm install
pnpm prebuild --clean --no-install

# iOS
pnpm ios

# Android
pnpm android
```

## Contributing

Contributions are welcome. Please open an issue first for major changes.

See [CHANGELOG.md](./CHANGELOG.md) for release history.
