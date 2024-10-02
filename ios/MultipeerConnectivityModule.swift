import MultipeerConnectivity

public class MultipeerConnectivityModule: NSObject {
    private var myPeerId: MCPeerID?
    private var advertiser: MCNearbyServiceAdvertiser?
    private var discovery: MCNearbyServiceBrowser?
    private var session: MCSession?
    private var discoveredPeers: Dictionary<String, MCPeerID> = [:]
    private var invitedPeers: Dictionary<String, (
        peerId: MCPeerID,
        invitationHandler: (Bool, MCSession?) -> Void
    )> = [:]
    private var callbackDelegate: NearbyConnectionCallbackDelegate
    
    init(delegate callbacks: NearbyConnectionCallbackDelegate) {
        self.callbackDelegate = callbacks
    }
    
    deinit {
        self.advertiser?.stopAdvertisingPeer()
        self.discovery?.stopBrowsingForPeers()
        self.session?.disconnect()
    }
    
    public func startAdvertise(_ name: String) -> MCPeerID {
        let peerID = MCPeerID(displayName: name)
        self.myPeerId = peerID
        let discoveryInfo: Dictionary<String, String> = [
            "peerId": String(peerID.hash),
            "name": name
        ]
        let serviceType = InfoPlistParser.getServiceType()
        
        self.advertiser = MCNearbyServiceAdvertiser(peer: peerID, discoveryInfo: discoveryInfo, serviceType: serviceType);
        self.advertiser?.delegate = self
        
        self.advertiser?.startAdvertisingPeer()
        
        return peerID
    }
    
    public func stopAdvertise() {
        self.advertiser?.stopAdvertisingPeer()
    }
    
    public func startDiscovery(_ name: String) -> MCPeerID {
        let peerID = MCPeerID(displayName: name)
        self.myPeerId = peerID
        let serviceType = InfoPlistParser.getServiceType()
        
        self.discovery = MCNearbyServiceBrowser(peer: peerID, serviceType: serviceType)
        self.discovery?.delegate = self
        
        self.discovery?.startBrowsingForPeers()
        
        return peerID
    }
    
    public func stopDiscovery() {
        self.discovery?.stopBrowsingForPeers()
    }
    
    public func requestConnection(_ name: String, toPeer advertisePeerId: String, timeout timeoutInSeconds: NSNumber?) throws {
        guard let myPeerId = self.myPeerId else {
            throw NSError(domain: "ExpoNearbyConnections", code: 0, userInfo: [NSLocalizedDescriptionKey: "RequestConnection: Not found my peer."])
        }
        
        let contextString = "{name: \(name), peerId: \(String(myPeerId.hash))}".data(using: .utf8)
        let timeout = TimeInterval(truncating: timeoutInSeconds ?? 30)
        
        guard let targetPeerId = self.discoveredPeers.first(where: {
            $0.key == advertisePeerId
        })?.value else {
            throw NSError(domain: "ExpoNearbyConnections", code: 0, userInfo: [NSLocalizedDescriptionKey: "RequestConnection: Not found target peer."])
        }
        
        self.session = MCSession(peer: myPeerId, securityIdentity: nil, encryptionPreference: .required)
        self.session?.delegate = self
        
        self.discovery?.invitePeer(targetPeerId, to: self.session!, withContext: contextString, timeout: timeout)
    }
    
    public func acceptConnection(toDiscoveryPeer peerId: String) throws {
        guard let invitedPeer = self.invitedPeers.first(where: {
            $0.key == peerId
        })?.value else {
            throw NSError(domain: "ExpoNearbyConnections", code: 0, userInfo: [NSLocalizedDescriptionKey: "AcceptConnection: Not found target peer."])
        }
        
        guard let myPeerId = self.myPeerId else {
            throw NSError(domain: "ExpoNearbyConnections", code: 0, userInfo: [NSLocalizedDescriptionKey: "AcceptConnection: Not found my peer."])
        }
        
        self.session = MCSession(peer: myPeerId, securityIdentity: nil, encryptionPreference: .required)
        self.session?.delegate = self
        
        invitedPeer.invitationHandler(true, self.session)
    }
    
    public func rejectConnection(toDiscoveryPeer peerId: String) throws {
        guard let invitedPeer = self.invitedPeers.first(where: {
            $0.key == peerId
        })?.value else {
            throw NSError(domain: "ExpoNearbyConnections", code: 0, userInfo: [NSLocalizedDescriptionKey: "RejectConnection: Not found target peer."])
        }
        
        guard let myPeerId = self.myPeerId else {
            throw NSError(domain: "ExpoNearbyConnections", code: 0, userInfo: [NSLocalizedDescriptionKey: "RejectConnection: Not found my peer."])
        }
        
        self.session = MCSession(peer: myPeerId, securityIdentity: nil, encryptionPreference: .required)
        self.session?.delegate = self
        
        invitedPeer.invitationHandler(false, self.session)
    }
    
    public func disconnect(toPeer peerId: String) {
        self.session?.disconnect()
    }
    
    public func sendText(toPeer peerId: String, _ text: String) throws {
        guard let data = text.data(using: .utf8) else {
            throw NSError(domain: "ExpoNearbyConnections", code: 0, userInfo: [NSLocalizedDescriptionKey: "SendText: Invalid text data."])
        }
        
        guard let targetPeerId = self.invitedPeers.first(where: {
            $0.key == peerId
        })?.value.peerId else {
            throw NSError(domain: "ExpoNearbyConnections", code: 0, userInfo: [NSLocalizedDescriptionKey: "SendText: Not found target peer."])
        }
        
        try self.session?.send(data, toPeers: [targetPeerId], with: .reliable)
    }
}

extension MultipeerConnectivityModule: MCNearbyServiceAdvertiserDelegate {
    public func advertiser(_ advertiser: MCNearbyServiceAdvertiser, didNotStartAdvertisingPeer error: any Error) {
        print("Advertiser Events: didNotStartAdvertisingPeer", error)
    }
    
    public func advertiser(_ advertiser: MCNearbyServiceAdvertiser, didReceiveInvitationFromPeer peerID: MCPeerID, withContext context: Data?, invitationHandler: @escaping (Bool, MCSession?) -> Void) {
        let peerIdHash = String(peerID.hash)
        
        self.invitedPeers[peerIdHash] = (peerId: peerID, invitationHandler: invitationHandler)
        self.callbackDelegate.onInvitationReceived(fromPeerId: peerIdHash, fromPeerName: peerID.displayName)
    }
}

extension MultipeerConnectivityModule: MCNearbyServiceBrowserDelegate {
    public func browser(_ browser: MCNearbyServiceBrowser, didNotStartBrowsingForPeers error: any Error) {
        print("Browser Events: didNotStartBrowsingForPeers", error)
    }
    
    public func browser(_ browser: MCNearbyServiceBrowser, foundPeer peerID: MCPeerID, withDiscoveryInfo info: [String : String]?) {
        let peerIdHash = String(peerID.hash)
        
        self.discoveredPeers[peerIdHash] = peerID
        self.callbackDelegate.onPeerFound(fromPeerId: peerIdHash, fromPeerName: peerID.displayName)
    }
    
    public func browser(_ browser: MCNearbyServiceBrowser, lostPeer peerID: MCPeerID) {
        let peerIdHash = String(peerID.hash)
        
        self.discoveredPeers.removeValue(forKey: peerIdHash)
        self.callbackDelegate.onPeerLost(fromPeerId: peerIdHash)
    }
}

extension MultipeerConnectivityModule: MCSessionDelegate {
    public func session(_ session: MCSession, peer peerID: MCPeerID, didChange state: MCSessionState) {
        let peerIdHash = String(peerID.hash)
        
        switch state {
        case .connected:
            self.callbackDelegate.onConnected(fromPeerId: peerIdHash, fromPeerName: peerID.displayName)
        case .notConnected:
            self.callbackDelegate.onDisconnected(fromPeerId: peerIdHash)
        case .connecting:
            // TODO: Implement connecting
            break
        @unknown default:
            // TODO: Implement unknown
            break
        }
    }
    
    public func session(_ session: MCSession, didReceive data: Data, fromPeer peerID: MCPeerID) {
        let peerIdHash = String(peerID.hash)
        let text = String(decoding: data, as: UTF8.self)
        
        self.callbackDelegate.onTextReceived(fromPeerId: peerIdHash, payload: text)
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
