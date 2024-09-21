import { EventEmitter, NativeModulesProxy } from "expo-modules-core";
import { nearbyConnectionsModule } from "../native-modules/nearby-connections-module";
import { EventNames } from "../types/nearby-connections.types";

export const genericEventListenerBuilder =
  <T>(eventName: EventNames) =>
  (callback: (data: T) => void): Function => {
    // It creates an event emitter that is used to emit events to listeners.
    const nearbyConnectionsEmitter = new EventEmitter(
      (nearbyConnectionsModule as any) ??
        NativeModulesProxy.ExpoNearbyConnections
    );

    const eventListener = nearbyConnectionsEmitter.addListener<T>(
      eventName,
      (data) => callback?.(data)
    );

    return () => {
      eventListener.remove();
    };
  };
