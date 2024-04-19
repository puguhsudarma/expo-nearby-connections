import {
  nearbyConnectionGenericListener,
  nearbyConnectionsModule,
} from "./nearby-connections-module";
import {
  ConnectionCallback,
  Disconnected,
  EndpointCallback,
  EndpointFound,
  EndpointLost,
  NearbyConnectionEvents,
  PayloadReceived,
  PayloadTransferStatus,
  PayloadTransferUpdate,
  PayloadType,
  RawConnectionInitiated,
  RawConnectionResult,
  Strategy,
  onConnectionInitiatedCallback,
  onConnectionResultCallback,
  onDisconnectedCallback,
  onEndpointFoundCallback,
  onEndpointLostCallback,
  onPayloadReceivedCallback,
  onPayloadTransferUpdateCallback,
} from "./nearby-connections.types";

export const isGooglePlayServicesAvailable =
  nearbyConnectionsModule.isGooglePlayServicesAvailable;

export const startAdvertising = (
  endpointName: string,
  serviceId: string,
  strategy: Strategy,
  callback?: ConnectionCallback
): Function => {
  const onConnectionResultListener = _onConnectionResult(
    callback?.onConnectionResult
  );
  const onDisconnectedListener = _onDisconnected(callback?.onDisconnected);
  const onConnectionInitiatedListener = _onConnectionInitiated(
    callback?.onConnectionInitiated
  );

  nearbyConnectionsModule.startAdvertising(endpointName, serviceId, strategy);

  return () => {
    stopAdvertising();
    onConnectionResultListener();
    onDisconnectedListener();
    onConnectionInitiatedListener();
  };
};

export const stopAdvertising = nearbyConnectionsModule.stopAdvertising;

export const startDiscovery = (
  serviceId: string,
  strategy: Strategy,
  callback?: EndpointCallback
): Function => {
  const onEndpointFoundListener = _onEndpointFound(callback?.onEndpointFound);
  const onEndpointLostListener = _onEndpointLost(callback?.onEndpointLost);

  nearbyConnectionsModule.startDiscovery(serviceId, strategy);

  return () => {
    stopDiscovery();
    onEndpointFoundListener();
    onEndpointLostListener();
  };
};

export const stopDiscovery = nearbyConnectionsModule.stopDiscovery;

export const requestConnection = async (
  endpointName: string,
  advertiserEndpointId: string,
  callback?: ConnectionCallback
): Promise<Function> => {
  const onConnectionResultListener = _onConnectionResult(
    callback?.onConnectionResult
  );
  const onDisconnectedListener = _onDisconnected(callback?.onDisconnected);
  const onConnectionInitiatedListener = _onConnectionInitiated(
    callback?.onConnectionInitiated
  );

  await nearbyConnectionsModule.requestConnection(
    endpointName,
    advertiserEndpointId
  );

  return () => {
    onConnectionResultListener();
    onDisconnectedListener();
    onConnectionInitiatedListener();
  };
};

export const acceptConnection = nearbyConnectionsModule.acceptConnection;

export const rejectConnection = nearbyConnectionsModule.rejectConnection;

export const disconnectFromEndpoint =
  nearbyConnectionsModule.disconnectFromEndpoint;

export const stopAllEndpoints = nearbyConnectionsModule.stopAllEndpoints;

export const sendPayload = nearbyConnectionsModule.sendPayload;

export const onPayloadReceived = (
  callback?: onPayloadReceivedCallback
): Function => {
  return nearbyConnectionGenericListener<PayloadReceived>(
    NearbyConnectionEvents.PAYLOAD_RECEIVED,
    (data) => {
      callback?.({
        endpointId: data.endpointId,
        payloadType: Number(data.payloadType) as PayloadType,
        payloadId: Number(data.payloadId),
        payload: data.payload,
      });
    }
  );
};

export const onPayloadTransferUpdate = (
  callback?: onPayloadTransferUpdateCallback
): Function => {
  return nearbyConnectionGenericListener<PayloadTransferUpdate>(
    NearbyConnectionEvents.PAYLOAD_TRANSFER_UPDATE,
    (data) => {
      callback?.({
        endpointId: data.endpointId,
        payloadId: Number(data.payloadId),
        status: Number(data.status) as PayloadTransferStatus,
        bytesTransferred: Number(data.bytesTransferred),
        totalBytes: Number(data.totalBytes),
      });
    }
  );
};

const _onConnectionResult = (
  callback?: onConnectionResultCallback
): Function => {
  return nearbyConnectionGenericListener<RawConnectionResult>(
    NearbyConnectionEvents.CONNECTION_RESULT,
    (data) => {
      callback?.({
        endpointId: data.endpointId,
        status: Number(data.status),
        statusMessage: data.statusMessage,
        isSuccess: Number(data.isSuccess) === 1,
      });
    }
  );
};

const _onDisconnected = (callback?: onDisconnectedCallback): Function => {
  return nearbyConnectionGenericListener<Disconnected>(
    NearbyConnectionEvents.DISCONNECTED,
    callback
  );
};

const _onConnectionInitiated = (
  callback?: onConnectionInitiatedCallback
): Function => {
  return nearbyConnectionGenericListener<RawConnectionInitiated>(
    NearbyConnectionEvents.CONNECTION_INITIATED,
    (data) => {
      callback?.({
        endpointId: data.endpointId,
        endpointName: data.endpointName,
        authenticationDigits: data.authenticationDigits,
        isIncomingConnection: Number(data.isIncomingConnection) === 1,
      });
    }
  );
};

const _onEndpointFound = (callback?: onEndpointFoundCallback): Function => {
  return nearbyConnectionGenericListener<EndpointFound>(
    NearbyConnectionEvents.ENDPOINT_FOUND,
    callback
  );
};

const _onEndpointLost = (callback?: onEndpointLostCallback): Function => {
  return nearbyConnectionGenericListener<EndpointLost>(
    NearbyConnectionEvents.ENDPOINT_LOST,
    callback
  );
};
