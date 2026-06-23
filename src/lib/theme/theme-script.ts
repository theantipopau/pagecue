export const THEME_STORAGE_KEY = "pagecue.theme";

/**
 * Inlined into <head> so the saved/system theme applies before first paint, avoiding a
 * light-to-dark flash. This is a static, repo-authored script, not user or model content.
 */
export const themeInitScript = `(function () {
  try {
    var stored = localStorage.getItem("${THEME_STORAGE_KEY}");
    var prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    var isDark = stored === "dark" || (stored !== "light" && prefersDark);
    document.documentElement.classList.toggle("dark", isDark);
  } catch (e) {}
})();`;
