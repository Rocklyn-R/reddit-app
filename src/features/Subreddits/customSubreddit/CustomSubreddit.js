import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectSelectedSubreddit, setSelectedSubreddit, startGetCustomPosts } from '../../../store/redditSlice';
import { AiOutlineSearch } from 'react-icons/ai';
import "./CustomSubreddit.css";
import { setCustomSubredditInput, selectCustomSubredditInput } from '../../../store/subredditsSlice';

export const CustomSubreddit = () => {
    const dispatch = useDispatch();
    const selectedSubreddit = useSelector(selectSelectedSubreddit);
    const subredditCustomInput = useSelector(selectCustomSubredditInput);



    const handleInputChange = (e) => {
        dispatch(setCustomSubredditInput(e.target.value));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newSelectedSubreddit = "/r/" + subredditCustomInput + "/";
        if (selectedSubreddit.toLowerCase() !== newSelectedSubreddit.toLowerCase()) {
            dispatch(setSelectedSubreddit("/r/" + subredditCustomInput + "/"));
            dispatch(setCustomSubredditInput(""));
            dispatch(startGetCustomPosts());
        } else return;

    }

    return (
        <form className='subreddit-search' onSubmit={handleSubmit}>
            <input
                placeholder='Search subreddit'
                value={subredditCustomInput}
                onChange={handleInputChange}
            />
            <button className='subreddit-search-button' type="submit"><AiOutlineSearch className='subreddit-search-icon' /></button>
        </form>
    )
}

