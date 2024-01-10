import "@testing-library/jest-dom";
import { getTimeAgo } from "./Helpers";
import { cleanUrl } from "./Helpers";
import { checkMediaType } from "./Helpers";
import { getMediaContent } from "./Helpers";
import { extractSrcFromBodyHtml } from "./Helpers";
import { removeGifFromComment } from "./Helpers";


describe("tests getTimeAgo function & cleanUrl", () => {
    it("converts UTC to time ago", () => {


        const currentTimeInSeconds = Math.floor(new Date().getTime() / 1000);

        //One Minute Ago
        const oneMinuteInSeconds = 60;
        const oneMinuteAgoUtc = currentTimeInSeconds - oneMinuteInSeconds;

        //Five Minutes Ago
        const fiveMinutesAgoInSeconds = 5 * 60;
        const fiveMinutesAgoUtc = currentTimeInSeconds - fiveMinutesAgoInSeconds;

        //One Hour Ago
        const oneHourAgoInSeconds = 1 * 3600;
        const oneHourAgoUtc = currentTimeInSeconds - oneHourAgoInSeconds;

        //Five Hours Ago

        const fiveHoursAgoInSeconds = 5 * 3600;
        const fiveHoursAgoUtc = currentTimeInSeconds - fiveHoursAgoInSeconds;

        //One Day Ago

        const oneDayAgoInSeconds = 24 * 3600;
        const oneDayAgoUtc = currentTimeInSeconds - oneDayAgoInSeconds;

        //Five Days Ago

        const fiveDaysAgoInSeconds = 24 * 5 * 3600;
        const fiveDaysAgoUtc = currentTimeInSeconds - fiveDaysAgoInSeconds;

        expect(getTimeAgo(currentTimeInSeconds)).toBe("Just now")
        expect(getTimeAgo(oneMinuteAgoUtc)).toBe("1 minute ago")
        expect(getTimeAgo(fiveMinutesAgoUtc)).toBe("5 minutes ago")
        expect(getTimeAgo(oneHourAgoUtc)).toBe("1 hour ago")
        expect(getTimeAgo(fiveHoursAgoUtc)).toBe("5 hours ago")
        expect(getTimeAgo(oneDayAgoUtc)).toBe("1 day ago")
        expect(getTimeAgo(fiveDaysAgoUtc)).toBe("5 days ago")
    }),
        it("removes amp; from the URL", () => {
            const inputUrl = "https://example.com/page?param1=value1&amp;param2=value2&amp;v=video&amp;s=image";
            const newUrl = cleanUrl(inputUrl);
            expect(newUrl).toBe("https://example.com/page?param1=value1&param2=value2&v=video&s=image")
        });
});


describe("test checkMediaType and getMediaContent", () => {
    const linkPost = {
        post_hint: "link",
        is_self: false,
        thumbnail: "some.jpg",
        is_video: false,
        domain: "bbc.com or some other website",
        url: "url of some link",
        selftext: "",
    }

    const redditExternalLinkPost = {
        is_self: false,
        thumbnail: "some.jpg",
        is_video: false,
        domain: "reddit.com",
        url: "www.reddit.com/live/someid",
        selftext: ""
    }
    const imgPost = {
        domain: "i.redd.it",
        is_self: false,
        is_video: false,
        post_hint: "image",
        preview: { images: "images" },
        thumbnail: "image.jpg",
        is_video: false,
        url: "someUrl.jpeg",
        media: {
            oembed: {
                thumbnail_url: "someurl.jpg"
            }
        }
    }

    const imgPostWithText = {
        selftext: "Here is my image",
        post_hint: "image",
        is_self: "false",
        preview: { images: "images" },
        thumbnail: "someimage.jpg",
        is_video: false,
        domain: "i.redd.it",
        url: "something.jpeg"
    }
    const galleryPost = {
        is_gallery: true,
        thumbnail: "image.jpg",
        is_self: false,
        is_video: false,
        domain: "reddit.com",
        url: "reddit.com/gallery",
        selftext: "This is my gallery",
        "gallery_data": {
            "items": [
                {
                    "media_id": "8lpwzoxkkhbc1",
                    "id": 386746254
                },
                {
                    "media_id": "fh35un0lkhbc1",
                    "id": 386746255
                }
            ]
        },
        "media_metadata": {
            "fh35un0lkhbc1": {
                "status": "valid",
                "e": "Image",
                "m": "image/jpg",
                "o": [
                    {
                        "y": 4000,
                        "x": 3000,
                        "u": "https://preview.redd.it/fh35un0lkhbc1.jpg?width=1080&amp;blur=40&amp;format=pjpg&amp;auto=webp&amp;s=2847c19e9e7b6e995ee00909c26a77627088e22c"
                    }
                ],
                "p": [
                    {
                        "y": 144,
                        "x": 108,
                        "u": "https://preview.redd.it/fh35un0lkhbc1.jpg?width=108&amp;crop=smart&amp;auto=webp&amp;s=f25d361c881bf25e61b4d17c4f9ca5bb45a2b928"
                    },
                    {
                        "y": 288,
                        "x": 216,
                        "u": "https://preview.redd.it/fh35un0lkhbc1.jpg?width=216&amp;crop=smart&amp;auto=webp&amp;s=01f8ddaaa846d29de628979824c383f0104d94b7"
                    },
                    {
                        "y": 426,
                        "x": 320,
                        "u": "https://preview.redd.it/fh35un0lkhbc1.jpg?width=320&amp;crop=smart&amp;auto=webp&amp;s=0dc7d320e0f54220e0cd6cc24407d60644ab2b17"
                    },
                    {
                        "y": 853,
                        "x": 640,
                        "u": "https://preview.redd.it/fh35un0lkhbc1.jpg?width=640&amp;crop=smart&amp;auto=webp&amp;s=b8fc0671be416395834ac9d2bd8f1686ec81300f"
                    },
                    {
                        "y": 1280,
                        "x": 960,
                        "u": "https://preview.redd.it/fh35un0lkhbc1.jpg?width=960&amp;crop=smart&amp;auto=webp&amp;s=89f41862fca63f992ec31496f024531a55cfa715"
                    },
                    {
                        "y": 1440,
                        "x": 1080,
                        "u": "https://preview.redd.it/fh35un0lkhbc1.jpg?width=1080&amp;crop=smart&amp;auto=webp&amp;s=4144721f3007de3bfc4ec8f41224322951785daf"
                    }
                ],
                "s": {
                    "y": 4000,
                    "x": 3000,
                    "u": "https://preview.redd.it/fh35un0lkhbc1.jpg?width=3000&amp;format=pjpg&amp;auto=webp&amp;s=04c725336868a3ef0eb56f8b126f3134b39e4ac9"
                },
                "id": "fh35un0lkhbc1"
            },
            "8lpwzoxkkhbc1": {
                "status": "valid",
                "e": "Image",
                "m": "image/jpg",
                "o": [
                    {
                        "y": 4000,
                        "x": 3000,
                        "u": "https://preview.redd.it/8lpwzoxkkhbc1.jpg?width=1080&amp;blur=40&amp;format=pjpg&amp;auto=webp&amp;s=c81e65b37c0f632b49c65b459ff78e47a5af9607"
                    }
                ],
                "p": [
                    {
                        "y": 144,
                        "x": 108,
                        "u": "https://preview.redd.it/8lpwzoxkkhbc1.jpg?width=108&amp;crop=smart&amp;auto=webp&amp;s=61e4ed04d87abd57d89cef7322748a309440f54e"
                    },
                    {
                        "y": 288,
                        "x": 216,
                        "u": "https://preview.redd.it/8lpwzoxkkhbc1.jpg?width=216&amp;crop=smart&amp;auto=webp&amp;s=5ffba83c9e2bb3c619d257dd8e9e28c9e5f14ebe"
                    },
                    {
                        "y": 426,
                        "x": 320,
                        "u": "https://preview.redd.it/8lpwzoxkkhbc1.jpg?width=320&amp;crop=smart&amp;auto=webp&amp;s=ca8622b649f30772d54dda967849b9861633eef3"
                    },
                    {
                        "y": 853,
                        "x": 640,
                        "u": "https://preview.redd.it/8lpwzoxkkhbc1.jpg?width=640&amp;crop=smart&amp;auto=webp&amp;s=42c5afd96428e1e7a48a521a31210bb69898b54d"
                    },
                    {
                        "y": 1280,
                        "x": 960,
                        "u": "https://preview.redd.it/8lpwzoxkkhbc1.jpg?width=960&amp;crop=smart&amp;auto=webp&amp;s=3a58a2dbeb0627ccf3aeff61c87e8b8de0931409"
                    },
                    {
                        "y": 1440,
                        "x": 1080,
                        "u": "https://preview.redd.it/8lpwzoxkkhbc1.jpg?width=1080&amp;crop=smart&amp;auto=webp&amp;s=374d7b359ccf7a583f07f000805ef96580868463"
                    }
                ],
                "s": {
                    "y": 4000,
                    "x": 3000,
                    "u": "https://preview.redd.it/8lpwzoxkkhbc1.jpg?width=3000&amp;format=pjpg&amp;auto=webp&amp;s=d8fac7da1d509efb38acac238dc5173b2e513958"
                },
                "id": "8lpwzoxkkhbc1"
            }
        },
    }
    const videoPost = {
        is_video: true,
        post_hint: "hoisted:video",
        is_self: "false",
        thumbnail: "some link",
        domain: "v.redd.it",
        url: "someUrl",
        secure_media: {
            reddit_video: {
                fallback_url: "someURL"
            }
        }
    };
    const videoEmbed = {
        post_hint: "rich:video",
        domain: "youtube.com",
        url: "someurl"
    }
    const videoEmbed2 = {
        post_hint: "rich:video",
        domain: "clips.twitch.tv",
        is_self: "false",
        thumbnail: "some.jpg",
        is_video: false,
        domain: "youtu.be",
        url: "youtu.be.com/something",
        selftext: ""
    }

    const textPost = {
        selftext: "This is my post",
        is_self: true,
        thumbnail: "self",
        is_video: false,
        domain: "self.nameofsubreddit",
        url: "reddit.com/someurl",
    }

    const edgeCase1 = {
        selftext: "Who is this?",
        is_self: false,
        thumbnail: "default",
        is_video: false,
        domain: "tiktok.com",
        url: "tiktok.com/somepath",
    }
    it("tests checkMediaType", () => {


        expect(checkMediaType(linkPost)).toBe("link");
        expect(checkMediaType(imgPost)).toBe("img");
        expect(checkMediaType(imgPostWithText)).toBe("img");
        expect(checkMediaType(galleryPost)).toBe("gallery");
        expect(checkMediaType(videoPost)).toBe("video");
        expect(checkMediaType(videoEmbed)).toBe("videoEmbed");
        expect(checkMediaType(videoEmbed2)).toBe("videoEmbed");
        expect(checkMediaType(textPost)).toBe("text");
        expect(checkMediaType(edgeCase1)).toBe("link")
    })


    it("should return media content for img type", () => {
        const mediaContent = getMediaContent(imgPost);
        expect(mediaContent.type).toBe("img");
        expect(mediaContent.src).toBe("someurl.jpg")
    })
    it("should return media content for link type", () => {
        const mediaContent = getMediaContent(linkPost);
        expect(mediaContent.href).toBe("url of some link")
    })
    it("should return media content for gallery post", () => {
        const mediaContent = getMediaContent(galleryPost);

        expect(mediaContent.gallery_data).toStrictEqual(
            [
                {
                  src: 'https://preview.redd.it/8lpwzoxkkhbc1.jpg?width=1080&crop=smart&auto=webp&s=374d7b359ccf7a583f07f000805ef96580868463',
                  height: 1440,
                  width: 1080,
                  id: '8lpwzoxkkhbc1'
                },
                {
                  src: 'https://preview.redd.it/fh35un0lkhbc1.jpg?width=1080&crop=smart&auto=webp&s=4144721f3007de3bfc4ec8f41224322951785daf',
                  height: 1440,
                  width: 1080,
                  id: 'fh35un0lkhbc1'
                }
              ]
        )
    })
    it("should return media content for video post", () => {
        const mediaContent = getMediaContent(videoPost);
        expect(mediaContent.src).toBe("someURL");
    })
    it("should return media content for video embed post", () => {
        const mediaContent = getMediaContent(videoEmbed);
        expect(mediaContent.src).toBe("someurl")
    })
    it("should return media content for text post", () => {
        const mediaContent = getMediaContent(textPost);
        expect(mediaContent.selftext).toBe("This is my post")
    })
})

describe("tests extractSrcFromBodyHtml and removeGifFromComment", () => {

    const sampleComment = {
        body: "TIL the sun is fluffy.\n\n![gif](giphy|11RLLExX3prBsc)",
        body_html: "&lt;div class=\"md\"&gt;&lt;p&gt;TIL the sun is fluffy.&lt;/p&gt;\n\n&lt;p&gt;&lt;a href=\"https://giphy.com/gifs/11RLLExX3prBsc\" target=\"_blank\"&gt;&lt;img src=\"https://external-preview.redd.it/elWuWzJnafF9kVtezsO_Om7RPxSjeTC79bI_93I04G0.gif?width=200&amp;height=200&amp;s=e5026ffa369da4539290fe98f427f34a4f40b21b\" width=\"200\" height=\"200\"&gt;&lt;/a&gt;&lt;/p&gt;\n&lt;/div&gt;"
    }
    it("extracts the gif src from body html", () => {
        expect(extractSrcFromBodyHtml(sampleComment)).toBe(
            "https://external-preview.redd.it/elWuWzJnafF9kVtezsO_Om7RPxSjeTC79bI_93I04G0.gif?width=200&height=200&s=e5026ffa369da4539290fe98f427f34a4f40b21b")
    })
    it("removes gif from comment body", () => {
        expect(removeGifFromComment(sampleComment.body)).toBe("TIL the sun is fluffy.")
    })
})



