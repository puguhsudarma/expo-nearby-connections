import { Platform } from "react-native";
import { EventNames, TextReceived } from "../types/nearby-connections.types";
import { genericEventListenerBuilder } from "../utilities/generic-event-listener-builder";
import { nearbyConnectionsModule } from "./nearby-connections-module";

export const requestConnection = async (
  name: string,
  advertisePeerId: string,
  timeoutInSeconds: number = 30
): Promise<void> => {
  if (Platform.OS === "ios") {
    return nearbyConnectionsModule.requestConnection(
      name,
      advertisePeerId,
      timeoutInSeconds
    );
  }

  return nearbyConnectionsModule.requestConnection(name, advertisePeerId);
};

export const acceptConnection = async (peerId: string): Promise<void> => {
  return nearbyConnectionsModule.acceptConnection(peerId);
};

export const rejectConnection = async (peerId: string): Promise<void> => {
  return nearbyConnectionsModule.rejectConnection(peerId);
};

export const disconnect = async (peerId?: string): Promise<void> => {
  return nearbyConnectionsModule.disconnect(peerId);
};

export const sendText = async (peerId: string, text: string): Promise<void> => {
  return nearbyConnectionsModule.sendText(peerId, text);
};

export const onTextReceived = genericEventListenerBuilder<TextReceived>(
  EventNames.ON_TEXT_RECEIVED
);
