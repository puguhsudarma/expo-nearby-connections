import { ConfigPlugin, withInfoPlist } from "@expo/config-plugins";
import { PluginProps } from "./plugin-props.type";

/**
 * Adds NSBluetoothAlwaysUsageDescription key to Info.plist, which is
 * required for MultipeerConnectivity on iOS 13+.
 *
 * @param config Expo config object
 * @param props {@link PluginProps}
 * @returns Modified Expo config object
 */
export const withNSBluetoothUsageInfoPlist: ConfigPlugin<PluginProps> = (
  config,
  { bluetoothUsagePermissionText }
) => {
  return withInfoPlist(config, (plistConfig) => {
    const permissionText =
      bluetoothUsagePermissionText ||
      "$(PRODUCT_NAME) uses Bluetooth to discover and connect to nearby devices";

    plistConfig.modResults.NSBluetoothAlwaysUsageDescription = permissionText;

    return plistConfig;
  });
};
