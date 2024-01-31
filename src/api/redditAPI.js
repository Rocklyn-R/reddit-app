const baseUrl = "https://www.reddit.com";

const cache = {};
const CACHE_EXPIRY_MS = 4 * 60 * 60 * 1000; //4 hours in miliseconds

export const getSubredditPosts = async (subreddit) => {
    try {
        if (cache[subreddit] && cache[subreddit].timestamp + CACHE_EXPIRY_MS > Date.now()) {
            return cache[subreddit].data;
        }
        const response = await fetch(`${baseUrl}${subreddit}.json`);

        // Check for 429 Too Many Requests
        if (response.status === 429) {
            throw new Error('Rate limit exceeded');
        }

        if (response.status === 404) {
            throw new Error('Subreddit not found');
        }

        const json = await response.json();
        if (!json.data.children || json.data.children.length === 0) {
            throw new Error("Subreddit does not exist");
        }

        const newArray = json.data.children.map(post => post.data);
        cache[subreddit] = { data: newArray, timestamp: Date.now() };
        return newArray;
    } catch (error) {
        if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
            // Assuming CORS error (since specific status code cannot be accessed)
            throw new Error('Network error (possibly CORS)');
        } else {
            // Re-throw the original error for other cases
            throw error;
        }
    }
}



export const getSubreddits = async () => {
    const cacheKey = "subreddits";
    if (cache[cacheKey] && cache[cacheKey].timestamp + CACHE_EXPIRY_MS > Date.now()) {
        return cache[cacheKey].data
    }
    const response = await fetch(`${baseUrl}/subreddits.json`);
    const json = await response.json();
    const newArray = json.data.children.map(subreddit => subreddit.data)
    cache[cacheKey] = { data: newArray, timestamp: Date.now() };
    return newArray;
}


export const getPostComments = async (permalink) => {
   if (cache[permalink] && cache[permalink].timestamp + CACHE_EXPIRY_MS > Date.now()) {
        return cache[permalink].data;
    }

    const response = await fetch(`${baseUrl}${permalink}.json`);
    const json = await response.json();
    const newArray = json[1].data.children
        .filter(comment => comment.data.body)
        .map(comment => comment.data);
    cache[permalink] = { data: newArray, timestamp: Date.now() };
    return newArray;
}


export const getUserIcons = async (user) => {
    // Check if the response is already cached
    if (cache[user] && cache[user].timestamp + CACHE_EXPIRY_MS > Date.now()) {
        return cache[user].data;
    }

    const emptyIconObject = {
        img_icon: "",
        snoovatar: ""
    } 

    if (user === "[deleted]") {
        return emptyIconObject;
    }
    try {
        const response = await fetch(`${baseUrl}/user/${user}/about.json`);
        const json = await response.json();
        const newArray = [json.data];
        const updatedArray = newArray.map((item) => ({
            img_icon: item.icon_img ? item.icon_img : "",
            snoovatar: item.snoovatar_img || "",
        }));

        // Cache the response for this user
        cache[user] = { data: updatedArray[0], timestamp: Date.now() };

        return updatedArray[0];
    } catch (error) {
        console.error(`Error fetching user icons for user: ${user}`, error);
        return emptyIconObject;
    }
};

export const getSubredditInfo = async (subredditName) => {
    try {
        console.log(subredditName);
        const response = await fetch(`${baseUrl}/r/${subredditName}/about.json`);
    const json = await response.json();
    const newArray = [json.data];
    return newArray[0];
    }
    catch (error) {
        console.log(error)
    }
}
