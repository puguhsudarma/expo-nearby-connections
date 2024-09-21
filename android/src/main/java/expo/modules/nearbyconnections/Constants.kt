package expo.modules.nearbyconnections

enum class EventName {
    ON_PEER_FOUND {
        override fun toString() = "onPeerFound"
    },
    ON_PEER_LOST {
        override fun toString() = "onPeerLost"
    },
    ON_INVITATION_RECEIVED {
        override fun toString() = "onInvitationReceived"
    },
    ON_CONNECTED {
        override fun toString() = "onConnected"
    },
    ON_DISCONNECTED {
        override fun toString() = "onDisconnected"
    },
    ON_TEXT_RECEIVED {
        override fun toString() = "onTextReceived"
    },
}

const val MODULE_NAME = "ExpoNearbyConnectionsModule"

data class NearbyConnectionCallbacks(
    val onPeerFound: (peerId: String, name: String) -> Unit,
    val onPeerLost: (peerId: String) -> Unit,
    val onInvitationReceived: (peerId: String, name: String) -> Unit,
    val onConnected: (peerId: String, name: String) -> Unit,
    val onDisconnected: (peerId: String) -> Unit,
    val onTextReceived: (peerId: String, text: String) -> Unit,
)
