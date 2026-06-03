// Smooth-scroll helpers for in-page section navigation beneath the fixed site nav bar.

// Fallback nav-bar height (px), used only when the bar element can't be measured
// (e.g. not yet mounted). Matches the mobile bar (~54px); desktop measures larger live.
const NAV_FALLBACK_HEIGHT = 56;
// Breathing gap (px) left between a scrolled-to heading and the bottom of the fixed bar.
const NAV_SCROLL_GAP = 12;

// Live height of the fixed site nav bar. Uses the narrow `[data-app-nav]` selector so it
// never matches an unrelated <nav> on the page (e.g. the blog post prev/next nav).
const navBarHeight = (): number =>
  document.querySelector('[data-app-nav]')?.getBoundingClientRect().height ?? NAV_FALLBACK_HEIGHT;

// Smooth-scroll to a section by id, landing it just below the fixed nav bar.
// `id === 'top'` scrolls to the very top of the page.
export const scrollToSection = (id: string): void => {
  if (id === 'top') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }
  const el = document.getElementById(id);
  if (!el) return;
  window.scrollTo({ top: el.offsetTop - navBarHeight() - NAV_SCROLL_GAP, behavior: 'smooth' });
};
