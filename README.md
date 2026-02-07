# Voice PA

> Unified voice recording and transcription platform for in-person meetings and online video calls

Voice PA is a comprehensive solution for recording and transcribing meetings across multiple platforms. Record in-person meetings via mobile app, capture online meetings from Google Meet and Zoom, and manage all your transcriptions from a centralized web dashboard.

## 🎯 Features

### Mobile App (iOS & Android)
- 📱 One-tap recording for in-person meetings
- 🎙️ Real-time transcription with speaker identification
- 📴 Full offline support with automatic sync
- 🔊 Audio playback synchronized with transcript
- 📄 Export to PDF, TXT, DOCX

### Browser Extensions (Chrome)
- 🌐 Auto-capture Google Meet and Zoom calls
- 💬 Real-time transcription overlay
- 👥 Automatic participant detection
- ☁️ Seamless cloud sync

### Web Dashboard
- 📊 Centralized meeting management
- 🔍 Search and filter transcriptions
- ✏️ Edit and annotate transcripts
- 📈 Analytics and insights
- 🔗 Team collaboration (coming soon)

## 🏗️ Architecture

Voice PA uses a **high-performance Rust core library** that powers all platforms:

```
┌─────────────────────────────────────────────────────┐
│                  Client Layer                        │
│  Mobile App  │  Extensions  │  Web Dashboard        │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│              Rust Core Library                       │
│  Audio Capture │ Transcription │ Diarization        │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│              Backend Services                        │
│  REST API  │  WebSocket  │  Job Queue               │
└─────────────────────────────────────────────────────┘
```

## 🛠️ Technology Stack

- **Core**: Rust (audio processing, transcription)
- **Mobile**: React Native (iOS & Android)
- **Backend**: Node.js + TypeScript + Prisma
- **Web**: Next.js 14 + TypeScript + Tailwind CSS
- **Extensions**: Chrome Extension Manifest V3
- **Database**: PostgreSQL + Redis
- **Storage**: S3-compatible object storage

## 📁 Project Structure

```
voice-pa/
├── packages/
│   ├── core/              # Rust core library
│   ├── mobile/            # React Native app
│   ├── backend/           # Node.js backend
│   ├── web-dashboard/     # Next.js dashboard
│   ├── landing/           # Next.js landing page
│   ├── extension-meet/    # Google Meet extension
│   ├── extension-zoom/    # Zoom extension
│   └── shared/            # Shared TypeScript types
├── docs/                  # Documentation
└── scripts/               # Build and deployment scripts
```

## 🚀 Quick Start

### Prerequisites

- **Rust** 1.75+ ([install](https://rustup.rs/))
- **Node.js** 20+ ([install](https://nodejs.org/))
- **Docker** ([install](https://docs.docker.com/get-docker/))
- **Xcode** (for iOS development)
- **Android Studio** (for Android development)

### Setup

```bash
# Clone the repository
git clone https://github.com/your-org/voice-pa.git
cd voice-pa

# Install dependencies
npm install

# Start local services (PostgreSQL, Redis)
docker-compose up -d

# Build Rust core library
npm run build:core

# Setup database
cd packages/backend
npx prisma migrate dev
npx prisma db seed

# Start backend
npm run dev:backend

# In another terminal, start web dashboard
npm run dev:web
```

### Mobile Development

```bash
cd packages/mobile

# iOS
npm run ios

# Android
npm run android
```

## 📚 Documentation

- [Architecture Overview](docs/architecture.md)
- [Development Guide](docs/development-guide.md)
- [API Reference](docs/api-reference.md)
- [Deployment Guide](docs/deployment-guide.md)

## 🧪 Testing

```bash
# Run all tests
npm test

# Test specific package
cd packages/core && cargo test
cd packages/backend && npm test
cd packages/mobile && npm test
```

## 🔒 Security

- End-to-end encryption for audio files
- GDPR compliant data handling
- SOC 2 Type II certified infrastructure
- Regular security audits

See [SECURITY.md](SECURITY.md) for reporting vulnerabilities.

## 📄 License

This project is licensed under the MIT License - see [LICENSE](LICENSE) file for details.

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## 📞 Support

- 📧 Email: support@voicepa.com
- 💬 Discord: [Join our community](https://discord.gg/voicepa)
- 📖 Docs: [docs.voicepa.com](https://docs.voicepa.com)

## 🗺️ Roadmap

- [x] Core audio processing library
- [x] Mobile app (iOS & Android)
- [x] Browser extensions (Meet & Zoom)
- [x] Web dashboard
- [ ] AI-powered meeting summaries
- [ ] Action items extraction
- [ ] Team workspaces
- [ ] Calendar integrations
- [ ] 50+ language support
- [ ] Video recording

---

Built with ❤️ by the Voice PA team
