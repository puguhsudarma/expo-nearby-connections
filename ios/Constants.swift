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

protocol MultipeerConnectivityCallbackDelegate {
    func onPeerFound(_ peerId: String, _ name: String) -> Void
    func onPeerLost(_ peerId: String) -> Void
    func onInvitationReceived(fromPeer peerId: String, _ name: String) -> Void
    func onConnected(fromPeer peerId: String, _ name: String) -> Void
    func onDisconnected(_ peerId: String) -> Void
    func onTextReceived(toDestination peerId: String, _ text: String) -> Void
}
