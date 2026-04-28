let defaultFemaleVoice = null;

export function loadVoices() {
  if (typeof window === "undefined" || !window.speechSynthesis) return;

  const voices = window.speechSynthesis.getVoices();
  if (voices.length > 0) {
    const preferredFemaleVoices = [
      "Microsoft Zira",
      "Google English Female",
      "Google UK English Female",
      "Google US English Female",
      "Samantha",
      "Victoria",
      "Karen",
      "Moira",
      "Tessa"
    ];

    for (const name of preferredFemaleVoices) {
      const voice = voices.find(v => v.name.includes(name));
      if (voice) {
        defaultFemaleVoice = voice;
        break;
      }
    }

    if (!defaultFemaleVoice) {
      defaultFemaleVoice = voices.find(v => v.name.toLowerCase().includes("female") || v.name.toLowerCase().includes("girl"));
    }

    if (!defaultFemaleVoice) {
      // Fallback: look for a neutral/pleasing voice if no female is found
      defaultFemaleVoice = voices.find(v => v.lang.startsWith("en"));
    }
  }
}

// Initial load
if (typeof window !== "undefined" && window.speechSynthesis) {
  window.speechSynthesis.onvoiceschanged = () => {
    loadVoices();
  };
  loadVoices();
}

export function speakText(text, options = {}) {
  if (typeof window === "undefined" || !window.speechSynthesis) return;

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();
  
  const utterance = new SpeechSynthesisUtterance(text);
  
  // Try to find voice if not already found
  if (!defaultFemaleVoice) {
    loadVoices();
  }

  if (defaultFemaleVoice) {
    utterance.voice = defaultFemaleVoice;
  }

  // Settings
  utterance.rate = options.rate || 1.1; // Slightly faster for responsiveness
  utterance.pitch = options.pitch || 1.1; // Slightly higher pitch for a "girl's voice"
  utterance.volume = options.volume || 1.0;

  window.speechSynthesis.speak(utterance);
}
