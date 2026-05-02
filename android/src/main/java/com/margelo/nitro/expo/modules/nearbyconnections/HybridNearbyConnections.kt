package com.margelo.nitro.expo.modules.nearbyconnections

import android.content.Context
import android.util.Log
import androidx.annotation.Keep
import com.facebook.proguard.annotations.DoNotStrip
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
import com.margelo.nitro.NitroModules
import com.margelo.nitro.core.Promise
import expo.modules.nearbyconnections.getStrategy
import java.util.concurrent.ConcurrentHashMap

@DoNotStrip
@Keep
class HybridNearbyConnections : HybridNearbyConnectionsSpec() {

    // region Event callbacks

    override var onPeerFound: ((peerId: String, name: String) -> Unit)? = null
    override var onPeerLost: ((peerId: String) -> Unit)? = null
    override var onInvitationReceived: ((peerId: String, name: String) -> Unit)? = null
    override var onConnected: ((peerId: String, name: String) -> Unit)? = null
    override var onDisconnected: ((peerId: String) -> Unit)? = null
    override var onTextReceived: ((peerId: String, text: String) -> Unit)? = null

    // endregion

    // region State

    private var myPeerName: String = ""

    // ConcurrentHashMap — accessed from both JS thread and Nearby callback threads
    private val initiatedPeers: MutableMap<String, String> = ConcurrentHashMap()

    // endregion

    // region Nearby Connections client

    // Requires NitroModules.applicationContext to be initialized (set during React Native startup)
    private val connectionsClient: ConnectionsClient by lazy {
        Nearby.getConnectionsClient(context)
    }

    private val context: Context
        get() = requireNotNull(NitroModules.applicationContext) {
            "React Application Context is null"
        }

    // endregion

    // region Methods

    override fun isPlayServicesAvailable(): Promise<Boolean> {
        val result = GoogleApiAvailability.getInstance().isGooglePlayServicesAvailable(context)
        return Promise.resolved(result == ConnectionResult.SUCCESS)
    }

    override fun startAdvertise(name: String, strategy: Strategy?): Promise<String> {
        myPeerName = name
        val serviceId = context.packageName
        val options = AdvertisingOptions.Builder()
            .setStrategy(getStrategy(strategy))
            .build()

        val promise = Promise<String>()
        connectionsClient.startAdvertising(name, serviceId, advertiseCallback, options)
            .addOnSuccessListener { promise.resolve(name) }
            .addOnFailureListener { promise.reject(it) }
        return promise
    }

    override fun stopAdvertise(): Promise<Unit> {
        connectionsClient.stopAdvertising()
        return Promise.resolved(Unit)
    }

    override fun startDiscovery(name: String, strategy: Strategy?): Promise<String> {
        myPeerName = name
        val serviceId = context.packageName
        val options = DiscoveryOptions.Builder()
            .setStrategy(getStrategy(strategy))
            .build()

        val promise = Promise<String>()
        connectionsClient.startDiscovery(serviceId, discoveryCallback, options)
            .addOnSuccessListener { promise.resolve(name) }
            .addOnFailureListener { promise.reject(it) }
        return promise
    }

    override fun stopDiscovery(): Promise<Unit> {
        connectionsClient.stopDiscovery()
        return Promise.resolved(Unit)
    }

    override fun requestConnection(advertisePeerId: String): Promise<Unit> {
        val promise = Promise<Unit>()
        connectionsClient.requestConnection(myPeerName, advertisePeerId, requestConnectionCallback)
            .addOnSuccessListener { promise.resolve(Unit) }
            .addOnFailureListener { promise.reject(it) }
        return promise
    }

    override fun acceptConnection(targetPeerId: String): Promise<Unit> {
        val promise = Promise<Unit>()
        connectionsClient.acceptConnection(targetPeerId, payloadCallback)
            .addOnSuccessListener { promise.resolve(Unit) }
            .addOnFailureListener { promise.reject(it) }
        return promise
    }

    override fun rejectConnection(targetPeerId: String): Promise<Unit> {
        val promise = Promise<Unit>()
        connectionsClient.rejectConnection(targetPeerId)
            .addOnSuccessListener { promise.resolve(Unit) }
            .addOnFailureListener { promise.reject(it) }
        return promise
    }

    override fun disconnect(targetPeerId: String?): Promise<Unit> {
        if (targetPeerId != null) {
            connectionsClient.disconnectFromEndpoint(targetPeerId)
        } else {
            connectionsClient.stopAllEndpoints()
        }
        return Promise.resolved(Unit)
    }

    override fun sendText(targetPeerId: String, text: String): Promise<Unit> {
        val promise = Promise<Unit>()
        connectionsClient.sendPayload(targetPeerId, Payload.fromBytes(text.toByteArray()))
            .addOnSuccessListener { promise.resolve(Unit) }
            .addOnFailureListener { promise.reject(it) }
        return promise
    }

    // endregion

    // region Nearby Connections callbacks

    private val advertiseCallback: ConnectionLifecycleCallback =
        object : ConnectionLifecycleCallback() {
            override fun onConnectionResult(peerId: String, result: ConnectionResolution) {
                if (!result.status.isSuccess) {
                    Log.e(TAG, "Advertise connection failed for $peerId: ${result.status}")
                    return
                }
                val targetPeerName = initiatedPeers[peerId] ?: ""
                onConnected?.invoke(peerId, targetPeerName)
            }

            override fun onDisconnected(peerId: String) {
                this@HybridNearbyConnections.onDisconnected?.invoke(peerId)
            }

            override fun onConnectionInitiated(peerId: String, connectionInfo: ConnectionInfo) {
                val peerName = connectionInfo.endpointName
                initiatedPeers[peerId] = peerName
                onInvitationReceived?.invoke(peerId, peerName)
            }
        }

    private val requestConnectionCallback: ConnectionLifecycleCallback =
        object : ConnectionLifecycleCallback() {
            override fun onConnectionResult(peerId: String, result: ConnectionResolution) {
                if (!result.status.isSuccess) {
                    Log.e(TAG, "Request connection failed for $peerId: ${result.status}")
                    return
                }
                val targetPeerName = initiatedPeers[peerId] ?: ""
                onConnected?.invoke(peerId, targetPeerName)
            }

            override fun onDisconnected(peerId: String) {
                this@HybridNearbyConnections.onDisconnected?.invoke(peerId)
            }

            override fun onConnectionInitiated(peerId: String, connectionInfo: ConnectionInfo) {
                val peerName = connectionInfo.endpointName
                initiatedPeers[peerId] = peerName
                acceptConnection(peerId).catch { e ->
                    Log.e(TAG, "Auto-accept failed for $peerId", e)
                }
            }
        }

    private val discoveryCallback: EndpointDiscoveryCallback =
        object : EndpointDiscoveryCallback() {
            override fun onEndpointFound(peerId: String, info: DiscoveredEndpointInfo) {
                onPeerFound?.invoke(peerId, info.endpointName)
            }

            override fun onEndpointLost(peerId: String) {
                onPeerLost?.invoke(peerId)
            }
        }

    private val payloadCallback: PayloadCallback = object : PayloadCallback() {
        override fun onPayloadReceived(peerId: String, payload: Payload) {
            if (payload.type != Payload.Type.BYTES) return
            val bytes = payload.asBytes() ?: return
            onTextReceived?.invoke(peerId, String(bytes))
        }

        override fun onPayloadTransferUpdate(peerId: String, update: PayloadTransferUpdate) {
            // TODO: handle payload transfer update
        }
    }

    // endregion

    companion object {
        private const val TAG = "HybridNearbyConnections"
    }
}
