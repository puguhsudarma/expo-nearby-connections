import { requireNativeViewManager } from 'expo-modules-core';
import * as React from 'react';

import { ExpoNearbyConnectionsViewProps } from './ExpoNearbyConnections.types';

const NativeView: React.ComponentType<ExpoNearbyConnectionsViewProps> =
  requireNativeViewManager('ExpoNearbyConnections');

export default function ExpoNearbyConnectionsView(props: ExpoNearbyConnectionsViewProps) {
  return <NativeView {...props} />;
}
