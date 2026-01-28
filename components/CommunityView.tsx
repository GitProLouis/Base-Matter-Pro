import React, { useState, useMemo } from 'react';
import { Heart, MessageCircle, Share2, TrendingUp, Radio, Activity, Terminal, Shield, Zap } from 'lucide-react';

interface Post {
  id: string;
  user: string;
  action: string;
  time: string;
  image: string;
  likes: string;
  comments: number;
  type: 'global' | 'synapse' | 'protocol';
  status?: string;
}

const CommunityView: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('Global_Link');

  const allPosts: Post[] = useMemo(() => [
    { 
      id: '1',
      user: 'Recruit_284', 
      action: 'Initiated Mechanical Sequence', 
      time: '2m ago', 
      image: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&q=80&w=400',
      likes: '1.2K',
      comments: 84,
      type: 'global',
      status: 'SUCCESS'
    },
    { 
      id: '2',
      user: 'Specialist_04', 
      action: 'Uploaded Post-Activation Data', 
      time: '15m ago', 
      image: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&q=80&w=400',
      likes: '842',
      comments: 32,
      type: 'global',
      status: 'OP: SUCCESS'
    },
    { 
      id: '3',
      user: 'Your_Sync', 
      action: 'Completed Hypertrophy Protocol', 
      time: '1h ago', 
      image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=400',
      likes: '42',
      comments: 5,
      type: 'synapse',
      status: 'SYNCED'
    },
    { 
      id: '4',
      user: 'Neural_Node', 
      action: 'Structural Reinforcement Alpha', 
      time: '4h ago', 
      image: 'https://images.unsplash.com/photo-1581009146145-b5ef03a7401f?auto=format&fit=crop&q=80&w=400',
      likes: '3.1K',
      comments: 120,
      type: 'protocol',
      status: 'VERIFIED'
    },
    { 
      id: '5',
      user: 'Kinetic_Flux', 
      action: 'Metabolic Reset Phase 2', 
      time: '6h ago', 
      image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=400',
      likes: '912',
      comments: 44,
      type: 'protocol',
      status: 'STABLE'
    },
    { 
      id: '6',
      user: 'Alpha_Recruit', 
      action: 'Matched your Baseline Protocol', 
      time: '10h ago', 
      image: 'https://images.unsplash.com/photo-1550345332-09e3ac987658?auto=format&fit=crop&q=80&w=400',
      likes: '156',
      comments: 12,
      type: 'synapse',
      status: 'MATCHED'
    }
  ], []);

  const filteredPosts = useMemo(() => {
    if (activeFilter === 'Global_Link') return allPosts.filter(p => p.type === 'global');
    if (activeFilter === 'My_Synapses') return allPosts.filter(p => p.type === 'synapse');
    if (activeFilter === 'Protocols') return allPosts.filter(p => p.type === 'protocol');
    return allPosts;
  }, [activeFilter, allPosts]);

  const tabs = [
    { id: 'Global_Link', label: 'Global_Link', icon: Terminal },
    { id: 'My_Synapses', label: 'My_Synapses', icon: Shield },
    { id: 'Protocols', label: 'Protocols', icon: Zap },
    { id: 'Laboratory', label: 'Laboratory', icon: Activity },
  ];

  return (
    <div className="pb-32 animate-in fade-in duration-1000">
      <div className="px-6 pt-12 pb-8">
        <div className="flex justify-between items-start mb-10">
          <div>
            <div className="flex items-center space-x-2 mb-2">
               <div className="w-1.5 h-1.5 rounded-full bg-brand"></div>
               <span className="text-[9px] font-black text-brand uppercase tracking-[0.3em] font-mono">Collective Feed: Live</span>
            </div>
            <h1 className="text-5xl font-black uppercase tracking-tighter leading-none">
              Social<br/><span className="text-brand">Matter.</span>
            </h1>
          </div>
          <button className="w-12 h-12 glass flex items-center justify-center rounded-2xl border-brand/20">
            <Radio className="w-5 h-5 text-brand animate-pulse" />
          </button>
        </div>
      </div>

      {/* Feed Filters */}
      <section className="px-6 mb-10 overflow-x-auto hide-scrollbar flex space-x-3">
        {tabs.map((tab) => {
          const isActive = activeFilter === tab.id;
          const Icon = tab.icon;
          return (
            <button 
              key={tab.id} 
              onClick={() => setActiveFilter(tab.id)}
              className={`px-6 py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest border transition-all duration-500 whitespace-nowrap flex items-center space-x-2 ${
                isActive 
                  ? 'bg-brand text-black border-brand shadow-[0_0_20px_rgba(204,255,0,0.3)]' 
                  : 'glass text-zinc-500 border-white/5 hover:border-white/20'
              }`}
            >
              <Icon className={`w-3 h-3 ${isActive ? 'text-black' : 'text-zinc-600'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </section>

      {/* Event Feed */}
      <section className="px-6 space-y-10 min-h-[400px]">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post, idx) => (
            <div 
              key={post.id} 
              className="glass rounded-[40px] overflow-hidden border border-white/5 group animate-in fade-in slide-in-from-bottom-4 duration-700"
              style={{ animationDelay: `${idx * 150}ms` }}
            >
              <div className="p-6 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-2xl glass p-1 border-white/10 group-hover:border-brand/40 transition-colors">
                     <img src={`https://i.pravatar.cc/150?u=${post.id}`} className="w-full h-full rounded-xl object-cover grayscale" alt="" />
                  </div>
                  <div>
                    <p className="text-sm font-black uppercase tracking-tighter group-hover:text-brand transition-colors">{post.user}</p>
                    <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest font-mono">{post.action}</p>
                  </div>
                </div>
                <span className="text-[8px] text-zinc-600 font-bold font-mono bg-white/5 px-2 py-1 rounded-md">{post.time}</span>
              </div>
              
              <div className="aspect-square relative mx-6 rounded-[32px] overflow-hidden border border-white/5">
                <img src={post.image} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105" alt="" />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/10 transition-colors"></div>
                {/* Technical Overlay */}
                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                   <div className="glass px-3 py-1.5 rounded-xl text-[8px] font-mono text-brand border-brand/20">
                      SYNC_ID: {Math.floor(Math.random() * 900000) + 100000}
                   </div>
                   <div className="glass px-3 py-1.5 rounded-xl text-[8px] font-mono text-white border-white/10 uppercase font-black">
                      {post.status || 'ACTIVE'}
                   </div>
                </div>
              </div>

              <div className="p-6 flex justify-between items-center">
                <div className="flex space-x-6">
                  <button className="flex items-center space-x-2 text-zinc-500 hover:text-brand transition-colors group/btn">
                    <Heart className="w-5 h-5 group-hover/btn:fill-brand" />
                    <span className="text-[10px] font-black font-mono">{post.likes}</span>
                  </button>
                  <button className="flex items-center space-x-2 text-zinc-500 hover:text-white transition-colors">
                    <MessageCircle className="w-5 h-5" />
                    <span className="text-[10px] font-black font-mono">{post.comments}</span>
                  </button>
                </div>
                <button className="p-3 glass rounded-xl hover:bg-white/10 transition-colors">
                   <Share2 className="w-4 h-4 text-zinc-400" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center glass rounded-[40px] border border-white/5 mx-2">
            <Activity className="w-12 h-12 text-zinc-800 mb-4 animate-pulse" />
            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">No Active Synapses in this Cluster</p>
            <p className="text-[8px] text-zinc-700 font-mono mt-2 uppercase">Awaiting Uplink Initialization...</p>
          </div>
        )}
      </section>

      {/* Floating Action: Post Broadcast */}
      <div className="fixed bottom-28 right-8 z-40">
        <button className="bg-brand w-16 h-16 rounded-[24px] shadow-[0_0_30px_rgba(204,255,0,0.2)] flex items-center justify-center active:scale-95 transition-transform hover:scale-110 group relative">
          <div className="absolute inset-0 bg-brand rounded-[24px] blur-xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
          <TrendingUp className="w-7 h-7 text-black relative z-10" />
        </button>
      </div>
    </div>
  );
};

export default CommunityView;