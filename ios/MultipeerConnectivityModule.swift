import MultipeerConnectivity

public class MultipeerConnectivityModule: NSObject {
    private var myPeerId: MCPeerID?
    private var advertiser: MCNearbyServiceAdvertiser?
    private var discovery: MCNearbyServiceBrowser?
    private var session: MCSession?

    // Serial queue protecting all dictionary access — MC callbacks fire on background queues
    // while JS calls come from the JS thread, requiring explicit synchronization.
    private let peerQueue = DispatchQueue(label: "com.exponearbyconnections.peers")
    private var discoveredPeers: [String: MCPeerID] = [:]
    private var invitedPeers: [String: (peerId: MCPeerID, invitationHandler: (Bool, MCSession?) -> Void)] = [:]
    private var connectedPeers: [String: MCPeerID] = [:]

    weak var delegate: NearbyConnectionCallbackDelegate?

    deinit {
        self.advertiser?.stopAdvertisingPeer()
        self.discovery?.stopBrowsingForPeers()
        self.session?.disconnect()
    }

    public func startAdvertise(_ name: String) -> String {
        // Tear down previous state before re-initializing
        self.advertiser?.stopAdvertisingPeer()
        self.session?.disconnect()
        self.session = nil

        let peerId = MCPeerID(displayName: name)
        self.myPeerId = peerId
        let discoveryInfo: [String: String] = [
            "incomingPeerId": String(peerId.hash),
            "incomingName": name
        ]
        let serviceType = InfoPlistParser.getServiceType()

        self.advertiser = MCNearbyServiceAdvertiser(peer: peerId, discoveryInfo: discoveryInfo, serviceType: serviceType)
        self.advertiser?.delegate = self

        self.session = MCSession(peer: peerId, securityIdentity: nil, encryptionPreference: .required)
        self.session?.delegate = self

        self.advertiser?.startAdvertisingPeer()

        return String(peerId.hash)
    }

    public func stopAdvertise() {
        self.advertiser?.stopAdvertisingPeer()
        self.advertiser = nil
        peerQueue.sync { self.invitedPeers.removeAll() }
    }

    public func startDiscovery(_ name: String) -> String {
        // Tear down previous state before re-initializing
        self.discovery?.stopBrowsingForPeers()
        self.session?.disconnect()
        self.session = nil

        let peerId = MCPeerID(displayName: name)
        self.myPeerId = peerId
        let serviceType = InfoPlistParser.getServiceType()

        self.discovery = MCNearbyServiceBrowser(peer: peerId, serviceType: serviceType)
        self.discovery?.delegate = self

        self.session = MCSession(peer: peerId, securityIdentity: nil, encryptionPreference: .required)
        self.session?.delegate = self

        self.discovery?.startBrowsingForPeers()

        return String(peerId.hash)
    }

    public func stopDiscovery() {
        self.discovery?.stopBrowsingForPeers()
        self.discovery = nil
        peerQueue.sync { self.discoveredPeers.removeAll() }
    }

    public func requestConnection(to advertisePeerId: String) throws {
        guard let myPeerId = self.myPeerId else {
            throw NSError(domain: "ExpoNearbyConnections", code: 0,
                userInfo: [NSLocalizedDescriptionKey: "RequestConnection: Not found my peer."])
        }

        guard let session = self.session else {
            throw NSError(domain: "ExpoNearbyConnections", code: 0,
                userInfo: [NSLocalizedDescriptionKey: "RequestConnection: No active session. Call startDiscovery first."])
        }

        let contextObj: [String: String] = [
            "incomingName": myPeerId.displayName,
            "incomingPeerId": String(myPeerId.hash)
        ]
        let contextData = try? JSONSerialization.data(withJSONObject: contextObj)
        let timeout = TimeInterval(truncating: REQUEST_CONNECTION_TIMEOUT)

        let targetPeer = peerQueue.sync { self.discoveredPeers[advertisePeerId] }
        guard let targetPeerId = targetPeer else {
            throw NSError(domain: "ExpoNearbyConnections", code: 0,
                userInfo: [NSLocalizedDescriptionKey: "RequestConnection: Not found target peer."])
        }

        self.discovery?.invitePeer(targetPeerId, to: session, withContext: contextData, timeout: timeout)
    }

    public func acceptConnection(to peerId: String) throws {
        // removeValue is atomic within peerQueue — releases the closure after use
        let invitedPeer = peerQueue.sync { self.invitedPeers.removeValue(forKey: peerId) }
        guard let invitedPeer = invitedPeer else {
            throw NSError(domain: "ExpoNearbyConnections", code: 0,
                userInfo: [NSLocalizedDescriptionKey: "AcceptConnection: Not found target peer."])
        }
        invitedPeer.invitationHandler(true, self.session)
    }

    public func rejectConnection(to peerId: String) throws {
        let invitedPeer = peerQueue.sync { self.invitedPeers.removeValue(forKey: peerId) }
        guard let invitedPeer = invitedPeer else {
            throw NSError(domain: "ExpoNearbyConnections", code: 0,
                userInfo: [NSLocalizedDescriptionKey: "RejectConnection: Not found target peer."])
        }
        invitedPeer.invitationHandler(false, self.session)
    }

    public func disconnect() {
        self.advertiser?.stopAdvertisingPeer()
        self.advertiser = nil
        self.discovery?.stopBrowsingForPeers()
        self.discovery = nil
        self.session?.disconnect()
        self.session = nil
    }

    public func sendText(to peerId: String, payload text: String) throws {
        guard let data = text.data(using: .utf8) else {
            throw NSError(domain: "ExpoNearbyConnections", code: 0,
                userInfo: [NSLocalizedDescriptionKey: "SendText: Invalid text data."])
        }

        let targetPeer = peerQueue.sync { self.connectedPeers[peerId] }
        guard let targetPeerId = targetPeer else {
            throw NSError(domain: "ExpoNearbyConnections", code: 0,
                userInfo: [NSLocalizedDescriptionKey: "SendText: Not found target peer."])
        }

        try self.session?.send(data, toPeers: [targetPeerId], with: .reliable)
    }
}

extension MultipeerConnectivityModule: MCNearbyServiceAdvertiserDelegate {
    public func advertiser(_ advertiser: MCNearbyServiceAdvertiser, didNotStartAdvertisingPeer error: any Error) {
        print("Advertiser Events: didNotStartAdvertisingPeer", error)
    }

    public func advertiser(
        _ advertiser: MCNearbyServiceAdvertiser,
        didReceiveInvitationFromPeer peerID: MCPeerID,
        withContext context: Data?,
        invitationHandler: @escaping (Bool, MCSession?) -> Void
    ) {
        let peerIdHash = String(peerID.hash)
        peerQueue.sync {
            self.invitedPeers[peerIdHash] = (peerId: peerID, invitationHandler: invitationHandler)
        }
        self.delegate?.onInvitationReceived(fromPeerId: peerIdHash, fromPeerName: peerID.displayName)
    }
}

extension MultipeerConnectivityModule: MCNearbyServiceBrowserDelegate {
    public func browser(_ browser: MCNearbyServiceBrowser, didNotStartBrowsingForPeers error: any Error) {
        print("Browser Events: didNotStartBrowsingForPeers", error)
    }

    public func browser(
        _ browser: MCNearbyServiceBrowser,
        foundPeer peerID: MCPeerID,
        withDiscoveryInfo info: [String: String]?
    ) {
        let peerIdHash = String(peerID.hash)
        peerQueue.sync {
            self.discoveredPeers[peerIdHash] = peerID
        }
        self.delegate?.onPeerFound(fromPeerId: peerIdHash, fromPeerName: peerID.displayName)
    }

    public func browser(_ browser: MCNearbyServiceBrowser, lostPeer peerID: MCPeerID) {
        let peerIdHash = String(peerID.hash)
        peerQueue.sync {
            self.discoveredPeers.removeValue(forKey: peerIdHash)
        }
        self.delegate?.onPeerLost(fromPeerId: peerIdHash)
    }
}

extension MultipeerConnectivityModule: MCSessionDelegate {
    public func session(_ session: MCSession, peer peerID: MCPeerID, didChange state: MCSessionState) {
        let peerIdHash = String(peerID.hash)
        switch state {
        case .connected:
            peerQueue.sync {
                self.connectedPeers[peerIdHash] = peerID
            }
            self.delegate?.onConnected(fromPeerId: peerIdHash, fromPeerName: peerID.displayName)
        case .notConnected:
            peerQueue.sync {
                self.connectedPeers.removeValue(forKey: peerIdHash)
            }
            self.delegate?.onDisconnected(fromPeerId: peerIdHash)
        case .connecting:
            print("Session Events: connecting with peer \(peerID.displayName)")
        @unknown default:
            print("Session Events: unknown with peer \(peerID.displayName) and state \(state.rawValue)")
        }
    }

    public func session(_ session: MCSession, didReceive data: Data, fromPeer peerID: MCPeerID) {
        let peerIdHash = String(peerID.hash)
        guard let text = String(bytes: data, encoding: .utf8) else {
            print("Session Events: received non-UTF8 data from \(peerID.displayName)")
            return
        }
        self.delegate?.onTextReceived(fromPeerId: peerIdHash, payload: text)
    }

    public func session(
        _ session: MCSession,
        didReceive stream: InputStream,
        withName streamName: String,
        fromPeer peerID: MCPeerID
    ) {
        // TODO: Implement receive stream
    }

    public func session(
        _ session: MCSession,
        didStartReceivingResourceWithName resourceName: String,
        fromPeer peerID: MCPeerID,
        with progress: Progress
    ) {
        // TODO: Implement receive resource progress
    }

    public func session(
        _ session: MCSession,
        didReceiveCertificate certificate: [Any]?,
        fromPeer peerID: MCPeerID,
        certificateHandler: @escaping (Bool) -> Void
    ) {
        print("Session Events: didReceiveCertificate with peer \(peerID.displayName)")
        certificateHandler(true)
    }

    public func session(
        _ session: MCSession,
        didFinishReceivingResourceWithName resourceName: String,
        fromPeer peerID: MCPeerID,
        at localURL: URL?,
        withError error: (any Error)?
    ) {
        print("Session Events: didFinishReceivingResourceWithName with error \(String(describing: error))")
    }
}
