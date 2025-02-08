from flask import Flask, jsonify, request, send_from_directory
# from flask_cors import CORS  # Import CORS
from src.reddit_api import fetch_reddit_posts
from src.sentiment_analysis import analyze_sentiment
import os

app = Flask(__name__)
# CORS(app)

# Serve the static files (HTML, CSS, JS)
@app.route('/')
def index():
    return send_from_directory('static', 'index.html')

@app.route('/static/<path:path>')
def static_file(path):
    return send_from_directory('static', path)

@app.route('/analyze', methods=['GET'])
def analyze():
    topic = request.args.get('topic')
    if not topic:
        return jsonify({"error": "Please provide a topic"}), 400

    posts = fetch_reddit_posts(topic)
    sentiment = analyze_sentiment(topic)

    return jsonify({
        "sentiment": sentiment,
        "redditPosts": posts
    })

if __name__ == '__main__':
    app.run(debug=True)
