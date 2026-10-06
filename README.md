# huu's personal website

Downloaded all of the assets of my [old Weebly website](https://huuishuu.weebly.com/) and uploaded it here, now hosting via GitHub pages.
The website is currently a mess but something I'm hopefully working on fixing long-term and use as a platform to learn HTML properly.

# What is this?

As described in the "About" page of the website, this website is really just a sandbox of mine that I maintained since 2014. Originally meant for an Open Hexagon level pack, I eventually expanded its scope to host things like all of my osu! skins, removed osu! beatmaps and the like. Eventually ended up hosting two abandonware games that have since made their way onto archive.org - those being Hexis & Safari Biathlon Racer.

I wanted to archive this in some way so that I wouldn't end up losing 12+ years worth of stuff, considering that Weebly is more than likely going to be shutting down at some point in the near future.

# Contributions

I welcome any and all contributions that aim to help me fix this old thing in terms of functionality and stability. I don't think I'll be bothering adding anything new to it going forward, as those days of mine where I was actively archiving and going out of my way to look for niche, bizarre, lost stuff, as well as publicize my own things are long since past me.

# Disclosure and policy regarding AI

While I am incredibly against generative AI and LLMs, a large portion of the early refactoring of the website & fixing things like broken styling, website cleanup (such as removing all Weebly branding) was done in assistance using a LLM.

My goal, at the current time, is to refactor everything and make it easy for me to maintain in the future, so LLMs will be used to assist with that.

That being said, any issues/pull requests assisted by an LLM (be it Claude, Gemini, ChatGPT or whatever else you use) will likely be closed without comment, as eventually I want to use this as a platform to learn HTML & CSS myself, not by regurgitating whatever AI spits out at me.

# Fonts
Open Sans fonts and the RSS icon are served from `files/` so the theme does not depend on Weebly's CDN. The font license is included in `files/fonts/Open_Sans/OFL.txt`.

# Native dark mode
Visitors can switch between light and dark mode with the Dark mode button beside the site title. The dark background is `#181a1b`. Shared styles live in `files/dark_mode.css`; `files/theme.js` saves the choice in browser local storage and applies it before the page renders. Light mode remains the default, and the toggle works for the current page when storage is unavailable.

# Navigation and structure
The static site uses `files/navigation.js` for its dropdown menus. Legacy account, store, cookie, analytics, and template scripts have been removed. The original theme class names remain to preserve the design. Download icons are served locally from `files/download-file.png`.

Each page lives in its own folder with an `index.html`, for example `about/index.html`. Blog posts and update posts follow the same layout inside `personal-blog/` and `website-updates/`; older update listings live in `website-updates/previous/<number>/index.html`. The homepage stays at the root as `index.html`.

The Archives dropdown follows the folder hierarchy in `Archives/`:

```text
Archives/
├── Abandonware/
│   ├── hexis/ (including troubleshooting-issues/)
│   └── safari-biathlon-racer/
├── osu-stuff/
│   ├── Beatmaps/
│   │   ├── removed-ranked-maps/
│   │   ├── deleted-osu-maps/
│   │   └── huus-mapping-stuff/ (including its map categories)
│   └── Skins/
│       ├── huus-osu-skins/ (including skin year folders)
│       └── other-skins/
├── Open-Hexagon-level-packs/
│   └── huus-open-hexagon-packs/ (including older-versions/)
└── Music/
    ├── ongaku-shoujo/ (with releases under 2012-2013/, 2014/, and 2015/)
    └── halozy/ (including h--heart-and-beat-technology/)
```

Folders that represent pages contain an `index.html`; category folders group their child pages.

Links and asset references use relative paths so the site works both at a domain root and under a GitHub Pages project path. Shared assets remain in `files/`, `uploads/`, and `cdn-cgi/`.

GitHub Pages uses the root `404.html` to redirect known former `.html` addresses and earlier page-folder addresses to their new locations, preserving query strings and anchors. These compatibility redirects require JavaScript; other static hosts must be configured to serve `404.html` for missing URLs. When moving another page, update its incoming links and the address mappings in `404.html`.

# Favicon
The site favicon is `favicon.ico`, generated from `2.png` with 16, 32, and 48 pixel versions. Each content page links to it using a relative path. The custom 404 page uses the published GitHub Pages URL because it can be served at missing URLs at any folder depth.

# Running this locally
To preview the current pages locally, run `python3 -m http.server 8000` from the repository root and open `http://localhost:8000/`. Python's basic server does not serve the custom 404 page, so old-address redirects should be checked on GitHub Pages or a server configured with that error page.
