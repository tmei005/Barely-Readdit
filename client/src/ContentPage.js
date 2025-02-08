import React, { useState } from 'react';
import "./styles.css";
import thumbsUp from './assets/Thumbs-Up.png'; 
import bottomLine2 from "./assets/Bottom-Line.png";
import arrowUp from "./assets/arrow-up.png"
import bottomLine from "./assets/Bottom-Line.png";
import divider from "./assets/Divider.png";
import logo from "./assets/Logo.png";
import num412 from "./assets/Num4.png";
import num413 from "./assets/Num4.png";
import num41 from "./assets/Num4.png";
import polygon1 from "./assets/Polygon.png";
import thumbsDown1 from "./assets/thumbs-down.png";
import thumbsNeutral2 from "./assets/thumbs-neutral.png";
import thumbsNeutral from "./assets/thumbs-neutral.png";
import topLine from "./assets/top-line.png";

export const ContentPage = () => {
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

   // Function to detect Enter key press
 const handleKeyDown = (event) => {
  if (event.key === 'Enter') {
    handleAnalyze();
    }
  } ;

  return (
    <div className="content-page">
      <div className="div">
        <div className="post">
          <img className="bottom-line" alt="Bottom line" src={bottomLine} />

          <div className="subjectivity-icon">
            <img className="num" alt="Num" src={num412} />
          </div>

          <div className="sentiment-icon">
            <img className="thumbs-down" alt="Thumbs down" src={thumbsDown1} />
          </div>

          <div className="text-wrapper">Summary of Post</div>

          <div className="text-wrapper-2">Title</div>

          <div className="text-wrapper-3">r/kitty</div>
        </div>

        <div className="overlap">
          <div className="post-2">
            <img className="bottom-line" alt="Bottom line" src={bottomLine} />
            <div className="subjectivity-icon">
              <img className="num" alt="Num" src={num413} />
            </div>
            <div className="sentiment-icon">
              <img
                className="thumbs-neutral"
                alt="Thumbs neutral"
                src={thumbsNeutral2}
              />
            </div>
            <div className="text-wrapper">Summary of Post</div>
            <div className="text-wrapper-2">Title</div>
            <div className="text-wrapper-3">r/ufl</div>
          </div>

          <div className="post-3">
            <img className="bottom-line" alt="Bottom line" src={bottomLine2} />

            <div className="subjectivity-icon">
              <img className="num" alt="Num" src={num41} />
            </div>

            <div className="sentiment-icon">
                <img className="thumbs-up" alt="thumbs up" src={thumbsUp} />
            </div>

            <div className="text-wrapper">Summary of Pos</div>

            <div className="text-wrapper-2">Title</div>

            <div className="text-wrapper-3">r/clairo</div>
          </div>

        </div>

        <img className="top-line" alt="Top line" src={topLine} />

        <div className="summary-block">
          <div className="overlap-group-2">
            <div className="div-wrapper">
              <div className="text-wrapper-5">Topic</div>
            </div>

            <div className="popularity-icon">
              <img className="arrow-up" alt="arrow up" src={arrowUp} />
            </div>

            <div className="num-wrapper">
              <img className="num" alt="Num" src={num41} />
            </div>

            <div className="thumbs-neutral-wrapper">
              <img
                className="thumbs-neutral"
                alt="Thumbs neutral"
                src={thumbsNeutral}
              />
            </div>

            <div className="text-wrapper-6">Overall summary</div>
          </div>
        </div>

        <div className="overlap-2">
          <header className="header">
            <img className="divider" alt="Divider" src={divider} />
            <input
              className='search-bar'
              type="text"
              id="topicInput"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search BarelyReaddit"
            />
            <div className="group">
              <div className="text-wrapper-7">BarelyReaddit</div>

              <img className="logo" alt="Logo" src={logo} />
            </div>
          </header>

          {loading && <p id="loading">Loading...</p>}

          {error && <p>{error}</p>}

          {result && (
            <div id="result">
              <h3>Reddit Posts:</h3>
              {result.posts.map((post, index) => (
                <div key={index}>
                  <p><strong>Post {index + 1}:</strong> {post.title}</p>
                  <p><strong>URL:</strong> {post.url}</p>
                  <p><strong>Summary:</strong> {post.summary}</p>
                  <p><strong>Sentiment Score:</strong> {post.polarity}</p>
                  <p><strong>Subjectivity Score:</strong> {post.subjectivity}</p>
                </div>
            ))}
            <h4>Aggregate Sentiment Score: {result.aggregate_polarity}</h4>
          </div>
     )}

          <div className="overlap-wrapper">
            <div className="overlap-3">
              <div className="text-wrapper-8">Rising</div>

              <img className="polygon" alt="Polygon" src={polygon1} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
