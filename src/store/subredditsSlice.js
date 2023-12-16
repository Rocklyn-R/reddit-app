import { createSlice } from '@reduxjs/toolkit';
import { getSubreddits } from '../api/redditAPI';

export const subredditsSlice = createSlice({
    name: 'subreddits',
    initialState: {
        subreddits: [],
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

//Thunk that fetches Subreddits
export const fetchSubreddits = () => async (dispatch) => {
    try {
        dispatch(startGetSubreddits());
        const subreddits = await getSubreddits();
        dispatch(getSubredditsSuccess(subreddits));
    }
    catch (error) {
        dispatch(getSubredditsFailed())
    }
}

export const selectSubreddits = state => state.subreddits.subreddits;
export const isLoading = state => state.subreddits.isLoading;

export const { startGetSubreddits, getSubredditsSuccess, getSubredditsFailed } = subredditsSlice.actions;

export default subredditsSlice.reducer;