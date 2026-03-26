import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { useRef } from "react";
import {
  Mic,
  MonitorPlay,
  BellRing,
  Keyboard,
  Download,
  Play,
  Activity,
  AudioLines,
  Command,
  Zap
} from "lucide-react";

/* ────────────────────────────────────────────
   Download Helper 
   ──────────────────────────────────────────── */
const handleDownloadClick = () => {
  fetch("https://github.com/Pranesh-I/voice-workflow-assistant/releases/download/v1.0/Nova_0.1.0_x64-setup.exe", { method: "HEAD" })
    .catch(() => console.warn("Installer not found. Check release tag name."));
};

function SignalRings() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
       {[1, 2, 3].map((i) => (
         <motion.div
           key={i}
           className="absolute rounded-full border border-energy-teal/10"
           initial={{ width: 150, height: 150, opacity: 0 }}
           animate={{ width: 1000, height: 1000, opacity: [0, 0.4, 0] }}
           transition={{ duration: 6, repeat: Infinity, delay: i * 2, ease: "linear" }}
         />
       ))}
    </div>
  );
}

/* ────────────────────────────────────────────
   Navbar
   ──────────────────────────────────────────── */
function Navbar() {
  return (
    <motion.nav 
      initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-50 px-6 py-6 pointer-events-none"
    >
       <div className="max-w-7xl mx-auto flex items-center justify-between pointer-events-auto">
          <div className="flex items-center gap-3">
             <div className="w-9 h-9 rounded-full glass-blur flex items-center justify-center premium-shadow">
               <AudioLines size={16} className="text-energy-violet" />
             </div>
             <span className="text-graphite-dark font-semibold text-[15px] tracking-tight">Nova</span>
          </div>
          <div className="glass-blur px-8 py-3 rounded-full hidden md:flex items-center gap-10 text-[13px] font-semibold text-graphite-light premium-shadow">
             <a href="#problem" className="hover:text-energy-violet transition-colors duration-300">Vision</a>
             <a href="#features" className="hover:text-energy-violet transition-colors duration-300">Architecture</a>
             <a href="#download" className="hover:text-energy-teal transition-colors duration-300">Download</a>
          </div>
       </div>
    </motion.nav>
  );
}

/* ────────────────────────────────────────────
   Hero Section
   ──────────────────────────────────────────── */
function Hero() {
  const { scrollY } = useScroll();
  const yLogos = useTransform(scrollY, [0, 500], [0, -120]);
  const scaleLogos = useTransform(scrollY, [0, 500], [1.3, 0.8]);
  const opacityHeader = useTransform(scrollY, [0, 250, 450], [0, 0.5, 1]);
  const yHeader = useTransform(scrollY, [0, 500], [60, 0]);

  return (
    <section className="relative min-h-[120vh] flex flex-col items-center pt-48 px-6 max-w-5xl mx-auto w-full">
      {/* Background Energy Radial Fog */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vw] h-[120vw] max-w-[1400px] max-h-[1400px] energy-bloom pointer-events-none -z-10" />
      <SignalRings />

      <motion.div 
        style={{ y: yLogos, scale: scaleLogos }}
        className="relative z-20 flex flex-col items-center justify-center mt-32 sm:mt-40"
      >
         {/* Futuristic Glowing Pulse Logo */}
         <div className="relative flex items-center justify-center group">
            <div className="absolute w-32 h-32 bg-white rounded-full blur-2xl opacity-60 animate-pulse-slow mix-blend-overlay" />
            <div className="absolute w-56 h-56 rounded-full bg-gradient-to-tr from-energy-teal to-energy-violet blur-[40px] opacity-30 animate-pulse-slow" />
            <div className="w-20 h-20 rounded-full glass-blur flex items-center justify-center border-white/60 shadow-[0_16px_40px_rgba(0,0,0,0.06)] relative z-10 bg-white/60 group-hover:scale-105 transition-transform duration-700">
               <AudioLines size={32} className="text-energy-violet" />
            </div>
         </div>
      </motion.div>

      <motion.div 
        style={{ opacity: opacityHeader, y: yHeader }}
        className="mt-20 text-center relative z-20 flex flex-col items-center max-w-3xl mx-auto"
      >
         <h1 className="text-5xl sm:text-6xl md:text-[80px] font-bold tracking-[-0.03em] leading-[1.05] text-graphite-dark mb-8">
            Your workflow should <br className="hidden sm:block"/>
            <span className="text-gradient">respond to you.</span>
         </h1>
         
         <p className="text-lg sm:text-xl text-graphite-light max-w-lg leading-relaxed mb-12 font-medium">
            Control apps, reminders, and tasks instantly using natural speech. A futuristic workflow companion that adapts to you.
         </p>
         
         <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <a 
              href="https://github.com/Pranesh-I/voice-workflow-assistant/releases/download/v1.0/Nova_0.1.0_x64-setup.exe"
              download
              onClick={handleDownloadClick}
              className="btn-primary"
            >
              <Download size={18} /> Download for Windows
            </a>
            <a href="#how-it-works" className="text-graphite font-semibold flex items-center gap-2 transition-all duration-300 hover:text-energy-violet hover:translate-x-1">
              Watch how it works <Play size={16} className="ml-1 opacity-70"/>
            </a>
         </div>
      </motion.div>
    </section>
  );
}

/* ────────────────────────────────────────────
   Section 2 — Problem Experience Layer
   ──────────────────────────────────────────── */
function ProblemSection() {
  const statements = [
    "Switching apps breaks focus.",
    "Typing interrupts thinking.",
    "Reminders get forgotten."
  ];

  return (
    <section id="problem" className="py-40 px-6 max-w-4xl mx-auto relative w-full flex flex-col items-center z-20">
       <div className="absolute inset-0 bg-gradient-to-b from-transparent via-mist-fog/80 to-transparent -z-10 blur-3xl rounded-full opacity-60 pointer-events-none" />
       
       <div className="flex flex-col gap-16 sm:gap-24 w-full">
         {statements.map((stmt, i) => (
           <motion.div 
             key={i}
             initial={{ opacity: 0, filter: "blur(16px)", y: 50, x: i % 2 === 0 ? -40 : 40 }}
             whileInView={{ opacity: 1, filter: "blur(0px)", y: 0, x: 0 }}
             viewport={{ once: true, margin: "-100px" }}
             transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
             className={`text-3xl sm:text-4xl lg:text-[56px] font-semibold tracking-[-0.04em] text-graphite-dark/90 ${i === 1 ? 'text-center sm:text-right text-energy-violet' : 'text-center sm:text-left'}`}
           >
             {stmt}
           </motion.div>
         ))}
       </div>
    </section>
  );
}

/* ────────────────────────────────────────────
   Section 3 — Assistant Activation Layer
   ──────────────────────────────────────────── */
function ActivationLayer() {
  const commands = [
    "“Open YouTube”",
    "“Remind me at 6 PM”",
    "“Start focus mode”",
    "“Launch VS Code”"
  ];

  return (
    <section id="how-it-works" className="py-40 px-6 max-w-5xl mx-auto w-full relative z-20">
       <div className="text-center mb-32">
         <motion.h2 
           initial={{ opacity: 0, filter: "blur(12px)", y: 20 }} 
           whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }} 
           viewport={{ once: true }} 
           transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }} 
           className="text-4xl sm:text-[56px] font-bold tracking-[-0.03em] text-graphite-dark"
         >
           The calm <span className="text-gradient">invisible helper.</span>
         </motion.h2>
       </div>
       
       <div className="flex flex-col gap-8 items-center relative">
         {/* Glowing cursor pulse indicator */}
         <div className="absolute left-1/2 -translate-x-1/2 -top-16 w-1.5 h-10 rounded-full bg-energy-teal shadow-[0_0_20px_#00d2ff] animate-pulse" />
         <div className="absolute left-1/2 -translate-x-1/2 top-[-24px] bottom-0 w-[1px] bg-gradient-to-b from-energy-teal via-energy-violet/30 to-transparent -z-10 opacity-60" />

         {commands.map((cmd, i) => (
            <motion.div 
               key={i}
               initial={{ opacity: 0, scale: 0.9, y: 30 }}
               whileInView={{ opacity: 1, scale: 1, y: 0 }}
               viewport={{ once: true, margin: "-100px" }}
               transition={{ duration: 1, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
               className="glass-blur bg-white/70 px-8 sm:px-10 py-6 rounded-3xl w-full max-w-lg flex items-center justify-between group glow-hover premium-shadow"
            >
               <span className="text-lg sm:text-2xl font-semibold text-graphite-dark tracking-tight">{cmd}</span>
               <div className="w-10 h-10 flex items-center justify-center rounded-full bg-mist-bg opacity-0 group-hover:opacity-100 transition-opacity duration-500 shadow-sm border border-energy-teal/20">
                 <span className="w-2.5 h-2.5 rounded-full bg-energy-teal shadow-[0_0_12px_#00d2ff]" />
               </div>
            </motion.div>
         ))}
       </div>
    </section>
  );
}

/* ────────────────────────────────────────────
   Section 4 — Feature Flow Strip
   ──────────────────────────────────────────── */
function FeatureFlow() {
  const features = [
    { title: "Voice Recognition", desc: "Whisper or speak naturally. Intelligent intent mapping parses complex linguistic structures.", icon: Mic },
    { title: "Smart Reminders", desc: "Temporal context is automatically scheduled without lifting a finger.", icon: BellRing },
    { title: "Instant Automation", desc: "Complex multi-application workflows triggered seamlessly from a single sentence.", icon: Activity },
    { title: "Shortcut Activation", desc: "Summon instantly anywhere via a global system-level local hotkey.", icon: Command },
  ];

  return (
    <section id="features" className="py-40 px-6 w-full relative z-20 overflow-hidden">
      <div className="max-w-7xl mx-auto relative">
         {/* Neural pathway connecting line */}
         <div className="absolute top-[80px] left-[10%] right-[10%] h-[1px] bg-gradient-to-r from-transparent via-energy-violet/20 to-transparent hidden md:block" />

         <div className="flex flex-col md:flex-row items-start justify-between gap-12 sm:gap-16 relative">
            {features.map((f, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, filter: "blur(12px)", y: 40 }}
                whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1.2, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col items-center md:items-start text-center md:text-left flex-1"
              >
                 <div className="w-20 h-20 rounded-[28px] glass-blur bg-white/90 flex items-center justify-center border-white mb-8 relative group glow-hover premium-shadow">
                    <div className="absolute inset-0 rounded-[28px] bg-energy-teal/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    <f.icon size={28} className="text-energy-violet relative z-10" />
                 </div>
                 <h3 className="text-2xl font-bold text-graphite-dark tracking-tight mb-3">{f.title}</h3>
                 <p className="text-graphite-light text-base leading-relaxed font-medium">{f.desc}</p>
              </motion.div>
            ))}
         </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────
   Section 5 — Lightweight Desktop Performance
   ──────────────────────────────────────────── */
function PerformanceStats() {
  return (
    <section className="py-24 px-6 max-w-5xl mx-auto w-full text-center relative z-20">
       <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
          {[
            { tag: "Fast Launch", icon: Zap },
            { tag: "Minimal Memory", icon: Download },
            { tag: "Offline Modules", icon: MonitorPlay },
            { tag: "Privacy-friendly", icon: Keyboard }
          ].map((stat, i) => (
             <motion.div
               key={i}
               initial={{ opacity: 0, filter: "blur(8px)", y: 20 }}
               whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 0.8, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
               className="glass-blur px-8 py-4 rounded-full border-energy-lavender/40 bg-white/70 text-graphite-dark font-semibold tracking-wide shadow-sm hover:-translate-y-1 hover:shadow-lg transition-all cursor-default flex items-center gap-3"
             >
               <stat.icon size={16} className="text-energy-teal" />
               {stat.tag}
             </motion.div>
          ))}
       </div>
    </section>
  );
}

/* ────────────────────────────────────────────
   Section 6 — Download Experience Panel
   ──────────────────────────────────────────── */
function DownloadPanel() {
  return (
    <section id="download" className="py-40 px-6 max-w-4xl mx-auto w-full relative z-20">
       <motion.div 
         initial={{ opacity: 0, filter: "blur(20px)", y: 50, scale: 0.95 }}
         whileInView={{ opacity: 1, filter: "blur(0px)", y: 0, scale: 1 }}
         viewport={{ once: true }}
         transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
         className="p-16 sm:p-24 rounded-[48px] premium-shadow text-center relative overflow-hidden group bg-white/60 backdrop-blur-3xl border border-white"
       >
          <div className="absolute inset-0 bg-gradient-to-tr from-energy-teal/15 via-transparent to-energy-violet/15 opacity-50 group-hover:opacity-100 transition-opacity duration-1000" />
          
          <h2 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-graphite-dark tracking-tight relative z-10 mb-12 leading-[1.05]">
            Bring intelligence <br/>to your desktop.
          </h2>
          
          <a
            href="https://github.com/Pranesh-I/voice-workflow-assistant/releases/download/v1.0/Nova_0.1.0_x64-setup.exe"
            download
            className="btn-primary inline-flex mx-auto relative z-10 text-lg px-12 py-5"
            onClick={handleDownloadClick}
          >
            <Download size={20} className="mr-1"/> Download Desktop App
          </a>

          <div className="mt-16 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-[15px] font-semibold text-graphite-light relative z-10">
            <span>Lightweight</span>
            <span className="w-1 h-1 rounded-full bg-graphite-light/30" />
            <span>Fast execution</span>
            <span className="w-1 h-1 rounded-full bg-graphite-light/30" />
            <span>Runs locally</span>
          </div>
       </motion.div>
    </section>
  );
}

/* ────────────────────────────────────────────
   Footer
   ──────────────────────────────────────────── */
function Footer() {
  return (
    <footer className="py-12 px-6 border-t border-black/[0.03] flex flex-col md:flex-row items-center justify-between gap-6 max-w-7xl mx-auto w-full text-sm font-medium text-graphite-light relative z-20">
       <div className="flex items-center gap-3">
         <AudioLines size={16} className="text-energy-violet" />
         <span className="tracking-wide text-graphite-dark">Nova Virtual Assistant</span>
       </div>
       <div className="flex items-center gap-8">
         <a href="https://github.com/Pranesh-I/voice-workflow-assistant" target="_blank" rel="noopener noreferrer" className="hover:text-energy-violet transition-colors duration-300">
            GitHub
         </a>
         <span className="opacity-60">Crafted by Pranesh</span>
       </div>
    </footer>
  );
}

/* ────────────────────────────────────────────
   Main Application
   ──────────────────────────────────────────── */
export default function App() {
  return (
    <div className="relative min-h-screen selection:bg-energy-teal/20 selection:text-graphite-dark overflow-hidden">
       {/* Global Light Layer Elements */}
       <div className="noise-overlay" />
       
       <Navbar />
       <main className="relative z-10 flex flex-col items-center">
         <Hero />
         <ProblemSection />
         <ActivationLayer />
         <FeatureFlow />
         <PerformanceStats />
         <DownloadPanel />
       </main>
       <Footer />
    </div>
  );
}
