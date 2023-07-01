import { pets, fitness, music, party } from '../data/fakeData';


export const getSubredditPosts = (subreddit) => {
    switch (subreddit) {
        case 'pets':
            return pets;
        case 'fitness':
            return fitness;
        case 'music':
            return music;
        case 'party':
            return party;
        default:
            return party;
    }
};