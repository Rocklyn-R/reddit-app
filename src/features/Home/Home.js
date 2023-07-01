import React, { useEffect } from 'react';
import { Post } from '../Post/Post';
import { selectPosts } from '../../store/redditSlice';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPosts } from '../../store/redditSlice';

export const Home = () => {
    const reddit = useSelector((state) => state.reddit);
    const { selectedSubreddit } = reddit;
    const posts = useSelector(selectPosts);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchPosts(selectedSubreddit));
        console.log(posts);
    }, [selectedSubreddit, posts])

    return (
        <div className="home-container">
            {posts.map((post) => (
                <Post 
                    key={post.id}
                    post={post}
                />
        )   )}
        </div>
        
    )
}