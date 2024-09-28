import React, { useCallback } from "react";
import { Alert, Linking, Platform } from "react-native";
import {
  checkMultiple,
  PERMISSIONS,
  requestMultiple,
  RESULTS,
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

export const useNearbyPermission = (isRequestImmediately = false) => {
  const [isGranted, setIsGranted] = React.useState(false);

  const requestPermissionHandler = useCallback(async () => {
    const [error, result] = await safeAwait(checkAndRequestPermission());

    if (error) {
      return false;
    }

    if (!result) {
      Alert.alert(
        "Permission",
        "Please allow the permission to use the nearby feature",
        [
          {
            text: "Open Settings",
            onPress: () => Linking.openSettings(),
          },
        ]
      );
    }

    setIsGranted(result);

    return result;
  }, []);

  React.useEffect(() => {
    if (isRequestImmediately) {
      requestPermissionHandler();
    }
  }, [isRequestImmediately, requestPermissionHandler]);

  return { isGranted, requestPermissionHandler };
};
