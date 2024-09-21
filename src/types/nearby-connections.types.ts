export enum Strategy {
  P2P_CLUSTER = 1,
  P2P_STAR = 2,
  P2P_POINT_TO_POINT = 3,
}

export interface NearbyConnectionsNativeModule {
  isPlayServicesAvailable(): Promise<boolean>;

  startAdvertise(name: string, strategy?: Strategy): Promise<string>;

  stopAdvertise(): Promise<void>;

  startDiscovery(name: string, strategy?: Strategy): Promise<string>;

  stopDiscovery(): Promise<void>;

  requestConnection(
    name: string,
    advertisePeerId: string,
    timeoutInSeconds?: number
  ): Promise<void>;

  acceptConnection(peerId: string): Promise<void>;

  rejectConnection(peerId: string): Promise<void>;

  disconnect(peerId?: string): Promise<void>;

  sendText(peerId: string, text: string): Promise<void>;
}

export enum EventNames {
  ON_PEER_FOUND = "onPeerFound",
  ON_PEER_LOST = "onPeerLost",
  ON_INVITATION_RECEIVED = "onInvitationReceived",
  ON_CONNECTED = "onConnected",
  ON_DISCONNECTED = "onDisconnected",
  ON_TEXT_RECEIVED = "onTextReceived",
}

export interface PeerFound {
  peerId: string;
  name: string;
}

export type OnPeerFound = (data: PeerFound) => void;

export interface PeerLost {
  peerId: string;
}

export type OnPeerLost = (data: PeerLost) => void;

export interface InvitationReceived {
  peerId: string;
  name: string;
}

export type OnInvitationReceived = (data: InvitationReceived) => void;

export interface Connected {
  peerId: string;
  name: string;
}

export type OnConnected = (data: Connected) => void;

export interface Disconnected {
  endpointId: string;
}

export type OnDisconnected = (data: Disconnected) => void;

export interface TextReceived {
  peerId: string;
  text: string;
}

export type OnTextReceived = (data: TextReceived) => void;
