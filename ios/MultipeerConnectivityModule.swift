import MultipeerConnectivity

public class MultipeerConnectivityModule: NSObject {
    private var peerId: MCPeerID?
    private var advertiser: MCNearbyServiceAdvertiser?
    private var browser: MCNearbyServiceBrowser?
    private var session: MCSession?
    private var discoveredPeers: Dictionary<String, MCPeerID> = [:]
    private var invitedPeers: Dictionary<String, (
        peerId: MCPeerID,
        invitationHandler: (Bool, MCSession?) -> Void,
        isConnected: Bool
    )> = [:]
    private var callbackDelegate: MultipeerConnectivityCallbackDelegate
    
    init(_ callbacks: MultipeerConnectivityCallbackDelegate) {
        self.callbackDelegate = callbacks
    }
    
    deinit {
        session?.disconnect()
        advertiser?.stopAdvertisingPeer()
        browser?.stopBrowsingForPeers()
    }
    
    public func isPlayServicesAvailable() -> Bool {
        return true
    }
    
    public func startAdvertise(_ name: String) -> MCPeerID {
        let peerID = MCPeerID(displayName: name)
        self.peerId = peerID
        let discoveryInfo: Dictionary<String, String> = [
            "peerId": String(peerID.hash),
            "name": name
        ]
        let serviceType = InfoPlistParser.getServiceType()
        
        advertiser = MCNearbyServiceAdvertiser(peer: peerID, discoveryInfo: discoveryInfo, serviceType: serviceType);
        advertiser!.delegate = self
        advertiser!.startAdvertisingPeer()
        
        return peerID
    }
    
    public func stopAdvertise() {
        advertiser!.stopAdvertisingPeer()
        self.peerId = nil
        self.advertiser = nil
    }
    
    public func startDiscover(_ name: String) -> MCPeerID {
        let peerID = MCPeerID(displayName: name)
        self.peerId = peerID
        
        let serviceType = InfoPlistParser.getServiceType()
        
        browser = MCNearbyServiceBrowser(peer: peerID, serviceType: serviceType)
        browser!.delegate = self
        
        browser!.startBrowsingForPeers()
        
        return peerID
    }
    
    public func stopDiscover() {
        browser!.stopBrowsingForPeers()
        self.peerId = nil
        self.browser = nil
    }
    
    public func requestConnection(_ name: String, toPeer advertisePeerId: String, _ timeoutInSecond: NSNumber?) throws {
        let contextString = "{name: \(name), peerId: \(String(peerId?.hash ?? 0))}".data(using: .utf8)
        
        guard let peerID = discoveredPeers.first(where: {
            $0.key == advertisePeerId
        }) else {
            throw NSError(domain: "ExpoNearbyConnections", code: 0, userInfo: [NSLocalizedDescriptionKey: "RequestConnection: Not found target peer."])
        }
        
        self.session = MCSession(peer: peerID.value, securityIdentity: nil, encryptionPreference: .required)
        session?.delegate = self
        
        browser?.invitePeer(peerID.value, to: session!, withContext: contextString, timeout: TimeInterval(truncating: timeoutInSecond ?? 30))
    }
    
    public func acceptConnection(_ peerId: String) throws {
        guard let invitedPeer = invitedPeers.first(where: {
            $0.key == peerId
        }) else {
            throw NSError(domain: "ExpoNearbyConnections", code: 0, userInfo: [NSLocalizedDescriptionKey: "AcceptConnection: Not found target peer."])
        }
        
        invitedPeer.value.invitationHandler(true, session)
        invitedPeers[peerId]?.isConnected = true
    }
    
    public func rejectConnection(_ peerId: String) throws {
        guard let invitedPeer = invitedPeers.first(where: {
            $0.key == peerId
        }) else {
            throw NSError(domain: "ExpoNearbyConnections", code: 0, userInfo: [NSLocalizedDescriptionKey: "RejectConnection: Not found target peer."])
        }
        
        invitedPeer.value.invitationHandler(false, session)
        invitedPeers[peerId]?.isConnected = false
    }
    
    public func disconnect(toPeer peerId: String) {
        session?.disconnect()
        session = nil
        invitedPeers.removeValue(forKey: peerId)
    }
    
    public func sendText(toPeer peerId: String, _ text: String) throws {
        guard let data = text.data(using: .utf8) else {
            throw NSError(domain: "ExpoNearbyConnections", code: 0, userInfo: [NSLocalizedDescriptionKey: "SendText: Invalid text data."])
        }
        
        guard let peer = invitedPeers.first(where: {
            $0.key == peerId
        }) else {
            throw NSError(domain: "ExpoNearbyConnections", code: 0, userInfo: [NSLocalizedDescriptionKey: "SendText: Not found target peer."])
        }
        
        try session?.send(data, toPeers: [peer.value.peerId], with: .unreliable)
    }
}

extension MultipeerConnectivityModule: MCNearbyServiceAdvertiserDelegate {
    public func advertiser(_ advertiser: MCNearbyServiceAdvertiser, didNotStartAdvertisingPeer error: any Error) {
        print("Advertiser Events: didNotStartAdvertisingPeer", error)
    }
    
    public func advertiser(_ advertiser: MCNearbyServiceAdvertiser, didReceiveInvitationFromPeer peerID: MCPeerID, withContext context: Data?, invitationHandler: @escaping (Bool, MCSession?) -> Void) {
        self.invitedPeers[String(peerID.hash)] = (peerID, invitationHandler, false)
        callbackDelegate.onInvitationReceived(fromPeer: String(peerID.hash), peerID.displayName)
    }
}

extension MultipeerConnectivityModule: MCNearbyServiceBrowserDelegate {
    public func browser(_ browser: MCNearbyServiceBrowser, didNotStartBrowsingForPeers error: any Error) {
        print("Browser Events: didNotStartBrowsingForPeers", error)
    }
    
    public func browser(_ browser: MCNearbyServiceBrowser, foundPeer peerID: MCPeerID, withDiscoveryInfo info: [String : String]?) {
        self.discoveredPeers[String(peerID.hash)] = peerID
        callbackDelegate.onPeerFound(String(peerID.hash), peerID.displayName)
    }
    
    public func browser(_ browser: MCNearbyServiceBrowser, lostPeer peerID: MCPeerID) {
        self.discoveredPeers.removeValue(forKey: String(peerID.hash))
        callbackDelegate.onPeerLost(String(peerID.hash))
    }
}

extension MultipeerConnectivityModule: MCSessionDelegate {
    public func session(_ session: MCSession, peer peerID: MCPeerID, didChange state: MCSessionState) {
        switch state {
        case .connected:
            callbackDelegate.onConnected(fromPeer: String(peerID.hash), peerID.displayName)
        case .notConnected:
            callbackDelegate.onDisconnected(String(peerID.hash))
        case .connecting:
            // TODO: Implement connecting
            break
        @unknown default:
            break
        }
    }
    
    public func session(_ session: MCSession, didReceive data: Data, fromPeer peerID: MCPeerID) {
        let text = String(decoding: data, as: UTF8.self)
        callbackDelegate.onTextReceived(toDestination: String(peerID.hash), text)
    }
    
    public func session(_ session: MCSession, didReceive stream: InputStream, withName streamName: String, fromPeer peerID: MCPeerID) {
        // TODO: Implement receive stream
    }
    
    public func session(_ session: MCSession, didStartReceivingResourceWithName resourceName: String, fromPeer peerID: MCPeerID, with progress: Progress) {
        // TODO: Implement receive resource progress
    }
    
    public func session(_ session: MCSession, didReceiveCertificate certificate: [Any]?, fromPeer peerID: MCPeerID, certificateHandler: @escaping (Bool) -> Void) {
        // TODO: Implement receive certificate
    }
    
    public func session(_ session: MCSession, didFinishReceivingResourceWithName resourceName: String, fromPeer peerID: MCPeerID, at localURL: URL?, withError error: (any Error)?) {
        // TODO: Implement receive resource completion with error
    }
}
