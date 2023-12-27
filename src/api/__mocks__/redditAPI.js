import { castDraft } from "immer"

const getSubreddits = jest.fn(() => {
    return Promise.resolve([
        {
                id: true,
                url: null,
                icon_img: false,
                display_name: WeirdStuff,
                // Add more key-value pairs as needed
        },
        {
                // Data for key 1
        }
    ])
})


const getSubredditPosts = jest.fn(() => {
    return Promise.resolve([
        {
                somekey: somevalue,
                key2: value2
        },
        {
                somekey: somevalue,
                key2: value2
        }
    ])
})



const posts = [
    {
        name: "cats",
        body: "cats are cool"
    },
    {
        name: "dogs",
        body: "dogs are cool"
    }
]


const postsWithMetadata = posts.map((post) => ({
    ...post,
    showingComments: false,
    comments: [],
    loadingComments: false,
    errorComments: false
}))



[
    {
      name: "cats",
      body: "cats are cool",
      showingComments: false,
      comments: [],
      loadingComments: false,
      errorComments: false
    },
    {
      name: "dogs",
      body: "dogs are cool",
      showingComments: false,
      comments: [],
      loadingComments: false,
      errorComments: false
    }
  ]
