import { disconnect, sendText } from "expo-nearby-connections";
import React, { useCallback, useEffect } from "react";
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

  useEffect(() => {
    return () => {
      disconnect(targetDevice.peerId)
        .then(() => {
          console.log("Disconnected from: ", targetDevice.peerId);
        })
        .catch((error) => {
          console.error("Error disconnecting: ", error);
        });
    };
  }, [targetDevice.peerId]);

  const handleSendText = useCallback(
    (messages: IMessage[]) => {
      sendText(targetDevice.peerId, messages[0].text)
        .then(() => {
          setData((previousMessages) =>
            GiftedChat.append(previousMessages, messages)
          );

          console.log("Sent: ", messages[0].text);
        })
        .catch((error) => {
          console.error("Error sending: ", error);
        });
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
