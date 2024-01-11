import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { act } from "react-dom/test-utils";
import { SubredditsDropDown } from "./subredditsDropDown";
import createMockStore from "../../../store/mockStore";
import { Provider } from "react-redux";
import * as redditAPI from "../../../api/redditAPI";
import { mockGetSubreddits } from "../../../apiMock/mockAPIs";
import { fetchSubreddits } from "../../../store/subredditsSlice";

describe("SubredditsDropDown", () => {
    let mockStore;
    beforeEach(() => {
        mockStore = createMockStore();
    })

    it("renders the SubredditsDropDown component with the correct subreddits on first render", async () => {
        redditAPI.getSubreddits = mockGetSubreddits;

        await act(async () => {
            render(
                <Provider store={mockStore}>
                    <SubredditsDropDown />
                </Provider>
            )
        })

        mockStore.dispatch(fetchSubreddits());

        await waitFor(() => {
            const currentState = mockStore.getState();
            const subreddits = currentState.subreddits.subreddits;
            const selectedSub = currentState.reddit.selectedSubreddit;
            expect(selectedSub).toBe("/r/pics/")
            expect(subreddits.length).toBe(4)
        })
        


        const selectElement = screen.getByTestId("select");

        act(() => {
          userEvent.selectOptions(selectElement, "Home");   
        })
       
        const updateState = mockStore.getState();
        const selectedSubreddit = updateState.reddit.selectedSubreddit;
        expect(selectedSubreddit).toBe("/r/home/")
    })
})