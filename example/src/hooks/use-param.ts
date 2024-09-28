import { RouteProp, useRoute } from "@react-navigation/native";
import { RootStack } from "../providers/routes-provider";

export function useParam<T extends keyof RootStack>() {
  return useRoute<RouteProp<RootStack, T>>();
}
