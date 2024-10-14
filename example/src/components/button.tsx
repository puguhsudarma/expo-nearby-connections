import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import { colors } from "../constants/color";

interface Props {
  children: React.ReactNode;
  onPress?(): void;
  disabled?: boolean;
  isLoading?: boolean;
}

export const Button: React.FC<Props> = (props) => {
  const content = React.useMemo(() => {
    if (props.isLoading) {
      return <ActivityIndicator color={colors.white} />;
    }

    if (typeof props.children === "string") {
      return (
        <Text
          style={{
            color: colors.white,
            fontSize: 16,
            fontWeight: "bold",
          }}
        >
          {props.children}
        </Text>
      );
    }

    return props.children;
  }, [props.children, props.isLoading]);

  return (
    <TouchableOpacity
      disabled={props.disabled || props.isLoading}
      onPress={props.onPress}
      activeOpacity={0.8}
      style={[
        styles.button,
        { backgroundColor: props.disabled ? colors.gray : colors.primary },
      ]}
    >
      {content}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderRadius: 4,
    marginHorizontal: 16,
    alignItems: "center",
  },
});
