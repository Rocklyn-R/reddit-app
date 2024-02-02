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
    getCommentsFailed,
    setPostScore,
    setCommentScore,
    setReplyScore
} from "../redditSlice";
import { fetchPosts, fetchComments, selectFilteredPosts, flattenReplies } from "../redditSlice";
import * as redditAPI from "../../api/redditAPI";

describe(("reddit slice"), () => {
    let mockStore;
    beforeEach(() => {
        mockStore = createMockStore();
    })

    const mockPost = [
        { id: 1, showingComments: true, title: "First Post", selftext: "", score: 5 },
        { id: 2, showingComments: false, title: "Second Post", selftext: "", score: 3 }
    ]

    const mockComments = [
        {
            body: "This is a comment",
            id: 4,
        },
        {
            body: "This is another comment",
            id: 5,
        }
    ]

    const mockUserIcons = [{
        img_icon: "",
        snoovatar: ""
    }]

 const mockPostWithCommentsAndReplies = [
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
        mockStore.dispatch(getCommentsSuccess({ index: 1, comments: mockComments }));
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

    it("should handle setPostScore", () => {
        mockStore.dispatch(setPosts(mockPost));
        mockStore.dispatch(setPostScore({index: 1, score: 4}))
        const post = mockStore.getState().reddit.posts[1]
        expect(post.score).toBe(4);
    })

    it("should handle setCommentScore", () => {
        mockStore.dispatch(setPosts(mockPostWithCommentsAndReplies));
        mockStore.dispatch(setCommentScore({ postIndex: 0, commentIndex: 0, score: 19}));
        const comment = mockStore.getState().reddit.posts[0].comments[0];
        expect(comment.score).toBe(19);
    })

    it("should handle setReplyScore", () => {
        mockStore.dispatch(setPosts(mockPostWithCommentsAndReplies));
        mockStore.dispatch(setReplyScore({ postIndex: 0, replyId: 1423, score: 11 }));
        const reply = mockStore.getState().reddit.posts[0].comments[0].replies[0];
        expect(reply.score).toBe(11);
    })

    it("should handle fetchPosts", async () => {

        const newMockPost = [
            { id: 5, body: "This is a post" },
            { id: 6, body: "This is another post" }
        ]

        const mockUserIcons = {
            user_img: "someimage",
            snoovatar: "somesnoovatar"
        }
        redditAPI.getSubredditPosts = jest.fn().mockResolvedValue(newMockPost);
        redditAPI.getUserIcons = jest.fn().mockResolvedValue(mockUserIcons)
        await mockStore.dispatch(fetchPosts());
        const post = mockStore.getState().reddit.posts[0];
        expect(post.showingComments).toBe(false);
        expect(post.comments).toEqual([]);
        expect(post.loadingComments).toBe(false);
        expect(post.userIcons).toEqual([mockUserIcons]);
        
    })

    it("should handle error in fetchPosts", async () => {
        redditAPI.getSubredditPosts = jest.fn(() => Promise.reject(error));
        await mockStore.dispatch(fetchPosts());
        const state = mockStore.getState();
        expect(state.reddit.error).toBe(true);
    })

    it("should handle fetchComments", async () => {
        redditAPI.getPostComments = jest.fn().mockResolvedValue(mockComments);
        redditAPI.getUserIcons = jest.fn().mockResolvedValue(mockUserIcons);
        mockStore.dispatch(setPosts(mockPost));
        await mockStore.dispatch(fetchComments(1));
        const post = mockStore.getState().reddit.posts[1];
        const expectedComments = [
            {
                body: "This is a comment",
                id: 4,
                replies: [],
                userIcons: [[{
                    img_icon: "",
                    snoovatar: ""
                }]]
            },
            {
                body: "This is another comment",
                id: 5,
                replies: [],
                userIcons: [[{
                    img_icon: "",
                    snoovatar: ""
                }]]
            }
        ]
        expect(post.comments).toEqual(expectedComments);
        expect(post.showingComments).toBe(true);
        expect(post.loadingComments).toBe(false);
        expect(post.errorComments).toBe(false);
    })

    it("should handle error fetchComments", async () => {
        redditAPI.getPostComments = jest.fn(() => Promise.reject());
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
describe("flatten replies", () => {
    it("should flatten the reply data structure for all nested replies", () => {
        const replies = {
            "kind": "Listing",
            "data": {
                "after": null,
                "dist": null,
                "modhash": "nkzu5kx8ribb74c0879ccaa63728d19a9f1d3e6abe5aec731d",
                "geo_filter": "",
                "children": [
                    {
                        "kind": "t1",
                        "data": {
                            replies: {
                                "kind": "Listing",
                                "data": {
                                    "after": null,
                                    "dist": null,
                                    "modhash": "nkzu5kx8ribb74c0879ccaa63728d19a9f1d3e6abe5aec731d",
                                    "geo_filter": "",
                                    "children": [
                                        {
                                            "kind": "t1",
                                            "data": {
                                                replies: {
                                                    "kind": "Listing",
                                                    "data": {
                                                        "after": null,
                                                        "dist": null,
                                                        "modhash": "nkzu5kx8ribb74c0879ccaa63728d19a9f1d3e6abe5aec731d",
                                                        "geo_filter": "",
                                                        "children": [
                                                            {
                                                                "kind": "t1",
                                                                "data": {
                                                                    "replies": ""
                                                                }
                                                            }
                                                        ]
                                                    }
                                                }
                                            }
                                        }
                                    ]
                                }
                            }
                        }
                    }
                ]
            }
        }

        const expectedReplies = [
            {
                replies: [
                    {
                        replies: [
                            {
                                replies: ""
                            }
                        ]
                    }
                ]
            }
        ]
        
        const outputReplies = flattenReplies(replies);
        expect(outputReplies).toStrictEqual(expectedReplies)
    })
})