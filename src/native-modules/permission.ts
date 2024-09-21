import { nearbyConnectionsModule } from "./nearby-connections-module";

export const isPlayServicesAvailable = async (): Promise<Boolean> => {
  return nearbyConnectionsModule.isPlayServicesAvailable();
};
