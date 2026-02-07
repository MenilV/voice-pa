Pod::Spec.new do |s|
  s.name         = "VoicePACore"
  s.version      = "0.1.0"
  s.summary      = "Rust core library for Voice PA"
  s.homepage     = "https://github.com/your-org/voice-pa"
  s.license      = "MIT"
  s.authors      = { "Voice PA Team" => "team@voicepa.com" }
  s.platform     = :ios, "13.4"
  s.source       = { :path => "." }
  s.source_files = "VoicePA/RustCore/voice_pa_core.swift"
  s.vendored_frameworks = "VoicePA/RustCore/VoicePACore.xcframework"
  
  s.dependency "React-Core"
  
  # Ensure the Swift code can find the FFI headers from the framework
  s.pod_target_xcconfig = {
    'SWIFT_INCLUDE_PATHS' => '$(PODS_TARGET_SRCROOT)/VoicePA/RustCore/VoicePACore.xcframework/ios-arm64/Headers $(PODS_TARGET_SRCROOT)/VoicePA/RustCore/VoicePACore.xcframework/ios-arm64-simulator/Headers',
    'OTHER_LDFLAGS' => '-framework VoicePACore'
  }
end
