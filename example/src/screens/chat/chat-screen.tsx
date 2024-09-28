import { onTextReceived } from "expo-nearby-connections/native-modules/connection";
import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { GiftedChat, IMessage } from "react-native-gifted-chat";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Header } from "../../components/header";
import { useNearbyConnection } from "../../hooks/use-nearby-connection";

interface Props {}

export const ChatScreen: React.FC<Props> = () => {
  const insets = useSafeAreaInsets();
  const [messages, setMessages] = useState<IMessage[]>([]);
  const { sendText, connectedPeers } = useNearbyConnection();

  const DestinationPeerId = connectedPeers[0]?.peerId;
  const OpositePeerName = connectedPeers[0]?.name;

  const onSend = (messages: IMessage[]) => {
    sendText(DestinationPeerId, messages[0].text);
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages)
    );
  };

  useEffect(() => {
    const onTextReceivedListener = onTextReceived((data) => {
      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, [
          {
            _id: previousMessages.length + 1,
            text: data.text,
            createdAt: new Date(),
            user: {
              _id: 2,
              name: OpositePeerName,
            },
          },
        ])
      );
    });

    return () => {
      onTextReceivedListener();
    };
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
        onSend={onSend}
        user={{
          _id: 1,
        }}
      />
    </View>
  );
};
