audioCtx = new(window.AudioContext || window.webkitAudioContext)();
currentTime = audioCtx.currentTime;

show();

function show() {
  frequency = 40;
  type = 'sine';
  volume = 80/100;
  duration = 7000;
}

function beep() {
  var oscillator = audioCtx.createOscillator();
  var gainNode = audioCtx.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  
  gainNode.gain.value = volume;
  oscillator.frequency.value = frequency;
  oscillator.type = type;

  oscillator.start();

  // Gate-on.
  gainNode.gain.setValueAtTime(gainNode.gain.value, currentTime);
  gainNode.gain.linearRampToValueAtTime(0.1, currentTime+0.005);
  
  // Gate-off after 250ms.
  gainNode.gain.setValueAtTime(0.1, currentTime+0.245);
  gainNode.gain.linearRampToValueAtTime(0, currentTime+0.25);  

  setTimeout(
    function() {  
    // Gate-on.
    gainNode.gain.setValueAtTime(gainNode.gain.value, currentTime);
    gainNode.gain.linearRampToValueAtTime(0.1, currentTime+0.005);
  
    // Gate-off after 250ms.
    gainNode.gain.setValueAtTime(0.1, currentTime+0.245);
    gainNode.gain.linearRampToValueAtTime(0, currentTime+0.25);

    gainNode.gain.exponentialRampToValueAtTime(0.00001, currentTime + 5);
    oscillator.stop();
    }, 
    duration
  );
};