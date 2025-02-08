// export default App;
import React, { useState } from 'react';

function App() {
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleAnalyze = async () => {
    setLoading(true);
    setError(null);
    const topic = document.getElementById("topicInput").value;
    console.log("Entered topic:", topic);
    try {
      const response = await fetch(`http://127.0.0.1:5000/analyze?topic=${encodeURIComponent(topic)}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      setResult(data);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Error fetching data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>Analyze Reddit Topic</h1>
      <div>
        <input
          type="text"
          id="topicInput"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Enter topic"
        />
        <button
          id="analyzeBtn"
          onClick={handleAnalyze}
        >
          Analyze
        </button>
      </div>

      {loading && <p id="loading">Loading...</p>}

      {error && <p>{error}</p>}

      {result && (
        <div id="result">
          <h3>Reddit Posts:</h3>
          {result.posts.map((post, index) => (
            <div key={index}>
              <p><strong>Post {index + 1}:</strong> {post}</p>
              <p><strong>Sentiment Score:</strong> {result.sentiment_scores[index]}</p>
            </div>
          ))}
          <h4>Aggregate Sentiment Score: {result.aggregate_sentiment}</h4>
        </div>
      )}
    </div>
  );
}

export default App;