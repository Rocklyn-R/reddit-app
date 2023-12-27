import { configureStore, combineReducers} from "@reduxjs/toolkit";
import subredditsReducer from "./subredditsSlice";
import redditReducer from "./redditSlice";

export default configureStore({
    reducer: combineReducers({
        subreddits: subredditsReducer,
        reddit: redditReducer,
    })
}) 

