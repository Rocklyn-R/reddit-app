import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { act } from "react-dom/test-utils";
import { Header } from "./Header";
import createMockStore from "../../store/mockStore";
import { Provider } from "react-redux";
import store from "../../store/store";
import { setSearchTerm } from "../../store/redditSlice";





describe("Rendering and function", () => {
    let mockStore;
    
    beforeEach(() => {
        mockStore = createMockStore();
    })

    it("renders without crashing", () => {
        render(
            <Provider store={mockStore}>
                <Header />
            </Provider>
        )

        expect(screen.getByTestId("header")).toBeInTheDocument();
        const searchInputElement = screen.getByPlaceholderText('Search...');
        expect(searchInputElement).toBeInTheDocument();
    })

    it("dispatches setSearchTerm action on input change & updates state", () => {
        render(
            <Provider store={mockStore}>
                <Header/>
            </Provider>
        )
        
        const input = screen.getByPlaceholderText('Search...');
        
        act(() => {
           userEvent.type(input, "test") 
        })
        
        // Check if the setSearchTerm action was dispatched and state updated accordingly
        const updatedState = mockStore.getState();
        expect(updatedState.reddit.searchTerm).toBe("test");
    })

    it("renders only the filtered posts when input changes", () => {
        
    })
})