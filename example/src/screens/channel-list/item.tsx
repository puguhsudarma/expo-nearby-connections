import { requestConnection } from "expo-nearby-connections";
import { BasePeer } from "expo-nearby-connections/types/nearby-connections.types";
import React, { useCallback } from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { colors } from "../../constants/color";

interface Props extends BasePeer {}

export const Item: React.FC<Props> = (props) => {
  const handlePress = useCallback(() => {
    requestConnection(props.peerId);
  }, [props.peerId]);

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.8}
      style={styles.button}
    >
      <Text style={styles.text}>Channel {props.name}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: colors.white10,
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 4,
  },
  text: {
    color: colors.greenDarker,
    fontSize: 16,
    fontWeight: "bold",
  },
});
