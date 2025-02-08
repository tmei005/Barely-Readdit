import praw
import os
from dotenv import load_dotenv

load_dotenv()  # Load environment variables

# Initialize Reddit API Client
reddit = praw.Reddit(
    client_id=os.getenv("REDDIT_CLIENT_ID"),
    client_secret=os.getenv("REDDIT_CLIENT_SECRET"),
    user_agent=os.getenv("REDDIT_USER_AGENT")
)

def fetch_reddit_posts(topic, limit=10):
    posts = []
    for submission in reddit.subreddit("all").search(topic, limit=limit):
        posts.append({
            "title": submission.title,
            "text": submission.selftext if submission.selftext else submission.title,
            "score": submission.score,
            "url": submission.url
        })
    
    return posts
