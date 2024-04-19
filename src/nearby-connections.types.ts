export enum PayloadType {
  BYTES = 1,
  FILE = 2,
  STREAM = 3,
}

export enum PayloadTransferStatus {
  CANCELED = 4,
  FAILURE = 2,
  IN_PROGRESS = 3,
  SUCCESS = 1,
}

export enum Strategy {
  P2P_CLUSTER = 1,
  P2P_STAR = 2,
  P2P_POINT_TO_POINT = 3,
}

export enum NearbyConnectionEvents {
  CONNECTION_RESULT = "onConnectionResult",
  DISCONNECTED = "onDisconnected",
  CONNECTION_INITIATED = "onConnectionInitiated",
  ENDPOINT_FOUND = "onEndpointFound",
  ENDPOINT_LOST = "onEndpointLost",
  PAYLOAD_RECEIVED = "onPayloadReceived",
  PAYLOAD_TRANSFER_UPDATE = "onPayloadTransferUpdate",
}

export interface RawConnectionResult {
  endpointId: string;
  status: string;
  statusMessage: string;
  isSuccess: string;
}

export interface ConnectionResult
  extends Omit<RawConnectionResult, "isSuccess" | "status"> {
  isSuccess: boolean;
  status: number;
}

export interface Disconnected {
  endpointId: string;
}

export interface RawConnectionInitiated {
  endpointId: string;
  endpointName: string;
  authenticationDigits: string;
  isIncomingConnection: string;
}

export interface ConnectionInitiated
  extends Omit<RawConnectionInitiated, "isIncomingConnection"> {
  isIncomingConnection: boolean;
}

export interface EndpointFound {
  endpointId: string;
  endpointName: string;
  serviceId: string;
  endpointInfo: string;
}

export interface EndpointLost {
  endpointId: string;
}

export interface RawPayloadReceived {
  endpointId: string;
  payloadType: string;
  payloadId: string;
  payload?: string;
}

export interface PayloadReceived
  extends Omit<RawPayloadReceived, "payloadType" | "payloadId"> {
  payloadType: PayloadType;
  payloadId: number;
}

export interface RawPayloadTransferUpdate {
  endpointId: string;
  payloadId: string;
  status: string;
  totalBytes: string;
  bytesTransferred: string;
}

export interface PayloadTransferUpdate
  extends Omit<
    RawPayloadTransferUpdate,
    "payloadId" | "status" | "totalBytes" | "bytesTransferred"
  > {
  payloadId: number;
  status: PayloadTransferStatus;
  totalBytes: number;
  bytesTransferred: number;
}

export type onConnectionResultCallback = (data: ConnectionResult) => void;

export type onDisconnectedCallback = (data: Disconnected) => void;

export type onConnectionInitiatedCallback = (data: ConnectionInitiated) => void;

export type onEndpointFoundCallback = (data: EndpointFound) => void;

export type onEndpointLostCallback = (data: EndpointLost) => void;

export type onPayloadReceivedCallback = (data: PayloadReceived) => void;

export type onPayloadTransferUpdateCallback = (
  data: PayloadTransferUpdate
) => void;

export interface ConnectionCallback {
  onConnectionResult?: onConnectionResultCallback;
  onDisconnected?: onDisconnectedCallback;
  onConnectionInitiated?: onConnectionInitiatedCallback;
}

export interface EndpointCallback {
  onEndpointFound?: onEndpointFoundCallback;
  onEndpointLost?: onEndpointLostCallback;
}

export interface NearbyConnectionsNativeModule {
  isGooglePlayServicesAvailable(): Promise<boolean>;

  startAdvertising(
    endpointName: string,
    serviceId: string,
    strategy: Strategy
  ): Promise<void>;
  startDiscovery(serviceId: string, strategy: Strategy): Promise<void>;

  stopAdvertising(): Promise<void>;
  stopDiscovery(): Promise<void>;

  requestConnection(
    endpointName: string,
    advertiserEndpointId: string
  ): Promise<void>;

  acceptConnection(endpointId: string): Promise<void>;
  rejectConnection(endpointId: string): Promise<void>;
  sendPayload(endpointId: string, payload: string): Promise<void>;

  disconnectFromEndpoint(endpointId: string): Promise<void>;
  stopAllEndpoints(): Promise<void>;
}
