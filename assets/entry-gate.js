// Runs before the home page is parsed: the welcome screen is its own document.
(() => {
  const params = new URLSearchParams(location.search);
  if (params.get("publico") === "consumo") {
    try { sessionStorage.setItem("kombuEntryAudience", "consumo"); } catch { /* Explicit URL still grants entry. */ }
    return;
  }
  if (location.hash) return; // Preserve links to a specific flavor, address or legal text.
  try { if (sessionStorage.getItem("kombuEntryAudience")) return; } catch { /* Show the entry page. */ }
  document.documentElement.classList.add("entry-redirect");
  location.replace(`/entrada${location.search}`);
})();
