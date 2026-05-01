import { Strategy } from "../NearbyConnections.nitro";
import {
  connectedHandler,
  disconnectedHandler,
  invitationReceivedHandler,
  nearbyConnectionsModule,
} from "./nearby-connections-module";

export const startAdvertise = async (
  name: string,
  strategy: Strategy = Strategy.P2P_STAR,
): Promise<string> => {
  return nearbyConnectionsModule.startAdvertise(name, strategy);
};

export const stopAdvertise = async (): Promise<void> => {
  return nearbyConnectionsModule.stopAdvertise();
};

export const onInvitationReceived = invitationReceivedHandler.subscribe;
export const onConnected = connectedHandler.subscribe;
export const onDisconnected = disconnectedHandler.subscribe;
