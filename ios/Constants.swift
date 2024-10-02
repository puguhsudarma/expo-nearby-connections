//
//  Constants.swift
//  ExpoNearbyConnections
//
//  Created by Puguh Sudarma on 13/09/24.
//

import Foundation

enum EventNames: String, CaseIterable {
    case ON_PEER_FOUND = "onPeerFound"
    case ON_PEER_LOST = "onPeerLost"
    case ON_INVITATION_RECIEVED = "onInvitationReceived"
    case ON_CONNECTED = "onConnected"
    case ON_DISCONNECTED = "onDisconnected"
    case ON_TEXT_RECEIVED = "onTextReceived"
}

let MODULE_NAME="ExpoNearbyConnectionsModule"

protocol NearbyConnectionCallbackDelegate {
    func onPeerFound(fromPeerId peerId: String, fromPeerName name: String) -> Void
    func onPeerLost(fromPeerId peerId: String) -> Void
    func onInvitationReceived(fromPeerId peerId: String, fromPeerName name: String) -> Void
    func onConnected(fromPeerId peerId: String, fromPeerName name: String) -> Void
    func onDisconnected(fromPeerId peerId: String) -> Void
    func onTextReceived(fromPeerId peerId: String, payload text: String) -> Void
}
