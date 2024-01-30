import React, { useEffect } from 'react';
import './Subreddits.css';
import { selectSubreddits, fetchSubreddits, isLoadingSubreddits, selectCustomSubredditInput, getCustomSubreddit } from '../../store/subredditsSlice';
import { useSelector, useDispatch } from 'react-redux';
import { setSelectedSubreddit, selectSelectedSubreddit, isLoadingPosts, isCustomPostsError } from '../../store/redditSlice';
import Card from '../../components/Card';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { CustomSubreddit } from './customSubreddit/CustomSubreddit';

export const Subreddits = () => {
    const dispatch = useDispatch();
    const subreddits = useSelector(selectSubreddits);
    const selectedSub = useSelector(selectSelectedSubreddit);
    const loadingState = useSelector(isLoadingSubreddits);
    const postsLoading = useSelector(isLoadingPosts);
    const errorCustomPosts = useSelector(isCustomPostsError);
    const customSubredditInput = useSelector(selectCustomSubredditInput);

    useEffect(() => {
        dispatch(fetchSubreddits());
    }, [dispatch])

    useEffect(() => {
        if (!postsLoading && !errorCustomPosts && customSubredditInput !== "") {
            dispatch(getCustomSubreddit())
        }
    }, [postsLoading, errorCustomPosts, customSubredditInput, dispatch])
    

    return (
        <Card className="subreddit-card" >
            <h2>Your Subreddits</h2>
            <CustomSubreddit />
            <h2>Popular Subreddits</h2>
            <ul className="subreddits-list">
                {loadingState ?
                    Array(10) // Render 5 skeleton items for loading state
                        .fill()
                        .map((_, index) => (
                            <li key={index} className="skeleton-li">
                                <Skeleton height={50} width={195} />
                            </li>
                        ))
                    : subreddits.map((subreddit) => (
                        <li
                            key={subreddit.id}
                            className={`${selectedSub.toLowerCase() === subreddit.url.toLowerCase() ? `selected-subreddit` : ""
                                }`}
                        >
                            <button
                                className='subreddit-button'
                                type="button"
                                onClick={() => dispatch(setSelectedSubreddit(subreddit.url))}
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
                    ))}
            </ul>
        </Card>
    )
}