import { BasePeer, onPeerFound, onPeerLost } from "expo-nearby-connections";
import { useEffect, useState } from "react";
import { useParam } from "./use-param";

export const useDiscoveryListener = () => {
  const param = useParam<"channelList">();
  const name = param.params.name;
  const [discoveredPeers, setDiscoveredPeers] = useState<BasePeer[]>([]);

  useEffect(() => {
    const unsubscribePeerFoundListener = onPeerFound((data) => {
      console.log(`channel ${name} onPeerFound:`, data);

      setDiscoveredPeers((peers) => [...peers, data]);
    });

    const unsubscribePeerLostListener = onPeerLost((data) => {
      console.log(`channel ${name} onPeerLost:`, data);

      setDiscoveredPeers((peers) =>
        peers.filter((peer) => peer.peerId !== data.peerId)
      );
    });

    return () => {
      unsubscribePeerFoundListener();
      unsubscribePeerLostListener();
    };
  }, [name]);

  return { discoveredPeers, setDiscoveredPeers };
};
