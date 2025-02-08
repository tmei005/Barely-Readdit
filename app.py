from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS  # Import CORS
import praw
import datetime
import time
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
        # make it better
        system_instruction="Provide a concise summary of the numbered list of posts provided and focus on key points and main ideas that correlate to the overarching topic:"

    response = client.models.generate_content(
        model="gemini-2.0-flash",
        config=types.GenerateContentConfig(
        system_instruction=["Summarize the following inputted message:"]),
        contents=[text]
    )
    return response.text

# Get popularity trend
def get_topic_popularity(topic):
    """
    Fetch post count for a given topic over the last 14 days 
    and calculate percentage change from the previous week.
    """
    end_time = time.time()
    one_week_ago = end_time - (7 * 24 * 60 * 60)
    two_weeks_ago = one_week_ago - (7 * 24 * 60 * 60)

    curr_count = 0
    last_count = 0
    for submission in reddit.subreddit("all").search(topic, sort="new"):  # Adjust limit as needed
        if one_week_ago <= submission.created_utc <= end_time:
            curr_count += 1
        elif two_weeks_ago <= submission.created_utc <= one_week_ago:
            last_count += 1
        else:
            break
    # Calculate percentage change
    if last_count > 0:
        popularity_change = ((curr_count - last_count) / last_count) * 100
    else:
        popularity_change = 0  # Avoid division by zero
    return popularity_change
        
# Get posts
def fetch_post_info(topic, sort='hot', limit=5):
    """
    Fetch Reddit posts based on a topic.
    """
    topic_posts = []
    topic_summary = ""

    aggregate_polarity = 0
    aggregate_subjectivity = 0
    popularity_change = get_topic_popularity(topic)

    image_extensions = [".jpeg", ".png"]

    # TODO: check if the post is solely image based 
    for index, submission in enumerate(reddit.subreddit('all').search(topic, sort, limit=limit)):
        title = submission.title
        full_text = title + " " + submission.selftext
        topic_summary += f"{index}. {full_text}"

        message = TextBlob(full_text)

        polarity = message.sentiment.polarity
        subjectivity = message.sentiment.subjectivity

        summary = summarize(full_text, "post")
        # print(summary)

        aggregate_polarity += polarity
        aggregate_subjectivity += subjectivity
        
        # Stores post data to dictionary
        post_data = {
            "subreddit": submission.subreddit.display_name,
            "redditor": submission.author.name,
            "redditor icon": submission.author.icon_img,
            "title": title,
            "url": submission.url,
            "summary": summary,
            "polarity": polarity,
            "subjectivity": subjectivity
        }
        topic_posts.append(post_data)

    topic_summary = summarize(topic_summary, "topic")

    # Calculates the average polarity and subjectivity of the user's comments
    post_average_polarity = aggregate_polarity/len(topic_posts)
    post_average_subjectivity = aggregate_subjectivity/len(topic_posts)

    return topic_posts, topic_summary, post_average_polarity, post_average_subjectivity

# print(fetch_post_info("hachiware"))

def fetch_reddit_user_info(username, limit=20):
    """
    
    """
    comments = []
    subreddits = {}

    user = reddit.redditor(username)
    username = user.name
    icon_url = user.icon_img

    aggregate_polarity = 0
    aggregate_subjectivity = 0

    # Adds it in order of latest -> oldest
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
        comments.append(comment_data)
    
    # Retrieves the user's top 3 most frequently subreddits they've commented on
    top_subreddits = Counter(subreddits)
    if(not top_subreddits):
        top_3_subreddits = []
    else:
        top_3_subreddits = top_subreddits.most_common(3) 
    
    # Calculates the average polarity and subjectivity of the user's comments
    user_average_polarity = aggregate_polarity/len(comments)
    user_average_subjectivity = aggregate_subjectivity/len(comments)

    return username, icon_url, comments, top_3_subreddits, user_average_polarity, user_average_subjectivity

# print(fetch_reddit_user_info("segcymf"))
    


    
# Serve the static files (HTML, CSS, JS)
@app.route('/')
def index():
    return send_from_directory('client/src', 'index.html')

@app.route('/src/<path:path>')
def static_file(path):
    return send_from_directory('client/src', path)

@app.route('/analyze', methods=['GET'])
def analyze():
    sort = 'hot'
    topic = request.args.get('topic')
    sort = request.args.get('sort')
    if not topic:
        return jsonify({"error": "Please provide a topic"}), 400
    sort = request.args.get('sort')
    if sort != 'hot':
        posts, topic_summary, post_aggregate_polarity, post_aggregate_subjectivity = fetch_post_info(topic, sort)
    else:
        posts, topic_summary, post_aggregate_polarity, post_aggregate_subjectivity = fetch_post_info(topic)
    
    user_info, top_3_subreddits, user_average_polarity, user_average_subjectivity = fetch_reddit_user_info(posts[redditor])

    return jsonify({
        'topic': topic,
        'sort': sort,
        'posts': posts,
        'topic_summary': topic_summary,
        'aggregate_polarity': aggregate_polarity,
        'aggregate_subjectivity': aggregate_subjectivity
    })

if __name__ == '__main__':
    app.run(debug=True)