import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { ChannelListScreen } from "../screens/channel-list/channel-list-screen";
import { ChatScreen } from "../screens/chat/chat-screen";
import { MainScreen } from "../screens/main/main-screen";
import { BasePeer } from "expo-nearby-connections";

export type RootStack = {
  main: undefined;
  channelList: { name: string };
  chat: { myDevice: BasePeer, targetDevice: BasePeer };
};

const Stack = createNativeStackNavigator<RootStack>();

export const RoutesProvider: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="main"
        screenOptions={{
          headerShown: false,
          gestureEnabled: false,
        }}
      >
        <Stack.Screen name="main" component={MainScreen} />
        <Stack.Screen name="channelList" component={ChannelListScreen} />
        <Stack.Screen name="chat" component={ChatScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
