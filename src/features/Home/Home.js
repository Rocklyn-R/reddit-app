import React, { useEffect } from 'react';
import { Post } from '../Post/Post';
import { selectPosts, selectFilteredPosts } from '../../store/redditSlice';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPosts, fetchComments } from '../../store/redditSlice';
import './Home.css';

export const Home = () => {
    const reddit = useSelector((state) => state.reddit);
    const { selectedSubreddit } = reddit;
    const posts = useSelector(selectFilteredPosts);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchPosts(selectedSubreddit));
    }, [selectedSubreddit]);

    


    return (
        <div className='all-posts-container'>
            {posts.map((post, index) => (
                <Post 
                    key={post.id}
                    post={post}
                    index={index}
                />
        )   )}
        </div>
        
    )
}