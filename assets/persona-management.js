(() => {
  "use strict";

  if (
    window.__shopHopperPersonaManagementInstalled
  ) {
    return;
  }

  window.__shopHopperPersonaManagementInstalled =
    true;

  const PROTECTED_HOPPER_ID =
    "hopper-surfer";

  /* ============================================================
     HELPERS
     ============================================================ */

  function findManagedHopper(
    hopperId
  ) {
    if (
      !Array.isArray(
        state.hoppers
      )
    ) {
      return null;
    }

    return (
      state.hoppers.find(
        hopper =>
          hopper.id ===
          hopperId
      ) ||
      null
    );
  }

  function findManagedHopperList(
    hopperId
  ) {
    if (
      !Array.isArray(
        state.hopperLists
      )
    ) {
      return null;
    }

    return (
      state.hopperLists.find(
        list =>
          list.hopperId ===
          hopperId
      ) ||
      null
    );
  }

  function findMarketplaceForPersona(
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
     ADD MANAGEMENT CONTROLS TO CURRENT HOPPER
     ============================================================ */

  function installHopperManagementControls() {
    if (
      ui.persona !==
      "hopper"
    ) {
      return;
    }

    const card =
      document.querySelector(
        ".hopper-profile-card"
      );

    if (!card) {
      return;
    }

    const oldControls =
      card.querySelector(
        ".hopper-manage-actions"
      );

    if (oldControls) {
      oldControls.remove();
    }

    const hopper =
      findManagedHopper(
        ui.selectedHopperId
      );

    if (!hopper) {
      return;
    }

    /*
     * Hopper 0 stays protected as our
     * permanent seed/demo persona.
     */
    if (
      hopper.id ===
      PROTECTED_HOPPER_ID
    ) {
      card.insertAdjacentHTML(
        "beforeend",
        `
          <div
            class="hopper-manage-actions"
          >
            <span
              class="hopper-seed-badge"
              title="This is the protected Shop Hopper seed persona"
            >
              <i class="fa-solid fa-lock"></i>
              Seed Persona
            </span>
          </div>
        `
      );

      return;
    }

    card.insertAdjacentHTML(
      "beforeend",
      `
        <div
          class="hopper-manage-actions"
        >
          <button
            type="button"
            class="
              hopper-manage-button
              hopper-manage-edit
            "
            data-hopper-manage="edit"
            data-hopper-id="${escapeHtml(
              hopper.id
            )}"
          >
            <i class="fa-solid fa-pen"></i>
            &nbsp;
            Edit Persona
          </button>

          <button
            type="button"
            class="
              hopper-manage-button
              hopper-manage-delete
            "
            data-hopper-manage="delete"
            data-hopper-id="${escapeHtml(
              hopper.id
            )}"
          >
            <i class="fa-solid fa-trash"></i>
            &nbsp;
            Delete Persona
          </button>
        </div>
      `
    );
  }

  /* ============================================================
     EDIT PERSONA
     ============================================================ */

  function openEditHopperPersona(
    hopperId
  ) {
    const hopper =
      findManagedHopper(
        hopperId
      );

    if (!hopper) {
      return;
    }

    if (
      hopper.id ===
      PROTECTED_HOPPER_ID
    ) {
      alert(
        "Hopper 0 — The Surfer is the protected seed persona."
      );

      return;
    }

    const list =
      findManagedHopperList(
        hopper.id
      );

    const interests =
      Array.isArray(
        hopper.interests
      )
        ? hopper.interests.join(
            ", "
          )
        : "";

    openModal({
      title:
        "Edit Hopper Persona",

      submitLabel:
        "Save Changes",

      body: `
        <div class="notice">
          Update this Hopper's personality,
          interests and curated list.
        </div>

        <div class="form-grid">

          <div class="field">

            <label>
              Persona name
            </label>

            <input
              name="personaName"
              required
              value="${escapeHtml(
                hopper.personaName ||
                ""
              )}"
            />

          </div>

          <div class="field">

            <label>
              Avatar emoji
            </label>

            <input
              name="avatar"
              maxlength="8"
              value="${escapeHtml(
                hopper.avatar ||
                "✨"
              )}"
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
                hopper.marketplaceSlug ||
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
              value="${escapeHtml(
                interests
              )}"
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
              value="${escapeHtml(
                list?.title ||
                ""
              )}"
            />

          </div>

          <div class="field full">

            <label>
              List description
            </label>

            <textarea
              name="listDescription"
              placeholder="Describe this Hopper's local list..."
            >${escapeHtml(
              list?.description ||
              ""
            )}</textarea>

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
          findMarketplaceForPersona(
            marketplaceSlug
          );

        hopper.personaName =
          personaName;

        hopper.avatar =
          avatar;

        hopper.marketplaceSlug =
          marketplace.slug;

        hopper.marketplaceName =
          marketplace.name;

        hopper.interests =
          interests.length
            ? interests
            : [
                "Local Finds"
              ];

        if (list) {
          list.title =
            listTitle;

          list.description =
            listDescription;
        }

        saveState();

        closeModal();

        renderAll();
      }
    });
  }

  /* ============================================================
     DELETE PERSONA
     ============================================================ */

  function deleteHopperPersona(
    hopperId
  ) {
    const hopper =
      findManagedHopper(
        hopperId
      );

    if (!hopper) {
      return;
    }

    if (
      hopper.id ===
      PROTECTED_HOPPER_ID
    ) {
      alert(
        "Hopper 0 — The Surfer cannot be deleted."
      );

      return;
    }

    const list =
      findManagedHopperList(
        hopper.id
      );

    const pickCount =
      Array.isArray(
        list?.entries
      )
        ? list.entries.length
        : 0;

    const approved =
      confirm(
        `Delete "${hopper.personaName}"?\n\n` +
        `This will remove the Hopper profile and its curated list` +
        ` (${pickCount} ${pickCount === 1 ? "pick" : "picks"}).\n\n` +
        "Merchants, stores and products already added by this Hopper will remain in Shop Hopper."
      );

    if (!approved) {
      return;
    }

    state.hoppers =
      state.hoppers.filter(
        candidate =>
          candidate.id !==
          hopper.id
      );

    state.hopperLists =
      state.hopperLists.filter(
        candidate =>
          candidate.hopperId !==
          hopper.id
      );

    /*
     * Return to the protected Surfer persona.
     */
    ui.persona =
      "hopper";

    ui.selectedHopperId =
      PROTECTED_HOPPER_ID;

    saveState();

    renderAll();
  }

  /* ============================================================
     BUTTON EVENTS
     ============================================================ */

  document.addEventListener(
    "click",
    event => {
      const button =
        event.target.closest(
          "[data-hopper-manage]"
        );

      if (!button) {
        return;
      }

      const action =
        button.dataset
          .hopperManage;

      const hopperId =
        button.dataset
          .hopperId;

      if (
        action ===
        "edit"
      ) {
        openEditHopperPersona(
          hopperId
        );

        return;
      }

      if (
        action ===
        "delete"
      ) {
        deleteHopperPersona(
          hopperId
        );
      }
    }
  );

  /* ============================================================
     SAFE RENDER HOOK
     No MutationObserver.
     ============================================================ */

  const previousRenderAllPersonaManagement =
    renderAll;

  renderAll =
    function renderAllWithPersonaManagement() {
      previousRenderAllPersonaManagement();

      if (
        ui.persona ===
        "hopper"
      ) {
        requestAnimationFrame(
          () => {
            installHopperManagementControls();
          }
        );
      }
    };

  /*
   * Handle the Hopper already visible when
   * this script first loads.
   */
  requestAnimationFrame(
    () => {
      installHopperManagementControls();
    }
  );
})();