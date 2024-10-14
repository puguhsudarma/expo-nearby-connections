import { AndroidConfig, ConfigPlugin } from "@expo/config-plugins";

/**
 * Adds permissions to the Android app manifest required for using the
 * {@link nearby-connections} module.
 *
 * @param config Expo config object
 * @returns Modified Expo config object
 */
export const withAndroidPermissions: ConfigPlugin = (config) => {
  const { withPermissions } = AndroidConfig.Permissions;

  return withPermissions(config, [
    "android.permission.ACCESS_WIFI_STATE",
    "android.permission.CHANGE_WIFI_STATE",
    "android.permission.BLUETOOTH",
    "android.permission.BLUETOOTH_ADMIN",
    "android.permission.ACCESS_COARSE_LOCATION",
    "android.permission.ACCESS_FINE_LOCATION",
    "android.permission.BLUETOOTH_ADVERTISE",
    "android.permission.BLUETOOTH_CONNECT",
    "android.permission.BLUETOOTH_SCAN",
    "android.permission.NEARBY_WIFI_DEVICES",
  ]);
};
