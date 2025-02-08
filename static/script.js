document.getElementById("analyzeBtn").addEventListener("click", async function() {
    const topic = document.getElementById("topicInput").value;
    console.log("Entered topic:", topic);

    if (topic.trim() === "") {
        alert("Please enter a topic to analyze.");
        return;
    }

    // Clear previous results
    document.getElementById("sentimentResult").innerHTML = "";
    document.getElementById("redditPosts").innerHTML = "";

    // Fetch data from the backend (your Flask server)
    console.log("Fetching sentiment and Reddit posts for topic:", topic);

    try {
        const response = await fetch(`/analyze?topic=${encodeURIComponent(topic)}`);
        console.log("Raw response:", response);
         // Check if the response is OK (status code 200)
        if (!response.ok) {
            console.error("Failed to fetch data. Status:", response.status);
            alert("Failed to fetch data from the server.");
            return;
        }
        // Parse the JSON response
        const data = await response.json();

        // Debug: Log the received data
        console.log("Received data:", data);
        if (data.sentiment) {
            const { polarity, subjectivity } = data.sentiment;
            document.getElementById("sentimentResult").innerHTML = `
                Polarity: ${polarity} <br>
                Subjectivity: ${subjectivity}
            `;
        } else {
            document.getElementById("sentimentResult").innerHTML = "No sentiment data available.";
        }

        if (data.redditPosts && data.redditPosts.length > 0) {
            const postsList = data.redditPosts.map(post => `<li>${post}</li>`).join("");
            document.getElementById("redditPosts").innerHTML = postsList;
        } else {
            document.getElementById("redditPosts").innerHTML = "No Reddit posts found.";
        }
    } catch (error) {
        console.error("Error fetching data:", error);
        alert("There was an error fetching the data.");
    }
});
