import React from 'react';
import './Post.css';
import Card from '../../components/Card';
import { BiCommentDetail } from 'react-icons/bi';
import { Comment } from '../Comment/Comment';
import { getTimeAgo } from '../../Utilities/Helpers';
import MarkdownView from "react-showdown";
import { Gallery } from './galleryDisplay/galleryDisplay';
import ReactPlayer from 'react-player';
import { CommentLoading } from '../Comment/commentLoading/commentLoading';





export const Post = ({ post, onToggleComments, mediaContent }) => {



    return (
        <Card className="post-wrapper">
            <div className="details-container">
                <div className="sub-details">
                    <img src={post.icon_url} alt="Post Icon" />
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
                        className="post-image"
                        alt="Post"
                    />
                }

                {mediaContent.type === 'video' &&
                    <video 
                        controls 
                        className='video'
                        aria-label="Video Player"
                    >
                        <source
                            src={mediaContent.src}
                        />
                    </video>
                }
                {mediaContent.type === "link" &&
                    <a href={mediaContent.href} aria-label="External Link">{mediaContent.href}</a>
                }

                {mediaContent.type === "text" &&
                    <MarkdownView
                        markdown={mediaContent.selftext}
                        options={{ emoji: true }}
                        className="selftextDisplay"
                    />
                }

                {mediaContent.type === "videoEmbed" &&
                    <div aria-label="Embedded Video" data-testid="embedded-video">
                        <ReactPlayer 
                            url={mediaContent.src} 
                            controls={true}
                            className={"react-player"}
                        />
                    </div>
                }
                {mediaContent.type === 'gallery' &&
                    <Gallery 
                        mediaContent={mediaContent} 
                        data-testid="gallery-component" 
                    />
                }
            </div>
            <div className="comments-container">
                <button type="button" onClick={() => onToggleComments(post.permalink)}>
                    Comments: <BiCommentDetail className='comment-icon' /> {post.num_comments}
                </button>
           
            {post.loadingComments && post.num_comments > 0 &&
                <React.Fragment>
                    <CommentLoading/>
                    <CommentLoading/>
                    <CommentLoading/>
                    <CommentLoading/>
                    <CommentLoading/>
                </React.Fragment>    
            }

            {post.showingComments &&
                post.comments.map((comment, index) => {
                    return <Comment comment={comment} key={comment.id} />
                })
            } 
            </div>
        </Card>

    )
}