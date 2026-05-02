require 'json'

package = JSON.parse(File.read(File.join(__dir__, 'package.json')))

Pod::Spec.new do |s|
  s.name           = 'ExpoNearbyConnections'
  s.version        = package['version']
  s.summary        = package['description']
  s.description    = package['description']
  s.license        = package['license']
  s.author         = package['author']
  s.homepage       = package['homepage']
  s.platforms      = { :ios => '15.1' }
  s.swift_version  = '5.9'
  s.source         = { git: 'https://github.com/puguhsudarma/expo-nearby-connections' }

  s.dependency 'NitroModules'
  s.frameworks = 'MultipeerConnectivity'
  s.prefix_header_contents = "#ifdef __OBJC__\n#import <MultipeerConnectivity/MultipeerConnectivity.h>\n#endif"

  # Pod root is the library root (set by Expo autolinking :path => '../..').
  # All paths are relative to the library root.
  s.source_files = [
    "ios/**/*.{h,m,swift}",
    "nitrogen/generated/shared/**/*.{h,hpp,c,cpp,swift}",
    "nitrogen/generated/ios/**/*.{h,hpp,c,cpp,mm,swift}",
  ]

  s.public_header_files = [
    "nitrogen/generated/shared/**/*.{h,hpp}",
    "nitrogen/generated/ios/ExpoNearbyConnections-Swift-Cxx-Bridge.hpp",
  ]

  s.private_header_files = [
    "nitrogen/generated/ios/c++/**/*.{h,hpp}",
  ]

  s.pod_target_xcconfig = {
    'DEFINES_MODULE' => 'YES',
    'SWIFT_COMPILATION_MODE' => 'wholemodule',
    'CLANG_CXX_LANGUAGE_STANDARD' => 'c++20',
    'SWIFT_OBJC_INTEROP_MODE' => 'objcxx',
    'SWIFT_INSTALL_OBJC_HEADER' => 'NO',
  }
end
