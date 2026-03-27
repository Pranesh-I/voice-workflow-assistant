import { useState, useEffect, useRef } from "react";
import { startRecognition, stopRecognition } from "./voice/speechRecognition";
import { detectIntentWithGemini } from "./ai/aiParser";
import { executeWorkflow } from "./workflows/workflowExecutor";
import { getCurrentWindow } from "@tauri-apps/api/window";
import "./App.css";

function App() {
  const [text, setText] = useState("");
  const [status, setStatus] = useState("idle"); // idle | listening | processing | executed
  const executionLocked = useRef(false);

  useEffect(() => {
    // When the Tauri Global Shortcut triggers this window natively via shortcut...
    // Boot up the Mic completely automatically. Ensure we only start if genuinely idle.
    const startSequence = () => {
      if (!executionLocked.current) {
        startListeningAuto();
      }
    };

    const timer = setTimeout(startSequence, 100);

    const handleKeyDown = async (e) => {
      // Emergency escape route matches Siri/Spotlight behavior if user changes mind
      if (e.key === "Escape") {
        await escapeOverlay();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    // If the window is explicitly shown by the Rust layer subsequently
    let unlisten = null;
    getCurrentWindow().listen("tauri://focus", () => {
      // Delay slightly so the browser finishes cleaning up the previous
      // recognition session before we call start() again.
      setTimeout(() => startSequence(), 400);
    }).then(u => { unlisten = u; });

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      clearTimeout(timer);
      if (unlisten) unlisten();
    };
  }, []);

  const startListeningAuto = () => {
    setText("");
    setStatus("listening");
    executionLocked.current = false;
    startRecognition(handleResult, handleError);
  };

  const handleResult = async (transcript, isFinal, isSilentEnd = false) => {
    if (transcript) setText(transcript);

    if (isFinal && !isSilentEnd && !executionLocked.current) {
      if (!transcript.trim()) return;

      executionLocked.current = true;
      setStatus("processing");

      try {
        const intent = await detectIntentWithGemini(transcript);

        if (!intent || !intent.action) {
          console.warn("No intent detected.");
          escapeOverlay();
          return;
        }

        console.log("Intent:", intent);
        await executeWorkflow(intent);

        setStatus("executed");

        setTimeout(() => {
          escapeOverlay();
        }, 2000); // 2 second visible then close

      } catch (error) {
        console.error("Gemini API request failed completely:", error);
        escapeOverlay();
      }
    } else if (isFinal && isSilentEnd && !executionLocked.current) {
      // Organic silent timeout or system cancel
      escapeOverlay();
    }
  };

  const handleError = (errorMsg, errorCode, isFatal) => {
    if (isFatal && !executionLocked.current) {
      executionLocked.current = true;
      setText(errorMsg);
      setStatus("executed");
      setTimeout(() => escapeOverlay(), 1500);
    }
  };

  const escapeOverlay = async () => {
    stopRecognition();
    setStatus("idle");
    setText("");
    executionLocked.current = false;
    try {
      await getCurrentWindow().hide();
    } catch (e) { }
  };

  return (
    <div className={`overlay-container ${status}`}>
      <div className="edge-glow">
        <span className="eg-top"></span>
        <span className="eg-right"></span>
        <span className="eg-bottom"></span>
        <span className="eg-left"></span>
      </div>
      <div className="radial-blur"></div>

      <div className="interaction-zone">
        <div className="live-transcript">
          {text}
        </div>

        <div className={`mic-orb ${status}`}>
          <div className="waveform-ripple"></div>
          <div className="orb-core"></div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28" height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mic-icon"
          >
            <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
            <line x1="12" x2="12" y1="19" y2="22" />
          </svg>
        </div>
      </div>
    </div>
  );
}

export default App;