(() => {
  "use strict";

  if (
    window.__shopHopperPersonaBuilderInstalled
  ) {
    return;
  }

  window.__shopHopperPersonaBuilderInstalled =
    true;

  /* ============================================================
     HELPERS
     ============================================================ */

  function getAllHoppers() {
    if (
      !Array.isArray(
        state.hoppers
      )
    ) {
      state.hoppers = [];
    }

    return state.hoppers;
  }

  function getAllHopperLists() {
    if (
      !Array.isArray(
        state.hopperLists
      )
    ) {
      state.hopperLists = [];
    }

    return state.hopperLists;
  }

  function getCurrentHopper() {
    return (
      getAllHoppers().find(
        hopper =>
          hopper.id ===
          ui.selectedHopperId
      ) ||
      null
    );
  }

  function getCurrentHopperList() {
    const hopper =
      getCurrentHopper();

    if (!hopper) {
      return null;
    }

    return (
      getAllHopperLists().find(
        list =>
          list.hopperId ===
          hopper.id
      ) ||
      null
    );
  }

  function normalizePersonaMerchantName(
    value
  ) {
    return String(
      value || ""
    )
      .trim()
      .toLowerCase()
      .replace(
        /[^a-z0-9]+/g,
        " "
      )
      .trim();
  }

  function findPersonaMerchant(
    name
  ) {
    const normalized =
      normalizePersonaMerchantName(
        name
      );

    return (
      state.merchants.find(
        merchant =>
          normalizePersonaMerchantName(
            merchant.businessName
          ) ===
          normalized
      ) ||
      null
    );
  }

  function nextHopperNumber() {
    let largest =
      -1;

    getAllHoppers().forEach(
      hopper => {
        const match =
          String(
            hopper.name || ""
          ).match(
            /hopper\s+(\d+)/i
          );

        if (!match) {
          return;
        }

        largest =
          Math.max(
            largest,
            Number(
              match[1]
            )
          );
      }
    );

    return largest + 1;
  }

  function marketplaceForSlug(
    slug
  ) {
    return (
      MARKETPLACES.find(
        marketplace =>
          marketplace.slug ===
          slug
      ) ||
      MARKETPLACES[0]
    );
  }

  /* ============================================================
     PERSONA DROPDOWN
     Show ALL Hopper personas, not just The Surfer
     ============================================================ */

  renderPersonaSelect =
    function renderPersonaSelectWithDynamicHoppers() {
      const hopperOptions =
        getAllHoppers()
          .map(
            hopper => `
              <option
                value="hopper:${escapeHtml(
                  hopper.id
                )}"
                ${
                  ui.persona ===
                    "hopper" &&
                  ui.selectedHopperId ===
                    hopper.id
                    ? "selected"
                    : ""
                }
              >
                Hopper — ${escapeHtml(
                  hopper.personaName
                )}
              </option>
            `
          )
          .join("");

      const merchantOptions =
        state.merchants
          .map(
            merchant => `
              <option
                value="merchant:${escapeHtml(
                  merchant.id
                )}"
                ${
                  ui.persona ===
                    "merchant" &&
                  ui.selectedMerchantId ===
                    merchant.id
                    ? "selected"
                    : ""
                }
              >
                Merchant — ${escapeHtml(
                  merchant.businessName
                )}
              </option>
            `
          )
          .join("");

      personaSelect.innerHTML = `
        <option
          value="shopper"
          ${
            ui.persona ===
              "shopper"
              ? "selected"
              : ""
          }
        >
          Shopper
        </option>

        ${hopperOptions}

        <option
          value="admin"
          ${
            ui.persona ===
              "admin"
              ? "selected"
              : ""
          }
        >
          Demo Admin — Manage Merchants
        </option>

        ${merchantOptions}
      `;
    };

  /* ============================================================
     INSTALL "+ HOPPER PERSONA" BUTTON
     ============================================================ */

  function installPersonaButton() {
    if (
      document.getElementById(
        "addHopperPersonaButton"
      )
    ) {
      return;
    }

    personaSelect.insertAdjacentHTML(
      "afterend",
      `
        <button
          id="addHopperPersonaButton"
          type="button"
          class="add-hopper-persona-button"
          data-persona-builder="add"
          title="Create another Hopper persona"
        >
          <i class="fa-solid fa-user-plus"></i>
          &nbsp;
          + Hopper Persona
        </button>
      `
    );
  }

  /* ============================================================
     CREATE PERSONA
     ============================================================ */

  function openAddHopperPersona() {
    openModal({
      title:
        "Add Hopper Persona",

      submitLabel:
        "Create Persona",

      body: `
        <div class="notice">
          Create another local Hopper personality.
          It will have its own profile and curated list.
        </div>

        <div class="form-grid">

          <div class="field">

            <label>
              Persona name
            </label>

            <input
              name="personaName"
              required
              placeholder="The Skater"
            />

          </div>

          <div class="field">

            <label>
              Avatar emoji
            </label>

            <input
              name="avatar"
              maxlength="8"
              value="✨"
              placeholder="🛹"
            />

          </div>

          <div class="field full">

            <label>
              Marketplace / Area
            </label>

            <select
              name="marketplaceSlug"
            >
              ${marketplaceOptions(
                "pacific-beach"
              )}
            </select>

          </div>

          <div class="field full">

            <label>
              Interests
            </label>

            <input
              name="interests"
              placeholder="Skate, Streetwear, Coffee"
            />

          </div>

          <div class="field full">

            <label>
              Curated list title
            </label>

            <input
              name="listTitle"
              required
              placeholder="The Skater's Pacific Beach Stops"
            />

          </div>

          <div class="field full">

            <label>
              List description
            </label>

            <textarea
              name="listDescription"
              placeholder="Favorite local finds and stops..."
            ></textarea>

          </div>

        </div>
      `,

      onSubmit(form) {
        const data =
          new FormData(
            form
          );

        const personaName =
          String(
            data.get(
              "personaName"
            ) ||
            ""
          ).trim();

        const avatar =
          String(
            data.get(
              "avatar"
            ) ||
            "✨"
          ).trim() ||
          "✨";

        const marketplaceSlug =
          String(
            data.get(
              "marketplaceSlug"
            ) ||
            "pacific-beach"
          );

        const interests =
          String(
            data.get(
              "interests"
            ) ||
            ""
          )
            .split(",")
            .map(
              value =>
                value.trim()
            )
            .filter(Boolean);

        const listTitle =
          String(
            data.get(
              "listTitle"
            ) ||
            ""
          ).trim();

        const listDescription =
          String(
            data.get(
              "listDescription"
            ) ||
            ""
          ).trim();

        if (
          !personaName ||
          !listTitle
        ) {
          alert(
            "Please enter a persona name and curated list title."
          );

          return;
        }

        const marketplace =
          marketplaceForSlug(
            marketplaceSlug
          );

        const hopper = {
          id:
            uid(
              "hopper"
            ),

          name:
            `Hopper ${nextHopperNumber()}`,

          personaName,

          avatar,

          marketplaceSlug,

          marketplaceName:
            marketplace.name,

          interests:
            interests.length
              ? interests
              : [
                  "Local Finds"
                ]
        };

        getAllHoppers().push(
          hopper
        );

        getAllHopperLists().push({
          id:
            uid(
              "hopper-list"
            ),

          hopperId:
            hopper.id,

          title:
            listTitle,

          description:
            listDescription,

          entries:
            []
        });

        saveState();

        ui.persona =
          "hopper";

        ui.selectedHopperId =
          hopper.id;

        closeModal();

        renderAll();
      }
    });
  }

  /* ============================================================
     ADD LOCAL FIND FOR A USER-CREATED HOPPER
     ============================================================ */

  function openDynamicHopperFind() {
    const hopper =
      getCurrentHopper();

    const list =
      getCurrentHopperList();

    if (
      !hopper ||
      !list
    ) {
      return;
    }

    const marketplace =
      marketplaceForSlug(
        hopper.marketplaceSlug
      );

    openModal({
      title:
        `Add Find for ${hopper.personaName}`,

      submitLabel:
        "Add to Shop Hopper",

      body: `
        <div class="notice">
          Add a merchant, store and product to
          ${escapeHtml(
            hopper.personaName
          )}'s curated list.
        </div>

        <div class="form-grid">

          <div class="field full">

            <label>
              Merchant
            </label>

            <input
              name="merchantName"
              required
              placeholder="Merchant name"
            />

          </div>

          <div class="field full">

            <label>
              Store name
            </label>

            <input
              name="storeName"
              required
              placeholder="Store name"
            />

          </div>

          <div class="field full">

            <label>
              Item / local find
            </label>

            <input
              name="itemName"
              required
              placeholder="Product or local find"
            />

          </div>

          <div class="field full">

            <label>
              Description
            </label>

            <textarea
              name="description"
              placeholder="Describe the item..."
            ></textarea>

          </div>

          <div class="field">

            <label>
              Category
            </label>

            <select
              name="category"
            >
              ${categoryOptions(
                "fashion"
              )}
            </select>

          </div>

          <div class="field">

            <label>
              Price ($)
            </label>

            <input
              name="price"
              type="number"
              min="0"
              step="0.01"
              required
              placeholder="0.00"
            />

          </div>

          <div class="field full">

            <label>
              Store address
            </label>

            <input
              name="address"
              required
              placeholder="Street address"
            />

          </div>

          <div class="field">

            <label>
              Marketplace
            </label>

            <select
              name="marketplaceSlug"
            >
              ${marketplaceOptions(
                hopper.marketplaceSlug
              )}
            </select>

          </div>

          <div class="field">

            <label>
              Quantity
            </label>

            <input
              name="qty"
              type="number"
              step="1"
              value="1"
            />

          </div>

          <div class="field">

            <label>
              Latitude
            </label>

            <input
              name="lat"
              type="number"
              step="0.000001"
              required
              value="${escapeHtml(
                marketplace.lat
              )}"
            />

          </div>

          <div class="field">

            <label>
              Longitude
            </label>

            <input
              name="lng"
              type="number"
              step="0.000001"
              required
              value="${escapeHtml(
                marketplace.lng
              )}"
            />

          </div>

          <div class="field full">

            <label>
              Image URL
            </label>

            <input
              name="image"
              type="url"
              placeholder="https://..."
            />

          </div>

          <div class="field full">

            <label>
              Hopper note
            </label>

            <textarea
              name="hopperNote"
              placeholder="Why does this Hopper recommend it?"
            ></textarea>

          </div>

        </div>
      `,

      onSubmit(form) {
        const data =
          new FormData(
            form
          );

        const merchantName =
          String(
            data.get(
              "merchantName"
            ) ||
            ""
          ).trim();

        const storeName =
          String(
            data.get(
              "storeName"
            ) ||
            ""
          ).trim();

        const itemName =
          String(
            data.get(
              "itemName"
            ) ||
            ""
          ).trim();

        const description =
          String(
            data.get(
              "description"
            ) ||
            ""
          ).trim();

        const category =
          normalizeCategory(
            data.get(
              "category"
            )
          );

        const price =
          Number(
            data.get(
              "price"
            )
          );

        const qty =
          Number(
            data.get(
              "qty"
            ) ||
            1
          );

        const address =
          String(
            data.get(
              "address"
            ) ||
            ""
          ).trim();

        const marketplaceSlug =
          String(
            data.get(
              "marketplaceSlug"
            ) ||
            hopper.marketplaceSlug
          );

        const lat =
          Number(
            data.get(
              "lat"
            )
          );

        const lng =
          Number(
            data.get(
              "lng"
            )
          );

        const image =
          String(
            data.get(
              "image"
            ) ||
            ""
          ).trim() ||
          PRODUCT_PLACEHOLDER;

        const hopperNote =
          String(
            data.get(
              "hopperNote"
            ) ||
            ""
          ).trim();

        if (
          !merchantName ||
          !storeName ||
          !itemName ||
          !address
        ) {
          alert(
            "Please complete the merchant, store, item and address."
          );

          return;
        }

        if (
          !Number.isFinite(
            price
          ) ||
          price < 0
        ) {
          alert(
            "Please enter a valid price."
          );

          return;
        }

        if (
          !Number.isFinite(
            lat
          ) ||
          !Number.isFinite(
            lng
          )
        ) {
          alert(
            "Please enter valid latitude and longitude."
          );

          return;
        }

        let merchant =
          findPersonaMerchant(
            merchantName
          );

        if (!merchant) {
          merchant = {
            id:
              uid(
                "merchant"
              ),

            businessName:
              merchantName,

            ownerName:
              "",

            email:
              "",

            phone:
              "",

            status:
              "active"
          };

          state.merchants.push(
            merchant
          );
        }

        let store =
          state.stores.find(
            candidate =>
              candidate.merchantId ===
                merchant.id &&
              String(
                candidate.name
              )
                .trim()
                .toLowerCase() ===
              storeName
                .trim()
                .toLowerCase()
          );

        if (!store) {
          store = {
            id:
              uid(
                "store"
              ),

            merchantId:
              merchant.id,

            name:
              storeName,

            description:
              "",

            address,

            marketplaceSlug,

            category,

            lat,

            lng,

            published:
              true
          };

          state.stores.push(
            store
          );
        } else {
          store.address =
            address;

          store.marketplaceSlug =
            marketplaceSlug;

          store.lat =
            lat;

          store.lng =
            lng;

          store.published =
            true;
        }

        const item = {
          id:
            uid(
              "item"
            ),

          storeId:
            store.id,

          title:
            itemName,

          description,

          category,

          type:
            "product",

          priceCents:
            Math.round(
              price *
              100
            ),

          qty:
            Number.isFinite(
              qty
            )
              ? qty
              : 1,

          image,

          featured:
            true,

          active:
            true,

          createdByHopperId:
            hopper.id
        };

        state.items.push(
          item
        );

        list.entries.push({
          id:
            uid(
              "hopper-pick"
            ),

          itemName,

          merchantName,

          merchantId:
            merchant.id,

          suggestedCategory:
            category,

          itemId:
            item.id,

          note:
            hopperNote
        });

        saveState();

        closeModal();

        renderAll();
      }
    });
  }

  /* ============================================================
     DECORATE HOPPER PROFILE
     Existing Hopper renderer is already mostly generic.
     This swaps in each persona's chosen emoji.
     ============================================================ */

  function refreshDynamicHopperDisplay() {
    if (
      ui.persona !==
      "hopper"
    ) {
      return;
    }

    const hopper =
      getCurrentHopper();

    if (!hopper) {
      return;
    }

    const avatar =
      document.querySelector(
        ".hopper-avatar"
      );

    if (avatar) {
      avatar.textContent =
        hopper.avatar ||
        (
          hopper.id ===
            "hopper-surfer"
            ? "🏄"
            : "✨"
        );
    }

    const picks =
      document.querySelector(
        ".hopper-picks"
      );

    const list =
      getCurrentHopperList();

    if (
      picks &&
      list &&
      Array.isArray(
        list.entries
      ) &&
      list.entries.length ===
        0 &&
      !picks.querySelector(
        ".hopper-empty-picks"
      )
    ) {
      picks.innerHTML = `
        <div class="hopper-empty-picks">

          <strong>
            No local finds yet.
          </strong>

          <span>
            Use + Add Local Find to start this persona's curated list.
          </span>

        </div>
      `;
    }
  }

  /* ============================================================
     EVENTS
     ============================================================ */

  document.addEventListener(
    "click",
    event => {
      const addPersona =
        event.target.closest(
          '[data-persona-builder="add"]'
        );

      if (addPersona) {
        openAddHopperPersona();

        return;
      }

      /*
       * The original Surfer extension has its own
       * Add Local Find handler.
       *
       * For any user-created Hopper we intercept
       * that click and use the generic version.
       */
      const addFind =
        event.target.closest(
          '[data-action="hopper-add-local-find"]'
        );

      if (
        addFind &&
        ui.persona ===
          "hopper" &&
        ui.selectedHopperId &&
        ui.selectedHopperId !==
          "hopper-surfer"
      ) {
        event.preventDefault();

        event.stopImmediatePropagation();

        openDynamicHopperFind();
      }
    },
    true
  );

/* ============================================================
   REFRESH HOPPER DISPLAY SAFELY
   No MutationObserver — avoids render loops.
   ============================================================ */

const originalRenderAllDynamicPersona =
  renderAll;

renderAll =
  function renderAllWithDynamicPersonaDisplay() {
    originalRenderAllDynamicPersona();

    if (
      ui.persona ===
      "hopper"
    ) {
      requestAnimationFrame(
        () => {
          refreshDynamicHopperDisplay();
        }
      );
    }
  };

  /* ============================================================
     INITIALIZE
     ============================================================ */

installPersonaButton();

renderPersonaSelect();

if (
  ui.persona ===
  "hopper"
) {
  refreshDynamicHopperDisplay();
}
})();