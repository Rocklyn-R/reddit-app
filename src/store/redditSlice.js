import { createSlice, createSelector } from "@reduxjs/toolkit";
import { getSubredditPosts } from "../api/redditAPI";


   

export const redditSlice = createSlice({
    name: 'reddit',
    initialState: {
        posts: [],
        error: false,
        isLoading: false,
        searchTerm: '',
        selectedSubreddit: 'pics',
    },
    reducers: {
        setPosts: (state, action) => {
            state.posts = action.payload;
        },
        startGetPosts: (state) => {
            state.error = false;
            state.isLoading = true;
        },
        getPostsSuccess: (state, action) => {
            state.error = false;
            state.isLoading = false;
            state.posts = action.payload;
        },
        getPostsFailed: (state) => {
            state.error = true;
            state.isLoading = false;
        },
        setSearchTerm: (state, action) => {
            state.searchTerm = action.payload;
        },
        setSelectedSubreddit: (state, action) => {
            state.selectedSubreddit = action.payload;
        }
    }
});

export const selectPosts = state => state.reddit.posts;
export const selectSearchTerm = state => state.reddit.searchTerm;
export const selectSelectedSubreddit = (state) => state.reddit.selectedSubreddit;

export const {
    setPosts,
    startGetPosts,
    getPostsSuccess,
    getPostsFailed,
    setSearchTerm,
    setSelectedSubreddit
} = redditSlice.actions;

//Thunk that will get posts
export const fetchPosts = (subreddit) => async (dispatch) => {
    try {
        dispatch(startGetPosts());
        const posts = getSubredditPosts(subreddit);
        const postsWithMetadata = posts.map((post) => ({
            ...post,
            showingComments: false,
            comments: [],
            loadingComments: false,
            errorComments: false
        }))
        dispatch(getPostsSuccess(postsWithMetadata));
    }
    catch (error) {
        dispatch(getPostsFailed());
    }
};

export const selectFilteredPosts = createSelector(
    [selectPosts, selectSearchTerm], 
    (posts, searchTerm) => {
        if (searchTerm !== '') {
            return posts.filter((post) => 
            post.title.toLowerCase().includes(searchTerm.toLowerCase()));
        };
    return posts;
})

export default redditSlice.reducer;
