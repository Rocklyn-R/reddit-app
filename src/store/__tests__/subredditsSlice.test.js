import "@testing-library/jest-dom";
import createMockStore from "../mockStore";

import {
    startGetSubreddits,
    getSubredditsSuccess,
    getSubredditsFailed,
    fetchSubreddits,
    getCustomSubreddit,
    addCustomSubredditSuccess,
    startAddCustomSubreddit,
    addCustomSubredditFailed
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
        const mockSubreddits = ["subreddit1", "subreddit 2"];
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

    it("should handle startAddCustomSubreddit", () => {
        mockStore.dispatch(startAddCustomSubreddit());
        const state = mockStore.getState().subreddits;
        expect(state.customSubredditsIsLoading).toBe(true);
        expect(state.customSubredditsError).toBe(false);
    })

    it("should handle addCustomSubredditSuccess", () => {
        const mockSubreddits = ["subreddit1", "subreddit 2"];
        mockStore.dispatch(addCustomSubredditSuccess(mockSubreddits));
        const state = mockStore.getState().subreddits;
        expect(state.customSubreddits).toEqual([mockSubreddits])
        expect(state.customSubredditsIsLoading).toBe(false);
        expect(state.customSubredditsError).toBe(false);
    })

    it("should handle addCustomSubredditFailed", () => {
        mockStore.dispatch(addCustomSubredditFailed());
        const state = mockStore.getState().subreddits;
        expect(state.customSubredditsIsLoading).toBe(false);
        expect(state.customSubredditsError).toBe(true);
    })

    it("should handle getCustomSubreddit", async () => {
        await mockStore.dispatch(addCustomSubredditSuccess({
            display_name: "Test",
            icon_img: "",
            url: "/r/test/",
            id: 1313
        }))
        redditAPI.getSubredditInfo = jest.fn().mockResolvedValue(
            {
                display_name: "Home",
                icon_img: "",
                url: "/r/home/",
                id: 1234
            }
        )
        await mockStore.dispatch(getCustomSubreddit("Subreddit"));
        const state = mockStore.getState().subreddits;
        const expectedState = [

            {
                display_name: "Home",
                icon_img: "",
                url: "/r/home/",
                id: 1234
            },
            {
                display_name: "Test",
                icon_img: "",
                url: "/r/test/",
                id: 1313
            }
        ]
        expect(state.customSubreddits).toStrictEqual(expectedState)

        await mockStore.dispatch(getCustomSubreddit("Test"));
        const newState = mockStore.getState().subreddits;
        //State stays the same because name of Subreddit matches display_name already in state
        expect(newState).toStrictEqual(state);
    })

    it("should handle getCustomSubreddit error", async () => {
        redditAPI.getSubredditInfo = jest.fn(() => Promise.reject(error));
        await mockStore.dispatch(getCustomSubreddit("Test"));
        const state = mockStore.getState().subreddits;
        expect(state.customSubredditsError).toBe(true);
    })
})