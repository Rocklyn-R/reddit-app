import React from "react";
import './Comment.css';
import userIcon from '../../Assets/Images/user-icon.png';
import MarkdownView from "react-showdown";
import { getTimeAgo } from "../../Utilities/Helpers";
import { extractSrcFromBodyHtml } from "../../Utilities/Helpers";
import { removeGifFromComment } from "../../Utilities/Helpers";



export const Comment = ({ comment }) => {

    const gifSrc = extractSrcFromBodyHtml(comment);

    const commentBody = removeGifFromComment(comment.body)

    return (
        <div className="comment-container" data-testid="comment">
            <div className="user-details">
                <img 
                    src={userIcon}
                    alt="user icon"
                />
                <h4 data-testid="author">{comment.author}</h4>
                <p>{getTimeAgo(comment.created_utc)}</p>
            </div>
            <div className="body-container">
                <MarkdownView markdown={commentBody} />
                {gifSrc &&
                    <img src={gifSrc} alt="gif" />
                }
            </div>
        </div>
    )
}