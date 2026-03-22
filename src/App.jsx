import { useState, useCallback } from 'react'
import StartScreen from './components/StartScreen'
import TrainingScreen from './components/TrainingScreen'
import ResultScreen from './components/ResultScreen'
import './App.css'

function App() {
  const [screen, setScreen] = useState('start') // start | training | result
  const [sessionResults, setSessionResults] = useState(null)

  const handleStart = useCallback(() => {
    setScreen('training')
    setSessionResults(null)
  }, [])

  const handleComplete = useCallback((results) => {
    setSessionResults(results)
    setScreen('result')
  }, [])

  const handleRestart = useCallback(() => {
    setScreen('start')
    setSessionResults(null)
  }, [])

  return (
    <div className="app">
      {screen === 'start' && <StartScreen onStart={handleStart} />}
      {screen === 'training' && <TrainingScreen onComplete={handleComplete} />}
      {screen === 'result' && (
        <ResultScreen results={sessionResults} onRestart={handleRestart} />
      )}
    </div>
  )
}

export default App
