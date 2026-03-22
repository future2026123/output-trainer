import { useMemo, useEffect, useState } from 'react'
import { diffStrings, formatTime } from '../utils'
import './ResultScreen.css'

function Particles() {
  const particles = useMemo(() => {
    return Array.from({ length: 40 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 0.8,
      duration: 1.5 + Math.random() * 2,
      size: 4 + Math.random() * 8,
      color: ['#7c6fea', '#4ade80', '#fbbf24', '#60a5fa', '#f472b6', '#a78bfa'][Math.floor(Math.random() * 6)],
      drift: -30 + Math.random() * 60,
    }))
  }, [])

  return (
    <div className="particles-container">
      {particles.map(p => (
        <div
          key={p.id}
          className="particle"
          style={{
            left: `${p.x}%`,
            width: p.size,
            height: p.size,
            background: p.color,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            '--drift': `${p.drift}px`,
          }}
        />
      ))}
    </div>
  )
}

function CountUp({ target, duration = 1200 }) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    const start = performance.now()
    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3) // easeOutCubic
      setValue(Math.round(eased * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [target, duration])
  return <>{value}</>
}

export default function ResultScreen({ results, onRestart }) {
  const { sentences, totalTime, averageAccuracy, chosungViolations } = results

  const grade = useMemo(() => {
    if (averageAccuracy >= 95) return { label: '완벽', class: 'perfect' }
    if (averageAccuracy >= 85) return { label: '우수', class: 'great' }
    if (averageAccuracy >= 70) return { label: '양호', class: 'good' }
    return { label: '연습 필요', class: 'needs-work' }
  }, [averageAccuracy])

  return (
    <div className="result-screen">
      <Particles />

      <div className="result-header">
        <div className="complete-icon">
          <svg viewBox="0 0 52 52" className="checkmark-svg">
            <circle className="checkmark-circle" cx="26" cy="26" r="24" fill="none" />
            <path className="checkmark-check" fill="none" d="M14 27l7 7 16-16" />
          </svg>
        </div>
        <h1 className="result-title">훈련 완료</h1>
        <p className="result-subtitle">세션 리포트</p>
      </div>

      {/* Stats cards */}
      <div className="stats-grid">
        <div className={`stat-card accent`}>
          <span className="stat-value"><CountUp target={averageAccuracy} />%</span>
          <span className="stat-label">정확도</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{formatTime(totalTime)}</span>
          <span className="stat-label">소요 시간</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{sentences.length}</span>
          <span className="stat-label">완료 문장</span>
        </div>
        <div className={`stat-card ${chosungViolations > 0 ? 'warn' : ''}`}>
          <span className="stat-value">{chosungViolations}</span>
          <span className="stat-label">초성 위반</span>
        </div>
      </div>

      {/* Grade badge */}
      <div className={`grade-badge ${grade.class}`}>
        {grade.label}
      </div>

      {/* Sentence-by-sentence feedback */}
      <div className="feedback-list">
        <h2 className="feedback-title">문장별 피드백</h2>
        {sentences.map((item, i) => (
          <div key={i} className="feedback-item">
            <div className="feedback-header">
              <span className="feedback-num">#{i + 1}</span>
              <span className={`feedback-accuracy ${item.accuracy >= 90 ? 'high' : item.accuracy >= 70 ? 'mid' : 'low'}`}>
                {item.accuracy}%
              </span>
            </div>

            {/* Target sentence */}
            <div className="feedback-target">
              <span className="feedback-label">원문</span>
              <p>{item.target}</p>
            </div>

            {/* Diff view */}
            <div className="feedback-diff">
              <span className="feedback-label">입력</span>
              <p className="diff-text">
                {diffStrings(item.target, item.input).map((d, j) => (
                  <span key={j} className={`diff-char diff-${d.type}`}>
                    {d.type === 'wrong' ? (
                      <span className="diff-wrong-wrap">
                        <span className="diff-expected">{d.char}</span>
                        <span className="diff-actual">{d.actual}</span>
                      </span>
                    ) : d.type === 'missing' ? (
                      <span className="diff-missing">{d.char}</span>
                    ) : d.type === 'extra' ? (
                      <span className="diff-extra">{d.char}</span>
                    ) : (
                      d.char
                    )}
                  </span>
                ))}
              </p>
            </div>

            {item.accuracy === 100 && (
              <div className="feedback-perfect">완벽한 입력</div>
            )}
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="result-actions">
        <button className="restart-btn" onClick={onRestart}>
          다시 훈련하기
        </button>
      </div>
    </div>
  )
}
