import ExpoModulesCore
import MultipeerConnectivity

public class ExpoNearbyConnectionsModule: Module {
    public func definition() -> ModuleDefinition {
        Events(EventNames.allCases.map { $0.rawValue })
        
        Name(MODULE_NAME)
        
        var nearbyConnection = MultipeerConnectivityModule(self)
        
        AsyncFunction("isPlayServicesAvailable") { () -> Bool in
            return nearbyConnection.isPlayServicesAvailable()
        }
        
        AsyncFunction("startAdvertise") { (name: String) -> String in
            var peer = nearbyConnection.startAdvertise(name)
            
            return String(peer.hash)
        }
        
        AsyncFunction("stopAdvertise") { () -> Void in
            return nearbyConnection.stopAdvertise()
        }
        
        AsyncFunction("startDiscover") { (name: String) -> String in
            var peer = nearbyConnection.startDiscover(name)
            
            return String(peer.hash)
        }
        
        AsyncFunction("stopDiscover") { () -> Void in
            return nearbyConnection.stopDiscover()
        }
        
        AsyncFunction("requestConnection") { (name: String, peerId: String, timeoutInSecond: Int?, promise: Promise) -> Void in
            do {
                try nearbyConnection.requestConnection(name, toPeer: peerId, timeoutInSecond as NSNumber?)
                promise.resolve(nil)
            } catch {
                promise.reject(error)
            }
        }
        
        AsyncFunction("acceptConnection") { (peerId: String, promise: Promise) -> Void in
            do {
                try nearbyConnection.acceptConnection(peerId)
                promise.resolve(nil)
            } catch {
                promise.reject(error)
            }
        }
        
        AsyncFunction("rejectConnection") { (peerId: String, promise: Promise) -> Void in
            do {
                try nearbyConnection.rejectConnection(peerId)
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

extension ExpoNearbyConnectionsModule: MultipeerConnectivityCallbackDelegate {
    func sendEvent(_ eventName: EventNames, _ body: [String: Any?] = [:]) {
        sendEvent(eventName.rawValue, body)
    }
    
    func onPeerFound(_ peerId: String, _ name: String) {
        sendEvent(.ON_PEER_FOUND, [
            peerId: peerId,
            "name": name
        ])
    }
    
    func onPeerLost(_ peerId: String) {
        sendEvent(.ON_PEER_LOST, [
            peerId: peerId
        ])
    }
    
    func onInvitationReceived(fromPeer peerId: String, _ name: String) {
        sendEvent(.ON_INVITATION_RECIEVED, [
            peerId: peerId,
            "name": name
        ])
    }
    
    func onConnected(fromPeer peerId: String, _ name: String) {
        sendEvent(.ON_CONNECTED, [
            peerId: peerId,
            "name": name
        ])
    }
    
    func onDisconnected(_ peerId: String) {
        sendEvent(.ON_DISCONNECTED, [
            peerId: peerId
        ])
    }
    
    func onTextReceived(toDestination peerId: String, _ text: String) {
        sendEvent(.ON_TEXT_RECEIVED, [
            peerId: peerId,
            "text": text
        ])
    }
}
