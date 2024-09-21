package expo.modules.nearbyconnections

import android.content.Context
import androidx.core.os.bundleOf
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import expo.modules.kotlin.Promise
import expo.modules.kotlin.exception.CodedException

class ExpoNearbyConnectionsModule : Module() {
    override fun definition() = ModuleDefinition {
        Events(*EventName.entries.map { it.toString() }.toTypedArray())

        Name(MODULE_NAME)

        AsyncFunction("isPlayServicesAvailable") {
            return@AsyncFunction nearbyConnectionsModule.isPlayServicesAvailable()
        }

        AsyncFunction("startAdvertise") { name: String, strategy: Double?, promise: Promise ->
            nearbyConnectionsModule.startAdvertise(name, strategy)
                .addOnSuccessListener {
                    promise.resolve(name)
                }
                .addOnFailureListener {
                    promise.reject(CodedException("", it.message, it.cause))
                }
        }

        AsyncFunction("stopAdvertise") {
            nearbyConnectionsModule.stopAdvertise()
            return@AsyncFunction null
        }

        AsyncFunction("startDiscovery") { name: String, strategy: Double?, promise: Promise ->
            nearbyConnectionsModule.startDiscovery(strategy)
                .addOnSuccessListener {
                    promise.resolve(name)
                }
                .addOnFailureListener {
                    promise.reject(CodedException("", it.message, it.cause))
                }
        }

        AsyncFunction("stopDiscovery") {
            nearbyConnectionsModule.stopDiscovery()
            return@AsyncFunction null
        }

        AsyncFunction("requestConnection") { name: String, advertisePeerId: String, promise: Promise ->
            nearbyConnectionsModule.requestConnection(name, advertisePeerId)
                .addOnSuccessListener {
                    promise.resolve(null)
                }
                .addOnFailureListener {
                    promise.reject(CodedException("", it.message, it.cause))
                }
        }

        AsyncFunction("acceptConnection") { peerId: String, promise: Promise ->
            nearbyConnectionsModule.acceptConnection(peerId)
                .addOnSuccessListener {
                    promise.resolve(null)
                }
                .addOnFailureListener {
                    promise.reject(CodedException("", it.message, it.cause))
                }
        }

        AsyncFunction("rejectConnection") { peerId: String, promise: Promise ->
            nearbyConnectionsModule.rejectConnection(peerId)
                .addOnSuccessListener {
                    promise.resolve(null)
                }
                .addOnFailureListener {
                    promise.reject(CodedException("", it.message, it.cause))
                }
        }

        AsyncFunction("disconnect") { peerId: String ->
            nearbyConnectionsModule.disconnect(peerId)
            return@AsyncFunction true
        }

        AsyncFunction("sendText") { peerId: String, text: String, promise: Promise ->
            nearbyConnectionsModule.sendText(peerId, text)
                .addOnSuccessListener {
                    promise.resolve(null)
                }
                .addOnFailureListener {
                    promise.reject(CodedException("", it.message, it.cause))
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
                "peerId" to peerId, "name" to name
            )
        )
    }

    private fun onConnected(peerId: String, name: String) {
        this@ExpoNearbyConnectionsModule.sendEvent(
            EventName.ON_CONNECTED.toString(), bundleOf(
                "peerId" to peerId, "name" to name
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
                "peerId" to peerId, "text" to text
            )
        )
    }
}
