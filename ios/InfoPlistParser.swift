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
        
        return services.first ?? bundleName
    }
}
