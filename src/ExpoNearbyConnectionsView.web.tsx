import * as React from 'react';

import { ExpoNearbyConnectionsViewProps } from './ExpoNearbyConnections.types';

export default function ExpoNearbyConnectionsView(props: ExpoNearbyConnectionsViewProps) {
  return (
    <div>
      <span>{props.name}</span>
    </div>
  );
}
