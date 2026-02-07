use crate::utils::error::Result;

/// Voice Activity Detection
pub struct VoiceActivityDetector {
    threshold: f32,
}

impl VoiceActivityDetector {
    pub fn new(threshold: f32) -> Self {
        Self { threshold }
    }

    /// Detect if the audio segment contains voice
    pub fn detect(&self, samples: &[f32]) -> bool {
        let energy = self.calculate_energy(samples);
        energy > self.threshold
    }

    fn calculate_energy(&self, samples: &[f32]) -> f32 {
        let sum: f32 = samples.iter().map(|&s| s * s).sum();
        (sum / samples.len() as f32).sqrt()
    }
}

/// Audio preprocessing utilities
pub struct AudioPreprocessor;

impl AudioPreprocessor {
    /// Normalize audio samples to [-1.0, 1.0] range
    pub fn normalize(samples: &mut [f32]) {
        let max_amplitude = samples
            .iter()
            .map(|&s| s.abs())
            .fold(0.0f32, f32::max);

        if max_amplitude > 0.0 {
            for sample in samples.iter_mut() {
                *sample /= max_amplitude;
            }
        }
    }

    /// Apply simple high-pass filter to remove DC offset
    pub fn remove_dc_offset(samples: &mut [f32]) {
        let mean: f32 = samples.iter().sum::<f32>() / samples.len() as f32;
        for sample in samples.iter_mut() {
            *sample -= mean;
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_vad() {
        let vad = VoiceActivityDetector::new(0.01);
        
        // Silence
        let silence = vec![0.0; 1000];
        assert!(!vad.detect(&silence));
        
        // Voice
        let voice: Vec<f32> = (0..1000).map(|i| (i as f32 * 0.1).sin() * 0.5).collect();
        assert!(vad.detect(&voice));
    }

    #[test]
    fn test_normalization() {
        let mut samples = vec![0.5, 1.0, -0.5, -1.0, 2.0];
        AudioPreprocessor::normalize(&mut samples);
        
        let max = samples.iter().map(|&s| s.abs()).fold(0.0f32, f32::max);
        assert!((max - 1.0).abs() < 0.001);
    }
}
