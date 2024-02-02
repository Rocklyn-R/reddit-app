import { createSlice } from '@reduxjs/toolkit';
import { getSubredditInfo, getSubreddits } from "../api/redditAPI";

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
            state.customSubredditsIsLoading = false;
            state.customSubredditsError = false;
        },
        startAddCustomSubreddit: (state) => {
            state.customSubredditsIsLoading = true;
            state.customSubredditsError = false;
        },
        addCustomSubredditFailed: (state) => {
            state.customSubredditsError = true;
            state.customSubredditsIsLoading = false;
        },
        removeCustomSubreddit: (state, action) => {
            state.customSubreddits = state.customSubreddits.filter(
                subreddit => subreddit.id !== action.payload)
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
export const selectCustomSubreddits = state => state.subreddits.customSubreddits;
export const isLoadingSubreddits = state => state.subreddits.isLoading;
export const subredditsError = state => state.subreddits.error;
export const selectCustomSubredditInput = state => state.subreddits.customSubredditInput;
export const isLoadingCustomSubreddit = state => state.subreddits.customSubredditsIsLoading;
export const customSubredditError = state => state.subreddits.customSubredditsError;

export const {
    startGetSubreddits,
    getSubredditsSuccess,
    getSubredditsFailed,
    setCustomSubredditInput,
    startAddCustomSubreddit,
    addCustomSubreddit,
    addCustomSubredditFailed,
    addCustomSubredditSuccess,
    removeCustomSubreddit
} = subredditsSlice.actions;

export const getCustomSubreddit = (subredditName) => async (dispatch, getState) => {
    if (!subredditName) {
        return;
    }

    const state = getState();
    const subredditExists = state.subreddits.customSubreddits.some(subreddit =>
        subreddit.display_name.toLowerCase() === subredditName.toLowerCase()
    )
    if (subredditExists) {
        return;
    }
    try {
        dispatch(startAddCustomSubreddit());
        const customSubreddit = await getSubredditInfo(subredditName);
        if (customSubreddit) {
            dispatch(addCustomSubredditSuccess(customSubreddit));
        } else {
            dispatch(addCustomSubredditFailed())
        }
    }
    catch (error) {
        console.log(error);
        dispatch(addCustomSubredditFailed())
    }
}

export default subredditsSlice.reducer;