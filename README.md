# huu's personal website

Downloaded all of the assets of my [old Weebly website](https://huuishuu.weebly.com/) and uploaded it here, now hosting via GitHub pages.
The website is currently a mess but something I'm hopefully working on fixing long-term and use as a platform to learn HTML properly.

Open Sans fonts and the RSS icon are served from `files/` so the theme does not depend on Weebly's CDN. The font license is included in `files/fonts/Open_Sans/OFL.txt`.

Visitors can switch between light and dark mode with the Dark mode button beside the site title. The dark background is `#181a1b`. Shared styles live in `files/dark_mode.css`; `files/theme.js` saves the choice in browser local storage and applies it before the page renders. Light mode remains the default, and the toggle works for the current page when storage is unavailable.

The static site uses `files/navigation.js` for its dropdown menus. Legacy account, store, cookie, analytics, and template scripts have been removed. The original theme class names remain to preserve the design. Download icons are served locally from `files/download-file.png`.

Social metadata, the RSS feed, and `sitemap.xml` use `https://huuishuu.github.io/personal-website/`. Update these addresses and `robots.txt` together if the public site address changes. Historical text and links without a matching local page are preserved, including the About disclosure. Existing RSS item GUIDs also remain unchanged so feed readers retain item identities.

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

To preview the current pages locally, run `python3 -m http.server 8000` from the repository root and open `http://localhost:8000/`. Python's basic server does not serve the custom 404 page, so old-address redirects should be checked on GitHub Pages or a server configured with that error page.
