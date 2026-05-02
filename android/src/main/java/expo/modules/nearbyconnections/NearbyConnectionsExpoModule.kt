package expo.modules.nearbyconnections

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import com.margelo.nitro.expo.modules.nearbyconnections.NearbyConnectionsOnLoad

class NearbyConnectionsExpoModule : Module() {
    override fun definition() = ModuleDefinition {
        Name("ExpoNearbyConnections")
    }

    companion object {
        init {
            NearbyConnectionsOnLoad.initializeNative()
        }
    }
}
