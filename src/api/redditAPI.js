import { pets, fitness, music, party, petsComments, fitnessComments, musicComments, partyComments } from '../data/fakeData';


export const getSubredditPosts = async (subreddit) => {
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
};

export const getPostComments = async (permalink) => {
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

}
