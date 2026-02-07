package com.voicepa

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.Arguments
import uniffi.voice_pa_core.MobileRecorder
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

class RustRecorderModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    private var recorder: MobileRecorder? = null
    private val scope = CoroutineScope(Dispatchers.Main)

    override fun getName(): String {
        return "RustRecorder"
    }

    @ReactMethod
    fun start(promise: Promise) {
        if (recorder == null) {
            try {
                recorder = MobileRecorder()
            } catch (e: Exception) {
                promise.reject("ERROR", "Failed to initialize recorder: ${e.message}")
                return
            }
        }

        scope.launch {
            try {
                recorder?.start()
                promise.resolve(null)
            } catch (e: Exception) {
                promise.reject("ERROR", "Failed to start recording: ${e.message}")
            }
        }
    }

    @ReactMethod
    fun stop(promise: Promise) {
        scope.launch {
            try {
                val audioData = recorder?.stop()
                if (audioData != null) {
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
    fun isRecording(promise: Promise) {
        promise.resolve(recorder?.isRecording() ?: false)
    }

    @ReactMethod
    fun duration(promise: Promise) {
        promise.resolve(recorder?.duration() ?: 0.0)
    }
}
