# Reddit-Sentiment-Analyzer

Barely Readdit


Description: With Barely Readdit, the user can search up a topic of interest on the interface and it’ll generate a list of Reddit posts that’s sorted based on the user’s choice of the following: relevance, hot, new, top, and comments. The topic will produce an average scoring of sentiment, subjectivity, and popularity from the posts listed. Under each Reddit post, it’ll provide a brief summary of the original posting along with a sentiment and subjectivity rating.

Steps on using Barely Readdit:

Cloning Repository:
1. https://github.com/tmei005/Barely-Readdit.git

Create the virtual environment:
python -m venv venv
For Windows users use the command: venv\Scripts\activate
For macOS/Linux users, use the command: venv/bin/activate
pip install flask praw textblob python-dotenv flask-cors 

Running Application:
Install node.js from the official website: https://nodejs.org/en
Open an additional terminal
1st terminal:
cd client
npm install
npm start
2nd terminal:
python app.py
