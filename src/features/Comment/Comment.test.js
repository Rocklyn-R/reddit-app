import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { act } from "react-dom/test-utils";
import { mockGetComments } from "../../apiMock/mockAPIs";
import { Comment } from "./Comment";
import createMockStore from "../../store/mockStore";
import { Provider } from "react-redux";

const mockComments = mockGetComments("picsComments");


describe("proper rendering", () => {
    let mockStore = createMockStore();
    it("renders the Comment component", () => {
      render(
            <Provider store={mockStore}>
                {mockComments.map((comment) => {
                    return (
                        <Comment comment={comment} key={comment.id}/>
                    )
                })}
            </Provider>
        )

        const renderedComments = screen.queryAllByTestId("comment");
        expect(renderedComments.length).toBe(2);
        expect(screen.getByText("Marena")).toBeInTheDocument();
        expect(screen.getByText("Antica")).toBeInTheDocument();

        //Check that markdownView rendered the body

        expect(screen.getByText("Omg what a great post I love this")).toBeInTheDocument();
        expect(screen.getByText("Cutest pets ever!")).toBeInTheDocument();
    })
})

