export const fetchVideoDetails = async (url) => {
  try {
    const response = await fetch('http://localhost:5000/api/video/extract', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch video details from server');
    }

    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

export const fetchPlaylistUrls = async (url) => {
  try {
    const response = await fetch('http://localhost:5000/api/video/playlist', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch playlist URLs');
    }

    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};