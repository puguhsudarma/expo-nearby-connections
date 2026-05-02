import Foundation

let REQUEST_CONNECTION_TIMEOUT: NSNumber = 30 // in seconds

protocol NearbyConnectionCallbackDelegate: AnyObject {
    func onPeerFound(fromPeerId peerId: String, fromPeerName name: String)
    func onPeerLost(fromPeerId peerId: String)
    func onInvitationReceived(fromPeerId peerId: String, fromPeerName name: String)
    func onConnected(fromPeerId peerId: String, fromPeerName name: String)
    func onDisconnected(fromPeerId peerId: String)
    func onTextReceived(fromPeerId peerId: String, payload text: String)
}
