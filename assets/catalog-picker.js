(() => {
  "use strict";

  if (
    window.__shopHopperCatalogPickerInstalled
  ) {
    return;
  }

  window.__shopHopperCatalogPickerInstalled =
    true;

  let bypassCatalogPicker =
    false;

  /* ============================================================
     CURRENT HOPPER / LIST
     ============================================================ */

  function catalogCurrentHopper() {
    if (
      ui.persona !==
      "hopper"
    ) {
      return null;
    }

    return (
      state.hoppers?.find(
        hopper =>
          hopper.id ===
          ui.selectedHopperId
      ) ||
      null
    );
  }

  function catalogCurrentList() {
    const hopper =
      catalogCurrentHopper();

    if (!hopper) {
      return null;
    }

    return (
      state.hopperLists?.find(
        list =>
          list.hopperId ===
          hopper.id
      ) ||
      null
    );
  }

  /* ============================================================
     CATALOG SEARCH
     ============================================================ */

  function getHopperCatalogResults(
    searchValue = ""
  ) {
    const search =
      String(
        searchValue
      )
        .trim()
        .toLowerCase();

    return state.items
      .map(
        item => {
          const store =
            getStore(
              item.storeId
            );

          if (!store) {
            return null;
          }

          const merchant =
            getMerchant(
              store.merchantId
            );

          if (!merchant) {
            return null;
          }

          return {
            item,
            store,
            merchant
          };
        }
      )
      .filter(Boolean)
      .filter(
        result =>
          result.item.active &&
          result.store.published
      )
      .filter(
        result => {
          if (!search) {
            return true;
          }

          const haystack = [
            result.item.title,
            result.item.description,
            result.item.category,
            result.store.name,
            result.store.address,
            result.merchant.businessName
          ]
            .join(" ")
            .toLowerCase();

          return haystack.includes(
            search
          );
        }
      )
      .sort(
        (a, b) =>
          a.item.title.localeCompare(
            b.item.title
          )
      );
  }

  function renderHopperCatalogResults(
    searchValue = ""
  ) {
    const container =
      document.getElementById(
        "hopperCatalogResults"
      );

    if (!container) {
      return;
    }

    const list =
      catalogCurrentList();

    const results =
      getHopperCatalogResults(
        searchValue
      );

    if (!results.length) {
      container.innerHTML = `
        <div class="hopper-catalog-empty">
          No matching Shop Hopper items found.
          <br />
          You can create a new local find below.
        </div>
      `;

      return;
    }

    container.innerHTML =
      results
        .map(
          ({
            item,
            store,
            merchant
          }) => {
            /*
             * Same product may belong to MANY different
             * Hopper lists.
             *
             * We only prevent adding the identical item
             * twice to THIS Hopper's list.
             */
            const alreadyInThisList =
              Array.isArray(
                list?.entries
              ) &&
              list.entries.some(
                entry =>
                  entry.itemId ===
                  item.id
              );

            return `
              <article
                class="hopper-catalog-result"
              >

                <button type="button" class="hopper-catalog-image-button item-detail-trigger" data-action="view-item" data-id="${escapeHtml(item.id)}" aria-label="View ${escapeHtml(item.title)} details">
                  <img class="hopper-catalog-image" src="${escapeHtml(safeUrl(item.image))}" alt="${escapeHtml(item.title)}" />
                </button>

                <div
                  class="hopper-catalog-copy"
                >

                  <button type="button" class="hopper-catalog-title item-detail-trigger" data-action="view-item" data-id="${escapeHtml(item.id)}">
                    ${escapeHtml(item.title)}
                  </button>

                  <div
                    class="hopper-catalog-store"
                  >
                    ${escapeHtml(
                      store.name
                    )}
                  </div>

                  <div
                    class="hopper-catalog-meta"
                  >
                    ${money(
                      item.priceCents
                    )}
                    ·
                    ${escapeHtml(
                      marketplaceLabel(
                        store
                      )
                    )}
                  </div>

                </div>

                ${
                  alreadyInThisList
                    ? `
                      <button
                        type="button"
                        class="
                          hopper-catalog-add
                          added
                        "
                        disabled
                      >
                        <i class="fa-solid fa-check"></i>
                        In This List
                      </button>
                    `
                    : `
                      <button
                        type="button"
                        class="hopper-catalog-add"
                        data-hopper-catalog-action="add"
                        data-item-id="${escapeHtml(
                          item.id
                        )}"
                      >
                        + Add
                      </button>
                    `
                }

              </article>
            `;
          }
        )
        .join("");
  }

  /* ============================================================
     OPEN PICKER
     ============================================================ */

  function openHopperCatalogPicker() {
    const hopper =
      catalogCurrentHopper();

    const list =
      catalogCurrentList();

    if (
      !hopper ||
      !list
    ) {
      return;
    }

    openModal({
      title:
        `Add Local Find — ${hopper.personaName}`,

      submitLabel:
        null,

      body: `
        <div class="notice">
          Search Shop Hopper first, or create something new.
          Each Hopper has their own independent favorites list.
        </div>

        <div
          class="hopper-catalog-search-wrap"
        >
          <i
            class="
              fa-solid
              fa-magnifying-glass
              hopper-catalog-search-icon
            "
          ></i>

          <input
            id="hopperCatalogSearch"
            class="hopper-catalog-search"
            type="search"
            placeholder="Search products, stores or merchants..."
            autocomplete="off"
          />
        </div>

        <div class="hopper-catalog-help">
          The same product can be favorited by multiple Hoppers.
        </div>

        <div
          id="hopperCatalogResults"
          class="hopper-catalog-results"
        ></div>

        <div
          class="hopper-create-find-divider"
        >
          or
        </div>

        <button
          type="button"
          class="hopper-create-new-find"
          data-hopper-catalog-action="create"
        >
          <i class="fa-solid fa-circle-plus"></i>
          &nbsp;
          Create New Local Find
        </button>
      `
    });

    renderHopperCatalogResults(
      ""
    );
  }

  /* ============================================================
     ADD EXISTING CATALOG ITEM TO CURRENT HOPPER
     ============================================================ */

  function addCatalogItemToHopper(
    itemId
  ) {
    const hopper =
      catalogCurrentHopper();

    const list =
      catalogCurrentList();

    const item =
      getItem(
        itemId
      );

    if (
      !hopper ||
      !list ||
      !item
    ) {
      return;
    }

    const store =
      getStore(
        item.storeId
      );

    if (!store) {
      return;
    }

    const merchant =
      getMerchant(
        store.merchantId
      );

    if (!merchant) {
      return;
    }

    if (
      list.entries.some(
        entry =>
          entry.itemId ===
          item.id
      )
    ) {
      return;
    }

    list.entries.push({
      id:
        uid(
          "hopper-pick"
        ),

      itemName:
        item.title,

      merchantName:
        merchant.businessName,

      merchantId:
        merchant.id,

      suggestedCategory:
        item.category,

      itemId:
        item.id,

      note:
        ""
    });

    saveState();

    closeModal();

    renderAll();
  }

  /* ============================================================
     SEARCH EVENTS
     ============================================================ */

  document.addEventListener(
    "input",
    event => {
      if (
        event.target.id !==
        "hopperCatalogSearch"
      ) {
        return;
      }

      renderHopperCatalogResults(
        event.target.value
      );
    }
  );

  /* ============================================================
     PICKER BUTTON EVENTS
     ============================================================ */

  document.addEventListener(
    "click",
    event => {
      const button =
        event.target.closest(
          "[data-hopper-catalog-action]"
        );

      if (!button) {
        return;
      }

      const action =
        button.dataset
          .hopperCatalogAction;

      if (
        action ===
        "add"
      ) {
        addCatalogItemToHopper(
          button.dataset.itemId
        );

        return;
      }

      if (
        action ===
        "create"
      ) {
        /*
         * Close the search picker, then deliberately
         * allow the EXISTING Add Local Find workflow
         * to run once.
         *
         * Surfer keeps its existing form.
         * User-created Hoppers keep their existing form.
         */
        closeModal();

        const originalAddButton =
          document.querySelector(
            '[data-action="hopper-add-local-find"]'
          );

        if (!originalAddButton) {
          return;
        }

        bypassCatalogPicker =
          true;

        originalAddButton.click();
      }
    }
  );

  /* ============================================================
     INTERCEPT + ADD LOCAL FIND
     Window capture runs before the existing document handlers.
     ============================================================ */

  window.addEventListener(
    "click",
    event => {
      const button =
        event.target.closest(
          '[data-action="hopper-add-local-find"]'
        );

      if (
        !button ||
        ui.persona !==
          "hopper"
      ) {
        return;
      }

      /*
       * Used only when "Create New Local Find"
       * intentionally hands control back to the
       * original Hopper creation workflow.
       */
      if (
        bypassCatalogPicker
      ) {
        bypassCatalogPicker =
          false;

        return;
      }

      event.preventDefault();

      event.stopImmediatePropagation();

      openHopperCatalogPicker();
    },
    true
  );
})();