import { ConfigPlugin, withInfoPlist } from "@expo/config-plugins";
import { PluginProps } from "./plugin-props.type";

/**
 * Adds NSLocalNetworkUsageDescription key to Info.plist, which is
 * necessary for using nearby connections on iOS 14+.
 *
 * @param config Expo config object
 * @param props {@link PluginProps}
 * @returns Modified Expo config object
 */
export const withNSLocalNetworkUsageInfoPlist: ConfigPlugin<PluginProps> = (
  config,
  { localNetworkUsagePermissionText }
) => {
  return withInfoPlist(config, (plistConfig) => {
    const permissionText =
      localNetworkUsagePermissionText ||
      "$(PRODUCT_NAME) need access to your local network to discover nearby devices";

    plistConfig.modResults.NSLocalNetworkUsageDescription = permissionText;

    return plistConfig;
  });
};
