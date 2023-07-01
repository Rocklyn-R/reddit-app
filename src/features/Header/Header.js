import React from 'react';
import { FaReddit } from 'react-icons/fa'
import { AiOutlineSearch } from 'react-icons/ai'
import './Header.css';

export const Header = () => {
    return (
        <header>
            <div className="logo">
                <FaReddit className="logo-icon"/>
                <p>
                    Reddit<span>Rocklyn</span>
                </p>
            </div>
            <form className="search">
                <input
                    type="text"
                    placeholder='Search...' 
                />
                <button
                    type="submit"
                >
                    <AiOutlineSearch />
                </button>
            </form>
        </header>
    )
}