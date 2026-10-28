(() => {
  const params = new URLSearchParams(location.search);
  params.delete("publico");
  document.querySelectorAll("[data-choice]").forEach(link => {
    const target = new URL(link.getAttribute("href"), location.origin);
    params.forEach((value, key) => target.searchParams.set(key, value));
    link.href = target.pathname + target.search;
    link.addEventListener("click", () => {
      try {
        sessionStorage.setItem("kombuEntryAudience", link.dataset.choice);
        localStorage.setItem("kombuAudience", link.dataset.choice);
      } catch { /* Both links also work without browser storage. */ }
    });
  });
})();
