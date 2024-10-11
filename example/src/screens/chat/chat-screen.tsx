import { TextReceived, sendText } from "expo-nearby-connections";
import React, { useCallback } from "react";
import { StyleSheet, View } from "react-native";
import { GiftedChat, IMessage } from "react-native-gifted-chat";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Header } from "../../components/header";
import { colors } from "../../constants/color";
import { useParam } from "../../hooks/use-param";
import { usePayloadListener } from "../../hooks/use-payload-listener";

interface Props {}

export const ChatScreen: React.FC<Props> = () => {
  const param = useParam<"chat">();
  const myDevice = param.params.myDevice;
  const targetDevice = param.params.targetDevice;
  const insets = useSafeAreaInsets();

  const handleTransformer = useCallback(
    (data: TextReceived): IMessage => {
      return {
        _id: Date.now(),
        createdAt: new Date(),
        text: data.text,
        user: {
          _id: data.peerId,
          name: targetDevice.name,
        },
        received: true,
      } as IMessage;
    },
    [targetDevice.name]
  );

  const { data, setData } = usePayloadListener<IMessage>(handleTransformer);

  const handleSendText = useCallback(
    (messages: IMessage[]) => {
      sendText(targetDevice.peerId, messages[0].text);
      setData((previousMessages) =>
        GiftedChat.append(previousMessages, messages)
      );
    },
    [setData, targetDevice.peerId]
  );

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <Header>Chat</Header>

      <GiftedChat
        alwaysShowSend={true}
        messages={data}
        onSend={handleSendText}
        user={{ _id: myDevice.peerId, name: myDevice.name }}
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
