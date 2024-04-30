import {
  EventEmitter,
  NativeModulesProxy,
  requireNativeModule,
} from "expo-modules-core";
import {
  NearbyConnectionEvents,
  NearbyConnectionsNativeModule,
} from "./nearby-connections.types";

// It loads the native module object from the JSI or falls back to
// the bridge module (from NativeModulesProxy) if the remote debugger is on.
export const nearbyConnectionsModule = requireNativeModule(
  "NearbyConnections"
) as NearbyConnectionsNativeModule;

export const nearbyConnectionGenericListener = <T>(
  eventName: NearbyConnectionEvents,
  callback?: (data: T) => void
): Function => {
  // It creates an event emitter that is used to emit events to listeners.
  const nearbyConnectionsEmitter = new EventEmitter(
    (nearbyConnectionsModule as any) ?? NativeModulesProxy.ExpoNearbyConnections
  );
  const eventListener = nearbyConnectionsEmitter.addListener<T>(
    eventName,
    (data) => callback?.(data)
  );

  return () => {
    eventListener.remove();
  };
};
