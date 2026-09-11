
    "use strict";

    // ============================================================
    // CONFIG
    // ============================================================

    const STORAGE_KEY =
      "shop-hopper-pacific-beach-prototype-v2";

    /*
     * Leave blank for now.
     *
     * When we create a separate restricted development
     * Google Maps API key, paste it between the quotes.
     *
     * The app will then automatically use Google Maps
     * instead of Leaflet on the Marketplaces screen.
     */
    const GOOGLE_MAPS_API_KEY = "";

    const DEFAULT_LOCATION = {
      lat: 32.79618,
      lng: -117.25718,
      label: "Pacific Beach, San Diego, CA"
    };

    const CATEGORIES = [
      {
        id: "all",
        label: "all",
        icon: "fa-solid fa-layer-group"
      },
      {
        id: "hardware",
        label: "hardware",
        icon: "fa-solid fa-hammer"
      },
      {
        id: "fashion",
        label: "fashion",
        icon: "fa-solid fa-person-dress"
      },
      {
        id: "music",
        label: "music",
        icon: "fa-solid fa-music"
      },
      {
        id: "seasonal",
        label: "seasonal",
        icon: "fa-solid fa-sun"
      },
      {
        id: "home",
        label: "home",
        icon: "fa-solid fa-couch"
      },
      {
        id: "auto",
        label: "auto",
        icon: "fa-solid fa-car"
      },
      {
        id: "labor",
        label: "labor",
        icon: "fa-solid fa-gears"
      },
      {
        id: "fitness",
        label: "fitness",
        icon: "fa-solid fa-dumbbell"
      },
      {
        id: "grocery",
        label: "grocery",
        icon: "fa-solid fa-cart-shopping"
      }
    ];

    const MARKETPLACES = [
      {
        slug: "pacific-beach",
        name: "Pacific Beach",
        lat: 32.79618,
        lng: -117.25718
      },
      {
        slug: "la-jolla",
        name: "La Jolla",
        lat: 32.8328,
        lng: -117.2713
      },
      {
        slug: "coronado",
        name: "Coronado",
        lat: 32.6859,
        lng: -117.1831
      },
      {
        slug: "escondido",
        name: "Escondido",
        lat: 33.1192,
        lng: -117.0864
      }
    ];

    const PRODUCT_PLACEHOLDER =
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80";

    // ============================================================
    // SEED DATA
    // ============================================================

    function createSeedData() {
      return {
        userLocation: {
          ...DEFAULT_LOCATION
        },

        merchants: [
          {
            id: "merchant-mission-surf",
            businessName: "Mission Surf",
            ownerName: "Mission Surf Team",
            email: "prototype@missionsurf.local",
            phone: "(858) 483-8837",
            status: "active"
          },

          {
            id: "merchant-south-coast",
            businessName: "South Coast Surf Shops",
            ownerName: "South Coast Team",
            email: "prototype@southcoast.local",
            phone: "(858) 273-7600",
            status: "active"
          },

          {
            id: "merchant-sun-diego",
            businessName: "Sun Diego Boardshop",
            ownerName: "Sun Diego Team",
            email: "prototype@sundiego.local",
            phone: "(760) 932-0337",
            status: "active"
          }
        ],

        stores: [
          {
            id: "store-mission-surf",
            merchantId: "merchant-mission-surf",
            name: "Mission Surf Shop",

            description:
              "Serving San Diego since 1968. Surf gear, apparel, accessories and rentals.",

            address:
              "4320 Mission Boulevard, San Diego, CA 92109",

            marketplaceSlug:
              "pacific-beach",

            category:
              "fashion",

            lat: 32.7940,
            lng: -117.2550,

            published: true
          },

          {
            id: "store-south-coast-wahines",
            merchantId: "merchant-south-coast",

            name:
              "South Coast Wahines — Pacific Beach",

            description:
              "Pacific Beach surf and beachwear shop featuring apparel, accessories and surf lifestyle merchandise.",

            address:
              "4500 Ocean Blvd, San Diego, CA 92109",

            marketplaceSlug:
              "pacific-beach",

            category:
              "fashion",

            lat: 32.7961711,
            lng: -117.2566854,

            published: true
          },

          {
            id: "store-sun-diego-pb",
            merchantId: "merchant-sun-diego",

            name:
              "Sun Diego — Pacific Beach",

            description:
              "Surf, skate, apparel and beach essentials from a local San Diego boardshop.",

            address:
              "1670 Garnet Ave, San Diego, CA 92109",

            marketplaceSlug:
              "pacific-beach",

            category:
              "seasonal",

            lat: 32.8002,
            lng: -117.2368,

            published: true
          }
        ],

        items: [
          {
            id: "item-mission-surf-hoodie",
            storeId: "store-mission-surf",

            title:
              "Surfer Club Tan Hoodie",

            description:
              "Mission Surf branded Surfer Club tan hoodie.",

            category:
              "fashion",

            type:
              "product",

            priceCents:
              6400,

            qty:
              10,

            image:
              "https://img1.wsimg.com/isteam/ip/f787776b-c18b-4dda-922e-a0299edf95ff/ols/AJL05631.jpg/:/rs=w:600,h:600/:/rs=w:480,cg:true,m",

            featured:
              true,

            active:
              true
          },

          {
            id: "item-south-coast-towel",
            storeId: "store-south-coast-wahines",

            title:
              "South Coast Deep Blue Towel",

            description:
              "South Coast beach towel for a day at the beach, pool or surf break.",

            category:
              "seasonal",

            type:
              "product",

            priceCents:
              3699,

            qty:
              10,

            image:
              "https://www.hitpromo.net/imageManager/show/8093_BLU_Open.jpg",

            featured:
              true,

            active:
              true
          },

          {
            id: "item-sun-diego-sunscreen",
            storeId: "store-sun-diego-pb",

            title:
              "Sun Bum Original SPF 70 Sunscreen Lotion",

            description:
              "Sun Bum Original SPF 70 sunscreen lotion for high-protection beach days.",

            category:
              "seasonal",

            type:
              "product",

            priceCents:
              1849,

            qty:
              12,

            image:
              "https://sundiego.com/cdn/shop/files/SB_Original_SPF_70_Lotion_8_OZ_PIH_650x_0162e76f-a1d4-4cb3-aa37-b44e82de9d75.jpg?v=1718905389",

            featured:
              true,

            active:
              true
          }
        ]
      };
    }

    // ============================================================
    // STATE
    // ============================================================

    let state =
      loadState();

    const ui = {
      persona:
        "shopper",

      selectedMerchantId:
        state.merchants[0]?.id || null,

      merchantStoreId:
        null,

      shopperView:
        "home",

      marketplaceSlug:
        "pacific-beach",

      selectedMapMarketplace:
        "pacific-beach",

      category:
        "all",

      search:
        "",

      radiusMiles:
        3,

      inventoryTab:
        "active"
    };

    let modalSubmitHandler =
      null;

    let modalReturnFocus =
      null;

    let activeMap =
      null;

    let activeMapEngine =
      null;

    let googleMapsPromise =
      null;

    // ============================================================
    // HELPERS
    // ============================================================

    function loadState() {
      try {
        const raw =
          localStorage.getItem(STORAGE_KEY);

        if (!raw) {
          return createSeedData();
        }

        const parsed =
          JSON.parse(raw);

        if (
          !Array.isArray(parsed.merchants) ||
          !Array.isArray(parsed.stores) ||
          !Array.isArray(parsed.items)
        ) {
          return createSeedData();
        }

        return parsed;
      } catch (error) {
        console.warn(
          "Could not load prototype data.",
          error
        );

        return createSeedData();
      }
    }

    function saveState() {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(state)
      );
    }

    function uid(prefix) {
      if (crypto?.randomUUID) {
        return `${prefix}-${crypto.randomUUID()}`;
      }

      return `${prefix}-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2)}`;
    }

    function escapeHtml(value) {
      return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
    }

    function normalizeCategory(value) {
      return String(value ?? "")
        .trim()
        .toLowerCase();
    }

    function titleCase(value) {
      return String(value ?? "")
        .split(/[\s-]+/)
        .filter(Boolean)
        .map(
          word =>
            word[0].toUpperCase() +
            word.slice(1)
        )
        .join(" ");
    }

    function money(cents) {
      return new Intl.NumberFormat(
        "en-US",
        {
          style: "currency",
          currency: "USD"
        }
      ).format(
        Number(cents || 0) / 100
      );
    }

    function safeUrl(value) {
      try {
        const url =
          new URL(String(value));

        if (
          url.protocol === "https:" ||
          url.protocol === "http:"
        ) {
          return url.href;
        }
      } catch {
        // use placeholder
      }

      return PRODUCT_PLACEHOLDER;
    }

    function haversineMiles(
      lat1,
      lng1,
      lat2,
      lng2
    ) {
      const earthRadius =
        3958.8;

      const toRad =
        value =>
          value *
          Math.PI /
          180;

      const dLat =
        toRad(lat2 - lat1);

      const dLng =
        toRad(lng2 - lng1);

      const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) *
          Math.cos(toRad(lat2)) *
          Math.sin(dLng / 2) ** 2;

      const c =
        2 *
        Math.atan2(
          Math.sqrt(a),
          Math.sqrt(1 - a)
        );

      return earthRadius * c;
    }

    function distanceLabel(distance) {
      const miles =
        Number(distance);

      if (!Number.isFinite(miles)) {
        return "";
      }

      if (miles < 0.1) {
        return "< 0.1 mi";
      }

      return `${miles.toFixed(1)} mi`;
    }

    function getMerchant(id) {
      return state.merchants.find(
        merchant =>
          merchant.id === id
      );
    }

    function getStore(id) {
      return state.stores.find(
        store =>
          store.id === id
      );
    }

    function getItem(id) {
      return state.items.find(
        item =>
          item.id === id
      );
    }

    function getMerchantStores(
      merchantId
    ) {
      return state.stores.filter(
        store =>
          store.merchantId ===
          merchantId
      );
    }

    function getStoreItems(storeId) {
      return state.items.filter(
        item =>
          item.storeId === storeId
      );
    }

    function selectedMerchant() {
      return getMerchant(
        ui.selectedMerchantId
      );
    }

    function selectedMarketplace() {
      return MARKETPLACES.find(
        marketplace =>
          marketplace.slug ===
          ui.selectedMapMarketplace
      ) || MARKETPLACES[0];
    }

    function selectedShoppingMarketplace() {
      return MARKETPLACES.find(
        marketplace =>
          marketplace.slug ===
          ui.marketplaceSlug
      ) || MARKETPLACES[0];
    }

    function getStoreDistance(store) {
      return haversineMiles(
        state.userLocation.lat,
        state.userLocation.lng,
        Number(store.lat),
        Number(store.lng)
      );
    }

    function marketplaceDistance(
      marketplace
    ) {
      return haversineMiles(
        state.userLocation.lat,
        state.userLocation.lng,
        marketplace.lat,
        marketplace.lng
      );
    }

    function marketplaceLabel(store) {
      return titleCase(
        store?.marketplaceSlug ||
        "local"
      );
    }

    // ============================================================
    // DOM
    // ============================================================

    const app =
      document.getElementById("app");

    const personaSelect =
      document.getElementById(
        "personaSelect"
      );

    const modalBackdrop =
      document.getElementById(
        "modalBackdrop"
      );

    const modalForm =
      document.getElementById(
        "modalForm"
      );

    const modalTitle =
      document.getElementById(
        "modalTitle"
      );

    const modalBody =
      document.getElementById(
        "modalBody"
      );

    const modalFooter =
      document.getElementById(
        "modalFooter"
      );

    const modalSubmit =
      document.getElementById(
        "modalSubmit"
      );

    // ============================================================
    // MODAL
    // ============================================================

    function supportsDirectMobileCamera() {
      const userAgent =
        navigator.userAgent ||
        "";

      const mobileOrTablet =
        /Android|iPhone|iPad|iPod/i.test(
          userAgent
        );

      const iPadDesktopMode =
        /Macintosh/i.test(
          userAgent
        ) &&
        navigator.maxTouchPoints >
          1;

      return (
        mobileOrTablet ||
        iPadDesktopMode
      );
    }

    function enhanceModalImageField() {
      const imageUrlInput =
        modalBody.querySelector(
          'input[name="image"]'
        );

      if (
        !imageUrlInput ||
        modalBody.querySelector(
          'input[name="imageCameraFile"], input[name="imageLibraryFile"]'
        )
      ) {
        return;
      }

      const uploadField =
        document.createElement(
          "div"
        );

      uploadField.className =
        "field full image-upload-field";

      uploadField.innerHTML = `
        <label>
          Item photo
          <span class="field-optional">
            (optional)
          </span>
        </label>

        <div class="image-upload-options">
          <label class="image-upload-option">
            <strong>
              <i class="fa-solid fa-camera"></i>
              Take Photo
            </strong>
            <input
              name="imageCameraFile"
              type="file"
              accept="image/*"
              capture="environment"
            />
          </label>

          <label class="image-upload-option">
            <strong>
              <i class="fa-solid fa-images"></i>
              Choose Existing Photo
            </strong>
            <input
              name="imageLibraryFile"
              type="file"
              accept="image/*"
            />
          </label>
        </div>

        <div
          class="image-upload-status"
          aria-live="polite"
        >
          No photo selected
        </div>

        <div class="image-upload-help">
          Take Photo opens the rear camera on supported phones.
          Either choice takes priority over the Image URL.
        </div>

        <img
          class="image-upload-preview"
          alt="Selected item photo preview"
          hidden
        />

        <div
          class="image-photo-editor"
          hidden
        >
          <div class="image-crop-stage">
            <canvas
              class="image-crop-canvas"
              width="1200"
              height="1200"
              aria-label="Photo crop preview"
            ></canvas>
          </div>

          <div class="image-crop-controls">
            <label class="image-crop-zoom">
              <span>Zoom</span>
              <input
                type="range"
                min="1"
                max="3"
                step="0.05"
                value="1"
              />
            </label>

            <div class="image-crop-actions">
              <button
                type="button"
                class="image-crop-action"
                data-photo-editor-rotate
              >
                <i class="fa-solid fa-rotate-right"></i>
                Rotate
              </button>

              <button
                type="button"
                class="image-crop-action"
                data-photo-editor-reset
              >
                <i class="fa-solid fa-arrow-rotate-left"></i>
                Reset
              </button>

              <button
                type="button"
                class="image-crop-mode"
                data-photo-editor-mode
              >
                Use Full Photo
              </button>
            </div>
          </div>

          <p class="image-crop-hint">
            Drag the photo to position the item inside the square.
          </p>
        </div>
      `;

      if (
        !supportsDirectMobileCamera()
      ) {
        uploadField.classList.add(
          "desktop-photo-choice"
        );

        uploadField
          .querySelector(
            'input[name="imageCameraFile"]'
          )
          ?.closest(
            ".image-upload-option"
          )
          ?.remove();

        const help =
          uploadField.querySelector(
            ".image-upload-help"
          );

        if (help) {
          help.textContent =
            "Choose a saved photo to crop before uploading. The photo takes priority over the Image URL.";
        }
      }

      imageUrlInput
        .closest(".field")
        ?.insertAdjacentElement(
          "afterend",
          uploadField
        );
    }

    modalBody.addEventListener(
      "change",
      event => {
        if (
          ![
            "imageCameraFile",
            "imageLibraryFile"
          ].includes(
            event.target.name
          )
        ) {
          return;
        }

        const preview =
          modalBody.querySelector(
            ".image-upload-preview"
          );

        if (!preview) {
          return;
        }

        if (
          modalForm.dataset.imagePreviewUrl
        ) {
          URL.revokeObjectURL(
            modalForm.dataset.imagePreviewUrl
          );
        }

        const file =
          event.target.files?.[0];

        const otherFileInput =
          modalBody.querySelector(
            event.target.name ===
              "imageCameraFile"
              ? 'input[name="imageLibraryFile"]'
              : 'input[name="imageCameraFile"]'
          );

        if (file && otherFileInput) {
          otherFileInput.value =
            "";
        }

        const status =
          modalBody.querySelector(
            ".image-upload-status"
          );

        if (status) {
          status.textContent =
            file
              ? `Selected: ${file.name || "Photo"}`
              : "No photo selected";
        }

        if (!file) {
          preview.hidden =
            true;

          preview.removeAttribute(
            "src"
          );

          delete modalForm.dataset.imagePreviewUrl;

          return;
        }

        const previewUrl =
          URL.createObjectURL(
            file
          );

        modalForm.dataset.imagePreviewUrl =
          previewUrl;

        preview.src =
          previewUrl;

        preview.hidden =
          false;
      }
    );

    function openModal({
      title,
      body,
      submitLabel = "Save",
      onSubmit = null
    }) {
      modalReturnFocus =
        document.activeElement instanceof HTMLElement
          ? document.activeElement
          : null;

      modalTitle.textContent =
        title;

      modalBody.innerHTML =
        body;

      enhanceModalImageField();

      modalSubmitHandler =
        onSubmit;

      if (
        submitLabel &&
        typeof onSubmit === "function"
      ) {
        modalFooter.style.display =
          "flex";

        modalSubmit.textContent =
          submitLabel;
      } else {
        modalFooter.style.display =
          "none";
      }

      modalBackdrop.classList.add(
        "open"
      );

      modalBackdrop.setAttribute(
        "aria-hidden",
        "false"
      );

      document.body.classList.add(
        "modal-open"
      );

      requestAnimationFrame(() => {
        const usesOnScreenKeyboard =
          window.matchMedia(
            "(max-width: 760px), (pointer: coarse)"
          ).matches;

        if (usesOnScreenKeyboard) {
          /*
           * Keep the mobile keyboard closed until the user
           * deliberately taps a field.
           */
          modalClose.focus({
            preventScroll: true
          });

          return;
        }

        modalBody
          .querySelector(
            "input, select, textarea"
          )
          ?.focus();
      });
    }

    function closeModal() {
      modalBackdrop.classList.remove(
        "open"
      );

      modalBackdrop.setAttribute(
        "aria-hidden",
        "true"
      );

      document.body.classList.remove(
        "modal-open"
      );

      modalSubmitHandler =
        null;

      if (
        modalForm.dataset.imagePreviewUrl
      ) {
        URL.revokeObjectURL(
          modalForm.dataset.imagePreviewUrl
        );

        delete modalForm.dataset.imagePreviewUrl;
      }

      window.dispatchEvent(
        new Event(
          "shop-hopper-modal-closed"
        )
      );

      modalForm.reset();

      if (
        modalReturnFocus &&
        document.contains(
          modalReturnFocus
        )
      ) {
        modalReturnFocus.focus({
          preventScroll: true
        });
      }

      modalReturnFocus =
        null;
    }

    function announce(
      message,
      tone = "polite"
    ) {
      const region =
        document.getElementById(
          "appLiveStatus"
        );

      if (!region) {
        return;
      }

      region.setAttribute(
        "aria-live",
        tone
      );

      region.textContent =
        "";

      window.setTimeout(
        () => {
          region.textContent =
            message;
        },
        20
      );
    }

    document.addEventListener(
      "keydown",
      event => {
        if (
          !modalBackdrop.classList.contains(
            "open"
          )
        ) {
          return;
        }

        if (
          event.key ===
          "Escape"
        ) {
          event.preventDefault();
          closeModal();
          return;
        }

        if (
          event.key !==
          "Tab"
        ) {
          return;
        }

        const focusable =
          [
            ...modalForm.querySelectorAll(
              'button:not([disabled]):not([hidden]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [href], [tabindex]:not([tabindex="-1"])'
            )
          ].filter(
            element =>
              element.offsetParent !==
              null
          );

        if (!focusable.length) {
          event.preventDefault();
          modalForm.focus();
          return;
        }

        const first =
          focusable[0];

        const last =
          focusable[
            focusable.length - 1
          ];

        if (
          event.shiftKey &&
          document.activeElement ===
            first
        ) {
          event.preventDefault();
          last.focus();
        } else if (
          !event.shiftKey &&
          document.activeElement ===
            last
        ) {
          event.preventDefault();
          first.focus();
        }
      }
    );

    modalForm.addEventListener(
      "submit",
      async event => {
        event.preventDefault();

        if (
          typeof modalSubmitHandler !==
          "function"
        ) {
          return;
        }

        const imageFile =
          [
            ...modalForm.querySelectorAll(
              'input[name="imageCameraFile"], input[name="imageLibraryFile"]'
            )
          ]
            .map(
              input =>
                input.files?.[0]
            )
            .find(Boolean);

        const imageUrlInput =
          modalForm.querySelector(
            'input[name="image"]'
          );

        if (imageFile) {
          if (
            typeof window.shopHopperUploadImage !==
            "function"
          ) {
            alert(
              "Photo uploading is not ready yet. Please wait a moment and try again."
            );

            return;
          }

          const previousLabel =
            modalSubmit.textContent;

          modalSubmit.disabled =
            true;

          modalSubmit.textContent =
            "Uploading photo…";

          try {
            const photoToUpload =
              typeof window.shopHopperGetEditedPhoto ===
                "function"
                ? await window.shopHopperGetEditedPhoto(
                    imageFile
                  )
                : imageFile;

            const publicUrl =
              await window.shopHopperUploadImage(
                photoToUpload
              );

            if (imageUrlInput) {
              imageUrlInput.value =
                publicUrl;
            }
          } catch (error) {
            console.error(
              "Item photo upload failed.",
              error
            );

            alert(
              error.message ||
              "The photo could not be uploaded."
            );

            return;
          } finally {
            modalSubmit.disabled =
              false;

            modalSubmit.textContent =
              previousLabel;
          }
        }

        await modalSubmitHandler(
          modalForm
        );
      }
    );

    modalBackdrop.addEventListener(
      "click",
      event => {
        if (
          event.target ===
          modalBackdrop
        ) {
          closeModal();
        }
      }
    );

    // ============================================================
    // PERSONA
    // ============================================================

    function renderPersonaSelect() {
      const merchantOptions =
        state.merchants
          .map(
            merchant => `
              <option
                value="merchant:${escapeHtml(merchant.id)}"
                ${
                  ui.persona === "merchant" &&
                  ui.selectedMerchantId === merchant.id
                    ? "selected"
                    : ""
                }
              >
                Merchant — ${escapeHtml(merchant.businessName)}
              </option>
            `
          )
          .join("");

      personaSelect.innerHTML = `
        <option
          value="shopper"
          ${ui.persona === "shopper" ? "selected" : ""}
        >
          Shopper
        </option>

        <option
          value="admin"
          ${ui.persona === "admin" ? "selected" : ""}
        >
          Demo Admin — Manage Merchants
        </option>

        ${merchantOptions}
      `;
    }

    personaSelect.addEventListener(
      "change",
      event => {
        const value =
          event.target.value;

        disposeMap();

        if (
          value === "shopper"
        ) {
          ui.persona =
            "shopper";

          ui.shopperView =
            "home";
        } else if (
          value === "admin"
        ) {
          ui.persona =
            "admin";
        } else if (
          value.startsWith(
            "merchant:"
          )
        ) {
          ui.persona =
            "merchant";

          ui.selectedMerchantId =
            value.slice(
              "merchant:".length
            );

          const stores =
            getMerchantStores(
              ui.selectedMerchantId
            );

          ui.merchantStoreId =
            stores[0]?.id ||
            null;
        }

        renderAll();
      }
    );

    // ============================================================
    // ROOT RENDER
    // ============================================================

    function renderAll() {
      renderPersonaSelect();

      disposeMap();

      if (
        ui.persona === "shopper"
      ) {
        renderShopper();
        return;
      }

      if (
        ui.persona === "admin"
      ) {
        renderAdmin();
        return;
      }

      renderMerchant();
    }

    // ============================================================
    // SHOPPER NAV
    // ============================================================

    function shopperBottomNav() {
      return `
        <nav class="shopper-bottom-nav">

          <button
            type="button"
            class="shopper-nav-button ${
              ui.shopperView === "home"
                ? "active"
                : ""
            }"
            data-action="shopper-home"
            aria-label="Home"
          >
            <span class="shopper-nav-icon">
              <i class="fa-solid fa-house"></i>
            </span>
          </button>

          <button
            type="button"
            class="shopper-nav-button ${
              ui.shopperView === "messages"
                ? "active"
                : ""
            }"
            data-action="shopper-messages"
            aria-label="Messages"
          >
            <span class="shopper-nav-icon">
              <i class="fa-solid fa-message"></i>
            </span>
          </button>

          <button
            type="button"
            class="shopper-nav-button ${
              ui.shopperView === "map"
                ? "active"
                : ""
            }"
            data-action="shopper-map"
            aria-label="Marketplaces"
          >
            <span class="shopper-nav-icon">
              <i class="fa-regular fa-map"></i>
            </span>
          </button>

          <button
            type="button"
            class="shopper-nav-button ${
              ui.shopperView === "profile"
                ? "active"
                : ""
            }"
            data-action="shopper-profile"
            aria-label="Profile"
          >
            <span class="shopper-nav-icon">
              <i class="fa-solid fa-user"></i>
            </span>
          </button>

        </nav>
      `;
    }

    function renderShopper() {
      switch (
        ui.shopperView
      ) {
        case "messages":
          renderMessages();
          break;

        case "map":
          renderMarketplaces();
          break;

        case "profile":
          renderProfile();
          break;

        default:
          renderShopperHome();
      }
    }

    // ============================================================
    // SHOPPER HOME
    // ============================================================

    function renderShopperHome() {
      app.innerHTML = `
        <section class="shopper-page">

          <div class="shopper-home-top">

            <div class="search-row">
              <div class="search-wrap">
                <i class="fa-solid fa-magnifying-glass"></i>

                <input
                  id="shopperSearch"
                  class="shopper-search"
                  type="search"
                  placeholder="Search nearby products..."
                  value="${escapeHtml(ui.search)}"
                />
              </div>

              <button
                type="button"
                class="filter-button"
                data-action="shopper-filter"
                title="Search radius"
              >
                <i class="fa-solid fa-filter"></i>
              </button>
            </div>

            <div class="category-row">
              ${CATEGORIES
                .map(
                  category => `
                    <button
                      type="button"
                      class="category-button ${
                        ui.category === category.id
                          ? "active"
                          : ""
                      }"
                      data-action="category"
                      data-category="${category.id}"
                    >
                      <i class="${category.icon}"></i>
                      <span>${escapeHtml(category.label)}</span>
                    </button>
                  `
                )
                .join("")}
            </div>

          </div>

          <div class="shopper-home-body">

            <div class="home-results-header">
              <h2>
                ${
                  ui.category === "all"
                    ? titleCase(
                        selectedShoppingMarketplace().name
                      )
                    : titleCase(
                        ui.category
                      )
                }
              </h2>

              <span
                id="shopperCount"
                class="result-count"
              ></span>
            </div>

            <div
              id="shopperResults"
            ></div>

          </div>

          ${shopperBottomNav()}

        </section>
      `;

      renderShopperResults();
    }

    function getVisibleShopperItems() {
      const search =
        ui.search
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
              merchant,
              distance:
                getStoreDistance(
                  store
                )
            };
          }
        )
        .filter(Boolean)
        .filter(
          result => {
            if (
              !result.store.published
            ) {
              return false;
            }

            if (
              !result.item.active
            ) {
              return false;
            }

            if (
              result.store.marketplaceSlug !==
              ui.marketplaceSlug
            ) {
              return false;
            }

            if (
              result.distance >
              ui.radiusMiles
            ) {
              return false;
            }

            if (
              ui.category !== "all" &&
              normalizeCategory(
                result.item.category
              ) !== ui.category
            ) {
              return false;
            }

            if (search) {
              const haystack = [
                result.item.title,
                result.item.description,
                result.item.category,
                result.store.name,
                result.merchant.businessName
              ]
                .join(" ")
                .toLowerCase();

              if (
                !haystack.includes(
                  search
                )
              ) {
                return false;
              }
            }

            return true;
          }
        )
        .sort(
          (a, b) => {
            if (
              a.item.featured !==
              b.item.featured
            ) {
              return a.item.featured
                ? -1
                : 1;
            }

            return (
              a.distance -
              b.distance
            );
          }
        );
    }

    function renderShopperResults() {
      const container =
        document.getElementById(
          "shopperResults"
        );

      const count =
        document.getElementById(
          "shopperCount"
        );

      if (
        !container ||
        !count
      ) {
        return;
      }

      const results =
        getVisibleShopperItems();

      count.textContent =
        `${results.length} ${
          results.length === 1
            ? "Item"
            : "Items"
        }`;

      if (
        !results.length
      ) {
        container.innerHTML = `
          <div class="empty-state">
            <div class="empty-state-inner">
              <h3>
                No items found near you.
              </h3>

              <button
                type="button"
                class="refresh-button"
                data-action="refresh-shopper"
              >
                Refresh
              </button>
            </div>
          </div>
        `;

        return;
      }

      container.innerHTML = `
        <div class="product-grid">
          ${results
            .map(
              ({
                item,
                store,
                distance
              }) => `
                <button
                  type="button"
                  class="product-card"
                  data-action="view-item"
                  data-id="${escapeHtml(item.id)}"
                >

                  <div class="product-image-wrap">

                    <img
                      class="product-image"
                      src="${escapeHtml(safeUrl(item.image))}"
                      alt="${escapeHtml(item.title)}"
                    />

                    ${
                      item.featured
                        ? `
                          <span class="featured-badge">
                            FEATURED
                          </span>
                        `
                        : ""
                    }

                  </div>

                  <div class="product-info">

                    <div class="product-title">
                      ${escapeHtml(item.title)}
                    </div>

                    <div class="product-price">
                      ${money(item.priceCents)}
                    </div>

                    <div class="product-store">
                      ${escapeHtml(store.name)}
                    </div>

                    <div class="neighborhood-pill">
                      <i class="fa-solid fa-location-dot"></i>
                      ${escapeHtml(marketplaceLabel(store))}
                    </div>

                    <div class="product-distance">
                      ${escapeHtml(distanceLabel(distance))}
                      ·
                      ${escapeHtml(titleCase(item.category))}
                    </div>

                  </div>

                </button>
              `
            )
            .join("")}
        </div>
      `;
    }

    // ============================================================
    // SHOPPER MESSAGES
    // ============================================================

    function renderMessages() {
      app.innerHTML = `
        <section class="shopper-page">

          <div class="messages-view">
            <strong>
              Chat is currently offline
            </strong>
          </div>

          ${shopperBottomNav()}

        </section>
      `;
    }

    // ============================================================
    // MARKETPLACES
    // ============================================================

    function renderMarketplaces() {
      const marketplace =
        selectedMarketplace();

      app.innerHTML = `
        <section class="shopper-page marketplaces-page">

          <header class="marketplaces-header">

            <button
              type="button"
              class="marketplace-back"
              data-action="shopper-home"
              aria-label="Back"
            >
              <i class="fa-solid fa-arrow-left"></i>
            </button>

            <div class="marketplaces-title">
              MARKETPLACES
            </div>

            <div></div>

          </header>

          <div class="market-map-wrap">

            <div
              id="marketplaceMap"
            ></div>

            <div class="map-instruction">
              <i class="fa-solid fa-circle-info"></i>
              &nbsp;
              Tap anywhere on the map to search for marketplaces near that area.
            </div>

            <div class="marketplace-strip">

              ${MARKETPLACES
                .map(
                  item => `
                    <button
                      type="button"
                      class="marketplace-card ${
                        ui.selectedMapMarketplace === item.slug
                          ? "selected"
                          : ""
                      }"
                      data-action="select-marketplace"
                      data-marketplace="${item.slug}"
                    >
                      <strong>
                        ${escapeHtml(item.name)}
                      </strong>

                      <span>
                        ${escapeHtml(
                          distanceLabel(
                            marketplaceDistance(
                              item
                            )
                          )
                        )} away
                      </span>
                    </button>
                  `
                )
                .join("")}

            </div>

          </div>

          <div class="marketplace-detail">

            <h2>
              ${escapeHtml(marketplace.name)}
            </h2>

            <p>
              Distance:
              ${escapeHtml(
                marketplaceDistance(
                  marketplace
                ).toFixed(2)
              )}
              miles
            </p>

            <button
              type="button"
              class="shop-marketplace-button"
              data-action="shop-selected-marketplace"
            >
              SHOP THIS MARKETPLACE
            </button>

          </div>

          ${shopperBottomNav()}

        </section>
      `;

      requestAnimationFrame(
        initializeMarketplaceMap
      );
    }

    function disposeMap() {
      if (
        activeMapEngine ===
          "leaflet" &&
        activeMap
      ) {
        try {
          activeMap.remove();
        } catch {
          // already gone
        }
      }

      activeMap =
        null;

      activeMapEngine =
        null;
    }

    async function loadGoogleMaps() {
      if (
        !GOOGLE_MAPS_API_KEY
      ) {
        return false;
      }

      if (
        window.google?.maps
      ) {
        return true;
      }

      if (
        googleMapsPromise
      ) {
        return googleMapsPromise;
      }

      googleMapsPromise =
        new Promise(
          (resolve, reject) => {
            const callbackName =
              `shopHopperGoogleMaps_${Date.now()}`;

            window[callbackName] =
              () => {
                delete window[
                  callbackName
                ];

                resolve(true);
              };

            const script =
              document.createElement(
                "script"
              );

            script.src =
              "https://maps.googleapis.com/maps/api/js" +
              `?key=${encodeURIComponent(GOOGLE_MAPS_API_KEY)}` +
              `&callback=${callbackName}`;

            script.async =
              true;

            script.defer =
              true;

            script.onerror =
              () => {
                delete window[
                  callbackName
                ];

                reject(
                  new Error(
                    "Google Maps failed to load"
                  )
                );
              };

            document.head.appendChild(
              script
            );
          }
        );

      try {
        await googleMapsPromise;
        return true;
      } catch {
        return false;
      }
    }

    async function initializeMarketplaceMap() {
      const mapElement =
        document.getElementById(
          "marketplaceMap"
        );

      if (
        !mapElement
      ) {
        return;
      }

      const marketplace =
        selectedMarketplace();

      const googleAvailable =
        await loadGoogleMaps();

      if (
        !document.getElementById(
          "marketplaceMap"
        )
      ) {
        return;
      }

      if (
        googleAvailable &&
        window.google?.maps
      ) {
        initializeGoogleMap(
          mapElement,
          marketplace
        );

        return;
      }

      initializeLeafletMap(
        mapElement,
        marketplace
      );
    }

    function initializeGoogleMap(
      mapElement,
      marketplace
    ) {
      disposeMap();

      activeMapEngine =
        "google";

      activeMap =
        new google.maps.Map(
          mapElement,
          {
            center: {
              lat:
                marketplace.lat,

              lng:
                marketplace.lng
            },

            zoom:
              12.5,

            mapTypeControl:
              false,

            streetViewControl:
              false,

            fullscreenControl:
              false
          }
        );

      const marker =
        new google.maps.Marker({
          map:
            activeMap,

          position: {
            lat:
              marketplace.lat,

            lng:
              marketplace.lng
          },

          title:
            marketplace.name
        });

      activeMap.addListener(
        "click",
        event => {
          const lat =
            event.latLng.lat();

          const lng =
            event.latLng.lng();

          selectNearestMarketplace(
            lat,
            lng
          );
        }
      );
    }

    function initializeLeafletMap(
      mapElement,
      marketplace
    ) {
      disposeMap();

      if (
        !window.L
      ) {
        mapElement.innerHTML = `
          <div class="empty-state">
            <div class="empty-state-inner">
              Map unavailable.
            </div>
          </div>
        `;

        return;
      }

      activeMapEngine =
        "leaflet";

      activeMap =
  L.map(
    mapElement,
    {
      zoomControl: true,
      zoomSnap: 0.5
    }
  ).setView(
    [
      marketplace.lat,
      marketplace.lng
    ],
    12.5
  );

      L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
          maxZoom:
            19,

          attribution:
            "&copy; OpenStreetMap contributors"
        }
      ).addTo(
        activeMap
      );

      L.marker([
        marketplace.lat,
        marketplace.lng
      ])
        .addTo(
          activeMap
        )
        .bindPopup(
          escapeHtml(
            marketplace.name
          )
        );

      activeMap.on(
        "click",
        event => {
          selectNearestMarketplace(
            event.latlng.lat,
            event.latlng.lng
          );
        }
      );

      setTimeout(
        () => {
          activeMap?.invalidateSize();
        },
        80
      );
    }

    function selectNearestMarketplace(
      lat,
      lng
    ) {
      const nearest =
        MARKETPLACES
          .map(
            marketplace => ({
              marketplace,

              distance:
                haversineMiles(
                  lat,
                  lng,
                  marketplace.lat,
                  marketplace.lng
                )
            })
          )
          .sort(
            (a, b) =>
              a.distance -
              b.distance
          )[0];

      if (
        nearest
      ) {
        ui.selectedMapMarketplace =
          nearest.marketplace.slug;

        renderMarketplaces();
      }
    }

    // ============================================================
    // PROFILE
    // ============================================================

    function renderProfile() {
      const favorites =
        state.items.slice(
          0,
          2
        );

      const followed =
        state.stores.filter(
          store =>
            store.published
        );

      app.innerHTML = `
        <section class="shopper-page">

          <div class="profile-page">

            <header class="profile-header">
              PROFILE
            </header>

            <section class="profile-section profile-user-card">

              <div class="profile-avatar">
                DE
              </div>

              <div>
                <h2>
                  Demo Customer
                </h2>

                <p>
                  customer@shophopper.com
                </p>

                <span class="business-badge">
                  Business Account
                </span>
              </div>

            </section>

            <section class="merchant-center">

              <div class="merchant-center-heading">
                <i class="fa-solid fa-store"></i>
                Merchant Center
              </div>

              <p>
                Are you a shop owner? Access your merchant dashboard to manage item inventory, configure shop details, and run bulk imports.
              </p>

              <button
                type="button"
                class="merchant-center-button"
                data-action="enter-merchant-portal"
              >
                <i class="fa-solid fa-border-all"></i>
                &nbsp;
                ENTER MERCHANT PORTAL
              </button>

            </section>

            <section class="profile-section">

              <div class="profile-list-heading">
                <span>
                  MY FAVORITES
                </span>

                <span>
                  ${favorites.length}
                  Items
                </span>
              </div>

              <div class="favorite-row">

                ${favorites
                  .map(
                    item => `
                      <img
                        src="${escapeHtml(safeUrl(item.image))}"
                        alt="${escapeHtml(item.title)}"
                      />
                    `
                  )
                  .join("")}

              </div>

            </section>

            <section class="profile-section">

              <div class="profile-list-heading">
                <span>
                  FOLLOWED STORES
                </span>

                <span>
                  ${followed.length}
                  Stores
                </span>
              </div>

              <div class="followed-stores">

                ${followed
                  .map(
                    store => `
                      <span class="followed-store-chip">
                        ${escapeHtml(store.name)}
                      </span>
                    `
                  )
                  .join("")}

              </div>

            </section>

          </div>

          ${shopperBottomNav()}

        </section>
      `;
    }

    // ============================================================
    // ADMIN
    // ============================================================

    function renderAdmin() {
      app.innerHTML = `
        <section class="admin-page">

          <div class="admin-top">

            <div>
              <h1>
                Merchant Accounts
              </h1>

              <p>
                Demo-only control center.
              </p>
            </div>

            <div>
              <button
                type="button"
                class="button button-primary"
                data-action="add-merchant"
              >
                + Add Merchant
              </button>

              <button
                type="button"
                class="button button-secondary"
                data-action="reset-demo"
              >
                Reset
              </button>
            </div>

          </div>

          <div class="admin-grid">

            ${state.merchants
              .map(
                merchant => {
                  const stores =
                    getMerchantStores(
                      merchant.id
                    );

                  const itemCount =
                    stores.reduce(
                      (
                        total,
                        store
                      ) =>
                        total +
                        getStoreItems(
                          store.id
                        ).length,
                      0
                    );

                  return `
                    <article class="app-card admin-merchant">

                      <div>
                        <h3>
                          ${escapeHtml(merchant.businessName)}
                        </h3>

                        <p>
                          ${stores.length}
                          stores ·
                          ${itemCount}
                          items
                        </p>
                      </div>

                      <button
                        type="button"
                        class="button button-secondary"
                        data-action="view-merchant"
                        data-id="${escapeHtml(merchant.id)}"
                      >
                        View as Merchant
                      </button>

                    </article>
                  `;
                }
              )
              .join("")}

          </div>

        </section>
      `;
    }

    // ============================================================
    // MERCHANT
    // ============================================================

    function renderMerchant() {
      const merchant =
        selectedMerchant();

      if (!merchant) {
        ui.persona =
          "admin";

        renderAll();
        return;
      }

      const stores =
        getMerchantStores(
          merchant.id
        );

      if (
        !stores.length
      ) {
        renderMerchantNoStores(
          merchant
        );

        return;
      }

      let store =
        getStore(
          ui.merchantStoreId
        );

      if (
        !store ||
        store.merchantId !==
          merchant.id
      ) {
        store =
          stores[0];

        ui.merchantStoreId =
          store.id;
      }

      renderStoreManager(
        merchant,
        store
      );
    }

    function merchantHeader() {
      return `
        <header class="merchant-header">

          <button
            type="button"
            class="merchant-header-button"
            data-action="merchant-exit"
            aria-label="Back"
          >
            <i class="fa-solid fa-arrow-left"></i>
          </button>

          <div class="merchant-header-title">
            MERCHANT PORTAL
          </div>

          <button
            type="button"
            class="merchant-header-button"
            data-action="refresh-merchant"
            aria-label="Refresh"
          >
            <i class="fa-solid fa-rotate-right"></i>
          </button>

        </header>
      `;
    }

    function renderMerchantNoStores(
      merchant
    ) {
      app.innerHTML = `
        <section class="merchant-page">

          ${merchantHeader()}

          <div class="merchant-empty">

            <h2>
              ${escapeHtml(merchant.businessName)}
            </h2>

            <p>
              No stores have been created for this merchant yet.
            </p>

            <button
              type="button"
              class="button button-primary"
              data-action="add-store"
            >
              + Add Store
            </button>

          </div>

        </section>
      `;
    }

    function renderStoreManager(
      merchant,
      store
    ) {
      const stores =
        getMerchantStores(
          merchant.id
        );

      const allItems =
        getStoreItems(
          store.id
        );

      const activeItems =
        allItems.filter(
          item =>
            item.active
        );

      const inactiveItems =
        allItems.filter(
          item =>
            !item.active
        );

      const visibleItems =
        ui.inventoryTab ===
          "active"
          ? activeItems
          : inactiveItems;

      const storeImage =
        safeUrl(
          allItems[0]?.image ||
          PRODUCT_PLACEHOLDER
        );

      const usagePercent =
        Math.min(
          100,
          Math.max(
            0,
            allItems.length /
              500 *
              100
          )
        );

      app.innerHTML = `
        <section class="merchant-page">

          ${merchantHeader()}

          <div class="merchant-content">

            <div class="merchant-store-switcher">

              <select
                id="merchantStoreSelect"
                class="merchant-store-select"
                aria-label="Current store"
              >

                ${stores
                  .map(
                    candidate => `
                      <option
                        value="${escapeHtml(candidate.id)}"
                        ${
                          candidate.id === store.id
                            ? "selected"
                            : ""
                        }
                      >
                        ${escapeHtml(candidate.name)}
                      </option>
                    `
                  )
                  .join("")}

              </select>

              <button
                type="button"
                class="button button-primary"
                data-action="add-store"
              >
                + Add Store
              </button>

            </div>

            <article class="app-card merchant-store-card">

              <img
                class="merchant-store-logo"
                src="${escapeHtml(storeImage)}"
                alt="${escapeHtml(store.name)}"
              />

              <div class="merchant-store-info">

                <h2>
                  ${escapeHtml(store.name)}
                </h2>

                <p>
                  ${escapeHtml(store.description)}
                </p>

                <p class="merchant-store-address">
                  <i class="fa-solid fa-location-dot"></i>
                  ${escapeHtml(store.address)}
                </p>

              </div>

              <div class="merchant-store-actions">

                <button
                  type="button"
                  class="icon-edit"
                  data-action="edit-store"
                  title="Edit store"
                >
                  <i class="fa-solid fa-pen"></i>
                </button>

                <span
                  class="pill ${
                    store.published
                      ? "pill-active"
                      : "pill-draft"
                  }"
                >
                  ${
                    store.published
                      ? "Active"
                      : "Draft"
                  }
                </span>

                <button
                  type="button"
                  class="button button-secondary small-button"
                  data-action="toggle-store-publish"
                >
                  ${
                    store.published
                      ? "Unpublish"
                      : "Publish"
                  }
                </button>

              </div>

            </article>

            <section class="app-card usage-card">

              <div class="usage-heading">
                <strong>
                  Usage Tier & Inventory Limit
                </strong>

                <span class="plan-badge">
                  Standard Plan
                </span>
              </div>

              <div class="usage-row">
                <span>
                  Total Items:
                  ${allItems.length}
                  / 500
                </span>

                <strong>
${
  allItems.length > 0 && usagePercent < 1
    ? "<1"
    : usagePercent.toFixed(0)
}%
Used
                </strong>
              </div>

              <div class="usage-progress">
                <div
                  style="width:${usagePercent}%"
                ></div>
              </div>

            </section>

            <div class="merchant-action-grid">

              <button
                type="button"
                class="merchant-action add"
                data-action="add-item"
              >
                <i class="fa-regular fa-circle-plus"></i>
                Add Item
              </button>

              <button
                type="button"
                class="merchant-action bulk"
                data-action="bulk-import"
              >
                <i class="fa-solid fa-upload"></i>
                Bulk Import
              </button>

              <button
                type="button"
                class="merchant-action preview"
                data-action="preview-store"
                data-id="${escapeHtml(store.id)}"
              >
                <i class="fa-solid fa-eye"></i>
                Preview Store
              </button>

            </div>

            <div class="inventory-tabs">

              <button
                type="button"
                class="inventory-tab ${
                  ui.inventoryTab === "active"
                    ? "active"
                    : ""
                }"
                data-action="inventory-tab"
                data-tab="active"
              >
                Active Listings
                (${activeItems.length})
              </button>

              <button
                type="button"
                class="inventory-tab ${
                  ui.inventoryTab === "inactive"
                    ? "active"
                    : ""
                }"
                data-action="inventory-tab"
                data-tab="inactive"
              >
                Inactive Listings
                (${inactiveItems.length})
              </button>

            </div>

            <div class="inventory-list">

              ${
                visibleItems.length
                  ? visibleItems
                      .map(
                        item =>
                          renderInventoryRow(
                            item
                          )
                      )
                      .join("")
                  : `
                    <div class="empty-state">
                      <div class="empty-state-inner">
                        <h3>
                          No ${
                            ui.inventoryTab
                          } listings.
                        </h3>
                      </div>
                    </div>
                  `
              }

            </div>

          </div>

        </section>
      `;
    }

    function renderInventoryRow(
      item
    ) {
      return `
        <article class="inventory-row">

          <img
            class="inventory-image"
            src="${escapeHtml(safeUrl(item.image))}"
            alt="${escapeHtml(item.title)}"
          />

          <div class="inventory-main">

            <strong>
              ${escapeHtml(item.title)}
            </strong>

            <div class="inventory-meta">
              <span>
                ${money(item.priceCents)}
              </span>

              <span>
                ${escapeHtml(titleCase(item.category))}
              </span>

              ${
                item.featured
                  ? `
                    <span class="pill pill-featured">
                      Featured
                    </span>
                  `
                  : ""
              }
            </div>

          </div>

          <div class="inventory-actions">

            <button
              type="button"
              class="inventory-action edit"
              data-action="edit-item"
              data-id="${escapeHtml(item.id)}"
              title="Edit"
            >
              <i class="fa-solid fa-pen"></i>
            </button>

            <button
              type="button"
              class="inventory-action"
              data-action="toggle-item"
              data-id="${escapeHtml(item.id)}"
              title="${
                item.active
                  ? "Hide"
                  : "Activate"
              }"
            >
              <i class="fa-solid ${
                item.active
                  ? "fa-eye-slash"
                  : "fa-eye"
              }"></i>
            </button>

            <button
              type="button"
              class="inventory-action delete"
              data-action="delete-item"
              data-id="${escapeHtml(item.id)}"
              title="Delete"
            >
              <i class="fa-solid fa-trash"></i>
            </button>

          </div>

        </article>
      `;
    }

    // ============================================================
    // FORMS
    // ============================================================

    function categoryOptions(
      selected
    ) {
      return CATEGORIES
        .filter(
          category =>
            category.id !== "all"
        )
        .map(
          category => `
            <option
              value="${category.id}"
              ${
                normalizeCategory(
                  selected
                ) === category.id
                  ? "selected"
                  : ""
              }
            >
              ${escapeHtml(titleCase(category.label))}
            </option>
          `
        )
        .join("");
    }

    function marketplaceOptions(
      selected
    ) {
      return MARKETPLACES
        .map(
          marketplace => `
            <option
              value="${marketplace.slug}"
              ${
                selected === marketplace.slug
                  ? "selected"
                  : ""
              }
            >
              ${escapeHtml(marketplace.name)}
            </option>
          `
        )
        .join("");
    }

    function openAddMerchant() {
      openModal({
        title:
          "Add Merchant Account",

        submitLabel:
          "Create Merchant",

        body: `
          <div class="form-grid">

            <div class="field full">
              <label>
                Business name
              </label>

              <input
                name="businessName"
                required
              />
            </div>

            <div class="field">
              <label>
                Owner / manager
              </label>

              <input
                name="ownerName"
                required
              />
            </div>

            <div class="field">
              <label>
                Phone
              </label>

              <input
                name="phone"
              />
            </div>

            <div class="field full">
              <label>
                Email
              </label>

              <input
                name="email"
                type="email"
                required
              />
            </div>

          </div>
        `,

        onSubmit(form) {
          const data =
            new FormData(form);

          const merchant = {
            id:
              uid("merchant"),

            businessName:
              String(
                data.get(
                  "businessName"
                )
              ).trim(),

            ownerName:
              String(
                data.get(
                  "ownerName"
                )
              ).trim(),

            email:
              String(
                data.get(
                  "email"
                )
              ).trim(),

            phone:
              String(
                data.get(
                  "phone"
                )
              ).trim(),

            status:
              "active"
          };

          state.merchants.push(
            merchant
          );

          saveState();

          ui.selectedMerchantId =
            merchant.id;

          ui.merchantStoreId =
            null;

          ui.persona =
            "merchant";

          closeModal();

          renderAll();
        }
      });
    }

    function openStoreForm(
      store = null
    ) {
      const editing =
        Boolean(store);

      openModal({
        title:
          editing
            ? "Edit Store"
            : "Add New Store",

        submitLabel:
          editing
            ? "Save Changes"
            : "Create Store",

        body: `
          <div class="notice">
            ${
              editing
                ? "Update the store details shoppers will see."
                : "New stores start as Draft. Add merchandise and publish when ready."
            }
          </div>

          <div class="form-grid">

            <div class="field full">
              <label>
                Store name
              </label>

              <input
                name="name"
                required
                value="${escapeHtml(store?.name || "")}"
              />
            </div>

            <div class="field full">
              <label>
                Description
              </label>

              <textarea
                name="description"
                required
              >${escapeHtml(store?.description || "")}</textarea>
            </div>

            <div class="field full">
              <label>
                Address
              </label>

              <input
                name="address"
                required
                value="${escapeHtml(store?.address || "")}"
              />
            </div>

            <div class="field">
              <label>
                Primary category
              </label>

              <select
                name="category"
              >
                ${categoryOptions(
                  store?.category ||
                  "fashion"
                )}
              </select>
            </div>

            <div class="field">
              <label>
                Marketplace
              </label>

              <select
                name="marketplaceSlug"
              >
                ${marketplaceOptions(
                  store?.marketplaceSlug ||
                  "pacific-beach"
                )}
              </select>
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
                value="${escapeHtml(store?.lat ?? DEFAULT_LOCATION.lat)}"
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
                value="${escapeHtml(store?.lng ?? DEFAULT_LOCATION.lng)}"
              />
            </div>

          </div>
        `,

        onSubmit(form) {
          const data =
            new FormData(form);

          const values = {
            name:
              String(
                data.get("name")
              ).trim(),

            description:
              String(
                data.get(
                  "description"
                )
              ).trim(),

            address:
              String(
                data.get(
                  "address"
                )
              ).trim(),

            category:
              normalizeCategory(
                data.get(
                  "category"
                )
              ),

            marketplaceSlug:
              String(
                data.get(
                  "marketplaceSlug"
                )
              ),

            lat:
              Number(
                data.get("lat")
              ),

            lng:
              Number(
                data.get("lng")
              )
          };

          if (
            editing
          ) {
            Object.assign(
              store,
              values
            );

            saveState();

            closeModal();

            renderAll();

            return;
          }

          const merchant =
            selectedMerchant();

          if (!merchant) {
            return;
          }

          const newStore = {
            id:
              uid("store"),

            merchantId:
              merchant.id,

            ...values,

            published:
              false
          };

          state.stores.push(
            newStore
          );

          ui.merchantStoreId =
            newStore.id;

          saveState();

          closeModal();

          renderAll();
        }
      });
    }

    function openItemForm(
      item = null
    ) {
      const store =
        getStore(
          ui.merchantStoreId
        );

      if (!store) {
        return;
      }

      const editing =
        Boolean(item);

      openModal({
        title:
          editing
            ? "Edit Merchandise"
            : "Add Merchandise",

        submitLabel:
          editing
            ? "Save Item"
            : "Add Item",

        body: `
          <div class="form-grid">

            <div class="field full">
              <label>
                Title
              </label>

              <input
                name="title"
                required
                value="${escapeHtml(item?.title || "")}"
              />
            </div>

            <div class="field full">
              <label>
                Description
              </label>

              <textarea
                name="description"
                required
              >${escapeHtml(item?.description || "")}</textarea>
            </div>

            <div class="field">
              <label>
                Type
              </label>

              <select
                name="type"
              >
                <option
                  value="product"
                  ${
                    item?.type !==
                    "service"
                      ? "selected"
                      : ""
                  }
                >
                  Product
                </option>

                <option
                  value="service"
                  ${
                    item?.type ===
                    "service"
                      ? "selected"
                      : ""
                  }
                >
                  Service
                </option>
              </select>
            </div>

            <div class="field">
              <label>
                Category
              </label>

              <select
                name="category"
              >
                ${categoryOptions(
                  item?.category ||
                  store.category
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
                value="${
                  item
                    ? (
                        item.priceCents /
                        100
                      ).toFixed(2)
                    : ""
                }"
              />
            </div>

            <div class="field">
              <label>
                Quantity
              </label>

              <input
                name="qty"
                type="number"
                step="1"
                required
                value="${escapeHtml(item?.qty ?? 1)}"
              />
            </div>

            <div class="field full">
              <label>
                Image URL
              </label>

              <input
                name="image"
                type="url"
                value="${escapeHtml(item?.image || PRODUCT_PLACEHOLDER)}"
              />
            </div>

            <div class="field">
              <div class="checkbox-line">
                <input
                  id="featured"
                  name="featured"
                  type="checkbox"
                  ${
                    item?.featured
                      ? "checked"
                      : ""
                  }
                />

                <label for="featured">
                  Featured item
                </label>
              </div>
            </div>

            <div class="field">
              <div class="checkbox-line">
                <input
                  id="active"
                  name="active"
                  type="checkbox"
                  ${
                    item
                      ? (
                          item.active
                            ? "checked"
                            : ""
                        )
                      : "checked"
                  }
                />

                <label for="active">
                  Active
                </label>
              </div>
            </div>

          </div>
        `,

        onSubmit(form) {
          const data =
            new FormData(form);

          const values = {
            title:
              String(
                data.get(
                  "title"
                )
              ).trim(),

            description:
              String(
                data.get(
                  "description"
                )
              ).trim(),

            type:
              String(
                data.get(
                  "type"
                )
              ),

            category:
              normalizeCategory(
                data.get(
                  "category"
                )
              ),

            priceCents:
              Math.round(
                Number(
                  data.get(
                    "price"
                  )
                ) *
                100
              ),

            qty:
              Number(
                data.get(
                  "qty"
                )
              ),

            image:
              String(
                data.get(
                  "image"
                )
              ).trim() ||
              PRODUCT_PLACEHOLDER,

            featured:
              data.get(
                "featured"
              ) === "on",

            active:
              data.get(
                "active"
              ) === "on"
          };

          if (
            editing
          ) {
            Object.assign(
              item,
              values
            );
          } else {
            state.items.push({
              id:
                uid("item"),

              storeId:
                store.id,

              ...values
            });
          }

          saveState();

          closeModal();

          renderAll();
        }
      });
    }

    function openBulkImport() {
      const store =
        getStore(
          ui.merchantStoreId
        );

      if (!store) {
        return;
      }

      openModal({
        title:
          "Bulk Import",

        submitLabel:
          "Import Items",

        body: `
          <div class="notice">
            One item per line:
            title, price, category, quantity
          </div>

          <div class="field">
            <label>
              CSV merchandise
            </label>

            <textarea
              name="csv"
              required
              style="min-height:220px"
              placeholder="Beach Hat,29.99,fashion,10
Surf Wax,4.99,seasonal,25"
            ></textarea>
          </div>
        `,

        onSubmit(form) {
          const raw =
            String(
              new FormData(
                form
              ).get("csv")
            );

          const lines =
            raw
              .split(/\r?\n/)
              .map(
                line =>
                  line.trim()
              )
              .filter(Boolean);

          let imported =
            0;

          lines.forEach(
            (
              line,
              index
            ) => {
              const parts =
                line
                  .split(",")
                  .map(
                    value =>
                      value.trim()
                  );

              if (
                parts.length <
                4
              ) {
                return;
              }

              const [
                title,
                price,
                category,
                qty
              ] =
                parts;

              const numericPrice =
                Number(price);

              const numericQty =
                Number(qty);

              if (
                !title ||
                !Number.isFinite(
                  numericPrice
                ) ||
                !Number.isFinite(
                  numericQty
                )
              ) {
                return;
              }

              state.items.push({
                id:
                  uid("item"),

                storeId:
                  store.id,

                title,

                description:
                  `${title} imported into the prototype catalog.`,

                category:
                  normalizeCategory(
                    category
                  ) ||
                  store.category,

                type:
                  numericQty === -1
                    ? "service"
                    : "product",

                priceCents:
                  Math.round(
                    numericPrice *
                    100
                  ),

                qty:
                  numericQty,

                image:
                  PRODUCT_PLACEHOLDER,

                featured:
                  false,

                active:
                  true
              });

              imported +=
                1;
            }
          );

          if (
            !imported
          ) {
            alert(
              "No valid rows were found."
            );

            return;
          }

          saveState();

          closeModal();

          renderAll();
        }
      });
    }

    // ============================================================
    // DETAIL / PREVIEW
    // ============================================================

    function openItemDetail(
      itemId
    ) {
      const item =
        getItem(
          itemId
        );

      if (!item) {
        return;
      }

      const store =
        getStore(
          item.storeId
        );

      if (!store) {
        return;
      }

      const distance =
        getStoreDistance(
          store
        );

      openModal({
        title:
          "Item Details",

        submitLabel:
          null,

        body: `
          <div class="detail-grid">

            <img
              src="${escapeHtml(safeUrl(item.image))}"
              alt="${escapeHtml(item.title)}"
            />

            <div>

              <h2>
                ${escapeHtml(item.title)}
              </h2>

              <div class="detail-price">
                ${money(item.priceCents)}
              </div>

              <p class="detail-copy">
                ${escapeHtml(item.description)}
              </p>

              <p class="detail-copy">
                <strong>
                  ${escapeHtml(store.name)}
                </strong>
                <br />
                ${escapeHtml(distanceLabel(distance))}
                ·
                ${escapeHtml(marketplaceLabel(store))}
              </p>

              <p class="detail-copy">
                ${escapeHtml(store.address)}
              </p>

            </div>

          </div>
        `
      });
    }

    function openStorePreview(
      storeId
    ) {
      const store =
        getStore(
          storeId
        );

      if (!store) {
        return;
      }

      const items =
        getStoreItems(
          store.id
        );

      openModal({
        title:
          "Store Preview",

        submitLabel:
          null,

        body: `
          <div class="notice">
            ${
              store.published
                ? "This store is currently published."
                : "This store is still a draft."
            }
          </div>

          <h2>
            ${escapeHtml(store.name)}
          </h2>

          <p class="detail-copy">
            ${escapeHtml(store.description)}
          </p>

          <p class="detail-copy">
            ${escapeHtml(store.address)}
          </p>

          <hr />

          ${items
            .map(
              item => `
                <p>
                  <strong>
                    ${escapeHtml(item.title)}
                  </strong>
                  —
                  ${money(item.priceCents)}
                </p>
              `
            )
            .join("")}
        `
      });
    }

    // ============================================================
    // EVENTS
    // ============================================================

    document.addEventListener(
      "input",
      event => {
        if (
          event.target.id ===
          "shopperSearch"
        ) {
          ui.search =
            event.target.value;

          renderShopperResults();
        }
      }
    );

    document.addEventListener(
      "change",
      event => {
        if (
          event.target.id ===
          "merchantStoreSelect"
        ) {
          ui.merchantStoreId =
            event.target.value;

          renderMerchant();
        }
      }
    );

    document.addEventListener(
      "click",
      event => {
        const button =
          event.target.closest(
            "[data-action]"
          );

        if (!button) {
          return;
        }

        const action =
          button.dataset.action;

        const id =
          button.dataset.id;

        switch (
          action
        ) {
          case "close-modal":
            closeModal();
            break;

          case "shopper-home":
            disposeMap();

            ui.persona =
              "shopper";

            ui.shopperView =
              "home";

            renderAll();
            break;

          case "shopper-messages":
            disposeMap();

            ui.shopperView =
              "messages";

            renderShopper();
            break;

          case "shopper-map":
            disposeMap();

            ui.shopperView =
              "map";

            ui.selectedMapMarketplace =
              ui.marketplaceSlug;

            renderShopper();
            break;

          case "shopper-profile":
            disposeMap();

            ui.shopperView =
              "profile";

            renderShopper();
            break;

          case "category":
            ui.category =
              button.dataset.category;

            renderShopperHome();
            break;

          case "shopper-filter":
            openModal({
              title:
                "Search Radius",

              submitLabel:
                "Apply",

              body: `
                <div class="field">
                  <label>
                    Show items within
                  </label>

                  <select
                    name="radius"
                  >
                    ${[3, 10, 25, 50]
                      .map(
                        radius => `
                          <option
                            value="${radius}"
                            ${
                              ui.radiusMiles === radius
                                ? "selected"
                                : ""
                            }
                          >
                            ${radius} miles
                          </option>
                        `
                      )
                      .join("")}
                  </select>
                </div>
              `,

              onSubmit(form) {
                ui.radiusMiles =
                  Number(
                    new FormData(
                      form
                    ).get(
                      "radius"
                    )
                  );

                closeModal();

                renderShopperHome();
              }
            });
            break;

          case "refresh-shopper":
            ui.search =
              "";

            ui.category =
              "all";

            renderShopperHome();
            break;

          case "select-marketplace":
            ui.selectedMapMarketplace =
              button.dataset.marketplace;

            renderMarketplaces();
            break;

          case "shop-selected-marketplace":
            ui.marketplaceSlug =
              ui.selectedMapMarketplace;

            ui.category =
              "all";

            ui.search =
              "";

            ui.shopperView =
              "home";

            renderAll();
            break;

          case "enter-merchant-portal":
            if (
              !ui.selectedMerchantId
            ) {
              ui.selectedMerchantId =
                state.merchants[0]?.id ||
                null;
            }

            ui.persona =
              "merchant";

            {
              const stores =
                getMerchantStores(
                  ui.selectedMerchantId
                );

              ui.merchantStoreId =
                stores[0]?.id ||
                null;
            }

            renderAll();
            break;

          case "merchant-exit":
            ui.persona =
              "shopper";

            ui.shopperView =
              "profile";

            renderAll();
            break;

          case "refresh-merchant":
            renderMerchant();
            break;

          case "view-merchant":
            ui.selectedMerchantId =
              id;

            ui.persona =
              "merchant";

            {
              const stores =
                getMerchantStores(
                  id
                );

              ui.merchantStoreId =
                stores[0]?.id ||
                null;
            }

            renderAll();
            break;

          case "add-merchant":
            openAddMerchant();
            break;

          case "add-store":
            openStoreForm();
            break;

          case "edit-store":
            openStoreForm(
              getStore(
                ui.merchantStoreId
              )
            );
            break;

          case "toggle-store-publish": {
            const store =
              getStore(
                ui.merchantStoreId
              );

            if (!store) {
              break;
            }

            if (
              !store.published &&
              !getStoreItems(
                store.id
              ).some(
                item =>
                  item.active
              )
            ) {
              alert(
                "Add at least one active item before publishing this store."
              );

              break;
            }

            store.published =
              !store.published;

            saveState();

            renderMerchant();
            break;
          }

          case "add-item":
            openItemForm();
            break;

          case "edit-item":
            openItemForm(
              getItem(id)
            );
            break;

          case "toggle-item": {
            const item =
              getItem(id);

            if (!item) {
              break;
            }

            item.active =
              !item.active;

            saveState();

            renderMerchant();
            break;
          }

          case "delete-item": {
            const item =
              getItem(id);

            if (!item) {
              break;
            }

            if (
              !confirm(
                `Delete "${item.title}"?`
              )
            ) {
              break;
            }

            state.items =
              state.items.filter(
                candidate =>
                  candidate.id !== id
              );

            saveState();

            renderMerchant();
            break;
          }

          case "bulk-import":
            openBulkImport();
            break;

          case "preview-store":
            openStorePreview(
              id
            );
            break;

          case "inventory-tab":
            ui.inventoryTab =
              button.dataset.tab;

            renderMerchant();
            break;

          case "view-item":
            openItemDetail(
              id
            );
            break;

          case "reset-demo":
            if (
              !confirm(
                "Reset all prototype merchants, stores and merchandise?"
              )
            ) {
              break;
            }

            state =
              createSeedData();

            saveState();

            ui.persona =
              "admin";

            ui.selectedMerchantId =
              state.merchants[0]?.id ||
              null;

            ui.merchantStoreId =
              null;

            ui.shopperView =
              "home";

            ui.marketplaceSlug =
              "pacific-beach";

            ui.selectedMapMarketplace =
              "pacific-beach";

            ui.category =
              "all";

            ui.search =
              "";

            ui.radiusMiles =
              3;

            renderAll();
            break;
        }
      }
    );

    // ============================================================
    // START
    // ============================================================

    renderAll();
  