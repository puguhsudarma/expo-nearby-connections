package expo.modules.nearbyconnections

import android.content.Context
import androidx.core.os.bundleOf
import com.google.android.gms.common.ConnectionResult
import com.google.android.gms.common.GoogleApiAvailability
import expo.modules.kotlin.Promise
import expo.modules.kotlin.exception.CodedException
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import com.google.android.gms.common.ConnectionResult
import com.google.android.gms.common.GoogleApiAvailability
import expo.modules.kotlin.Promise
import expo.modules.kotlin.exception.CodedException

class ExpoNearbyConnectionsModule : Module() {
    override fun definition() = ModuleDefinition {
        Events(*EventName.entries.map { it.toString() }.toTypedArray())

        Name(MODULE_NAME)

        AsyncFunction("isPlayServicesAvailable") {
            val result = GoogleApiAvailability.getInstance().isGooglePlayServicesAvailable(context)
            val isAvailable = result == ConnectionResult.SUCCESS

            return@AsyncFunction isAvailable
        }

        AsyncFunction("startAdvertise") { name: String, strategy: Double?, promise: Promise ->
            nearbyConnectionsModule.startAdvertise(name, strategy).addOnSuccessListener { result ->
                promise.resolve(result)
            }.addOnFailureListener {
                promise.reject(
                    CodedException(
                        "E_NEARBY_CONNECTIONS_START_ADVERTISE_FAILED",
                        "Failed to start advertising",
                        it
                    )
                )
            }
        }

        AsyncFunction("stopAdvertise") {
            return@AsyncFunction nearbyConnectionsModule.stopAdvertise()
        }

        AsyncFunction("startDiscovery") { name: String, strategy: Double?, promise: Promise ->
            nearbyConnectionsModule.startDiscovery(name, strategy).addOnSuccessListener { result ->
                promise.resolve(result)
            }.addOnFailureListener {
                promise.reject(
                    CodedException(
                        "E_NEARBY_CONNECTIONS_START_DISCOVERY_FAILED",
                        "Failed to start discovery",
                        it
                    )
                )
            }
        }

        AsyncFunction("stopDiscovery") {
            return@AsyncFunction nearbyConnectionsModule.stopDiscovery()
        }

        AsyncFunction("requestConnection") { advertisePeerId: String, promise: Promise ->
            nearbyConnectionsModule.requestConnection(advertisePeerId).addOnSuccessListener {
                promise.resolve(null)
            }.addOnFailureListener {
                promise.reject(
                    CodedException(
                        "E_NEARBY_CONNECTIONS_REQUEST_CONNECTION_FAILED",
                        "Failed to request connection",
                        it
                    )
                )

            }
        }

        AsyncFunction("acceptConnection") { targetPeerId: String, promise: Promise ->
            nearbyConnectionsModule.acceptConnection(targetPeerId).addOnSuccessListener {
                promise.resolve(null)
            }.addOnFailureListener {
                promise.reject(
                    CodedException(
                        "E_NEARBY_CONNECTIONS_ACCEPT_CONNECTION_FAILED",
                        "Failed to accept connection",
                        it
                    )
                )
            }
        }

        AsyncFunction("rejectConnection") { targetPeerId: String, promise: Promise ->
            nearbyConnectionsModule.rejectConnection(targetPeerId).addOnSuccessListener {
                promise.resolve(null)
            }.addOnFailureListener {
                promise.reject(
                    CodedException(
                        "E_NEARBY_CONNECTIONS_REJECT_CONNECTION_FAILED",
                        "Failed to reject connection",
                        it
                    )
                )
            }
        }

        AsyncFunction("disconnect") { targetPeerId: String ->
            return@AsyncFunction nearbyConnectionsModule.disconnect(targetPeerId)
        }

        AsyncFunction("sendText") { targetPeerId: String, text: String, promise: Promise ->
            nearbyConnectionsModule.sendText(targetPeerId, text).addOnSuccessListener {
                promise.resolve(null)
            }.addOnFailureListener {
                promise.reject(
                    CodedException(
                        "E_NEARBY_CONNECTIONS_SEND_TEXT_FAILED", "Failed to send text", it
                    )
                )
            }
        }
    }

    private val nearbyConnectionsModule: NearbyConnectionsModule by lazy {
        val callbacks = NearbyConnectionCallbacks(
            onPeerFound = ::onPeerFound,
            onPeerLost = ::onPeerLost,
            onInvitationReceived = ::onInvitationReceived,
            onConnected = ::onConnected,
            onDisconnected = ::onDisconnected,
            onTextReceived = ::onTextReceived
        )
        NearbyConnectionsModule(context, callbacks)
    }

    private val context: Context
        get() = requireNotNull(appContext.reactContext) {
            "React Application Context is null"
        }

    private fun onPeerFound(peerId: String, name: String) {
        this@ExpoNearbyConnectionsModule.sendEvent(
            EventName.ON_PEER_FOUND.toString(), bundleOf(
                "peerId" to peerId,
                "name" to name,
            )
        )
    }

    private fun onPeerLost(peerId: String) {
        this@ExpoNearbyConnectionsModule.sendEvent(
            EventName.ON_PEER_LOST.toString(), bundleOf(
                "peerId" to peerId
            )
        )
    }

    private fun onInvitationReceived(peerId: String, name: String) {
        this@ExpoNearbyConnectionsModule.sendEvent(
            EventName.ON_INVITATION_RECEIVED.toString(), bundleOf(
                "peerId" to peerId,
                "name" to name
            )
        )
    }

    private fun onConnected(peerId: String, name: String) {
        this@ExpoNearbyConnectionsModule.sendEvent(
            EventName.ON_CONNECTED.toString(), bundleOf(
                "peerId" to peerId,
                "name" to name
            )
        )
    }

    private fun onDisconnected(peerId: String) {
        this@ExpoNearbyConnectionsModule.sendEvent(
            EventName.ON_DISCONNECTED.toString(), bundleOf(
                "peerId" to peerId
            )
        )
    }

    private fun onTextReceived(peerId: String, text: String) {
        this@ExpoNearbyConnectionsModule.sendEvent(
            EventName.ON_TEXT_RECEIVED.toString(), bundleOf(
                "peerId" to peerId,
                "text" to text
            )
        )
    }
}
