import React, { useEffect, useState } from 'react';
import './App.css';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

function App() {
  const [sensorData, setSensorData] = useState(null);
  const [sensorHistory, setSensorHistory] = useState([]);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newData = {
        timestamp: new Date().toLocaleTimeString(),
        temp: parseFloat((20 + Math.random() * 5).toFixed(1)),
        humidity: parseFloat((40 + Math.random() * 20).toFixed(1)),
        voc: parseInt(150 + Math.random() * 50, 10),
        co2: parseInt(400 + Math.random() * 100, 10),
        ozone: parseInt(20 + Math.random() * 30, 10),
        no2: parseInt(10 + Math.random() * 40, 10),
      };

      setSensorData(newData);

      setSensorHistory((prev) => {
        const updated = [...prev, newData];
        return updated.length > 12 ? updated.slice(updated.length - 12) : updated;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (value, thresholds) => {
    if (value < thresholds.good) return 'green';
    if (value < thresholds.moderate) return 'orange';
    return 'red';
  };

  const getLineColor = (key) => {
    const colors = {
      temp: '#ff7300',
      humidity: '#387908',
      voc: '#8884d8',
      co2: '#00bcd4',
      ozone: '#ff4081',
      no2: '#8bc34a',
    };
    return colors[key] || '#8884d8';
  };

  const metricLabels = {
    temp: 'Temperature (°C)',
    humidity: 'Humidity (%)',
    voc: 'VOC Index',
    co2: 'CO₂ (ppm)',
    ozone: 'Ozone (ppb)',
    no2: 'NO₂ (ppb)',
  };

  return (
    <div className="App">
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 10 }}>
        <button
          onClick={() => setDarkMode((prev) => !prev)}
          style={{
            background: 'transparent',
            border: '1px solid var(--text-color)',
            color: 'var(--text-color)',
            padding: '0.4rem 1rem',
            borderRadius: 5,
            cursor: 'pointer',
            fontWeight: 'bold',
            transition: 'background-color 0.3s ease, color 0.3s ease',
          }}
          aria-label="Toggle dark mode"
        >
          {darkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
      </div>

      <h1>Sporecast Dashboard</h1>

      <section className="project-info">
        <h2>About the Project</h2>
        <p>
          Sporecast monitors environmental air quality using fungi and lichen as living sensors.
          These organisms react to pollutants like VOCs, CO₂, ozone, and nitrogen dioxide,
          providing natural bioindications of air health. The dashboard visualizes simulated
          sensor data reflecting these changes.
        </p>
      </section>

      {sensorData ? (
        <>
          <ul className="sensor-data">
            {['temp', 'humidity', 'voc', 'co2', 'ozone', 'no2'].map((key) => (
              <li key={key}>
                <span
                  className={`status-indicator ${getStatusColor(sensorData[key], {
                    temp: { good: 22, moderate: 25 },
                    humidity: { good: 45, moderate: 60 },
                    voc: { good: 170, moderate: 190 },
                    co2: { good: 450, moderate: 500 },
                    ozone: { good: 35, moderate: 40 },
                    no2: { good: 12, moderate: 15 },
                  }[key])}`}
                />
                <strong>{metricLabels[key]}:</strong> {sensorData[key]}
              </li>
            ))}
          </ul>

          <section className="chart-section">
            <h2>Sensor History</h2>
            <div className="chart-grid">
              {['temp', 'humidity', 'voc', 'co2', 'ozone', 'no2'].map((key) => (
                <div key={key} className="mini-chart">
                  <h3>{metricLabels[key]}</h3>
                  <ResponsiveContainer width="100%" height={180}>
                    <LineChart data={sensorHistory}>
                      <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#444' : '#ccc'} />
                      <XAxis dataKey="timestamp" hide />
                      <YAxis
                        stroke={darkMode ? '#ddd' : '#333'}
                        tick={{ fill: darkMode ? '#ddd' : '#333' }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: darkMode ? '#333' : '#fff',
                          borderColor: darkMode ? '#555' : '#ccc',
                          color: darkMode ? '#eee' : '#333',
                        }}
                        labelStyle={{ color: darkMode ? '#ccc' : '#666' }}
                      />
                      <Line
                        type="monotone"
                        dataKey={key}
                        stroke={getLineColor(key)}
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ))}
            </div>
          </section>
        </>
      ) : (
        <p>Loading data...</p>
      )}
    </div>
  );
}

export default App;
