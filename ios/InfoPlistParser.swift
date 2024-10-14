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
        
        let bundleName = plist?["CFBundleName"] as? String ?? "unknown-service"
        
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
        guard let serviceString = serviceString else {
            return nil
        }
        
        // Define the pattern to extract text between the first and second underscores
        let pattern = "_(.*?)\\._"
        
        do {
            let regex = try NSRegularExpression(pattern: pattern)
            if let match = regex.firstMatch(in: serviceString, range: NSRange(serviceString.startIndex..., in: serviceString)) {
                if let range = Range(match.range(at: 1), in: serviceString) {
                    return String(serviceString[range])
                }
            }
        } catch {
            print("InfoPlistParser.extractServiceName Error: \(error)")
        }
        
        return nil
    }
}
