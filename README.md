# TaxDome renewal price estimator

Static page: `index.html` (CSS and JS inline), `pricing.js` (pure logic), `config.js` (Switching Kit placeholder). No build step, no dependencies. The only external request is the cookieless GoatCounter visit counter (`data-goatcounter` in `index.html`).

## Run locally
```
python3 -m http.server 8000
# open http://localhost:8000/
```
ES modules need http://, opening index.html via file:// will not work in most browsers.

## Tests
```
node --test        # Node 22, no install needed
```

## Update prices
All prices are in the `PRICES` object at the top of `pricing.js`. Each entry has `value`, `source` (URL), `as_of` (ISO date) and `confidence` (`high|medium|low`). Change the value, source and date together, then run the tests (some expectations hard-code current prices and must be updated deliberately). The "How this is calculated" table on the page is generated from `PRICES`, so it updates itself; the prose in `index.html` (`buildStatic`) reads values from `PRICES` too. Document any new disagreement between sources in `SPEC.md`.

## Switching Kit
Edit `KIT` in `config.js`. While `available` is `false` the page shows "Coming soon". Set `available: true` and a real `checkoutUrl` only when the product exists.

## Deploy
Upload the folder contents (`index.html`, `pricing.js`, `config.js`) to any static host (Cloudflare Pages, Netlify, GitHub Pages, S3, plain nginx). Serve `.js` as `text/javascript`. Do not need `SPEC.md`, `README.md`, tests, `package.json` on the server. No server-side code, cookies or environment variables.
