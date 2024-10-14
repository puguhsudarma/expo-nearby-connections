import { startAdvertise } from "expo-nearby-connections";
import React, { useCallback, useState } from "react";
import { StyleSheet, Text, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../../components/button";
import { colors } from "../../constants/color";
import { useConfirmConnection } from "../../hooks/use-confirm-connection";
import { useNavigation } from "../../hooks/use-navigation";
import { useNearbyPermission } from "../../hooks/use-permission";
import { JoinChannelButton } from "./join-channel-button";
import { PlayServicesButton } from "./playservices-button";
import { Separator } from "./separator";

interface Props {}

export const MainScreen: React.FC<Props> = () => {
  const [myPeerId, setMyPeerId] = useState("");
  const [name, setName] = useState<string>("");
  const navigation = useNavigation<"main">();
  const { isGranted } = useNearbyPermission();
  const [isLoading, setIsLoading] = useState(false);

  useConfirmConnection({
    name,
    isLoading,
    acceptedCallback: (targetDevice) => {
      navigation.navigate("chat", {
        myDevice: {
          peerId: myPeerId,
          name,
        },
        targetDevice,
      });

      setIsLoading(false);
    },
  });

  const handleCreateChannel = useCallback(() => {
    startAdvertise(name).then((peerId) => {
      setMyPeerId(peerId);
      setIsLoading(true);
    });
  }, [name]);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Text style={styles.title}>P2P Nearby Chatting</Text>

      <TextInput
        style={styles.input}
        autoCorrect={false}
        underlineColorAndroid="transparent"
        placeholder="Your name"
        value={name}
        onChangeText={setName}
      />

      <Button
        disabled={!name || !isGranted}
        isLoading={isLoading}
        onPress={handleCreateChannel}
      >
        Create channel
      </Button>

      <Separator />

      <JoinChannelButton name={name} disabled={!isGranted} />

      <PlayServicesButton />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    gap: 16,
    paddingTop: 64,
  },
  title: {
    color: colors.greenDarker,
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 32,
  },
  input: {
    borderColor: colors.greenDarker,
    borderWidth: 1,
    padding: 0,
    margin: 0,
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderRadius: 4,
    marginHorizontal: 16,
    fontSize: 16,
  },
});
