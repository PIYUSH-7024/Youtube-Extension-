// This script will handle injecting the preferences-based recommendations into the YouTube page.

chrome.storage.local.get('preferences', function (data) {
  const preferences = data.preferences || [];
  if (preferences.length > 0) {
      const API_KEY = ''; // place with your YouTube API key
      const query = preferences.join(' ');
      const apiUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&type=video&key=${API_KEY}&maxResults=58`;

      fetch(apiUrl)
          .then(response => response.json())
          .then(data => {
              const videos = data.items.map(video => ({
                  title: video.snippet.title,
                  url: `https://www.youtube.com/watch?v=${video.id.videoId}`,
                  thumbnail: video.snippet.thumbnails.medium.url
              }));
              injectVideos(videos);
          })
          .catch(error => {
              console.error('Error fetching videos:', error);
          });
  }
});

// Inject recommended videos into the YouTube homepage
function injectVideos(videos) {
  const container = document.createElement('div');
  container.style = 'margin-top: 20px; padding: 10px; background-color: #f8f8f8; border-radius: 10px; border: 1px solid #ddd;';
  
  // Add a title for the recommended section
  const sectionTitle = document.createElement('h3');
  sectionTitle.textContent = 'Recommended for You';
  sectionTitle.style = 'color: #333; font-size: 16px; margin-bottom: 15px; font-weight: bold;';
  container.appendChild(sectionTitle);

  // Loop through videos and create elements
  videos.forEach(video => {
      const videoElement = document.createElement('a');
      videoElement.href = video.url;
      videoElement.target = '_blank';
      videoElement.style = 'display: flex; margin-bottom: 20px; align-items: center; text-decoration: none;';

      const thumbnail = document.createElement('img');
      thumbnail.src = video.thumbnail;
      thumbnail.style = 'width: 120px; height: 90px; margin-right: 15px; border-radius: 8px;';

      const title = document.createElement('span');
      title.textContent = video.title;
      title.style = 'font-size: 14px; color: #333; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 250px;';

      videoElement.appendChild(thumbnail);
      videoElement.appendChild(title);
      container.appendChild(videoElement);
  });

  // Target the YouTube video feed container
  const feedContainer = document.querySelector('ytd-section-list-renderer#contents');
  if (feedContainer) {
      // Clear current feed and append our custom feed
      feedContainer.innerHTML = '';  // Clear existing videos
      feedContainer.appendChild(container);  // Append the new recommended videos container
  } else {
      console.error('YouTube feed container not found!');
  }
}
