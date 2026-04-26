import { NitroModules } from "react-native-nitro-modules";
import type { NearbyConnections } from "../NearbyConnections.nitro";

export const nearbyConnectionsModule =
  NitroModules.createHybridObject<NearbyConnections>("NearbyConnections");
