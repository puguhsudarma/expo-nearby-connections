package expo.modules.nearbyconnections

import com.margelo.nitro.expo.modules.nearbyconnections.Strategy as NitroStrategy
import com.google.android.gms.nearby.connection.Strategy as GmsStrategy

fun getStrategy(strategy: NitroStrategy?): GmsStrategy {
    return when (strategy) {
        NitroStrategy.P2P_CLUSTER -> GmsStrategy.P2P_CLUSTER
        NitroStrategy.P2P_STAR -> GmsStrategy.P2P_STAR
        NitroStrategy.P2P_POINT_TO_POINT -> GmsStrategy.P2P_POINT_TO_POINT
        null -> GmsStrategy.P2P_STAR
    }
}
