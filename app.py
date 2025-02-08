from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS  # Import CORS

import praw

from textblob import TextBlob
import os


from google import genai
from google.genai import types
from dotenv import load_dotenv

from collections import Counter

app = Flask(__name__, static_folder='client/src')
CORS(app)

load_dotenv()

# Initialize Reddit API
reddit = praw.Reddit(
    client_id=os.getenv("REDDIT_CLIENT_ID"),
    client_secret=os.getenv("REDDIT_CLIENT_SECRET"),
    user_agent=os.getenv("REDDIT_USER_AGENT")
)

# Initialize Gemini API
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

def summarize(text, type, image=None):
    """
    Summarizes the given message
    """

    if type == "post":
        system_instruction="Provide a concise summary of the post and focus on key points and main ideas:"
    elif type == "topic":
        system_instruction="Provide a concise summary of the numbered list of posts provided and focus on key points and main ideas that correlate to the overarching topic:"

    response = client.models.generate_content(
        model="gemini-2.0-flash",
        config=types.GenerateContentConfig(
        system_instruction=["Summarize the following inputted message:"]),
        contents=[text]
    )
    return response.text
    
def fetch_post_info(topic, sort='hot', limit=5):
    """
    Fetch Reddit posts based on a topic.
    """
    posts_info = []
    topic_summary = ""

    aggregate_polarity = 0
    aggregate_subjectivity = 0

    image_extensions = [".jpeg", ".png"]

    # TODO: check if the post is solely image based 
    for index, submission in enumerate(reddit.subreddit('all').search(topic, sort, limit=limit)):
        title = submission.title
        full_text = title + " " + submission.selftext
        topic_summary += f"{index}. {full_text}"
        url = submission.url

        message = TextBlob(full_text)

        # Retrieves the comment's polarity and subjectivity
        polarity = message.sentiment.polarity
        subjectivity = message.sentiment.subjectivity

        summary = summarize(full_text, "post")
        print(summary)

        aggregate_polarity += polarity
        aggregate_subjectivity += subjectivity
        
        # Stores post data to dictionary
        post_data = {
            "title": title,
            "url": url,
            "summary": summary,
            "polarity": polarity,
            "subjectivity": subjectivity
        }

        posts_info.append(post_data)

    print(summarize(topic_summary, "topic"))

    # Calculates the average polarity and subjectivity of the user's comments
    aggregate_polarity = aggregate_polarity/len(posts_info)
    aggregate_subjectivity = aggregate_subjectivity/len(posts_info)

    return posts_info, aggregate_polarity, aggregate_subjectivity

print(fetch_post_info("hachiware"))

def fetch_reddit_user_info(username, limit=20):
    user_info = []
    subreddits = {}

    user = reddit.redditor(username)
    user_info.append(user.icon_img)

    aggregate_polarity = 0
    aggregate_subjectivity = 0

    # Does it in order of latest -> oldest
    for comment in user.comments.new(limit=limit):
        message = TextBlob(comment.body)

        # Retrieves the comment's polarity and subjectivity
        polarity = message.sentiment.polarity
        subjectivity = message.sentiment.subjectivity

        aggregate_polarity += polarity
        aggregate_subjectivity += subjectivity
        
        
        if comment.subreddit.display_name in subreddits:
            subreddits[comment.subreddit.display_name] += 1
        else:
            subreddits[comment.subreddit.display_name] = 1

        # Stores polarity and subjectivity of each user's comment
        comment_data = {
            "polarity": polarity,
            "subjectivity": subjectivity,
        }
        user_info.append(comment_data)
    
    # Retrieves the user's top 3 most frequently subreddits they've commented on
    top_subreddits = Counter(subreddits)
    if(not top_subreddits):
        top_3_subreddits = []
    else:
        top_3_subreddits = top_subreddits.most_common(3) 
    
    # Calculates the average polarity and subjectivity of the user's comments
    aggregate_polarity = aggregate_polarity/len(user_info)
    aggregate_subjectivity = aggregate_subjectivity/len(user_info)

    return user_info, top_3_subreddits, aggregate_polarity, aggregate_subjectivity

# Serve the static files (HTML, CSS, JS)
@app.route('/')
def index():
    return send_from_directory('client/src', 'index.html')

@app.route('/src/<path:path>')
def static_file(path):
    return send_from_directory('client/src', path)

@app.route('/analyze', methods=['POST'])
def analyze():
    sort = 'hot'
    topic = request.args.get('topic')
    sort = request.args.get('sort')
    if not topic:
        return jsonify({"error": "Please provide a topic"}), 400
    sort = request.args.get('sort')
    if sort != 'hot':
        posts, aggregate_polarity, aggregate_subjectivity = fetch_post_info(topic, sort)
    else:
        posts, aggregate_polarity, aggregate_subjectivity = fetch_post_info(topic)
    
    return jsonify({
        'topic': topic,
        'sort': sort,
        'posts': posts,
        'aggregate_polarity': aggregate_polarity,
        'aggregate_subjectivity': aggregate_subjectivity
    })

if __name__ == '__main__':
    app.run(debug=True)