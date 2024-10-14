import React from "react";
import { Alert, Platform } from "react-native";
import { isPlayServicesAvailable } from "../../../../src/index";
import { Button } from "../../components/button";

export const PlayServicesButton: React.FC = () => {
  const handlePress = () => {
    isPlayServicesAvailable().then((isAvailable) => {
      let message = "";

      if (isAvailable) {
        message = "Play Services is available";
      } else {
        message = "Play Services is not available";
      }

      if (Platform.OS === "ios") {
        message = "Play Services is mocked available (always true)";
      }

      Alert.alert("Play Services", message);
    });
  };

  return (
    <Button onPress={handlePress}>Check Play Services Availability</Button>
  );
};
