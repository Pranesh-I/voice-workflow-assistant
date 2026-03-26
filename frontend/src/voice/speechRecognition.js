const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

let recognition = null;

if (SpeechRecognition) {
  recognition = new SpeechRecognition();

  recognition.continuous = false; // listens once per command
  recognition.lang = "en-US";
  recognition.interimResults = false;
}

export default recognition;