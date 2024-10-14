import { ConfigPlugin, withPlugins } from "@expo/config-plugins";
import { PluginProps } from "./plugin-props.type";
import { withAndroidPermissions } from "./with-android-permissions";
import { withNSBonjourServicesInfoPlist } from "./with-nsbonjour-services-info-plist";
import { withNSLocalNetworkUsageInfoPlist } from "./with-nslocal-network-usage-info-plist";

const withExpoNearbyConnectionPlugin: ConfigPlugin<PluginProps> = (
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
