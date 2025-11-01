import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [weather, setWeather] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchWeather = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/weatherforecast')
      if (!response.ok) {
        throw new Error('Failed to fetch weather data')
      }
      const data = await response.json()
      setWeather(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>.NET 9 + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>

      <div className="card">
        <h2>Weather Forecast</h2>
        <button onClick={fetchWeather} disabled={loading}>
          {loading ? 'Loading...' : 'Fetch Weather'}
        </button>

        {error && <p style={{ color: 'red' }}>Error: {error}</p>}

        {weather.length > 0 && (
          <div style={{ marginTop: '20px' }}>
            {weather.map((forecast, index) => (
              <div key={index} style={{ margin: '10px 0', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}>
                <p><strong>Date:</strong> {forecast.date}</p>
                <p><strong>Temperature:</strong> {forecast.temperatureC}°C / {forecast.temperatureF}°F</p>
                <p><strong>Summary:</strong> {forecast.summary}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <p className="read-the-docs">
        Click "Fetch Weather" to test the API integration
      </p>
    </>
  )
}

export default App
