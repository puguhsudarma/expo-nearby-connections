import { SafeAreaProvider } from "react-native-safe-area-context";
import { RoutesProvider } from "./src/providers/routes-provider";

export default function App() {
  return (
    <SafeAreaProvider>
      <RoutesProvider />
    </SafeAreaProvider>
  );
}
