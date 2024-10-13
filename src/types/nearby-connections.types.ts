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
    advertisePeerId: string,
    timeoutInSeconds?: number
  ): Promise<void>;

  acceptConnection(targetPeerId: string): Promise<void>;

  rejectConnection(targetPeerId: string): Promise<void>;

  disconnect(targetPeerId?: string): Promise<void>;

  sendText(targetPeerId: string, text: string): Promise<void>;
}

export enum EventNames {
  ON_PEER_FOUND = "onPeerFound",
  ON_PEER_LOST = "onPeerLost",
  ON_INVITATION_RECEIVED = "onInvitationReceived",
  ON_CONNECTED = "onConnected",
  ON_DISCONNECTED = "onDisconnected",
  ON_TEXT_RECEIVED = "onTextReceived",
}

export interface BasePeer {
  peerId: string;
  name: string;
}

export interface PeerFound extends BasePeer {}

export type OnPeerFound = (data: PeerFound) => void;

export interface PeerLost extends Pick<BasePeer, "peerId"> {}

export type OnPeerLost = (data: PeerLost) => void;

export interface InvitationReceived extends BasePeer {}

export type OnInvitationReceived = (data: InvitationReceived) => void;

export interface Connected extends BasePeer {}

export type OnConnected = (data: Connected) => void;

export interface Disconnected extends Pick<BasePeer, "peerId"> {}

export type OnDisconnected = (data: Disconnected) => void;

export interface TextReceived extends Pick<BasePeer, "peerId"> {
  text: string;
}

export type OnTextReceived = (data: TextReceived) => void;
