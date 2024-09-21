package expo.modules.nearbyconnections

import android.content.Context
import com.google.android.gms.common.ConnectionResult
import com.google.android.gms.common.GoogleApiAvailability
import com.google.android.gms.nearby.Nearby
import com.google.android.gms.nearby.connection.AdvertisingOptions
import com.google.android.gms.nearby.connection.ConnectionInfo
import com.google.android.gms.nearby.connection.ConnectionLifecycleCallback
import com.google.android.gms.nearby.connection.ConnectionResolution
import com.google.android.gms.nearby.connection.ConnectionsClient
import com.google.android.gms.nearby.connection.DiscoveredEndpointInfo
import com.google.android.gms.nearby.connection.DiscoveryOptions
import com.google.android.gms.nearby.connection.EndpointDiscoveryCallback
import com.google.android.gms.nearby.connection.Payload
import com.google.android.gms.nearby.connection.PayloadCallback
import com.google.android.gms.nearby.connection.PayloadTransferUpdate
import com.google.android.gms.nearby.connection.Strategy
import com.google.android.gms.tasks.Task

class NearbyConnectionsModule(
    private val context: Context,
    val callbacks: NearbyConnectionCallbacks
) {
    private val connectionsClient: ConnectionsClient by lazy {
        Nearby.getConnectionsClient(
            context
        )
    }
    private val initiatedConnections = mutableMapOf<String, String>()

    fun isPlayServicesAvailable(): Boolean {
        val isAvailable = GoogleApiAvailability.getInstance().isGooglePlayServicesAvailable(context)
        return isAvailable == ConnectionResult.SUCCESS
    }

    fun startAdvertise(name: String, strategy: Double?): Task<Void> {
        val serviceId = context.packageName.toString()
        val options = AdvertisingOptions.Builder()
            .setStrategy(getStrategy(strategy))
            .build()

        return connectionsClient.startAdvertising(
            name,
            serviceId,
            connectionLifecycleCallback,
            options
        )
    }

    fun stopAdvertise() {
        connectionsClient.stopAdvertising()
    }

    fun startDiscovery(strategy: Double?): Task<Void> {
        val serviceId = context.packageName.toString()
        val strategyInstance = DiscoveryOptions.Builder().setStrategy(getStrategy(strategy)).build()

        return connectionsClient.startDiscovery(
            serviceId,
            endpointDiscoveryCallback,
            strategyInstance
        )
    }

    fun stopDiscovery() {
        connectionsClient.stopDiscovery()
    }

    fun requestConnection(name: String, advertisePeerId: String): Task<Void> {
        return connectionsClient.requestConnection(
            name,
            advertisePeerId,
            connectionLifecycleCallback,
        )
    }

    fun acceptConnection(peerId: String): Task<Void> {
        return connectionsClient.acceptConnection(
            peerId,
            payloadCallback,
        )
    }

    fun rejectConnection(peerId: String): Task<Void> {
        return connectionsClient.rejectConnection(
            peerId,
        )
    }

    fun disconnect(peerId: String) {
        connectionsClient.disconnectFromEndpoint(peerId)
    }

    fun sendText(peerId: String, text: String): Task<Void> {
        return connectionsClient.sendPayload(
            peerId,
            Payload.fromBytes(text.toByteArray())
        )
    }

    private fun getStrategy(strategy: Double?): Strategy {
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

    private val connectionLifecycleCallback: ConnectionLifecycleCallback =
        object : ConnectionLifecycleCallback() {
            override fun onConnectionResult(endpointId: String, result: ConnectionResolution) {
                if (!result.status.isSuccess) {
                    // TODO: handle connection failure
                    return
                }

                val name = initiatedConnections[endpointId] ?: ""
                callbacks.onConnected(endpointId, name)
            }

            override fun onDisconnected(endpointId: String) {
                initiatedConnections.remove(endpointId)
                callbacks.onDisconnected(endpointId)
            }

            override fun onConnectionInitiated(endpointId: String, connectionInfo: ConnectionInfo) {
                initiatedConnections[endpointId] = connectionInfo.endpointName
                callbacks.onInvitationReceived(endpointId, connectionInfo.endpointName)
            }
        }

    private val endpointDiscoveryCallback: EndpointDiscoveryCallback =
        object : EndpointDiscoveryCallback() {
            override fun onEndpointFound(endpointId: String, info: DiscoveredEndpointInfo) {
                callbacks.onPeerFound(endpointId, info.endpointName)
            }

            override fun onEndpointLost(endpointId: String) {
                callbacks.onPeerLost(endpointId)
            }
        }

    private val payloadCallback: PayloadCallback = object : PayloadCallback() {
        override fun onPayloadReceived(endpointId: String, payload: Payload) {
            if (payload.type != Payload.Type.BYTES) {
                // TODO: handle other payload types
                return
            }

            val bytes = payload.asBytes()
            if (bytes === null) {
                return
            }

            callbacks.onTextReceived(endpointId, String(bytes))
        }

        override fun onPayloadTransferUpdate(
            endpointId: String, update: PayloadTransferUpdate
        ) {
            // TODO: handle payload transfer update
        }
    }
}