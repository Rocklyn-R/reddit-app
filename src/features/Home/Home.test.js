import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { act } from "react-dom/test-utils";
import { Home } from "./Home";
import mockStore from "../../store/mockStore";
import { Provider } from "react-redux";
import { getPostsFailed, getPostsSuccess, startGetPosts } from "../../store/redditSlice";




const mockPost = {
    icon_url: 'subreddit_icon.jpg',
    subreddit_name_prefixed: 'r/reactjs',
    author: 'john_doe',
    created_utc: 1638200000, // replace with an appropriate timestamp
    title: 'Test Post',
    // Other properties of the post...
    num_comments: 10,
    loadingComments: false,
    showingComments: false,
    comments: [
        {
            author: 'Frane',
            created_utc: '',
            body: 'Keep lifting!',
            id: 1523
        },
        {
            author: 'Boris',
            created_utc: '',
            body: 'Ma samo veslanje',
            id: 183433
        }
    ], // Mock comments as needed
    permalink: '/this/isatest',
    id: 1234
};

const renderHome = () => {
    render(
        <Provider store={mockStore}>
        <Home />
    </Provider>
    )
}

describe("Correct rendering of loading state and Post", () => {
    it("rednders loading state on initial render and removes it when posts are fetched", () => {
        //initial state in store has isLoading = false

       renderHome();

       const visibleLoadingState = screen.queryAllByTestId("post-loading");

       expect(visibleLoadingState.length).toBe(5);

        act(() => {
            mockStore.dispatch(getPostsSuccess([mockPost]))
        })

        const loadingState = screen.queryByTestId("post-loading");

        expect(loadingState).toBe(null)
    })


})