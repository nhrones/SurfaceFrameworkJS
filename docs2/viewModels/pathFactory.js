
/* The object of these unusual scoreElement paths was to maximise touch and 
  text area on small screens. */

/** returns a Path2D object used to render a custom Right-Score */
export function buildRightScore(location, size) {
    const { left, right, top, bottom, width, height, radius } = getPathGeometry(location, size)
    const halfWidth = left + (width * 0.3)
    const halfHeight = top + (height * 0.5) + 5
    const p = new Path2D()
    p.moveTo(halfWidth + radius, top)
    p.arcTo(right, top, right, top + radius, radius)
    p.arcTo(right, bottom, right - radius, bottom, radius)
    p.arcTo(left, bottom, left, bottom - radius, radius)
    p.arcTo(left, halfHeight, left + radius, halfHeight, radius)
    p.arcTo(halfWidth, halfHeight, halfWidth, halfHeight - radius, radius)
    p.arcTo(halfWidth, top, halfWidth + radius, top, radius)
    return p
}

/** returns a Path2D object used to render a custom Left-Score */
export function buildLeftScore(location, size) {
    const { left, right, top, bottom, width, height, radius } = getPathGeometry(location, size)
    const halfWidth = left + (width * 0.7)
    const halfHeight = top + (height * 0.5) - 5
    const p = new Path2D()
    p.moveTo(left + radius, top)
    p.arcTo(right, top, right, top + radius, radius)
    p.arcTo(right, halfHeight, right - radius, halfHeight, radius)
    p.arcTo(halfWidth, halfHeight, halfWidth, halfHeight + radius, radius)
    p.arcTo(halfWidth, bottom, halfWidth - radius, bottom, radius)
    p.arcTo(left, bottom, left, bottom - radius, radius)
    p.arcTo(left, top, left + radius, top, radius)
    return p
}

/** adds calculated 'right and 'bottom' properties to an IGeometry */
const getPathGeometry = (location, size, radius = 10) => {
    const { left, top } = location
    const { width, height } = size
    return {
        left: left,
        right: left + width,
        top: top,
        bottom: top + height,
        width: width,
        height: height,
        radius: radius
    }
}
