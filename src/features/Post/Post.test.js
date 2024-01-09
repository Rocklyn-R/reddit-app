import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { act } from "react-dom/test-utils";
import { Post } from "./Post";
import createMockStore from "../../store/mockStore";
import { Provider } from "react-redux";
import { getCommentsSuccess, setPosts, startGetComments } from "../../store/redditSlice";
import { Home } from "../Home/Home";



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
    permalink: '/r/popular',
};

const mockComments = [
    {
        author: "Antica",
        created_utc: "",
        body: "Singing!",
        id: 123
    },
    {
        author: "Rocklyn",
        create_utc: "",
        body: "Gym is life",
        id: 1234
    }
]

const defaultMockMediaContent = {
        type: "img",
        src: "image1.jpg"
};

const mockOnToggleComments = jest.fn();

const mockStore = createMockStore();

const renderPostWithMediaContent = (mockPost, mockMediaContent) => {
    render(
        <Provider store={mockStore}>
            <Post
                post={mockPost}
                onToggleComments={mockOnToggleComments}
                mediaContent={mockMediaContent}
            />
        </Provider>
    );
};

describe("Correct media rendering", () => {

    it("renders an image with correct src when mediaContent.type is img", () => {
        const mockMediaContent = {
            type: "img",
            src: "image1.jpg"
        };

        renderPostWithMediaContent(mockPost, mockMediaContent)

        const image = screen.getByAltText("Post");
        expect(image.src).toContain(mockMediaContent.src);
    });

    it("renders a video with correct src when mediaContent.type is video", () => {
        const mockMediaContent = {
            type: "video",
            src: "video1.mp4"
        };

        renderPostWithMediaContent(mockPost, mockMediaContent);

        const videoSource = screen.getByLabelText("Video Player").querySelector("source");
        expect(videoSource.src).toContain(mockMediaContent.src);
    })

    it("renders a link with correct href when mediaContent.type is link", () => {
        const mockMediaContent = {
            type: "link",
            href: "www.link.com"
        }

        renderPostWithMediaContent(mockPost, mockMediaContent);

        const link = screen.getByLabelText("External Link");
        expect(link.href).toContain(mockMediaContent.href);
    })

    it("renders a text post in Markdown View when mediaContent.type is text", () => {
        const mockMediaContent = {
            type: "text",
            selftext: "This is a post"
        }

        renderPostWithMediaContent(mockPost, mockMediaContent);

        const renderedText = screen.getByText("This is a post");
        expect(renderedText).toBeInTheDocument();

    })

    it("renders an embedded video when mediaContent.type is videoembed", async () => {
        const mockMediaContent = {
            type: "videoEmbed",
            src: "video1.mp4"
        }

        await act(async () => {
            renderPostWithMediaContent(mockPost, mockMediaContent);
        })
        


        waitFor(() => {

            const videoContainer = screen.getByTestId("embedded-video");
            const reactPlayer = videoContainer.querySelector(".react-player");

            expect(reactPlayer).toBeInTheDocument();

            expect(reactPlayer.getAttribute("url")).toContain(mockMediaContent.src);

        })

    })
    it("renders a gallery component when mediaContent.type is gallery", async () => {
        const mockMediaContent = {
            type: "gallery",
            gallery_data: [
                {src: 'image1.jpg'},
                {src: 'image2.jpg'},
                {src: 'image3.jpg'}
            ]
        }

        renderPostWithMediaContent(mockPost, mockMediaContent);  
        
        waitFor(() => {
            const galleryElement = screen.getByTestId("gallery-component");
            expect(galleryElement).toBeInTheDocument();
        })
        
    })
})

describe("Correct rendering of comments and loading state", () => {
    it("renders comment button & clicking it calls function with correct permalink", async () => {

        renderPostWithMediaContent(mockPost, defaultMockMediaContent)
        const button = screen.getByRole('button', { name: /Comments/i});
        expect(button).toBeInTheDocument();
        act(() => {
            userEvent.click(button);
        })
        expect(mockOnToggleComments).toHaveBeenCalledWith(mockPost.permalink);
    });

    it("does not render the loading state when loadingComments is false", () => {
        
        renderPostWithMediaContent(mockPost, defaultMockMediaContent);

        const loadingState = screen.queryByTestId("loading-state");

        expect(loadingState).toBe(null);
    })

    it("renders the loading state when loadingComments is true", () => {

        const modifiedMockPost = {
            ...mockPost,
            loadingComments: true
        }

        renderPostWithMediaContent(modifiedMockPost, defaultMockMediaContent);

        
        //This will return an array of elements with the testId
        const loadingState = screen.queryAllByTestId("loading-state");
        
        //We expect 5 instances of the CommentLoading component. 
        expect(loadingState.length).toBe(5);
    });

    it("renders the comments when showingComments is true", () => {

        const modifiedMockPost = {
            ...mockPost,
            showingComments: true
        }

        renderPostWithMediaContent(modifiedMockPost, defaultMockMediaContent);

        const comment = screen.queryAllByTestId("comment");
        expect(comment.length).toBe(2);
    });

    it("renders loading State when startGetComments is dispatched", async () => {
        
        
        act(() => {
            mockStore.dispatch(setPosts([mockPost]));
            })

        //first startGetComments turns both loadingComments and showingComments to true
       act(() => {
            mockStore.dispatch(startGetComments(0));
        })
        
        //second call toggles showingComments back to false while loadingComments is true
        act(() => {
            mockStore.dispatch(startGetComments(0));
        })

        const currentState = mockStore.getState();
        const posts = currentState.reddit.posts

        act(() => {
            render(
             <Provider store={mockStore}>
                 <Post 
                    post={posts[0]}
                    onToggleComments={() => {}}
                     mediaContent={defaultMockMediaContent}
                 />
             </Provider>
            )
         })
   
            
        /*const currentState1 = mockStore.getState();
        console.log("Current State:", JSON.stringify(currentState1, null, 2));*/


        //5 loading skeletons are visible 
        const loadingState = screen.queryAllByTestId("loading-state");
        expect(loadingState.length).toBe(5);

    });

    it("renders the comments when startGetComments and getCommentsSuccess are called", () => {
        
        act(() => {
            mockStore.dispatch(setPosts([mockPost]));
            })

        //first startGetComments turns both loadingComments and showingComments to true
       act(() => {
            mockStore.dispatch(startGetComments(0));
        })
        
        //second call toggles showingComments back to false while loadingComments is true
        act(() => {
            mockStore.dispatch(getCommentsSuccess({index: 0, comments: mockComments}))
        })

        const currentState = mockStore.getState();
        const posts = currentState.reddit.posts

        render( 
            <Provider store={mockStore}>
                <Post 
                    post={posts[0]}
                    onToggleComments={() => {}}
                    mediaContent={defaultMockMediaContent}
                />
            </Provider>
        )
        
        const newCommentText = screen.getByText("Gym is life");
        expect(newCommentText).toBeInTheDocument();

    })
})
