import React from "react";
import { Text, TouchableOpacity } from "react-native";

interface Props {
  children: React.ReactNode;
  onPress?(): void;
  disabled?: boolean;
}

export const Button: React.FC<Props> = ({ children, onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={{
        backgroundColor: "#59c9a5",
        paddingVertical: 16,
        paddingHorizontal: 8,
        borderRadius: 4,
        marginHorizontal: 16,
        alignItems: "center",
      }}
    >
      {typeof children === "string" ? (
        <Text
          style={{
            color: "#fff",
            fontSize: 16,
            fontWeight: "bold",
          }}
        >
          {children}
        </Text>
      ) : (
        children
      )}
    </TouchableOpacity>
  );
};
