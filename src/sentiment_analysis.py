from textblob import TextBlob

def analyze_sentiment(text):
    blob = TextBlob(text)
    polarity = blob.sentiment.polarity
    subjectivity = blob.sentiment.subjectivity

    if polarity > 0.1:
        sentiment_label = "Positive"
    elif polarity < -0.1:
        sentiment_label = "Negative"
    else:
        sentiment_label = "Neutral"

    return {
        "polarity": polarity,
        "subjectivity": subjectivity,
        "sentiment_label": sentiment_label
    }

def aggregate_sentiment(posts):
    total_polarity = 0
    total_subjectivity = 0
    sentiment_counts = {"Positive": 0, "Neutral": 0, "Negative": 0}

    for post in posts:
        sentiment = analyze_sentiment(post["text"])
        total_polarity += sentiment["polarity"]
        total_subjectivity += sentiment["subjectivity"]
        sentiment_counts[sentiment["sentiment_label"]] += 1
        post["sentiment"] = sentiment  # Attach sentiment to post

    num_posts = len(posts) if posts else 1  # Avoid division by zero

    return {
        "average_polarity": total_polarity / num_posts,
        "average_subjectivity": total_subjectivity / num_posts,
        "sentiment_distribution": sentiment_counts
    }
