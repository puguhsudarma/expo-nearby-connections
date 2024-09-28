import React from "react";
import { Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../../components/button";

interface Props {}

export const MainScreen: React.FC<Props> = () => {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#fff",
        gap: 16,
      }}
    >
      <SafeAreaView />
      <Text
        style={{
          color: "#465775",
          fontSize: 24,
          fontWeight: "bold",
          textAlign: "center",
          marginVertical: 32,
        }}
      >
        P2P Nearby Chatting
      </Text>
      <TextInput
        style={{
          borderColor: "#5b6c5d",
          borderWidth: 1,
          padding: 0,
          margin: 0,
          paddingVertical: 16,
          paddingHorizontal: 8,
          borderRadius: 4,
          marginHorizontal: 16,
          fontSize: 16,
        }}
        underlineColorAndroid="transparent"
        placeholder="Your name"
      />

      <Button onPress={() => {}}>Create channel</Button>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          marginVertical: 32,
        }}
      >
        <View
          style={{
            backgroundColor: "#5b6c5d",
            padding: 0,
            margin: 0,
            height: 2,
            width: "30%",
          }}
        />
        <Text
          style={{
            color: "#5b6c5d",
            fontSize: 16,
            marginHorizontal: 8,
            fontWeight: "bold",
          }}
        >
          OR
        </Text>
        <View
          style={{
            backgroundColor: "#5b6c5d",
            padding: 0,
            margin: 0,
            height: 2,
            width: "30%",
          }}
        />
      </View>

      <Button onPress={() => {}}>Join a channel</Button>
    </View>
  );
};
