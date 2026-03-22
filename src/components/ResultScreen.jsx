import { useMemo } from 'react'
import { diffStrings, formatTime } from '../utils'
import './ResultScreen.css'

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
      <div className="result-header">
        <h1 className="result-title">훈련 완료</h1>
        <p className="result-subtitle">세션 리포트</p>
      </div>

      {/* Stats cards */}
      <div className="stats-grid">
        <div className={`stat-card accent`}>
          <span className="stat-value">{averageAccuracy}%</span>
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
