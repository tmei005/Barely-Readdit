from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS  # Import CORS
import praw
from textblob import TextBlob
from dotenv import load_dotenv
import os

app = Flask(__name__, static_folder='client/src')
CORS(app)

load_dotenv()

# Initialize Reddit API
reddit = praw.Reddit(
    client_id=os.getenv("REDDIT_CLIENT_ID"),
    client_secret=os.getenv("REDDIT_CLIENT_SECRET"),
    user_agent=os.getenv("REDDIT_USER_AGENT")
)
def summarize(text):
    """
    Provide a simple summary of the text.
    For simplicity, we'll use the title as the summary.
    """
    return text

def fetch_post_info(topic, limit=20):
    """
    Fetch Reddit posts based on a topic.
    """
    posts_info = []
    aggregate_sentiment = 0

    for submission in reddit.subreddit('all').search(topic, limit=limit):
        title = submission.title
        full_text = title + " " + submission.selftext
        url = submission.url
        polarity = full_text.polarity
        summary = summarize(submission.selftext)  # Simplified summary using the title
        sentiment_score = full_text.sentiment
        aggregate_sentiment += sentiment_score
        
        post_data = {
            "title": title,
            "url": url,
            "polarity": polarity,
            "summary": summary,
            "sentiment_score": sentiment_score
        }
        posts_info.append(post_data)
    aggregate_sentiment = aggregate_sentiment/len(post_data)
    return posts_info, aggregate_sentiment

# Serve the static files (HTML, CSS, JS)
@app.route('/')
def index():
    return send_from_directory('client/src', 'index.html')

@app.route('/src/<path:path>')
def static_file(path):
    return send_from_directory('client/src', path)

@app.route('/analyze', methods=['POST'])
def analyze():
    topic = request.args.get('topic')
    if not topic:
        return jsonify({"error": "Please provide a topic"}), 400

    posts, aggregate_sentiment = fetch_post_info(topic)
    
    return jsonify({
        'topic': topic,
        'posts': posts,
        'aggregate_sentiment': aggregate_sentiment
    })

if __name__ == '__main__':
    app.run(debug=True)