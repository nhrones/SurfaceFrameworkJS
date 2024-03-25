
import * as dice from './dice.js'
import * as evaluator from './diceEvaluator.js'

const ThreeOfaKind = 6
const FourOfaKind = 7
const SmallStraight = 8
const LargeStraight = 9
const House = 10
const FiveOfaKind = 11
const Chance = 12

/** A module that evaluates a possible score for 
 * each ScoreElement based on the current values 
 * of the dice set 
 */

/** the index value of the Five of a kind scoreElement */
export const FiveOfaKindIndex = FiveOfaKind

/** evaluates the possible value of a scoreElement */
export const evaluate = (id) => {
    return (id < 6) ? evaluateNumbers(id) : evaluateCommon(id)
}

/** evaluate for common poker scores */
const evaluateCommon = (id) => {
    if (id === FiveOfaKind) {
        return (evaluator.hasFiveOfaKind) ? 50 : 0
    }
    else if (id === SmallStraight) {
        return (evaluator.hasSmallStr) ? 30 : 0
    }
    else if (id === LargeStraight) {
        return (evaluator.hasLargeStr) ? 40 : 0
    }
    else if (id === House) {
        return (evaluator.hasFullHouse) ? 25 : 0
    }
    else if (id === FourOfaKind) {
        return (evaluator.hasQuads || evaluator.hasFiveOfaKind) ?
            evaluator.sumOfAllDie : 0
    }
    else if (id === ThreeOfaKind) {
        return (evaluator.hasTrips || evaluator.hasQuads || evaluator.hasFiveOfaKind) ?
            evaluator.sumOfAllDie : 0
    }
    else if (id === Chance) {
        return evaluator.sumOfAllDie
    }
    else {
        return 0
    }
}

/** evaluates for the number of dice with this face value */
const evaluateNumbers = (id) => {
    let hits = 0
    const target = id + 1
    for (let i = 0; i < 5; i++) {
        const val = (dice.die[i]).value
        if (val === target) {
            hits += 1
        }
    }
    return target * hits
}
