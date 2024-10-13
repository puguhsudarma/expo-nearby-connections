import { BasePeer, onTextReceived } from "expo-nearby-connections";
import { useEffect, useState } from "react";
import { GiftedChat, IMessage } from "react-native-gifted-chat";

export function usePayloadListener(targetDevice: BasePeer) {
  const [data, setData] = useState<IMessage[]>([]);

  useEffect(() => {
    const unsubscribe = onTextReceived((data) => {
      console.log("onTextReceived: ", data);

      const newMessage = {
        _id: Date.now(),
        createdAt: new Date(),
        text: data.text,
        user: {
          _id: data.peerId,
          name: targetDevice.name,
        },
        received: true,
      } as IMessage;

      setData((previousMessages) =>
        GiftedChat.append(previousMessages, [newMessage])
      );
    });

    return () => {
      unsubscribe();
    };
  }, [targetDevice.name]);

  return { data, setData };
}
