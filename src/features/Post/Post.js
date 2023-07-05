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
import MarkdownView from "react-showdown";



export const Post = ({ post, onToggleComments, mediaContent }) => {

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

                {mediaContent.type === 'img' &&
                    <img
                        src={mediaContent.src}
                        height={mediaContent.height}
                        width={mediaContent.width}
                        className="post-image"
                    />
                }

                {mediaContent.type === 'video' &&
                    <video controls>
                        <source
                            src={mediaContent.src}
                            height={mediaContent.height}
                            width={mediaContent.width}
                        />
                    </video>
                }

                {mediaContent.type === "text" &&
                    <MarkdownView
                        markdown={mediaContent.selftext}
                        options={{ emoji: true }}
                        className="selftextDisplay"
                    />
                }

                {post.post_hint === "link" &&
                    <a href={post.url} target="_blank" rel="noopener noreferrer">
                        {post.url}
                    </a>
                }
            </div>
            <div className="comments-container">
                <button type="button" onClick={() => onToggleComments(post.permalink)}>
                    Comments || <BiCommentDetail className='comment-icon' /> {post.num_comments}
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