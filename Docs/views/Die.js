
import { ctx } from '../deps.js'
import { on, fire } from '../main.js'
import { DIE_CFG } from '../cfg.js'
import { buildDieFaces } from '../viewModels/dieFactory.js'

let needToBuild = true

/** a class that creates instances of virtual Die    
 *  elements that are to be rendered to a canvas */
export default class Die {

   id = 0 // assigned by activeViews.add()    
   index = 0
   activeView = true
   zOrder = 0
   tabOrder = 0
   name
   enabled = true
   hovered = false
   focused = false
   path
   location
   size
   left
   top
   width
   height
   color
   frozen = false
   value = 0
   static frozenFaces
   static faces

   /** ctor that instantiates a new vitual Die view  and faces*/
   constructor(el) {
      // build die face images
      if (needToBuild) {
         const { faces, frozenFaces } = buildDieFaces()
         Die.faces = faces
         Die.frozenFaces = frozenFaces
         needToBuild = false
      }
      this.index = el.idx
      this.tabOrder = el.tabOrder  || 0
      this.name = el.id
      this.enabled = true

      this.size = DIE_CFG.size
      this.width = this.size.width
      this.height = this.size.height

      this.location = el.location
      this.top = el.location.top
      this.left = el.location.left

      this.color = 'transparent'
      this.path = this.buildPath(DIE_CFG.radius)
      this.render()

      //================================================
      //                bind signals
      //================================================

      on('UpdateDie', this.index.toString(), (data) => {
         this.frozen = data.frozen
         this.value = data.value
         this.render()
      })
   }

   buildPath(radius) {
      const path = new Path2D
      path.roundRect(this.left, this.top, this.width, this.height, radius)
      return path
   }

   /** called from Surface/canvasEvents when this element has been touched */
   touched() {
      // inform Dice with index data
      fire(`DieTouched`, "", ({ index: this.index }))
   }

   update() {
      this.render()
   }

   render() {
      ctx.save()
      const image = (this.frozen)
         ? Die.frozenFaces[this.value]
         : Die.faces[this.value]
      ctx.putImageData(image, this.left, this.top)
      ctx.lineWidth = 2
      if (this.hovered) {
         ctx.strokeStyle = 'orange';
         ctx.lineWidth = 2
      } else {
         ctx.strokeStyle = 'silver'
         ctx.lineWidth = 2
      }
      ctx.stroke(this.path)
      ctx.restore()
   }
}

/** A set of Die face images */
Die.faces = [
   new ImageData(1, 1),
   new ImageData(1, 1),
   new ImageData(1, 1),
   new ImageData(1, 1),
   new ImageData(1, 1),
   new ImageData(1, 1)
]

/** A set of frozen Die face images */
Die.frozenFaces = [
   new ImageData(1, 1),
   new ImageData(1, 1),
   new ImageData(1, 1),
   new ImageData(1, 1),
   new ImageData(1, 1),
   new ImageData(1, 1)
]
