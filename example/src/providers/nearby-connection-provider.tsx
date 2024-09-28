import React, { useCallback, useEffect, useState } from "react";
import {
  onConnected,
  onDisconnected,
  onInvitationReceived,
  startAdvertise,
  stopAdvertise,
} from "../../../src/native-modules/advertise";
import {
  acceptConnection,
  disconnect,
  requestConnection,
  sendText,
} from "../../../src/native-modules/connection";
import {
  onPeerFound,
  onPeerLost,
  startDiscovery,
  stopDiscovery,
} from "../../../src/native-modules/discovery";
import {
  InvitationReceived,
  PeerFound,
  Strategy,
} from "../../../src/types/nearby-connections.types";
import { useNearbyPermission } from "../hooks/use-permission";

type ActorType = "advertised" | "discovered";

interface ContextType {
  requestPermissionHandler: () => Promise<boolean>;
  isGranted: boolean;
  startAdvertise: (name: string, strategy?: Strategy) => Promise<string>;
  stopAdvertise: () => Promise<void>;
  startDiscovery: (name: string, strategy?: Strategy) => Promise<string>;
  stopDiscovery: () => Promise<void>;
  requestConnection: (
    name: string,
    peerId: string,
    timeoutInSeconds?: number
  ) => Promise<void>;
  acceptConnection: (peerId: string) => Promise<void>;
  rejectConnection: (peerId: string) => Promise<void>;
  disconnect: (peerId?: string) => Promise<void>;
  sendText: (peerId: string, text: string) => Promise<void>;
  devicePeerId?: string;
  discoveredPeers: PeerFound[];
  connectedPeers: ConnectedPeerWithStatus[];
  isConnected: boolean;
  isDisconnected: boolean;
}

export const NearbyConnectionContext = React.createContext({} as ContextType);

interface Props {
  children: React.ReactNode;
}

interface ConnectedPeerWithStatus extends InvitationReceived {
  isConnected: boolean;
}

export const NearbyConnectionProvider: React.FC<Props> = ({ children }) => {
  const { isGranted, requestPermissionHandler } = useNearbyPermission(true);
  const [actorType, setActorType] = useState<ActorType>();
  const isAdvertised = actorType === "advertised";
  const isDiscovered = actorType === "discovered";
  const [devicePeerId, setDevicePeerId] = useState<string>();
  const [discoveredPeers, setDiscoveredPeers] = useState<PeerFound[]>([]);
  const [connectedPeers, setConnectedPeers] = useState<
    ConnectedPeerWithStatus[]
  >([]);
  const isConnected = connectedPeers.length > 0;
  const isDisconnected = connectedPeers.length === 0;

  // listener for advertise and request connection events
  useEffect(() => {
    if (!isGranted) {
      return;
    }

    if (typeof actorType === "undefined") {
      return;
    }

    const onInvitationReceivedListener = onInvitationReceived((data) => {
      setConnectedPeers((peers) => [...peers, { ...data, isConnected: false }]);
    });

    const onConnectedListener = onConnected((data) => {
      setConnectedPeers((peers) =>
        peers.map((peer) =>
          peer.peerId === data.peerId ? { ...peer, isConnected: true } : peer
        )
      );
    });

    const onDisconnectedListener = onDisconnected((data) => {
      setConnectedPeers((peers) =>
        peers.filter((peer) => peer.peerId !== data.peerId)
      );
    });

    return () => {
      onInvitationReceivedListener();
      onConnectedListener();
      onDisconnectedListener();
    };
  }, [isGranted, actorType]);

  useEffect(() => {
    if (!isGranted) {
      return;
    }

    if (typeof actorType === "undefined") {
      return;
    }

    const onPeerFoundListener = onPeerFound((data) => {
      setDiscoveredPeers((peers) => [...peers, data]);
    });

    const onPeerLostListener = onPeerLost((data) => {
      setDiscoveredPeers((peers) =>
        peers.filter((peer) => peer.peerId !== data.peerId)
      );
    });

    return () => {
      onPeerFoundListener();
      onPeerLostListener();
    };
  }, [isGranted, actorType]);

  const _startAdvertise = useCallback(
    async (name: string, strategy?: Strategy): Promise<string> => {
      if (isAdvertised && devicePeerId) {
        return devicePeerId;
      }

      const [error, result] = await safeAwait(startAdvertise(name, strategy));

      if (error) {
        throw error;
      }

      setDevicePeerId(result);
      setActorType("advertised");

      return result;
    },
    [isAdvertised]
  );

  const _stopAdvertise = useCallback(async (): Promise<void> => {
    if (!isAdvertised) {
      return;
    }

    const [error, result] = await safeAwait(stopAdvertise());

    if (error) {
      throw error;
    }

    setDevicePeerId(undefined);
    setActorType(undefined);
  }, [isAdvertised]);

  const _startDiscovery = useCallback(
    async (name: string, strategy?: Strategy): Promise<string> => {
      if (isDiscovered && devicePeerId) {
        return devicePeerId;
      }

      const [error, result] = await safeAwait(startDiscovery(name, strategy));

      if (error) {
        throw error;
      }

      setDevicePeerId(result);
      setActorType("discovered");

      return result;
    },
    [isDiscovered]
  );

  const _stopDiscovery = useCallback(async (): Promise<void> => {
    if (!isDiscovered) {
      return;
    }

    const [error, result] = await safeAwait(stopDiscovery());

    if (error) {
      throw error;
    }

    setDevicePeerId(undefined);
    setActorType(undefined);
  }, [isDiscovered]);

  const _requestConnection = useCallback(
    async (
      name: string,
      advertisePeerId: string,
      timeoutInSeconds?: number
    ): Promise<void> => {
      if (isConnected) {
        return;
      }

      const [error, result] = await safeAwait(
        requestConnection(name, advertisePeerId, timeoutInSeconds)
      );

      if (error) {
        throw error;
      }
    },
    [isConnected]
  );

  const _acceptConneciton = useCallback(
    async (peerId: string): Promise<void> => {
      if (!isConnected) {
        return;
      }

      const [error, result] = await safeAwait(acceptConnection(peerId));

      if (error) {
        throw error;
      }

      setConnectedPeers((peers) =>
        peers.map((peer) =>
          peer.peerId === peerId ? { ...peer, isConnected: true } : peer
        )
      );
    },
    [isConnected]
  );

  const _rejectConnection = useCallback(
    async (peerId: string): Promise<void> => {
      if (!isConnected) {
        return;
      }

      const [error, result] = await safeAwait(disconnect(peerId));

      if (error) {
        throw error;
      }

      setConnectedPeers((peers) =>
        peers.map((peer) =>
          peer.peerId === peerId ? { ...peer, isConnected: false } : peer
        )
      );

      setActorType(undefined);
      setDevicePeerId(undefined);
    },
    [isConnected]
  );

  const _disconnect = useCallback(async (): Promise<void> => {
    if (!isConnected) {
      return;
    }

    await safeAwait(disconnect(devicePeerId));

    setConnectedPeers([]);
    setActorType(undefined);
    setDevicePeerId(undefined);
  }, [isConnected]);

  const _sendText = useCallback(
    async (peerId: string, text: string): Promise<void> => {
      sendText(peerId, text);
    },
    []
  );

  const contextValue: ContextType = {
    requestPermissionHandler,
    isGranted,
    startAdvertise: _startAdvertise,
    stopAdvertise: _stopAdvertise,
    startDiscovery: _startDiscovery,
    stopDiscovery: _stopDiscovery,
    requestConnection: _requestConnection,
    acceptConnection: _acceptConneciton,
    rejectConnection: _rejectConnection,
    disconnect: _disconnect,
    sendText: _sendText,
    devicePeerId,
    discoveredPeers,
    connectedPeers,
    isConnected,
    isDisconnected,
  };

  return (
    <NearbyConnectionContext.Provider value={contextValue}>
      {children}
    </NearbyConnectionContext.Provider>
  );
};
