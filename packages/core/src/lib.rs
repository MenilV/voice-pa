pub mod audio;
pub mod transcription;
pub mod storage;
pub mod ffi;
pub mod utils;

// Re-export commonly used types
pub use audio::{AudioRecorder, AudioConfig, AudioFormat};
pub use transcription::{WhisperClient, Transcript, TranscriptSegment};
pub use utils::error::{Result, VoicePAError};
pub use ffi::mobile::{MobileRecorder, MobileError};

// UniFFI scaffolding generated from voice_pa.udl
uniffi::include_scaffolding!("voice_pa");

#[cfg(test)]
mod tests {
    #[test]
    fn test_library_loads() {
        // Basic smoke test
        assert!(true);
    }
}
