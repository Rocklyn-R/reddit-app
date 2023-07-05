import React from 'react';
import './Post.css';
import Card from '../../components/Card';
import { selectPosts } from '../../store/redditSlice';
import { useSelector, useDispatch } from 'react-redux';
import { selectSelectedSubreddit } from '../../store/redditSlice';
import { BiCommentDetail } from 'react-icons/bi';
import { Comment } from '../Comment/Comment';
import { toggleShowingComments } from '../../store/redditSlice';
import { getTimeAgo } from '../../Utilities/Helpers';


export const Post = ({ post, onToggleComments }) => {

    const selectedSub = selectSelectedSubreddit;
    const dispatch = useDispatch()


    //get time when the post was made
    


    const handleToggleComments = () => {
        onToggleComments(post.permalink);
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
                    <p>{getTimeAgo(post.created_utc)}</p>
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
                        <source src={post.secure_media.reddit_video.fallback_url} type="video/mp4" />
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
                {post.post_hint === "self" &&
                    <p>stuff goes here</p>
                }
            </div>
            <div className="comments-container">
                <button type="button" onClick={() => onToggleComments(post.permalink)}>
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