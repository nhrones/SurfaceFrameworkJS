
import { 
   buildSignalAggregator,
   initCloseButton, 
   containerInit, 
   hydrateUI, 
   render 
} from "./deps.js";

import * as PlaySound from './viewModels/sounds.js'
import { App, appInstance } from './viewModels/diceGame.js';

// Import configuration files
import { cfg } from "./cfg.js";
import manifest from './view_manifest.js'
console.log('manifest', manifest)
/** 
 * Use the factory function to create a new SignalAggregator service 
 */
const diceSignals = buildSignalAggregator()
export const { on, fire } = diceSignals
/** initialize the button */
initCloseButton('closebutton')

// initialize all sounds
const AudioContext = globalThis.AudioContext
const context = new AudioContext();
PlaySound.init(context)

/** Our only DOM element -- a single canvas */
const cannvy = document.getElementById('surface')

// Initialize the Host Container 
containerInit(
   cannvy,
   cfg,
   manifest
)

// Initialize our App (main viewmodel) 
App.init();

// Load, hydrate, and display the Apps GUI
hydrateUI()

/** Our only player */
export const thisPlayer = {
    id: "1",
    idx: 0,
    playerName: 'Score:',
    color: 'brown',
    score: 0,
    lastScore: ''
}

// Reset for a clean startup 
appInstance.resetTurn()

// Initial rendering of the UI
render()