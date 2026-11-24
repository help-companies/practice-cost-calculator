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
All prices are in the `PRICES` object at the top of `pricing.js`. Each entry has `value`, `source` (URL), `as_of` (ISO date) and `confidence` (`high|medium|low`). Change the value, source and date together, then run the tests (some expectations hard-code current prices and must be updated deliberately).

TaxDome list prices come from the primary source `taxdome-pricing-page-2026-11-24.md` (taxdome.com/pricing, read 2026-11-24); it wins over any second-hand source. The band table is `td_extra_tiers`; `OFFICIAL_CHECKPOINTS` in `pricing.js` and the first test hold the 17 values of TaxDome's own calculator. If TaxDome changes the page, update `td_extra_tiers`, the checkpoints and the test together; the page only shows "Matches TaxDome's own pricing calculator" while all checkpoints reproduce. Not on the pricing page and therefore only a low-confidence opt-in scenario: the 50% discount for smaller existing customers (`td_discount_existing_pct`). The sources table and the band table on the page are generated from `PRICES`. Document any new disagreement between sources in `SPEC.md`.

## Switching Kit
Edit `KIT` in `config.js`. While `available` is `false` the page shows "Coming soon". Set `available: true` and a real `checkoutUrl` only when the product exists.

## Deploy
Upload the folder contents (`index.html`, `pricing.js`, `config.js`) to any static host (Cloudflare Pages, Netlify, GitHub Pages, S3, plain nginx). Serve `.js` as `text/javascript`. Do not need `SPEC.md`, `README.md`, tests, `package.json` on the server. No server-side code, cookies or environment variables.
