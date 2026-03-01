const DRUMROLL_URL = chrome.runtime.getURL("drumroll.mp3");
const SUCCESS_URL = chrome.runtime.getURL("success.mp3");

function playDrumrollThenSuccess() {
  const drumroll = new Audio(DRUMROLL_URL);
  const success = new Audio(SUCCESS_URL);

  drumroll.play().catch(() => {});

  setTimeout(() => {
    drumroll.pause();
    success.play().catch(() => {});
  }, 3500);
}

function isIssuePage() {
  return /^\/[^/]+\/[^/]+\/issues\/\d+/.test(location.pathname);
}

function isIssueListPage() {
  return /^\/[^/]+\/[^/]+\/issues\/?(\?.*)?$/.test(location.pathname);
}

// ── 1. Fecha dentro da issue individual ───────────────────────
function observeCloseButtons() {
  document.addEventListener("click", (e) => {
    if (!isIssuePage()) return;

    const button = e.target.closest("button, input[type=submit]");
    if (!button) return;

    const text = (button.textContent || button.value || "").trim().toLowerCase();
    const ariaLabel = (button.getAttribute("aria-label") || "").toLowerCase();

    const isCloseAction =
      text.includes("close issue") ||
      text.includes("close as completed") ||
      text.includes("close as not planned") ||
      ariaLabel.includes("close issue") ||
      ariaLabel.includes("close as completed") ||
      ariaLabel.includes("close as not planned");

    if (isCloseAction) {
      playDrumrollThenSuccess();
    }
  }, true);
}

// ── 2. Fecha pela lista (Mark as > Completed / Not planned) ───
function observeBulkClose() {
  let pendingClose = false;

  // Marca quando o usuário clica em fechar no dropdown
  document.addEventListener("click", (e) => {
    if (!isIssueListPage()) return;

    const el = e.target.closest("button, a, [role=menuitem], [role=option]");
    if (!el) return;

    const text = (el.textContent || "").trim().toLowerCase();
    if (
      text.includes("completed") ||
      text.includes("not planned") ||
      text.includes("close as") ||
      text === "closed"
    ) {
      pendingClose = true;
    }
  }, true);

  // O GitHub troca o nó do toast de "ui-app-toast-info" para "ui-app-toast-success"
  // quando a operação conclui — detecta isso via MutationObserver
  const observer = new MutationObserver((mutations) => {
    if (!pendingClose || !isIssueListPage()) return;

    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node.nodeType !== Node.ELEMENT_NODE) continue;

        const toast = node.id === "ui-app-toast"
          ? node
          : node.querySelector("#ui-app-toast");

        if (toast && toast.dataset.testid === "ui-app-toast-success") {
          pendingClose = false;
          playDrumrollThenSuccess();
          return;
        }
      }
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

observeCloseButtons();
observeBulkClose();
