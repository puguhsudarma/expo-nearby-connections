import { PeerFound } from "expo-nearby-connections/types/nearby-connections.types";
import React, { useEffect } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Header } from "../../components/header";
import { useNavigation } from "../../hooks/use-navigation";
import { useNearbyConnection } from "../../hooks/use-nearby-connection";
import { useParam } from "../../hooks/use-param";

interface Props {}

export const ChannelListScreen: React.FC<Props> = () => {
  const { stopDiscovery, requestConnection, discoveredPeers } =
    useNearbyConnection();
  const navigation = useNavigation<"channelList">();
  const param = useParam<"channelList">();
  const name = param.params.name;
  const insets = useSafeAreaInsets();

  useEffect(() => {
    return () => {
      stopDiscovery();
    };
  }, []);

  const handleItemPress = (peer: PeerFound) => {
    requestConnection(name, peer.peerId).then(() => {
      navigation.navigate("chat", {
        name,
      });
    });
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#fff",
      }}
    >
      <Header>Channel List</Header>

      <FlatList
        data={discoveredPeers}
        ListHeaderComponent={() => <View style={{ height: 16 }} />}
        ListFooterComponent={() => (
          <View style={{ height: insets.bottom + 16 }} />
        )}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handleItemPress(item)}
            activeOpacity={0.8}
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 16,
              paddingVertical: 16,
              backgroundColor: "#f5f5f5",
              marginHorizontal: 16,
              marginBottom: 8,
              borderRadius: 4,
            }}
          >
            <Text
              style={{
                color: "#465775",
                fontSize: 16,
                fontWeight: "bold",
              }}
            >
              Channel {item.name}
            </Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.peerId}
      />
    </View>
  );
};
