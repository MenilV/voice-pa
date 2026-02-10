// Mobile FFI bindings using UniFFI

use std::sync::Mutex;
use crate::audio::{AudioRecorder, WavEncoder, AudioEncoder};
use crate::transcription::WhisperClient;

/// Called automatically when System.loadLibrary("uniffi_voice_pa_core") is invoked.
/// Initializes the NDK context needed by cpal/Oboe for audio on Android.
#[cfg(target_os = "android")]
#[no_mangle]
pub extern "C" fn JNI_OnLoad(
    vm: *mut std::ffi::c_void,
    _reserved: *mut std::ffi::c_void,
) -> i32 {
    unsafe {
        ndk_context::initialize_android_context(vm, std::ptr::null_mut());
    }
    // Return JNI version 1.6
    0x00010006
}

/// Simplified error type for UniFFI boundary
#[derive(Debug, thiserror::Error)]
pub enum MobileError {
    #[error("{msg}")]
    AudioDevice { msg: String },
    #[error("{msg}")]
    AudioStream { msg: String },
    #[error("{msg}")]
    General { msg: String },
}

impl From<crate::utils::error::VoicePAError> for MobileError {
    fn from(e: crate::utils::error::VoicePAError) -> Self {
        let msg = e.to_string();
        match e {
            crate::utils::error::VoicePAError::AudioDevice(_) => MobileError::AudioDevice { msg },
            crate::utils::error::VoicePAError::AudioStream(_) => MobileError::AudioStream { msg },
            _ => MobileError::General { msg },
        }
    }
}

/// Simplified interface for mobile platforms
pub struct MobileRecorder {
    recorder: Mutex<AudioRecorder>,
}

// SAFETY: AudioRecorder's interior state is protected by Mutex.
// The only !Send part is cpal::Stream (raw pointer handle), which is
// safe to access from any thread as long as it's not used concurrently.
unsafe impl Send for MobileRecorder {}
unsafe impl Sync for MobileRecorder {}

impl MobileRecorder {
    pub fn new() -> Result<Self, MobileError> {
        Ok(Self {
            recorder: Mutex::new(AudioRecorder::new()?),
        })
    }

    pub fn start(&self) -> Result<(), MobileError> {
        let mut recorder = self.recorder.lock().unwrap();
        tokio::runtime::Runtime::new()
            .map_err(|e| MobileError::General { msg: e.to_string() })?
            .block_on(recorder.start_recording())
            .map_err(Into::into)
    }

    pub fn stop(&self) -> Result<Vec<f32>, MobileError> {
        let mut recorder = self.recorder.lock().unwrap();
        tokio::runtime::Runtime::new()
            .map_err(|e| MobileError::General { msg: e.to_string() })?
            .block_on(recorder.stop_recording())
            .map_err(Into::into)
    }

    pub fn is_recording(&self) -> bool {
        let recorder = self.recorder.lock().unwrap();
        recorder.is_recording()
    }

    pub fn duration(&self) -> f64 {
        let recorder = self.recorder.lock().unwrap();
        recorder.duration()
    }

    pub fn transcribe(&self, samples: Vec<f32>) -> Result<String, MobileError> {
        const API_KEY: &str = "";

        let recorder = self.recorder.lock().unwrap();
        let sample_rate = recorder.actual_sample_rate();
        let channels = recorder.actual_channels();
        drop(recorder);

        let wav_data = WavEncoder::new()
            .encode(&samples, sample_rate, channels)
            .map_err(|e| MobileError::General { msg: e.to_string() })?;

        let client = WhisperClient::new(API_KEY.to_string());
        let rt = tokio::runtime::Runtime::new()
            .map_err(|e| MobileError::General { msg: e.to_string() })?;

        let transcript = rt
            .block_on(client.transcribe(&wav_data))
            .map_err(|e| MobileError::General { msg: e.to_string() })?;

        Ok(transcript.text)
    }
}
