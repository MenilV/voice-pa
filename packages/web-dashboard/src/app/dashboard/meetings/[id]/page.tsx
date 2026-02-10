'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
    ChevronLeft,
    Share2,
    Download,
    MessageSquare,
    FileText,
    Zap,
    Clock,
    Video,
    Play,
    User,
    MoreVertical
} from 'lucide-react';

export default function MeetingDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'TRANSCRIPT' | 'NOTES' | 'SUMMARY'>('TRANSCRIPT');

    const mockTranscript = [
        { speaker: 'Speaker A', time: '00:01', text: 'Welcome everyone to the Voice PA project sync.' },
        { speaker: 'Speaker B', time: '00:05', text: 'Thanks. I have some updates on the Rust core integration.' },
        { speaker: 'Speaker A', time: '00:12', text: 'Great, let\'s dive into the iOS framework status.' },
        { speaker: 'Speaker B', time: '00:15', text: 'The XCFramework is ready and we\'ve successfully bridged the recorder to React Native.' },
        { speaker: 'Speaker A', time: '00:28', text: 'Perfect. What about the Android NDK toolchain?' },
        { speaker: 'Speaker B', time: '00:32', text: 'Still work in progress, but we should have a build by Tuesday.' },
    ];

    return (
        <div className="flex flex-col h-full bg-black animate-fade-in relative">
            <header className="px-8 py-6 border-b border-white/5 flex items-center justify-between bg-black/50 backdrop-blur-md sticky top-0 z-10">
                <div className="flex items-center gap-6">
                    <button
                        onClick={() => router.back()}
                        className="w-10 h-10 rounded-xl border border-white/5 flex items-center justify-center hover:bg-white/5 transition-colors group"
                    >
                        <ChevronLeft className="w-5 h-5 text-zinc-500 group-hover:text-white" />
                    </button>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-xl font-bold tracking-tight text-white">Engineering Sync — Feb 7</h1>
                            <span className="px-2 py-0.5 rounded-md bg-purple-500/10 text-[10px] font-bold text-purple-400 border border-purple-500/20 uppercase tracking-wider">
                                Google Meet
                            </span>
                        </div>
                        <p className="text-zinc-500 text-xs mt-1 flex items-center gap-2">
                            <Clock className="w-3 h-3" /> 12:45 Duration • <User className="w-3 h-3" /> 4 Speakers
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm font-semibold hover:bg-white/10 transition-colors">
                        <Share2 className="w-4 h-4" />
                        Share
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-black text-sm font-semibold hover:bg-zinc-200 transition-all active:scale-95 shadow-lg shadow-white/5">
                        <Download className="w-4 h-4" />
                        Export PDF
                    </button>
                    <button className="w-10 h-10 rounded-xl border border-white/5 flex items-center justify-center hover:bg-white/5 transition-colors">
                        <MoreVertical className="w-4 h-4 text-zinc-500" />
                    </button>
                </div>
            </header>

            <div className="flex-1 overflow-hidden flex flex-col">
                <div className="px-8 pt-6">
                    <div className="flex gap-8 border-b border-white/5">
                        {[
                            { id: 'TRANSCRIPT', label: 'Transcript', icon: MessageSquare },
                            { id: 'SUMMARY', label: 'AI Summary', icon: Zap },
                            { id: 'NOTES', label: 'Meeting Notes', icon: FileText },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`flex items-center gap-2 pb-4 text-sm font-semibold transition-all relative group ${activeTab === tab.id ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
                                    }`}
                            >
                                <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-purple-400' : 'group-hover:text-zinc-400'}`} />
                                {tab.label}
                                {activeTab === tab.id && (
                                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500 rounded-full shadow-[0_0_8px_rgba(168,85,247,0.5)]" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar glow-mesh">
                    {activeTab === 'TRANSCRIPT' && (
                        <div className="space-y-6 max-w-4xl mx-auto pb-20">
                            {mockTranscript.map((entry, i) => (
                                <div key={i} className="flex gap-8 group">
                                    <div className="w-24 pt-2 shrink-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <div className="w-2 h-2 rounded-full bg-purple-500" />
                                            <span className="text-zinc-400 text-xs font-bold uppercase tracking-wider">{entry.speaker}</span>
                                        </div>
                                        <span className="text-zinc-600 text-[10px] font-bold pl-4 uppercase tracking-tighter">{entry.time}</span>
                                    </div>
                                    <div className="flex-1 glass-card p-6 border-white/10 bg-white/[0.04] card-hover hover:bg-white/[0.08] transition-all cursor-text relative shadow-2xl shadow-black/50">
                                        <p className="text-white/90 leading-relaxed font-medium">{entry.text}</p>
                                        <button className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-white/10 rounded-lg">
                                            <Play className="w-3 h-3 text-purple-400 fill-purple-400" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'SUMMARY' && (
                        <div className="max-w-3xl mx-auto space-y-10 pb-20">
                            <div className="glass-card p-10 space-y-8 relative overflow-hidden">
                                <div className="absolute -top-24 -right-24 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl" />
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-purple-500/20 flex items-center justify-center">
                                        <Zap className="w-6 h-6 text-purple-400" />
                                    </div>
                                    <h2 className="text-2xl font-bold tracking-tight">AI Insights</h2>
                                </div>

                                <div className="space-y-6">
                                    <p className="text-lg text-zinc-300 leading-relaxed font-medium">
                                        High-level focus on finalizing the mobile architecture and toolchain configuration.
                                    </p>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-500">Key Takeaways</h3>
                                            <ul className="space-y-3">
                                                {[
                                                    'iOS XCFramework successfully integrated',
                                                    'React Native bridge is functional',
                                                    'Performance targets achieved on Simulator'
                                                ].map((item, i) => (
                                                    <li key={i} className="flex gap-3 text-sm text-zinc-400 font-medium">
                                                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                                                        {item}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        <div className="space-y-4">
                                            <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-500">Next Steps</h3>
                                            <ul className="space-y-3">
                                                {[
                                                    'Finalize Android NDK build scripts',
                                                    'Test background audio service',
                                                    'Initiate end-to-end cloud transcription tests'
                                                ].map((item, i) => (
                                                    <li key={i} className="flex gap-3 text-sm text-zinc-400 font-medium">
                                                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0" />
                                                        {item}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

