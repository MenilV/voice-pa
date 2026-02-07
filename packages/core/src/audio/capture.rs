use cpal::traits::{DeviceTrait, HostTrait, StreamTrait};
use cpal::{Device, Stream, StreamConfig};
use std::sync::{Arc, Mutex};
use tokio::sync::mpsc;
use crate::utils::error::{Result, VoicePAError};

#[derive(Debug, Clone, Copy)]
pub enum AudioFormat {
    Wav,
    Mp3,
    Flac,
}

#[derive(Debug, Clone)]
pub struct AudioConfig {
    pub sample_rate: u32,
    pub channels: u16,
    pub format: AudioFormat,
}

impl Default for AudioConfig {
    fn default() -> Self {
        Self {
            sample_rate: 16000,
            channels: 1,
            format: AudioFormat::Wav,
        }
    }
}

pub struct AudioRecorder {
    config: AudioConfig,
    device: Device,
    stream: Option<Stream>,
    buffer: Arc<Mutex<Vec<f32>>>,
    is_recording: Arc<Mutex<bool>>,
}

impl AudioRecorder {
    /// Create a new AudioRecorder with default configuration
    pub fn new() -> Result<Self> {
        Self::with_config(AudioConfig::default())
    }

    /// Create a new AudioRecorder with custom configuration
    pub fn with_config(config: AudioConfig) -> Result<Self> {
        let host = cpal::default_host();
        let device = host
            .default_input_device()
            .ok_or_else(|| VoicePAError::AudioDevice("No input device available".to_string()))?;

        log::info!("Using audio device: {}", device.name().unwrap_or_default());

        Ok(Self {
            config,
            device,
            stream: None,
            buffer: Arc::new(Mutex::new(Vec::new())),
            is_recording: Arc::new(Mutex::new(false)),
        })
    }

    /// Start recording audio
    pub async fn start_recording(&mut self) -> Result<()> {
        let mut is_recording = self.is_recording.lock().unwrap();
        if *is_recording {
            return Err(VoicePAError::AudioStream("Already recording".to_string()));
        }

        // Clear previous buffer
        self.buffer.lock().unwrap().clear();

        let stream_config = StreamConfig {
            channels: self.config.channels,
            sample_rate: cpal::SampleRate(self.config.sample_rate),
            buffer_size: cpal::BufferSize::Default,
        };

        let buffer = Arc::clone(&self.buffer);
        let err_fn = |err| {
            log::error!("Audio stream error: {}", err);
        };

        let stream = self.device.build_input_stream(
            &stream_config,
            move |data: &[f32], _: &cpal::InputCallbackInfo| {
                let mut buffer = buffer.lock().unwrap();
                buffer.extend_from_slice(data);
            },
            err_fn,
            None,
        )?;

        stream.play()?;
        self.stream = Some(stream);
        *is_recording = true;

        log::info!("Recording started");
        Ok(())
    }

    /// Stop recording and return the audio data
    pub async fn stop_recording(&mut self) -> Result<Vec<f32>> {
        let mut is_recording = self.is_recording.lock().unwrap();
        if !*is_recording {
            return Err(VoicePAError::AudioStream("Not recording".to_string()));
        }

        // Stop the stream
        if let Some(stream) = self.stream.take() {
            drop(stream);
        }

        *is_recording = false;

        // Get the recorded data
        let buffer = self.buffer.lock().unwrap();
        let data = buffer.clone();

        log::info!("Recording stopped. Captured {} samples", data.len());
        Ok(data)
    }

    /// Check if currently recording
    pub fn is_recording(&self) -> bool {
        *self.is_recording.lock().unwrap()
    }

    /// Get the current configuration
    pub fn config(&self) -> &AudioConfig {
        &self.config
    }

    /// Get the duration of recorded audio in seconds
    pub fn duration(&self) -> f64 {
        let buffer = self.buffer.lock().unwrap();
        let samples = buffer.len() as f64;
        samples / (self.config.sample_rate as f64 * self.config.channels as f64)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_audio_config_default() {
        let config = AudioConfig::default();
        assert_eq!(config.sample_rate, 16000);
        assert_eq!(config.channels, 1);
    }

    #[tokio::test]
    async fn test_recorder_creation() {
        // This test may fail if no audio device is available
        match AudioRecorder::new() {
            Ok(recorder) => {
                assert!(!recorder.is_recording());
                assert_eq!(recorder.config().sample_rate, 16000);
            }
            Err(e) => {
                println!("Skipping test - no audio device: {}", e);
            }
        }
    }
}
