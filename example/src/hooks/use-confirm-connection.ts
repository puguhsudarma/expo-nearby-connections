import {
  BasePeer,
  acceptConnection,
  rejectConnection,
} from "expo-nearby-connections";
import { useEffect } from "react";
import { Alert } from "react-native";
import { useConnectionListener } from "./use-connection-listener";

interface Props {
  name: string,
  isLoading: boolean;
  acceptedCallback?: (targetDevice: BasePeer) => void;
}

export const useConfirmConnection = (props: Props) => {
  const { isLoading, acceptedCallback } = props;
  const { invitedPeers, setInvitedPeers } = useConnectionListener(props.name);

  useEffect(() => {
    if (!isLoading) {
      return;
    }

    const connectingPeer = invitedPeers.find(
      (peer) => peer.status === "connecting"
    );

    if (connectingPeer) {
      Alert.alert(
        "Incoming connection",
        `${connectingPeer.name} want to connect`,
        [
          {
            text: "Accept",
            onPress: () =>
              acceptConnection(connectingPeer.peerId).then(() => {
                acceptedCallback?.(connectingPeer);
              }),
          },
          {
            text: "Reject",
            onPress: () =>
              rejectConnection(connectingPeer.peerId).then(() => {
                setInvitedPeers((peers) =>
                  peers.filter((peer) => peer.peerId !== connectingPeer.peerId)
                );
              }),
            style: "cancel",
          },
        ]
      );
    }
  }, [invitedPeers, acceptedCallback, setInvitedPeers, isLoading]);
};
