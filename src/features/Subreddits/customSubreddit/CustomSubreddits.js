import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectSelectedSubreddit, setSelectedSubreddit, startGetCustomPosts } from '../../../store/redditSlice';
import { AiOutlineSearch } from 'react-icons/ai';
import "./CustomSubreddits.css";
import { setCustomSubredditInput, getCustomSubreddit, selectCustomSubreddits } from '../../../store/subredditsSlice';

export const CustomSubreddits = () => {
    const dispatch = useDispatch();
    const selectedSubreddit = useSelector(selectSelectedSubreddit);
    const customSubreddits = useSelector(selectCustomSubreddits);
    const selectedSub = useSelector(selectSelectedSubreddit);


    const [localInput, setLocalInput] = useState("")


    const handleInputChange = (e) => {
        setLocalInput(e.target.value)
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const newSelectedSubreddit = "/r/" + localInput + "/";
        const newSelectedSubredditWithoutPrefix = localInput;
        if (selectedSubreddit.toLowerCase() !== newSelectedSubreddit.toLowerCase()) {
            dispatch(setCustomSubredditInput(localInput));
            dispatch(setSelectedSubreddit("/r/" + localInput + "/"));
            dispatch(startGetCustomPosts());
            dispatch(getCustomSubreddit(newSelectedSubredditWithoutPrefix));
            setLocalInput("")
        } else {
            setLocalInput("");
        };
    }

    return (
        <div>
            <form className='subreddit-search' onSubmit={handleSubmit}>
                <input
                    placeholder='Search subreddit'
                    value={localInput}
                    onChange={handleInputChange}
                />
                <button className='subreddit-search-button' type="submit"><AiOutlineSearch className='subreddit-search-icon' /></button>
            </form>
            <ul className="subreddits-list">
                {
                    customSubreddits.map((subreddit) => (
                        <li
                            key={subreddit.id}
                            className={`${selectedSub.toLowerCase() === subreddit.url.toLowerCase() ? "selected-subreddit" : ""
                        }`}
                        >
                            <button
                                className='subreddit-button'
                                type="button"
                                onClick={() => { dispatch(setSelectedSubreddit(subreddit.url)) }}
                            >
                                <img
                                    src={subreddit.icon_img ? subreddit.icon_img : 'https://b.thumbs.redditmedia.com/rmlXC779KUA2MTO4r_GJd2enqa8GKx3BOasymol6gLk.png'}
                                    className="subreddit-icon"
                                    alt="subreddit-icon"
                                    width={50}
                                    height="auto"
                                    loading="lazy"
                                />
                                {subreddit.display_name}
                            </button>
                        </li>
                    ))
                }
            </ul>
        </div>
    )
}

