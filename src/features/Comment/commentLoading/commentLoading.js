import React from "react";
import Skeleton from "react-loading-skeleton";
import Card from "../../../components/Card";
import "./commentLoading.css";

export const CommentLoading = () => {
    return (
        <Card className="comment-loading">
            <div className="cmt-loading-details-container" data-testid="loading-state">
                <div className="cmt-loading-sub-details">
                    <Skeleton width={30} height={30} circle={true} />
                    <Skeleton width={100} />
                </div>
                <div className="cmt-loading-time-details">
                    <Skeleton width={100} />
                </div>
            </div>
            <div className="loading-comment-content">
                <Skeleton width={850} />
            </div>
            
        </Card>
    )
}

