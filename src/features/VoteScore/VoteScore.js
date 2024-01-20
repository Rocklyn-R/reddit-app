import React, { useState } from "react";
import "./VoteScore.css";
import { useDispatch } from "react-redux";
import { setPostScore, setCommentScore } from "../../store/redditSlice";
import { TbArrowBigUpFilled, TbArrowBigDownFilled } from "react-icons/tb";

export const VoteScore = ({ type, score, postIndex, commentIndex }) => {
    const [upVoteClicked, setUpVoteClicked] = useState(false);
    const [downVoteClicked, setDownVoteClicked] = useState(false);
    const dispatch = useDispatch();


    const handleUpvoteClick = () => {
        if (downVoteClicked) {
            setDownVoteClicked(false);
            setUpVoteClicked(true);
            const newScore = score + 2;
            if(type === "post") {
                dispatch(setPostScore({ index: postIndex, score: newScore }))
            }
            
            if(type === "comment") {
                dispatch(setCommentScore({ postIndex, commentIndex, score: newScore }))
            }
        }
        if (!upVoteClicked && !downVoteClicked) {
            setUpVoteClicked(true);
            setDownVoteClicked(false);
            const newScore = score + 1;
            if (type === "post") {
               dispatch(setPostScore({ index: postIndex, score: newScore })) 
            }
            if (type === "comment") {
                dispatch(setCommentScore({ postIndex, commentIndex, score: newScore }))
            }
        }
        if (upVoteClicked) {
            setUpVoteClicked(false)
            const newScore = score - 1
            if (type === "post") {
               dispatch(setPostScore({ index: postIndex, score: newScore })) 
            }
            if (type === "comment") {
                dispatch(setCommentScore({ postIndex, commentIndex, score: newScore}))
            }
        }

    }


    const handleDownVoteClick = () => {
        if (upVoteClicked) {
            setUpVoteClicked(false);
            setDownVoteClicked(true);
            const newScore = score - 2;
            if (type === "post") {
                dispatch(setPostScore({ index: postIndex, score: newScore }));
            }
            if (type === "comment") {
                dispatch(setCommentScore({ postIndex, commentIndex, score: newScore }))
            }
            
        }
        if (!downVoteClicked && !upVoteClicked) {
            setDownVoteClicked(true);
            setUpVoteClicked(false);
            const newScore = score - 1;
            if (type === "post") {
               dispatch(setPostScore({ index: postIndex, score: newScore })) 
            }
            if (type === "comment") {
                dispatch(setCommentScore({ postIndex, commentIndex, score: newScore }))
            }
            
        }
        if (downVoteClicked) {
            setDownVoteClicked(false);
            const newScore = score + 1;
            if (type === "post") {
               dispatch(setPostScore({ index: postIndex, score: newScore })) 
            }
            if (type === "comment") {
                dispatch(setCommentScore({ postIndex, commentIndex, score: newScore }))
            }
        }
    }

    return (
        <div class="vote-score">
            <button
                className={upVoteClicked ? 'button-clicked' : ""}
                onClick={handleUpvoteClick}
            >
                <TbArrowBigUpFilled className={`up-arrow ${type === "post" ? "post-up-arrow" : "comment-up-arrow"}`} />
            </button>

            <p>{score}</p>
            <button
                className={downVoteClicked ? "button-clicked" : ""}
                onClick={handleDownVoteClick}
            >
                <TbArrowBigDownFilled className={`down-arrow ${type === "post" ? "post-up-arrow" : "comment-up-arrow"}`} />
            </button>

        </div>
    )

}