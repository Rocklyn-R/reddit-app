import React, { useEffect } from 'react';
import { FaReddit } from 'react-icons/fa'
import { AiOutlineSearch } from 'react-icons/ai';
import './Header.css';
import { selectPosts, setSearchTerm } from '../../store/redditSlice';
import { useDispatch, useSelector } from 'react-redux';
import { selectSelectedSubreddit, selectSearchTerm, isLoadingPosts } from '../../store/redditSlice';

export const Header = () => {
    const dispatch = useDispatch();
    const selectedSubreddit = useSelector(selectSelectedSubreddit);
    const searchTerm = useSelector(selectSearchTerm);
    const posts = useSelector(selectPosts);
    const postsLoading = useSelector(isLoadingPosts)

    const handleInputChange = e => {
        dispatch(setSearchTerm(e.target.value));
    }

    //get the name of selected subreddit.
    const getSubredditName = () => {
        if (posts.length > 0 && !postsLoading && selectedSubreddit !== "") {
           return posts[0].subreddit; 
        } else return ""  
    }

    //clear the search input when switching to another subreddit
    useEffect(() => {
        if (searchTerm === "") {
            const inputElement = document.querySelector(".search input");
            if (inputElement) {
                inputElement.value = ""
            }
        }


    }, [selectedSubreddit, searchTerm])

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
                    <form className="search" onSubmit={(e) => e.preventDefault()}>
                        <AiOutlineSearch className="search-icon" />
                        <input
                            type="text"
                            placeholder={`Search ${getSubredditName()}`}
                            onChange={handleInputChange}
                        />
                    </form>
                </div>
            </div>

        </header>
    )
}