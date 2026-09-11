  (() => {
    function addHopperBottomNav() {
      const page =
        document.querySelector(
          ".hopper-page"
        );

      if (!page) {
        return;
      }

      if (
        page.querySelector(
          ".hopper-bottom-nav"
        )
      ) {
        return;
      }

      page.insertAdjacentHTML(
        "beforeend",
        `
          <nav class="hopper-bottom-nav">

            <button
              type="button"
              class="hopper-bottom-button active"
              data-hopper-nav="home"
              title="Hopper Home"
              aria-label="Hopper Home"
            >
              <span class="hopper-bottom-icon">
                <i class="fa-solid fa-house"></i>
              </span>
            </button>

            <button
              type="button"
              class="hopper-bottom-button"
              data-hopper-nav="add"
              title="Add Local Find"
              aria-label="Add Local Find"
            >
              <span class="hopper-bottom-icon">
                <i class="fa-solid fa-plus"></i>
              </span>
            </button>

            <button
              type="button"
              class="hopper-bottom-button"
              data-hopper-nav="map"
              title="Map"
              aria-label="Map"
            >
              <span class="hopper-bottom-icon">
                <i class="fa-regular fa-map"></i>
              </span>
            </button>

            <button
              type="button"
              class="hopper-bottom-button"
              data-hopper-nav="shopper"
              title="Shopper View"
              aria-label="Shopper View"
            >
              <span class="hopper-bottom-icon">
                <i class="fa-solid fa-user"></i>
              </span>
            </button>

          </nav>
        `
      );
    }

    document.addEventListener(
      "click",
      event => {
        const button =
          event.target.closest(
            "[data-hopper-nav]"
          );

        if (!button) {
          return;
        }

        const action =
          button.dataset.hopperNav;

        if (
          action === "home"
        ) {
          window.scrollTo({
            top: 0,
            behavior: "smooth"
          });

          return;
        }

        if (
          action === "add"
        ) {
          document
            .querySelector(
              '[data-action="hopper-add-local-find"]'
            )
            ?.click();

          return;
        }

        if (
          action === "map"
        ) {
          ui.persona =
            "shopper";

          ui.shopperView =
            "map";

          ui.selectedMapMarketplace =
            ui.marketplaceSlug;

          renderAll();

          return;
        }

        if (
          action === "shopper"
        ) {
          ui.persona =
            "shopper";

          ui.shopperView =
            "home";

          renderAll();
        }
      }
    );

    const observer =
      new MutationObserver(
        () => {
          addHopperBottomNav();
        }
      );

    observer.observe(
      document.getElementById(
        "app"
      ),
      {
        childList: true,
        subtree: true
      }
    );

    addHopperBottomNav();
  })();