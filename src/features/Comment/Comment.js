import React from "react";
import './Comment.css';
import userIcon from '../../Assets/Images/user-icon.png';
import MarkdownView from "react-showdown";
import { getTimeAgo } from "../../Utilities/Helpers";
import { extractSrcFromBodyHtml } from "../../Utilities/Helpers";



export const Comment = ({ comment }) => {

    const gifSrc = extractSrcFromBodyHtml(comment);
    /*const renderers = {
        link: ({ href, children }) => (
          <a href={href} target="_blank" rel="noopener noreferrer">
            {children}
          </a>
        ),
      };*/

    return (
        <div className="comment-container" data-testid="comment">
            <div className="user-details">
                <img 
                    src={userIcon}
                    alt="user icon"
                />
                <h4>{comment.author}</h4>
                <p>{getTimeAgo(comment.created_utc)}</p>
            </div>
            <div className="body-container">
                <MarkdownView markdown={comment.body} />
                {gifSrc &&
                    <img src={gifSrc} alt="gif" />
                }
            </div>
        </div>
    )
}