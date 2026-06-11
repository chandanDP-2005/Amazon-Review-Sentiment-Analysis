
function analyzeSentiment() {
  const fileInput = document.getElementById('csvFile');
  const file = fileInput.files[0];
  if (!file) return alert("Please upload a CSV file.");

  Papa.parse(file, {
    header: true,
    skipEmptyLines: true,
    complete: function(results) {
      const reviews = results.data.map(row => row['reviews.text'] || row['review'] || row['review_body']);
      const sentimentCounts = { Positive: 0, Neutral: 0, Negative: 0 };

      reviews.forEach(review => {
        const score = getSentimentScore(review);
        if (score > 0.2) sentimentCounts.Positive++;
        else if (score < -0.2) sentimentCounts.Negative++;
        else sentimentCounts.Neutral++;
      });

      renderChart(sentimentCounts);
    }
  });
}

function getSentimentScore(text) {
  if (!text) return 0;
  const positiveWords = ['good', 'great', 'amazing', 'love', 'excellent', 'nice', 'perfect', 'happy'];
  const negativeWords = ['bad', 'terrible', 'worst', 'hate', 'awful', 'poor', 'disappointed', 'broken'];

  const words = text.toLowerCase().split(/\W+/);
  let score = 0;
  words.forEach(word => {
    if (positiveWords.includes(word)) score += 1;
    if (negativeWords.includes(word)) score -= 1;
  });
  return score;
}

function renderChart(sentiments) {
  const ctx = document.getElementById('sentimentChart').getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Positive', 'Neutral', 'Negative'],
      datasets: [{
        label: 'Number of Reviews',
        data: [sentiments.Positive, sentiments.Neutral, sentiments.Negative],
        backgroundColor: ['#4caf50', '#ffc107', '#f44336']
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        title: {
          display: true,
          text: 'Sentiment Analysis of Reviews'
        }
      }
    }
  });
}
