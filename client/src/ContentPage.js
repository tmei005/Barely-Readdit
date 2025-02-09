import React, { useState } from "react";
import "./styles.css";
import thumbsUp from "./assets/thumbs-up-regular.svg";
import thumbsDown from "./assets/thumbs-down-regular.svg";
import thumbsNeutral from "./assets/thumbs-neutral.png";
import bottomLine2 from "./assets/Bottom-Line.png";
import arrowUp from "./assets/arrow-trend-up-solid.svg";
import arrowDown from "./assets/arrow-trend-down-solid.svg";
import arrowRight from "./assets/arrow-right-solid.svg";
import bottomLine from "./assets/Bottom-Line.png";
import divider from "./assets/Divider.png";
import logo from "./assets/Logo.png";
import polygon1 from "./assets/Polygon.png";
import topLine from "./assets/top-line.png";
import subReddit from "./assets/subreddit.png";
import magnifyingGlass from "./assets/magnifying-glass.svg";

export const ContentPage = () => {
  const [inputTopic, setInputTopic] = useState(""); // For input value
  const [displayTopic, setDisplayTopic] = useState(""); // For topic displayed in text-wrapper-5
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [sort, setSort] = useState("hot"); // Default sort value

  const handleAnalyze = async () => {
    setLoading(true);
    setError(null);
    const topic = inputTopic;
    console.log("Entered topic:", topic);
    try {
      const response = await fetch(
        `http://127.0.0.1:5000/analyze?topic=${encodeURIComponent(topic)}`
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      setResult(data);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  // Function to detect Enter key press
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      setDisplayTopic(inputTopic);
      handleAnalyze();
    }
  };

  return (
    <div className="content-page">
      <div className="div">
        <div className="overlap">
          {result && (
            <div id="result">
              {result.posts.map((post, index) => (
                <div key={index} className="post-3">
                  {/* Dynamic Post Content */}
                  <a class="title-link" href={post.url} target="_blank">
                    <div className="text-wrapper-2">{post.title}</div>
                  </a>
                  <div className="text-wrapper">{post.summary}</div>

                  {/* Icon Section */}
                  <div className="icon-container">
                    <div className="sentiment-icon">
                      <img
                        className="thumbs-up"
                        alt="Sentiment Score"
                        src={
                          post.polarity > 0
                            ? thumbsUp
                            : post.polarity < 0
                            ? thumbsDown
                            : thumbsNeutral
                        }
                      />
                    </div>
                    <div className="subjectivity-icon">
                      {/* <img className="num" alt="Subjectivity Score" {post.subjectivity} /> */}
                      <div className="num">
                        {(post.subjectivity * 10).toFixed(1)}
                      </div>
                    </div>
                  </div>

                  {/* Decorative Line Below Icons */}
                  <img
                    className="bottom-line"
                    alt="Bottom line"
                    src={bottomLine2}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
        <img className="top-line" alt="Top line" src={topLine} />
        {result && (
          <div className="summary-block">
            <div className="overlap-group-2">
              <div className="div-wrapper">
                <div className="text-wrapper-5">{displayTopic}</div>
                <div className="text-wrapper-6">{result.topic_summary}</div>
                <div className="popularity-icon">
                  <img
                    className="arrow-up"
                    alt="arrow up"
                    src={
                      result.popularity_change > 0
                        ? arrowUp
                        : result.popularity_change < 0
                        ? arrowDown
                        : arrowRight
                    }
                  />
                </div>{" "}
              </div>

              <div className="num-wrapper">
                <div className="num">
                  {(result.aggregate_subjectivity * 10).toFixed(1)}
                </div>
              </div>

              <div className="thumbs-neutral-wrapper">
                <img
                  className="thumbs-up"
                  alt="Sentiment Score"
                  src={
                    result.polarity > 0
                      ? thumbsUp
                      : result.polarity < 0
                      ? thumbsDown
                      : thumbsNeutral
                  }
                />
              </div>
              <div className="box1">
                <img
                  className="subreddit-bubble1"
                  alt="subreddit-1"
                  src={result.top_3_subreddits[0]}
                />
              </div>

              <div className="box2">
                <img
                  className="subreddit-bubble2"
                  alt="subreddit-2"
                  src={result.top_3_subreddits[1]}
                />
              </div>

              <div className="box3">
                <img
                  className="subreddit-bubble3"
                  alt="subreddit-3"
                  src={result.top_3_subreddits[2]}
                />
              </div>
            </div>
          </div>
        )}
        <div className="overlap-2">
          <header className="header">
            <img className="divider" alt="Divider" src={divider} />
            <input
              className="search-bar"
              type="text"
              id="inputTopic"
              value={inputTopic}
              onChange={(e) => setInputTopic(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search BarelyReaddit"
            />
            <div className="group">
              <a href="/">
                <div className="text-wrapper-7">BarelyReaddit</div>
                <img className="logo" alt="Logo" src={logo} />
              </a>
            </div>
            <img
              className="glass"
              alt="Magnifying Glass"
              src={magnifyingGlass}
            />
          </header>

          {loading && <p id="loading"></p>}

          {error && <p>{error}</p>}

          <div className="overlap-wrapper">
            <div className="dropdown-container">
              <select
                className="dropdown-select"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                <option value="hot">Hot</option>
                <option value="new">New</option>
                <option value="top">Top</option>
                <option value="rising">Rising</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
