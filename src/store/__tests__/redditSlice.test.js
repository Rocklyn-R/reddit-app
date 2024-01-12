import "@testing-library/jest-dom";
import createMockStore from "../mockStore";
import { 
    setPosts, 
    startGetPosts, 
    getPostsSuccess, 
    getPostsFailed, 
    setSearchTerm,
    setSelectedSubreddit, 
    startGetComments, 
    getCommentsSuccess, 
    getCommentsFailed 
} from "../redditSlice";
import { fetchPosts, fetchComments, selectFilteredPosts } from "../redditSlice";
import * as redditAPI from "../../api/redditAPI";

describe(("reddit slice"), () => {
    let mockStore;
    beforeEach(() => {
        mockStore = createMockStore();
    })

    const mockPost = [
        {id: 1, showingComments: true, title: "First Post"},
        {id: 2, showingComments: false, title: "Second Post"}
    ]

    const mockComments = [
        {body: "This is a comment", id: 4},
        {body: "This is another comment", id: 5}
    ]

    it("should handle setPosts", () => {
        mockStore.dispatch(setPosts(["post1", "post2"]));
        const store = mockStore.getState();
        expect(store.reddit.posts).toEqual(["post1", "post2"])
    })

    it("should handle startGetPosts", () => {
        mockStore.dispatch(startGetPosts());
        const store = mockStore.getState();
        expect(store.reddit.isLoading).toBe(true);
        expect(store.reddit.error).toBe(false);
    })

    it("should handle getPostsSuccess", () => {
        mockStore.dispatch(getPostsSuccess(["post1", "post2"]));
        const store = mockStore.getState();
        expect(store.reddit.posts).toEqual(["post1", "post2"]);
        expect(store.reddit.error).toBe(false);
        expect(store.reddit.isLoading).toBe(false);
    })

    it("should handle getPostsFailed", () => {
        mockStore.dispatch(getPostsFailed());
        const store = mockStore.getState();
        expect(store.reddit.posts).toEqual([]);
        expect(store.reddit.error).toBe(true);
        expect(store.reddit.isLoading).toBe(false);
    })

    it("should handle setSearchTerm", () => {
        mockStore.dispatch(setSearchTerm("test"));
        const store = mockStore.getState();
        expect(store.reddit.searchTerm).toEqual("test");
    })

    it("should handle setSelectedSubreddit", () => {
        mockStore.dispatch(setSelectedSubreddit("/r/home/"));
        const store = mockStore.getState();
        expect(store.reddit.selectedSubreddit).toEqual("/r/home/");
    })

    it("should handle startGetComments", () => {
     
        mockStore.dispatch(setPosts(mockPost));
        mockStore.dispatch(startGetComments(1));
        const post = mockStore.getState().reddit.posts[1];
        expect(post.loadingComments).toBe(true);
        expect(post.errorComments).toBe(false);
    })

    it("should handle getCommentsSuccess", () => {

        mockStore.dispatch(setPosts(mockPost));
        mockStore.dispatch(getCommentsSuccess({index: 1, comments: mockComments}));
        const post = mockStore.getState().reddit.posts[1];
        expect(post.loadingComments).toBe(false);
        expect(post.errorComments).toBe(false);
        expect(post.comments).toBe(mockComments);
    })

    it("should handle getCommentsFailed", () => {
        mockStore.dispatch(setPosts(mockPost));
        mockStore.dispatch(getCommentsFailed(1));

        const post = mockStore.getState().reddit.posts[1];
        expect(post.loadingComments).toBe(false);
        expect(post.errorComments).toBe(true);
    })

    it("should handle fetchPosts", async () => {

        const newMockPost = [
            {id: 5, body: "This is a post"},
            {id: 6, body: "This is another post"}
        ]
        redditAPI.getSubredditPosts = jest.fn().mockResolvedValue(newMockPost);
        await mockStore.dispatch(fetchPosts());
        const post = mockStore.getState().reddit.posts[0];
        expect(post.showingComments).toBe(false);
        expect(post.comments).toEqual([]);
        expect(post.loadingComments).toBe(false);
    })

    it("should handle error in fetchPosts", async () => {
        redditAPI.getSubredditPosts = jest.fn(() => Promise.reject(error));
        await mockStore.dispatch(fetchPosts());
        const state = mockStore.getState();
        expect(state.reddit.error).toBe(true);
    })

    it("should handle fetchComments", async () => {
        redditAPI.getPostComments = jest.fn().mockResolvedValue(mockComments);
        mockStore.dispatch(setPosts(mockPost));
        await mockStore.dispatch(fetchComments(1));
        const post = mockStore.getState().reddit.posts[1];
        expect(post.comments).toEqual(mockComments);
        expect(post.showingComments).toBe(true);
        expect(post.loadingComments).toBe(false);
        expect(post.errorComments).toBe(false);
    })

    it("should handle error fetchComments", async () => {
        redditAPI.getPostComments = jest.fn(() => Promise.reject(error));
        mockStore.dispatch(setPosts(mockPost));
        await mockStore.dispatch(fetchComments(1));
        const post = mockStore.getState().reddit.posts[1];
        expect(post.loadingComments).toBe(false);
        expect(post.errorComments).toBe(true)
    })

    it("should check that selectFiltered posts returns all posts when searchTerm is empty", () => {
        mockStore.dispatch(setPosts(mockPost));
        const posts = mockStore.getState().reddit.posts;
        const searchTerm = mockStore.getState().reddit.searchTerm;
        const selected = selectFilteredPosts.resultFunc(posts, searchTerm);
        expect(selected).toEqual(posts);
    })

    it("should filter posts by searchTerm", () => {
        mockStore.dispatch(setPosts(mockPost));
        const posts = mockStore.getState().reddit.posts;
        mockStore.dispatch(setSearchTerm("second"));
        const searchTerm = mockStore.getState().reddit.searchTerm;
        const selected = selectFilteredPosts.resultFunc(posts, searchTerm);
        expect(selected).toEqual([posts[1]]);
    })
})