import React from "react";
import Skeleton from "react-loading-skeleton";
import Card from "../../../components/Card";
import "./postLoading.css";

export const PostLoading = () => {
    return (
        <Card className="post-loading">
            <div className="post-loading-details-container" data-testid="post-loading">
                <div className="loading-sub-details" >
                    <Skeleton width={30} height={30} circle={true} />
                    <Skeleton width={100} />
                </div>
                <div className="loading-author-details">
                    <Skeleton width={30} height={30} circle={true} />
                    <Skeleton width={100} />
                </div>
                <div className="loading-time-details">
                    <Skeleton width={100} />
                </div>
            </div>
            <div className="loading-post-title">
                <h1>
                    <Skeleton width={200} />
                </h1>
            </div>
            <div className="post-content-loading-container">
                <Skeleton height={100} width={950} />
            </div>
            <div className="comments-container">
                <div type="button">
                    <Skeleton height={40} width={120} />
                </div>
            </div>
        </Card>
    );
};