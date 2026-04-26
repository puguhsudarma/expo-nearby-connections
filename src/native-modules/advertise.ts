import type {
  Connected,
  Disconnected,
  InvitationReceived,
} from "../types/nearby-connections.types";
import { Strategy } from "../NearbyConnections.nitro";
import { createEventHandler } from "../utilities/create-event-handler";
import { nearbyConnectionsModule } from "./nearby-connections-module";

const invitationReceivedHandler = createEventHandler<InvitationReceived>();
const connectedHandler = createEventHandler<Connected>();
const disconnectedHandler = createEventHandler<Disconnected>();

nearbyConnectionsModule.onInvitationReceived = (peerId, name) =>
  invitationReceivedHandler.emit({ peerId, name });
nearbyConnectionsModule.onConnected = (peerId, name) =>
  connectedHandler.emit({ peerId, name });
nearbyConnectionsModule.onDisconnected = (peerId) =>
  disconnectedHandler.emit({ peerId });

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
