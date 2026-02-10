'use client';

import Link from 'next/link';
import {
    Search,
    Calendar,
    Clock,
    Users,
    ChevronRight,
    Video,
    Mic2,
    Phone,
    MessageSquare
} from 'lucide-react';

const MOCK_MEETINGS = [
    { id: '1', title: 'Product Design Sync', date: 'Feb 7, 2026', duration: '45:12', participants: 4, type: 'Google Meet', icon: Video },
    { id: '2', title: 'Engineering Huddle', date: 'Feb 6, 2026', duration: '12:05', participants: 8, type: 'Zoom', icon: Video },
    { id: '3', title: 'In-person Client Interview', date: 'Feb 5, 2026', duration: '28:45', participants: 2, type: 'Mobile App', icon: Mic2 },
    { id: '4', title: 'Sprint Planning', date: 'Feb 4, 2026', duration: '1:12:00', participants: 12, type: 'Google Meet', icon: Video },
    { id: '5', title: 'WhatsApp Feedback', date: 'Feb 3, 2026', duration: '05:30', participants: 1, type: 'WhatsApp', icon: MessageSquare },
];

export default function MeetingsPage() {
    return (
        <div className="p-10 space-y-10 max-w-5xl mx-auto animate-fade-in">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight">Meeting History</h1>
                    <p className="text-zinc-500 mt-2 text-lg">Your library of captured wisdom and past decisions.</p>
                </div>
                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-purple-400 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search transcripts..."
                        className="pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-purple-500/50 w-72 transition-all placeholder:text-zinc-600"
                    />
                </div>
            </header>

            <div className="grid grid-cols-1 gap-4">
                {MOCK_MEETINGS.map((meeting) => {
                    const Icon = meeting.icon;
                    return (
                        <Link
                            key={meeting.id}
                            href={`/dashboard/meetings/${meeting.id}`}
                            className="glass-card p-6 flex items-center gap-6 group cursor-pointer card-hover relative overflow-hidden"
                        >
                            <div className="h-14 w-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-purple-600/20 transition-all duration-500">
                                <Icon className="w-6 h-6 text-zinc-400 group-hover:text-purple-400" />
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-3 mb-1.5">
                                    <h3 className="text-lg font-bold text-white tracking-tight truncate group-hover:text-purple-400 transition-colors">
                                        {meeting.title}
                                    </h3>
                                    <span className="px-2 py-0.5 rounded-md bg-white/5 text-[10px] font-bold text-zinc-500 border border-white/5 uppercase tracking-wider">
                                        {meeting.type}
                                    </span>
                                </div>

                                <div className="flex items-center gap-4 text-xs text-zinc-500 font-medium">
                                    <div className="flex items-center gap-1.5">
                                        <Calendar className="w-3.5 h-3.5" />
                                        {meeting.date}
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Clock className="w-3.5 h-3.5" />
                                        {meeting.duration}
                                    </div>
                                    <div className="flex items-center gap-1.5 text-zinc-600">
                                        <Users className="w-3.5 h-3.5" />
                                        {meeting.participants}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-white/10 group-hover:border-white/20 transition-all">
                                    <ChevronRight className="w-5 h-5 text-zinc-500 group-hover:text-white" />
                                </div>
                            </div>

                            {/* Subtle background glow on hover */}
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/0 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                        </Link>
                    );
                })}
            </div>

            <div className="pt-8 flex justify-center">
                <button className="text-sm font-bold text-zinc-600 hover:text-white transition-colors">
                    Load More Archives
                </button>
            </div>
        </div>
    );
}

