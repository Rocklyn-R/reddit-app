import React, { useEffect, useState } from "react";
import './Comment.css';
import userIcon from '../../Assets/Images/user-icon.png';
import MarkdownView from "react-showdown";
import { getTimeAgo } from "../../Utilities/Helpers";
import { extractSrcFromBodyHtml } from "../../Utilities/Helpers";
import { removeGifFromComment } from "../../Utilities/Helpers";
import { cleanIconUrl } from "../../Utilities/Helpers";
import { getUserIcons } from "../../api/redditAPI";






export const Comment = ({ comment }) => {

    const gifSrc = extractSrcFromBodyHtml(comment);
    const commentBody = removeGifFromComment(comment.body);
    const [showReplies, setShowReplies] = useState(false);
    const [showIcon, setShowIcon] = useState(true);
    const [ icon, setIcon ] =useState("");


    useEffect(() => {
        if(!comment.userIcons) {
          const getIcons = async () => {
            const icons = await getUserIcons(comment.author);
            if(icons.img_icon) {
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
                return cleanIconUrl(imgIcon)
            } else if (snoovatar) {
                return snoovatar
            } else return userIcon;
        } else {
            setShowIcon(false);
        }

    }

    const getReplies = () => {
        const replyComments = comment.replies.data.children.map(reply => reply.data);
        return replyComments;
    }

    return (
        <div className="comment-container" data-testid="comment">
            <div className="user-details">
                <div className="user-info">
                    {showIcon &&
                        <img
                            src={getIcon()}
                            alt="user icon"
                        />
                    }
                    {!showIcon && icon &&
                        <img
                            src={icon}
                        />
                    }

                    <h4 data-testid="author">{comment.author}</h4>
                </div>
                <p>{getTimeAgo(comment.created_utc)}</p>
            </div>
            <div className="body-container">
                <MarkdownView markdown={commentBody} className="body-text" />
                {gifSrc &&
                    <img src={gifSrc} alt="gif" className="gif" />
                }
                {comment.replies &&
                    <div>
                        <button
                            onClick={() => setShowReplies(!showReplies)}
                        >
                            {showReplies ? "Hide replies" : "Show replies"}
                        </button>
                        {showReplies && (
                            <div className="replies">
                                {getReplies().map((reply, index) => (
                                    <Comment key={index} comment={reply} />
                                ))}
                            </div>
                        )}

                    </div>
                }
            </div>
        </div>

    )
}