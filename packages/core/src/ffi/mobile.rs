// Mobile FFI bindings using UniFFI
// This file will be processed by UniFFI to generate Swift/Kotlin bindings

// Note: UniFFI bindings are defined in the .udl file
// This module provides Rust implementations that UniFFI will expose

use crate::audio::{AudioRecorder, AudioConfig};
use crate::transcription::WhisperClient;
use crate::utils::error::Result;

/// Simplified interface for mobile platforms
pub struct MobileRecorder {
    recorder: AudioRecorder,
}

impl MobileRecorder {
    pub fn new() -> Result<Self> {
        Ok(Self {
            recorder: AudioRecorder::new()?,
        })
    }

    pub async fn start(&mut self) -> Result<()> {
        self.recorder.start_recording().await
    }

    pub async fn stop(&mut self) -> Result<Vec<f32>> {
        self.recorder.stop_recording().await
    }

    pub fn is_recording(&self) -> bool {
        self.recorder.is_recording()
    }

    pub fn duration(&self) -> f64 {
        self.recorder.duration()
    }
}

// UniFFI will generate bindings for these types automatically
