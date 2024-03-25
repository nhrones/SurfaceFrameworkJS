
import { signals } from '../deps.js'

import * as dice from './dice.js'

const thisID = 'rollbutton'


export const state = { text: '', color: '', enabled: true }

/**  Called from DiceGame Controller ctor */ 
export const init = () => {
    // when this instance rolls dice
    signals.on('ButtonTouched', thisID, () => {
        dice.roll(null)
        updateRollState()
    })
}

/** state management for the roll button */
const updateRollState = () => {
    switch (dice.rollCount) {
        case 1:
            state.text = 'Roll Again'
            break
        case 2:
            state.text = 'Last Roll'
            break
        case 3:
            state.enabled = false
            state.text = 'Select Score'
            break
        default:
            state.text = 'Roll Dice'
            dice.setRollCount(0)
    }
    update()
}

/** fires an update signal with the current state */
export const update = () => {
   signals.fire('UpdateButton', thisID, state)
}

