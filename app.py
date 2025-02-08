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

def fetch_reddit_posts_and_sentiment(topic, limit=10):
    """
    Fetch Reddit posts based on a topic.
    """
    posts = []
    sentiment_scores = []

    for submission in reddit.subreddit('all').search(topic, limit=limit):
        posts.append(submission.title)
        sentiment = analyze_sentiment(submission.title)
        sentiment_scores.append(sentiment)
    
    return posts, sentiment_scores

def analyze_sentiment(post_title):
    """
    Analyze the sentiment of a Reddit post using TextBlob.
    Returns a sentiment polarity score.
    """
    analysis = TextBlob(post_title)
    # Sentiment polarity ranges from -1 (negative) to 1 (positive)
    return analysis.sentiment.polarity

# Serve the static files (HTML, CSS, JS)
@app.route('/')
def index():
    return send_from_directory('client/src', 'index.html')

@app.route('/src/<path:path>')
def static_file(path):
    return send_from_directory('client/src', path)

@app.route('/analyze', methods=['GET'])
def analyze():
    topic = request.args.get('topic')
    if not topic:
        return jsonify({"error": "Please provide a topic"}), 400

    posts, sentiment_scores = fetch_reddit_posts_and_sentiment(topic)
    
    # Calculate the average sentiment score
    aggregate_sentiment = sum(sentiment_scores) / len(sentiment_scores) if sentiment_scores else 0

    return jsonify({
        'topic': topic,
        'posts': posts,
        'sentiment_scores': sentiment_scores,
        'aggregate_sentiment': aggregate_sentiment
    })

if __name__ == '__main__':
    app.run(debug=True)
