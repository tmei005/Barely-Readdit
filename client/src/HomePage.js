import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AnimatedFrame from "./AnimatedFrame.js";
import "./HomePage.css";

export const HomePage = () => {
  const [topic, setTopic] = useState("");
  const navigate = useNavigate(); // Initialize navigation

  // Function to handle Enter key press
  const handleKeyDown = (event) => {
    if (event.key === "Enter" && topic.trim() != "") {
      navigate(`/content?topic=${encodeURIComponent(topic)}`); // Redirect with topic
    }
  };

  return (
    <div className="home-page">
      <div className="div">
        <header className="header">
          <div className="group">
            <div>
              <AnimatedFrame width="165px" height="165px" />
            </div>
            <div className="text-wrapper">BarelyReaddit</div>
          </div>
        </header>

        <p className="discover-relevant">
          <span className="span">
            Discover Relevant Reddit Posts in an Instant
            <br />
          </span>

          <span className="text-wrapper-2">
            Get instant access to a curated list of Reddit posts on any topic
            that interests you. Simply search for a topic on our interface and
            we&#39;ll provide you with relevant results, sorted by your choice
            of: Hot, New, Top, Rising
            <br />
          </span>

          <span className="text-wrapper-3">
            <br />
          </span>

          <span className="span">
            Gain Insights with Our Advanced Analytics
            <br />
          </span>

          <span className="text-wrapper-2">
            For each topic, we&#39;ll provide a snapshot of the community
            sentiment, subjectivity, and popularity based on the posts listed.
            This helps you quickly understand the tone and dynamics of the
            conversation.
            <br />
          </span>

          <span className="text-wrapper-3">
            <br />
          </span>

          <span className="span">
            Dive Deeper with Our Summary Feature
            <br />
          </span>

          <span className="text-wrapper-2">
            Under each Reddit post, we&#39;ll provide a brief summary of the
            original post, along with a sentiment and subjectivity rating. This
            gives you a quick and easy way to grasp the main points and emotions
            behind each post.
            <br />
          </span>

          <span className="text-wrapper-3">
            <br />
          </span>

          <span className="span">
            Start Exploring Now
            <br />
          </span>

          <span className="text-wrapper-2">
            Search for a topic, browse our curated results, and gain a deeper
            understanding of the online community. BarelyReaddit is your
            one-stop-shop for discovering and analyzing Reddit posts like never
            before.
          </span>
        </p>

        <div className="text-wrapper-4">Welcome to BarelyReaddit!</div>

        <div className="overlap-2">
          <header className="header">
            <input
              className="search-bar-home"
              type="text"
              id="topicInput"
              value={topic}
              onChange={(e) => setTopic(e.target.value)} // Update topic on input change
              onKeyDown={handleKeyDown} // Trigger function on Enter key press
              placeholder="Search BarelyReaddit"
            />
          </header>
        </div>
      </div>
    </div>
  );
};
