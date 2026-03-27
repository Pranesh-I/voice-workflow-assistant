import { motion, useScroll, useTransform, useInView, useMotionValue, useSpring } from "framer-motion";
import { useRef, useEffect, useCallback, useState } from "react";
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
  Zap,
  ArrowRight,
  Shield,
  Cpu,
  Sparkles
} from "lucide-react";

/* ────────────────────────────────────────────
   Download Helper 
   ──────────────────────────────────────────── */
const handleDownloadClick = () => {
  fetch("https://github.com/Pranesh-I/voice-workflow-assistant/releases/download/v1.0/Nova_0.1.0_x64-setup.exe", { method: "HEAD" })
    .catch(() => console.warn("Installer not found. Check release tag name."));
};

/* ────────────────────────────────────────────
   Interactive Particles (Advanced Space Filler)
   ──────────────────────────────────────────── */
function InteractiveParticles() {
  const canvasRef = useRef(null);
  const mouse = useRef({ x: -1000, y: -1000 });
  const particles = useRef([]);
  const raf = useRef(null);

  const initParticles = useCallback((w, h) => {
    const count = Math.min(100, Math.floor((w * h) / 14000));
    particles.current = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.5 + 0.5,
      opacity: Math.random() * 0.3 + 0.1,
    }));
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let w = window.innerWidth;
    let h = document.documentElement.scrollHeight;

    const resize = () => {
      w = window.innerWidth;
      h = document.documentElement.scrollHeight;
      canvas.width = w;
      canvas.height = h;
      if (particles.current.length === 0) initParticles(w, h);
    };
    resize();

    const onMouse = (e) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY + window.scrollY;
    };
    const onLeave = () => { mouse.current.x = -1000; mouse.current.y = -1000; };

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMouse);
    document.addEventListener("mouseleave", onLeave);

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const mx = mouse.current.x;
      const my = mouse.current.y;
      const INTERACT_RADIUS = 120;
      const LINE_DIST = 100;

      particles.current.forEach((p) => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;

        const dx = p.x - mx;
        const dy = p.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < INTERACT_RADIUS && dist > 0) {
          const force = (INTERACT_RADIUS - dist) / INTERACT_RADIUS;
          const angle = Math.atan2(dy, dx);
          p.x += Math.cos(angle) * force * 1.5;
          p.y += Math.sin(angle) * force * 1.5;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(139, 92, 246, ${p.opacity})`;
        ctx.fill();
      });

      for (let i = 0; i < particles.current.length; i++) {
        for (let j = i + 1; j < particles.current.length; j++) {
          const a = particles.current[i];
          const b = particles.current[j];
          const dist = Math.sqrt((a.x - b.x)**2 + (a.y - b.y)**2);
          if (dist < LINE_DIST) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(61, 220, 255, ${0.05 * (1 - dist / LINE_DIST)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      raf.current = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouse);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, [initParticles]);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-[1]" />;
}

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
          <div className="flex items-center gap-3 group">
             <div className="w-9 h-9 rounded-full glass-blur flex items-center justify-center premium-shadow group-hover:scale-110 transition-transform duration-500">
               <img src="/image.png" alt="Sonix" className="w-6 h-6 object-contain drop-shadow-sm group-hover:scale-110 transition-transform duration-500" />
             </div>
             <span className="text-transparent bg-clip-text bg-gradient-to-r from-energy-teal via-energy-violet to-energy-teal font-extrabold text-[18px] tracking-tight bg-[length:200%_auto] animate-gradient">Sonix</span>
          </div>
          <div className="glass-blur px-8 py-3 rounded-full hidden md:flex items-center gap-10 text-[13px] font-semibold text-graphite-light premium-shadow hover:shadow-lg hover:bg-white/70 transition-all duration-500">
             <a href="#problem" className="relative hover:text-energy-violet transition-colors duration-300 after:absolute after:bottom-[-6px] after:left-0 after:w-0 after:h-[2px] after:bg-energy-violet after:rounded-full hover:after:w-full after:transition-all after:duration-300">Vision</a>
             <a href="#features" className="relative hover:text-energy-violet transition-colors duration-300 after:absolute after:bottom-[-6px] after:left-0 after:w-0 after:h-[2px] after:bg-energy-violet after:rounded-full hover:after:w-full after:transition-all after:duration-300">Architecture</a>
             <a href="#download" className="relative hover:text-energy-teal transition-colors duration-300 after:absolute after:bottom-[-6px] after:left-0 after:w-0 after:h-[2px] after:bg-energy-teal after:rounded-full hover:after:w-full after:transition-all after:duration-300">Download</a>
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
  const yLogos = useTransform(scrollY, [0, 500], [0, 80]);
  const scaleLogos = useTransform(scrollY, [0, 500], [1, 0.9]);

  return (
    <>
    {/* Screen 1: The Logo Entrance */}
    <section className="relative min-h-[100svh] flex flex-col items-center justify-center px-6 max-w-5xl mx-auto w-full z-20">
      {/* Background Energy Radial Fog */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vw] h-[120vw] max-w-[1400px] max-h-[1400px] energy-bloom pointer-events-none -z-10 opacity-70" />
      <SignalRings />

      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        style={{ y: yLogos, scale: scaleLogos }}
        className="relative z-20 flex flex-col items-center justify-center cursor-default shrink-0 mt-32"
      >
         {/* Futuristic Glowing Pulse Logo - High Effort Environment */}
         <div className="relative flex items-center justify-center group">
            {/* Orbital Rings Layer */}
            <motion.div 
               animate={{ rotate: 360 }}
               transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
               className="absolute w-[300px] h-[300px] rounded-full border border-black/[0.03] -z-10 group-hover:border-energy-teal/10 transition-colors duration-700"
            />
            <motion.div 
               animate={{ rotate: -360 }}
               transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
               className="absolute w-[450px] h-[450px] rounded-full border border-black/[0.01] -z-10 group-hover:border-energy-violet/5 transition-colors duration-700"
            />
            
            <div className="absolute w-32 h-32 bg-white rounded-full blur-2xl opacity-60 animate-pulse-slow mix-blend-overlay group-hover:scale-150 transition-transform duration-1000" />
            
            {/* Massive deep radial glow behind the emblem */}
            <div className="absolute w-64 h-64 rounded-full bg-gradient-to-tr from-energy-teal to-energy-violet blur-[50px] opacity-20 animate-pulse-slow group-hover:opacity-50 transition-opacity duration-1000" />
            
            {/* Inner dynamic ring with reactive scaling */}
            <motion.div 
               whileHover={{ scale: 1.4, opacity: 0.8 }}
               className="absolute w-[120px] h-[120px] rounded-full border-[0.5px] border-energy-teal/30 opacity-0 group-hover:opacity-100 transition-all duration-1000" 
            />
            
            <div className="w-32 h-32 sm:w-[160px] sm:h-[160px] rounded-[40px] glass-blur flex items-center justify-center border-white/60 shadow-[0_20px_60px_rgba(0,0,0,0.08)] relative z-10 bg-white/60 group-hover:scale-[1.1] group-hover:shadow-[0_30px_100px_rgba(139,92,246,0.35)] group-hover:border-energy-teal/30 group-hover:-translate-y-4 transition-all duration-1000 ease-[0.16,1,0.3,1] backdrop-blur-3xl overflow-hidden">
               {/* Internal glowing sweep for the advanced finish */}
               <div className="absolute inset-0 bg-gradient-to-tr from-energy-teal/0 via-energy-violet/20 to-energy-teal/0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 blur-2xl z-0" />
               <img src="/image.png" alt="Sonix Logo" className="w-24 h-24 sm:w-32 sm:h-32 object-contain mix-blend-multiply drop-shadow-[0_12px_24px_rgba(61,220,255,0.2)] group-hover:scale-105 group-hover:rotate-3 transition-all duration-1000 ease-[0.16,1,0.3,1] relative z-10" />
            </div>
         </div>
         
         {/* Cinematic Premium Product Title directly below the logo */}
         <div className="mt-10 sm:mt-14 relative flex flex-col items-center group cursor-default">
            {/* Ambient deep sweep glow behind the text */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-gradient-to-r from-energy-teal/0 via-energy-violet/20 to-energy-teal/0 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />
            
            <motion.h2 
               initial={{ tracking: "0.1em", opacity: 0 }}
               whileInView={{ tracking: "-0.04em", opacity: 1 }}
               transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
               className="text-7xl sm:text-8xl md:text-[110px] font-display font-black text-graphite-dark group-hover:scale-[1.02] group-hover:drop-shadow-[0_10px_40px_rgba(139,92,246,0.3)] transition-all duration-1000 leading-none text-center mix-blend-multiply"
            >
               Sonix <span className="text-transparent bg-clip-text bg-gradient-to-r from-energy-teal via-energy-violet to-energy-teal animate-gradient bg-[length:300%_auto]">Voice</span>
            </motion.h2>
            
            <div className="mt-3 sm:mt-5 text-sm sm:text-lg font-bold tracking-[0.3em] sm:tracking-[0.4em] text-graphite-light/70 uppercase relative px-4">
               <span className="group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-energy-violet group-hover:to-energy-teal transition-all duration-700">
                 Assistant
               </span>
               {/* Growing underline on hover */}
               <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-gradient-to-r from-transparent via-energy-teal to-transparent group-hover:w-[150%] transition-all duration-1000 opacity-50" />
            </div>
         </div>
      </motion.div>
      
      {/* Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1.5 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 w-[1px] h-16 bg-gradient-to-b from-energy-violet to-transparent opacity-60 hidden sm:block"
      />
    </section>

    {/* Screen 2: The Pitch */}
    <section className="relative min-h-[70svh] flex flex-col items-center justify-center pt-20 pb-32 px-6 max-w-5xl mx-auto w-full z-20">
      <motion.div 
        initial={{ opacity: 0, y: 50, filter: "blur(10px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="text-center relative z-20 flex flex-col items-center max-w-3xl mx-auto"
      >
         <motion.div
           initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
           className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full glass-blur border-energy-teal/20 text-xs font-bold text-energy-teal tracking-wide shadow-sm mb-6 cursor-default hover:border-energy-teal/40 hover:bg-white/80 transition-all duration-300 uppercase"
         >
           <Sparkles size={14} className="text-energy-teal" /> AI-POWERED WORKFLOW
         </motion.div>
         <motion.h1 
           initial={{ letterSpacing: "0.08em", opacity: 0, y: 30 }}
           whileInView={{ letterSpacing: "-0.05em", opacity: 1, y: 0 }}
           transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
           className="text-6xl sm:text-7xl md:text-[96px] font-black leading-[0.95] text-graphite-dark mb-8 cursor-default group"
         >
            Your voice is the <br className="hidden sm:block"/>
            <span className="text-gradient hover:brightness-125 transition-all duration-500 block sm:inline mt-2 sm:mt-0">ultimate shortcut.</span>
         </motion.h1>
         
         <p className="text-xl sm:text-2xl text-graphite-light max-w-2xl leading-relaxed mb-10 font-medium cursor-default hover:text-graphite-dark hover:tracking-[0.01em] transition-all duration-500">
            Control apps, reminders, and tasks instantly using natural speech. A futuristic companion that just works.
         </p>
         
         <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full px-4">
            <a 
              href="https://github.com/Pranesh-I/voice-workflow-assistant/releases/download/v1.0/Nova_0.1.0_x64-setup.exe"
              download
              onClick={handleDownloadClick}
              className="btn-primary group relative overflow-hidden py-3 px-8 text-[15px]"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 rounded-[inherit]" />
              <Download size={18} className="relative z-10 group-hover:-translate-y-0.5 group-hover:scale-110 transition-transform duration-300" /> 
              <span className="relative z-10 group-hover:text-energy-teal transition-colors duration-300">Download for Windows</span>
            </a>
            <a href="#how-it-works" className="group text-graphite font-semibold text-[15px] flex items-center gap-2 transition-all duration-300 hover:text-energy-violet bg-white/40 hover:bg-white/60 border border-white/50 hover:border-energy-violet/30 px-6 py-3 rounded-full shadow-sm hover:shadow-lg backdrop-blur-md">
              Watch how it works <Play size={16} className="ml-1 opacity-70 group-hover:translate-x-1 group-hover:opacity-100 group-hover:text-energy-teal transition-all duration-300"/>
            </a>
         </div>
      </motion.div>
    </section>
    </>
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
    <section id="problem" className="py-20 px-6 max-w-4xl mx-auto relative w-full flex flex-col items-center z-20">
       <div className="absolute inset-0 bg-gradient-to-b from-transparent via-mist-fog/80 to-transparent -z-10 blur-3xl rounded-full opacity-60 pointer-events-none" />
       
       <div className="absolute -left-[50%] top-1/4 -z-10 text-[180px] font-bold text-black/[0.015] pointer-events-none whitespace-nowrap hidden lg:block tracking-tighter">
         VOICE AUTOMATION
       </div>

       <div className="flex flex-col gap-10 sm:gap-14 w-full">
         {statements.map((stmt, i) => (
           <motion.div 
             key={i}
             initial={{ opacity: 0, filter: "blur(20px)", y: 60, x: i % 2 === 0 ? -80 : 80, rotateY: i % 2 === 0 ? -20 : 20 }}
             whileInView={{ opacity: 1, filter: "blur(0px)", y: 0, x: 0, rotateY: 0 }}
             viewport={{ once: true, margin: "-100px" }}
             transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
             className={`cursor-default hover:scale-[1.02] hover:-translate-y-1 transition-all duration-500 text-3xl sm:text-4xl lg:text-[56px] font-semibold tracking-[-0.04em] text-graphite-dark/90 ${i === 1 ? 'text-center sm:text-right text-transparent bg-clip-text bg-gradient-to-r from-energy-violet to-energy-teal' : 'text-center sm:text-left hover:text-graphite-dark/100'}`}
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
    <section id="how-it-works" className="py-24 px-6 max-w-5xl mx-auto w-full relative z-20">
       <div className="text-center mb-20 relative">
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-32 bg-energy-teal/5 blur-[60px] -z-10" />
         <motion.h2 
           initial={{ opacity: 0, filter: "blur(12px)", y: 20 }} 
           whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }} 
           viewport={{ once: true }} 
           transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }} 
           className="text-4xl sm:text-[48px] font-bold tracking-[-0.03em] text-graphite-dark cursor-default hover:scale-[1.02] hover:-translate-y-1 transition-all duration-500"
         >
           The calm <span className="text-gradient hover:brightness-125 transition-all duration-500">invisible helper.</span>
         </motion.h2>
       </div>
       
       <div className="flex flex-col gap-5 items-center relative">
         {/* Glowing cursor pulse indicator */}
         <div className="absolute left-1/2 -translate-x-1/2 -top-10 w-1.5 h-8 rounded-full bg-energy-teal shadow-[0_0_20px_#00d2ff] animate-pulse" />
         <div className="absolute left-1/2 -translate-x-1/2 top-[-16px] bottom-0 w-[1px] bg-gradient-to-b from-energy-teal via-energy-violet/30 to-transparent -z-10 opacity-60" />

         {commands.map((cmd, i) => (
            <motion.div 
               key={i}
               initial={{ opacity: 0, scale: 0.8, y: 40, rotateX: -60, filter: "blur(10px)" }}
               whileInView={{ opacity: 1, scale: 1, y: 0, rotateX: 0, filter: "blur(0px)" }}
               whileHover={{ scale: 1.05, rotateX: 5, rotateY: 2, y: -5 }}
               viewport={{ once: true, margin: "-100px" }}
               transition={{ duration: 1, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
               className="relative overflow-hidden glass-blur bg-white/70 px-8 sm:px-10 py-6 rounded-3xl w-full max-w-lg flex items-center justify-between group glow-hover premium-shadow cursor-default perspective-1000"
            >
               {/* Hover sweeper line */}
               <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-energy-teal to-energy-violet opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
               <div className="absolute inset-0 bg-gradient-to-r from-energy-teal/5 to-transparent opacity-0 group-hover:opacity-100 -translate-x-full group-hover:translate-x-0 transition-all duration-700 ease-out z-0" />

               <span className="text-lg sm:text-2xl font-semibold text-graphite-dark tracking-tight relative z-10 group-hover:text-energy-violet transition-colors duration-300">{cmd}</span>
               
               <div className="w-10 h-10 flex items-center justify-center rounded-full bg-mist-bg opacity-0 group-hover:opacity-100 transition-all duration-500 shadow-sm border border-energy-teal/20 group-hover:scale-110 group-hover:-translate-y-1 relative z-10 bg-white">
                 <ArrowRight size={18} className="text-energy-teal" />
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
    { title: "Your Voice is the Shortcut", desc: "Forget hotkeys and menus. Summon actions instantly without ever touching your keyboard.", icon: Command },
  ];

  return (
    <section id="features" className="py-24 px-6 w-full relative z-20 overflow-hidden">
      <div className="absolute right-[-10%] top-1/4 -z-10 text-[180px] font-bold text-black/[0.015] pointer-events-none whitespace-nowrap hidden lg:block tracking-tighter mix-blend-multiply">
         CORE LOGIC
      </div>

      <div className="max-w-7xl mx-auto relative pt-10">
         <div className="absolute top-[30px] left-[10%] right-[10%] h-[1px] bg-gradient-to-r from-transparent via-energy-violet/20 to-transparent hidden md:block" />

         <div className="flex flex-col md:flex-row items-start justify-between gap-8 sm:gap-12 relative">
            {features.map((f, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.6, rotateZ: i % 2 === 0 ? -5 : 5 }}
                whileInView={{ opacity: 1, scale: 1, rotateZ: 0 }}
                viewport={{ once: true, margin: "-120px" }}
                transition={{ 
                  duration: 1.2, 
                  delay: i * 0.1, 
                  type: "spring",
                  bounce: 0.4
                }}
                className="flex flex-col items-center md:items-start text-center md:text-left flex-1 group cursor-default"
              >
                 <div className="w-20 h-20 rounded-[28px] glass-blur bg-white/80 flex items-center justify-center border-white mb-8 relative group-hover:scale-110 group-hover:-translate-y-2 group-hover:shadow-[0_24px_48px_-12px_rgba(139,92,246,0.3)] transition-all duration-500">
                    <div className="absolute inset-0 rounded-[28px] bg-gradient-to-br from-energy-teal/20 to-energy-violet/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    <f.icon size={28} className="text-energy-violet relative z-10 group-hover:text-energy-teal transition-colors duration-500" />
                 </div>
                 <h3 className="text-2xl font-bold text-graphite-dark tracking-tight mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-energy-teal group-hover:to-energy-violet transition-colors duration-500">{f.title}</h3>
                 <p className="text-graphite-light text-base leading-relaxed font-medium group-hover:text-graphite-dark transition-colors duration-300">{f.desc}</p>
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


/* ────────────────────────────────────────────
   Section 6 — Download Experience Panel
   ──────────────────────────────────────────── */
function DownloadPanel() {
  return (
    <section id="download" className="py-24 px-6 max-w-4xl mx-auto w-full relative z-20">
       <motion.div 
         initial={{ opacity: 0, scale: 1.2, filter: "blur(30px)" }}
         whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
         viewport={{ once: true }}
         transition={{ 
           duration: 1.5, 
           ease: [0.16, 1, 0.3, 1]
         }}
         className="p-12 sm:p-20 rounded-[48px] premium-shadow text-center relative overflow-hidden group bg-white/60 backdrop-blur-3xl border border-white hover:shadow-[0_40px_100px_-20px_rgba(61,220,255,0.15),0_30px_60px_-15px_rgba(139,92,246,0.1)] hover:border-energy-teal/20 transition-all duration-700"
       >
          <div className="absolute inset-0 bg-gradient-to-tr from-energy-teal/15 via-transparent to-energy-violet/15 opacity-50 group-hover:opacity-100 transition-opacity duration-1000" />
          <div className="absolute -top-20 -right-20 w-60 h-60 bg-energy-teal/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-energy-violet/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
          
          <h2 className="text-4xl sm:text-5xl lg:text-[64px] font-bold text-graphite-dark tracking-tight relative z-10 mb-10 leading-[1.05] cursor-default group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-energy-teal group-hover:via-graphite-dark group-hover:to-energy-violet transition-all duration-700">
            Bring intelligence <br/>to your desktop.
          </h2>
          
          <a
            href="https://github.com/Pranesh-I/voice-workflow-assistant/releases/download/v1.0/Nova_0.1.0_x64-setup.exe"
            download
            className="btn-primary inline-flex mx-auto relative z-10 text-lg px-12 py-5 group"
            onClick={handleDownloadClick}
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 rounded-[inherit]" />
            <Download size={20} className="mr-2 group-hover:-translate-y-1 group-hover:scale-110 transition-transform duration-300 relative z-10"/> 
            <span className="relative z-10">Download Desktop App</span>
          </a>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-[15px] font-semibold text-graphite-light relative z-10">
            <span className="cursor-default hover:text-energy-teal hover:scale-110 hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2"><Zap size={14} className="text-energy-teal" /> Lightweight</span>
            <span className="w-1 h-1 rounded-full bg-graphite-light/30" />
            <span className="cursor-default hover:text-energy-violet hover:scale-110 hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2"><Cpu size={14} className="text-energy-violet" /> Fast execution</span>
            <span className="w-1 h-1 rounded-full bg-graphite-light/30" />
            <span className="cursor-default hover:text-energy-teal hover:scale-110 hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2"><Shield size={14} className="text-energy-teal" /> Runs locally</span>
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
       <div className="flex items-center gap-3 group cursor-default">
         <img src="/image.png" alt="Sonix Logo" className="w-5 h-5 object-contain group-hover:scale-125 group-hover:rotate-12 transition-all duration-500" />
         <span className="tracking-wide text-[16px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-energy-teal to-energy-violet group-hover:from-energy-violet group-hover:to-energy-teal transition-all duration-700">Sonix Virtual Assistant</span>
       </div>
       <div className="flex items-center gap-8">
         <a href="https://github.com/Pranesh-I/voice-workflow-assistant" target="_blank" rel="noopener noreferrer" className="relative hover:text-energy-violet transition-colors duration-300 after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-energy-violet after:rounded-full hover:after:w-full after:transition-all after:duration-300 hover:scale-105">
            GitHub
         </a>
         <span className="opacity-60 cursor-default hover:opacity-100 hover:text-energy-teal transition-all duration-300">Crafted by Presadors</span>
       </div>
    </footer>
  );
}

/* ────────────────────────────────────────────
   Dynamic Mouse Light (High Effort)
   ──────────────────────────────────────────── */
function MouseFollower() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const springConfig = { damping: 40, stiffness: 200 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <motion.div
      style={{
        x: springX,
        y: springY,
        translateX: "-50%",
        translateY: "-50%",
      }}
      className="fixed top-0 left-0 w-[600px] h-[600px] bg-gradient-to-r from-energy-teal/10 to-energy-violet/10 rounded-full blur-[120px] pointer-events-none z-0 opacity-40 mix-blend-soft-light"
    />
  );
}

/* ────────────────────────────────────────────
   Main Application
   ──────────────────────────────────────────── */
export default function App() {
  return (
    <div className="relative min-h-screen selection:bg-energy-teal/20 selection:text-graphite-dark overflow-x-hidden">
       {/* Global Light Layer Elements */}
       <div className="noise-overlay" />
       
       {/* Global High Effort Mouse Bloom */}
       <MouseFollower />
       
       {/* Global Particles providing vertical rhythm and connections */}
       <InteractiveParticles />
       
       <Navbar />
       <main className="relative z-10 flex flex-col items-center">
         <Hero />
         <div className="w-full max-w-4xl mx-auto h-[1px] bg-gradient-to-r from-transparent via-energy-teal/20 to-transparent my-6" />
         <ProblemSection />
         <ActivationLayer />
         <FeatureFlow />

         <div className="w-full max-w-3xl mx-auto h-[1px] bg-gradient-to-r from-transparent via-energy-violet/10 to-transparent my-6" />
         <DownloadPanel />
       </main>
       <Footer />
    </div>
  );
}
