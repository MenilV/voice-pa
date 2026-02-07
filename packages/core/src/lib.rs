pub mod audio;
pub mod transcription;
pub mod storage;
pub mod ffi;
pub mod utils;

// Re-export commonly used types
pub use audio::{AudioRecorder, AudioConfig, AudioFormat};
pub use transcription::{WhisperClient, Transcript, TranscriptSegment};
pub use utils::error::{Result, VoicePAError};

// UniFFI namespace
uniffi::setup_scaffolding!();

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_library_loads() {
        // Basic smoke test
        assert!(true);
    }
}
