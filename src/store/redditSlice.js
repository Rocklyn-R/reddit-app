import { createSlice, createSelector } from "@reduxjs/toolkit";
import { getSubredditPosts, getPostComments, getUserIcons } from "../api/redditAPI";


   

export const redditSlice = createSlice({
    name: 'reddit',
    initialState: {
        posts: [],
        error: false,
        isLoading: false,
        searchTerm: '',
        selectedSubreddit: '/r/pics/',
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
            state.searchTerm = "";
        },
        startGetComments: (state, action) => {
            state.posts[action.payload].showingComments = !state.posts[action.payload].showingComments;
            if (!state.posts[action.payload].showingComments) {
                return;
            };
            state.posts[action.payload].loadingComments = true;
            state.posts[action.payload].errorComments = false;
        },
        getCommentsSuccess: (state, action) => {
            state.posts[action.payload.index].comments = action.payload.comments;
            state.posts[action.payload.index].loadingComments = false;
            state.posts[action.payload.index].errorComments = false;
        },
        getCommentsFailed: (state, action) => {
            state.posts[action.payload].loadingComments = false;
            state.posts[action.payload].errorComments = true;
        },
        getPostUserIconSuccess: (state, action) => {
            state.posts[action.payload.postIndex].userIcons = action.payload.userIcons;
        },
        setPostScore: (state, action) => {
            state.posts[action.payload.index].score = action.payload.score
        }
    }
});

export const selectPosts = state => state.reddit.posts;
export const isLoading = state => state.reddit.isLoading;
export const selectSearchTerm = state => state.reddit.searchTerm;
export const selectSelectedSubreddit = (state) => state.reddit.selectedSubreddit;

export const {
    setPosts,
    startGetPosts,
    getPostsSuccess,
    getPostsFailed,
    setSearchTerm,
    setSelectedSubreddit,
    startGetComments,
    getCommentsSuccess,
    getCommentsFailed,
    getPostUserIconSuccess,
    setPostScore
} = redditSlice.actions;

//Thunk that will get posts
export const fetchPosts = (subreddit) => async (dispatch) => {
    try {
        dispatch(startGetPosts());
        const posts = await getSubredditPosts(subreddit);
        const postsWithMetadata = posts.map((post) => ({
            ...post,
            showingComments: false,
            comments: [],
            loadingComments: false,
            errorComments: false,
            userIcons: []
        }))
        const userIconsPromises = posts.map(post => getUserIcons(post.author));
        const userIcons = await Promise.all(userIconsPromises);
        postsWithMetadata.forEach((post, index) => {
            post.userIcons.push(userIcons[index])
        })
        dispatch(getPostsSuccess(postsWithMetadata));
    } catch (error) {
        dispatch(getPostsFailed());
    }
};



//Thunk that will fetch comments
export const fetchComments = (index, permalink) => async (dispatch) => {
    try {
        dispatch(startGetComments(index));
        const comments = await getPostComments(permalink);
        //console.log(comments);
        const commentsWithMetaData = comments.map((comment) => ({
            ...comment,
            userIcons: []
        }))
        const userIconsPromises = comments.map(comment => getUserIcons(comment.author));
        const userIcons = await Promise.all(userIconsPromises);
        commentsWithMetaData.forEach((comment, index) => {
            comment.userIcons.push(userIcons[index])
        });
        dispatch(getCommentsSuccess({index, comments: commentsWithMetaData}));
    }
    catch (error) {
        dispatch(getCommentsFailed(index));
        console.log(error);
    }
}

/*export const fetchUserIcons = (postIndex, commentIndex, username) => async (dispatch) => {
    try {
        const userInfo = await getUserInfo(username);
        const userIcons = userInfo.map((item) => ({
            icon_img: item.icon_img,
            snoovatar_img: item.snoovatar_img
        }))
        dispatch(getUserIconSuccess({postIndex, commentIndex, userIcons}));
    }
    catch (error) {
        console.log(error)
    }
}*/


export const selectFilteredPosts = createSelector(
    [selectPosts, selectSearchTerm], 
    (posts, searchTerm) => {
        if (searchTerm !== '') {
            return posts.filter((post) => 
            post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.selftext.toLowerCase().includes(searchTerm.toLowerCase())
            );
            
        };
    return posts;
})



export default redditSlice.reducer;
