import React from "react";
import { NearbyConnectionContext } from "../providers/nearby-connection-provider";

export const useNearbyConnection = () => {
  const context = React.useContext(NearbyConnectionContext);

  if (!context) {
    throw new Error(
      "useNearbyConnection must be used within a NearbyConnectionProvider"
    );
  }

  return context;
};
