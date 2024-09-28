import { SafeAreaProvider } from "react-native-safe-area-context";
import { RoutesProvider } from "./src/providers/routes-provider";
import { NearbyConnectionProvider } from "./src/providers/nearby-connection-provider";

export default function App() {
  return (
    <SafeAreaProvider>
      <NearbyConnectionProvider>
        <RoutesProvider />
      </NearbyConnectionProvider>
    </SafeAreaProvider>
  );
}
