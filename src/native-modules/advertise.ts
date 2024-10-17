import { Platform } from "react-native";
import {
  Connected,
  Disconnected,
  EventNames,
  InvitationReceived,
  Strategy,
} from "../types/nearby-connections.types";
import { genericEventListenerBuilder } from "../utilities/generic-event-listener-builder";
import { nearbyConnectionsModule } from "./nearby-connections-module";

export const startAdvertise = async (
  name: string,
  strategy: Strategy = Strategy.P2P_STAR
): Promise<string> => {
  if (Platform.OS === "ios") {
    return nearbyConnectionsModule.startAdvertise(name);
  }

  return nearbyConnectionsModule.startAdvertise(name, strategy);
};

export const stopAdvertise = async (): Promise<void> => {
  return nearbyConnectionsModule.stopAdvertise();
};

export const onInvitationReceived =
  genericEventListenerBuilder<InvitationReceived>(
    EventNames.ON_INVITATION_RECEIVED
  );

export const onConnected = genericEventListenerBuilder<Connected>(
  EventNames.ON_CONNECTED
);

export const onDisconnected = genericEventListenerBuilder<Disconnected>(
  EventNames.ON_DISCONNECTED
);
