
chrome.storage.local.get('preferences', function (data) {
    const preferences = data.preferences || [];
    if (preferences.length > 0) {
        fetchVideos(shuffle(preferences));
    } else {
        document.getElementById('videoContainer').innerHTML = 'No preferences found. Please set preferences in the extension popup.';
    }
});

// Function to shuffle the preferences array
function shuffle(arr) {
    let shuffledArr = arr.slice();
    for (let i = shuffledArr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledArr[i], shuffledArr[j]] = [shuffledArr[j], shuffledArr[i]]; // Swap elements
    }
    return shuffledArr;
}

// Fetch videos based on user preferences
function fetchVideos(preferences) {
    const API_KEY = 'AIzaSyAMSKQU-Xb9VJYLtycfswhkzAJTCk_oNeE';  // Replace with your actual API Key
    const query = preferences.join(' ');
    const apiUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&type=video&key=${API_KEY}&maxResults=1000`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const videoContainer = document.getElementById('videoContainer');
            data.items.forEach(video => {
                const videoId = video.id.videoId;
                const videoDetailsUrl = `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${videoId}&key=${API_KEY}`;

                // Fetch video duration
                fetch(videoDetailsUrl)
                    .then(response => response.json())
                    .then(details => {
                        const videoDuration = details.items[0].contentDetails.duration;
                        const videoLengthInSeconds = convertDurationToSeconds(videoDuration);

                        // Filter out videos shorter than 3 minutes (180 seconds)
                        if (videoLengthInSeconds > 10) {
                            const videoElement = document.createElement('div');
                            videoElement.classList.add('video-item');
                            videoElement.innerHTML = `
                                <img src="${video.snippet.thumbnails.medium.url}" alt="${video.snippet.title}">
                                <a href="https://www.youtube.com/watch?v=${video.id.videoId}" target="_blank">${video.snippet.title}</a>
                                <span class="video-duration">${formatDuration(videoDuration)}</span>
                            `;
                            videoContainer.appendChild(videoElement);
                        }
                    })
                    .catch(error => console.error('Error fetching video details:', error));
            });
        })
        .catch(error => {
            console.error('Error fetching videos:', error);
        });
}

// Convert ISO 8601 duration to seconds
function convertDurationToSeconds(duration) {
    const matches = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    const hours = parseInt(matches[1], 10) || 0;
    const minutes = parseInt(matches[2], 10) || 0;
    const seconds = parseInt(matches[3], 10) || 0;

    return (hours * 3600) + (minutes * 60) + seconds;
}

// Format ISO 8601 duration to a readable format (e.g., "1h 2m 30s")
function formatDuration(duration) {
    const matches = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    const hours = matches[1] ? matches[1].replace('H', 'h') : '';
    const minutes = matches[2] ? matches[2].replace('M', 'm') : '';
    const seconds = matches[3] ? matches[3].replace('S', 's') : '';

    return hours + ' ' + minutes + ' ' + seconds;
}
