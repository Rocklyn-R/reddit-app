const baseUrl = "https://www.reddit.com";

const cache = {};
const CACHE_EXPIRY_MS = 4 * 60 * 60 * 1000; //4 hours in miliseconds

export const getSubredditPosts = async (subreddit) => {
    if (cache[subreddit] && cache[subreddit].timestamp + CACHE_EXPIRY_MS > Date.now()) {
        return cache[subreddit].data;
    }
    const response = await fetch(`${baseUrl}${subreddit}.json`)
    const json = await response.json();
    const newArray = json.data.children.map(post => post.data);
    cache[subreddit] = { data: newArray, timestamp: Date.now() };
    return newArray;
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
        console.log(cache[user]);
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