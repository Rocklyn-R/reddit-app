import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { act } from "react-dom/test-utils";
import { Home } from "../Home";
import createMockStore from "../../../store/mockStore";
import { Provider } from "react-redux";
import { getPostsFailed, getPostsSuccess, setSelectedSubreddit, startGetPosts } from "../../../store/redditSlice";
import { mockGetSubredditPosts } from "../../../apiMock/mockAPIs";
import * as redditAPI from "../../../api/redditAPI";
import { mockGetComments } from "../../../apiMock/mockAPIs";
import { Header } from "../../Header/Header";



const mockPost = {
    icon_url: 'subreddit_icon.jpg',
    subreddit_name_prefixed: 'r/reactjs',
    author: 'Rocklyn',
    created_utc: 1638200000, // replace with an appropriate timestamp
    title: 'Test Post',
    selftext: "This is my post",
    is_self: true,
    thumbnail: "self",
    is_video: false,
    domain: "self.nameofsubreddit",
    url: "reddit.com/someurl",
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
    ],
    userIcons: [
        {
            img_icon: "",
            snoovatar: ""
        }
    ],
    permalink: '/this/isatest',
    id: 1234
};

const renderHome = (mockStore) => {
    render(
        <Provider store={mockStore}>
            <Home />
        </Provider>
    )
}





describe("Correct rendering of loading state and Post", () => {


    let mockStore;
    //before each test, a fresh mockStore is created with the initial state of actual store
    beforeEach(() => {
        mockStore = createMockStore();
    })

    afterEach(() => {
        jest.clearAllMocks();
    })

    it("renders loading state on initial render when isLoading is true and removes it when posts are fetched and isLoading is false", async () => {
        //initial state in store has isLoading = false


        act(() => {
            renderHome(mockStore);
        })



        const visibleLoadingState = screen.queryAllByTestId("post-loading");

        expect(visibleLoadingState.length).toBe(5);
        const currentState = mockStore.getState();
        const isLoading = currentState.reddit.isLoading;
        expect(isLoading).toBe(true);

        act(() => {
            mockStore.dispatch(getPostsSuccess([mockPost]))
        })

        const loadingState = screen.queryByTestId("post-loading");
        const currentState2 = mockStore.getState();
        const newIsLoading = currentState2.reddit.isLoading;

        expect(loadingState).toBe(null)
        expect(newIsLoading).toBe(false);


    })
    it("tests that the useEffect loads posts on first mount", async () => {

        redditAPI.getSubredditPosts = mockGetSubredditPosts;

        act(() => {
            renderHome(mockStore);
        })


        await waitFor(() => {
            const stateNow = mockStore.getState();
            const posts = stateNow.reddit.posts;
            expect(posts.length).toBeGreaterThan(0);
        })

        const currentState = mockStore.getState();


        expect(mockStore.getState().reddit.posts.length).toBeGreaterThan(0);
        expect(expect(screen.getAllByTestId("post-container").length).toBeGreaterThan(0));
    })
    it("tests that useEffect renders posts on first mount and rerenders posts when selectedSubreddit changes", async () => {


        redditAPI.getSubredditPosts = mockGetSubredditPosts;

        await act(async () => {
            render(
                <Provider store={mockStore}>
                    <Home />
                </Provider>
            )
        })


        let posts;
        //wait for Posts to load into the store
        await waitFor(() => {
            const state = mockStore.getState();
            posts = state.reddit.posts;
            expect(posts.length).toBeGreaterThan(0);
        })


        //renders posts
        expect(screen.getAllByTestId("post-container").length).toBeGreaterThan(0);
        const firstH1Content = screen.queryAllByTestId("subreddit-name")[0].textContent;

        await act(async () => {
            mockStore.dispatch(setSelectedSubreddit("/r/pics/"))
        })
        await waitFor(() => {
            expect(screen.getAllByTestId("post-container").length).toBeGreaterThan(0);
        })
        
        const updatedH1Content = screen.queryAllByTestId("subreddit-name")[0].textContent;

        expect(updatedH1Content).not.toBe(firstH1Content);
    })

    it("renders filtered posts when input in header changes", async () => {
        redditAPI.getSubredditPosts = mockGetSubredditPosts;
 
         await act(async () => {
             render(
                 <Provider store={mockStore}>
                     <Header />
                     <Home />
                 </Provider>
             )
 
         })
 
         //wait for posts to become populated in state
         let posts;
         await waitFor(() => {
             const state = mockStore.getState();
             posts = state.reddit.posts;
             expect(posts.length).toBe(2);
         })
         
         const input = screen.getByPlaceholderText((text) => text.includes("Search"));
         //verify that there are two rendered posts (two titles)
         const allRenderedPostTItles = screen.queryAllByTestId("title");
         expect(allRenderedPostTItles.length).toBe(2);
         const title1 = screen.getByText("Do You Even Lift?");
         const title2 = screen.getByText("Taylor Swift Eras Tour")
         
         expect(title1).toBeInTheDocument();
         expect(title2).toBeInTheDocument();
 
         //type into the search bar
         act(() => {
             userEvent.type(input, "swift");
         })
        
         //verify that there is one post being rendered and title matches search input
         const updatedRenderedPostTitles = screen.queryAllByTestId('title');
         const remainingTitle = updatedRenderedPostTitles[0].textContent;
         expect(remainingTitle.toLowerCase()).toContain("swift");
         expect(updatedRenderedPostTitles.length).toBe(1);
 
         //verify that first post is no longer in the document
         expect(title1).not.toBeInTheDocument();
         expect(title2).toBeInTheDocument();
         expect(title2.textContent.toLowerCase()).toContain("swift")
         
 
         //check that the posts in state did not change
         const stateAfterEvent = mockStore.getState();
         const postsAfterEvent = stateAfterEvent.reddit.posts;
         expect(postsAfterEvent).toBe(posts);
 
     })
});

describe("Correct rendering of comments", () => {
    let mockStore;

    //before each test, a fresh mockStore is created with the initial state of actual store
    beforeEach(() => {
        mockStore = createMockStore();
    })

    afterEach(() => {
        jest.clearAllMocks();
    })

    it("renders comments when button is clicked and hides them after another click", async () => {

        redditAPI.getSubredditPosts = mockGetSubredditPosts
        redditAPI.getPostComments = mockGetComments;

        await act(async () => {
            renderHome(mockStore);
        })

        await waitFor(() => {
            const currentState = mockStore.getState();
            const posts = currentState.reddit.posts
            expect(posts.length).toBeGreaterThan(0);
        })

        const commentButtonFirst = screen.getByTestId("comment-button-first");

        await act(async () => {
            userEvent.click(commentButtonFirst);
        })


        await waitFor(() => {
            const comment = screen.queryAllByTestId("comment");
            expect(comment.length).toBeGreaterThan(0);
        })
        
        const updatedState = mockStore.getState();
        const posts = updatedState.reddit.posts;

        await act(async () => {
            userEvent.click(commentButtonFirst)
        })



        const commentsAfterSecondClick = screen.queryAllByAltText("comment");
        expect(commentsAfterSecondClick.length).toBe(0);
    })
})


