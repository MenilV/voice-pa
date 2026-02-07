use thiserror::Error;

pub type Result<T> = std::result::Result<T, VoicePAError>;

#[derive(Error, Debug)]
pub enum VoicePAError {
    #[error("Audio device error: {0}")]
    AudioDevice(String),

    #[error("Audio stream error: {0}")]
    AudioStream(String),

    #[error("Encoding error: {0}")]
    Encoding(String),

    #[error("Transcription error: {0}")]
    Transcription(String),

    #[error("Network error: {0}")]
    Network(#[from] reqwest::Error),

    #[error("IO error: {0}")]
    Io(#[from] std::io::Error),

    #[error("Serialization error: {0}")]
    Serialization(#[from] serde_json::Error),

    #[error("Configuration error: {0}")]
    Config(String),

    #[error("Storage error: {0}")]
    Storage(String),

    #[error("Unknown error: {0}")]
    Unknown(String),
}

// Implement conversion from cpal errors
impl From<cpal::BuildStreamError> for VoicePAError {
    fn from(err: cpal::BuildStreamError) -> Self {
        VoicePAError::AudioStream(err.to_string())
    }
}

impl From<cpal::PlayStreamError> for VoicePAError {
    fn from(err: cpal::PlayStreamError) -> Self {
        VoicePAError::AudioStream(err.to_string())
    }
}

impl From<cpal::DefaultStreamConfigError> for VoicePAError {
    fn from(err: cpal::DefaultStreamConfigError) -> Self {
        VoicePAError::AudioDevice(err.to_string())
    }
}

impl From<hound::Error> for VoicePAError {
    fn from(err: hound::Error) -> Self {
        VoicePAError::Encoding(err.to_string())
    }
}
