package expo.modules.nearbyconnections

import android.content.Context
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
import com.google.android.gms.tasks.Task

class NearbyConnectionsModule(
    private val context: Context,
    private val callbacks: NearbyConnectionCallbacks
) : NearbyConnectionModule {
    private val connectionsClient: ConnectionsClient by lazy {
        Nearby.getConnectionsClient(
            context
        )
    }
    private var myPeerName: String = ""
    private var isAdvertising = false
    private var isDiscovering = false
    private val initiatedPeers: MutableMap<String, String> = mutableMapOf()

    override fun startAdvertise(name: String, strategy: Double?): Task<String> {
        this.myPeerName = name
        val serviceId = context.packageName.toString()
        val options = AdvertisingOptions.Builder()
            .setStrategy(getStrategy(strategy))
            .build()

        val nearbyConnectionTask = connectionsClient.startAdvertising(
            name,
            serviceId,
            advertiseCallback,
            options
        )

        return nearbyConnectionTask.continueWith { task ->
            if (task.isSuccessful) {
                this.isAdvertising = true
                name
            } else {
                throw task.exception ?: Exception("Failed to start advertising")
            }
        }
    }

    override fun stopAdvertise() {
        connectionsClient.stopAdvertising()
        this.isAdvertising = false
    }

    override fun startDiscovery(name: String, strategy: Double?): Task<String> {
        this.myPeerName = name
        val serviceId = context.packageName.toString()
        val strategyInstance = DiscoveryOptions.Builder()
            .setStrategy(getStrategy(strategy))
            .build()

        val nearbyConnectionTask = connectionsClient.startDiscovery(
            serviceId,
            discoveryCallback,
            strategyInstance
        )

        return nearbyConnectionTask.continueWith { task ->
            if (task.isSuccessful) {
                this.isDiscovering = true
                name
            } else {
                throw task.exception ?: Exception("Failed to start discovery")
            }
        }
    }

    override fun stopDiscovery() {
        connectionsClient.stopDiscovery()
        this.isDiscovering = false
    }

    override fun requestConnection(advertisePeerId: String): Task<Void> {
        return connectionsClient.requestConnection(
            this.myPeerName,
            advertisePeerId,
            requestConnectionCallback,
        )
    }

    override fun acceptConnection(targetPeerId: String): Task<Void> {
        return connectionsClient.acceptConnection(
            targetPeerId,
            payloadCallback,
        )
    }

    override fun rejectConnection(targetPeerId: String): Task<Void> {
        return connectionsClient.rejectConnection(
            targetPeerId,
        )
    }

    override fun disconnect(targetPeerId: String) {
        connectionsClient.disconnectFromEndpoint(targetPeerId)
    }

    override fun sendText(targetPeerId: String, text: String): Task<Void> {
        return connectionsClient.sendPayload(
            targetPeerId,
            Payload.fromBytes(text.toByteArray())
        )
    }

    private val advertiseCallback: ConnectionLifecycleCallback =
        object : ConnectionLifecycleCallback() {
            override fun onConnectionResult(peerId: String, result: ConnectionResolution) {
                if (!result.status.isSuccess) {
                    // TODO: handle connection failure
                    println("Connection failed: ${result.status}")
                    return
                }

                val targetPeerName = initiatedPeers.firstNotNullOf {
                    if (it.key == peerId) {
                        it.value
                    } else {
                        ""
                    }
                }

                callbacks.onConnected(peerId, targetPeerName)
            }

            override fun onDisconnected(peerId: String) {
                callbacks.onDisconnected(peerId)
            }

            override fun onConnectionInitiated(peerId: String, connectionInfo: ConnectionInfo) {
                val peerName = connectionInfo.endpointName
                initiatedPeers[peerId] = peerName
                callbacks.onInvitationReceived(peerId, peerName)
            }
        }

    private val requestConnectionCallback: ConnectionLifecycleCallback =
        object : ConnectionLifecycleCallback() {
            override fun onConnectionResult(peerId: String, result: ConnectionResolution) {
                if (!result.status.isSuccess) {
                    // TODO: handle connection failure
                    println("Connection failed: ${result.status}")
                    return
                }

                val targetPeerName = initiatedPeers.firstNotNullOf {
                    if (it.key == peerId) {
                        it.value
                    } else {
                        ""
                    }
                }

                callbacks.onConnected(peerId, targetPeerName)
            }

            override fun onDisconnected(peerId: String) {
                callbacks.onDisconnected(peerId)
            }

            override fun onConnectionInitiated(peerId: String, connectionInfo: ConnectionInfo) {
                val peerName = connectionInfo.endpointName
                initiatedPeers[peerId] = peerName
                acceptConnection(peerId)
            }
        }

    private val discoveryCallback: EndpointDiscoveryCallback =
        object : EndpointDiscoveryCallback() {
            override fun onEndpointFound(peerId: String, info: DiscoveredEndpointInfo) {
                callbacks.onPeerFound(peerId, info.endpointName)
            }

            override fun onEndpointLost(peerId: String) {
                callbacks.onPeerLost(peerId)
            }
        }

    private val payloadCallback: PayloadCallback = object : PayloadCallback() {
        override fun onPayloadReceived(peerId: String, payload: Payload) {
            if (payload.type != Payload.Type.BYTES) {
                // TODO: handle other payload types
                return
            }

            val bytes = payload.asBytes()
            if (bytes === null) {
                return
            }

            callbacks.onTextReceived(peerId, String(bytes))
        }

        override fun onPayloadTransferUpdate(
            peerId: String, update: PayloadTransferUpdate
        ) {
            // TODO: handle payload transfer update
        }
    }
}