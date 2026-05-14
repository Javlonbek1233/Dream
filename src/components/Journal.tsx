import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Wand2, Sparkles, Send, BrainCircuit, Activity, Trash2, Heart, Share2, Loader2 } from "lucide-react";
import { db } from "../lib/firebase";
import { collection, addDoc, query, where, orderBy, onSnapshot, deleteDoc, doc, updateDoc, Timestamp } from "firebase/firestore";
import { useAuth } from "../lib/AuthContext";
import { formatDate } from "../lib/utils";

export function Journal() {
  const { user } = useAuth();
  const [content, setContent] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [dreams, setDreams] = useState<any[]>([]);
  const [selectedDream, setSelectedDream] = useState<any>(null);

  useState(() => {
    if (!user) return;
    const q = query(
      collection(db, "dreams"),
      where("userId", "==", user.uid),
      orderBy("metadata.timestamp", "desc")
    );
    return onSnapshot(q, (snapshot) => {
      setDreams(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
  });

  const startVoiceRecording = () => {
    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) return;
      
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.start();
      setIsAnalyzing(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setContent(prev => prev + (prev ? " " : "") + transcript);
        setIsAnalyzing(false);
      };
      recognition.onerror = () => setIsAnalyzing(false);
    } catch (e) {
      setIsAnalyzing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !user) return;

    setIsAnalyzing(true);
    try {
      // 1. AI Analysis
      const analysisRes = await fetch("/api/dreams/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      const analysis = await analysisRes.json();

      // 2. AI Visual Experience
      const visualRes = await fetch("/api/dreams/visualize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: analysis.visualPrompt }),
      });
      const visualData = await visualRes.json();

      // 3. Save to Firestore
      const dreamData = {
        userId: user.uid,
        content,
        analysis,
        visualization: {
          imageUrl: visualData.imageUrl,
          generatedAt: Timestamp.now(),
        },
        metadata: {
          timestamp: Timestamp.now(),
          isPublic: false,
          isFavorite: false,
          mood: 7 // Default mood
        }
      };

      await addDoc(collection(db, "dreams"), dreamData);
      setContent("");
    } catch (error) {
      console.error("Dream save error:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const toggleFavorite = async (id: string, current: boolean) => {
    await updateDoc(doc(db, "dreams", id), { "metadata.isFavorite": !current });
  };

  const deleteDream = async (id: string) => {
    await deleteDoc(doc(db, "dreams", id));
  };

  return (
    <div className="space-y-12">
      <header className="space-y-2">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">Visions of Reality</h1>
        <p className="text-slate-400 text-lg max-w-2xl">Capture your subconscious. Let the AI manifest your dreams into cinematic experiences.</p>
      </header>

      {/* Input Section */}
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 blur-3xl opacity-50 z-0" />
        <form 
          onSubmit={handleSubmit}
          className="relative z-10 glass-card p-6 md:p-8 shadow-2xl"
        >
          <div className="flex items-start gap-4 mb-4">
             <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex-shrink-0 flex items-center justify-center shadow-lg">
                <Wand2 className="w-6 h-6 text-white" />
             </div>
             <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-lg font-medium">Mirror the Subconscious</h4>
                  <button 
                    type="button"
                    onClick={startVoiceRecording}
                    className="p-2 rounded-full border border-white/10 hover:bg-white/5 transition-all text-indigo-400"
                    title="Speak your dream"
                  >
                    <Activity className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-sm text-slate-500 mb-4">Speak or type your memories. AI will construct the visual bridge.</p>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="I was flying over a forest of glass needles..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-slate-200 placeholder:text-slate-600 focus:outline-none min-h-[120px] resize-none"
                />
             </div>
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-6 pt-6 border-t border-white/5">
            <div className="flex items-center gap-6">
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Neural Mode</span>
                <span className="text-xs text-indigo-400 font-mono">Deep Synthesis</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Sync Priority</span>
                <span className="text-xs text-purple-400 font-mono">High Fidelity</span>
              </div>
            </div>
            <button
              disabled={isAnalyzing || !content.trim()}
              className="w-full md:w-auto px-8 py-4 bg-white text-black rounded-full font-bold flex items-center justify-center gap-3 hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed group active:scale-95"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Visualizing...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                  INITIATE SYNC
                </>
              )}
            </button>
          </div>
        </form>
      </section>

      {/* Dreams Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {dreams.map((dream) => (
            <motion.div
              layout
              key={dream.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="group relative glass-card p-0 overflow-hidden hover:border-indigo-500/30 transition-all cursor-pointer"
              onClick={() => setSelectedDream(dream)}
            >
              <div className="aspect-[4/5] relative">
                <img 
                  src={dream.visualization?.imageUrl} 
                  alt="Dream Visual" 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-10" />
                
                <div className="absolute bottom-0 left-0 right-0 p-8 z-20 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                       <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse" />
                       <span className="text-[10px] font-bold uppercase tracking-widest text-slate-300">
                          {dream.analysis?.category}
                       </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={(e) => { e.stopPropagation(); toggleFavorite(dream.id, dream.metadata.isFavorite); }}
                        className={cn("p-1.5 rounded-full backdrop-blur-md border border-white/10 transition-colors", dream.metadata.isFavorite ? "text-pink-500 bg-pink-500/10" : "bg-white/5 hover:text-pink-400")}
                      >
                        <Heart className={cn("w-3.5 h-3.5", dream.metadata.isFavorite && "fill-current")} />
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); deleteDream(dream.id); }}
                        className="p-1.5 bg-white/5 rounded-full backdrop-blur-md border border-white/10 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <p className="text-lg font-medium leading-snug line-clamp-2 text-white/90 font-sans italic">"{dream.content}"</p>
                  
                  <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                    <span className="text-[10px] text-slate-500 uppercase font-medium">{formatDate(dream.metadata.timestamp?.toDate())}</span>
                    <Wand2 className="w-3 h-3 text-indigo-400/50" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </section>

      {/* Dream Modal */}
      <AnimatePresence>
        {selectedDream && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 lg:p-12">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedDream(null)}
              className="absolute inset-0 bg-black/95 backdrop-blur-3xl" 
            />
            
            <motion.div
              layoutId={selectedDream.id}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative z-10 w-full max-w-6xl glass-card p-0 flex flex-col md:flex-row h-full max-h-[90vh] overflow-hidden"
            >
              <div className="w-full md:w-1/2 h-64 md:h-auto relative overflow-hidden group">
                <img 
                  src={selectedDream.visualization?.imageUrl} 
                  className="w-full h-full object-cover" 
                  alt="Dream"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#05020a] via-transparent to-transparent z-10" />
                <div className="absolute top-8 left-8 z-20">
                    <span className="nebula-text text-6xl md:text-8xl font-black opacity-10 select-none">VISION</span>
                </div>
              </div>

              <div className="flex-1 p-8 md:p-12 lg:p-16 overflow-y-auto space-y-10">
                <header className="flex items-center justify-between border-b border-white/5 pb-8">
                  <div className="space-y-1">
                    <span className="text-indigo-400 font-bold tracking-widest uppercase text-[10px]">{selectedDream.analysis?.category}</span>
                    <h2 className="text-3xl md:text-4xl font-light italic font-serif leading-tight">Architecture of Memory</h2>
                  </div>
                  <button 
                    onClick={() => setSelectedDream(null)} 
                    className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 transition-all"
                  >
                    ×
                  </button>
                </header>

                <div className="space-y-6">
                  <h4 className="text-[10px] font-bold uppercase text-slate-500 tracking-[0.3em]">Cinematic Reconstruction</h4>
                  <div className="text-xl md:text-2xl text-slate-200 leading-relaxed font-light italic border-l border-indigo-500/30 pl-8 py-2">
                    {selectedDream.analysis?.story}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-bold uppercase text-slate-500 tracking-widest">Emotion Spectrum</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedDream.analysis?.emotions?.map((emo: string) => (
                        <span key={emo} className="px-3 py-1 bg-indigo-500/10 text-indigo-300 rounded-full text-xs border border-indigo-500/20">{emo}</span>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-bold uppercase text-slate-500 tracking-widest border-b border-white/5 pb-2 inline-block">Temporal Signature</h4>
                    <div className="text-sm text-slate-200 font-mono">{formatDate(selectedDream.metadata.timestamp?.toDate())}</div>
                  </div>
                </div>

                <div className="space-y-4 pt-8 border-t border-white/5">
                  <div className="p-6 bg-indigo-600/5 rounded-2xl border border-indigo-500/20">
                     <h4 className="text-[10px] font-bold uppercase text-indigo-400 tracking-widest mb-4">AI Interpretation</h4>
                     <p className="text-slate-300 leading-relaxed font-light italic">"{selectedDream.analysis?.meaning}"</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
