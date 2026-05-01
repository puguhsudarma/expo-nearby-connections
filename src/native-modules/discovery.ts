import { Strategy } from "../NearbyConnections.nitro";
import {
  nearbyConnectionsModule,
  peerFoundHandler,
  peerLostHandler,
} from "./nearby-connections-module";

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
