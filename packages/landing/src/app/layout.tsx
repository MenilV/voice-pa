import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Voice PA | Your Dedicated AI Voice Assistant",
  description: "High-performance recording and transcription for meetings, WhatsApp, and phone calls.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased">
        <nav className="glass-nav">
          <div className="mx-auto max-w-7xl px-6 h-20 flex items-center justify-between">
            <div className="flex items-center gap-2 group cursor-pointer">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center transition-transform group-hover:rotate-6">
                <div className="w-4 h-4 bg-black rounded-sm" />
              </div>
              <span className="text-xl font-bold tracking-tight">Voice PA</span>
            </div>

            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Features</a>
              <a href="#how-it-works" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">How it Works</a>
              <a href="#pricing" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Pricing</a>
            </div>

            <div className="flex items-center gap-4">
              <button className="text-sm font-medium hover:text-zinc-300 transition-colors">Sign In</button>
              <button className="px-5 py-2.5 bg-white text-black text-sm font-semibold rounded-full hover:bg-zinc-200 transition-all">
                Get Started
              </button>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}

