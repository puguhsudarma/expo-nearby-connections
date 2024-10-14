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

let REQUEST_CONNECTION_TIMEOUT: NSNumber = 30 // in seconds

protocol NearbyConnectionModule {
    func startAdvertise(_ name: String) -> String
    func stopAdvertise() -> Void
    func startDiscovery(_ name: String) -> String
    func stopDiscovery() -> Void
    func requestConnection(to advertisePeerId: String) throws -> Void
    func acceptConnection(to peerId: String) throws -> Void
    func rejectConnection(to peerId: String) throws -> Void
    func disconnect() -> Void
    func sendText(to peerId: String, payload text: String) throws -> Void
}

protocol NearbyConnectionCallbackDelegate: AnyObject {
    func onPeerFound(fromPeerId peerId: String, fromPeerName name: String) -> Void
    func onPeerLost(fromPeerId peerId: String) -> Void
    func onInvitationReceived(fromPeerId peerId: String, fromPeerName name: String) -> Void
    func onConnected(fromPeerId peerId: String, fromPeerName name: String) -> Void
    func onDisconnected(fromPeerId peerId: String) -> Void
    func onTextReceived(fromPeerId peerId: String, payload text: String) -> Void
}
