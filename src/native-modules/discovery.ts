import type { PeerFound, PeerLost } from "../types/nearby-connections.types";
import { Strategy } from "../NearbyConnections.nitro";
import { createEventHandler } from "../utilities/create-event-handler";
import { nearbyConnectionsModule } from "./nearby-connections-module";

const peerFoundHandler = createEventHandler<PeerFound>();
const peerLostHandler = createEventHandler<PeerLost>();

nearbyConnectionsModule.onPeerFound = (peerId, name) =>
  peerFoundHandler.emit({ peerId, name });
nearbyConnectionsModule.onPeerLost = (peerId) =>
  peerLostHandler.emit({ peerId });

export const startDiscovery = async (
  name: string,
  strategy: Strategy = Strategy.P2P_STAR,
): Promise<string> => {
  return nearbyConnectionsModule.startDiscovery(name, strategy);
};

export const stopDiscovery = async (): Promise<void> => {
  return nearbyConnectionsModule.stopDiscovery();
};

export const onPeerFound = peerFoundHandler.subscribe;
export const onPeerLost = peerLostHandler.subscribe;
