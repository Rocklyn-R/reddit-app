import React, { useEffect } from 'react';
import { FaReddit } from 'react-icons/fa'
import { AiOutlineSearch } from 'react-icons/ai'
import './Header.css';
import { setSearchTerm } from '../../store/redditSlice';
import { useDispatch, useSelector } from 'react-redux';
import { selectSubreddits } from '../../store/subredditsSlice';
import { selectSelectedSubreddit } from '../../store/redditSlice';

export const Header = () => {
    const dispatch = useDispatch();
    const subreddits = useSelector(selectSubreddits)
    const selectedSubreddit = useSelector(selectSelectedSubreddit)

    const handleInputChange = e => {
        dispatch(setSearchTerm(e.target.value));
    }

    //get the name of selected subreddit.
    const getSubredditName = (url) => {
        if (subreddits.length === 0) {
            return ""
        }
        const subreddit = subreddits.find(subreddit => subreddit.url === url)
        return subreddit.display_name
    }

    //clear the search input when switching to another subreddit
    useEffect(() => {
        const inputElement = document.querySelector(".search input");
        if (inputElement) {
            inputElement.value = ""
        }
    }, [selectedSubreddit])

    return (
        <header data-testid="header" className="header">
            <div className="logo">
                <FaReddit className="logo-icon" />
                <p>
                    Reddit<span>Lite</span>
                </p>
            </div>
            <div>
                <div className='search-container'>
                    <form className="search">
                        <AiOutlineSearch className="search-icon" />
                        <input
                            type="text"
                            placeholder={`Search ${getSubredditName(selectedSubreddit)}`}
                            onChange={handleInputChange}
                        />
                    </form>
                </div>
            </div>

        </header>
    )
}