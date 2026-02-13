import Foundation
import React
import VoicePACore
import AVFoundation

@objc(RustRecorder)
class RustRecorder: NSObject {
  private var recorder: MobileRecorder?
  private var audioPlayer: AVAudioPlayer?

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

  @objc
  func stopAndStore(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    Task {
      do {
        guard let recorder = recorder else {
          reject("ERROR", "Recorder not initialized", nil)
          return
        }

        let wavBytes = try recorder.stopAndGetWav()
        let recordingsDir = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask)[0]
          .appendingPathComponent("recordings", isDirectory: true)
        try FileManager.default.createDirectory(at: recordingsDir, withIntermediateDirectories: true)

        let fileURL = recordingsDir.appendingPathComponent("voicepa_\(Int(Date().timeIntervalSince1970 * 1000)).wav")
        try Data(wavBytes).write(to: fileURL, options: .atomic)

        resolve([
          "audioFilePath": fileURL.path,
          "duration": recorder.duration(),
        ])
      } catch {
        reject("ERROR", "Failed to store recording", error)
      }
    }
  }

  @objc
  func transcribeFile(_ audioFilePath: String, language: String?, resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    Task {
      do {
        if recorder == nil {
          recorder = MobileRecorder()
        }
        guard let recorder = recorder else {
          reject("ERROR", "Recorder not initialized", nil)
          return
        }

        let data = try Data(contentsOf: URL(fileURLWithPath: audioFilePath))
        let transcriptJson = try recorder.transcribeWav(wavData: [UInt8](data), language: language ?? "")
        resolve(transcriptJson)
      } catch {
        reject("ERROR", "Transcription failed", error)
      }
    }
  }

  @objc
  func playAudio(_ filePath: String, resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    do {
      let url = URL(fileURLWithPath: filePath)
      audioPlayer = try AVAudioPlayer(contentsOf: url)
      audioPlayer?.play()
      resolve(nil)
    } catch {
      reject("ERROR", "Failed to play audio", error)
    }
  }

  @objc
  func pauseAudio(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    audioPlayer?.pause()
    resolve(nil)
  }

  @objc
  func stopAudio(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    audioPlayer?.stop()
    audioPlayer = nil
    resolve(nil)
  }

  @objc
  func seekAudio(_ positionMs: Double, resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    audioPlayer?.currentTime = positionMs / 1000.0
    resolve(nil)
  }

  @objc
  func getPlaybackPosition(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    if let player = audioPlayer {
      resolve([
        "position": player.currentTime * 1000.0,
        "duration": player.duration * 1000.0,
        "isPlaying": player.isPlaying,
      ])
    } else {
      resolve([
        "position": 0.0,
        "duration": 0.0,
        "isPlaying": false,
      ])
    }
  }
}
