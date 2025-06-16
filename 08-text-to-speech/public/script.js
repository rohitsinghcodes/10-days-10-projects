let currentUtterance = null;

function speakText() {
  const text = document.getElementById('text').value.trim();
  const rate = parseFloat(document.getElementById('rate').value);

  if (!text) {
    alert('Please enter some text.');
    return;
  }

  stopSpeech(); // stop any previous speech

  currentUtterance = new SpeechSynthesisUtterance(text);
  currentUtterance.rate = rate;
  currentUtterance.pitch = 1;
  window.speechSynthesis.speak(currentUtterance);
}

function stopSpeech() {
  if (window.speechSynthesis.speaking) {
    window.speechSynthesis.cancel();
  }
}
