import React from "react";
import Skeleton from "react-loading-skeleton";
import Card from "../../../components/Card";
import "./commentLoading.css";

export const CommentLoading = () => {
    return (
        <Card className="comment-loading">
            <div className="details-container">
                <div className="sub-details">
                    <Skeleton width={50} height={50} circle={true} />
                    <Skeleton width={100} />
                </div>
                <div className="time-details">
                    <Skeleton width={100} />
                </div>
            </div>
            <div className="comment-content">
                <Skeleton width={200} />
            </div>
            
        </Card>
    )
}

