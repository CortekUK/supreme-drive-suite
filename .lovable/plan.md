

## Plan: Blend Logo Seamlessly in Both Themes

**Problem**: The logo image has a black background that clashes with the light theme nav (near-white). In dark mode it already blends well since the nav bg is near-black.

**Approach**: Force the navigation bar to always use a dark background regardless of theme. This is a common luxury/premium pattern and ensures the black-background logo blends seamlessly. The nav text and links will use light colors always.

### Changes

**`src/components/Navigation.tsx`**:
- Replace `bg-background/95` with a fixed dark background: `bg-[#0a0a0a]/95`
- Force all nav text to light colors: `text-white` on the nav element
- Update active/inactive link colors to light variants (e.g., `text-white` active, `text-white/60` inactive)
- Update mobile menu background to match
- Keep the ThemeToggle and phone button as-is (they have their own styling)

**`src/index.css`** (no changes needed — dark nav is purely component-level)

This keeps the rest of the site theme-responsive while the header always stays dark and the logo blends naturally.

