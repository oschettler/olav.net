// Vendored mastodon-comments adapted for GoToSocial (social.schettler.net).
//
// The upstream component extracts the status id from a URL via
// `/\/(\d+)$/`, which only matches NUMERIC Mastodon ids. GoToSocial ids are
// ULIDs (e.g. 01FBVD42CQ3ZEEVMW180SBX03B), so we sidestep the regex entirely:
// the template feeds the raw id via `data-status-id` and we hardcode the
// instance origin, then call GET {origin}/api/v1/statuses/{id}/context
// unauthenticated (works for public statuses).
//
// We subclass the upstream component and override connectedCallback so we can
// reuse its public render()/renderComment() while replacing the id handling.

import SocialComments from "./comments.js";

const ORIGIN = "https://social.schettler.net";
const AUTHOR_HANDLE = "@olav@social.schettler.net";

class GoToSocialComments extends SocialComments {
  async connectedCallback() {
    const lang = this.closest("[lang]")?.lang || navigator.language || "en";
    this.dateTimeFormatter = new Intl.DateTimeFormat(lang, {
      dateStyle: "medium",
      timeStyle: "short",
    });

    const id = this.getAttribute("data-status-id");
    if (!id) {
      return;
    }

    try {
      const response = await fetch(
        `${ORIGIN}/api/v1/statuses/${id}/context`,
        { headers: { Accept: "application/json" } },
      );
      if (!response.ok) {
        return;
      }
      const data = await response.json();
      const comments = dataFromMastodon(data).filter((c) => c.parent === id);
      this.comments = { mastodon: comments };
      this.refresh();
    } catch {
      // network/CORS error: leave the fallback text in place
    }
  }
}

// Local copy of the upstream descendant-shaping logic (the upstream one is
// module-private). Only public visibility replies are surfaced.
function dataFromMastodon(data) {
  const comments = new Map();

  for (const comment of data.descendants || []) {
    if (comment.visibility !== "public") {
      continue;
    }
    const account = comment.account;
    const handler = `@${account.username}@${new URL(account.url).hostname}`;
    comments.set(comment.id, {
      id: comment.id,
      isMine: handler === AUTHOR_HANDLE,
      source: "mastodon",
      url: comment.url,
      parent: comment.in_reply_to_id,
      createdAt: new Date(comment.created_at),
      content: comment.content,
      author: {
        name: account.display_name || account.username,
        handler,
        url: account.url,
        avatar: account.avatar_static,
        alt: account.display_name || account.username,
      },
      boosts: comment.reblogs_count,
      likes: comment.favourites_count,
      replies: [],
    });
  }

  for (const comment of comments.values()) {
    if (comment.parent && comments.has(comment.parent)) {
      comments.get(comment.parent).replies.push(comment);
    }
  }

  return Array.from(comments.values());
}

customElements.define("oom-comments", GoToSocialComments);
