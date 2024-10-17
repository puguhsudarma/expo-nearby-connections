# Expo Nearby Connection Library

## Introduction

The Expo Nearby Connection Library enables peer-to-peer (P2P) connections between mobile devices. It is an Expo wrapper for Android and iOS, with Android using [Google's Nearby Connections](https://developers.google.com/nearby/connections/overview) API and iOS using [Apple's Multipeer Connectivity framework](https://developer.apple.com/documentation/multipeerconnectivity). This library allows users to discover nearby devices, establish connections, and exchange data seamlessly.

**Note:** It does not yet support cross-platform P2P connections between Android and iOS devices.

## Getting Started

### Installation

Run the following command to install the library:

```bash
yarn add expo-nearby-connections
```

or you can use the expo cli to install the library:

```bash
npx expo install expo-nearby-connections
```

### Expo Plugin

Update your `app.json` or `app.config.ts` file:

```json
{
  "name": "Awesome Chat",
  "plugins": [
    [
      "expo-nearby-connections",
      {
        "bonjourServicesName": "awesome-chat",
        "localNetworkUsagePermissionText": "$(PRODUCT_NAME) need access to your local network to discover nearby devices"
      }
    ]
  ]
}
```

or you can just use the plugin without the props.

```json
{
  "name": "Awesome Chat",
  "plugins": ["expo-nearby-connections"]
}
```

## Setup Permissions

For now this library isn't support for permission handler yet. You can use other library to handle permissions, something like [react-native-permissions](https://github.com/react-native-community/react-native-permissions). Google Nearby Connections on Android requires a few specific permissions to use the library. For more information, you can check [Android's documentation](https://developers.google.com/nearby/connections/android/get-started#request_permissions).

```ts
import {
  PERMISSIONS,
  RESULTS,
  checkMultiple,
  requestMultiple,
} from "react-native-permissions";

async function checkAndRequestPermission(): Promise<boolean> {
  const permissions =
    Platform.OS === "ios"
      ? [PERMISSIONS.IOS.BLUETOOTH]
      : [
          PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION,
          PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
          PERMISSIONS.ANDROID.BLUETOOTH_ADVERTISE,
          PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
          PERMISSIONS.ANDROID.BLUETOOTH_SCAN,
          PERMISSIONS.ANDROID.NEARBY_WIFI_DEVICES,
        ];

  const checkPermissionStatus = await checkMultiple(permissions);

  const isAllGranted = Object.values(checkPermissionStatus).every((value) => {
    return (
      value === RESULTS.GRANTED ||
      value === RESULTS.UNAVAILABLE ||
      value === RESULTS.LIMITED
    );
  });

  if (isAllGranted) {
    return true;
  }

  // Request permission
  const result = await requestMultiple(permissions);

  const requestIsGranted = Object.values(result).every((value) => {
    return (
      value === RESULTS.GRANTED ||
      value === RESULTS.UNAVAILABLE ||
      value === RESULTS.LIMITED
    );
  });

  return requestIsGranted;
}
```

## Detailed API Usage

### Constants

#### `Strategy`

Overview of connection strategies in Nearby Connections for Android.

```ts
enum Strategy {
  P2P_CLUSTER = 1,
  P2P_STAR = 2,
  P2P_POINT_TO_POINT = 3,
}
```

### Function Handlers

#### `startAdvertise()`

Initiate devices to broadcast a connection to other devices.

```ts
function startAdvertise(
  name: string,
  strategy?: Strategy = Strategy.P2P_STAR // only for android
): Promise<string>;
```

```ts
import { startAdvertise } from "expo-nearby-connections";

startAdvertise("My Device Name Or ID", Strategy.P2P_STAR)
  .then((peerId) => {
    setMyPeerId(peerId);
  })
  .catch((error) => {
    console.log("Error in startAdvertise: ", error);
  });
```

#### `stopAdvertise()`

Stop advertising a connection.

```ts
function stopAdvertise(): Promise<void>;
```

```ts
import { stopAdvertise } from "expo-nearby-connections";

stopAdvertise()
  .then(() => {
    // handler after stop advertising
  })
  .catch((error) => {
    console.log("Error in stopAdvertise: ", error);
  });
```

#### `startDiscovery()`

Initiate devices to discover a nearby devices.

```ts
function startDiscovery(
  name: string,
  strategy?: Strategy = Strategy.P2P_STAR // only for android
): Promise<string>;
```

```ts
import { startDiscovery } from "expo-nearby-connections";

startDiscovery("My Device Name Or ID", Strategy.P2P_STAR)
  .then((peerId) => {
    setMyPeerId(peerId);
  })
  .catch((error) => {
    console.log("Error in startDiscovery: ", error);
  });
```

#### `stopDiscovery()`

Stop discovering a nearby devices.

```ts
function stopDiscovery(): Promise<void>;
```

```ts
import { stopDiscovery } from "expo-nearby-connections";

stopDiscovery()
  .then(() => {
    // handler after stop discovering
  })
  .catch((error) => {
    console.log("Error in stopDiscovery: ", error);
  });
```

#### `requestConnection()`

Request a connection to a nearby device.

```ts
function requestConnection(advertisePeerId: string): Promise<void>;
```

```ts
import { requestConnection } from "expo-nearby-connections";

requestConnection(advertisePeerId)
  .then(() => {
    // handler after request connection
  })
  .catch((error) => {
    console.log("Error in requestConnection: ", error);
  });
```

#### `acceptConnection()`

Accept a connection from a nearby device.

```ts
function acceptConnection(targetPeerId: string): Promise<void>;
```

```ts
import { acceptConnection } from "expo-nearby-connections";

acceptConnection(targetPeerId)
  .then(() => {
    // handler after accept connection
  })
  .catch((error) => {
    console.log("Error in acceptConnection: ", error);
  });
```

#### `rejectConnection()`

Reject a connection from a nearby device.

```ts
function rejectConnection(targetPeerId: string): Promise<void>;
```

```ts
import { rejectConnection } from "expo-nearby-connections";

rejectConnection(targetPeerId)
  .then(() => {
    // handler after reject connection
  })
  .catch((error) => {
    console.log("Error in rejectConnection: ", error);
  });
```

#### `disconnect()`

disconnect from a connected nearby devices.

```ts
function disconnect(
  connectedPeerId?: string // for android only
): Promise<void>;
```

```ts
import { disconnect } from "expo-nearby-connections";

disconnect(connectedPeerId)
  .then(() => {
    // handler after disconnect
  })
  .catch((error) => {
    console.log("Error in disconnect: ", error);
  });
```

#### `sendText()`

Send text to a connected nearby devices.

```ts
function sendText(connectedPeerId: string, text: string): Promise<void>;
```

```ts
import { sendText } from "expo-nearby-connections";

sendText(connectedPeerId, text)
  .then(() => {
    // handler after send text
  })
  .catch((error) => {
    console.log("Error in sendText: ", error);
  });
```

### Event Handlers

#### `onInvitationReceived()`

listener for incoming invitation request connection from nearby devices.

```ts
function onInvitationReceived(
  (data: {peerId: string; name: string}) => void
): Function;
```

```ts
import { onInvitationReceived } from "expo-nearby-connections";

const unsubscribe = onInvitationReceived(({ peerId, name }) => {
  // handler
});

unsubscribe();
```

#### `onConnected()`

listener for connected to nearby devices.

```ts
function onConnected(
  (data: {peerId: string; name: string}) => void
): Function;
```

```ts
import { onConnected } from "expo-nearby-connections";

const unsubscribe = onConnected(({ peerId, name }) => {
  // handler
});

unsubscribe();
```

#### `onDisconnected()`

listener for disconnected from nearby devices.

```ts
function onDisconnected(
  (data: {peerId: string}) => void
): Function;
```

```ts
import { onDisconnected } from "expo-nearby-connections";

const unsubscribe = onDisconnected(({ peerId }) => {
  // handler
});

unsubscribe();
```

#### `onPeerFound()`

listener for found nearby devices.

```ts
function onPeerFound(
  (data: {peerId: string; name: string}) => void
): Function;
```

```ts
import { onPeerFound } from "expo-nearby-connections";

const unsubscribe = onPeerFound(({ peerId, name }) => {
  // handler
});

unsubscribe();
```

#### `onPeerLost()`

listener for lost nearby devices.

```ts
function onPeerLost(
  (data: {peerId: string}) => void
): Function;
```

```ts
import { onPeerLost } from "expo-nearby-connections";

const unsubscribe = onPeerLost(({ peerId }) => {
  // handler
});

unsubscribe();
```

#### `onTextReceived()`

listener for text received from nearby devices.

```ts
function onTextReceived(
  (data: {peerId: string; text: string}) => void
): Function;
```

```ts
import { onTextReceived } from "expo-nearby-connections";

const unsubscribe = onTextReceived(({ peerId, text }) => {
  // handler
});

unsubscribe();
```

### Basic Setup

this is the basic setup for using the library.

#### Advertise a connection to other devices

```ts
import * as NearbyConnections from "expo-nearby-connection";

...

// Advertise a connection
useEffect(() => {
    NearbyConnections.startAdvertise("My Device Name Or ID")
        .then((peerId) => {
            setMyPeerId(peerId);
        }).catch((error) => {
            // error handler
        })

    return () => {
        stopAdvertise();
    }
}, [])

// Listen for incoming connections
useEffect(() => {
    const onInvitationListener = NearbyConnections.onInvitationReceived((data) => {
        // handler when discovery device is requesting connection
        NearbyConnections.acceptConnection(data.peerId)
    })

    const onConnectedListener = NearbyConnections.onConnected((data) => {
        // handler when the advertise device is accepted the request connection
    })

    const onDisconnectedListener = NearbyConnections.onDisconnected((data) => {
        // handler when discovery device is disconnected
    })

    return () => {
        onInvitationListener();
        onConnectedListener();
        onDisconnectedListener();
    }
}, [])
```

#### Discover nearby devices

```ts
import * as NearbyConnections from "expo-nearby-connection";

...

// Discover a connection
useEffect(() => {
    NearbyConnections.startDiscovery("My Device Name Or ID")
        .then((peerId) => {
            setMyPeerId(peerId);
        }).catch((error) => {
            // error handler
        })

    return () => {
        stopDiscovery();
    }
}, [])

// Listen for discovered devices
useEffect(() => {
    const onPeerFoundListener = NearbyConnections.onPeerFound((data) => {
        setDiscoveredPeers((peers) => [...peers, data]);
    })

    const onPeerLostListener = NearbyConnections.onPeerLost((data) => {
        setDiscoveredPeers((peers) =>
            peers.filter((peer) => peer.peerId !== data.peerId)
        );
    })

    return () => {
        onPeerFoundListener();
        onPeerLostListener();
    }
})

// Listen for connection state that coming from advertised devices
useEffect(() => {
    const onConnectedListener = NearbyConnections.onConnected((data) => {
        // handler when the advertise device is accepted the request connection
    })

    const onDisconnectedListener = NearbyConnections.onDisconnected((data) => {
        // handler when the advertise device is rejected the request connection
    })

    return () => {
        onConnectedListener();
        onDisconnectedListener();
    }
}, [])

const handleRequestConnection = (selectedPeerId: string) => {
    NearbyConnections.requestConnection(selectedPeerId);
}
```

#### Sending and Receiving Text

```ts
import * as NearbyConnections from "expo-nearby-connection";

...

// Listen to incoming text messages
useEffect(() => {
    const onTextReceivedListener = NearbyConnections.onTextReceived((data) => {
        setMessages((message) => [...message, {
            peerId: data.peerId,
            text: data.text
        }]);
    })

    return () => {
        onTextReceivedListener();
    }
})

const handleSendText = (message: string) => {
    NearbyConnections.sendText(connectedPeerId, message);
}
```

## Contributing

We welcome contributions! Please submit a pull request or file an issue on our GitHub repository.
