import { createSlice } from '@reduxjs/toolkit';
import { getSubredditInfo, getSubreddits } from "../api/redditAPI";
import { getSubredditPosts } from '../api/redditAPI';
import { isCustomPostsError } from './redditSlice';

export const subredditsSlice = createSlice({
    name: 'subreddits',
    initialState: {
        subreddits: [],
        customSubreddits: [],
        error: false,
        isLoading: false,
        customSubredditInput: "",
        customSubredditsIsLoading: false,
        customSubredditsError: false
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
        },
        setCustomSubredditInput: (state, action) => {
            state.customSubredditInput = action.payload;
        },
        addCustomSubredditSuccess: (state, action) => {
            state.customSubreddits.unshift(action.payload);
        },
        startAddCustomSubreddit: (state) => {
            state.customSubredditsIsLoading = true;
        },
        addCustomSubredditFailed: (state) => {
            state.customSubredditsError = true;
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
export const isLoadingSubreddits = state => state.subreddits.isLoading;
export const selectCustomSubredditInput = state => state.subreddits.customSubredditInput;

export const { 
    startGetSubreddits, 
    getSubredditsSuccess, 
    getSubredditsFailed,
    setCustomSubredditInput,
    startAddCustomSubreddit,
    addCustomSubreddit,
    addCustomSubredditFailed,
    addCustomSubredditSuccess 
} = subredditsSlice.actions;

export const getCustomSubreddit = (subredditName) => async (dispatch) => {
    if (!isCustomPostsError) {
        return;
    }
    try {
        dispatch(startAddCustomSubreddit());
        const customSubreddit = await getSubredditInfo(subredditName);
        dispatch(addCustomSubredditSuccess(customSubreddit));
    }
    catch (error) {
        dispatch(addCustomSubredditFailed())
    }
}

export default subredditsSlice.reducer;