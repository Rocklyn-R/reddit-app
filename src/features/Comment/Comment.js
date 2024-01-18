import React, { useEffect, useState } from "react";
import './Comment.css';
import userIcon from '../../Assets/Images/user-icon.png';
import MarkdownView from "react-showdown";
import { getTimeAgo } from "../../Utilities/Helpers";
import { extractSrcFromBodyHtml } from "../../Utilities/Helpers";
import { removeGifFromComment } from "../../Utilities/Helpers";
import { getUserIcons } from "../../api/redditAPI";
import { cleanIconUrl } from "../../Utilities/Helpers";






export const Comment = ({ comment }) => {

    const gifSrc = extractSrcFromBodyHtml(comment);
    const commentBody = removeGifFromComment(comment.body);
    const [iconSrc, setIconSrc] = useState(userIcon);

   
    const getIcon = () => {
        const imgIcon = comment.userIcons[0].img_icon;
        const snoovatar = comment.userIcons[0].snoovatar;
        if (imgIcon) {
            return cleanIconUrl(imgIcon)
        } else if (snoovatar) {
            return snoovatar
        } else return userIcon;
    }


    return (
        <div className="comment-container" data-testid="comment">
            <div className="user-details">
                <div className="user-info">
                    <img
                        src={getIcon()}
                        alt="user icon"
                    />
                    <h4 data-testid="author">{comment.author}</h4>
                </div>
                <p>{getTimeAgo(comment.created_utc)}</p>
            </div>
            <div className="body-container">
                <MarkdownView markdown={commentBody} className="body-text" />
                {gifSrc &&
                    <img src={gifSrc} alt="gif" className="gif" />
                }
                <p></p>
            </div>
        </div>
    )
}