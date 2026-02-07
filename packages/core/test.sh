#!/bin/bash

# Voice PA Core - Quick Test Script
# This script helps you quickly test the Rust core library

set -e

echo "🎙️  Voice PA Core - Quick Test"
echo "=============================="
echo ""

# Check if Rust is installed
if ! command -v cargo &> /dev/null; then
    echo "❌ Rust is not installed!"
    echo ""
    echo "Install Rust with:"
    echo "  curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh"
    echo "  source \$HOME/.cargo/env"
    exit 1
fi

echo "✅ Rust is installed: $(rustc --version)"
echo ""

# Check if OpenAI API key is set
if [ -z "$OPENAI_API_KEY" ]; then
    echo "⚠️  OPENAI_API_KEY is not set!"
    echo ""
    echo "Set your API key with:"
    echo "  export OPENAI_API_KEY=sk-your-key-here"
    echo ""
    echo "You can still run unit tests without it."
    echo ""
fi

# Navigate to core directory
cd "$(dirname "$0")"

echo "📦 Building Rust core library..."
cargo build
echo ""

echo "🧪 Running unit tests..."
cargo test
echo ""

if [ -n "$OPENAI_API_KEY" ]; then
    echo "🎙️  Ready to test with real audio!"
    echo ""
    echo "Choose a test:"
    echo "  1. Record 5 seconds and transcribe (requires microphone)"
    echo "  2. Transcribe an existing WAV file"
    echo "  3. Skip audio tests"
    echo ""
    read -p "Enter choice (1-3): " choice
    
    case $choice in
        1)
            echo ""
            echo "🔴 Starting live recording test..."
            echo "   You'll have 5 seconds to speak after recording starts."
            echo ""
            RUST_LOG=info cargo run --example record_and_transcribe
            ;;
        2)
            echo ""
            read -p "Enter path to WAV file: " wav_file
            if [ -f "$wav_file" ]; then
                RUST_LOG=info cargo run --example transcribe_file "$wav_file"
            else
                echo "❌ File not found: $wav_file"
            fi
            ;;
        3)
            echo "Skipping audio tests."
            ;;
        *)
            echo "Invalid choice."
            ;;
    esac
else
    echo "⏭️  Skipping audio tests (no API key)"
fi

echo ""
echo "✅ Testing complete!"
echo ""
echo "Next steps:"
echo "  - Review test results above"
echo "  - Check recording.wav if you did live recording"
echo "  - Run 'cargo bench' for performance benchmarks"
