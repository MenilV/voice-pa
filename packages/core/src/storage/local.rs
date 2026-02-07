use std::fs;
use std::path::{Path, PathBuf};
use serde::{Deserialize, Serialize};
use crate::utils::error::{Result, VoicePAError};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RecordingMetadata {
    pub id: String,
    pub title: String,
    pub date: String,
    pub duration: f64,
    pub file_path: String,
    pub synced: bool,
}

pub struct LocalStorage {
    base_path: PathBuf,
}

impl LocalStorage {
    pub fn new(base_path: impl AsRef<Path>) -> Result<Self> {
        let base_path = base_path.as_ref().to_path_buf();
        
        // Create directories if they don't exist
        fs::create_dir_all(&base_path)
            .map_err(|e| VoicePAError::Storage(format!("Failed to create storage directory: {}", e)))?;
        
        Ok(Self { base_path })
    }

    /// Save audio data to local storage
    pub async fn save_audio(&self, id: &str, data: &[u8]) -> Result<String> {
        let file_path = self.base_path.join(format!("{}.wav", id));
        
        tokio::fs::write(&file_path, data)
            .await
            .map_err(|e| VoicePAError::Storage(format!("Failed to save audio: {}", e)))?;
        
        Ok(file_path.to_string_lossy().to_string())
    }

    /// Save recording metadata
    pub async fn save_metadata(&self, metadata: &RecordingMetadata) -> Result<()> {
        let file_path = self.base_path.join(format!("{}.json", metadata.id));
        let json = serde_json::to_string_pretty(metadata)?;
        
        tokio::fs::write(&file_path, json)
            .await
            .map_err(|e| VoicePAError::Storage(format!("Failed to save metadata: {}", e)))?;
        
        Ok(())
    }

    /// Load recording metadata
    pub async fn load_metadata(&self, id: &str) -> Result<RecordingMetadata> {
        let file_path = self.base_path.join(format!("{}.json", id));
        
        let json = tokio::fs::read_to_string(&file_path)
            .await
            .map_err(|e| VoicePAError::Storage(format!("Failed to load metadata: {}", e)))?;
        
        let metadata: RecordingMetadata = serde_json::from_str(&json)?;
        Ok(metadata)
    }

    /// List all unsynced recordings
    pub async fn list_unsynced(&self) -> Result<Vec<RecordingMetadata>> {
        let mut unsynced = Vec::new();
        
        let mut entries = tokio::fs::read_dir(&self.base_path)
            .await
            .map_err(|e| VoicePAError::Storage(format!("Failed to read directory: {}", e)))?;
        
        while let Some(entry) = entries.next_entry().await.map_err(|e| {
            VoicePAError::Storage(format!("Failed to read directory entry: {}", e))
        })? {
            let path = entry.path();
            if path.extension().and_then(|s| s.to_str()) == Some("json") {
                let json = tokio::fs::read_to_string(&path).await?;
                if let Ok(metadata) = serde_json::from_str::<RecordingMetadata>(&json) {
                    if !metadata.synced {
                        unsynced.push(metadata);
                    }
                }
            }
        }
        
        Ok(unsynced)
    }

    /// Mark recording as synced
    pub async fn mark_synced(&self, id: &str) -> Result<()> {
        let mut metadata = self.load_metadata(id).await?;
        metadata.synced = true;
        self.save_metadata(&metadata).await
    }

    /// Delete recording
    pub async fn delete(&self, id: &str) -> Result<()> {
        let audio_path = self.base_path.join(format!("{}.wav", id));
        let metadata_path = self.base_path.join(format!("{}.json", id));
        
        if audio_path.exists() {
            tokio::fs::remove_file(&audio_path).await?;
        }
        
        if metadata_path.exists() {
            tokio::fs::remove_file(&metadata_path).await?;
        }
        
        Ok(())
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use tempfile::tempdir;

    #[tokio::test]
    async fn test_local_storage() {
        let dir = tempdir().unwrap();
        let storage = LocalStorage::new(dir.path()).unwrap();
        
        let metadata = RecordingMetadata {
            id: "test123".to_string(),
            title: "Test Recording".to_string(),
            date: "2026-02-07".to_string(),
            duration: 10.5,
            file_path: "test.wav".to_string(),
            synced: false,
        };
        
        storage.save_metadata(&metadata).await.unwrap();
        let loaded = storage.load_metadata("test123").await.unwrap();
        
        assert_eq!(loaded.id, "test123");
        assert_eq!(loaded.title, "Test Recording");
        assert!(!loaded.synced);
    }
}
