import React, { useEffect, useState } from "react";
import './Comment.css';
import userIcon from '../../Assets/Images/user-icon.png';
import MarkdownView from "react-showdown";
import { getTimeAgo } from "../../Utilities/Helpers";
import { extractSrcFromBodyHtml } from "../../Utilities/Helpers";
import { removeGifFromComment } from "../../Utilities/Helpers";
import { cleanIconUrl } from "../../Utilities/Helpers";
import { getUserIcons } from "../../api/redditAPI";
import { VoteScore } from "../VoteScore/VoteScore";
import Card from "../../components/Card";
import { cleanHtmlText } from "../../Utilities/Helpers";






export const Comment = ({ comment, postIndex, commentIndex, type, isLastComment, replyId }) => {

    const gifSrc = extractSrcFromBodyHtml(comment);
    const commentBody = removeGifFromComment(cleanHtmlText(comment.body));
    const [showReplies, setShowReplies] = useState(false);
    const [showIcon, setShowIcon] = useState(true);
    const [icon, setIcon] = useState("");
    const isReplyComment = type === "reply"
    const hasReplies = comment.replies && comment.replies.length > 0;



    useEffect(() => {
        if (!comment.userIcons) {
            const getIcons = async () => {
                const icons = await getUserIcons(comment.author);
                if (icons.img_icon) {
                    setIcon(cleanIconUrl(icons.img_icon))
                } else setIcon("");
            }
            getIcons();
        }
    })

    const getIcon = () => {
        if (comment.userIcons) {
            const imgIcon = comment.userIcons[0].img_icon;
            const snoovatar = comment.userIcons[0].snoovatar;
            if (imgIcon) {
                return cleanIconUrl(imgIcon);
            } else if (snoovatar) {
                return snoovatar
            } else return userIcon;
        } else {
            setShowIcon(false);
        }

    }

    const getReplies = () => {
        const replyComments = comment.replies;
        const lastItem = replyComments[replyComments.length - 1];
        if ('author' in lastItem) {
            return replyComments;
        } else return replyComments.slice(0, -1);
    }

    const getNumOfReplies = () => {
        if (comment.replies) {
            const replyComments = comment.replies;
            const lastItem = replyComments[replyComments.length - 1];
            if ("author" in lastItem) {
                return replyComments.length;
            } else return (replyComments.length - 1)
        } else return 0;
    }

    return (
        <Card className={`comment-container 
            ${type === "reply" ? "reply-container" : ""} 
            ${(type === "comment" && commentIndex === 0) ? "first-comment" : ""}
            ${type === "comment" ? "all-comments" : ""}
            ${(type === "comment" && isLastComment) ? "last-comment" : ""}`
        }>
            <div className="comment-body" data-testid="comment">
                <div className="comment-user-details">
                    <div className="user-info">
                        {showIcon &&
                            <img
                                src={getIcon()}
                                alt="user-icon"
                                className="user-icon-img"
                            />
                        }
                        {!showIcon && icon &&
                            <img
                                src={icon}
                                alt="user icon"
                            />
                        }

                        <h4 data-testid="author">{comment.author}</h4>
                    </div>
                    <p>{getTimeAgo(comment.created_utc)}</p>
                </div>
                <div className="comment-text-container">
                    <div>
                        <MarkdownView markdown={commentBody} className="body-text" />
                        {gifSrc &&
                            <img src={gifSrc} alt="gif" className="gif" />
                        }
                    </div>

                    {type === "comment" && (
                        <div className="vote-container">
                            <VoteScore
                                type="comment"
                                postIndex={postIndex}
                                commentIndex={commentIndex}
                                score={comment.score}
                            />
                        </div>

                    )}

                    {isReplyComment && (
                        <div className="vote-container">
                            <VoteScore
                                type="reply"
                                postIndex={postIndex}
                                commentIndex={commentIndex}
                                score={comment.score}
                                replyId={replyId}
                            />
                        </div>
                    )}

                </div>
                <div className="show-replies">
                    <div className="comment-footer">




                        {hasReplies && getNumOfReplies() > 0 && (
                            <button
                                onClick={() => setShowReplies(!showReplies)}
                                className="replies-button"
                            >
                                {showReplies ? "Hide replies" : `View ${getNumOfReplies()} ${getNumOfReplies() > 1 ? "replies" : "reply"}`}
                            </button>
                        )
                        }



                    </div>
                    {showReplies && hasReplies && (
                        <div className="replies">
                            {getReplies().map((reply, index) => (
                                <div key={reply.id}>
                                    <Comment comment={reply} type="reply" commentIndex={commentIndex} postIndex={postIndex} replyId={reply.id} />
                                </div>
                            ))}

                        </div>

                    )}

                </div>

            </div>

        </Card>

    )
}