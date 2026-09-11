(() => {
  "use strict";

  /*
   * Prevent accidental duplicate installation if this
   * code block is ever pasted more than once.
   */
  if (
    window.__shopHopperDataToolsInstalled
  ) {
    return;
  }

  window.__shopHopperDataToolsInstalled =
    true;

  const DATA_EXPORT_VERSION =
    1;

  const PRE_IMPORT_BACKUP_KEY =
    `${STORAGE_KEY}-pre-import-backup`;

  /* ============================================================
     CREATE BUTTONS
     ============================================================ */

  function installDataTools() {
    const demoBar =
      document.querySelector(
        ".demo-bar"
      );

    if (!demoBar) {
      return;
    }

    if (
      document.getElementById(
        "demoDataTools"
      )
    ) {
      return;
    }

    demoBar.insertAdjacentHTML(
      "beforeend",
      `
        <div
          id="demoDataTools"
          class="demo-data-tools"
        >
          <button
            type="button"
            class="demo-data-button export"
            data-demo-data-action="export"
            title="Save all prototype data to a JSON backup file"
          >
            <i class="fa-solid fa-download"></i>
            &nbsp;
            Export Data
          </button>

          <button
            type="button"
            class="demo-data-button import"
            data-demo-data-action="import"
            title="Restore prototype data from a JSON backup"
          >
            <i class="fa-solid fa-upload"></i>
            &nbsp;
            Import Data
          </button>

          <input
            id="shopHopperImportFile"
            type="file"
            accept=".json,application/json"
            hidden
          />
        </div>
      `
    );
  }

  /* ============================================================
     EXPORT
     ============================================================ */

  function exportShopHopperData() {
    const exportPackage = {
      application:
        "Shop Hopper Prototype",

      version:
        DATA_EXPORT_VERSION,

      exportedAt:
        new Date().toISOString(),

      data:
        state
    };

    const json =
      JSON.stringify(
        exportPackage,
        null,
        2
      );

    const blob =
      new Blob(
        [json],
        {
          type:
            "application/json"
        }
      );

    const url =
      URL.createObjectURL(
        blob
      );

    const now =
      new Date();

    const date =
      [
        now.getFullYear(),

        String(
          now.getMonth() + 1
        ).padStart(
          2,
          "0"
        ),

        String(
          now.getDate()
        ).padStart(
          2,
          "0"
        )
      ].join("-");

    const time =
      [
        String(
          now.getHours()
        ).padStart(
          2,
          "0"
        ),

        String(
          now.getMinutes()
        ).padStart(
          2,
          "0"
        )
      ].join("-");

    const filename =
      `shop-hopper-demo-data-${date}-${time}.json`;

    const link =
      document.createElement(
        "a"
      );

    link.href =
      url;

    link.download =
      filename;

    document.body.appendChild(
      link
    );

    link.click();

    link.remove();

    setTimeout(
      () => {
        URL.revokeObjectURL(
          url
        );
      },
      1000
    );
  }

  /* ============================================================
     VALIDATE IMPORT
     ============================================================ */

  function validateImportedState(
    candidate
  ) {
    if (
      !candidate ||
      typeof candidate !==
        "object"
    ) {
      return false;
    }

    if (
      !Array.isArray(
        candidate.merchants
      )
    ) {
      return false;
    }

    if (
      !Array.isArray(
        candidate.stores
      )
    ) {
      return false;
    }

    if (
      !Array.isArray(
        candidate.items
      )
    ) {
      return false;
    }

    return true;
  }

  /* ============================================================
     IMPORT
     ============================================================ */

  async function importShopHopperData(
    file
  ) {
    if (!file) {
      return;
    }

    let parsed;

    try {
      const text =
        await file.text();

      parsed =
        JSON.parse(
          text
        );
    } catch (error) {
      console.error(
        error
      );

      alert(
        "That file could not be read as Shop Hopper JSON data."
      );

      return;
    }

    /*
     * Accept both:
     *
     * 1. Our exported package:
     *    { application, version, exportedAt, data }
     *
     * 2. A raw Shop Hopper state object.
     */
    const importedState =
      parsed?.data &&
      typeof parsed.data ===
        "object"
        ? parsed.data
        : parsed;

    if (
      !validateImportedState(
        importedState
      )
    ) {
      alert(
        "This does not appear to be a valid Shop Hopper prototype backup."
      );

      return;
    }

    const merchantCount =
      importedState.merchants.length;

    const storeCount =
      importedState.stores.length;

    const itemCount =
      importedState.items.length;

    const hopperCount =
      Array.isArray(
        importedState.hoppers
      )
        ? importedState.hoppers.length
        : 0;

    const hopperPickCount =
      Array.isArray(
        importedState.hopperLists
      )
        ? importedState.hopperLists.reduce(
            (
              total,
              list
            ) =>
              total +
              (
                Array.isArray(
                  list.entries
                )
                  ? list.entries.length
                  : 0
              ),
            0
          )
        : 0;

    const approved =
      confirm(
        "Import this Shop Hopper backup?\n\n" +
        `${merchantCount} merchants\n` +
        `${storeCount} stores\n` +
        `${itemCount} products/items\n` +
        `${hopperCount} Hopper profiles\n` +
        `${hopperPickCount} Hopper picks\n\n` +
        "Your current browser data will be replaced."
      );

    if (!approved) {
      return;
    }

    /*
     * Save an automatic browser-side copy of the current
     * state before replacing anything.
     */
    try {
      localStorage.setItem(
        PRE_IMPORT_BACKUP_KEY,
        JSON.stringify(
          state
        )
      );
    } catch (error) {
      console.warn(
        "Could not create pre-import backup.",
        error
      );
    }

    /*
     * Replace the active prototype state.
     */
    state =
      importedState;

    saveState();

    /*
     * Reset temporary UI selections to safe values.
     */
    ui.selectedMerchantId =
      state.merchants[0]?.id ||
      null;

    ui.merchantStoreId =
      null;

    ui.marketplaceSlug =
      "pacific-beach";

    ui.selectedMapMarketplace =
      "pacific-beach";

    ui.category =
      "all";

    ui.search =
      "";

    /*
     * Keep the user on the Hopper profile when possible.
     */
    if (
      Array.isArray(
        state.hoppers
      ) &&
      state.hoppers.length
    ) {
      ui.persona =
        "hopper";

      ui.selectedHopperId =
        state.hoppers[0].id;
    } else {
      ui.persona =
        "shopper";

      ui.shopperView =
        "home";
    }

    renderAll();

    alert(
      "Shop Hopper data imported successfully."
    );
  }

  /* ============================================================
     BUTTON EVENTS
     ============================================================ */

  document.addEventListener(
    "click",
    event => {
      const button =
        event.target.closest(
          "[data-demo-data-action]"
        );

      if (!button) {
        return;
      }

      const action =
        button.dataset
          .demoDataAction;

      if (
        action ===
        "export"
      ) {
        exportShopHopperData();

        return;
      }

      if (
        action ===
        "import"
      ) {
        const fileInput =
          document.getElementById(
            "shopHopperImportFile"
          );

        if (!fileInput) {
          return;
        }

        /*
         * Clearing the value allows the same backup
         * file to be selected twice if necessary.
         */
        fileInput.value =
          "";

        fileInput.click();
      }
    }
  );

  document.addEventListener(
    "change",
    event => {
      if (
        event.target.id !==
        "shopHopperImportFile"
      ) {
        return;
      }

      const file =
        event.target.files?.[0];

      if (file) {
        importShopHopperData(
          file
        );
      }
    }
  );

  installDataTools();
})();