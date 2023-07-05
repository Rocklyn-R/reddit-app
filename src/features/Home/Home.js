import React, { useEffect } from 'react';
import { Post } from '../Post/Post';
import { selectPosts, selectFilteredPosts } from '../../store/redditSlice';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPosts, fetchComments } from '../../store/redditSlice';
import './Home.css';
import { getMediaContent } from '../../Utilities/Helpers';

export const Home = () => {
    const reddit = useSelector((state) => state.reddit);
    const { selectedSubreddit } = reddit;
    const posts = useSelector(selectFilteredPosts);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchPosts(selectedSubreddit));
    }, [selectedSubreddit]);

    
    const onToggleComments = (index) => {
        const getComments = (permalink) => {
            dispatch(fetchComments(index, permalink))
        }
        return getComments;
    }

    return (
        <div className='all-posts-container'>
            {posts.map((post, index) => (
                <Post 
                    key={post.id}
                    post={post}
                    onToggleComments={onToggleComments(index)}
                    mediaContent={getMediaContent(post)}
                />
        )   )}
        </div>
        
    )
}