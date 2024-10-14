import { ConfigPlugin, withInfoPlist } from "@expo/config-plugins";
import { PluginProps } from "./plugin-props.type";
import { toKebabCase } from "./to-kebab-case";

/**
 * Adds NSBonjourServices key to Info.plist, which is necessary
 * for using nearby connections on iOS.
 *
 * @param config Expo config object
 * @param props {@link PluginProps}
 * @returns Modified Expo config object
 */
export const withNSBonjourServicesInfoPlist: ConfigPlugin<PluginProps> = (
  config,
  { bonjourServicesName }
) => {
  return withInfoPlist(config, (plistConfig) => {
    const name = toKebabCase(bonjourServicesName || config.name);

    plistConfig.modResults.NSBonjourServices = [`_${name}._tcp`];

    return plistConfig;
  });
};
