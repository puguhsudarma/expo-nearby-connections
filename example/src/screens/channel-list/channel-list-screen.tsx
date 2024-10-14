import { startDiscovery, stopDiscovery } from "expo-nearby-connections";
import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Header } from "../../components/header";
import { colors } from "../../constants/color";
import { useConnectionListener } from "../../hooks/use-connection-listener";
import { useDiscoveryListener } from "../../hooks/use-discovery-listener";
import { useNavigation } from "../../hooks/use-navigation";
import { useParam } from "../../hooks/use-param";
import { Item } from "./item";

interface Props {}

export const ChannelListScreen: React.FC<Props> = () => {
  const navigation = useNavigation<"channelList">();
  const [myPeerId, setMyPeerId] = useState("");
  const param = useParam<"channelList">();
  const name = param.params.name;
  const { bottom } = useSafeAreaInsets();
  const { discoveredPeers } = useDiscoveryListener();
  const { invitedPeers } = useConnectionListener(name);

  useEffect(() => {
    const connectedPeers = invitedPeers.find(
      (peer) => peer.status === "connected"
    );

    if (connectedPeers) {
      navigation.navigate("chat", {
        myDevice: {
          peerId: myPeerId,
          name,
        },
        targetDevice: connectedPeers,
      });
    }
  }, [invitedPeers, myPeerId, name, navigation]);

  useEffect(() => {
    startDiscovery(name).then((peerId) => {
      setMyPeerId(peerId);
    });

    return () => {
      stopDiscovery();
    };
  }, [name]);

  return (
    <View style={styles.container}>
      <Header>Channel List</Header>

      <FlatList
        data={discoveredPeers}
        keyExtractor={(item) => `${item.peerId}_${item.name}`}
        ListHeaderComponent={() => <View style={{ height: 16 }} />}
        ListFooterComponent={() => <View style={{ height: bottom + 16 }} />}
        renderItem={({ item }) => <Item {...item} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
});
