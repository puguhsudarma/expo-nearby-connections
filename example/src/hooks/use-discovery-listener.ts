import { BasePeer, onPeerFound, onPeerLost } from "expo-nearby-connections";
import { useEffect, useState } from "react";

export const useDiscoveryListener = () => {
  const [discoveredPeers, setDiscoveredPeers] = useState<BasePeer[]>([]);

  useEffect(() => {
    const unsubscribePeerFoundListener = onPeerFound((data) => {
      console.log("onPeerFound: ", data);

      setDiscoveredPeers((peers) => [...peers, data]);
    });

    const unsubscribePeerLostListener = onPeerLost((data) => {
      console.log("onPeerLost: ", data);

      setDiscoveredPeers((peers) =>
        peers.filter((peer) => peer.peerId !== data.peerId)
      );
    });

    return () => {
      unsubscribePeerFoundListener();
      unsubscribePeerLostListener();
    };
  }, []);

  return { discoveredPeers, setDiscoveredPeers };
};
