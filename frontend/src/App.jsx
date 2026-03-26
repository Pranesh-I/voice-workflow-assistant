import { useState } from "react";
import recognition from "./voice/speechRecognition";
import { detectIntentWithGemini } from "./ai/aiParser";
import { executeWorkflow } from "./workflows/workflowExecutor";

function App() {

  const [text, setText] = useState("Click microphone to start listening 🎤");

  const startListening = () => {

    if (!recognition) {
      setText("Speech recognition not supported.");
      return;
    }

    recognition.start();

    recognition.onresult = async (event) => {

      const transcript = event.results[0][0].transcript;

      setText(transcript);

      try {

        // Send speech to Gemini
        const intent = await detectIntentWithGemini(transcript);

        console.log("Gemini Parsed Intent:", intent);

        // Execute workflow directly (no JSON.parse needed)
        executeWorkflow(intent);

      } catch (error) {

        console.error("Gemini parsing failed:", error);

      }

    };

    recognition.onerror = () => {
      setText("Microphone error detected.");
    };

  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "#0f172a",
        color: "white",
        fontSize: "22px",
      }}
    >

      <div>{text}</div>

      <button
        onClick={startListening}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          fontSize: "18px",
          borderRadius: "8px",
          cursor: "pointer"
        }}
      >
        🎤 Start Listening
      </button>

    </div>
  );
}

export default App;