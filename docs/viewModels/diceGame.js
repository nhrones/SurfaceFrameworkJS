import { signals } from '../deps.js'
import * as PlaySound from "./sounds.js"

import {highScore, setHighScore, setupHighScore} from './highScore.js'

import {on, fire } from '../main.js'

import * as playerOne from './playerName.js'
import * as dice from './dice.js'
import * as Possible from './possible.js'
import ScoreElement from './scoreElement.js'
import * as rollButton from './rollButton.js'
import { thisPlayer } from '../main.js';

//================================================
//         local const for faster resolution
//================================================

const SHORTCUT_GAMEOVER = false;

//================================================
//      exported const for faster resolution
//================================================

export let appInstance

/** the main controller for the dice game */
export class App {

   scoreItems
   leftBonus
   fiveOkindBonus
   leftTotal
   rightTotal

   /** DiceGame private instance, exposed by init() */
   static _instance

   /** singleton initialization */
   static init() {
      if (!App._instance) {
         App._instance = new App()
         appInstance = App._instance
      }
   }

   /** private singleton constructor, called from init() */
   constructor() {
      this.scoreItems = []
      this.leftBonus = 0
      this.fiveOkindBonus = 0
      this.leftTotal = 0
      this.rightTotal = 0
      dice.init()
      rollButton.init()
      playerOne.init()

      //================================================
      //                 bind signals 
      //================================================

      if (!this.isGameComplete()) {
         this.resetTurn()
      }

      signals.on("ButtonTouched", "help", () => {
         location.href = 'https://github.com/nhrones/NewDice/blob/main/readme.md'
      })

      signals.on(`PopupReset`, "", () => {
         this.resetGame()
      })

      on(`ScoreElementResetTurn`, "", () => {
         if (this.isGameComplete()) {
            this.clearPossibleScores()
            this.setLeftScores()
            this.setRightScores()
            this.showFinalScore()
         } else {
            this.resetTurn()
         }
      })

      signals.on('AddedView', "", (view) => {
         if (view.type === 'ScoreButton') {
            this.scoreItems.push(new ScoreElement(view.index, view.name))
         }
      })
   }

   /** clear all scoreElements possible score value */
   clearPossibleScores() {
      for (const scoreItem of this.scoreItems) {
         scoreItem.clearPossible()
      }
   }

   /** evaluates the dice and then sets a possible score value for each scoreelements */
   evaluatePossibleScores() {
      for (const scoreItem of this.scoreItems) {
         scoreItem.setPossible()
      }
   }

   /** resets the turn by resetting values and state */
   resetTurn() {
      PlaySound.enabled(true)
      rollButton.state.color = thisPlayer.color
      rollButton.state.enabled = true
      rollButton.state.text = 'Roll Dice'
      rollButton.update()
      dice.resetTurn()
      this.clearPossibleScores()
      this.setLeftScores()
      this.setRightScores()
      setupHighScore()
   }

   /** resets game state to start a new game */
   resetGame() {
      signals.fire(`HidePopup`, "", null)
      dice.resetGame()
      for (const scoreItem of this.scoreItems) {
         scoreItem.reset()
      }
      // clear the view
      fire('UpdatePlayer', "1", {
         index: 0,
         color: "brown",
         text: ""
      })

      this.leftBonus = 0
      this.fiveOkindBonus = 0
      this.leftTotal = 0
      this.rightTotal = 0

      signals.fire('UpdateText', 'leftscore',
         {
            border: true,
            fill: true,
            fillColor: 'grey',
            fontColor: 'snow',
            text: '^ total = 0'
         }
      )
      setupHighScore()
      rollButton.state.color = 'brown'
      rollButton.state.text = 'Roll Dice'
      rollButton.state.enabled = true
      rollButton.update()
   }

   /** show a popup with final score */
   showFinalScore() {
      const winMsg =[]
      
      winMsg.push('You won!')
      rollButton.state.color = 'black'
      rollButton.state.text = winMsg[0]
      rollButton.update()
      this.updatePlayer(0, 'snow', "")
      signals.fire(`UpdateText`, 'infolabel', {
         border: false,
         fill: true,
         fillColor: "snow",
         fontColor: 'black',
         text: winMsg[0] + ' ' + thisPlayer.score
      })

      // check and set high score
      if (thisPlayer.score > highScore) {
         PlaySound.Woohoo()
         setHighScore(thisPlayer.score)
         localStorage.setItem("highScore", JSON.stringify(thisPlayer.score));
         winMsg.push("You set a new high score!")
      } else {
         PlaySound.Nooo()
      }
      signals.fire('ShowPopup', "", { title: 'Game Over!', msg: winMsg })
   }

   /** check all scoreElements to see if game is complete */
   isGameComplete() {
      if (SHORTCUT_GAMEOVER) {
         return true;
      } else {
         let result = true
         for (const scoreItem of this.scoreItems) {
            if (!scoreItem.owned) {
               result = false
            }
         }
         return result
      }
   }

   /** sum and show left scoreElements total value */
   setLeftScores() {
      this.leftTotal = 0
      thisPlayer.score = 0
      let val
      for (let i = 0; i < 6; i++) {
         val = this.scoreItems[i].finalValue
         if (val > 0) {
            this.leftTotal += val
            thisPlayer.score += val
            const text = thisPlayer.score + "" 
            this.updatePlayer(thisPlayer.idx, thisPlayer.color, text)
            if (this.scoreItems[i].hasFiveOfaKind && (dice.fiveOfaKindCount > 1)) {
               this.addScore(100)
            }
         }
      }
      if (this.leftTotal > 62) {
         this.addScore(35)
         signals.fire('UpdateText', 'leftscore',
            {
               border: true,
               fill: true,
               fillColor: 'grey',
               fontColor: 'snow',
               text: `^ total = ${this.leftTotal.toString()} + 35`
            }
         )
      }
      else {
         signals.fire('UpdateText', 'leftscore',
            {
               border: true,
               fill: true,
               fillColor: 'grey',
               fontColor: 'snow',
               text: '^ total = ' + this.leftTotal.toString()
            }
         )
      }
      if (this.leftTotal === 0) {
         signals.fire('UpdateText', 'leftscore',
            {
               border: true,
               fill: true,
               fillColor: 'grey',
               fontColor: 'snow',
               text: '^ total = 0'
            }
         )
      }
   }

   /** sum the values of the right scoreElements */
   setRightScores() {
      let val
      const len = this.scoreItems.length
      for (let i = 6; i < len; i++) {
         val = this.scoreItems[i].finalValue
         if (val > 0) {
            const owner = this.scoreItems[i].owner
            if (owner) {
               this.addScore(val)
               if (this.scoreItems[i].hasFiveOfaKind
                  && (dice.fiveOfaKindCount > 1)
                  && (i !== Possible.FiveOfaKindIndex)
               ) {
                  this.addScore(100)
               }
            }
         }
      }
   }

   /** add a score value for this player */
   addScore = (value) => {
      thisPlayer.score += value
      const text = thisPlayer.score + ""
      this.updatePlayer(thisPlayer.idx, thisPlayer.color, text)
   }

   /** broadcast an update message to the view element */
   updatePlayer = (index, color, text) => {
      fire('UpdatePlayer', index.toString(), {
         index: index,
         color: color,
         text: text
      })
   }
}
