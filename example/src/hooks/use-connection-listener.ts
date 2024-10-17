import {
  BasePeer,
  onConnected,
  onDisconnected,
  onInvitationReceived,
} from "expo-nearby-connections";
import { useEffect, useState } from "react";

type PeerConnectionStatus = "connecting" | "connected" | "disconnected";

interface ConnectedPeerWithStatus extends BasePeer {
  status: PeerConnectionStatus;
}

export const useConnectionListener = (name?: string) => {
  const [invitedPeers, setInvitedPeers] = useState<ConnectedPeerWithStatus[]>(
    []
  );

  useEffect(() => {
    const unsubscribeInvitationListener = onInvitationReceived((data) => {
      console.log(`onInvitationReceived ${name}: `, data);

      setInvitedPeers((peers) => [...peers, { ...data, status: "connecting" }]);
    });

    const unsubscribeConnectedListener = onConnected((data) => {
      console.log(`onConnected ${name}: `, data);

      setInvitedPeers((peers) => {
        if (peers.some((peer) => peer.peerId === data.peerId)) {
          return peers.map((peer) => {
            if (peer.peerId === data.peerId) {
              return { ...peer, status: "connected" };
            }

            return peer;
          });
        }

        return [...peers, { ...data, status: "connected" }];
      });
    });

    const unsubscribeDisconnectedListener = onDisconnected((data) => {
      console.log(`onDisconnected ${name}: `, data);

      setInvitedPeers((peers) =>
        peers.filter((peer) => peer.peerId !== data.peerId)
      );
    });

    return () => {
      unsubscribeInvitationListener();
      unsubscribeConnectedListener();
      unsubscribeDisconnectedListener();
    };
  }, [name]);

  return { invitedPeers, setInvitedPeers };
};
