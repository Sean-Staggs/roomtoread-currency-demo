# Currency picker for your Fundraise Up checkout: install guide

When someone clicks **Donate** on roomtoread.org, a window opens asking **"Choose your currency to make a donation."** They pick one of eight currencies, and your Fundraise Up checkout for that currency opens in its place.

You can see it working here: https://roomtoread-demo.pages.dev/ (test mode, no real charges).

It takes about 30 minutes: upload three files, add one line to your site's `<head>`, and test.

---

## 1. What to download

Everything is in the `client/` folder of the repository:

| File | What it is |
|---|---|
| `currency-picker.js` | The picker. One file, no other libraries needed. |
| `images/picker-photo.jpg` | The photo on the left side of the window (1200px wide). |
| `images/logo-160.png` | Your logo for the window. |
| `INSTALL.md` | This guide. |

You can swap in your own photo or logo. Any landscape photo at least 1000px wide works.

## 2. Upload the images

1. Upload `picker-photo.jpg` and `logo-160.png` to your media library (Umbraco → Media).
2. Copy the full address of each one, for example `https://www.roomtoread.org/media/abc123/picker-photo.jpg`.

## 3. Add your image addresses to the script

Open `currency-picker.js` in a text editor. Everything you might change is in the **SETTINGS** block at the top. Replace the two placeholder addresses:

```js
photoUrl: 'https://www.roomtoread.org/media/REPLACE-ME/picker-photo.jpg',
logoUrl:  'https://www.roomtoread.org/media/REPLACE-ME/logo-160.png',
```

with the addresses you copied in step 2. Save the file.

## 4. Upload the script

Upload `currency-picker.js` to your site so it has its own address, for example `https://www.roomtoread.org/scripts/currency-picker.js`. Any location your site serves files from is fine.

## 5. Add one line to your site's `<head>`

Your site template already has the Fundraise Up snippet in `<head>`. It starts with this line:

```html
<!-- Fundraise Up: the new standard for online giving -->
```

Add the picker **directly above** that line, using your address from step 4:

```html
<script src="/scripts/currency-picker.js"></script>
<!-- Fundraise Up: the new standard for online giving -->
<script>(function(w,d,s,n,a){ ... })(window,document,'script','FundraiseUp','ASCUTZCB');</script>
<!-- End Fundraise Up -->
```

Three rules:

- **Above the Fundraise Up snippet, not below.** The picker has to handle `?form=donate` links before Fundraise Up opens its own checkout.
- **No `async` or `defer`** on the picker's script tag.
- **Put it in the site template, not in Google Tag Manager.** Tag Manager loads it too late.

Leave your Fundraise Up snippet exactly as it is. Add it to every page that has the Fundraise Up snippet, which is normally the shared site template, so it's one change.

## 6. Test before you publish

1. Open any page with these two parameters added to the address: **`?form=donate&fundraiseupLivemode=no`**
   The `fundraiseupLivemode=no` part puts the checkout in **test mode**, so no real charges.
2. The currency window should open. Click each currency and check that the checkout shows that currency next to the amount (for example "EUR").
3. Click your header **Donate** button and the **Donate Now** buttons. Each should open the currency window first.
4. Try it on a phone. The window stacks into one column.

If something doesn't open, see **Troubleshooting** below.

## 7. What happens on your site after install

| A visitor… | What they see |
|---|---|
| Clicks any Fundraise Up donate link on your pages (`roomtoread.donorsupport.co/-/X…`) | The currency window, then the checkout they pick |
| Opens a link with `?form=donate`, for example from an email | The currency window |
| Opens a link with `?form=FUN…` (a specific campaign) | That campaign's checkout directly, with no currency window |
| Clicks a link to `#choose-currency` | The currency window. Use this for new buttons. |

---

## Changing things later

All in the **SETTINGS** block at the top of `currency-picker.js`:

- **Currencies and campaigns:** `currencies` lists each button, in order, with its Fundraise Up campaign ID. To add, remove or reorder a currency, edit this list.
- **Text:** `title`, `message`, `heading`, `subheading`, `note` and `footerLinks`.
- **Let a button skip the picker:** add its Element code to `skipElements`. For example, to let **Give Monthly** open its own checkout directly:
  ```js
  skipElements: ['XTWQFHMG'],
  ```
- **Open the picker from your own code:** `window.RoomToReadCurrencyPicker.open()`

The campaign IDs in the file today:

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

## Optional: in the Fundraise Up dashboard

Your campaigns' descriptions include a line, *"Need to donate in another currency? AUD | CAD | CHF …"*. With the picker in place, donors choose their currency before the checkout opens, so you may want to remove that line from each campaign. It still works if you leave it.

## Troubleshooting

- **Fundraise Up's own checkout opens instead of the currency window.** The picker is loading after the Fundraise Up snippet, or through Tag Manager. Move the script tag directly above the snippet in the template (step 5).
- **The window opens but the photo or logo is missing.** Check `photoUrl` and `logoUrl` (step 3). Paste each address into a browser to confirm it loads.
- **The font looks different.** The window loads IBM Plex Sans from Google Fonts. If your site has a Content Security Policy, allow `fonts.googleapis.com` and `fonts.gstatic.com`. Otherwise it falls back to the system font, which also works.
- **To turn it off:** remove the one script tag from step 5. Your donate buttons go back to opening Fundraise Up directly.
