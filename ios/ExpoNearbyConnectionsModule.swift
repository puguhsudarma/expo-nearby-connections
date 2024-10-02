import ExpoModulesCore
import MultipeerConnectivity

public class ExpoNearbyConnectionsModule: Module {
    public func definition() -> ModuleDefinition {
        Events(EventNames.allCases.map { $0.rawValue })
        
        Name(MODULE_NAME)
        
        let nearbyConnection = MultipeerConnectivityModule(delegate: self)
        
        AsyncFunction("isPlayServicesAvailable") { () -> Bool in
            return true
        }
        
        AsyncFunction("startAdvertise") { (name: String) -> String in
            let peer = nearbyConnection.startAdvertise(name)
            
            return String(peer.hash)
        }
        
        AsyncFunction("stopAdvertise") { () -> Void in
            return nearbyConnection.stopAdvertise()
        }
        
        AsyncFunction("startDiscovery") { (name: String) -> String in
            let peer = nearbyConnection.startDiscovery(name)
            
            return String(peer.hash)
        }
        
        AsyncFunction("stopDiscovery") { () -> Void in
            return nearbyConnection.stopDiscovery()
        }
        
        AsyncFunction("requestConnection") { (name: String, peerId: String, timeoutInSecond: Int?, promise: Promise) -> Void in
            do {
                try nearbyConnection.requestConnection(name, toPeer: peerId, timeout: timeoutInSecond as NSNumber?)
                promise.resolve(nil)
            } catch {
                promise.reject(error)
            }
        }
        
        AsyncFunction("acceptConnection") { (peerId: String, promise: Promise) -> Void in
            do {
                try nearbyConnection.acceptConnection(toDiscoveryPeer: peerId)
                promise.resolve(nil)
            } catch {
                promise.reject(error)
            }
        }
        
        AsyncFunction("rejectConnection") { (peerId: String, promise: Promise) -> Void in
            do {
                try nearbyConnection.rejectConnection(toDiscoveryPeer: peerId)
                promise.resolve(nil)
            } catch {
                promise.reject(error)
            }
        }
        
        AsyncFunction("disconnect") { (peerId: String) -> Void in
            return nearbyConnection.disconnect(toPeer: peerId)
        }
        
        AsyncFunction("sendText") { (peerId: String, text: String, promise: Promise) -> Void in
            do {
                try nearbyConnection.sendText(toPeer: peerId, text)
                promise.resolve(nil)
            } catch {
                promise.reject(error)
            }
        }
    }
}

extension ExpoNearbyConnectionsModule: NearbyConnectionCallbackDelegate {
    func sendEvent(_ eventName: EventNames, _ body: [String: Any?] = [:]) {
        sendEvent(eventName.rawValue, body)
    }
    
    func onPeerFound(fromPeerId peerId: String, fromPeerName name: String) {
        sendEvent(.ON_PEER_FOUND, [
            "peerId": peerId,
            "name": name
        ])
    }
    
    func onPeerLost(fromPeerId peerId: String) {
        sendEvent(.ON_PEER_LOST, [
            "peerId": peerId
        ])
    }
    
    func onInvitationReceived(fromPeerId peerId: String, fromPeerName name: String) {
        sendEvent(.ON_INVITATION_RECIEVED, [
            "peerId": peerId,
            "name": name
        ])
    }
    
    func onConnected(fromPeerId peerId: String, fromPeerName name: String) {
        sendEvent(.ON_CONNECTED, [
            "peerId": peerId,
            "name": name
        ])
    }
    
    func onDisconnected(fromPeerId peerId: String) {
        sendEvent(.ON_DISCONNECTED, [
            "peerId": peerId
        ])
    }
    
    func onTextReceived(fromPeerId peerId: String, payload text: String) {
        sendEvent(.ON_TEXT_RECEIVED, [
            "peerId": peerId,
            "text": text
        ])
    }
}
