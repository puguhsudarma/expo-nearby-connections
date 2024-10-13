import { sendText } from "expo-nearby-connections";
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
  const { data, setData } = usePayloadListener(targetDevice);

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
        textInputProps={{
          autoCorrect: false,
        }}
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
