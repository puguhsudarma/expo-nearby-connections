import { NearbyConnectionsNativeModule } from "../types/nearby-connections.types";
import { requireNativeModule } from "expo-modules-core";

const MODULE_NAME = "ExpoNearbyConnectionsModule";

// It loads the native module object from the JSI or falls back to
// the bridge module (from NativeModulesProxy) if the remote debugger is on.
export const nearbyConnectionsModule = requireNativeModule(
  MODULE_NAME
) as NearbyConnectionsNativeModule;
