
  (() => {
    "use strict";

    /* ============================================================
       HOPPER DATA
       ============================================================ */

    const HOPPER_SURFER_EXTENSION = {
      id: "hopper-surfer",
      name: "Hopper 0",
      personaName: "The Surfer",
      marketplaceSlug: "pacific-beach",
      marketplaceName: "Pacific Beach",

      interests: [
        "Surf",
        "Beach",
        "Skate",
        "Local Food"
      ]
    };

    /*
     * Merchant IDs are included where we already know the
     * corresponding merchant in the prototype.
     *
     * These are NOT signup/claim statuses.
     * They simply prevent us from accidentally creating
     * duplicate demo merchants.
     */
    const HOPPER_SURFER_SEED_ENTRIES = [
      {
        id: "hopper-pick-sex-wax",

        itemName:
          "Board wax / Sex Wax",

        merchantName:
          "Mission Surf",

        merchantId:
          "merchant-mission-surf",

        suggestedCategory:
          "seasonal",

        itemId:
          null,

        note:
          ""
      },

      {
        id: "hopper-pick-towel",

        itemName:
          "Beach towel",

        merchantName:
          "South Coast Wahini",

        merchantId:
          "merchant-south-coast",

        suggestedCategory:
          "seasonal",

        itemId:
          "item-south-coast-towel",

        note:
          ""
      },

      {
        id: "hopper-pick-sunscreen",

        itemName:
          "Sunscreen",

        merchantName:
          "Gone Bananas",

        merchantId:
          null,

        suggestedCategory:
          "seasonal",

        itemId:
          null,

        note:
          ""
      },

      {
        id: "hopper-pick-keychain",

        itemName:
          "Keychain",

        merchantName:
          "Ananas Pacific Beach",

        merchantId:
          null,

        suggestedCategory:
          "fashion",

        itemId:
          null,

        note:
          ""
      },

      {
        id: "hopper-pick-bike-rack",

        itemName:
          "Surfboard bike rack",

        merchantName:
          "Mission Surf",

        merchantId:
          "merchant-mission-surf",

        suggestedCategory:
          "auto",

        itemId:
          null,

        note:
          ""
      },

      {
        id: "hopper-pick-fish-tacos",

        itemName:
          "Fish tacos",

        merchantName:
          "Pacific Beach Fish Shop",

        merchantId:
          null,

        suggestedCategory:
          "grocery",

        itemId:
          null,

        note:
          ""
      },

      {
        id: "hopper-pick-skate",

        itemName:
          "Skate items",

        merchantName:
          "Pacific Drive Skateboard Shop",

        merchantId:
          null,

        suggestedCategory:
          "fitness",

        itemId:
          null,

        note:
          ""
      },

      {
        id: "hopper-pick-used-boards",

        itemName:
          "Used boards",

        merchantName:
          "Play It Again Sports, Pacific Beach",

        merchantId:
          null,

        suggestedCategory:
          "fitness",

        itemId:
          null,

        note:
          ""
      },

      {
        id: "hopper-pick-flip-flops",

        itemName:
          "Flip flops / Randall Sandals",

        merchantName:
          "South Coast Surf",

        merchantId:
          "merchant-south-coast",

        suggestedCategory:
          "fashion",

        itemId:
          null,

        note:
          ""
      },

      {
        id: "hopper-pick-apparel",

        itemName:
          "Apparel",

        merchantName:
          "Pacific Beach Resort Wear",

        merchantId:
          null,

        suggestedCategory:
          "fashion",

        itemId:
          null,

        note:
          ""
      }
    ];

    /* ============================================================
       STATE MIGRATION
       ============================================================ */

    function createDefaultHopperList() {
      return {
        id:
          "hopper-surfer-pb-essentials",

        hopperId:
          HOPPER_SURFER_EXTENSION.id,

        title:
          "The Surfer's Pacific Beach Essentials",

        description:
          "Favorite local finds for surf days, beach life, skating and food around Pacific Beach.",

        entries:
          HOPPER_SURFER_SEED_ENTRIES.map(
            entry => ({
              ...entry
            })
          )
      };
    }

    function ensureHopperStateExtension() {
      if (
        !Array.isArray(
          state.hoppers
        )
      ) {
        state.hoppers = [];
      }

      let surfer =
        state.hoppers.find(
          hopper =>
            hopper.id ===
            HOPPER_SURFER_EXTENSION.id
        );

      if (!surfer) {
        surfer = {
          ...HOPPER_SURFER_EXTENSION
        };

        state.hoppers.push(
          surfer
        );
      } else {
        Object.assign(
          surfer,
          HOPPER_SURFER_EXTENSION
        );
      }

      if (
        !Array.isArray(
          state.hopperLists
        )
      ) {
        state.hopperLists = [];
      }

      let list =
        state.hopperLists.find(
          candidate =>
            candidate.hopperId ===
            HOPPER_SURFER_EXTENSION.id
        );

      if (!list) {
        list =
          createDefaultHopperList();

        state.hopperLists.push(
          list
        );
      }

      if (
        !Array.isArray(
          list.entries
        )
      ) {
        list.entries = [];
      }

      /*
       * Merge in any seed entries that aren't already present.
       * This allows us to add Hopper support without erasing
       * existing localStorage data.
       */
      for (
        const seedEntry
        of HOPPER_SURFER_SEED_ENTRIES
      ) {
        const existing =
          list.entries.find(
            entry =>
              entry.id ===
              seedEntry.id
          );

        if (!existing) {
          list.entries.push({
            ...seedEntry
          });

          continue;
        }

        if (
          !existing.merchantId &&
          seedEntry.merchantId
        ) {
          existing.merchantId =
            seedEntry.merchantId;
        }

        if (
          !existing.itemId &&
          seedEntry.itemId &&
          getItem(
            seedEntry.itemId
          )
        ) {
          existing.itemId =
            seedEntry.itemId;
        }

        if (
          !existing.suggestedCategory
        ) {
          existing.suggestedCategory =
            seedEntry.suggestedCategory;
        }
      }
    }

    function getExtensionHopper(
      id
    ) {
      return (
        state.hoppers?.find(
          hopper =>
            hopper.id === id
        ) ||
        null
      );
    }

    function getExtensionHopperList(
      hopperId
    ) {
      return (
        state.hopperLists?.find(
          list =>
            list.hopperId ===
            hopperId
        ) ||
        null
      );
    }

    function normalizeMerchantNameExtension(
      name
    ) {
      return String(
        name || ""
      )
        .trim()
        .toLowerCase()
        .replace(
          /[^a-z0-9]+/g,
          " "
        )
        .trim();
    }

    function findMerchantByNameExtension(
      name
    ) {
      const target =
        normalizeMerchantNameExtension(
          name
        );

      return (
        state.merchants.find(
          merchant =>
            normalizeMerchantNameExtension(
              merchant.businessName
            ) === target
        ) ||
        null
      );
    }

    function firstStoreForMerchantExtension(
      merchantId
    ) {
      return (
        state.stores.find(
          store =>
            store.merchantId ===
            merchantId
        ) ||
        null
      );
    }

    /* ============================================================
       RESET SUPPORT
       ============================================================ */

    const originalCreateSeedDataExtension =
      createSeedData;

    createSeedData =
      function createSeedDataWithHopper() {
        const fresh =
          originalCreateSeedDataExtension();

        fresh.hoppers = [
          {
            ...HOPPER_SURFER_EXTENSION
          }
        ];

        fresh.hopperLists = [
          createDefaultHopperList()
        ];

        return fresh;
      };

    /* ============================================================
       HOPPER RENDERING
       ============================================================ */

    function renderHopperExtension() {
      ensureHopperStateExtension();

      const hopper =
        getExtensionHopper(
          ui.selectedHopperId ||
          HOPPER_SURFER_EXTENSION.id
        ) ||
        HOPPER_SURFER_EXTENSION;

      const list =
        getExtensionHopperList(
          hopper.id
        );

      const entries =
        list?.entries ||
        [];

      const addedCount =
        entries.filter(
          entry =>
            entry.itemId &&
            getItem(
              entry.itemId
            )
        ).length;

      app.innerHTML = `
        <section class="hopper-page">

          <header class="hopper-header">

            <div></div>

            <div class="hopper-header-title">
              HOPPER
            </div>

            <div></div>

          </header>

          <div class="hopper-content">

            <section class="hopper-profile-card">

              <div class="hopper-avatar">
                🏄
              </div>

              <div class="hopper-profile-copy">

                <div class="hopper-kicker">
                  ${escapeHtml(
                    hopper.name
                  )}
                </div>

                <h1>
                  ${escapeHtml(
                    hopper.personaName
                  )}
                </h1>

                <p>
                  <i class="fa-solid fa-location-dot"></i>
                  ${escapeHtml(
                    hopper.marketplaceName
                  )}
                </p>

                <div class="hopper-interest-row">

                  ${hopper.interests
                    .map(
                      interest => `
                        <span class="hopper-interest">
                          ${escapeHtml(
                            interest
                          )}
                        </span>
                      `
                    )
                    .join("")}

                </div>

              </div>

            </section>

            <section class="hopper-list-heading">

              <div>

                <div class="hopper-kicker">
                  CURATED LIST
                </div>

                <h2>
                  ${escapeHtml(
                    list?.title ||
                    "My Local Finds"
                  )}
                </h2>

                <p>
                  ${escapeHtml(
                    list?.description ||
                    ""
                  )}
                </p>

                <div class="hopper-progress">
                  ${addedCount}
                  of
                  ${entries.length}
                  finds currently added to the prototype
                </div>

              </div>

              <button
                type="button"
                class="button button-primary hopper-add-button"
                data-action="hopper-add-local-find"
              >
                + Add Local Find
              </button>

            </section>

            <div class="hopper-picks">

              ${entries
                .map(
                  (
                    entry,
                    index
                  ) =>
                    renderHopperPickExtension(
                      entry,
                      index
                    )
                )
                .join("")}

            </div>

          </div>

        </section>
      `;
    }

    function renderHopperPickExtension(
      entry,
      index
    ) {
      const item =
        entry.itemId
          ? getItem(
              entry.itemId
            )
          : null;

      const store =
        item
          ? getStore(
              item.storeId
            )
          : null;

      if (
        item &&
        store
      ) {
        return `
          <article
            class="hopper-pick-card hopper-pick-card-clickable"
            role="button"
            tabindex="0"
            data-action="hopper-open-item"
            data-id="${escapeHtml(
              item.id
            )}"
            aria-label="View ${escapeHtml(
              entry.itemName
            )}"
          >

            <img
              class="hopper-pick-image"
              src="${escapeHtml(
                safeUrl(
                  item.image
                )
              )}"
              alt="${escapeHtml(
                item.title
              )}"
            />

            <div class="hopper-pick-main">

              <div class="hopper-pick-number">
                PICK ${index + 1}
              </div>

              <h3>
                ${escapeHtml(
                  entry.itemName
                )}
              </h3>

              <div class="hopper-pick-merchant">
                ${escapeHtml(
                  entry.merchantName
                )}
              </div>

              <div class="hopper-live-detail">
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

              <div class="hopper-added">
                <i class="fa-solid fa-circle-check"></i>
                In Shop Hopper
              </div>

              ${
                entry.note
                  ? `
                    <p class="hopper-note">
                      “${escapeHtml(
                        entry.note
                      )}”
                    </p>
                  `
                  : ""
              }

            </div>

          </article>
        `;
      }

      return `
        <article class="hopper-pick-card">

          <div class="hopper-pick-placeholder">
            <i class="fa-solid fa-location-dot"></i>
          </div>

          <div class="hopper-pick-main">

            <div class="hopper-pick-number">
              PICK ${index + 1}
            </div>

            <h3>
              ${escapeHtml(
                entry.itemName
              )}
            </h3>

            <div class="hopper-pick-merchant">
              ${escapeHtml(
                entry.merchantName
              )}
            </div>

            ${
              entry.note
                ? `
                  <p class="hopper-note">
                    “${escapeHtml(
                      entry.note
                    )}”
                  </p>
                `
                : ""
            }

          </div>

          <button
            type="button"
            class="button button-primary small-button"
            data-action="hopper-add-entry"
            data-entry-id="${escapeHtml(
              entry.id
            )}"
          >
            + Add
          </button>

        </article>
      `;
    }

    /* ============================================================
       HOPPER ADD LOCAL FIND
       ============================================================ */

    async function geocodeStoreAddress(
      address,
      marketplaceSlug
    ) {
      const marketplace =
        MARKETPLACES.find(
          candidate =>
            candidate.slug ===
            marketplaceSlug
        );

      const hasCityOrState =
        /,|\b(?:CA|California)\b/i.test(
          address
        );

      const query =
        hasCityOrState
          ? address
          : [
              address,
              marketplace?.name,
              "San Diego County",
              "California"
            ]
              .filter(Boolean)
              .join(", ");

      const url =
        new URL(
          "https://nominatim.openstreetmap.org/search"
        );

      url.searchParams.set(
        "q",
        query
      );

      url.searchParams.set(
        "format",
        "jsonv2"
      );

      url.searchParams.set(
        "limit",
        "1"
      );

      url.searchParams.set(
        "countrycodes",
        "us"
      );

      const controller =
        new AbortController();

      const timeout =
        window.setTimeout(
          () =>
            controller.abort(),
          8000
        );

      try {
        const response =
          await fetch(
            url,
            {
              headers: {
                Accept:
                  "application/json"
              },

              signal:
                controller.signal
            }
          );

        if (!response.ok) {
          throw new Error(
            "Address lookup is unavailable."
          );
        }

        const results =
          await response.json();

        const match =
          results?.[0];

        const lat =
          Number(
            match?.lat
          );

        const lng =
          Number(
            match?.lon
          );

        if (
          !Number.isFinite(lat) ||
          !Number.isFinite(lng)
        ) {
          return null;
        }

        return {
          lat,
          lng
        };
      } finally {
        window.clearTimeout(
          timeout
        );
      }
    }

    function openHopperLocalFindExtension(
      entry = null
    ) {
      let existingMerchant =
        null;

      if (
        entry?.merchantId
      ) {
        existingMerchant =
          getMerchant(
            entry.merchantId
          );
      }

      if (
        !existingMerchant &&
        entry?.merchantName
      ) {
        existingMerchant =
          findMerchantByNameExtension(
            entry.merchantName
          );
      }

      const existingStore =
        existingMerchant
          ? firstStoreForMerchantExtension(
              existingMerchant.id
            )
          : null;

      const defaultMerchantName =
        entry?.merchantName ||
        existingMerchant?.businessName ||
        "";

      const defaultStoreName =
        existingStore?.name ||
        defaultMerchantName;

      const defaultItemName =
        entry?.itemName ||
        "";

      const defaultAddress =
        existingStore?.address ||
        "";

      const defaultMarketplace =
        existingStore?.marketplaceSlug ||
        "pacific-beach";

      const defaultCategory =
        entry?.suggestedCategory ||
        existingStore?.category ||
        "fashion";

      openModal({
        title:
          entry
            ? "Add This Local Find"
            : "Add Local Find",

        submitLabel:
          "Add to Shop Hopper",

        body: `
          <div class="notice">
            The Hopper can add the merchant, store and item
            in one step. For this demo, all merchants and
            products behave the same once they are added.
          </div>

          <div class="form-grid">

            <div class="field full">

              <label>
                Merchant
              </label>

              <input
                name="merchantName"
                required
                value="${escapeHtml(
                  defaultMerchantName
                )}"
              />

            </div>

            <div class="field full">

              <label>
                Store name
              </label>

              <input
                name="storeName"
                required
                value="${escapeHtml(
                  defaultStoreName
                )}"
              />

            </div>

            <div class="field full">

              <label>
                Item / local find
              </label>

              <input
                name="itemName"
                required
                value="${escapeHtml(
                  defaultItemName
                )}"
              />

            </div>

            <div class="field full">

              <label>
                Description
              </label>

              <textarea
                name="description"
                placeholder="Describe the item or local find..."
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
                  defaultCategory
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
                value="${escapeHtml(
                  defaultAddress
                )}"
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
                  defaultMarketplace
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
                <span class="field-optional">(optional)</span>
              </label>

              <input
                name="lat"
                type="number"
                step="0.000001"
                placeholder="Found from address"
              />

            </div>

            <div class="field">

              <label>
                Longitude
                <span class="field-optional">(optional)</span>
              </label>

              <input
                name="lng"
                type="number"
                step="0.000001"
                placeholder="Found from address"
              />

            </div>

            <div class="field full coordinate-help">
              Leave both blank to locate the store automatically from its address.
              Enter both only when you need to place the map marker manually.
              Address lookup uses OpenStreetMap.
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
                placeholder="Why does The Surfer recommend this?"
              >${escapeHtml(
                entry?.note ||
                ""
              )}</textarea>

            </div>

          </div>
        `,

        async onSubmit(form) {
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
              "pacific-beach"
            );

          const latValue =
            String(
              data.get(
                "lat"
              ) ||
              ""
            ).trim();

          const lngValue =
            String(
              data.get(
                "lng"
              ) ||
              ""
            ).trim();

          let lat =
            latValue
              ? Number(latValue)
              : NaN;

          let lng =
            lngValue
              ? Number(lngValue)
              : NaN;

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
            Boolean(latValue) !==
            Boolean(lngValue)
          ) {
            alert(
              "Enter both latitude and longitude, or leave both blank to use the store address."
            );

            return;
          }

          if (
            !latValue &&
            !lngValue
          ) {
            const unchangedExistingAddress =
              existingStore &&
              address.toLowerCase() ===
                defaultAddress.toLowerCase() &&
              Number.isFinite(
                Number(
                  existingStore.lat
                )
              ) &&
              Number.isFinite(
                Number(
                  existingStore.lng
                )
              );

            if (
              unchangedExistingAddress
            ) {
              lat =
                Number(
                  existingStore.lat
                );

              lng =
                Number(
                  existingStore.lng
                );
            } else {
              const previousLabel =
                modalSubmit.textContent;

              modalSubmit.disabled =
                true;

              modalSubmit.textContent =
                "Finding address…";

              try {
                const coordinates =
                  await geocodeStoreAddress(
                    address,
                    marketplaceSlug
                  );

                if (!coordinates) {
                  alert(
                    "We could not locate that address. Check the address or enter latitude and longitude manually."
                  );

                  return;
                }

                lat =
                  coordinates.lat;

                lng =
                  coordinates.lng;
              } catch (error) {
                console.error(
                  "Store address lookup failed.",
                  error
                );

                alert(
                  "We could not look up that address right now. Please try again or enter latitude and longitude manually."
                );

                return;
              } finally {
                modalSubmit.disabled =
                  false;

                modalSubmit.textContent =
                  previousLabel;
              }
            }
          }

          if (
            !Number.isFinite(lat) ||
            !Number.isFinite(lng)
          ) {
            alert(
              "Please enter valid latitude and longitude values."
            );

            return;
          }

          /*
           * Existing merchant, when the Hopper entry already
           * points to one.
           */
          let merchant =
            entry?.merchantId
              ? getMerchant(
                  entry.merchantId
                )
              : null;

          if (!merchant) {
            merchant =
              findMerchantByNameExtension(
                merchantName
              );
          }

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

          /*
           * Re-use an exact store match first.
           */
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

          /*
           * For one-store merchants already in our prototype,
           * use their existing store rather than duplicating it.
           */
          if (
            !store &&
            entry?.merchantId
          ) {
            store =
              firstStoreForMerchantExtension(
                merchant.id
              );
          }

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

            /*
             * Hidden attribution for future Hopper experiments.
             * Nothing in the current UI distinguishes merchants
             * based on this field.
             */
            createdByHopperId:
              HOPPER_SURFER_EXTENSION.id
          };

          state.items.push(
            item
          );

          const hopperList =
            getExtensionHopperList(
              HOPPER_SURFER_EXTENSION.id
            );

          if (entry) {
            entry.itemId =
              item.id;

            entry.merchantId =
              merchant.id;

            entry.itemName =
              itemName;

            entry.merchantName =
              merchantName;

            entry.note =
              hopperNote;
          } else if (
            hopperList
          ) {
            hopperList.entries.push({
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
          }

          saveState();

          closeModal();

          renderHopperExtension();
        }
      });
    }

    /* ============================================================
       PERSONA SELECTOR EXTENSION
       ============================================================ */

    ui.selectedHopperId =
      ui.selectedHopperId ||
      HOPPER_SURFER_EXTENSION.id;

    renderPersonaSelect =
      function renderPersonaSelectWithHopper() {
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

          <option
            value="hopper:${HOPPER_SURFER_EXTENSION.id}"
            ${
              ui.persona ===
              "hopper"
                ? "selected"
                : ""
            }
          >
            Hopper — The Surfer
          </option>

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

    /*
     * Capture phase lets us establish the Hopper persona
     * before the existing persona-change handler runs.
     */
    personaSelect.addEventListener(
      "change",
      event => {
        const value =
          event.target.value;

        if (
          value.startsWith(
            "hopper:"
          )
        ) {
          ui.persona =
            "hopper";

          ui.selectedHopperId =
            value.slice(
              "hopper:".length
            );
        }
      },
      true
    );

    /* ============================================================
       ROOT RENDER EXTENSION
       ============================================================ */

    renderAll =
      function renderAllWithHopper() {
        renderPersonaSelect();

        disposeMap();

        if (
          ui.persona ===
          "shopper"
        ) {
          renderShopper();
          return;
        }

        if (
          ui.persona ===
          "hopper"
        ) {
          renderHopperExtension();
          return;
        }

        if (
          ui.persona ===
          "admin"
        ) {
          renderAdmin();
          return;
        }

        renderMerchant();
      };

    /* ============================================================
       HOPPER BUTTON EVENTS
       ============================================================ */

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

        if (
          action ===
          "hopper-add-local-find"
        ) {
          openHopperLocalFindExtension();
          return;
        }

        if (
          action ===
          "hopper-add-entry"
        ) {
          const list =
            getExtensionHopperList(
              ui.selectedHopperId ||
              HOPPER_SURFER_EXTENSION.id
            );

          const entry =
            list?.entries.find(
              candidate =>
                candidate.id ===
                button.dataset.entryId
            );

          if (entry) {
            openHopperLocalFindExtension(
              entry
            );
          }

          return;
        }

        if (
          action ===
          "hopper-open-item"
        ) {
          const itemId =
            button.dataset.id;

          if (
            itemId
          ) {
            openItemDetail(
              itemId
            );
          }
        }
      }
    );

    /* ============================================================
       INITIALIZE HOPPER EXTENSION
       ============================================================ */

    ensureHopperStateExtension();

    saveState();

    renderAll();
  })();