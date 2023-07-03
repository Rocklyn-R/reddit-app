import React from "react";
import './Comment.css';
import userIcon from '../../Assets/Images/user-icon.png';
import ReactMarkdown from 'react-markdown';



export const Comment = ({ comment }) => {
    return (
        <div className="comment-container">
            <div className="user-details">
                <img 
                    src={userIcon}
                    alt="user icon"
                />
                <h4>{comment.author}</h4>
            </div>
            <div className="body-container">
                <ReactMarkdown>{comment.body}</ReactMarkdown>
            </div>
        </div>
    )
}