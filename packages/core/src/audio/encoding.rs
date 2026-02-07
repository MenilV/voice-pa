use hound::{WavSpec, WavWriter};
use std::io::Cursor;
use crate::utils::error::{Result, VoicePAError};

pub trait AudioEncoder {
    fn encode(&self, samples: &[f32], sample_rate: u32, channels: u16) -> Result<Vec<u8>>;
}

pub struct WavEncoder;

impl WavEncoder {
    pub fn new() -> Self {
        Self
    }
}

impl AudioEncoder for WavEncoder {
    fn encode(&self, samples: &[f32], sample_rate: u32, channels: u16) -> Result<Vec<u8>> {
        let spec = WavSpec {
            channels,
            sample_rate,
            bits_per_sample: 16,
            sample_format: hound::SampleFormat::Int,
        };

        let mut cursor = Cursor::new(Vec::new());
        let mut writer = WavWriter::new(&mut cursor, spec)?;

        // Convert f32 samples to i16
        for &sample in samples {
            let amplitude = (sample * i16::MAX as f32) as i16;
            writer.write_sample(amplitude)?;
        }

        writer.finalize()?;
        Ok(cursor.into_inner())
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_wav_encoding() {
        let encoder = WavEncoder::new();
        let samples: Vec<f32> = vec![0.0, 0.5, -0.5, 1.0, -1.0];
        let result = encoder.encode(&samples, 16000, 1);
        
        assert!(result.is_ok());
        let data = result.unwrap();
        assert!(!data.is_empty());
        
        // WAV files should start with "RIFF"
        assert_eq!(&data[0..4], b"RIFF");
    }
}
