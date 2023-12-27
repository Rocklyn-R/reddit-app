import React from 'react';
import './subredditsDropDown.css';
import { useSelector, useDispatch } from 'react-redux';
import { selectSubreddits } from '../../../store/subredditsSlice';
import { selectSelectedSubreddit, setSelectedSubreddit } from '../../../store/redditSlice';

export const SubredditsDropDown = () => {
    const subreddits = useSelector(selectSubreddits);
    const dispatch = useDispatch();
    const selectedSub = useSelector(selectSelectedSubreddit);

    const changeSelectedSubreddit = (e) => {
        const selectedSubreddit = e.target.value;
        dispatch(setSelectedSubreddit(selectedSubreddit))
    };



    return (
        <div className='drop-down-container'>
            <h2>Subreddits:</h2>
            <select className='drop-down' value={selectedSub} onChange={changeSelectedSubreddit}>
                {subreddits.map(subreddit => (
                    <option key={subreddit.id} value={subreddit.url}>{subreddit.display_name}</option>
                ))}
            </select>
        </div>
    )
}