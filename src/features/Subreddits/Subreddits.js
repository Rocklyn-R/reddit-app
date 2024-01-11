import React, { useEffect } from 'react';
import './Subreddits.css';
import { selectSubreddits, fetchSubreddits, isLoading } from '../../store/subredditsSlice';
import { useSelector, useDispatch } from 'react-redux';
import { setSelectedSubreddit, selectSelectedSubreddit } from '../../store/redditSlice';
import Card from '../../components/Card';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';


export const Subreddits = () => {
    const dispatch = useDispatch();
    const subreddits = useSelector(selectSubreddits);
    const selectedSub = useSelector(selectSelectedSubreddit);
    const loadingState = useSelector(isLoading);

    useEffect(() => {
        dispatch(fetchSubreddits()); 
    }, [dispatch])



    return (
        <Card className="subreddit-card" >
            <h2>Subreddits</h2>
            <ul className="subreddits-list">
                {loadingState ?
                    Array(10) // Render 5 skeleton items for loading state
                        .fill()
                        .map((_, index) => (
                            <li key={index} className="skeleton-li">
                                <Skeleton height={50} width={200} />
                            </li>
                        ))
                    : subreddits.map((subreddit) => (
                        <li
                            key={subreddit.id}
                            className={`${selectedSub === subreddit.url ? `selected-subreddit` : ""
                                }`}
                        >
                            <button
                                type="button"
                                onClick={() => dispatch(setSelectedSubreddit(subreddit.url))}
                            >
                                <img
                                    src={subreddit.icon_img ? subreddit.icon_img : 'https://b.thumbs.redditmedia.com/rmlXC779KUA2MTO4r_GJd2enqa8GKx3BOasymol6gLk.png'}
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