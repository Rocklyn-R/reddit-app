export const getTimeAgo = (created_utc) => {
    const createdAtTimeInSeconds = created_utc;
    const currentTimeInSeconds = Math.floor(new Date().getTime() / 1000);
    const timeInSeconds = currentTimeInSeconds - createdAtTimeInSeconds;
    const timeInMinutes = Math.round(timeInSeconds / 60);
    const timeInHours = Math.round(timeInMinutes / 60);
    const daysAgo = Math.round(timeInHours / 24);
    const monthsAgo = Math.round(daysAgo / 30);
    const yearsAgo = Math.round(monthsAgo / 12);


    if (timeInHours < 1 && timeInSeconds >= 60) {
        return timeInMinutes > 1 ? `${timeInMinutes} minutes ago` : `${timeInMinutes} minute ago`;
    } else if (timeInSeconds < 60) {
        return 'Just now'
    } else if (timeInHours < 24) {
        return timeInHours > 1 ? `${timeInHours} hours ago` : `${timeInHours} hour ago`;
    } else if (yearsAgo >= 1) {
        return yearsAgo > 1 ? `${yearsAgo} years ago` : `${yearsAgo} year ago`;
    } else if (monthsAgo >=1 ) {
        return monthsAgo > 1 ? `${monthsAgo} months ago` : `${monthsAgo} month ago`;    
    } else if (daysAgo >= 1) {
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

export const addBaseToUrl = (url) => {
    if (url.startsWith("/r/")) {
        url = "https://www.reddit.com" + url
    }
    return url;
}

/*export const checkForUrl = (text) => {
    const urlRegex = /(https?:\/\/[^\s]+)/;
    return urlRegex.test(text)
}*/

/*export const extractUrl = (text) => {
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

    return text;
}*/
/*const checkForRedditDomain = (domain) => {
    const redditDomain = "reddit.com/live/";

}




/*export const checkMediaType = (post) => {
    let mediaType = "";
    if ((post.post_hint && post.post_hint === 'link') ||
    (post.url && !post.is_self && (post.thumbnail === "" || post.thumbnail === "default"))) {
        mediaType = 'link'
    } else if (!post.is_gallery &&
        !post.is_video &&
        !post.is_self &&
        post.preview && (post.post_hint === "image") && (post.post_hint !== 'link' && post.post_hint !== "rich:video")) {
        mediaType = "img";
    } else if (post.is_gallery) {
        mediaType = "gallery";
    } else if (post.is_video) {
        mediaType = "video";
    } else if (post.post_hint === "rich:video" && 
    (post.domain === "youtube.com" || post.domain === "clips.twitch.tv" || post.domain === "youtu.be")) {
        mediaType = "videoEmbed";
    } else if (post.is_self === true) {
        mediaType = "text"
    } else mediaType = "text"
    
    return mediaType;
}*/

export const cleanHtmlText = (text) => {
    text = text.replace(/&amp;#x200B;/g, '');
    text = text.replace(/&gt;/g, ">");
    text = text.replace(/&lt;/g, "<");
    return text;
}

export const checkMediaType = (post) => {
    let mediaType = "";
    if ((post.post_hint === "link")|| 
    (!post.post_hint && post.domain === "reddit.com") ||
    (post.url && !post.is_self && (post.thumbnail === "" || post.thumbnail === "default"))) {
        mediaType = "link"
    } else if (post.preview && post.post_hint === "image") {
        mediaType = "img"
    } else if (post.is_gallery) {
        mediaType = "gallery";
    } else if (post.is_video) {
        mediaType = "video";
    } else if (post.post_hint === "rich:video" 
    && (post.domain === "youtube.com" 
    || post.domain === "clips.twitch.tv"
    || post.domain === "youtu.be")) {
        mediaType = "videoEmbed";
    } else if (post.is_self === true) {
        mediaType = "text"
    } else {mediaType = "text";
    console.log(mediaType)
    console.log(post);
    }
    return mediaType;
}



export const getMediaContent = (post) => {
    const mediaType = checkMediaType(post);
    //console.log(mediaType);
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
            const pDataExtracted = pData.map(array => array[array.length - 1]);
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

            const shortenLink = (url) => {
              if (url.length <= 25) {
                return url;
              }
          
              const shortenedUrl = url.substring(0, 22) + '...';
              return shortenedUrl;
            };

            mediaContent["href"] = addBaseToUrl(post.url);
            mediaContent["linkDisplay"] = post.url
            return mediaContent;
        }

        case ("text"): {
            mediaContent['selftext'] = cleanHtmlText(post.selftext);
            return mediaContent;
        }
        case ("videoEmbed"): {
            mediaContent["src"] = post.url;
            return mediaContent;
        }
        default: {
            console.log('Media Not Recognized')
        }
    }
}




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


export const removeGifFromComment = (commentBody) => {
    // Regular expression to check for Markdown-style image syntax for gifs
    const regex = /!\[gif\]\([^)]+\)/g;
  
    // Check if the commentBody contains any gifs
    if (regex.test(commentBody)) {
      // Replace all occurrences of the regex with an empty string
      return commentBody.replace(regex, '').trim();
    }
  
    // If no gifs are found, return the original commentBody
    return commentBody;
  }


export const cleanIconUrl = (iconUrl) => {
    if (iconUrl === "") {
        return iconUrl;
    }
    const imageUrlWithoutParams = iconUrl.replace(/\?.*/, "");
    return imageUrlWithoutParams;
}
