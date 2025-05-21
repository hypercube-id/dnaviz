var audioContext = new AudioContext();

var frequencyOffset = 0
  // Our sound source is a simple sine oscillator
var oscillator = audioContext.createOscillator(); // Create sound source  
oscillator.type = 'sine';

// Adding a gain node just to lower the volume a bit and to make the
// sound less ear-piercing. It will also allow us to mute and replay
// our sound on demand
var gainNode = audioContext.createGain();
oscillator.connect(gainNode);
gainNode.connect(audioContext.destination);

gainNode.gain.value = 0;
oscillator.frequency.value = 40;
oscillator.start(0);

function beep() {
  var now=audioContext.currentTime;
  
  // Cancel any existing automation (to prevent overlaps).
  oscillator.frequency.cancelScheduledValues(now);
  gainNode.gain.cancelScheduledValues(now);
  
  // Smoothly increase frequency ready.
  oscillator.frequency.linearRampToValueAtTime(
  	oscillator.frequency.value+1, now+0.005);
    
  // Gate-on.
  gainNode.gain.setValueAtTime(gainNode.gain.value, now);
  gainNode.gain.linearRampToValueAtTime(0.1, now+0.005);
  
  // Gate-off after 250ms.
  gainNode.gain.setValueAtTime(0.1, now+0.245);
  gainNode.gain.linearRampToValueAtTime(0, now+0.25);
  
  // You might be able to move the frequency-increase here -
  // so that it is already at the correct level for the next
  // boop().
}

var b = setInterval(beep, 5000);
setTimeout(function(){
	clearTimeout(b);
}, 10000);