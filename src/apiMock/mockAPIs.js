



export const mockGetSubredditPosts = (subreddit) => {

    //console.log(`mock function is called with subreddit: ${subreddit}`)
    if (subreddit === "/r/pics/") {
        return [
            {
                author: 'Nikola',
                title: "King of All Exercises",
                id: 63534,
                created_utc: '1687968271.0',
                num_comments: 25,
                url: "https://www.muscleandfitness.com/wp-content/uploads/2019/02/ronnie-coleman-squat-barbell-1109.jpg?quality=86&strip=all",
                icon_url: 'https://b.thumbs.redditmedia.com/rmlXC779KUA2MTO4r_GJd2enqa8GKx3BOasymol6gLk.png',
                subreddit_name_prefixed: 'r/pics',
                post_hint: 'link',
                permalink: 'picsComments',
                userIcons: [
                    {
                        img_icon: "",
                        snoovatar: ""
                    }
                ],
                subreddit: "pics",
                selftext: ""
            },
            {
                author: 'Frane',
                title: "Best Pianos in the World",
                id: 3333, created_utc: '1688007134.0',
                num_comments: 58,
                url: "https://cdn.regent.edu/wp-content/uploads/2022/03/steinway-sons-showcases-piano-spirior-regent-university-1760x990.png",
                icon_url: 'https://b.thumbs.redditmedia.com/rmlXC779KUA2MTO4r_GJd2enqa8GKx3BOasymol6gLk.png',
                subreddit_name_prefixed: 'r/pics',
                post_hint: "link",
                permalink: "picsComments",
                userIcons: [
                    {
                        img_icon: "",
                        snoovatar: ""
                    }
                ],
                selftext: ""
            }
        ]

    }

    else if (subreddit === "/r/Home/") {
        return [
            {
                author: 'Rocklyn',
                title: "Do You Even Lift?",
                id: 73453,
                created_utc: '1688003725.0',
                num_comments: 143,
                url: 'https://cathe.com/wp-content/uploads/2019/10/shutterstock_503061850.jpg',
                icon_url: 'https://b.thumbs.redditmedia.com/rmlXC779KUA2MTO4r_GJd2enqa8GKx3BOasymol6gLk.png',
                subreddit_name_prefixed: 'r/home',
                post_hint: "link",
                permalink: 'homeComments',
                subreddit: "home",
                userIcons: [
                    {
                        img_icon: "",
                        snoovatar: ""
                    }
                ],
                selftext: ""
            },
            {
                author: 'Rocklyn',
                title: "Taylor Swift Eras Tour",
                id: 4453,
                created_utc: '1687980584.0',
                num_comments: 42,
                url: "https://imagesvc.meredithcorp.io/v3/mm/image?url=https%3A%2F%2Fstatic.onecms.io%2Fwp-content%2Fuploads%2Fsites%2F6%2F2023%2F03%2F18%2Ftaylor-swift-031823-01-2000.jpg&q=60",
                icon_url: 'https://b.thumbs.redditmedia.com/rmlXC779KUA2MTO4r_GJd2enqa8GKx3BOasymol6gLk.png',
                subreddit_name_prefixed: 'r/music',
                post_hint: "link",
                permalink: "musicComments",
                userIcons: [
                    {
                        img_icon: "",
                        snoovatar: ""
                    }
                ],
                selftext: ""
            }
        ]
    }
    else return ([]);

};


export const mockGetComments = (permalink) => {
    if (permalink === "picsComments") {
        return [
            {
                author: 'Marena',
                created_utc: '1688003725.0',
                body: 'Omg what a great post I love this',
                id: 19129,
                score: 5
            },
            {
                author: 'Antica',
                created_utc: '1688003725.0',
                body: 'Cutest pets ever!',
                id: 13141,
                score: 3
            }
        ]
    }

    else if (permalink === "homeComments") {
        return [
            {
                author: 'Frane',
                created_utc: '1688003725.0',
                body: 'Keep lifting!',
                id: 1523
            },
            {
                author: 'Boris',
                created_utc: '1688003725.0',
                body: 'Ma samo veslanje',
                id: 183433
            }
        ]
    }

    else return ([])
}

export const mockGetSubreddits = () => {
    return ([
        {
            display_name: "Home",
            icon_img: "",
            url: "/r/home/",
            id: 1234
        },
        {
            display_name: "pics",
            icon_img: "",
            url: "/r/pics/",
            id: 123
        },
        {
            display_name: "LivestreamFail",
            icon_img: "",
            url: "/r/livestreamfail/",
            id: 12134
        },
        {
            display_name: "AskReddit",
            icon_img: "",
            url: "/r/askreddit/",
            id: 1213
        }

    ])
}



/*const posts = [
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
]*/
