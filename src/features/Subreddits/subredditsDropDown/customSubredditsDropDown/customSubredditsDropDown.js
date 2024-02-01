import "./customSubredditsDropDown.css";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectSelectedSubreddit, setSelectedSubreddit, startGetCustomPosts } from "../../../../store/redditSlice";
import { selectCustomSubreddits, selectSubreddits, setCustomSubredditInput, getCustomSubreddit, removeCustomSubreddit } from "../../../../store/subredditsSlice";
import { AiOutlineSearch } from 'react-icons/ai';
import Select from "react-select";

export const CustomSubredditsDropDown = () => {
    const subreddits = useSelector(selectSubreddits);
    const dispatch = useDispatch();
    const selectedSubreddit = useSelector(selectSelectedSubreddit);
    const customSubreddits = useSelector(selectCustomSubreddits);




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


    const changeSelectedSubreddit = (selectedOption) => {
        const selectedSubreddit = selectedOption ? selectedOption.value : '';
        dispatch(setSelectedSubreddit(selectedSubreddit));
    };



    const getSubredditName = (url) => {
        if (selectedSubreddit !== "none found") {
            return url.substring(3, url.length - 1);
        }
        else return ""

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


    const selectedSubInCustomSubreddits = (sub) => {
        return customSubreddits.some(subreddit => subreddit.url.toLowerCase() === sub.toLowerCase());
    };




    return (
        <div>
            <form className='custom-subreddit-search' onSubmit={handleSubmit}>
                <input
                    placeholder='Search subreddit'
                    value={localInput}
                    onChange={handleInputChange}
                    className="search-input"
                />
                <button className='subreddit-search-button' type="submit"><AiOutlineSearch className='subreddit-search-icon' /></button>
            </form>
            <div className='drop-down-container'>
                <label className='subreddits-label'>Your Subreddits: </label>
                <Select
                    aria-label="Select Subreddit"
                    className='custom-select'
                    data-testid="select"
                    value={{
                        value: selectedSubreddit,
                        label: selectedSubInCustomSubreddits(selectedSubreddit) ?
                            (
                                <div className='selected-option'>
                                    {getSubredditImage(selectSelectedSubreddit) && (
                                        <img
                                            src={getSubredditImage(selectedSubreddit)}
                                            className="subreddit-icon"
                                            alt="subreddit-icon"
                                            loading="lazy"
                                        />
                                    )}

                                    {getSubredditName(selectedSubreddit)}
                                </div>
                            ) : "Search or select a subreddit"
                    }}
                    onChange={changeSelectedSubreddit}
                    options={customSubreddits.map(subreddit => ({
                        value: subreddit.url,
                        label: (
                            <div className="custom-option">
                                <div className="subreddit-img-name">
                                    <img
                                        src={subreddit.icon_img ? subreddit.icon_img : 'https://b.thumbs.redditmedia.com/rmlXC779KUA2MTO4r_GJd2enqa8GKx3BOasymol6gLk.png'}
                                        className="subreddit-icon"
                                        alt="subreddit-icon"
                                        loading="lazy"
                                    />
                                    {subreddit.display_name}
                                </div>
                                <button
                                    className='remove-subreddit'
                                    onClick={(event) => {
                                        event.stopPropagation();
                                        if (subreddit.url.toLowerCase() === selectedSubreddit.toLowerCase()) {
                                            dispatch(setSelectedSubreddit(""));
                                        }
                                        dispatch(removeCustomSubreddit(subreddit.id));
                                    }}
                                >
                                    x
                                </button>
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
        </div>
    )
}