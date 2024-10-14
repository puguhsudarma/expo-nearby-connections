import { Platform } from "react-native";
import {
  EventNames,
  PeerFound,
  PeerLost,
  Strategy,
} from "../types/nearby-connections.types";
import { genericEventListenerBuilder } from "../utilities/generic-event-listener-builder";
import { nearbyConnectionsModule } from "./nearby-connections-module";

export const startDiscovery = async (
  name: string,
  strategy: Strategy = Strategy.P2P_STAR
): Promise<string> => {
  if (Platform.OS === "ios") {
    return nearbyConnectionsModule.startDiscovery(name);
  }

  return nearbyConnectionsModule.startDiscovery(name, strategy);
};

export const stopDiscovery = async (): Promise<void> => {
  return nearbyConnectionsModule.stopDiscovery();
};

export const onPeerFound = genericEventListenerBuilder<PeerFound>(
  EventNames.ON_PEER_FOUND
);

export const onPeerLost = genericEventListenerBuilder<PeerLost>(
  EventNames.ON_PEER_LOST
);
