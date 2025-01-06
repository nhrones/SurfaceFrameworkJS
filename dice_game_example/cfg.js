
export const DIE_CFG = {
   size: { "width":70, "height": 70 },
   radius: 10,
   color: "white"
}

export const SCORE_CFG = {
   size: {
       "width": 95,
       "height": 75
   }
}

export const PossibleColor = 'cyan';

const row1Top = 160
const row2Top = 245 //250
const row3Top = 330 //340
const row4Top = 415 //430

const col1Left = 10
const col2Left = 85
const col3Left = 200
const col4Left = 275

const dieTop = 80

export const cfg = {
   winCFG: {
      size:{ width: 380, height: 525},
      containerColor: "white",
      textColor: "black"
  },
   nodes: [
      {
         kind: "TextElem",
         id: "ScoreLabel",
         idx: 1,
         tabOrder: 0,
         location: { left: 5, top: 20 },
         size:  { width: 100, height: 25 },
         text: "This Score",
         fontColor: "brown",
         hasBoarder: false,
         bind: true
      },
      {
         kind: "TextElem",
         id: "player1",
         idx: 1,
         tabOrder: 0,
         location: { left: 10, top: 40 },
         size:  { width: 100, height: 25 },
         text: "0",
         fontColor: "brown",
         hasBoarder: false,
         bind: true
      },
      {
         kind: "Button",
         id: "rollbutton",
         idx: 0,
         tabOrder: 1,
         location: { left: 120, top: 20 },
         size: { width: 150, height: 50 },
         boarderWidth: 5,
         radius: 10,
         text: "Roll Dice"
      },
      {
         kind: "TextElem",
         id: "highScore",
         idx: -1,
         tabOrder: 0,
         location: { left: 280, top: 20 }, 
         size: { width: 100, height: 25 },
         text: "High Score",
         bind: true
      },
      {
         kind: "TextElem",
         id: "highScoreValue",
         idx: -1,
         tabOrder: 0,
         location: { left: 280, top: 40 }, 
         size: { width: 80, height: 25 },
         text: "0",
         hasBoarder: false,
         bind: true
      },
      {
         kind: "Die",
         id: "die0",
         idx: 0,
         tabOrder: 2,
         location: { left: 5, top: dieTop }//20
      },
      {
         kind: "Die",
         id: "die1",
         idx: 1,
         tabOrder: 3,
         location: { left: 80, top: dieTop }//100
      },
      {
         kind: "Die",
         id: "die2",
         idx: 2,
         tabOrder: 4,
         location: { left: 155, top: dieTop }//180
      },
      {
         kind: "Die",
         id: "die3",
         idx: 3,
         tabOrder: 5,
         location: { left: 230, top: dieTop }//260
      },
      {
         kind: "Die",
         id: "die4",
         idx: 4,
         tabOrder: 6,
         location: { left: 305, top: dieTop }//340
      },
      {
         kind: "ScoreButton",
         id: "ones",
         idx: 0,
         tabOrder: 7,
         location: { left: col1Left, top: row1Top },
         text: "Ones"
      },
      {
         kind: "ScoreButton",
         id: "twos",
         idx: 1,
         tabOrder: 8,
         location: { left: col2Left, top: row1Top },
         text: "Twos"
      },
      {
         kind: "ScoreButton",
         id: "threes",
         idx: 2,
         tabOrder: 9,
         location: { left: col1Left, top: row2Top },
         text: "Threes"
      },
      {
         kind: "ScoreButton",
         id: "fours",
         idx: 3,
         tabOrder: 10,
         location: { left: col2Left, top: row2Top },
         text: "Fours"
      },
      {
         kind: "ScoreButton",
         id: "fives",
         idx: 4,
         tabOrder: 11,
         location: { left: col1Left, top: row3Top },
         text: "Fives"
      },
      {
         kind: "ScoreButton",
         id: "sixes",
         idx: 5,
         tabOrder: 12,
         location: { left: col2Left, top: row3Top },
         text: "Sixes"
      },
      {
         kind: "ScoreButton",
         id: "three-o-kind",
         idx: 6,
         tabOrder: 13,
         location: { left: col3Left, top: row1Top },
         text: "Three O-Kind"
      },
      {
         kind: "ScoreButton",
         id: "four-o-kind",
         idx: 7,
         tabOrder: 14,
         location: { left: col4Left, top: row1Top },
         text: "Four O-Kind"
      },
      {
         kind: "ScoreButton",
         id: "small-straight",
         idx: 8,
         tabOrder: 15,
         location: { left: col3Left, top: row2Top },
         text: "Small Straight"
      },
      {
         kind: "ScoreButton",
         id: "large-straight",
         idx: 9,
         tabOrder: 16,
         location: { left: col4Left, top: row2Top },
         text: "Large Straight"
      },
      {
         kind: "ScoreButton",
         id: "full-house",
         idx: 10,
         tabOrder: 17,
         location: { left: col3Left, top: row3Top },
         text: "Full House"
      },
      {
         kind: "ScoreButton",
         id: "five-o-kind",
         idx: 11,
         tabOrder: 18,
         location: { left: col4Left, top: row3Top },
         text: "Five O-Kind"
      },
      {
         kind: "ScoreButton",
         id: "chance",
         idx: 12,
         tabOrder: 19,
         location: { left: col3Left, top: row4Top },
         text: "Chance"
      },    
      {
         kind: "TextElem",
         id: "leftscore",
         idx: -1,
         tabOrder: 0,
         location: { left: col1Left, top: row4Top },
         size: { width: 180, height: 75 },
         text: "^ total = 0",
         fontColor: "black",
         bind: true,
         hasBoarder: true
      },
      {
         kind: "TextElem",
         id: "infolabel",
         idx: -1,
         tabOrder: 0,
         location: { left: 10, top: row4Top + 80 }, 
         size: { width: 360, height: 25 },
         text: "123456",
         bind: true
      },
      {
         kind: "Popup",
         id: "popup",
         idx: 0,
         tabOrder: 0,
         location: { left: 20, top: 100 },
         size: { width: 350, height: 350 },
         fontSize: 24,
         text: ""
      },
      {
         kind: "Button",
         id: "help",
         idx: 0,
         tabOrder: 1,
         location: { left: col4Left + 40, top: row4Top + 33 },
         size: { width: 50, height: 40 },
         boarderWidth: 2,
         color:"grey",
         radius: 5,
         text: "Help"
      },
      
   ]
}