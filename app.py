import praw

# Authenticate with Reddit API
reddit = praw.Reddit(client_id='H6GGMGzGIJvwVCAxx4GWcw',
                     client_secret='a7ZNWz29TJcjkr9eqimg5x8iF9UPkg',
                     user_agent='Tina Mei')

# Function to fetch posts related to a topic
def fetch_reddit_posts(topic, limit=100):
    posts = []
    for submission in reddit.subreddit('all').search(topic, limit=limit):
        posts.append(submission.title)
    return posts

topic = "Python programming"  # Example topic
posts = fetch_reddit_posts(topic)
print(posts)
