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
        toggleShowingComments: (state, action) => {
            state.posts[action.payload].showingComments = !state.posts[action.payload].showingComments;
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
        },
        setCommentScore: (state, action) => {
            state.posts[action.payload.postIndex].comments[action.payload.commentIndex].score = action.payload.score
        },
        setReplyScore: (state, action) => {
            const { postIndex, replyId, score } = action.payload;
            const post = state.posts[postIndex];
            console.log(post);
            //recursive function to find matching comment id to update its score in setReplyScore
            const updateCommentScore = (comments, replyId, newScore) => {
                // Find the comment or reply in the array
                const commentToUpdate = comments.find(comment => comment.id === replyId);

                if (commentToUpdate) {
                    // If the comment is found, update its score
                    commentToUpdate.score = newScore;
                    return true;
                } else {
                    // If not found, recursively search in replies
                    for (let comment of comments) {
                        if (comment.replies && comment.replies.length > 0) {
                            const updated = updateCommentScore(comment.replies, replyId, newScore);
                            if (updated) return true; // Comment was found and updated in nested replies
                        }
                    }
                }

                return false; // Comment not found
            };
            console.log(replyId);
            console.log(updateCommentScore(post.comments, replyId, score));
            
        }
    }
});

export const selectPosts = state => state.reddit.posts;
export const isLoading = state => state.reddit.isLoading;
export const selectSearchTerm = state => state.reddit.searchTerm;
export const selectSelectedSubreddit = (state) => state.reddit.selectedSubreddit;
export const isError = (state) => state.reddit.error;

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
    setPostScore,
    setCommentScore,
    setReplies,
    toggleShowingComments,
    setReplyScore
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

//recursive function to modify all nested replies objects into arrays 
const flattenReplies = (replies) => {
    if (!replies || !replies.data || !replies.data.children) {
        return [];
    }
    return replies.data.children.map(reply => {
        // Recursively flatten nested replies
        const flattenedReply = { ...reply.data }
        if (reply.data && reply.data.replies) {
            flattenedReply.replies = flattenReplies(reply.data.replies);
        }
        return reply.data;
    });
}


//Thunk that will fetch comments and their user icons
export const fetchComments = (index, permalink) => async (dispatch) => {
    try {
        dispatch(startGetComments(index));
        const comments = await getPostComments(permalink);
        //console.log(comments);
        const commentsWithMetaData = comments.map((comment) => ({
            ...comment,
            userIcons: [],
            replies: comment.replies ? flattenReplies(comment.replies) : []
        }))
        const userIconsPromises = comments.map(comment => getUserIcons(comment.author));
        const userIcons = await Promise.all(userIconsPromises);
        commentsWithMetaData.forEach((comment, index) => {
            comment.userIcons.push(userIcons[index])
        });
        dispatch(getCommentsSuccess({ index, comments: commentsWithMetaData }));
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
