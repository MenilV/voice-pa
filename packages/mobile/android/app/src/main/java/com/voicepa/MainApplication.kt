package com.voicepa

import android.app.Application
import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactHost
import com.facebook.react.ReactNativeApplicationEntryPoint.loadReactNative
import com.facebook.react.defaults.DefaultReactHost.getDefaultReactHost

class MainApplication : Application(), ReactApplication {

  override val reactHost: ReactHost by lazy {
    getDefaultReactHost(
      context = applicationContext,
      packageList =
        PackageList(this).packages.apply {
          // Packages that cannot be autolinked yet can be added manually here, for example:
          add(RustRecorderPackage())
        },
    )
  }

  override fun onCreate() {
    super.onCreate()
    // Load native library early — JNI_OnLoad initializes NDK context for cpal/Oboe audio
    System.loadLibrary("uniffi_voice_pa_core")
    loadReactNative(this)
  }
}
