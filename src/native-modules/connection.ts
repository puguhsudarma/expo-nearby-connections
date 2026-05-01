import {
  nearbyConnectionsModule,
  textReceivedHandler,
} from "./nearby-connections-module";

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

export const disconnect = async (targetPeerId?: string): Promise<void> => {
  return nearbyConnectionsModule.disconnect(targetPeerId);
};

export const sendText = async (
  targetPeerId: string,
  text: string,
): Promise<void> => {
  return nearbyConnectionsModule.sendText(targetPeerId, text);
};

export const onTextReceived = textReceivedHandler.subscribe;
