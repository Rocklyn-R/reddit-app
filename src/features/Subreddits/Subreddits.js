import React from 'react';
import './Subreddits.css';
import { selectSubreddits } from '../../store/subredditsSlice';
import { useSelector, useDispatch } from 'react-redux';
import { setSelectedSubreddit, selectSelectedSubreddit } from '../../store/redditSlice';
import Card from '../../components/Card';


export const Subreddits = () => {
    const dispatch = useDispatch();
    const subreddits = useSelector(selectSubreddits);
    const selectedSub = useSelector(selectSelectedSubreddit);




    return (
        <Card className="subreddit-card" >
            <h2>Subreddits</h2>
            <ul className="subreddits-list">
                {subreddits.map((subreddit) => (
                    <li
                        key={subreddit.id}
                        className={`${
                            selectedSub === subreddit.display_name ? `selected-subreddit` : ""
                        }`}
                    >
                        <button 
                            type="button"
                            onClick={() => dispatch(setSelectedSubreddit(subreddit.display_name))}
                        >
                            <img 
                                src={subreddit.icon_img}
                                className="subreddit-icon"
                                alt="subreddit-icon"
                            />
                            {subreddit.display_name}
                        </button>
                    </li>
                ))}
            </ul>
        </Card>
    )
}