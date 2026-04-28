let audioCtx = null;

export function playWakeChime() {
  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }

    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(0, audioCtx.currentTime);
    masterGain.gain.linearRampToValueAtTime(0.2, audioCtx.currentTime + 0.05);
    masterGain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);
    masterGain.connect(audioCtx.destination);

    // Friendly "Double Ping" - Siri/Google style
    const osc1 = audioCtx.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(880, audioCtx.currentTime); // A5
    osc1.frequency.exponentialRampToValueAtTime(1320, audioCtx.currentTime + 0.1); // E6
    
    osc1.connect(masterGain);
    osc1.start();
    osc1.stop(audioCtx.currentTime + 0.5);

    const osc2 = audioCtx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(1100, audioCtx.currentTime + 0.08); // C#6
    osc2.frequency.exponentialRampToValueAtTime(1760, audioCtx.currentTime + 0.18); // A6
    
    osc2.connect(masterGain);
    osc2.start(audioCtx.currentTime + 0.08);
    osc2.stop(audioCtx.currentTime + 0.5);

  } catch (e) {
    console.warn("Failed to play chime:", e);
  }
}
