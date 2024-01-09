export const getTimeAgo = (created_utc) => {
    const createdAtTimeInSeconds = created_utc;
    const currentTimeInSeconds = Math.floor(new Date().getTime() / 1000);
    const timeInSeconds = currentTimeInSeconds - createdAtTimeInSeconds;
    const timeInMinutes = Math.round(timeInSeconds / 60);
    const timeInHours = Math.round(timeInMinutes / 60);
    const daysAgo = Math.round(timeInHours / 24);


    if (timeInHours < 1 && timeInSeconds >= 60) {
        return timeInMinutes > 1 ? `${timeInMinutes} minutes ago` : `${timeInMinutes} minute ago`;
    } else if (timeInSeconds < 60) {
        return 'Just now'
    } else if (timeInHours < 24) {
        return timeInHours > 1 ? `${timeInHours} hours ago` : `${timeInHours} hour ago`;
    } else {
        return daysAgo > 1 ? `${daysAgo} days ago` : `${daysAgo} day ago`;
    }
};

export const cleanUrl = (imgUrl) => {
    let encoded = imgUrl.replace("amp;s", "s");
    let doubleEncoded = encoded.replace("amp;", "");
    let tripleEncoded = doubleEncoded.replace("amp;", "");
    let quadEncoded = tripleEncoded.replace("amp;v", "v");
    return quadEncoded;
};

export const checkForUrl = (text) => {
    const urlRegex = /(https?:\/\/[^\s]+)/;
    return urlRegex.test(text)
}

export const extractUrl = (text) => {
    const urlRegex = /(https?:\/\/[^\s]+)/;
    //const checkForUrl = urlRegex.test(text);
    const match = text.match(urlRegex);
    if (match){
        const urlIndex = match.index
        return {
            before: text.substring(0, urlIndex),
            url: match[0],
            after: text.substring(urlIndex + match[0].length)
        }
    }

    return match.input
}


export const checkMediaType = (post) => {
    let mediaType = "";
    if ((post.post_hint && post.post_hint === 'link') || 
    (post.url && !post.is_self && (post.thumbnail === "" || post.thumbnail === "default"))) {
        mediaType = 'link'
    } else if (!post.is_gallery &&
        !post.is_video &&
        !post.is_self &&
        post.preview && (post.post_hint !== 'link' && post.post_hint !== "rich:video")) {
        mediaType = "img";
    } else if (post.is_gallery) {
        mediaType = "gallery";
    } else if (post.is_video) {
        mediaType = "video";
    } else if (post.post_hint === "rich:video" && 
    (post.domain === "youtube.com" || post.domain === "clips.twitch.tv")) {
        mediaType = "videoEmbed";
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
            if (post.media) {
                mediaContent['src'] = post.media.oembed.thumbnail_url;
            } else {
                mediaContent['src'] = mediaContent["src"] = cleanUrl(resolutions[resolutions.length - 1].url)
            }

            //mediaContent['height'] = resolutions[resolutions.length - 1].height;
            //mediaContent['width'] = resolutions[resolutions.length - 1].width;
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
                src: cleanUrl(url),
                height: heights[index],
                width: widths[index],
                id: mediaIds[index]
            }));

            mediaContent['gallery_data'] = galleryData;
            return mediaContent;
        }
        case ("video"): {
            mediaContent['src'] = post.secure_media.reddit_video.fallback_url;
            //const resolutions = post.preview.images[0].resolutions;
            //const height = resolutions[resolutions.length - 3].height;
            //const width = resolutions[resolutions.length - 3].width;
            //mediaContent['height'] = height;
            //mediaContent['width'] = width;
            return mediaContent;
        }
        case ("link"): {
            mediaContent["href"] = post.url;
            return mediaContent;
        }

        case ("text"): {
            if (post.selftext) {
                const containsUrl = checkForUrl(post.selftext);
                if (!containsUrl) {
                    mediaContent['selftext'] = post.selftext;
                }
                if (containsUrl) {
                    const extractedObj = extractUrl(post.selftext);
                    mediaContent['before'] = extractedObj.before;
                    mediaContent['url'] = extractedObj.url;
                    mediaContent['after'] = extractedObj.after;
                }
                
            } 
            return mediaContent;
        }
        case ("videoEmbed"): {
            mediaContent["src"] = post.url;
            console.log(mediaContent);
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
            return match[1];
        }
        return null;
    } else return;
}

