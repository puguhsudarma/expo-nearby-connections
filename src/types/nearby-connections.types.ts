export { Strategy } from "../NearbyConnections.nitro";

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
