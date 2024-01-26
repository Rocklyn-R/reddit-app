import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { VoteScore } from "../VoteScore";
import createMockStore from "../../../store/mockStore";
import { Provider } from "react-redux";
import { setPosts } from "../../../store/redditSlice";
import { act } from "react-dom/test-utils";

export const pets = [
    {
        author: 'Rocklyn',
        title: "Teacup Poodles",
        id: 123, created_utc: '1688007287.0',
        num_comments: 25,
        url: "https://i.pinimg.com/564x/49/0b/c4/490bc4ab2f8470b0c3a37176e4b608f9.jpg",
        icon_url: "https://b.thumbs.redditmedia.com/rmlXC779KUA2MTO4r_GJd2enqa8GKx3BOasymol6gLk.png",
        subreddit_name_prefixed: 'r/pets',
        post_hint: "image",
        permalink: 'petsComments',
        score: 5,
        comments: [
            {
                author: 'Marena',
                created_utc: '',
                body: 'Omg what a great post I love this',
                id: 1234,
                score: 8,
                replies: [
                    {
                        author: 'Boris',
                        created_utc: '',
                        body: 'Cutest pets ever!',
                        id: 1423,
                        score: 3
                    }
                ]
            },
            {
                author: 'Boris',
                created_utc: '',
                body: 'Cutest pets ever!',
                id: 1313,
                score: 7
            }
        ]
    }
]
describe("upvotes and downvotes work on post scores", () => {
    let mockStore;
    let stateScore;
    beforeEach(() => {
        mockStore = createMockStore();
        mockStore.dispatch(setPosts(pets))
        stateScore = mockStore.getState().reddit.posts[0].score;
    })
    it("increments score by one when upvoand downvote decrements it by 2 when upvote is clickedte is clicked ", async () => {

        const { rerender } = render(
            <Provider store={mockStore}>
                <VoteScore type="post" score={stateScore} postIndex={0} />
            </Provider>

        );


        const upvoteButton = screen.getByRole("button", { name: "upvote" });
        const downVoteButton = screen.getByRole("button", { name: "downvote" });

        await act(async () => {
            userEvent.click(upvoteButton);
        })


        await waitFor(() => {
            const currentState = mockStore.getState();
            expect(currentState.reddit.posts[0].score).toBe(6);
        })


        rerender(
            <Provider store={mockStore}>
                <VoteScore type="post" score={mockStore.getState().reddit.posts[0].score} postIndex={0} />
            </Provider>
        );
        expect(screen.getByText("6")).toBeInTheDocument();

        await act(async () => {
            userEvent.click(downVoteButton);
        })

        await waitFor(() => {
            const currentState = mockStore.getState();
            expect(currentState.reddit.posts[0].score).toBe(4);
        })

        await act(async () => {
            userEvent.click(downVoteButton);
        })

    })

    it("decrements score by one when downvote is clicked", async () => {
        const { rerender } = render(
            <Provider store={mockStore}>
                <VoteScore type="post" score={stateScore} postIndex={0} />
            </Provider>
        );

        const downVoteButton = screen.getByRole("button", { name: "downvote" });
        const upvoteButton = screen.getByRole("button", { name: "upvote" });

        await act(async () => {
            userEvent.click(downVoteButton);
        })

        await waitFor(() => {
            const currentState = mockStore.getState();
            expect(currentState.reddit.posts[0].score).toBe(4);
        })

        rerender(
            <Provider store={mockStore}>
                <VoteScore type="post" score={mockStore.getState().reddit.posts[0].score} postIndex={0} />
            </Provider>
        )
        expect(screen.getByText("4")).toBeInTheDocument;

        await act(async () => {
            userEvent.click(upvoteButton);
        })

        await waitFor(() => {
            const currentState = mockStore.getState();
            expect(currentState.reddit.posts[0].score).toBe(6)
        })
    })

    it("resets the score when upvote is clicked twice", async () => {
        const { rerender } = render(
            <Provider store={mockStore}>
                <VoteScore type="post" score={stateScore} postIndex={0} />
            </Provider>
        );

        const downVoteButton = screen.getByRole("button", { name: "downvote" });
        const upvoteButton = screen.getByRole("button", { name: "upvote" });

        await act(async () => {
            userEvent.click(upvoteButton);
        })

        await waitFor(() => {
            const currentState = mockStore.getState();
            expect(currentState.reddit.posts[0].score).toBe(6);
        })

        rerender(
            <Provider store={mockStore}>
                <VoteScore type="post" score={mockStore.getState().reddit.posts[0].score} postIndex={0} />
            </Provider>
        )

        await act(async () => {
            userEvent.click(upvoteButton);
        })

        await waitFor(() => {
            const currentState = mockStore.getState();
            expect(currentState.reddit.posts[0].score).toBe(5);
        })
    })

    it("resets the score when downvote is clicked twice", async() => {
        const { rerender } = render(
            <Provider store={mockStore}>
                <VoteScore type="post" score={stateScore} postIndex={0} />
            </Provider>
        );

        const downVoteButton = screen.getByRole("button", { name: "downvote" });
        const upvoteButton = screen.getByRole("button", { name: "upvote" });

        await act(async () => {
            userEvent.click(downVoteButton);
        })

        await waitFor(() => {
            const currentState = mockStore.getState();
            expect(currentState.reddit.posts[0].score).toBe(4);
        })

        rerender(
            <Provider store={mockStore}>
                <VoteScore type="post" score={mockStore.getState().reddit.posts[0].score} postIndex={0} />
            </Provider>
        )

        await act(async () => {
            userEvent.click(downVoteButton);
        })

        await waitFor(() => {
            const currentState = mockStore.getState();
            expect(currentState.reddit.posts[0].score).toBe(5);
        })
    })
})

describe("upvotes and downvotes work on comment scores", () => {
    let mockStore;
    let score;
    beforeEach(() => {
        mockStore = createMockStore();
        mockStore.dispatch(setPosts(pets))
        score = mockStore.getState().reddit.posts[0].comments[0].score;
    })

    it("increments the comment score by one when upvote is clicked and down by 2 when downvote is clicked", async () => {
        const { rerender } = render(
            <Provider store={mockStore}>
                <VoteScore type="comment" score={score} postIndex={0} commentIndex={0} />
            </Provider>
        )

        const downVoteButton = screen.getByRole("button", { name: "downvote" });
        const upvoteButton = screen.getByRole("button", { name: "upvote" });

        await act(async () => {
            userEvent.click(upvoteButton);
        })

        await waitFor(() => {
            const currentState = mockStore.getState();
            expect(currentState.reddit.posts[0].comments[0].score).toBe(9)
        })

        rerender(
            <Provider store={mockStore}>
                <VoteScore type="comment" score={mockStore.getState().reddit.posts[0].comments[0].score} postIndex={0} commentIndex={0} />
            </Provider>
        )

        expect(screen.getByText("9")).toBeInTheDocument();

        await act(async () => {
            userEvent.click(downVoteButton);
        })

        await waitFor(() => {
            const currentState = mockStore.getState();
            expect(currentState.reddit.posts[0].comments[0].score).toBe(7)
        })

    })

    it("decrements comment score by one when downvote is clicked and increments by 2 when upvote is clicked", async () => {
        const { rerender } = render(
            <Provider store={mockStore}>
                <VoteScore type="comment" score={score} postIndex={0} commentIndex={0} />
            </Provider>
        )

        const downVoteButton = screen.getByRole("button", { name: "downvote" });
        const upvoteButton = screen.getByRole("button", { name: "upvote" });

        await act(async () => {
            userEvent.click(downVoteButton);
        })

        await waitFor(() => {
            const currentState = mockStore.getState();
            expect(currentState.reddit.posts[0].comments[0].score).toBe(7)
        })

        rerender(
            <Provider store={mockStore}>
                <VoteScore type="comment" score={mockStore.getState().reddit.posts[0].comments[0].score} postIndex={0} commentIndex={0} />
            </Provider>
        )

        expect(screen.getByText("7")).toBeInTheDocument();

        await act(async () => {
            userEvent.click(upvoteButton);
        })

        await waitFor(() => {
            const currentState = mockStore.getState();
            expect(currentState.reddit.posts[0].comments[0].score).toBe(9)
        })
    })

    it("resets the score when upvote is clicked twice", async () => {
        const { rerender } = render(
            <Provider store={mockStore}>
                <VoteScore type="comment" score={score} postIndex={0} commentIndex={0} />
            </Provider>
        )

        const downVoteButton = screen.getByRole("button", { name: "downvote" });
        const upvoteButton = screen.getByRole("button", { name: "upvote" });

        await act(async () => {
            userEvent.click(upvoteButton);
        })

        await waitFor(() => {
            const currentState = mockStore.getState();
            expect(currentState.reddit.posts[0].comments[0].score).toBe(9)
        })

        rerender(
            <Provider store={mockStore}>
                <VoteScore type="comment" score={mockStore.getState().reddit.posts[0].comments[0].score} postIndex={0} commentIndex={0} />
            </Provider>
        )


        await act(async () => {
            userEvent.click(upvoteButton);
        })

        await waitFor(() => {
            const currentState = mockStore.getState();
            expect(currentState.reddit.posts[0].comments[0].score).toBe(8)
        })
    })

    it("resets the score when downvote is clicked twice", async () => {
        const { rerender } = render(
            <Provider store={mockStore}>
                <VoteScore type="comment" score={score} postIndex={0} commentIndex={0} />
            </Provider>
        )

        const downVoteButton = screen.getByRole("button", { name: "downvote" });
        const upvoteButton = screen.getByRole("button", { name: "upvote" });

        await act(async () => {
            userEvent.click(downVoteButton);
        })

        await waitFor(() => {
            const currentState = mockStore.getState();
            expect(currentState.reddit.posts[0].comments[0].score).toBe(7)
        })

        rerender(
            <Provider store={mockStore}>
                <VoteScore type="comment" score={mockStore.getState().reddit.posts[0].comments[0].score} postIndex={0} commentIndex={0} />
            </Provider>
        )


        await act(async () => {
            userEvent.click(downVoteButton);
        })

        await waitFor(() => {
            const currentState = mockStore.getState();
            expect(currentState.reddit.posts[0].comments[0].score).toBe(8)
        })
    })

})

describe("upvotes and downvotes work on replies of comments", () => {
    let mockStore;
    let score;
    let id;
    beforeEach(() => {
        mockStore = createMockStore();
        mockStore.dispatch(setPosts(pets))
        score = mockStore.getState().reddit.posts[0].comments[0].replies[0].score;
        id = mockStore.getState().reddit.posts[0].comments[0].replies[0].id;
    })

    it("increments score by 1 when upvote is clicked and decrements by 2 when downvote is clicked", async () => {
        const { rerender } = render(
            <Provider store={mockStore}>
                <VoteScore type="reply" score={score} postIndex={0} replyId={1423} />
            </Provider>
        )

        const downVoteButton = screen.getByRole("button", { name: "downvote" });
        const upvoteButton = screen.getByRole("button", { name: "upvote" });

        const initialScore = mockStore.getState().reddit.posts[0].comments[0].replies[0].score;

        await act(async () => {
            userEvent.click(upvoteButton);
        })

        await waitFor(() => {
            const currentState = mockStore.getState();
            const updatedScore = currentState.reddit.posts[0].comments[0].replies[0].score;
            expect(updatedScore).toBe(4)
        })

        rerender(
            <Provider store={mockStore}>
                <VoteScore type="reply" score={mockStore.getState().reddit.posts[0].comments[0].replies[0].score} postIndex={0} replyId={1423} />
            </Provider>
        )

        await act(async () => {
            userEvent.click(downVoteButton);
        })

        await waitFor(() => {
            const currentState = mockStore.getState();
            const updatedScore = currentState.reddit.posts[0].comments[0].replies[0].score;
            expect(updatedScore).toBe(2);
        })
    })

    it("decrements score by 1 when downvote is clicked and increments by 2 when upvote is clicked", async () => {
        const { rerender } = render(
            <Provider store={mockStore}>
                <VoteScore type="reply" score={score} postIndex={0} replyId={1423} />
            </Provider>
        )

        const downVoteButton = screen.getByRole("button", { name: "downvote" });
        const upvoteButton = screen.getByRole("button", { name: "upvote" });

        const initialScore = mockStore.getState().reddit.posts[0].comments[0].replies[0].score;

        await act(async () => {
            userEvent.click(downVoteButton);
        })

        await waitFor(() => {
            const currentState = mockStore.getState();
            const updatedScore = currentState.reddit.posts[0].comments[0].replies[0].score;
            expect(updatedScore).toBe(2)
        })

        rerender(
            <Provider store={mockStore}>
                <VoteScore type="reply" score={mockStore.getState().reddit.posts[0].comments[0].replies[0].score} postIndex={0} replyId={1423} />
            </Provider>
        )

        await act(async () => {
            userEvent.click(upvoteButton);
        })

        await waitFor(() => {
            const currentState = mockStore.getState();
            const updatedScore = currentState.reddit.posts[0].comments[0].replies[0].score;
            expect(updatedScore).toBe(4);
        })
    })

    it("resets the score when upvote is clicked twice", async () => {
        const { rerender } = render(
            <Provider store={mockStore}>
                <VoteScore type="reply" score={score} postIndex={0} replyId={1423} />
            </Provider>
        )

        const downVoteButton = screen.getByRole("button", { name: "downvote" });
        const upvoteButton = screen.getByRole("button", { name: "upvote" });

        const initialScore = mockStore.getState().reddit.posts[0].comments[0].replies[0].score;

        await act(async () => {
            userEvent.click(upvoteButton);
        })

        await waitFor(() => {
            const currentState = mockStore.getState();
            const updatedScore = currentState.reddit.posts[0].comments[0].replies[0].score;
            expect(updatedScore).toBe(4)
        })

        rerender(
            <Provider store={mockStore}>
                <VoteScore type="reply" score={mockStore.getState().reddit.posts[0].comments[0].replies[0].score} postIndex={0} replyId={1423} />
            </Provider>
        )

        await act(async () => {
            userEvent.click(upvoteButton);
        })

        await waitFor(() => {
            const currentState = mockStore.getState();
            const updatedScore = currentState.reddit.posts[0].comments[0].replies[0].score;
            expect(updatedScore).toBe(3);
        })
    })

    it("resets the score when downvote is clicked twice", async () => {
        const { rerender } = render(
            <Provider store={mockStore}>
                <VoteScore type="reply" score={score} postIndex={0} replyId={1423} />
            </Provider>
        )

        const downVoteButton = screen.getByRole("button", { name: "downvote" });
        const upvoteButton = screen.getByRole("button", { name: "upvote" });

        const initialScore = mockStore.getState().reddit.posts[0].comments[0].replies[0].score;

        await act(async () => {
            userEvent.click(downVoteButton);
        })

        await waitFor(() => {
            const currentState = mockStore.getState();
            const updatedScore = currentState.reddit.posts[0].comments[0].replies[0].score;
            expect(updatedScore).toBe(2)
        })

        rerender(
            <Provider store={mockStore}>
                <VoteScore type="reply" score={mockStore.getState().reddit.posts[0].comments[0].replies[0].score} postIndex={0} replyId={1423} />
            </Provider>
        )

        await act(async () => {
            userEvent.click(downVoteButton);
        })

        await waitFor(() => {
            const currentState = mockStore.getState();
            const updatedScore = currentState.reddit.posts[0].comments[0].replies[0].score;
            expect(updatedScore).toBe(3);
        })
    })
})