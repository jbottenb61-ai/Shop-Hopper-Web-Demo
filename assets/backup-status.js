(() => {
  "use strict";

  const LAST_EXPORT_KEY =
    `${STORAGE_KEY}-last-export-at`;

  function formatBackupDate(value) {
    if (!value) {
      return null;
    }

    const date =
      new Date(value);

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return null;
    }

    return date.toLocaleString(
      undefined,
      {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit"
      }
    );
  }

  function updateBackupStatus() {
    const status =
      document.getElementById(
        "demoBackupStatus"
      );

    const text =
      document.getElementById(
        "demoBackupStatusText"
      );

    if (!status || !text) {
      return;
    }

    const saved =
      localStorage.getItem(
        LAST_EXPORT_KEY
      );

    const formatted =
      formatBackupDate(
        saved
      );

    if (!formatted) {
      status.classList.remove(
        "has-backup"
      );

      text.textContent =
        "No export recorded";

      return;
    }

    status.classList.add(
      "has-backup"
    );

    text.textContent =
      `Last Export: ${formatted}`;
  }

  function installBackupStatus() {
    const tools =
      document.getElementById(
        "demoDataTools"
      );

    if (!tools) {
      return false;
    }

    let status =
      document.getElementById(
        "demoBackupStatus"
      );

    if (!status) {
      tools.insertAdjacentHTML(
        "afterbegin",
        `
          <div
            id="demoBackupStatus"
            class="demo-backup-status"
            title="Last prototype data export"
          >
            <span
              class="demo-backup-dot"
            ></span>

            <span>
              <span
                class="demo-backup-label"
              >
                Backup:
              </span>

              <span
                id="demoBackupStatusText"
              >
                No export recorded
              </span>
            </span>
          </div>
        `
      );
    }

    updateBackupStatus();

    return true;
  }

  /*
   * Record the time whenever Export Data is clicked.
   */
  document.addEventListener(
    "click",
    event => {
      const exportButton =
        event.target.closest(
          '[data-demo-data-action="export"]'
        );

      if (!exportButton) {
        return;
      }

      localStorage.setItem(
        LAST_EXPORT_KEY,
        new Date().toISOString()
      );

      installBackupStatus();

      setTimeout(
        updateBackupStatus,
        50
      );
    }
  );

  /*
   * Install immediately.
   */
  if (!installBackupStatus()) {
    /*
     * Safety fallback in case the Export/Import controls
     * have not been created yet.
     */
    const observer =
      new MutationObserver(
        () => {
          if (
            installBackupStatus()
          ) {
            observer.disconnect();
          }
        }
      );

    observer.observe(
      document.body,
      {
        childList: true,
        subtree: true
      }
    );
  }
})();