import type { HybridObject } from 'react-native-nitro-modules'

export enum Strategy {
  P2P_CLUSTER = 1,
  P2P_STAR = 2,
  P2P_POINT_TO_POINT = 3,
}

export interface NearbyConnections extends HybridObject<{ ios: 'swift'; android: 'kotlin' }> {
  // Imperative methods
  isPlayServicesAvailable(): Promise<boolean>
  startAdvertise(name: string, strategy?: Strategy): Promise<string>
  stopAdvertise(): Promise<void>
  startDiscovery(name: string, strategy?: Strategy): Promise<string>
  stopDiscovery(): Promise<void>
  requestConnection(advertisePeerId: string): Promise<void>
  acceptConnection(targetPeerId: string): Promise<void>
  rejectConnection(targetPeerId: string): Promise<void>
  disconnect(targetPeerId?: string): Promise<void>
  sendText(targetPeerId: string, text: string): Promise<void>

  // Event callbacks (Native → JS, direct invocation)
  onPeerFound?: (peerId: string, name: string) => void
  onPeerLost?: (peerId: string) => void
  onInvitationReceived?: (peerId: string, name: string) => void
  onConnected?: (peerId: string, name: string) => void
  onDisconnected?: (peerId: string) => void
  onTextReceived?: (peerId: string, text: string) => void
}
