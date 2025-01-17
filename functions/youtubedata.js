const { google } = require('googleapis');
const OAuth2 = google.auth.OAuth2;

async function channelInfo(oauth2Client){
    const youtube = google.youtube({
        version: 'v3',
        auth: oauth2Client
      });
  try {
    const response = await youtube.channels.list({
      part: 'snippet,contentDetails,statistics',
      mine: true // This will return data for the authenticated user's channel
    });
    channelId = response.data.items.id;
    if (response.data.items.length > 0) {
      var channelData = {
        id: response.data.items[0].id,
        title: response.data.items[0].snippet.title,
        description: response.data.items[0].snippet.description,
        thumbnail: response.data.items[0].snippet.thumbnails.high.url,
        views: response.data.items[0].statistics.viewCount,
        subscribers: response.data.items[0].statistics.subscriberCount
      };
    }
    return channelData;
  } catch (error) {
    console.error('Error fetching YouTube data:', error);
    return ;
  }
}

async function videos(oauth2Client) {
    const youtube = google.youtube({
        version: 'v3',
        auth: oauth2Client
      });
    try {
     const response = await youtube.channels.list({
        part: 'contentDetails',
        mine: true 
      });
      if (response.data.items.length > 0) {
        var playlistId = response.data.items[0].contentDetails.relatedPlaylists.uploads;
      } else {
        console.log('Channel not found.');
        return [];
      }
      let videoIds = [];
        let nextPageToken = null;

        // Fetch video IDs from the uploads playlist
        do {
            const res = await youtube.playlistItems.list({
                part: 'contentDetails',
                playlistId: playlistId,
                maxResults: 50, 
                pageToken: nextPageToken,
            });

            res.data.items.forEach((item) => {
                videoIds.push(item.contentDetails.videoId);
            });

            nextPageToken = res.data.nextPageToken;
        } while (nextPageToken);

        // Fetch video details in chunks of 50
        let videosdata = [];
        for (let i = 0; i < videoIds.length; i += 50) {
            const videoIdChunk = videoIds.slice(i, i + 50);
            const res = await youtube.videos.list({
                part: 'snippet,statistics',
                id: videoIdChunk.join(','),
            });

            res.data.items.forEach(video => {
              const views = parseInt(video.statistics.viewCount) || 0; // Parse views
              const likes = parseInt(video.statistics.likeCount) || 0; // Parse likes
              const comments = parseInt(video.statistics.commentCount) || 0; // Parse comments

              // Calculate engagement rate
              const totalEngagements = likes + comments;
              const engagementRate = views > 0 ? (totalEngagements / views) * 100 : 0; // Calculate engagement rate

                videosdata.push({
                    title: video.snippet.title,
                    description: video.snippet.description,
                    views: video.statistics.viewCount,
                    likes: video.statistics.likeCount,
                    comments:video.statistics.commentCount,
                    engagementRate: engagementRate.toFixed(2),
                    thumbnail: video.snippet.thumbnails.high.url
                });
            });
        }

        return videosdata;

    } catch (error) {
        console.error('Error fetching videos:', error.message);
        return [];  // Return an empty array in case of an error
    }
}

module.exports = {videos,channelInfo};