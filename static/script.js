document.getElementById("analyzeBtn").addEventListener("click", async function() {
    const topic = document.getElementById("topicInput").value;
    console.log("Entered topic:", topic);

    try {
        const response = await fetch(`/analyze?topic=${encodeURIComponent(topic)}`);
        const data = await response.json();

        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }

        console.log('Raw response:', data);

        // Handle response data
        if (data.error) {
            alert(data.error);
        } else {
            const posts = data.posts;
            const sentimentScores = data.sentiment_scores;
            const aggregateSentiment = data.aggregate_sentiment;

            // Display posts and sentiments
            let output = '<h3>Reddit Posts:</h3>';
            posts.forEach((post, index) => {
                output += `<p><strong>Post ${index + 1}:</strong> ${post}</p>`;
                output += `<p><strong>Sentiment Score:</strong> ${sentimentScores[index]}</p>`;
            });

            output += `<h4>Aggregate Sentiment Score: ${aggregateSentiment}</h4>`;

            document.getElementById('result').innerHTML = output;
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        document.getElementById('loading').style.display = 'none';
        alert('Error fetching data');
    }
});