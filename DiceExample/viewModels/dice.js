
import { on, fire } from '../main.js'
import * as evaluator from './diceEvaluator.js'
import { appInstance } from './diceGame.js'
import * as PlaySound from './sounds.js'

export let rollCount = 0
export let isFiveOfaKind = false
export let fiveOfaKindCount = 0
export let fiveOfaKindBonusAllowed = false
export let fiveOfaKindWasSacrificed = false

export const die = [
   { value: 0, frozen: false },
   { value: 0, frozen: false },
   { value: 0, frozen: false },
   { value: 0, frozen: false },
   { value: 0, frozen: false }
]
export let sum = 0

export const setRollCount = (val) => {
   rollCount = val
}

export const setIsFiveOfaKind = (val) => {
   isFiveOfaKind = val
}

export const setfiveOfaKindBonusAllowed = (val) => {
   fiveOfaKindBonusAllowed = val
}

export const setfiveOfaKindWasSacrificed = (val) => {
   fiveOfaKindWasSacrificed = val
}

export const setfiveOfaKindCount = (val) => {
   fiveOfaKindCount = val
}

/** init */
export const init = () => {

   //================================================
   //                bind signals
   //================================================

   // register a callback function for the `internal` DieTouched signal
   on(`DieTouched`, "", (data) => {
      const { index } = data
      const thisDie = die[index]
      if (thisDie.value > 0) {
         thisDie.frozen = !thisDie.frozen // toggle frozen
         updateView(index, thisDie.value, thisDie.frozen)
         PlaySound.Select()
      }
   })
}

/** Resets Dice at the end of a players turn. */
export const resetTurn = () => {
   die.forEach((thisDie, index) => {
      thisDie.frozen = false
      thisDie.value = 0
      updateView(index, 0, false)
   })
   rollCount = 0
   sum = 0
}

/** Resets this controller for a new game-play */
export const resetGame = () => {
   resetTurn()
   isFiveOfaKind = false
   fiveOfaKindCount = 0
   fiveOfaKindBonusAllowed = false
   fiveOfaKindWasSacrificed = false
}

/** roll the dice ...
 * @param dieValues {number[] | null} 
 *      If 'local-roll', dieValues parameter will be null.
 *      Otherwise, dieValues parameter will be the values
 *      from another players roll. */
export const roll = (dieValues) => {
   PlaySound.Roll()
   sum = 0
   die.forEach((thisDie, index) => {
      if (dieValues === null) {
         if (!thisDie.frozen) {
            thisDie.value = Math.floor(Math.random() * 6) + 1
            updateView(index, thisDie.value, thisDie.frozen)
         }
      }
      else {
         if (!thisDie.frozen) {
            thisDie.value = dieValues[index]
            updateView(index, thisDie.value, thisDie.frozen)
         }
      }
      sum += thisDie.value
   })
   rollCount += 1
   evaluator.evaluateDieValues()
   appInstance.evaluatePossibleScores()
}

/** broadcasts a signal to trigger a 'view' update
 * @param index {number} the index of the Die view to update
 * @param value {number} the die value to show in the view
 * @param frozen {boolean} the frozen state of this die */
const updateView = (index, value, frozen) => {
   fire('UpdateDie', index.toString(), { index: index, value: value, frozen: frozen })
}

/** returns the set of die values as a formatted string */
export const toString = () => {
   let str = '['
   die.forEach((thisDie, index) => {
      str += thisDie.value
      if (index < 4) str += ',';
   })
   return str + ']'
}
