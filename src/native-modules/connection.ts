import { Platform } from "react-native";
import { EventNames, TextReceived } from "../types/nearby-connections.types";
import { genericEventListenerBuilder } from "../utilities/generic-event-listener-builder";
import { nearbyConnectionsModule } from "./nearby-connections-module";

export const requestConnection = async (
  advertisePeerId: string
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
  if (Platform.OS === "ios") {
    return nearbyConnectionsModule.disconnect();
  }

  return nearbyConnectionsModule.disconnect(targetPeerId);
};

export const sendText = async (
  targetPeerId: string,
  text: string
): Promise<void> => {
  return nearbyConnectionsModule.sendText(targetPeerId, text);
};

export const onTextReceived = genericEventListenerBuilder<TextReceived>(
  EventNames.ON_TEXT_RECEIVED
);
