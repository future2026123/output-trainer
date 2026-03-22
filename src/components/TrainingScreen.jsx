import { useState, useEffect, useRef, useCallback } from 'react'
import { getSession, chunkSentence } from '../sentences'
import { hasOnlyChosung, endsWithChosung, calcAccuracy } from '../utils'
import './TrainingScreen.css'

const DELAY_MS = 800

export default function TrainingScreen({ onComplete }) {
  const [sessionSentences] = useState(() => getSession(10))
  const [sentenceIndex, setSentenceIndex] = useState(0)
  const [chunks, setChunks] = useState([])
  const [chunkIndex, setChunkIndex] = useState(0)
  const [inputValue, setInputValue] = useState('')
  const [isLocked, setIsLocked] = useState(true)
  const [chosungWarning, setChosungWarning] = useState(false)
  const [sessionStartTime] = useState(Date.now())
  const [chosungCount, setChosungCount] = useState(0)

  // Per-sentence tracking
  const [sentenceInputs, setSentenceInputs] = useState([])
  const [allResults, setAllResults] = useState([])

  const inputRef = useRef(null)
  const lockTimerRef = useRef(null)

  // Initialize chunks when sentence changes
  useEffect(() => {
    const sentence = sessionSentences[sentenceIndex]
    if (sentence) {
      const newChunks = chunkSentence(sentence, 4)
      setChunks(newChunks)
      setChunkIndex(0)
      setInputValue('')
      setSentenceInputs([])
      startDelay()
    }
  }, [sentenceIndex, sessionSentences])

  const startDelay = useCallback(() => {
    setIsLocked(true)
    setInputValue('')
    if (lockTimerRef.current) clearTimeout(lockTimerRef.current)
    lockTimerRef.current = setTimeout(() => {
      setIsLocked(false)
      setTimeout(() => inputRef.current?.focus(), 50)
    }, DELAY_MS)
  }, [])

  // Start delay when chunk changes (but not on first mount — handled by sentence effect)
  useEffect(() => {
    if (chunkIndex > 0) {
      startDelay()
    }
  }, [chunkIndex, startDelay])

  useEffect(() => {
    return () => {
      if (lockTimerRef.current) clearTimeout(lockTimerRef.current)
    }
  }, [])

  const handleInput = (e) => {
    const val = e.target.value
    setInputValue(val)

    // Chosung detection
    if (hasOnlyChosung(val) || endsWithChosung(val)) {
      setChosungWarning(true)
      setChosungCount(prev => prev + 1)
      setTimeout(() => setChosungWarning(false), 1200)
    } else {
      setChosungWarning(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !isLocked) {
      e.preventDefault()
      submitChunk()
    }
  }

  const submitChunk = () => {
    const currentInput = inputValue.trim()
    if (!currentInput) return

    const newSentenceInputs = [...sentenceInputs, currentInput]
    setSentenceInputs(newSentenceInputs)

    if (chunkIndex < chunks.length - 1) {
      // Next chunk
      setChunkIndex(prev => prev + 1)
      setInputValue('')
    } else {
      // Sentence complete — save results
      const fullTarget = sessionSentences[sentenceIndex]
      const fullInput = newSentenceInputs.join(' ')
      const accuracy = calcAccuracy(fullTarget, fullInput)

      const result = {
        target: fullTarget,
        input: fullInput,
        chunks: chunks.map((chunk, i) => ({
          target: chunk,
          input: newSentenceInputs[i] || '',
        })),
        accuracy,
      }

      const newResults = [...allResults, result]
      setAllResults(newResults)

      if (sentenceIndex < sessionSentences.length - 1) {
        setSentenceIndex(prev => prev + 1)
      } else {
        // Session complete
        const totalTime = Date.now() - sessionStartTime
        onComplete({
          sentences: newResults,
          totalTime,
          averageAccuracy: Math.round(
            newResults.reduce((sum, r) => sum + r.accuracy, 0) / newResults.length
          ),
          chosungViolations: chosungCount,
        })
      }
    }
  }

  const currentChunk = chunks[chunkIndex] || ''
  const progress = sentenceIndex / sessionSentences.length
  const chunkProgress = chunks.length > 0 ? (chunkIndex / chunks.length) : 0

  return (
    <div className="training-screen">
      {/* Top bar */}
      <div className="training-header">
        <div className="session-counter">
          <span className="counter-current">{sentenceIndex + 1}</span>
          <span className="counter-sep">/</span>
          <span className="counter-total">{sessionSentences.length}</span>
        </div>
        <div className="progress-bar-wrap">
          <div className="progress-bar" style={{ width: `${progress * 100}%` }} />
        </div>
      </div>

      {/* Full sentence preview */}
      <div className="sentence-preview">
        {chunks.map((chunk, i) => (
          <span
            key={i}
            className={`preview-chunk ${
              i < chunkIndex ? 'done' : i === chunkIndex ? 'active' : 'upcoming'
            }`}
          >
            {chunk}
          </span>
        ))}
      </div>

      {/* Chunk progress dots */}
      <div className="chunk-dots">
        {chunks.map((_, i) => (
          <div
            key={i}
            className={`chunk-dot ${
              i < chunkIndex ? 'done' : i === chunkIndex ? 'active' : ''
            }`}
          />
        ))}
      </div>

      {/* Main target display */}
      <div className="target-area">
        {isLocked ? (
          <div className="lock-indicator">
            <div className="breath-circle">
              <div className="breath-inner" />
            </div>
            <span className="lock-text">읽고 생각하세요</span>
          </div>
        ) : (
          <div className="target-text" key={`${sentenceIndex}-${chunkIndex}`}>
            {currentChunk}
          </div>
        )}
      </div>

      {/* Input area */}
      <div className={`input-area ${isLocked ? 'locked' : ''} ${chosungWarning ? 'warning' : ''}`}>
        <input
          ref={inputRef}
          type="text"
          className="training-input"
          value={inputValue}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          disabled={isLocked}
          placeholder={isLocked ? '잠시 기다려주세요...' : '입력 후 Enter'}
          autoComplete="off"
          autoCorrect="off"
          spellCheck="false"
        />
        {!isLocked && inputValue.trim() && (
          <button className="submit-btn" onClick={submitChunk}>
            →
          </button>
        )}
      </div>

      {/* Chosung warning */}
      {chosungWarning && (
        <div className="chosung-alert">
          <span className="alert-icon">⚠</span>
          초성 입력 감지 — 완성형 한글로 입력하세요
        </div>
      )}

      {/* Chunk sub-progress */}
      <div className="chunk-progress-bar-wrap">
        <div
          className="chunk-progress-bar"
          style={{ width: `${chunkProgress * 100}%` }}
        />
      </div>
    </div>
  )
}
