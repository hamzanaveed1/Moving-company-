/* Runs before the page paints (loaded in <head>) so the saved or system theme is applied with no flash.
   Kept tiny and dependency-free. Must stay in sync with src/scripts/theme.ts. */
(function () {
  try {
    var saved = localStorage.getItem('theme');
    var dark = saved === 'dark' || (saved !== 'light' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
  } catch (e) { /* storage blocked: the CSS follows the system preference instead */ }
})();
