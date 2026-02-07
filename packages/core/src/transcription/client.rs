use reqwest::multipart::{Form, Part};
use serde::{Deserialize, Serialize};
use crate::utils::error::{Result, VoicePAError};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Speaker {
    pub id: String,
    pub name: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TranscriptSegment {
    pub id: u32,
    pub speaker_id: Option<String>,
    pub text: String,
    pub start_time: f64,
    pub end_time: f64,
    pub confidence: f32,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Transcript {
    pub text: String,
    pub language: String,
    pub segments: Vec<TranscriptSegment>,
    pub speakers: Vec<Speaker>,
}

pub struct WhisperClient {
    api_key: String,
    base_url: String,
    client: reqwest::Client,
}

impl WhisperClient {
    pub fn new(api_key: String) -> Self {
        Self {
            api_key,
            base_url: "https://api.openai.com/v1".to_string(),
            client: reqwest::Client::new(),
        }
    }

    /// Transcribe audio data using OpenAI Whisper API
    pub async fn transcribe(&self, audio_data: &[u8]) -> Result<Transcript> {
        let form = Form::new()
            .part(
                "file",
                Part::bytes(audio_data.to_vec())
                    .file_name("audio.wav")
                    .mime_str("audio/wav")
                    .map_err(|e| VoicePAError::Transcription(e.to_string()))?,
            )
            .text("model", "whisper-1")
            .text("response_format", "verbose_json")
            .text("timestamp_granularities[]", "segment");

        let response = self
            .client
            .post(format!("{}/audio/transcriptions", self.base_url))
            .header("Authorization", format!("Bearer {}", self.api_key))
            .multipart(form)
            .send()
            .await?;

        if !response.status().is_success() {
            let error_text = response.text().await?;
            return Err(VoicePAError::Transcription(format!(
                "API error: {}",
                error_text
            )));
        }

        let whisper_response: WhisperResponse = response.json().await?;
        
        // Convert Whisper response to our Transcript format
        let segments: Vec<TranscriptSegment> = whisper_response
            .segments
            .into_iter()
            .enumerate()
            .map(|(i, seg)| TranscriptSegment {
                id: i as u32,
                speaker_id: None, // Speaker diarization happens separately
                text: seg.text,
                start_time: seg.start,
                end_time: seg.end,
                confidence: seg.avg_logprob.exp(), // Convert log prob to confidence
            })
            .collect();

        Ok(Transcript {
            text: whisper_response.text,
            language: whisper_response.language,
            segments,
            speakers: Vec::new(), // Will be populated by diarization
        })
    }

    /// Transcribe with language hint
    pub async fn transcribe_with_language(
        &self,
        audio_data: &[u8],
        language: &str,
    ) -> Result<Transcript> {
        let form = Form::new()
            .part(
                "file",
                Part::bytes(audio_data.to_vec())
                    .file_name("audio.wav")
                    .mime_str("audio/wav")
                    .map_err(|e| VoicePAError::Transcription(e.to_string()))?,
            )
            .text("model", "whisper-1")
            .text("language", language.to_string())
            .text("response_format", "verbose_json")
            .text("timestamp_granularities[]", "segment");

        let response = self
            .client
            .post(format!("{}/audio/transcriptions", self.base_url))
            .header("Authorization", format!("Bearer {}", self.api_key))
            .multipart(form)
            .send()
            .await?;

        if !response.status().is_success() {
            let error_text = response.text().await?;
            return Err(VoicePAError::Transcription(format!(
                "API error: {}",
                error_text
            )));
        }

        let whisper_response: WhisperResponse = response.json().await?;
        
        let segments: Vec<TranscriptSegment> = whisper_response
            .segments
            .into_iter()
            .enumerate()
            .map(|(i, seg)| TranscriptSegment {
                id: i as u32,
                speaker_id: None,
                text: seg.text,
                start_time: seg.start,
                end_time: seg.end,
                confidence: seg.avg_logprob.exp(),
            })
            .collect();

        Ok(Transcript {
            text: whisper_response.text,
            language: whisper_response.language,
            segments,
            speakers: Vec::new(),
        })
    }
}

// Internal Whisper API response structures
#[derive(Debug, Deserialize)]
struct WhisperResponse {
    text: String,
    language: String,
    segments: Vec<WhisperSegment>,
}

#[derive(Debug, Deserialize)]
struct WhisperSegment {
    text: String,
    start: f64,
    end: f64,
    avg_logprob: f32,
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_transcript_segment_creation() {
        let segment = TranscriptSegment {
            id: 0,
            speaker_id: Some("speaker1".to_string()),
            text: "Hello world".to_string(),
            start_time: 0.0,
            end_time: 1.5,
            confidence: 0.95,
        };

        assert_eq!(segment.text, "Hello world");
        assert_eq!(segment.confidence, 0.95);
    }
}
