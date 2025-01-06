
import { on } from '../main.js'
import { signals } from '../deps.js'

const id = 'player1'

export const state = {
   border: false, 
   fill: true,  
   fillColor: "snow", 
   fontColor: "Brown",
   text: "Score:"
}

/** PlayerName ViewModel initialization
 *  Called from DiceGame Controller ctor */
export const init = () => {
   on("UpdatePlayer", "0", (data) => {
      state.text = data.text
      update()
   })
   
   update()
}

/** fires an update signal with the current state */
export const update = () => {
   signals.fire('UpdateText', id, state)
}