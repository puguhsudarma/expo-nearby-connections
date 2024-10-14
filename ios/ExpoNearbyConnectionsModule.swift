import ExpoModulesCore
import MultipeerConnectivity

public class ExpoNearbyConnectionsModule: Module {
    private var nearbyConnection: MultipeerConnectivityModule = MultipeerConnectivityModule()
    
    public required init(appContext: AppContext) {
        super.init(appContext: appContext)
        self.nearbyConnection.delegate = self
    }
    
    public func definition() -> ModuleDefinition {
        Events(EventNames.allCases.map { $0.rawValue })
        
        Name(MODULE_NAME)
        
        AsyncFunction("isPlayServicesAvailable") { () -> Bool in
            return true
        }
        
        AsyncFunction("startAdvertise") { (name: String) -> String in
            let myPeerId = self.nearbyConnection.startAdvertise(name)
            
            return myPeerId
        }
        
        AsyncFunction("stopAdvertise") { () -> Void in
            return nearbyConnection.stopAdvertise()
        }
        
        AsyncFunction("startDiscovery") { (name: String) -> String in
            let myPeerId = nearbyConnection.startDiscovery(name)
            
            return myPeerId
        }
        
        AsyncFunction("stopDiscovery") { () -> Void in
            return nearbyConnection.stopDiscovery()
        }
        
        AsyncFunction("requestConnection") { (advertisePeerId: String, promise: Promise) -> Void in
            do {
                try nearbyConnection.requestConnection(to: advertisePeerId)
                promise.resolve(nil)
            } catch {
                promise.reject(error)
            }
        }
        
        AsyncFunction("acceptConnection") { (targetPeerId: String, promise: Promise) -> Void in
            do {
                try nearbyConnection.acceptConnection(to: targetPeerId)
                promise.resolve(nil)
            } catch {
                promise.reject(error)
            }
        }
        
        AsyncFunction("rejectConnection") { (targetPeerId: String, promise: Promise) -> Void in
            do {
                try nearbyConnection.rejectConnection(to: targetPeerId)
                promise.resolve(nil)
            } catch {
                promise.reject(error)
            }
        }
        
        AsyncFunction("disconnect") { () -> Void in
            return nearbyConnection.disconnect()
        }
        
        AsyncFunction("sendText") { (targetPeerId: String, text: String, promise: Promise) -> Void in
            do {
                try nearbyConnection.sendText(to: targetPeerId, payload: text)
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
