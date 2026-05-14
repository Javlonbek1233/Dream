import { useState } from "react";
import { Shell } from "./components/Shell";
import { Journal } from "./components/Journal";
import { Community } from "./components/Community";
import { GalaxyBackground } from "./components/GalaxyBackground";
import { AuthProvider, useAuth } from "./lib/AuthContext";
import { motion, AnimatePresence } from "motion/react";
import { Stars, Sparkles, Wand2 } from "lucide-react";

import { LucidGuide } from "./components/LucidGuide";

function AppContent() {
  const { user, login, loading } = useAuth();
  const [activeTab, setActiveTab] = useState("journal");

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-black">
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <Stars className="w-12 h-12 text-white" />
        </motion.div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#05020a] text-white p-6">
        <GalaxyBackground />
        
        {/* Background Portals */}
        <div className="portal-circle" style={{ top: "20%", left: "10%" }} />
        <div className="portal-circle" style={{ bottom: "20%", right: "10%", background: "#ec4899" }} />

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 max-w-4xl text-center space-y-12"
        >
          <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full glass-card border-white/10 text-[10px] font-bold uppercase tracking-[0.4em] nebula-text">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            Visions from the Neural Void
          </div>
          <div className="space-y-4">
            <h1 className="text-8xl md:text-[12rem] font-bold tracking-tighter leading-none italic font-serif flex flex-col md:flex-row items-center justify-center gap-0 md:gap-8">
              <span className="text-white">Dream</span>
              <span className="text-white/10">Scape</span>
            </h1>
            <div className="flex items-center justify-center gap-4 text-slate-500 uppercase tracking-[0.5em] text-xs font-black">
              <span>Subconscious</span>
              <span className="w-8 h-[1px] bg-white/10" />
              <span>Manifested</span>
            </div>
          </div>
          <p className="text-xl md:text-2xl text-slate-400 font-light max-w-2xl mx-auto leading-relaxed italic">
            Connect your consciousness to the most advanced AI dream-to-reality mirror. 
            Visualize your subconscious in cinematic detail.
          </p>
          <div className="pt-8">
            <button 
              onClick={login}
              className="px-12 py-6 bg-white text-black text-xl font-black rounded-full hover:scale-105 transition-all shadow-[0_0_50px_rgba(255,255,255,0.2)] active:scale-95 flex items-center gap-4 mx-auto uppercase tracking-widest"
            >
              Sync Awareness
              <Wand2 className="w-6 h-6" />
            </button>
          </div>
          
          <div className="pt-24 grid grid-cols-3 gap-8 opacity-40">
             <div className="flex flex-col items-center gap-2">
                <span className="text-4xl font-black font-mono">1.2M+</span>
                <span className="text-[10px] uppercase tracking-widest text-slate-500">Dreams Scanned</span>
             </div>
             <div className="flex flex-col items-center gap-2">
                <span className="text-4xl font-black font-mono">98%</span>
                <span className="text-[10px] uppercase tracking-widest text-slate-500">Sync Accuracy</span>
             </div>
             <div className="flex flex-col items-center gap-2">
                <span className="text-4xl font-black font-mono">12ms</span>
                <span className="text-[10px] uppercase tracking-widest text-slate-500">Neural Latency</span>
             </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <Shell activeTab={activeTab} setActiveTab={setActiveTab}>
      <GalaxyBackground />
      <AnimatePresence mode="wait">
        {activeTab === "journal" && <Journal key="journal" />}
        {activeTab === "community" && <Community key="community" />}
        {activeTab === "favorites" && (
          <div className="flex items-center justify-center h-[60vh] text-slate-500 italic">
            Your sacred dreams will manifest here soon...
          </div>
        )}
        {activeTab === "explore" && <LucidGuide key="explore" />}
      </AnimatePresence>
    </Shell>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
