async function getVideoAnalytics(videosData) {
    
    const engagementRates = await calculateEngagementRate(videosData);
    const mostPopularContent = await findMostPopularContent(videosData);
  
    return {
      engagementRates,
      mostPopularContent,
    };
  }

  function findMostPopularContent(videosData) {
    return videosData.sort((a, b) => b.views - a.views)[0]; // Sort by views
  }

function calculateEngagementRate(videosData) {
    return videosData.map(video => {
      const totalEngagements = video.likes + video.comments; // Add shares if available
      const engagementRate = totalEngagements / video.views * 100; // Percentage
      return {
        title: video.title,
        engagementRate: isNaN(engagementRate) ? 0 : engagementRate.toFixed(2),
        views: video.views,
        likes: video.likes,
        comments: video.comments,
      };
    });
  }
  
module.exports = {findMostPopularContent,calculateEngagementRate};