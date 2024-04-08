import { NativeModulesProxy, EventEmitter, Subscription } from 'expo-modules-core';

// Import the native module. On web, it will be resolved to ExpoNearbyConnections.web.ts
// and on native platforms to ExpoNearbyConnections.ts
import ExpoNearbyConnectionsModule from './ExpoNearbyConnectionsModule';
import ExpoNearbyConnectionsView from './ExpoNearbyConnectionsView';
import { ChangeEventPayload, ExpoNearbyConnectionsViewProps } from './ExpoNearbyConnections.types';

// Get the native constant value.
export const PI = ExpoNearbyConnectionsModule.PI;

export function hello(): string {
  return ExpoNearbyConnectionsModule.hello();
}

export async function setValueAsync(value: string) {
  return await ExpoNearbyConnectionsModule.setValueAsync(value);
}

const emitter = new EventEmitter(ExpoNearbyConnectionsModule ?? NativeModulesProxy.ExpoNearbyConnections);

export function addChangeListener(listener: (event: ChangeEventPayload) => void): Subscription {
  return emitter.addListener<ChangeEventPayload>('onChange', listener);
}

export { ExpoNearbyConnectionsView, ExpoNearbyConnectionsViewProps, ChangeEventPayload };
