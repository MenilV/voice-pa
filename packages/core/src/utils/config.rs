use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Config {
    /// OpenAI API key for Whisper
    pub openai_api_key: Option<String>,
    
    /// Sample rate for audio recording (default: 16000 Hz)
    pub sample_rate: u32,
    
    /// Number of audio channels (default: 1 for mono)
    pub channels: u16,
    
    /// Audio format (default: WAV)
    pub audio_format: String,
    
    /// Enable offline mode
    pub offline_mode: bool,
    
    /// Local storage path for offline recordings
    pub storage_path: Option<String>,
}

impl Default for Config {
    fn default() -> Self {
        Self {
            openai_api_key: None,
            sample_rate: 16000,
            channels: 1,
            audio_format: "wav".to_string(),
            offline_mode: false,
            storage_path: None,
        }
    }
}

impl Config {
    pub fn new() -> Self {
        Self::default()
    }

    pub fn with_api_key(mut self, api_key: String) -> Self {
        self.openai_api_key = Some(api_key);
        self
    }

    pub fn with_sample_rate(mut self, sample_rate: u32) -> Self {
        self.sample_rate = sample_rate;
        self
    }

    pub fn with_channels(mut self, channels: u16) -> Self {
        self.channels = channels;
        self
    }

    pub fn with_offline_mode(mut self, enabled: bool) -> Self {
        self.offline_mode = enabled;
        self
    }

    pub fn with_storage_path(mut self, path: String) -> Self {
        self.storage_path = Some(path);
        self
    }
}
