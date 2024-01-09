import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { act } from "react-dom/test-utils";
import { Home } from "./Home";
import createMockStore from "../../store/mockStore";
import { Provider } from "react-redux";
import { getPostsFailed, getPostsSuccess, setSelectedSubreddit, startGetPosts } from "../../store/redditSlice";
import { mockGetSubredditPosts } from "../../apiMock/mockAPIs";
import * as redditAPI from "../../api/redditAPI";
import { mockGetComments } from "../../apiMock/mockAPIs";
import { Header } from "../Header/Header";




//redditAPI.getSubredditPosts = mockGetSubredditPosts;




/*getSubredditPosts.mockImplementation((subreddit) => {
    
        
   if (subreddit === "/r/pics/") {
        return Promise.resolve [
            {
                author: 'Nikola',
                title: "King of All Exercises",
                id: 63534, 
                created_utc: '1687968271.0',
                num_comments: 25,
                url: "https://www.muscleandfitness.com/wp-content/uploads/2019/02/ronnie-coleman-squat-barbell-1109.jpg?quality=86&strip=all",
                icon_url: 'https://b.thumbs.redditmedia.com/rmlXC779KUA2MTO4r_GJd2enqa8GKx3BOasymol6gLk.png',
                subreddit_name_prefixed: 'r/fitness',
                post_hint: 'link',
                permalink: 'fitnessComments',
                subreddit: "pics"
            }
        ]
        
    }

    else if (subreddit === "/r/home/") {
        return Promise.resolve [
            {
                author: 'Rocklyn',
                title: "Do You Even Lift?",
                id: 73453,
                created_utc: '1688003725.0',
                num_comments: 143,
                url: 'https://cathe.com/wp-content/uploads/2019/10/shutterstock_503061850.jpg',
                icon_url: 'https://b.thumbs.redditmedia.com/rmlXC779KUA2MTO4r_GJd2enqa8GKx3BOasymol6gLk.png',
                subreddit_name_prefixed: 'r/fitness',
                post_hint: "link",
                permalink: 'fitnessComments',
                subreddit: "home"
            }
        ]
    }
    else return Promise.resolve ([]);

})*/






const mockPost = {
    icon_url: 'subreddit_icon.jpg',
    subreddit_name_prefixed: 'r/reactjs',
    author: 'Rocklyn',
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


        await act(async () => {
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
        //console.log("Current State:", JSON.stringify(currentState, null, 2));

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
        const firstH1Content = (await screen.queryAllByTestId("subreddit-name")[0]).textContent;

        await act(async () => {
            mockStore.dispatch(setSelectedSubreddit("/r/home/"))
        })

        const updatedState = mockStore.getState();

        const updatedH1Content = (await screen.queryAllByTestId("subreddit-name")[0]).textContent;

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
        
        const input = screen.getByPlaceholderText('Search...');
        //verify that there are two rendered posts (two titles)
        const allRenderedPostTItles = screen.queryAllByTestId("title");
        expect(allRenderedPostTItles.length).toBe(2);
        const title1 = screen.getByText("King of All Exercises");
        const title2 = screen.getByText("Best Pianos in the World")
        
        expect(title1).toBeInTheDocument();
        expect(title2).toBeInTheDocument();

        //type into the search bar
        act(() => {
            userEvent.type(input, "best");
        })
       
        //verify that there is one post being rendered and title matches search input
        const updatedRenderedPostTitles = screen.queryAllByTestId('title');
        const remainingTitle = updatedRenderedPostTitles[0].textContent;
        expect(remainingTitle.toLowerCase()).toContain("best");
        expect(updatedRenderedPostTitles.length).toBe(1);

        //verify that first post is no longer in the document
        expect(title1).not.toBeInTheDocument();
        expect(title2).toBeInTheDocument();
        expect(title2.textContent.toLowerCase()).toContain("best")
        

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


        /*const currentState = mockStore.getState();
        const comments = currentState.reddit.posts[0].comments;
        expect(comments.length).toBeGreaterThan(0);*/
        const comment = await screen.queryAllByTestId("comment");
        expect(comment.length).toBeGreaterThan(0);




        const updatedState = mockStore.getState();
        const posts = updatedState.reddit.posts;

        await act(async () => {
            userEvent.click(commentButtonFirst)
        })



        const commentsAfterSecondClick = screen.queryAllByAltText("comment");
        expect(commentsAfterSecondClick.length).toBe(0);

    })
})



