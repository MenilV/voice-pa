import Foundation
import React
import VoicePACore

@objc(RustRecorder)
class RustRecorder: NSObject {
  private var recorder: MobileRecorder?

  @objc
  static func requiresMainQueueSetup() -> Bool {
    return false
  }

  @objc
  func start(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    if recorder == nil {
      recorder = MobileRecorder()
    }
    
    Task {
      do {
        await recorder?.start()
        resolve(nil)
      } catch {
        reject("ERROR", "Failed to start recording", error)
      }
    }
  }

  @objc
  func stop(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    Task {
      do {
        if let audioData = await recorder?.stop() {
          resolve(audioData)
        } else {
          reject("ERROR", "Recorder not initialized", nil)
        }
      } catch {
        reject("ERROR", "Failed to stop recording", error)
      }
    }
  }

  @objc
  func isRecording(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    resolve(recorder?.isRecording() ?? false)
  }

  @objc
  func duration(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    resolve(recorder?.duration() ?? 0.0)
  }
}
