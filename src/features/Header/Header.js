import React from 'react';
import { FaReddit } from 'react-icons/fa'
import { AiOutlineSearch } from 'react-icons/ai'
import './Header.css';
import { setSearchTerm } from '../../store/redditSlice';
import { useDispatch } from 'react-redux';
import { SubredditsDropDown } from '../Subreddits/subredditsDropDown/subredditsDropDown';

export const Header = () => {
    const dispatch = useDispatch();

    const handleInputChange = e => {
        dispatch(setSearchTerm(e.target.value));
    }

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
                    placeholder='Search...'
                    onChange={handleInputChange}
                />
            </form>
            </div>
          

            </div>
         
        </header>
    )
}