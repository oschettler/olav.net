// Server-side comments loader for olav.net.
//
// The CMS at https://indie.bonn.cafe fetches GoToSocial replies server-side
// (with the bearer token the browser doesn't have) and caches them. This
// loader simply pulls a ready-to-insert HTML fragment from the cache-only,
// rate-limited endpoint and injects it into the comments container. No call to
// GoToSocial happens from the browser, so the old 401 / ULID-regex problem is
// gone.
//
// The container is `<oom-comments data-status-id="<ULID>">`; the matching
// styles in styles.css apply to the injected markup unchanged.

const ENDPOINT = "https://indie.bonn.cafe/api/comments";

async function loadComments(el) {
  const id = el.getAttribute("data-status-id");
  if (!id) {
    return;
  }

  try {
    const response = await fetch(
      `${ENDPOINT}?status_id=${encodeURIComponent(id)}`,
      { headers: { Accept: "text/html" } },
    );
    if (!response.ok) {
      return;
    }
    const html = (await response.text()).trim();
    if (html) {
      el.innerHTML = html;
    }
  } catch {
    // network error: leave the fallback text in place
  }
}

for (const el of document.querySelectorAll("oom-comments[data-status-id]")) {
  loadComments(el);
}
