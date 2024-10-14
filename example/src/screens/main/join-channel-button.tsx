import React, { useCallback } from "react";
import { Button } from "../../components/button";
import { useNavigation } from "../../hooks/use-navigation";

interface Props {
  name: string;
  disabled?: boolean;
}

export const JoinChannelButton: React.FC<Props> = ({ name, disabled }) => {
  const navigation = useNavigation<"main">();

  const handlePress = useCallback(() => {
    navigation.navigate("channelList", {
      name,
    });
  }, [name, navigation.navigate]);

  return (
    <Button disabled={!name || disabled} onPress={handlePress}>
      Join a channel
    </Button>
  );
};
