import React from 'react';
import './subredditsDropDown.css';
import { useSelector, useDispatch } from 'react-redux';
import { selectSubreddits } from '../../../store/subredditsSlice';
import { selectSelectedSubreddit, setSelectedSubreddit } from '../../../store/redditSlice';
import Select from "react-select";

export const SubredditsDropDown = () => {
    const subreddits = useSelector(selectSubreddits);
    const dispatch = useDispatch();
    const selectedSub = useSelector(selectSelectedSubreddit);


    /* const changeSelectedSubreddit = (e) => {
         const selectedSubreddit = e.target.value;
         dispatch(setSelectedSubreddit(selectedSubreddit))
     };*/

    const changeSelectedSubreddit = (selectedOption) => {
        const selectedSubreddit = selectedOption ? selectedOption.value : '';
        dispatch(setSelectedSubreddit(selectedSubreddit));
    };



    const getSubredditName = (url) => {
        if (subreddits.length === 0) {
            return ""
        }
        const subreddit = subreddits.find(subreddit => subreddit.url === url)
        return subreddit.display_name
    }

    const getSubredditImage = (url) => {
        if (subreddits.length === 0) {
            return "";
        }

        const subreddit = subreddits.find(sub => sub.url === url);
        if (subreddit && subreddit.icon_img) {
            return subreddit.icon_img;
        } else {
            return 'https://b.thumbs.redditmedia.com/rmlXC779KUA2MTO4r_GJd2enqa8GKx3BOasymol6gLk.png';
        }
    };


    return (
        <div className='drop-down-container'>
            <label className='subreddits-label'>Select subreddit: </label>
            <Select
                aria-label="Select Subreddit"
                className='custom-select'
                data-testid="select"
                value={{
                    value: selectedSub,
                    label:
                        (
                            <div className='selected-option'>
                                {getSubredditImage(selectSelectedSubreddit) && (
                                    <img
                                        src={getSubredditImage(selectedSub)}
                                        className="subreddit-icon"
                                        alt="subreddit-icon"
                                        loading="lazy"
                                    />
                                )}

                                {getSubredditName(selectedSub)}
                            </div>
                        )
                }}
                onChange={changeSelectedSubreddit}
                options={subreddits.map(subreddit => ({
                    value: subreddit.url,
                    label: (
                        <div className="option">
                            <img
                                src={subreddit.icon_img ? subreddit.icon_img : 'https://b.thumbs.redditmedia.com/rmlXC779KUA2MTO4r_GJd2enqa8GKx3BOasymol6gLk.png'}
                                className="subreddit-icon"
                                alt="subreddit-icon"
                                loading="lazy"
                            />
                            {subreddit.display_name}
                        </div>
                    ),
                }))}
                styles={{
                    control: (baseStyles, state) => ({
                        ...baseStyles,
                        backgroundColor: 'aliceblue',
                        border: state.isFocused ? "1px solid aliceblue" : "none",
                        borderColor: state.isFocused ? "aliceblue" : "aliceblue",
                        borderRadius: "1rem",
                        boxShadow: state.isFocused ? "0 0 0 1px desiredBorderColor" : "none",
                        ':hover': {
                            borderColor: 'lightblue', // This sets the hover border color
                        }
                    }),
                    option: (baseStyles, state) => ({
                        ...baseStyles,
                        backgroundColor: state.isSelected ? 'lightblue' : 'aliceblue',
                        ':hover': {
                            backgroundColor: 'pink',
                        },
                    }),
                }}
            />
        </div>
    )
}