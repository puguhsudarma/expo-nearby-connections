import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { GiftedChat, IMessage } from "react-native-gifted-chat";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Header } from "../../components/header";

interface Props {}

export const ChatScreen: React.FC<Props> = () => {
  const insets = useSafeAreaInsets();
  const [messages, setMessages] = useState<IMessage[]>([]);

  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: "Hello developer",
        createdAt: new Date(),
        user: {
          _id: 2,
          name: "React Native",
        },
      },
    ]);
  }, []);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#fff",
        paddingBottom: insets.bottom,
      }}
    >
      <Header>Chat</Header>
      <GiftedChat
        alwaysShowSend
        messages={messages}
        onSend={(messages) => {}}
        user={{
          _id: 1,
        }}
      />
    </View>
  );
};
