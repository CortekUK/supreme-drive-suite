
## Honest Assessment

The current approach uses Google Docs Viewer (`https://docs.google.com/viewer?embedded=true&url=...`) to embed PDFs in an iframe. There is a **known reliability problem** with this: Google Docs Viewer frequently returns a "Sorry, we were unable to load the file" error — especially on mobile devices, for PDFs hosted on private/authenticated URLs (like Supabase storage), and it's rate-limited. It is **not** a guaranteed solution for Android.

The real fix is to convert the promotional flyer to an **image** (JPG/PNG/WebP) instead of a PDF. Images display perfectly and identically on all devices — iPhone, Android, desktop — using the existing `<img>` tag path which already works.

## Plan

### What to do
Convert the PDF detection path so it also handles the case where Google Docs Viewer fails, **and** strongly recommend uploading the flyer as an image. The most reliable fix is a two-part approach:

1. **Add an `onError` fallback** on the iframe — if Google Docs Viewer fails to load, show a clean "Open Flyer" button that opens the PDF in a new tab.
2. **Add a note in the admin promotions UI** suggesting images (JPG/PNG) are recommended for best cross-device compatibility.

### Files to change
- `src/components/PromoPopup.tsx` — add iframe `onLoad`/error state + fallback button
- `src/pages/admin/PromotionsManagement.tsx` — add a small helper tip about using images vs PDFs

### The honest answer to the user's question
**Not guaranteed.** Google Docs Viewer is an external Google service that can fail. The truly reliable fix is to upload the promo flyer as a JPG/PNG image — it will then display perfectly on all devices with no third-party dependency. I'll implement the error fallback and update the admin panel with guidance.
