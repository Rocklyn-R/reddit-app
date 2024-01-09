import { configureStore, combineReducers} from "@reduxjs/toolkit";
//import configureStore from "redux-mock-store";
import subredditsReducer from "./subredditsSlice";
import redditReducer from "./redditSlice";

//function that creates an instance of a mock store
export const createMockStore = () => {
    const store = configureStore({
    reducer: combineReducers({
        subreddits: subredditsReducer,
        reddit: redditReducer,
    })
    }) 
    return store;
} 

export default createMockStore;