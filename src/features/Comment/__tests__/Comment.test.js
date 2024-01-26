import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { act } from "react-dom/test-utils";
import { mockGetComments } from "../../../apiMock/mockAPIs";
import { Comment } from "../Comment";
import createMockStore from "../../../store/mockStore";
import { Provider } from "react-redux";
import * as redditAPI from "../../../api/redditAPI";

const mockComments = mockGetComments("picsComments");

const mockComment =
{
    author: 'Marena',
    created_utc: '1688003725.0',
    body: 'Omg what a great post I love this',
    id: 19129,
    replies: [
        {
            author: 'Boris',
            created_utc: '',
            body: 'Cutest pets ever!',
            id: 1423,
            score: 8
        }
    ],
    score: 5
};


describe("proper rendering", () => {
    let mockStore = createMockStore();
    it("renders the Comment component", () => {
        render(
            <Provider store={mockStore}>
                {mockComments.map((comment) => {
                    return (
                        <Comment comment={comment} key={comment.id} />
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
    it("gets userIcons on first render if they don't exist", async () => {
        redditAPI.getUserIcons = jest.fn().mockResolvedValue(
            {
                img_icon: "some-image.jpeg",
                snoovatar: "some-snoovatar.jpeg"
            }
        )

        await act(async () => {
            render(
                <Provider store={mockStore}>
                    <Comment
                        comment={mockComment}
                        key={mockComment.id}
                        postIndex={0}
                        commentIndex={0}
                        type={"comment"}
                        isLastComment={true}
                    />
                </Provider>

            )
        })


        const userIconImg = await screen.findByAltText("user icon");
        expect(userIconImg).toHaveAttribute("src", "some-image.jpeg");
    })
    it("renders userIcon and doesn't run useEffect when userIcon is already in state", async () => {
        const mockComment1 =
        {
            author: 'Marena',
            created_utc: '1688003725.0',
            body: 'Omg what a great post I love this',
            id: 19129,
            userIcons: [
                {
                    img_icon: "someimage.jpeg",
                    snoovatar: "somesnoovatar.jpeg"
                }
            ]
        };

        await act(async () => {
            render(
                <Provider store={mockStore}>
                    <Comment
                        comment={mockComment1}
                        key={mockComment1.id}
                        postIndex={0}
                        commentIndex={0}
                        type={"comment"}
                        isLastComment={true}
                    />
                </Provider>

            )
        })

        const userIconImg = await screen.findByAltText("user-icon");
        expect(userIconImg).toHaveAttribute("src", "someimage.jpeg")
        
    })

    it("renders button to show replies with correct number of replies, renders replies when clicked", async () => {
        await act(async () => {
            render(
                <Provider store={mockStore}>
                    <Comment
                        comment={mockComment}
                        key={mockComment.id}
                        postIndex={0}
                        commentIndex={0}
                        type={"comment"}
                        isLastComment={true}
                    />
                </Provider>

            )
        })

        expect(screen.getByText("View 1 reply")).toBeInTheDocument();
        const viewRepliesButton = screen.getByRole('button', { name: 'View 1 reply' });

        await act(async () => {
            userEvent.click(viewRepliesButton);
        })

        expect(screen.getByText("Cutest pets ever!")).toBeInTheDocument();

        //renders VoteScore for both commment & reply
        expect(screen.getByText("5")).toBeInTheDocument();
        expect(screen.getByText("8")).toBeInTheDocument();
        
    })
})

