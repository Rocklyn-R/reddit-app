import { createSlice } from '@reduxjs/toolkit';
import { getSubreddits } from '../api/redditAPI';

export const subredditsSlice = createSlice({
    name: 'subreddits',
    initialState: {
        subreddits: [
            {display_name: 'pets', id: 123, icon_img: "https://b.thumbs.redditmedia.com/rmlXC779KUA2MTO4r_GJd2enqa8GKx3BOasymol6gLk.png", url: '/r/pets/'},
            {display_name: 'fitness', id: 124, icon_img: "https://b.thumbs.redditmedia.com/rmlXC779KUA2MTO4r_GJd2enqa8GKx3BOasymol6gLk.png", url: '/r/fitness/'},
            {display_name: 'music', id: 125, icon_img: "https://b.thumbs.redditmedia.com/rmlXC779KUA2MTO4r_GJd2enqa8GKx3BOasymol6gLk.png", url: '/r/music/'},
            {display_name: 'party', id: 126, icon_img: "https://b.thumbs.redditmedia.com/rmlXC779KUA2MTO4r_GJd2enqa8GKx3BOasymol6gLk.png", url: '/r/party/'}
        ],
        error: false,
        isLoading: false
    },
    reducers: {
        startGetSubreddits: (state) => {
            state.isLoading = true;
            state.error = false;
        },
        getSubredditsSuccess: (state, action) => {
            state.isLoading = false;
            state.error = false;
            state.subreddits = action.payload;
        },
        getSubredditsFailed: (state) => {
            state.isLoading = false;
            state.error = true;
        }
    }
})

export const fetchSubreddits = () => async (dispatch) => {
    try {
        dispatch(startGetSubreddits());
        const subreddits = await getSubreddits();
        dispatch(getSubredditsSuccess(subreddits))
    }
    catch (error) {
        dispatch(getSubredditsFailed())
    }
}

export const selectSubreddits = state => state.subreddits.subreddits;

export const { startGetSubreddits, getSubredditsSuccess, getSubredditsFailed } = subredditsSlice.actions;

export default subredditsSlice.reducer;