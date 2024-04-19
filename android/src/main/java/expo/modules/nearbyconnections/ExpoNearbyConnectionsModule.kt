package expo.modules.nearbyconnections

import android.util.Log
import android.content.Context
import androidx.core.os.bundleOf
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import com.google.android.gms.common.ConnectionResult
import com.google.android.gms.common.GoogleApiAvailability
import com.google.android.gms.nearby.Nearby
import com.google.android.gms.nearby.connection.*
import expo.modules.kotlin.Promise
import expo.modules.kotlin.exception.CodedException

const val ON_CONNECTION_RESULT = "onConnectionResult"
const val ON_DISCONNECTED = "onDisconnected"
const val ON_CONNECTION_INITIATED = "onConnectionInitiated"
const val ON_ENDPOINT_FOUND = "onEndpointFound"
const val ON_ENDPOINT_LOST = "onEndpointLost"
const val ON_PAYLOAD_RECEIVED = "onPayloadReceived"
const val ON_PAYLOAD_TRANSFER_UPDATE = "onPayloadTransferUpdate"

class NearbyConnectionModule : Module() {
    override fun definition() = ModuleDefinition {
        Events(
            ON_CONNECTION_RESULT,
            ON_DISCONNECTED,
            ON_CONNECTION_INITIATED,
            ON_ENDPOINT_FOUND,
            ON_ENDPOINT_LOST,
            ON_PAYLOAD_RECEIVED,
            ON_PAYLOAD_TRANSFER_UPDATE
        )

        Name("NearbyConnections")

        AsyncFunction("isGooglePlayServicesAvailable") {
            val isAvailable =
                GoogleApiAvailability.getInstance().isGooglePlayServicesAvailable(context)
            return@AsyncFunction isAvailable == ConnectionResult.SUCCESS
        }

        AsyncFunction("startAdvertising") { endpointName: String, serviceId: String, strategy: Number, promise: Promise ->
            connectionsClient.startAdvertising(
                endpointName,
                serviceId,
                connectionLifecycleCallback,
                AdvertisingOptions.Builder().setStrategy(getStrategy(strategy)).build()
            ).addOnSuccessListener {
                Log.d("NearbyConnection", "startAdvertising success")
                promise.resolve(null)
            }.addOnFailureListener {
                Log.d("NearbyConnection", "startAdvertising failed", it)
                promise.reject(CodedException("", it.message, it.cause))
            }

        }

        AsyncFunction("stopAdvertising") {
            connectionsClient.stopAdvertising()
            Log.d("NearbyConnection", "stopAdvertising")
            return@AsyncFunction null
        }

        AsyncFunction("startDiscovery") { serviceId: String, strategy: Number, promise: Promise ->
            connectionsClient.startDiscovery(
                serviceId,
                endpointDiscoveryCallback,
                DiscoveryOptions.Builder().setStrategy(getStrategy(strategy)).build()
            ).addOnSuccessListener {
                Log.d("NearbyConnection", "startDiscovery success")
                promise.resolve(null)
            }.addOnFailureListener {
                Log.d("NearbyConnection", "startDiscovery failed", it)
                promise.reject(CodedException("", it.message, it.cause))
            }
        }

        AsyncFunction("stopDiscovery") {
            connectionsClient.stopDiscovery()
            Log.d("NearbyConnection", "stopDiscovery")
            return@AsyncFunction null
        }

        AsyncFunction("requestConnection") { endpointName: String, advertiserEndpointId: String, promise: Promise ->
            connectionsClient.requestConnection(
                endpointName, advertiserEndpointId, connectionLifecycleCallback
            ).addOnSuccessListener {
                Log.d("NearbyConnection", "requestConnection success")
                promise.resolve(null)
            }.addOnFailureListener {
                Log.d("NearbyConnection", "requestConnection failed", it)
                promise.reject(CodedException("", it.message, it.cause))
            }
        }

        AsyncFunction("acceptConnection") { endpointId: String, promise: Promise ->
            connectionsClient.acceptConnection(
                endpointId, payloadCallback
            ).addOnSuccessListener {
                Log.d("NearbyConnection", "acceptConnection success")
                promise.resolve(null)
            }.addOnFailureListener {
                Log.d("NearbyConnection", "acceptConnection failed", it)
                promise.reject(CodedException("", it.message, it.cause))
            }
        }

        AsyncFunction("rejectConnection") { endpointId: String, promise: Promise ->
            connectionsClient.rejectConnection(
                endpointId
            ).addOnSuccessListener {
                Log.d("NearbyConnection", "rejectConnection success")
                promise.resolve(null)
            }.addOnFailureListener {
                Log.d("NearbyConnection", "rejectConnection failed", it)
                promise.reject(CodedException("", it.message, it.cause))
            }
        }

        AsyncFunction("disconnectFromEndpoint") { endpointId: String ->
            connectionsClient.disconnectFromEndpoint(endpointId)
            Log.d("NearbyConnection", "disconnectFromEndpoint")
            return@AsyncFunction true
        }

        AsyncFunction("stopAllEndpoints") {
            connectionsClient.stopAllEndpoints()
            Log.d("NearbyConnection", "stopAllEndpoints")
            return@AsyncFunction null
        }

        AsyncFunction("sendPayload") { endpointId: String, payload: String, promise: Promise ->
            connectionsClient.sendPayload(
                endpointId, Payload.fromBytes(payload.toByteArray())
            ).addOnSuccessListener {
                Log.d("NearbyConnection", "sendPayload success")
                promise.resolve(null)
            }.addOnFailureListener {
                Log.d("NearbyConnection", "sendPayload failed", it)
                promise.reject(CodedException("", it.message, it.cause))
            }
        }
    }

    private val context: Context
        get() = requireNotNull(appContext.reactContext) {
            "React Application Context is null"
        }

    private fun getStrategy(strategy: Number): Strategy {
        return when (strategy.toInt()) {
            1 -> Strategy.P2P_CLUSTER
            2 -> Strategy.P2P_STAR
            3 -> Strategy.P2P_POINT_TO_POINT
            else -> throw IllegalArgumentException("Invalid strategy")
        }
    }

    private val connectionsClient: ConnectionsClient by lazy {
        Nearby.getConnectionsClient(
            context
        )
    }

    private val connectionLifecycleCallback: ConnectionLifecycleCallback =
        object : ConnectionLifecycleCallback() {
            override fun onConnectionResult(endpointId: String, result: ConnectionResolution) {
                val data = bundleOf(
                    "endpointId" to endpointId,
                    "status" to result.status.statusCode.toString(),
                    "statusMessage" to result.status.statusMessage,
                    "isSuccess" to if (result.status.isSuccess) "1" else "0"
                )

                Log.d("NearbyConnection", "onConnectionResult")
                Log.d("NearbyConnection", "onConnectionResult status: ${result.status.statusCode}")
                Log.d(
                    "NearbyConnection",
                    "onConnectionResult status message: ${result.status.statusMessage}"
                )

                this@NearbyConnectionModule.sendEvent(ON_CONNECTION_RESULT, data)
            }

            override fun onDisconnected(endpointId: String) {
                // We've been disconnected from this endpoint. No more data can be
                // sent or received.
                val data = bundleOf(
                    "endpointId" to endpointId
                )

                Log.d("NearbyConnection", "onDisconnected")

                this@NearbyConnectionModule.sendEvent(ON_DISCONNECTED, data)
            }

            override fun onConnectionInitiated(endpointId: String, connectionInfo: ConnectionInfo) {
                val data = bundleOf(
                    "endpointId" to endpointId,
                    "endpointName" to connectionInfo.endpointName,
                    "authenticationDigits" to connectionInfo.authenticationDigits,
                    "isIncomingConnection" to if (connectionInfo.isIncomingConnection) "1" else "0"
                )

                Log.d("NearbyConnection", "onConnectionInitiated")

                this@NearbyConnectionModule.sendEvent(ON_CONNECTION_INITIATED, data)
            }
        }

    private val endpointDiscoveryCallback: EndpointDiscoveryCallback =
        object : EndpointDiscoveryCallback() {
            override fun onEndpointFound(endpointId: String, info: DiscoveredEndpointInfo) {
                // An endpoint was found.
                val data = bundleOf(
                    "endpointId" to endpointId,
                    "endpointName" to info.endpointName,
                    "serviceId" to info.serviceId,
                    "endpointInfo" to String(info.endpointInfo)
                )

                Log.d("NearbyConnection", "onEndpointFound")
                Log.d("NearbyConnection", "endpointInfo: ${String(info.endpointInfo)}")

                this@NearbyConnectionModule.sendEvent(ON_ENDPOINT_FOUND, data)
            }

            override fun onEndpointLost(endpointId: String) {
                // A previously discovered endpoint has gone away.
                val data = bundleOf(
                    "endpointId" to endpointId
                )

                Log.d("onEndpointLost", "onEndpointLost")

                this@NearbyConnectionModule.sendEvent(ON_ENDPOINT_LOST, data)
            }
        }

    private val payloadCallback: PayloadCallback = object : PayloadCallback() {
        override fun onPayloadReceived(endpointId: String, payload: Payload) {
            // Handle the payload
            val data = bundleOf(
                "endpointId" to endpointId,
                "payloadType" to payload.type.toString(),
                "payloadId" to payload.id.toString()
            )

            // transform payload to string
            when (payload.type) {
                Payload.Type.BYTES -> {
                    val bytes = payload.asBytes()
                    if (bytes != null) {
                        data.putString("payload", String(bytes))
                    }
                }

                Payload.Type.FILE -> {
                    // TODO: handle file
                }

                Payload.Type.STREAM -> {
                    // TODO: handle stream
                }
            }

            Log.d("onPayloadReceived", "onPayloadReceived")

            this@NearbyConnectionModule.sendEvent(ON_PAYLOAD_RECEIVED, data)
        }

        override fun onPayloadTransferUpdate(
            endpointId: String, update: PayloadTransferUpdate
        ) {
            // Handle the payload transfer update.
            val data = bundleOf(
                "endpointId" to endpointId,
                "payloadId" to update.payloadId.toString(),
                "status" to update.status.toString(),
                "totalBytes" to update.totalBytes.toString(),
                "bytesTransferred" to update.bytesTransferred.toString()
            )

            Log.d("onPayloadTransferUpdate", "onPayloadTransferUpdate")

            this@NearbyConnectionModule.sendEvent(ON_PAYLOAD_TRANSFER_UPDATE, data)
        }
    }
}
