//
//  Constants.swift
//  ExpoNearbyConnections
//
//  Created by Puguh Sudarma on 13/09/24.
//

import Foundation

let ON_PEER_FOUND = "onPeerFound"
let ON_PEER_LOST = "onPeerLost"
let ON_INVITATION_RECIEVED = "onInvitationReceived"
let ON_CONNECTED = "onConnected"
let ON_DISCONNECTED = "onDisconnected"
let ON_TEXT_RECEIVED = "onTextReceived"

let MODULE_NAME="ExpoNearbyConnectionsModule"

protocol MultipeerConnectivityCallbackDelegate {
    func onPeerFound(_ peerId: String, _ name: String) -> Void
    func onPeerLost(_ peerId: String) -> Void
    func onInvitationReceived(fromPeer peerId: String, _ name: String) -> Void
    func onConnected(fromPeer peerId: String, _ name: String) -> Void
    func onDisconnected(_ peerId: String) -> Void
    func onTextReceived(toDestination peerId: String, _ text: String) -> Void
}
