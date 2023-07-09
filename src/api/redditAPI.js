import { pets, fitness, music, party, petsComments, fitnessComments, musicComments, partyComments } from '../data/fakeData';
const baseUrl = "https://www.reddit.com";

export const getSubredditPosts = async (subreddit) => {
    const response = await fetch(`${baseUrl}${subreddit}.json`)
    const json = await response.json();
    const newArray = json.data.children.map(post => post.data);
    return newArray;
}

export const getSubreddits = async () => {
    const response = await fetch(`${baseUrl}/subreddits.json`);
    const json = await response.json();
    const newArray = json.data.children.map(subreddit => subreddit.data);
    return newArray;
}


/*export const getSubredditPosts = async (subreddit) => {
    return new Promise((resolve, reject) => {
        switch (subreddit) {
            case 'pets':
                resolve(pets);
                break;
            case 'fitness':
                resolve(fitness);
                break;
            case 'music':
                resolve(music);
                break;
            case 'party':
                resolve(party);
                break;
            default:
                resolve(party);
                break;
        }
    });
};*/

/*export const getPostComments = async (permalink) => {
    return new Promise((resolve, reject) => {

        switch (permalink) {
            case 'petsComments':
                resolve(petsComments);
                break;
            case 'fitnessComments':
                resolve(fitnessComments);
                break;
            case 'musicComments':
                resolve(musicComments);
                break;
            case 'partyComments':
                resolve(partyComments);
                break;
            default:
                resolve('none of these');
                break;
        }
    })

}*/

export const getPostComments = async (permalink) => {
    const response = await fetch(`${baseUrl}${permalink}.json`);
    const json = await response.json();
    const newArray = json[1].data.children.map(comment => comment.data);
    return newArray;
}
