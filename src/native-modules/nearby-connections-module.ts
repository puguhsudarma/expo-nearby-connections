import { ExpoSettingsModuleEvents } from './ExpoSettings.types';
import { NearbyConnectionsNativeModule } from "../types/nearby-connections.types";
import { requireNativeModule, NativeModule } from "expo-modules-core";


// This call loads the native module object from the JSI.
export default requireNativeModule<ExpoSettingsModule>("ExpoNearbyConnectionsModule");