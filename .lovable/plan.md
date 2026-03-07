
## Replace Navigation Logo

**What:** Swap the current `tiss-logo.png` in the header with the newly uploaded `tiss_new.jpeg`.

**How:**
1. Copy `user-uploads://tiss_new.jpeg` → `src/assets/tiss-logo.jpg`
2. Update `src/components/Navigation.tsx` — change the import from `tiss-logo.png` to `tiss-logo.jpg`

The logo sizing (`h-14 lg:h-16`) stays the same — the new circular logo will display cleanly against the dark navigation background.
