import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { act } from "@testing-library/react";
import createMockStore from "../../../../../store/mockStore";
import { CustomSubredditsDropDown } from "../customSubredditsDropDown";
import { Provider } from "react-redux";
import * as redditAPI from "../../../../../api/redditAPI";

describe("State updates accordingly based on form submission and user Events", () => {
    let mockStore;
    beforeEach(() => {
        mockStore = createMockStore();
    })

    it("tests that submitting form updates customSubreddits and selectedSubreddit, renders button with the display_name, clicking button updates selectedSubreddti again", async () => {
        redditAPI.getSubredditInfo = jest.fn().mockResolvedValue(
            {
                display_name: "Fitness",
                icon_img: "",
                url: "/r/fitness/",
                id: 1234
            }
        )
        redditAPI.getSubredditPosts = jest.fn().mockResolvedValueOnce("");
        redditAPI.getUserIcons = jest.fn().mockResolvedValue("")
        render(
            <Provider store={mockStore}>
                <CustomSubredditsDropDown />
            </Provider>
        )

        const input = screen.getByPlaceholderText('Search subreddit');
        await act(async () => {
            userEvent.type(input, 'Fitness');
        })

        const submitButton = screen.getByTestId("search-subreddit-button")
        await act(async () => {
            userEvent.click(submitButton);
        })

        const currentState = mockStore.getState();
        const customSubreddit = currentState.subreddits.customSubreddits;
        expect(customSubreddit).toStrictEqual([{
            display_name: "Fitness",
            icon_img: "",
            url: "/r/fitness/",
            id: 1234
        }])
        expect(currentState.reddit.selectedSubreddit).toStrictEqual("/r/Fitness/");
        const fitnessButton = screen.getByText("Fitness");
        expect(fitnessButton).toBeInTheDocument();
    })
})