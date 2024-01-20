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
import { cleanHtmlText } from '../../Utilities/Helpers';
import { selectSelectedSubreddit } from '../../store/redditSlice';
import { selectSubreddits } from '../../store/subredditsSlice';
import { useSelector } from 'react-redux';
import userIcon from '../../Assets/Images/user-icon.png';
import { cleanIconUrl } from '../../Utilities/Helpers';
import { VoteScore } from "../VoteScore/VoteScore";





export const Post = ({ post, onToggleComments, mediaContent, postIndex }) => {
    const subreddits = useSelector(selectSubreddits);
    const selectedSub = useSelector(selectSelectedSubreddit);


    const getSubredditImage = (url) => {
        if (subreddits.length === 0) {
            return "";
        }
        const subreddit = subreddits.find(sub => sub.url === url);
        if (subreddit && subreddit.icon_img) {
            return subreddit.icon_img;
        } else {
            return 'https://b.thumbs.redditmedia.com/rmlXC779KUA2MTO4r_GJd2enqa8GKx3BOasymol6gLk.png';
        }
    };

    const getIcon = () => {
        const imgIcon = post.userIcons[0].img_icon;
        const snoovatar = post.userIcons[0].snoovatar;
        if (snoovatar) {
            return snoovatar
        } else if (imgIcon) {
            return cleanIconUrl(imgIcon)
        } else return userIcon;
    }



    return (
        <Card className="post-wrapper">
            <div className="details-container">
                <div className="sub-details">
                    <img src={getSubredditImage(selectedSub)} alt="Post Icon" />
                    <p data-testid="subreddit-name">{post.subreddit_name_prefixed}</p>
                </div>
                <div className="posted-by">
                    <p>posted by</p>
                    <div className="author-details">
                        <img src={getIcon()} alt="user icon" />
                        <p>{post.author}</p>
                    </div>

                </div>
                <div className="time-details">
                    <p>{getTimeAgo(post.created_utc)}</p>
                </div>
            </div>
            <div className="post-title">
                <h1 data-testid="title">{cleanHtmlText(post.title)}</h1>

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
                            aria-label="External Link"
                            target="_blank"
                            rel="noreferrer"
                        >
                            {mediaContent.linkDisplay}
                            <FaExternalLinkAlt className='link-icon' />
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
                <div className="post-footer">
                    <button
                        type="button"
                        onClick={() => onToggleComments(post.permalink)}
                        data-testid={postIndex === 0 ? "comment-button-first" : "comment-button"}
                        className="comment-button"
                    >
                       <BiCommentDetail className='comment-icon' /> View {post.num_comments} comments
                    </button>
                    <VoteScore
                        postIndex={postIndex}
                        score={post.score}
                        type="post"
                    />
                </div>


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
                    post.comments.map((comment, index) => {
                        const isLastComment = index === post.comments.length -1;
                        return <Comment comment={comment} key={comment.id} postIndex={postIndex} commentIndex={index} type={"comment"} isLastComment={isLastComment}  />
                    })
                }
            </div>
        </Card>

    )
}