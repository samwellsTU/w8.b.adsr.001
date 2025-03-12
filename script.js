//-------ADSR Parameters-----------
let attack = 1; //attack time in seconds
let decay = 1; // decay time in senconds
let sustain = 0.25; // sustain amplitude in linear amplitude
let release = 1; // release time in seconds

//----------WEB AUDIO CONTEXT-------------------
/**
 * Creates a new Web Audio API context for handling audio processing.
 * @type {AudioContext}
 */
const thisAudio = new AudioContext();

//----------WEB AUDIO NODES-------------------

/**
 * Placeholder variable for an oscillator node.
 * @type {OscillatorNode | null}
 */
let myOsc = null;

/**
 * Gain node for amplitude envelope control.
 * @type {GainNode}
 */
let ampEnv = thisAudio.createGain();
ampEnv.gain.value = 0.0;

/**
 * Master gain node to control overall volume.
 * @type {GainNode}
 */
let masterGain = thisAudio.createGain();
masterGain.gain.value = 0.5;

//---------CONNECTIONS--------------

ampEnv.connect(masterGain);
masterGain.connect(thisAudio.destination);

//---------FUNCTIONS--------------

/**
 * Creates and starts an oscillator with a triangle waveform at 220 Hz.
 * The oscillator is connected to the amplitude envelope gain node.
 */
const playNote = function () {
  // saves current time for reference
  let now = thisAudio.currentTime;
  myOsc = thisAudio.createOscillator();
  myOsc.frequency.value = 220;
  myOsc.type = "triangle";
  myOsc.connect(ampEnv);
  myOsc.start();

  //load the correct value into our ramp.
  ampEnv.gain.setValueAtTime(ampEnv.gain.value, now);
  //attack
  ampEnv.gain.linearRampToValueAtTime(1.0, now + attack);

  //decay
  ampEnv.gain.linearRampToValueAtTime(sustain, now + attack + decay);
};

/**
 * Stops and disconnects the active oscillator.
 */
const stopNote = function () {
  // saves current time for reference
  let now = thisAudio.currentTime;
  console.log(now);
  console.log(typeof now);
  //load the correct value into our ramp.
  ampEnv.gain.setValueAtTime(ampEnv.gain.value, now);

  //release
  ampEnv.gain.linearRampToValueAtTime(0, now + release);

  myOsc.stop(now + release + 0.01);
  //   myOsc.disconnect(ampEnv);
  //   myOsc = null; // Reset to null after stopping
};

//---------EVENT LISTENERS--------------

/**
 * Button to start playing the note.
 * @type {HTMLElement}
 */
let startButton = document.getElementById("start");

/**
 * Button to stop playing the note.
 * @type {HTMLElement}
 */
let stopButton = document.getElementById("stop");

// Add event listeners to buttons
startButton.addEventListener("click", playNote);
stopButton.addEventListener("click", stopNote);
