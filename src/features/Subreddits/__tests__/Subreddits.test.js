import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { act } from "react-dom/test-utils";
import createMockStore from "../../../store/mockStore";
import { Provider } from "react-redux";
import { Subreddits } from "../Subreddits";
import { toBeChecked } from "@testing-library/jest-dom/matchers";
import { mockGetSubreddits } from "../../../apiMock/mockAPIs";
import * as redditAPI from "../../../api/redditAPI";

describe("Proper rendering of Subreddits", () => {
    let mockStore;
    beforeEach(() => {
        mockStore = createMockStore();
    })
    it("Renders component and loading skeleton", () => {


        render(
            <Provider store={mockStore}>
                <Subreddits />
            </Provider>
        )

        const skeletonItems = document.getElementsByClassName("skeleton-li");
        expect(skeletonItems.length).toBe(10);
    })
    it("UseEffect renders component with subreddits on first mount", async () => {

        redditAPI.getSubreddits = mockGetSubreddits;
        await act(async () => {
            render(
                <Provider store={mockStore}>
                    <Subreddits />
                </Provider>
            )
        })



        //wait for subreddits in state to update
        await waitFor(() => {
            const updatedState = mockStore.getState();
            const subreddits = updatedState.subreddits.subreddits;
            expect(subreddits.length).toBeGreaterThan(0);
        })


        //Test that all Subreddit buttons are present in the document
        const buttons = screen.queryAllByRole("button");
        expect(buttons.length).toBeGreaterThan(0);

    })

    it("test clicking on button triggers setSelectedSubreddit action", async () => {

        redditAPI.getSubreddits = mockGetSubreddits;
        await act(async () => {
            render(
                <Provider store={mockStore}>
                    <Subreddits />
                </Provider>
            )
        })
        const currentState = mockStore.getState();
        const selectedSubreddit = currentState.reddit.selectedSubreddit;
        expect(selectedSubreddit).toBe("/r/Home/")

        const picsSubreddit = screen.getByText("pics");
        act(() => {
            userEvent.click(picsSubreddit)
        });

        const updatedState = mockStore.getState();
        const newSelectedSubreddit = updatedState.reddit.selectedSubreddit;
        expect(newSelectedSubreddit).toBe("/r/pics/");
        const picsLiElement = screen.getByText("pics").closest("li")
        expect(picsLiElement).toHaveClass("selected-subreddit");
    })
})
