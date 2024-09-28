import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Header } from "../../components/header";

interface Props {}

export const ChannelListScreen: React.FC<Props> = () => {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#fff",
      }}
    >
      <Header>Channel List</Header>

      <FlatList
        data={[
          1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
        ]}
        ListHeaderComponent={() => <View style={{ height: 16 }} />}
        ListFooterComponent={() => (
          <View style={{ height: insets.bottom + 16 }} />
        )}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => {}}
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
              Channel {item}
            </Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.toString()}
      />
    </View>
  );
};
