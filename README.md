# Room to Read: currency picker demo ("step zero")

Clone of https://www.roomtoread.org/ways-to-give/ with a step-zero currency picker in front of the Fundraise Up checkout.

Live: https://roomtoread-demo.pages.dev/ (also opens straight to the picker at `/?form=donate`)

## For Room to Read: install on roomtoread.org
Everything the client needs is in [`client/`](client/): `currency-picker.js`, two images, and [`client/INSTALL.md`](client/INSTALL.md) with step-by-step instructions.

## How it works
- `index.html` is the SingleFile capture, cleaned by clone-demo, with the Fundraise Up loader for account `ASCUTZCB` in **test mode** (`window.fundraiseup_livemode = false`).
- `assets/step-zero.js` loads in `<head>` before the Fundraise Up loader. It:
  - catches every donate link (`roomtoread.donorsupport.co/-/X…`, `?form=donate`) and opens the picker instead;
  - strips `?form=donate` from the URL on load so Fundraise Up doesn't open its own checkout first;
  - on a currency click, animates the picker out and calls `FundraiseUp.openCheckout(<campaign>)`.

| Currency | Campaign |
|---|---|
| AUD | FUNUBTYAUGE |
| CAD | FUNJSLTFLYN |
| CHF | FUNDUTKFQNZ |
| EUR | FUNENEAEUGW |
| GBP | FUNBNHJYBBJ |
| HKD | FUNACGEAZEY |
| SGD | FUNEDKNVFVB |
| USD | FUNBKPYBFEE |

Each campaign was opened on 2026-11-23 and shows its own currency.

## Republish
`python3 <clone-demo skill>/scripts/demo_store.py publish ~/Desktop/roomtoread-demo`
