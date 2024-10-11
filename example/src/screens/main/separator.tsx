import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "../../constants/color";

export const Separator: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.line} />
      <Text style={styles.text}>OR</Text>
      <View style={styles.line} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 32,
  },
  line: {
    backgroundColor: colors.greenDarker,
    padding: 0,
    margin: 0,
    height: 2,
    width: "30%",
  },
  text: {
    color: colors.greenDarker,
    fontSize: 16,
    marginHorizontal: 8,
    fontWeight: "bold",
  },
});
