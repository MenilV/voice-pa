pub mod client;
pub mod diarization;

pub use client::{WhisperClient, Transcript, TranscriptSegment, Speaker};
pub use diarization::SpeakerDiarizer;
