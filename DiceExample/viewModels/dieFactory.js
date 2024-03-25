
import {DIE_CFG} from '../cfg.js'

let size = 90
let r = 0

/** 
 * A die-face builder that renders and persists dice face images 
 */
export function buildDieFaces(){
    console.log("buildDieFaces")
    const { size: dieSize, radius, color } = DIE_CFG
    r = radius

    const start = performance.now()
    const canvas = /**@type{ HTMLCanvasElement } */ (document.createElement("canvas"));
    const ctx = /** @type{CanvasRenderingContext2D} */ (canvas.getContext("2d", { willReadFrequently: true }));

    canvas.width = dieSize.width
    canvas.height = dieSize.height

    const faces = [
        new ImageData(1,1),
        new ImageData(1,1),
        new ImageData(1,1),
        new ImageData(1,1),
        new ImageData(1,1),
    ]
    
    const frozenFaces = [
        new ImageData(1,1),
        new ImageData(1,1),
        new ImageData(1,1),
        new ImageData(1,1),
        new ImageData(1,1),
    ]
    size = dieSize.width
    ctx.fillStyle = color
    ctx.fillRect(0, 0, size, size)
    
    for (let i = 0; i < 7; i++) {
        faces[i] = drawDie(ctx, false, i)
        frozenFaces[i] = drawDie(ctx, true, i)
    }
    
    // report build time (typically ~ 9ms - 15ms)
    console.log(`Building 12 die face images took ${(performance.now() - start).toFixed()}ms!`);
    
    return {faces, frozenFaces}
}


/**
 * Draw Die
 * @param {CanvasRenderingContext2D} ctx
 * @param {boolean} frozen
 * @param {number} value
 * @returns {ImageData}
 */
function drawDie(ctx , frozen, value) {

    ctx.save()
    if (frozen) {
        ctx.strokeStyle = 'silver'
        ctx.fillStyle = 'WhiteSmoke'
    }
    else {
        ctx.strokeStyle = 'black'
        ctx.fillStyle = 'white'
    }
    drawDieFace(ctx)
    drawGlare(ctx)
    ctx.fillStyle = (frozen) ? 'silver' : 'black'
    drawDots(ctx, value)
    ctx.restore()
    return ctx.getImageData(0, 0, size, size)
}


/**
 * Draw Die Face
 * @param {CanvasRenderingContext2D} ctx
 */
function drawDieFace(ctx) {
    ctx.beginPath()
    ctx.roundRect(0, 0, size, size, r)
    ctx.closePath()

    ctx.fill()
    ctx.lineWidth = 2
    ctx.strokeStyle = 'black'
    ctx.stroke()
    ctx.lineWidth = 1
}

/**
 * Draw Glare
 * @param {CanvasRenderingContext2D} ctx
 */
function drawGlare(ctx) {
    const offset = 5
    const bottomLeftX = offset
    const bottomLeftY = size - offset
    const bottomRightX = size - offset
    const bottomRightY = size - offset
    const quarter = size * 0.25
    const threeQuarter = quarter * 3
    ctx.fillStyle = 'rgba(200, 200, 200, 0.4)'
    ctx.beginPath()
    ctx.moveTo(bottomLeftX, bottomLeftY)
    ctx.lineTo(bottomRightX, bottomRightY)
    ctx.bezierCurveTo(quarter, threeQuarter, quarter, threeQuarter, offset, offset)
    ctx.closePath()
    ctx.fill()
    ctx.save()
}

/**
 * Draw Dots
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} dieValue
 */
function drawDots(ctx, dieValue) {
   const quarter = size / 4
   const center = quarter * 2
   const middle = quarter * 2
   const left = quarter
   const top = quarter
   const right = quarter * 3
   const bottom = quarter * 3
   const dotSize = size / 12
   const doDot = drawDot
    if (dieValue === 1) {
        doDot(ctx, middle, center, dotSize)
    }
    else if (dieValue === 2) {
        doDot(ctx, top, left, dotSize)
        doDot(ctx, bottom, right, dotSize)
    }
    else if (dieValue === 3) {
        drawDot(ctx, top, left, dotSize)
        drawDot(ctx, middle, center, dotSize)
        drawDot(ctx, bottom, right, dotSize)
    }
    else if (dieValue === 4) {
        drawDot(ctx, top, left, dotSize)
        drawDot(ctx, top, right, dotSize)
        drawDot(ctx, bottom, left, dotSize)
        drawDot(ctx, bottom, right, dotSize)
    }
    else if (dieValue === 5) {
        drawDot(ctx, top, left, dotSize)
        drawDot(ctx, top, right, dotSize)
        drawDot(ctx, middle, center, dotSize)
        drawDot(ctx, bottom, left, dotSize)
        drawDot(ctx, bottom, right, dotSize)
    }
    else if (dieValue === 6) {
        drawDot(ctx, top, left, dotSize)
        drawDot(ctx, top, right, dotSize)
        drawDot(ctx, middle, left, dotSize)
        drawDot(ctx, middle, right, dotSize)
        drawDot(ctx, bottom, left, dotSize)
        drawDot(ctx, bottom, right, dotSize)
    }
}


/**
 * Draw Dot
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} y
 * @param {number} x
 * @param {number} dotSize
 */
function drawDot(ctx, y, x, dotSize) {
    ctx.beginPath()
    ctx.arc(x, y, dotSize, 0, Math.PI * 2, true)
    ctx.closePath()
    ctx.fill()
}
