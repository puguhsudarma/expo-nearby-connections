package expo.modules.nearbyconnections

import com.google.android.gms.nearby.connection.Strategy

fun getStrategy(strategy: Double?): Strategy {
    if (strategy == null) {
        return Strategy.P2P_STAR
    }

    return when (strategy.toInt()) {
        1 -> Strategy.P2P_CLUSTER
        2 -> Strategy.P2P_STAR
        3 -> Strategy.P2P_POINT_TO_POINT
        else -> throw IllegalArgumentException("Invalid strategy")
    }
}