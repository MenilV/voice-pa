export default function Home() {
  return (
    <main className="relative flex flex-col items-center glow-mesh min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 w-full max-w-7xl">
        <div className="flex flex-col items-center text-center animate-fade-in">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-purple-400 mb-8 tracking-wide uppercase">
            🚀 The Future of Transcription is Here
          </div>

          <h1 className="text-6xl md:text-8xl font-bold tracking-tight mb-8 max-w-4xl">
            <span className="text-white">Your voice,</span><br />
            <span className="text-gradient">seamlessly captured.</span>
          </h1>

          <p className="text-xl text-zinc-400 max-w-2xl mb-12 leading-relaxed">
            From WhatsApp voice notes to complex board meetings, Voice PA transcribes everything with superhuman accuracy.
            Powered by a blisteringly fast Rust core.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <button className="btn-primary flex items-center gap-2">
              Start Capturing Free
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
            <button className="btn-secondary">View Interactive Demo</button>
          </div>
        </div>

        {/* Dashboard Preview */}
        <div className="mt-24 relative card-premium animate-float shadow-2xl">
          <div className="bg-zinc-950 rounded-2xl w-full overflow-hidden border border-white/10 aspect-[16/10] flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/5 to-blue-500/5" />
            <div className="grid grid-cols-12 gap-1 w-full h-full p-4 opacity-40">
              <div className="col-span-3 bg-white/5 rounded-lg border border-white/5" />
              <div className="col-span-9 space-y-4">
                <div className="h-12 bg-white/5 rounded-lg border border-white/5 w-1/3" />
                <div className="h-full bg-white/5 rounded-lg border border-white/5" />
              </div>
            </div>
            <div className="absolute flex flex-col items-center gap-4 text-center px-6">
              <div className="w-16 h-16 rounded-2xl bg-white text-black flex items-center justify-center shadow-xl">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold">Dashboard Live Preview</h3>
              <p className="text-zinc-500 max-w-xs">Real-time transcription processing and speaker identification in action.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-32 px-6 w-full max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <FeatureCard
            title="Meeting Bot"
            description="Auto-joins Zoom and Google Meet to record and summarize everything."
            icon={<BotIcon />}
          />
          <FeatureCard
            title="WhatsApp Integration"
            description="Forward voice notes to our bot and get text summaries in seconds."
            icon={<MessageIcon />}
          />
          <FeatureCard
            title="Phone Voice Support"
            description="Call your personal assistant number to record thoughts on the go."
            icon={<PhoneIcon />}
          />
          <FeatureCard
            title="Mobile Sync"
            description="A native experience for iOS and Android built on high-performance Rust."
            icon={<MobileIcon />}
          />
        </div>
      </section>

      {/* Rust Core Section */}
      <section className="py-32 px-6 w-full bg-white/[0.02] border-y border-white/5 flex justify-center">
        <div className="max-w-7xl w-full grid md:grid-cols-2 gap-20 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-8">Performance that<br />defies gravity.</h2>
            <p className="text-lg text-zinc-400 mb-10 leading-relaxed">
              Our core engine is written in Rust, ensuring that audio processing and feature extraction happen with zero latency.
              Combined with OpenAI's Whisper, you get unmatched accuracy and speed.
            </p>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-zinc-300">
                <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                </div>
                3x faster than standard Node.js implementations
              </li>
              <li className="flex items-center gap-3 text-zinc-300">
                <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                </div>
                Low memory footprint for mobile efficiency
              </li>
              <li className="flex items-center gap-3 text-zinc-300">
                <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                </div>
                End-to-end encryption by default
              </li>
            </ul>
          </div>
          <div className="card-premium aspect-square bg-zinc-900 flex items-center justify-center">
            <div className="text-8xl">🦀</div>
          </div>
        </div>
      </section>

      {/* Trust Grid */}
      <section className="py-32 px-6 w-full max-w-7xl">
        <p className="text-center text-sm font-medium text-zinc-500 uppercase tracking-[0.2em] mb-16">
          Powering conversations everywhere
        </p>
        <div className="flex flex-wrap justify-center gap-12 md:gap-20 opacity-30 grayscale hover:grayscale-0 transition-all duration-700">
          <Logo text="Google Meet" />
          <Logo text="Zoom" />
          <Logo text="WhatsApp" />
          <Logo text="Twilio" />
          <Logo text="Slack" />
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full border-t border-white/5 py-12 px-6 flex justify-center">
        <div className="max-w-7xl w-full flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-white rounded flex items-center justify-center">
              <div className="w-3 h-3 bg-black rounded-xs" />
            </div>
            <span className="font-bold">Voice PA</span>
          </div>
          <p className="text-sm text-zinc-500">© 2026 Voice PA. Built with Next.js, Rust, and ❤️</p>
          <div className="flex gap-6">
            <a href="#" className="text-sm text-zinc-400 hover:text-white transition-colors">GitHub</a>
            <a href="#" className="text-sm text-zinc-400 hover:text-white transition-colors">Twitter</a>
            <a href="#" className="text-sm text-zinc-400 hover:text-white transition-colors">Discord</a>
          </div>
        </div>
      </footer>
    </main>
  );
}

function FeatureCard({ title, description, icon }: { title: string; description: string; icon: React.ReactNode }) {
  return (
    <div className="card-premium hover:bg-white/[0.05] group">
      <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
        {icon}
      </div>
      <h3 className="text-lg font-semibold mb-3">{title}</h3>
      <p className="text-sm text-zinc-500 leading-relaxed">{description}</p>
    </div>
  );
}

function Logo({ text }: { text: string }) {
  return <span className="text-2xl font-bold tracking-tight">{text}</span>;
}

function BotIcon() {
  return <svg className="w-6 h-6 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" /></svg>;
}

function MessageIcon() {
  return <svg className="w-6 h-6 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>;
}

function PhoneIcon() {
  return <svg className="w-6 h-6 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>;
}

function MobileIcon() {
  return <svg className="w-6 h-6 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>;
}


