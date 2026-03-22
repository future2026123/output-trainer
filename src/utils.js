/**
 * Check if a string contains only Korean initial consonants (chosung)
 * ㄱ(0x3131) through ㅎ(0x314E)
 */
export function hasOnlyChosung(str) {
  if (!str) return false
  const cleaned = str.replace(/\s/g, '')
  if (!cleaned) return false
  return /^[ㄱ-ㅎ]+$/.test(cleaned)
}

/**
 * Check if the latest character being typed is a chosung
 */
export function endsWithChosung(str) {
  if (!str) return false
  const last = str.trim().slice(-1)
  return /[ㄱ-ㅎ]/.test(last)
}

/**
 * Compare user input with target and return diff info
 */
export function diffStrings(target, input) {
  const result = []
  const maxLen = Math.max(target.length, input.length)

  for (let i = 0; i < maxLen; i++) {
    const expected = target[i] || ''
    const actual = input[i] || ''

    if (expected === actual) {
      result.push({ char: expected, type: 'correct' })
    } else if (i >= input.length) {
      result.push({ char: expected, type: 'missing' })
    } else if (i >= target.length) {
      result.push({ char: actual, type: 'extra' })
    } else {
      result.push({ char: expected, actual, type: 'wrong' })
    }
  }

  return result
}

/**
 * Calculate accuracy percentage
 */
export function calcAccuracy(target, input) {
  if (!target) return 100
  let correct = 0
  const maxLen = Math.max(target.length, input.length)
  for (let i = 0; i < maxLen; i++) {
    if (target[i] === input[i]) correct++
  }
  return Math.round((correct / maxLen) * 100)
}

/**
 * Format milliseconds to mm:ss
 */
export function formatTime(ms) {
  const secs = Math.floor(ms / 1000)
  const mins = Math.floor(secs / 60)
  const remainSecs = secs % 60
  return `${mins}:${remainSecs.toString().padStart(2, '0')}`
}
