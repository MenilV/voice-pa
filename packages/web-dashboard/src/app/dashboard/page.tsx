'use client';

import {
    ArrowUpRight,
    Clock,
    Users,
    Zap,
    Plus,
    ExternalLink,
    MessageSquare,
    Phone,
    Video,
    Settings
} from 'lucide-react';

export default function DashboardOverview() {
    const stats = [
        { label: 'Total Meetings', value: '24', trend: '+12%', icon: Video, color: 'text-purple-400' },
        { label: 'Transcription Hrs', value: '18.5', trend: '+4.2h', icon: Clock, color: 'text-blue-400' },
        { label: 'Avg Accuracy', value: '98.2%', trend: '+0.5%', icon: Zap, color: 'text-emerald-400' },
        { label: 'Tokens Used', value: '142k', trend: '72% limit', icon: ArrowUpRight, color: 'text-orange-400' },
    ];

    const activities = [
        { title: 'Engineering Huddle', type: 'Google Meet', time: '2 hours ago', icon: Video, participants: 14 },
        { title: 'Project Voice Note', type: 'WhatsApp', time: '5 hours ago', icon: MessageSquare, participants: 1 },
        { title: 'Client Briefing', type: 'Phone Call', time: 'Yesterday', icon: Phone, participants: 2 },
    ];

    return (
        <div className="p-10 space-y-12 max-w-7xl mx-auto animate-fade-in">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight">Good morning, Menil</h1>
                    <p className="text-zinc-500 mt-2 text-lg">Your AI assistant is ready. You have 3 new summaries to review.</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm font-semibold hover:bg-white/10 transition-colors">
                        <Plus className="w-4 h-4" />
                        New Manual Upload
                    </button>
                </div>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                        <div key={i} className="glass-card p-8 card-hover flex flex-col gap-4 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Icon className="w-12 h-12" />
                            </div>
                            <div className="flex items-center justify-between">
                                <p className="text-zinc-500 text-sm font-medium">{stat.label}</p>
                                <div className={`p-2 rounded-lg bg-white/5 ${stat.color}`}>
                                    <Icon className="w-4 h-4" />
                                </div>
                            </div>
                            <div>
                                <h3 className="text-3xl font-bold tracking-tighter">{stat.value}</h3>
                                <div className="mt-2 text-xs font-bold text-zinc-400 flex items-center gap-1">
                                    <span className="text-emerald-500">{stat.trend}</span> {(stat.label === 'Tokens Used') ? '' : ' from last week'}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Recent Activity */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold">Recent Activity</h2>
                        <button className="text-sm text-purple-400 hover:text-purple-300 font-medium transition-colors">View All</button>
                    </div>
                    <div className="space-y-4">
                        {activities.map((activity, i) => {
                            const Icon = activity.icon;
                            return (
                                <div key={i} className="glass-card p-6 flex items-center gap-6 group cursor-pointer card-hover">
                                    <div className="h-14 w-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-purple-600/20 transition-all duration-500">
                                        <Icon className="w-6 h-6 text-zinc-400 group-hover:text-purple-400" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-1">
                                            <h4 className="font-bold text-white tracking-tight">{activity.title}</h4>
                                            <span className="px-2 py-0.5 rounded-md bg-purple-500/10 text-[10px] font-bold text-purple-400 border border-purple-500/20">
                                                {activity.type}
                                            </span>
                                        </div>
                                        <p className="text-xs text-zinc-500 flex items-center gap-2">
                                            <Clock className="w-3 h-3" />
                                            {activity.time} • <Users className="w-3 h-3 ml-1" /> {activity.participants} participants
                                        </p>
                                    </div>
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/10">
                                            <ExternalLink className="w-4 h-4 text-zinc-400" />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Integration Status & Quick Actions */}
                <div className="space-y-10">
                    <section className="space-y-6">
                        <h2 className="text-xl font-bold">System Status</h2>
                        <div className="glass-card p-8 bg-gradient-to-br from-purple-500/10 to-indigo-500/10 border-purple-500/20 space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-2xl bg-purple-500/20 flex items-center justify-center">
                                        <Zap className="w-6 h-6 text-purple-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold">Capture Active</h3>
                                        <p className="text-xs text-zinc-500">Ready for incoming voice</p>
                                    </div>
                                </div>
                                <div className="relative flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                                </div>
                            </div>

                            <div className="space-y-3 pt-4 border-t border-white/5">
                                <IntegrationItem label="WhatsApp Bot" active />
                                <IntegrationItem label="Phone Line (+1...)" active />
                                <IntegrationItem label="Browser Extension" active />
                            </div>
                        </div>
                    </section>

                    <section className="space-y-6">
                        <h2 className="text-xl font-bold">Quick Actions</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <QuickActionButton icon={MessageSquare} label="Share Summary" />
                            <QuickActionButton icon={Users} label="Team Access" />
                            <QuickActionButton icon={Settings} label="Voice Config" />
                            <QuickActionButton icon={Plus} label="Integrations" />
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}

function IntegrationItem({ label, active }: { label: string; active: boolean }) {
    return (
        <div className="flex items-center justify-between py-1">
            <span className="text-sm font-medium text-zinc-400">{label}</span>
            <span className={`text-[10px] font-bold uppercase tracking-widest ${active ? 'text-emerald-500 grayscale-0' : 'text-zinc-600'}`}>
                {active ? 'Running' : 'Offline'}
            </span>
        </div>
    );
}

function QuickActionButton({ icon: Icon, label }: { icon: any, label: string }) {
    return (
        <button className="flex flex-col items-center justify-center gap-3 p-6 glass-card border-none bg-white/[0.02] hover:bg-white/[0.05] transition-all group">
            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:scale-110 group-hover:bg-purple-500/20 transition-all">
                <Icon className="w-5 h-5 text-zinc-400 group-hover:text-purple-400" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 group-hover:text-zinc-300 transition-colors">
                {label}
            </span>
        </button>
    );
}

