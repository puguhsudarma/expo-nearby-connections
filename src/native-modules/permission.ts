import { nearbyConnectionsModule } from "./nearby-connections-module";

export const isPlayServicesAvailable = async (): Promise<boolean> => {
  return nearbyConnectionsModule.isPlayServicesAvailable();
};
