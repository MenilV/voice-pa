use voice_pa_core::transcription::WhisperClient;
use std::env;
use std::fs;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    env_logger::init();
    
    println!("🎙️  Voice PA Core - Transcribe Audio File");
    println!("=========================================\n");

    // Get file path from args
    let args: Vec<String> = env::args().collect();
    if args.len() < 2 {
        eprintln!("Usage: {} <audio_file.wav>", args[0]);
        eprintln!("\nExample:");
        eprintln!("  cargo run --example transcribe_file recording.wav");
        return Ok(());
    }

    let file_path = &args[1];
    
    // Check for API key
    let api_key = env::var("OPENAI_API_KEY")
        .expect("OPENAI_API_KEY environment variable not set");

    // Read audio file
    println!("1. Reading audio file: {}", file_path);
    let audio_data = fs::read(file_path)?;
    println!("   ✓ File loaded: {} bytes", audio_data.len());

    // Transcribe with Whisper
    println!("\n2. Transcribing with OpenAI Whisper...");
    println!("   (This may take a few seconds...)");
    
    let client = WhisperClient::new(api_key);
    
    match client.transcribe(&audio_data).await {
        Ok(transcript) => {
            println!("   ✓ Transcription complete\n");
            
            println!("📝 Results:");
            println!("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
            println!("Language: {}", transcript.language);
            println!("\nFull Text:");
            println!("{}", transcript.text);
            
            if !transcript.segments.is_empty() {
                println!("\nSegments:");
                println!("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
                for (i, segment) in transcript.segments.iter().enumerate() {
                    println!("\n[{}] {:.2}s - {:.2}s (confidence: {:.2}%)", 
                        i + 1,
                        segment.start_time, 
                        segment.end_time,
                        segment.confidence * 100.0
                    );
                    println!("{}", segment.text.trim());
                }
            }
            
            println!("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        }
        Err(e) => {
            eprintln!("   ✗ Transcription failed: {}", e);
            eprintln!("\nTroubleshooting:");
            eprintln!("  - Make sure OPENAI_API_KEY is set correctly");
            eprintln!("  - Check that the audio file is in WAV format");
            eprintln!("  - Verify you have internet connectivity");
            return Err(e.into());
        }
    }

    println!("\n✅ Transcription completed successfully!");
    Ok(())
}
