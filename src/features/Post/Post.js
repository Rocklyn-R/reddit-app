import React from 'react';
import './Post.css';
import Card from '../../components/Card';
import { selectPosts } from '../../store/redditSlice';
import { useSelector, useDispatch } from 'react-redux';
import { selectSelectedSubreddit } from '../../store/redditSlice';
import { BiCommentDetail } from 'react-icons/bi';
import { Comment } from '../Comment/Comment';
import { toggleShowingComments } from '../../store/redditSlice';


export const Post = ({ post, index }) => {

    const selectedSub = selectSelectedSubreddit;
    const dispatch = useDispatch()


    //get time when the post was made
    const createdAt = new Date(post.created_utc * 1000);
    const currentTime = new Date();
    const timeDifferenceInMiliseconds = currentTime - createdAt
    const timeInHours = Math.floor(timeDifferenceInMiliseconds / (1000 * 60 * 60))
    const daysAgo = Math.floor(timeInHours / 24);
    const timeAgo = timeInHours < 25 ? `${timeInHours} hours ago` : `${daysAgo > 1 ? `${daysAgo} days ago` : `${daysAgo} day ago`}`;


    const handleToggleComments = () => {
        dispatch(toggleShowingComments(index));
        console.log(post.comments.author)
    };
    
    return (
        <Card className="post-container">
            <div className="details-container">
                <div className="sub-details">
                    <img src={post.icon_url} />
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
            <div className="post-content-container">

                {post.post_hint === "image" &&

                    <img src={post.url} className="post-image" />
                }
                {post.post_hint === "hoisted:video" &&
                    <video controls className='post-video'>
                        <source src={post.media.reddit_video.fallback_url} />
                        Your browser does not support the video tag.
                    </video>
                }
                {post.post_hint === "rich:video" &&
                    <video controls className="post-video">
                        <source src={post.secure_media_embed.media_domain_url} />
                        Your browser does not support the video tag.
                    </video>
                }
                {post.post_hint === "link" &&
                   <a href={post.url} target="_blank" rel="noopener noreferrer">
                        {post.url}
                   </a>
                }
            </div>
            <div className="comments-container" onClick={handleToggleComments}>
                <button type="button">
                    Comments || <BiCommentDetail className='comment-icon'/> {post.num_comments}
                </button>
            </div>
            {post.showingComments && 
                post.comments.map(comment => {
                    return <Comment comment={comment} />
                })
            }
                
        </Card>

    )
}