import "@testing-library/jest-dom";
import createMockStore from "../mockStore";

import {
    startGetSubreddits, 
    getSubredditsSuccess,
    getSubredditsFailed,
    fetchSubreddits,
} from "../subredditsSlice";

import * as redditAPI from "../../api/redditAPI";


describe("subreddits slice", () => {
    let mockStore;
    beforeEach(() => {
        mockStore = createMockStore()
    })
   

    it("should handle startGetSubreddits", () => {
        mockStore.dispatch(startGetSubreddits());
        const state = mockStore.getState().subreddits;
        expect(state.isLoading).toBe(true);
        expect(state.error).toBe(false);
    })

    it("should handle getSubredditSuccess", () => {
        const mockSubreddits= ["subreddit1", "subreddit 2"];
        mockStore.dispatch(getSubredditsSuccess(mockSubreddits))
        const state = mockStore.getState().subreddits;
        expect(state.isLoading).toBe(false);
        expect(state.error).toBe(false);
        expect(state.subreddits).toEqual(mockSubreddits)
    })

    it("should handle getSubredditsFailed", () => {
        mockStore.dispatch(getSubredditsFailed());
        const state = mockStore.getState().subreddits;
        expect(state.isLoading).toBe(false);
        expect(state.error).toBe(true);
    })

    it("should handle fetchSubreddits", async () => {
        redditAPI.getSubreddits = jest.fn().mockResolvedValue(["sub1", "sub2"]);

        await mockStore.dispatch(fetchSubreddits());
        const state = mockStore.getState().subreddits;
        expect(state.subreddits).toEqual(["sub1", "sub2"])
    })

    it("should handle error for fetchSubreddits", async () => {

        redditAPI.getSubreddits = jest.fn(() => Promise.reject(error));
        await mockStore.dispatch(fetchSubreddits());
        const state = mockStore.getState().subreddits;
        expect(state.error).toBe(true);
    })
    
    
})