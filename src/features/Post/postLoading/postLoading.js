import Skeleton from "react-loading-skeleton";
import Card from "../../../components/Card";
import "./postLoading.css";

export const PostLoading = () => {
    return (
        <Card className="post-loading">
            <div className="details-container">
                <div className="sub-details">
                    <Skeleton width={50} height={50} circle={true} />
                    <Skeleton width={100} />
                </div>
                <div className="author-details">
                    <Skeleton width={150} />
                </div>
                <div className="time-details">
                    <Skeleton width={100} />
                </div>
            </div>
            <div className="post-title">
                <h1>
                    <Skeleton width={200} />
                </h1>
            </div>
            <div className="post-content-container">
                <Skeleton height={200} width={800} />
            </div>
            <div className="comments-container">
                <div type="button">
                    <Skeleton height={40} width={120} />
                </div>
            </div>
        </Card>
    );
};