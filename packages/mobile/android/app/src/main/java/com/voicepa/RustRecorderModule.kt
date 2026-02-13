package com.voicepa

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import uniffi.voice_pa_core.MobileRecorder
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import java.io.File
import android.media.MediaPlayer

class RustRecorderModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    private var recorder: MobileRecorder? = null
    private var lastAudioData: List<Float>? = null
    private val scope = CoroutineScope(Dispatchers.Main)
    private var mediaPlayer: MediaPlayer? = null

    private fun uBytesToByteArray(data: List<UByte>): ByteArray {
        val bytes = ByteArray(data.size)
        data.forEachIndexed { index, value ->
            bytes[index] = value.toByte()
        }
        return bytes
    }

    private fun byteArrayToUBytes(data: ByteArray): List<UByte> {
        val list = ArrayList<UByte>(data.size)
        for (byte in data) {
            list.add(byte.toUByte())
        }
        return list
    }

    override fun getName(): String {
        return "RustRecorder"
    }

    @ReactMethod
    fun start(promise: Promise) {
        scope.launch(Dispatchers.IO) {
            try {
                if (recorder == null) {
                    recorder = MobileRecorder()
                }
                recorder?.start()
                promise.resolve(null)
            } catch (e: Exception) {
                promise.reject("ERROR", "Failed to start recording: ${e.message}")
            }
        }
    }

    @ReactMethod
    fun stop(promise: Promise) {
        scope.launch(Dispatchers.IO) {
            try {
                val audioData = recorder?.stop()
                if (audioData != null) {
                    lastAudioData = audioData
                    val array = Arguments.createArray()
                    for (sample in audioData) {
                        array.pushDouble(sample.toDouble())
                    }
                    promise.resolve(array)
                } else {
                    promise.reject("ERROR", "Recorder not initialized")
                }
            } catch (e: Exception) {
                promise.reject("ERROR", "Failed to stop recording: ${e.message}")
            }
        }
    }

    @ReactMethod
    fun transcribe(promise: Promise) {
        scope.launch(Dispatchers.IO) {
            try {
                val samples = lastAudioData
                if (samples != null && recorder != null) {
                    val text = recorder!!.transcribe(samples)
                    promise.resolve(text)
                } else {
                    promise.reject("ERROR", "No audio data to transcribe")
                }
            } catch (e: Exception) {
                promise.reject("ERROR", "Transcription failed: ${e.message}")
            }
        }
    }

    @ReactMethod
    fun stopAndStore(promise: Promise) {
        scope.launch(Dispatchers.IO) {
            try {
                val recorder = recorder ?: run {
                    promise.reject("ERROR", "Recorder not initialized")
                    return@launch
                }

                val wavData = recorder.stopAndGetWav()
                val bytes = uBytesToByteArray(wavData)

                val recordingsDir = File(reactApplicationContext.filesDir, "recordings")
                if (!recordingsDir.exists()) {
                    recordingsDir.mkdirs()
                }
                val file = File(recordingsDir, "voicepa_${System.currentTimeMillis()}.wav")
                file.writeBytes(bytes)

                val result = Arguments.createMap()
                result.putString("audioFilePath", file.absolutePath)
                result.putDouble("duration", recorder.duration())
                promise.resolve(result)
            } catch (e: Exception) {
                promise.reject("ERROR", "Failed to store recording: ${e.message}")
            }
        }
    }

    @ReactMethod
    fun transcribeFile(audioFilePath: String, language: String?, promise: Promise) {
        scope.launch(Dispatchers.IO) {
            try {
                val recorder = recorder ?: MobileRecorder().also { recorder = it }
                val file = File(audioFilePath)
                if (!file.exists()) {
                    promise.reject("ERROR", "Audio file not found")
                    return@launch
                }
                val wavBytes = byteArrayToUBytes(file.readBytes())
                val transcriptJson = recorder.transcribeWav(wavBytes, language ?: "")
                promise.resolve(transcriptJson)
            } catch (e: Exception) {
                promise.reject("ERROR", "Transcription failed: ${e.message}")
            }
        }
    }

    @ReactMethod
    fun listRecordings(promise: Promise) {
        try {
            val recordingsDir = File(reactApplicationContext.filesDir, "recordings")
            val result = Arguments.createArray()
            if (recordingsDir.exists()) {
                val files = recordingsDir.listFiles()?.filter { it.extension == "wav" }?.sortedByDescending { it.lastModified() }
                files?.forEach { file ->
                    val entry = Arguments.createMap()
                    entry.putString("audioFilePath", file.absolutePath)
                    entry.putString("fileName", file.name)
                    entry.putDouble("lastModified", file.lastModified().toDouble())
                    entry.putDouble("sizeBytes", file.length().toDouble())
                    result.pushMap(entry)
                }
            }
            promise.resolve(result)
        } catch (e: Exception) {
            promise.reject("ERROR", "Failed to list recordings: ${e.message}")
        }
    }

    @ReactMethod
    fun isRecording(promise: Promise) {
        promise.resolve(recorder?.isRecording() ?: false)
    }

    @ReactMethod
    fun duration(promise: Promise) {
        promise.resolve(recorder?.duration() ?: 0.0)
    }

    @ReactMethod
    fun playAudio(filePath: String, promise: Promise) {
        try {
            if (mediaPlayer != null) {
                mediaPlayer?.release()
                mediaPlayer = null
            }
            mediaPlayer = MediaPlayer().apply {
                setDataSource(filePath)
                prepare()
                start()
            }
            promise.resolve(null)
        } catch (e: Exception) {
            promise.reject("ERROR", "Failed to play audio: ${e.message}")
        }
    }

    @ReactMethod
    fun pauseAudio(promise: Promise) {
        try {
            mediaPlayer?.pause()
            promise.resolve(null)
        } catch (e: Exception) {
            promise.reject("ERROR", "Failed to pause audio: ${e.message}")
        }
    }

    @ReactMethod
    fun stopAudio(promise: Promise) {
        try {
            mediaPlayer?.stop()
            mediaPlayer?.release()
            mediaPlayer = null
            promise.resolve(null)
        } catch (e: Exception) {
            promise.reject("ERROR", "Failed to stop audio: ${e.message}")
        }
    }

    @ReactMethod
    fun seekAudio(positionMs: Double, promise: Promise) {
        try {
            mediaPlayer?.seekTo(positionMs.toInt())
            promise.resolve(null)
        } catch (e: Exception) {
            promise.reject("ERROR", "Failed to seek audio: ${e.message}")
        }
    }

    @ReactMethod
    fun getPlaybackPosition(promise: Promise) {
        try {
            val player = mediaPlayer
            val result = Arguments.createMap()
            if (player != null) {
                result.putDouble("position", player.currentPosition.toDouble())
                result.putDouble("duration", player.duration.toDouble())
                result.putBoolean("isPlaying", player.isPlaying)
            } else {
                result.putDouble("position", 0.0)
                result.putDouble("duration", 0.0)
                result.putBoolean("isPlaying", false)
            }
            promise.resolve(result)
        } catch (e: Exception) {
            promise.reject("ERROR", "Failed to get playback position: ${e.message}")
        }
    }
}
