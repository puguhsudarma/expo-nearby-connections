import {
  AndroidConfig,
  ConfigPlugin,
  withInfoPlist,
  withPlugins,
} from "@expo/config-plugins";

interface Props {
  bonjourServicesName?: string;
  localNetworkUsagePermissionText?: string;
}

function toKebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, "$1 $2") // Insert space between camelCase words
    .replace(/[\s_]+/g, "-") // Replace spaces or underscores with hyphens
    .replace(/[^a-zA-Z0-9-]/g, "") // Remove non-alphanumeric characters except hyphen
    .toLowerCase(); // Convert to lowercase
}

const withNSBonjourServicesInfoPlist: ConfigPlugin<Props> = (
  config,
  { bonjourServicesName }
) => {
  return withInfoPlist(config, (plistConfig) => {
    const name = toKebabCase(bonjourServicesName || config.name);

    plistConfig.modResults.NSBonjourServices = [`_${name}._tcp`];

    return plistConfig;
  });
};

const withNSLocalNetworkUsageInfoPlist: ConfigPlugin<Props> = (
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

const withAndroidPermissions: ConfigPlugin = (config) => {
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

const withExpoNearbyConnectionPlugin: ConfigPlugin<Props> = (
  config,
  { bonjourServicesName, localNetworkUsagePermissionText }
) => {
  return withPlugins(config, [
    [withNSBonjourServicesInfoPlist, { bonjourServicesName }],
    [withNSLocalNetworkUsageInfoPlist, { localNetworkUsagePermissionText }],
    withAndroidPermissions,
  ]);
};

export default withExpoNearbyConnectionPlugin;
