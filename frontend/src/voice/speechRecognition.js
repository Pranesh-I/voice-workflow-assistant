const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

let recognition = null;

if (SpeechRecognition) {
  recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.lang = "en-US";
  recognition.interimResults = false;
}

export default recognition;