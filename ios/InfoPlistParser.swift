//
//  InfoPlistParser.swift
//  ExpoNearbyConnections
//
//  Created by Puguh Sudarma on 12/09/24.
//

import Foundation

struct InfoPlistParser {
    static func parse() -> Dictionary<String, AnyObject>? {
        guard let path = Bundle.main.path(forResource: "Info", ofType: "plist") else {
            return nil
        }
        
        let url = URL(fileURLWithPath: path)
        
        guard let plistDictionary = NSDictionary(contentsOf: url) as? Dictionary<String, AnyObject> else {
            return nil
        }
        
        return plistDictionary
    }
    
    static func getServiceType() -> String {
        let plist = InfoPlistParser.parse()
        
        let bundleName = plist?["CFBundleName"] as? String ?? ""
        
        // NSBonjourServices is an array of string
        guard let services = plist?["NSBonjourServices"] as? [String] else {
            return bundleName
        }
        
        // need to use only services name
        // example: _serviceName._tcp only using the serviceName
        guard let serviceName = InfoPlistParser.extractServiceName(from: services.first) else {
            return bundleName
        }
        
        return serviceName
    }
    
    static func extractServiceName(from serviceString: String?) -> String? {
        // Ensure the serviceString is not nil and contains an underscore and period
        guard let serviceString = serviceString,
              let lastUnderscoreIndex = serviceString.lastIndex(of: "_") else {
            return nil
        }
        
        // Find the first period after the last underscore
        if let periodIndex = serviceString[lastUnderscoreIndex...].firstIndex(of: ".") {
            // Extract the part between the last underscore and the first period
            let serviceName = serviceString[serviceString.index(after: lastUnderscoreIndex)..<periodIndex]
            return String(serviceName)
        }
        
        return nil
    }
}
