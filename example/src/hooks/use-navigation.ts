import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStack } from "../providers/routes-provider";
import { useNavigation as useRNNavigation } from "@react-navigation/native";

export function useNavigation<T extends keyof RootStack>() {
  return useRNNavigation<NativeStackNavigationProp<RootStack, T>>();
}
