# IP Address Tracker

My solution to the [IP Address Tracker](https://www.frontendmentor.io/challenges/ip-address-tracker-I8-0yYAH0)
challenge on Frontend Mentor.

![](./screenshot.webp)

- Live: https://ip-address-tracker.abdelrhman-ahmed8881.workers.dev
- Code: https://github.com/MrBlackvanta/ip-address-tracker

## Built with

- Next.js 16, App Router, static export
- React 19 and TypeScript
- Tailwind CSS v4
- Leaflet, with OpenStreetMap tiles
- A Cloudflare Worker on the same origin, for the lookup API

## Notes

### The Worker, and why the API key never reaches the browser

The lookup runs in a Worker that serves the export and `/api/*` from one origin (`main` plus
`run_worker_first`). Two reasons. geo.ipify's key is a Worker secret, so it is never in the
bundle — the whole export contains no reference to ipify at all. And the free tier is 1,000
requests a month, which a page that geolocates every visitor on load would burn through in days.

So a bare page load never calls ipify. Cloudflare already knows where the request came from:
`request.cf` carries city, region, postal code, timezone and AS organisation, at no cost and
against no quota. ipify is called only when someone types a query, and identical queries come
back from `caches.default` — measured at 424ms cold and 12ms warm. Input is validated in the
Worker before anything is forwarded, so an invalid query costs nothing either.

Two things about ipify worth writing down:

- **It answers `400` for a domain it cannot resolve**, not 404 or 422. So `403` and `5xx` map to a
  502 "the lookup service didn't respond", and any other failure maps to a 404 "we couldn't locate
  that". 403 is kept out of the not-found branch deliberately: a dead API key must never present
  itself as an ordinary miss.
- The `console.error` on the upstream status stays in. It is the only way to tell those two cases
  apart in production, and it is what found the 400 in the first place.

### Where the data disagrees with the design

The design reads `Brooklyn, NY 10001`. This reads `Cairo, Cairo Governorate`.

Neither source returns a state code. ipify returns full region names, and so does `request.cf`.
`cf.regionCode` does exist, but ipify has no equivalent, so using it would make the two paths
disagree with **each other** — a worse failure than disagreeing with the design, because it would
depend on which branch answered. `postalCode` is frequently an empty string for the same reason,
so the value cell holds a `min-h-6` floor and an absent postcode doesn't change the card's height.

### Map tiles

The design's basemap is a Google-Maps-style light street map. CARTO Voyager matched it closely and
was the original choice, but CARTO now stamps **"API KEY REQUIRED"** diagonally across every tile
served without a key — while still returning `HTTP 200` with a real map underneath, so it is
invisible to a status check and only shows in the pixels.

Compared the keyless options at the same tile: Esri's World Street Map is a warm tan with brown
roads, and its Light Gray Canvas is nearly featureless. OpenStreetMap's standard tiles are the
closest to the design — light base, green parks, blue water, yellow arterials.

The cost is that OSM serves no `@2x` tiles, so Leaflet's `{r}` placeholder is gone and tiles are
256px, marginally soft on a 2x display. No keyless provider offers retina. Its `maxZoom` is 19.

Leaflet itself is dynamically imported: its 148KB of JS and 10.5KB of CSS land in lazy chunks that
`index.html` never references. One trap that came with it — **Leaflet injects its stylesheet
unlayered, and unlayered CSS beats anything in Tailwind's `@layer utilities` regardless of
specificity.** Overrides for it therefore sit at the top level of `globals.css` rather than in an
`@utility`, where they would compile and then silently lose.

### Centring the map under the card

Centring the map on its own container hides the pin behind the details card on any viewport
shorter than 734px — an iPhone SE, among others. The view centre is instead shifted by half the
card's overlap, in projected EPSG3857 space, so the pin sits in the part of the map you can
actually see. At 375 that lands the pin tip at y=645 against the design's 644.

### Colour and contrast

- The signature sits on an **opaque** white pill rather than the translucent one used elsewhere in
  this repo. `#767676` needs a background of at least `#FEFEFE` to clear 4.5:1, so any
  transparency over map tiles fails — and the map can be centred anywhere, so there is no backdrop
  to reason about.
- The `h1` measures **3.76:1**, taken against the lightest pixel underneath it by compositing the
  real header pattern over the light end of the gradient. It is bold at 26px, so its threshold is
  3:1.
- **The in-flight state no longer dims the card.** It used to drop to 60% opacity while a lookup
  was running, which composites `#767676` to `#adadad` — 2.24:1, measured. There is no opacity
  that both reads as dimmed and passes, because `#767676` is already only 4.54:1 at full strength,
  so any value below 1 fails. Since the page begins a lookup on load, that was the state a page
  was in when it was first painted, not an edge case. `aria-busy` still carries it for assistive
  tech.
- **Leaflet's attribution links are underlined back.** Leaflet sets `text-decoration: none` on
  them and restores the underline only on hover and focus, which leaves colour as the sole
  indicator and fails WCAG 1.4.1.

Both of those were found by running axe — the engine Lighthouse embeds — against the production
build at Lighthouse's own two viewports. It now reports no violations at either.

### Shadows

Three drop shadows come from the design file: the details card and the search field share
`0 50px 50px -25px`, and the header band carries `0 2px 20px`. They are easy to miss, because the
`.fig` reader prints fills and strokes but not effects — the data is in the file, it just isn't in
a first pass over it.

The header band's shadow additionally needs `z-10` on the `<header>`. It and `<main>` are both
positioned, so by default the map paints over the header and the shadow is invisible.

### Running it

Two processes in development: `pnpm dev` for Next, and `pnpm dev:api` for the Worker, with
`/api/*` rewritten to it. To exercise the real thing, `pnpm build` then `pnpm dev:api` serves the
actual export through the actual Worker — every measurement quoted above was taken that way, not
against the dev server.

`pnpm typecheck:worker` type-checks `worker/` on its own config; Next's would give it the wrong
`lib` and `paths`. The deployed Worker needs `IPIFY_API_KEY` set as a secret before search works;
without it, page loads still resolve visitors through `request.cf`.

## Author

- [LinkedIn](https://www.linkedin.com/in/abdelrhman-vanta/)
- [UpWork](https://www.upwork.com/freelancers/mrblackvanta)
- [Frontend Mentor](https://www.frontendmentor.io/profile/MrBlackvanta)
