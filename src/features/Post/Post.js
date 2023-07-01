import React from 'react';
import './Post.css';
import Card from '../../components/Card';
import { selectPosts } from '../../store/redditSlice';
import { useSelector } from 'react-redux';
import { selectSelectedSubreddit } from '../../store/redditSlice';


export const Post = ({post}) => {

    const selectedSub = selectSelectedSubreddit;


    //get time when the post was made
    const createdAt = new Date(post.created_utc * 1000);
    const currentTime = new Date();
    const timeDifferenceInMiliseconds = currentTime - createdAt
    const timeInHours = Math.floor(timeDifferenceInMiliseconds / (1000 * 60 * 60))
    const daysAgo = Math.floor(timeInHours / 24);
    const timeAgo = timeInHours < 25 ? `${timeInHours} hours ago` : `${daysAgo} day ago`;

    return (
        <Card className="post-container">
            <div className="details-container">
                <div className="sub-details">
                    <img src={post.icon_url}/>
                    <p>{post.subreddit_name_prefixed}</p>
                </div>
                <div className="author-details">
                    <p>posted by {post.author}</p>
                </div>
                <div className="time-details">
                    <p>{timeAgo}</p>
                </div>
            </div>
            <div className="post-title">
                <h1>{post.title}</h1>
            </div>
            <div className="post-image-container">
                <img src={post.url} className="post-image" />
            </div>
        </Card>
        
    )
}