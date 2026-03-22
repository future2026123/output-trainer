let audioCtx = null

function getCtx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)()
  return audioCtx
}

/** Short soft click — chunk complete */
export function playChunkDone() {
  const ctx = getCtx()
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.type = 'sine'
  osc.frequency.setValueAtTime(880, ctx.currentTime)
  osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.06)
  gain.gain.setValueAtTime(0.15, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12)
  osc.start(ctx.currentTime)
  osc.stop(ctx.currentTime + 0.12)
}

/** Rising two-tone — sentence complete */
export function playSentenceDone() {
  const ctx = getCtx()
  const now = ctx.currentTime

  // Note 1
  const o1 = ctx.createOscillator()
  const g1 = ctx.createGain()
  o1.connect(g1)
  g1.connect(ctx.destination)
  o1.type = 'sine'
  o1.frequency.value = 523.25 // C5
  g1.gain.setValueAtTime(0.18, now)
  g1.gain.exponentialRampToValueAtTime(0.001, now + 0.2)
  o1.start(now)
  o1.stop(now + 0.2)

  // Note 2
  const o2 = ctx.createOscillator()
  const g2 = ctx.createGain()
  o2.connect(g2)
  g2.connect(ctx.destination)
  o2.type = 'sine'
  o2.frequency.value = 659.25 // E5
  g2.gain.setValueAtTime(0.18, now + 0.12)
  g2.gain.exponentialRampToValueAtTime(0.001, now + 0.35)
  o2.start(now + 0.12)
  o2.stop(now + 0.35)
}

/** Triumphant chord — session complete */
export function playSessionComplete() {
  const ctx = getCtx()
  const now = ctx.currentTime

  const notes = [
    { freq: 523.25, delay: 0 },      // C5
    { freq: 659.25, delay: 0.08 },    // E5
    { freq: 783.99, delay: 0.16 },    // G5
    { freq: 1046.50, delay: 0.28 },   // C6
  ]

  notes.forEach(({ freq, delay }) => {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.type = 'sine'
    osc.frequency.value = freq
    gain.gain.setValueAtTime(0, now + delay)
    gain.gain.linearRampToValueAtTime(0.15, now + delay + 0.04)
    gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.6)
    osc.start(now + delay)
    osc.stop(now + delay + 0.6)
  })

  // Shimmer layer
  const shimmer = ctx.createOscillator()
  const sGain = ctx.createGain()
  shimmer.connect(sGain)
  sGain.connect(ctx.destination)
  shimmer.type = 'triangle'
  shimmer.frequency.setValueAtTime(1568, now + 0.3)
  shimmer.frequency.exponentialRampToValueAtTime(2093, now + 0.9)
  sGain.gain.setValueAtTime(0.06, now + 0.3)
  sGain.gain.exponentialRampToValueAtTime(0.001, now + 1.0)
  shimmer.start(now + 0.3)
  shimmer.stop(now + 1.0)
}
