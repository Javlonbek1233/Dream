import { BookOpen, Zap, Moon, Eye, Brain } from "lucide-react";
import { motion } from "motion/react";

export function LucidGuide() {
  const steps = [
    {
      title: "Reality Checking",
      desc: "Perform 10+ reality checks daily (e.g., trying to push a finger through your palm).",
      icon: Eye
    },
    {
      title: "Mnemonic Induction (MILD)",
      desc: "Repeatedly tell yourself 'I will know I'm dreaming' as you fall asleep.",
      icon: Zap
    },
    {
      title: "Wake Back to Bed (WBTB)",
      desc: "Set an alarm for 5 hours after sleep, stay awake for 20 mins, then return to bed.",
      icon: Moon
    },
    {
      title: "Dream Journaling",
      desc: "Record every dream immediately upon waking to strengthen recall (use DreamScape!).",
      icon: Brain
    }
  ];

  return (
    <div className="space-y-12">
      <header className="space-y-2">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">The Architect's Guide</h1>
        <p className="text-slate-400 text-lg max-w-2xl">Master the art of lucid dreaming and take control of your neural theatre.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {steps.map((step, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-8 rounded-[32px] bg-white/5 border border-white/10 flex gap-6 hover:bg-white/10 transition-all cursor-default"
          >
            <div className="w-16 h-16 shrink-0 rounded-2xl bg-purple-500/10 flex items-center justify-center">
              <step.icon className="w-8 h-8 text-purple-400" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold">{step.title}</h3>
              <p className="text-slate-400 leading-relaxed font-light">{step.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="p-12 rounded-[40px] bg-gradient-to-br from-indigo-600/20 to-purple-600/20 border border-white/10 text-center space-y-6">
        <h2 className="text-3xl font-bold italic">"The dream is real while it lasts. Can we say more of life?"</h2>
        <p className="text-slate-400 max-w-xl mx-auto italic">Start your journey into the conscious subconscious tonight.</p>
      </div>
    </div>
  );
}
