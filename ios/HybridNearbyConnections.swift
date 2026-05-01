import NitroModules

public class HybridNearbyConnections: HybridNearbyConnectionsSpec_base, HybridNearbyConnectionsSpec_protocol {

    private var multipeerModule = MultipeerConnectivityModule()

    // MARK: - Event callbacks

    public var onPeerFound: ((_ peerId: String, _ name: String) -> Void)?
    public var onPeerLost: ((_ peerId: String) -> Void)?
    public var onInvitationReceived: ((_ peerId: String, _ name: String) -> Void)?
    public var onConnected: ((_ peerId: String, _ name: String) -> Void)?
    public var onDisconnected: ((_ peerId: String) -> Void)?
    public var onTextReceived: ((_ peerId: String, _ text: String) -> Void)?

    public override init() {
        super.init()
        multipeerModule.delegate = self
    }

    // MARK: - Methods

    public func isPlayServicesAvailable() throws -> Promise<Bool> {
        return Promise.resolved(withResult: true)
    }

    public func startAdvertise(name: String, strategy: Strategy?) throws -> Promise<String> {
        // strategy is ignored on iOS — MultipeerConnectivity has no equivalent concept
        let peerId = multipeerModule.startAdvertise(name)
        return Promise.resolved(withResult: peerId)
    }

    public func stopAdvertise() throws -> Promise<Void> {
        multipeerModule.stopAdvertise()
        return Promise.resolved()
    }

    public func startDiscovery(name: String, strategy: Strategy?) throws -> Promise<String> {
        // strategy is ignored on iOS — MultipeerConnectivity has no equivalent concept
        let peerId = multipeerModule.startDiscovery(name)
        return Promise.resolved(withResult: peerId)
    }

    public func stopDiscovery() throws -> Promise<Void> {
        multipeerModule.stopDiscovery()
        return Promise.resolved()
    }

    public func requestConnection(advertisePeerId: String) throws -> Promise<Void> {
        try multipeerModule.requestConnection(to: advertisePeerId)
        return Promise.resolved()
    }

    public func acceptConnection(targetPeerId: String) throws -> Promise<Void> {
        try multipeerModule.acceptConnection(to: targetPeerId)
        return Promise.resolved()
    }

    public func rejectConnection(targetPeerId: String) throws -> Promise<Void> {
        try multipeerModule.rejectConnection(to: targetPeerId)
        return Promise.resolved()
    }

    public func disconnect(targetPeerId: String?) throws -> Promise<Void> {
        // targetPeerId is ignored on iOS — MultipeerConnectivity disconnects the entire session
        multipeerModule.disconnect()
        return Promise.resolved()
    }

    public func sendText(targetPeerId: String, text: String) throws -> Promise<Void> {
        try multipeerModule.sendText(to: targetPeerId, payload: text)
        return Promise.resolved()
    }
}

// MARK: - NearbyConnectionCallbackDelegate

extension HybridNearbyConnections: NearbyConnectionCallbackDelegate {
    func onPeerFound(fromPeerId peerId: String, fromPeerName name: String) {
        self.onPeerFound?(peerId, name)
    }

    func onPeerLost(fromPeerId peerId: String) {
        self.onPeerLost?(peerId)
    }

    func onInvitationReceived(fromPeerId peerId: String, fromPeerName name: String) {
        self.onInvitationReceived?(peerId, name)
    }

    func onConnected(fromPeerId peerId: String, fromPeerName name: String) {
        self.onConnected?(peerId, name)
    }

    func onDisconnected(fromPeerId peerId: String) {
        self.onDisconnected?(peerId)
    }

    func onTextReceived(fromPeerId peerId: String, payload text: String) {
        self.onTextReceived?(peerId, text)
    }
}
