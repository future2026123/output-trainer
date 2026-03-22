import { useState } from 'react'
import './StartScreen.css'

export default function StartScreen({ onStart }) {
  const [hovering, setHovering] = useState(false)

  return (
    <div className="start-screen">
      <div className="start-glow" />

      <div className="start-symbol">
        <div className="ring ring-1" />
        <div className="ring ring-2" />
        <div className="ring ring-3" />
        <span className="symbol-text">制</span>
      </div>

      <h1 className="start-title">제어 훈련</h1>
      <p className="start-subtitle">인지 → 출력 동기화 시스템</p>

      <div className="start-features">
        <div className="feature">
          <span className="feature-num">01</span>
          <span className="feature-label">문장 끊기</span>
          <span className="feature-desc">블록 단위 입력</span>
        </div>
        <div className="feature">
          <span className="feature-num">02</span>
          <span className="feature-label">딜레이 강제</span>
          <span className="feature-desc">생각 후 입력</span>
        </div>
        <div className="feature">
          <span className="feature-num">03</span>
          <span className="feature-label">초성 금지</span>
          <span className="feature-desc">완성형만 허용</span>
        </div>
        <div className="feature">
          <span className="feature-num">04</span>
          <span className="feature-label">사후 피드백</span>
          <span className="feature-desc">흐름 유지 교정</span>
        </div>
      </div>

      <button
        className="start-btn"
        onClick={onStart}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
      >
        <span className="btn-text">훈련 시작</span>
        <span className={`btn-arrow ${hovering ? 'active' : ''}`}>→</span>
      </button>

      <p className="start-hint">10문장 · 약 5분 소요</p>
    </div>
  )
}
