export const getTimeAgo = (created_utc) => {
    const createdAt = new Date(created_utc * 1000);
    const currentTime = new Date();
    const timeDifferenceInMilliseconds = currentTime - createdAt;
    const timeInSeconds = Math.floor(timeDifferenceInMilliseconds / 1000);
    const timeInMinutes = Math.floor(timeDifferenceInMilliseconds / (1000 * 60));
    const timeInHours = Math.floor(timeDifferenceInMilliseconds / (1000 * 60 * 60));
    const daysAgo = Math.floor(timeInHours / 24);

    if (timeInHours < 1 && timeInSeconds > 60) {
        return timeInMinutes >= 1 ? `${timeInMinutes} minutes ago` : `${timeInMinutes} minute ago`;
    } else if (timeInSeconds < 60) {
        return 'Just now'
    } else if (timeInHours < 25) {
        return timeInHours > 1 ? `${timeInHours} hours ago` : `${timeInHours} hour ago`;
    } else {
        return daysAgo > 1 ? `${daysAgo} days ago` : `${daysAgo} day ago`;
    }
};


export const checkMediaType = (post) => {
    let mediaType = "";
    if (!post.is_gallery &&
        !post.is_video &&
        !post.is_self &&
        post.preview) {
        mediaType = "img"
    } else if (post.is_gallery) {
        mediaType = "gallery"
    } else if (post.is_video) {
        mediaType = "video"
    } else {
        mediaType = "text"
    }
    return mediaType;
}

export const getMediaContent = (post) => {
    const mediaType = checkMediaType(post);
    const mediaContent = { type: mediaType };
    switch (mediaType) {
        case ("img"):
            const resolutions = post.preview.images[0].resolutions;
            mediaContent['src'] = post.url
            mediaContent['height'] = resolutions[resolutions.length - 1].height;
            mediaContent['width'] = resolutions[resolutions.length - 1].width;
            console.log(mediaContent);
            return mediaContent;

        case ("gallery"): {
            const mediaIds = post.gallery_data.items.map(item => item.media_id);
            const idMetadata = mediaIds.map(id => post.media_metadata[id]);
            const pData = idMetadata.map(obj => obj.p);
            const pDataExtracted = pData.map(array => array[array.length - 1])
            const urls = pDataExtracted.map(obj => obj.u);
            const heights = pDataExtracted.map(obj => obj.y);
            const widths = pDataExtracted.map(obj => obj.x);
            const galleryData = urls.map((url, index) => ({
                src: url,
                height: heights[index],
                width: widths[index],
                id: mediaIds[index]
            }));

            mediaContent['gallery_data'] = galleryData;
        }
            return mediaContent;
        case ("video"): {
            mediaContent['src'] = post.secure_media.reddit_video.fallback_url;
            mediaContent['height'] = post.secure_media.reddit_video.height;
            mediaContent['width'] = post.secure_media.reddit_video.width;
            return mediaContent;
        }
        case ("text"): {
            if (post.selftext) {
                mediaContent['selftext'] = post.selftext;
            }
            return mediaContent;
        }
        default: {
            console.log('Media Not Recognized')
        }
    }
}



/*export const formatSelftextWithLinks = (text) => {
    const parts = text.split(' ');
    return parts.map((part, index) => {
      if (part.startsWith('http://') || part.startsWith('https://')) {
        return <a href={part} target="_blank" rel="noopener noreferrer" key={index}>{part}</a>;
      }
      return part + ' ';
    });
  };*/

const he = require('he');

export const extractSrcFromBodyHtml = (comment) => {
    if (comment.body_html) {
    const decodedHtml = he.decode(comment.body_html);
    const regex = /<img[^>]+src="([^"]+)"/g;
    const match = regex.exec(decodedHtml);
    if (match && match.length > 1) {
        console.log(match[1]);
      return match[1];
    }
    return null;
    } else return;  
}