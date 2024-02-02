import React, { useEffect } from 'react';
import { Post } from '../Post/Post';
import { isError, selectFilteredPosts, selectPosts } from '../../store/redditSlice';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPosts, fetchComments } from '../../store/redditSlice';
import './Home.css';
import { getMediaContent } from '../../Utilities/Helpers';
import { PostLoading } from '../Post/postLoading/postLoading';
import Card from '../../components/Card';
import { subredditsError, customSubredditError } from '../../store/subredditsSlice';
import { selectSearchTerm, toggleShowingComments, selectSelectedSubreddit } from '../../store/redditSlice';



export const Home = () => {
    const reddit = useSelector((state) => state.reddit);
    const { selectedSubreddit, isLoading } = reddit;
    const posts = useSelector(selectPosts)
    const filteredPosts = useSelector(selectFilteredPosts);
    const dispatch = useDispatch();
    const searchTerm = useSelector(selectSearchTerm);
    const selectedSub = useSelector(selectSelectedSubreddit);
    const subError = useSelector(subredditsError);
    const customSubError = useSelector(customSubredditError)
    const postsError = useSelector(isError)

    useEffect(() => {
        if (selectedSubreddit === "none found" || selectedSubreddit === "") {
            return;
        }
        dispatch(fetchPosts(selectedSubreddit));
    }, [selectedSubreddit, dispatch]);


    const onToggleComments = (postId) => {
        const getComments = (permalink) => {
            const index = posts.findIndex(post => post.id === postId);
            if (index !== -1) {
                if (posts[index].comments && posts[index].comments.length > 0) {
                    dispatch(toggleShowingComments(index));
                } else dispatch(fetchComments(index, permalink))
            }
        }
        return getComments;
    }


    return (

        <div className='all-posts-container'>
            {isLoading ?
                <React.Fragment>
                    <PostLoading />
                    <PostLoading />
                    <PostLoading />
                    <PostLoading />
                    <PostLoading />
                </React.Fragment>

                : (searchTerm && filteredPosts.length === 0)
                    ?
                    (
                        <Card className="no-post-found">
                            <p>No matching posts found. Try a different keyword.</p>
                        </Card>
                    )
                    : (selectedSub === "") ? (
                        <Card className="no-post-found"><p>Select or search for a subreddit.</p></Card>
                    )
                        : ((customSubError && postsError) || (selectedSub === "none found" && !subError)) ? (
                            <Card className="no-post-found"><p>Subreddit not found. Try a different keyword.</p></Card>
                        )
                            : (

                                filteredPosts.map((post, index) => (
                                    <Post
                                        key={post.id}
                                        post={post}
                                        onToggleComments={onToggleComments(post.id)}
                                        mediaContent={getMediaContent(post)}
                                        postIndex={index}
                                    />
                                ))
                            )
            }
        </div>

    )
}