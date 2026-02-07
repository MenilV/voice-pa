# Voice PA Core Library

High-performance audio processing and transcription engine written in Rust.

## Features

- 🎙️ Cross-platform audio capture (iOS, Android, macOS, Linux, Windows)
- 🔊 Audio encoding (WAV, MP3, FLAC)
- 🎯 Voice Activity Detection (VAD)
- 🗣️ Speaker diarization
- 🌐 Integration with OpenAI Whisper API
- 📱 FFI bindings for React Native
- 🔌 C-compatible API for Node.js

## Architecture

```
src/
├── lib.rs              # Main library entry
├── audio/              # Audio capture and processing
├── transcription/      # STT integration
├── storage/            # Local storage and sync
├── ffi/                # FFI bindings
└── utils/              # Common utilities
```

## Building

### For development (host platform)
```bash
cargo build
cargo test
```

### For iOS
```bash
cargo build --release --target aarch64-apple-ios
```

### For Android
```bash
# ARM64
cargo build --release --target aarch64-linux-android

# ARMv7
cargo build --release --target armv7-linux-androideabi
```

### For Node.js backend
```bash
cargo build --release
```

## Testing

```bash
# Run all tests
cargo test

# Run with logging
RUST_LOG=debug cargo test

# Run benchmarks
cargo bench
```

## Usage Example

```rust
use voice_pa_core::audio::AudioRecorder;
use voice_pa_core::transcription::WhisperClient;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    // Initialize audio recorder
    let recorder = AudioRecorder::new()?;
    
    // Start recording
    let stream = recorder.start_recording().await?;
    
    // Record for 10 seconds
    tokio::time::sleep(tokio::time::Duration::from_secs(10)).await;
    
    // Stop and get audio data
    let audio_data = recorder.stop_recording().await?;
    
    // Transcribe with Whisper
    let client = WhisperClient::new("your-api-key");
    let transcript = client.transcribe(&audio_data).await?;
    
    println!("Transcript: {}", transcript.text);
    
    Ok(())
}
```

## FFI Usage

### React Native (iOS/Android)

The library generates Swift/Kotlin bindings via UniFFI:

```swift
// iOS
import VoicePACore

let recorder = AudioRecorder()
try await recorder.startRecording()
```

```kotlin
// Android
import com.voicepa.core.AudioRecorder

val recorder = AudioRecorder()
recorder.startRecording()
```

### Node.js

```javascript
const ffi = require('ffi-napi');
const ref = require('ref-napi');

const lib = ffi.Library('./target/release/libvoice_pa_core', {
  'start_recording': ['pointer', []],
  'stop_recording': ['void', ['pointer']],
});
```

## Performance

- Audio processing latency: < 100ms
- Memory usage: < 50MB per session
- CPU usage: < 20% on modern devices
- Battery impact: < 5%/hour during recording

## License

MIT
