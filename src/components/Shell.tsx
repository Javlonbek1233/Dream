import { motion } from "motion/react";
import { Stars, Sparkles, Moon, Sun, Ghost, Wand2, Compass, Heart, Share2, LogOut, Plus } from "lucide-react";
import { useAuth } from "../lib/AuthContext";
import { cn } from "../lib/utils";

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function Shell({ children, activeTab, setActiveTab }: LayoutProps) {
  const { user, login, logout } = useAuth();

  const tabs = [
    { id: "journal", label: "Journal", icon: Moon },
    { id: "community", label: "Community", icon: Share2 },
    { id: "favorites", label: "Favorites", icon: Heart },
    { id: "explore", label: "Meanings", icon: Compass },
  ];

  return (
    <div className="min-h-screen text-slate-100 selection:bg-purple-500/30 relative">
      {/* Background Portals */}
      <div className="portal-circle" style={{ top: "10%", left: "5%" }} />
      <div className="portal-circle" style={{ bottom: "15%", right: "10%", background: "#ec4899" }} />

      {/* Sidebar / Navigation */}
      <nav className="fixed left-0 top-0 h-full w-20 md:w-64 border-r border-white/10 bg-black/20 backdrop-blur-3xl z-50 flex flex-col items-center md:items-stretch p-4">
        <div className="flex items-center gap-3 mb-12 px-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Stars className="text-white w-6 h-6" />
          </div>
          <span className="hidden md:block font-bold text-2xl tracking-tighter nebula-text">
            DreamScape
          </span>
        </div>

        <div className="flex-1 space-y-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                id={`nav-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300",
                  activeTab === tab.id 
                    ? "bg-white/10 text-white shadow-lg" 
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                )}
              >
                <Icon className="w-6 h-6 shrink-0" />
                <span className="hidden md:block font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-auto pt-8 space-y-4">
          {user ? (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3 px-2 py-2 glass-card border-white/5 mx-[-8px]">
                <img 
                  src={user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`} 
                  alt="Avatar" 
                  className="w-10 h-10 rounded-full border border-white/20 ml-2"
                  referrerPolicy="no-referrer"
                />
                <div className="hidden md:block overflow-hidden">
                  <p className="text-xs font-bold text-white truncate">{user.displayName}</p>
                  <p className="text-[10px] text-slate-500 uppercase tracking-tighter truncate">Astral Explorer</p>
                </div>
              </div>
              <button 
                onClick={logout}
                className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-400/5 transition-all text-sm font-medium"
              >
                <LogOut className="w-5 h-5 shrink-0" />
                <span className="hidden md:block">Terminate Sync</span>
              </button>
            </div>
          ) : (
            <button 
              onClick={login}
              className="w-full py-3 rounded-xl bg-white text-black font-bold hover:scale-105 transition-all"
            >
              Sync Key
            </button>
          )}
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="ml-20 md:ml-64 p-4 md:p-12 relative">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-6xl mx-auto"
        >
          {children}
        </motion.div>
      </main>

      {/* Floating Particles Decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-[-1]">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white/10 blur-xl"
            initial={{ 
              x: Math.random() * 100 + "%", 
              y: Math.random() * 100 + "%",
              width: Math.random() * 200 + 50 + "px",
              height: Math.random() * 200 + 50 + "px"
            }}
            animate={{ 
              y: [null, Math.random() * 100 + "%"],
              x: [null, Math.random() * 100 + "%"],
            }}
            transition={{ 
              duration: Math.random() * 20 + 20, 
              repeat: Infinity, 
              ease: "linear" 
            }}
          />
        ))}
      </div>
    </div>
  );
}
