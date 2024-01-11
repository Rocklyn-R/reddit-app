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
import { FaExternalLinkAlt } from 'react-icons/fa';





export const Post = ({ post, onToggleComments, mediaContent, index }) => {



    return (
        <Card className="post-wrapper">
            <div className="details-container">
                <div className="sub-details">
                    <img src={post.icon_url ? post.icon_url : 'https://b.thumbs.redditmedia.com/rmlXC779KUA2MTO4r_GJd2enqa8GKx3BOasymol6gLk.png'} alt="Post Icon" />
                    <p data-testid="subreddit-name">{post.subreddit_name_prefixed}</p>
                </div>
                <div className="author-details">
                    <p>posted by {post.author}</p>
                </div>
                <div className="time-details">
                    <p>{getTimeAgo(post.created_utc)}</p>
                </div>
            </div>
            <div className="post-title">
                <h1 data-testid="title">{post.title}</h1>
            </div>
            <div className="post-content-container" data-testid="post-container">

                {mediaContent.type === 'img' &&
                    
                    <div className='img-container'>
                        
                            {mediaContent.type === "img" && post.selftext &&
                                <MarkdownView
                                    className='image-text'
                                    markdown={post.selftext}
                                />
                            }
                            <img
                                src={mediaContent.src}
                                className="post-image"
                                alt="Post"
                            />
                    

                    </div>

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

                    <div className='link-container'>
                        {mediaContent.type === "link" && post.selftext &&
                                <MarkdownView
                                    className='link-text'
                                    markdown={post.selftext}
                                />
                            }
                        <a 
                            href={mediaContent.href} 
                            aria-label="External Link">
                                {mediaContent.linkDisplay}
                                <FaExternalLinkAlt className='link-icon'/>
                        </a>

                    </div>
                    
                }

                {(mediaContent.type === "text") &&
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
                    <div className='gallery'>
                        
                            {mediaContent.type === "gallery" && post.selftext &&
                                <p>{post.selftext}</p>
                            }
                       

                        <Gallery
                            mediaContent={mediaContent}
                            data-testid="gallery-component"
                        />
                    </div>

                }
            </div>
            <div className="comments-container">
                <button
                    type="button"
                    onClick={() => onToggleComments(post.permalink)}
                    data-testid={index === 0 ? "comment-button-first" : "comment-button"}
                >
                    Comments: <BiCommentDetail className='comment-icon' /> {post.num_comments}
                </button>

                {post.loadingComments && post.num_comments > 0 &&
                    <React.Fragment>
                        <CommentLoading />
                        <CommentLoading />
                        <CommentLoading />
                        <CommentLoading />
                        <CommentLoading />
                    </React.Fragment>
                }

                {post.showingComments &&
                    post.comments.map((comment) => {
                        return <Comment comment={comment} key={comment.id} />
                    })
                }
            </div>
        </Card>

    )
}