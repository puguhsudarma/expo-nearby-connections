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

const toCamelCase = (str: string) => {
  return str
    .toLowerCase() // Convert the entire string to lowercase
    .replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, (match, index) =>
      index === 0 ? match.toLowerCase() : match.toUpperCase().trim()
    );
};

const withNSBonjourServicesInfoPlist: ConfigPlugin<Props> = (
  config,
  { bonjourServicesName }
) => {
  return withInfoPlist(config, (plistConfig) => {
    const name = bonjourServicesName || toCamelCase(config.name);

    plistConfig.modResults.NSBonjourServices = [
      `_${name}._tcp`,
      `_${name}._udp`,
    ];

    return plistConfig;
  });
};

const withNSLocalNetworkUsageInfoPlist: ConfigPlugin<Props> = (
  config,
  { localNetworkUsagePermissionText: networkUsagePermissionText }
) => {
  return withInfoPlist(config, (plistConfig) => {
    const permissionText =
      networkUsagePermissionText ||
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
  {
    bonjourServicesName,
    localNetworkUsagePermissionText: networkUsagePermissionText,
  }
) => {
  return withPlugins(config, [
    [withNSBonjourServicesInfoPlist, { bonjourServicesName }],
    [withNSLocalNetworkUsageInfoPlist, { networkUsagePermissionText }],
    withAndroidPermissions,
  ]);
};

export default withExpoNearbyConnectionPlugin;
