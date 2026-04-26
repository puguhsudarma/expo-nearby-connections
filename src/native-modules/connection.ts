import type { TextReceived } from "../types/nearby-connections.types";
import { createEventHandler } from "../utilities/create-event-handler";
import { nearbyConnectionsModule } from "./nearby-connections-module";

const textReceivedHandler = createEventHandler<TextReceived>();

nearbyConnectionsModule.onTextReceived = (peerId, text) =>
  textReceivedHandler.emit({ peerId, text });

export const requestConnection = async (
  advertisePeerId: string,
): Promise<void> => {
  return nearbyConnectionsModule.requestConnection(advertisePeerId);
};

export const acceptConnection = async (targetPeerId: string): Promise<void> => {
  return nearbyConnectionsModule.acceptConnection(targetPeerId);
};

export const rejectConnection = async (targetPeerId: string): Promise<void> => {
  return nearbyConnectionsModule.rejectConnection(targetPeerId);
};

export const disconnect = async (connectedPeerId?: string): Promise<void> => {
  return nearbyConnectionsModule.disconnect(connectedPeerId);
};

export const sendText = async (
  connectedPeerId: string,
  text: string,
): Promise<void> => {
  return nearbyConnectionsModule.sendText(connectedPeerId, text);
};

export const onTextReceived = textReceivedHandler.subscribe;
