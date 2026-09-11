(() => {
  "use strict";

  if (
    window.__shopHopperPrototypeHelpInstalled
  ) {
    return;
  }

  window.__shopHopperPrototypeHelpInstalled =
    true;

  /* ============================================================
     INSTALL HELP BUTTON
     ============================================================ */

  function installPrototypeHelpButton() {
    if (
      document.querySelector(
        "[data-prototype-help]"
      )
    ) {
      return;
    }

    const demoBar =
      document.querySelector(
        ".demo-bar"
      );

    if (!demoBar) {
      return;
    }

    const button =
      document.createElement(
        "button"
      );

    button.type =
      "button";

    button.className =
      "prototype-help-button";

    button.dataset.prototypeHelp =
      "open";

    button.innerHTML = `
      <i class="fa-solid fa-circle-question"></i>
      &nbsp;
      Prototype Help
    `;

    /*
     * Place Help near the persona controls
     * when possible.
     */
    const personaButton =
      demoBar.querySelector(
        ".add-hopper-persona-button"
      );

    const personaSelect =
      document.getElementById(
        "personaSelect"
      );

    if (
      personaButton &&
      personaButton.parentNode ===
        demoBar
    ) {
      personaButton.insertAdjacentElement(
        "afterend",
        button
      );

      return;
    }

    if (
      personaSelect &&
      personaSelect.parentNode ===
        demoBar
    ) {
      personaSelect.insertAdjacentElement(
        "afterend",
        button
      );

      return;
    }

    demoBar.appendChild(
      button
    );
  }

  /* ============================================================
     OPEN HELP
     ============================================================ */

  function openPrototypeHelp() {
    openModal({
      title:
        "Shop Hopper Help",

      submitLabel:
        null,

      body: `
        <div class="prototype-help-intro">
          Shop Hopper uses one shared catalog. Anyone can browse the
          current merchants, stores, items, Hoppers and curated lists.
          Use the <strong>Prototype Persona</strong> menu to explore
          the Shopper, Hopper, Merchant and Admin views.
        </div>

        <div class="prototype-help-grid">
          <section class="prototype-help-card">
            <h3><span class="prototype-help-icon"><i class="fa-solid fa-eye"></i></span>Viewing shared data</h3>
            <p>Anonymous visitors are read-only. Shared updates appear automatically in other open copies of the app through realtime sync.</p>
          </section>

          <section class="prototype-help-card">
            <h3><span class="prototype-help-icon"><i class="fa-solid fa-user-check"></i></span>Approved editors</h3>
            <p>Select <strong>Team sign in</strong> and use an approved team email. Editors can create, update and delete shared merchants, stores, items, Hoppers, lists and picks.</p>
          </section>

          <section class="prototype-help-card">
            <h3><span class="prototype-help-icon"><i class="fa-solid fa-person-running"></i></span>Hoppers &amp; local finds</h3>
            <p>Each Hopper has an independent curated list. Search the shared catalog before creating a new local find; multiple Hoppers may recommend the same item.</p>
          </section>

          <section class="prototype-help-card">
            <h3><span class="prototype-help-icon"><i class="fa-solid fa-store"></i></span>Shopper &amp; Merchant views</h3>
            <p>Browse products and maps as a Shopper, or select a Merchant persona to review stores, inventory, storefront previews and publishing controls.</p>
          </section>

          <section class="prototype-help-card prototype-help-card-wide">
            <h3><span class="prototype-help-icon"><i class="fa-solid fa-floppy-disk"></i></span>Export, Import &amp; offline use</h3>
            <p><strong>Export Data</strong> downloads a backup. <strong>Import Data</strong> is available only to approved editors and reconciles the shared database. Browser storage is an offline/cache fallback, not a separate source of truth.</p>
          </section>
        </div>

        <div class="prototype-help-tip">
          <strong>Good to know:</strong> The status at the top always shows whether you are viewing shared data or signed in as an editor.
        </div>

        <div class="prototype-help-warning">
          <strong>Shared environment:</strong> Changes made by approved editors are visible to everyone using the app. Avoid entering sensitive or private customer information.
        </div>
      `
    });
  }

  /* ============================================================
     EVENTS
     ============================================================ */

  document.addEventListener(
    "click",
    event => {
      const button =
        event.target.closest(
          '[data-prototype-help="open"]'
        );

      if (!button) {
        return;
      }

      openPrototypeHelp();
    }
  );

  installPrototypeHelpButton();
})();



  document.addEventListener("keydown", event => {
    const card = event.target.closest?.(".hopper-pick-card-clickable");
    if (!card || (event.key !== "Enter" && event.key !== " ")) return;
    event.preventDefault();
    card.click();
  });
