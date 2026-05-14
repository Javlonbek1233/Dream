import { useState, useEffect } from "react";
import { collection, query, where, orderBy, onSnapshot, limit } from "firebase/firestore";
import { db } from "../lib/firebase";
import { motion, AnimatePresence } from "motion/react";
import { Globe, Heart, MessageSquare } from "lucide-react";
import { formatDate } from "../lib/utils";

export function Community() {
  const [dreams, setDreams] = useState<any[]>([]);

  useEffect(() => {
    // In a real app, you'd mark dreams as public. For this demo, let's show all for "community"
    const q = query(
      collection(db, "dreams"),
      orderBy("metadata.timestamp", "desc"),
      limit(20)
    );
    return onSnapshot(q, (snapshot) => {
      setDreams(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
  }, []);

  return (
    <div className="space-y-12">
      <header className="space-y-2">
        <div className="flex items-center gap-3 text-indigo-400 mb-2">
          <Globe className="w-6 h-6" />
          <span className="font-bold tracking-[0.3em] uppercase text-[10px]">Nexus Void</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight italic font-serif">The Collective <span className="text-white/20">Subconscious</span></h1>
        <p className="text-slate-400 text-lg max-w-2xl font-light italic">Visions shared from across the neural network. Peek into the dreams of others.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence>
          {dreams.map((dream, i) => (
            <motion.div
              key={dream.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className="glass-card p-0 overflow-hidden group hover:border-purple-500/30 transition-all cursor-pointer"
            >
              <div className="aspect-[4/5] relative">
                <img 
                  src={dream.visualization?.imageUrl} 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000"
                  alt="Community Dream"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#05020a] via-black/20 to-transparent z-10" />
                
                <div className="absolute bottom-0 left-0 right-0 p-8 space-y-4 z-20">
                   <div className="flex items-center gap-2">
                     <span className="w-1.5 h-1.5 bg-purple-500 rounded-full shadow-[0_0_10px_#a855f7]" />
                     <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{dream.analysis?.category}</span>
                   </div>
                   <p className="text-lg font-medium leading-snug line-clamp-3 italic text-white/90">"{dream.content}"</p>
                   <div className="flex items-center justify-between pt-4 border-t border-white/10">
                     <div className="flex items-center gap-4 text-[10px] uppercase font-bold text-slate-500 tracking-tighter">
                       <span className="flex items-center gap-1.5 text-pink-400/80"><Heart className="w-3 h-3 fill-current" /> {Math.floor(Math.random() * 50) + 12}</span>
                       <span className="flex items-center gap-1.5"><MessageSquare className="w-3 h-3" /> {Math.floor(Math.random() * 10) + 2}</span>
                     </div>
                     <span className="text-[10px] text-slate-600 uppercase font-medium font-mono">{formatDate(dream.metadata.timestamp?.toDate())}</span>
                   </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
