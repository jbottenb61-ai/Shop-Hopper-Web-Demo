  (() => {
    "use strict";

    /* ============================================================
       MAP INVENTORY
       ============================================================ */

    function getMapInventoryRecords(
      marketplaceSlug
    ) {
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

            if (
              !store.published ||
              !item.active
            ) {
              return null;
            }

            if (
              store.marketplaceSlug !==
              marketplaceSlug
            ) {
              return null;
            }

            const lat =
              Number(
                store.lat
              );

            const lng =
              Number(
                store.lng
              );

            if (
              !Number.isFinite(lat) ||
              !Number.isFinite(lng)
            ) {
              return null;
            }

            return {
              item,
              store,
              merchant,
              lat,
              lng
            };
          }
        )
        .filter(Boolean);
    }

    /*
     * If a store contains several products, spread their
     * demo pins by only a few meters so each remains clickable.
     */
    function getMapMarkerPosition(
      record,
      records
    ) {
      const sameStore =
        records.filter(
          candidate =>
            candidate.store.id ===
            record.store.id
        );

      const index =
        sameStore.findIndex(
          candidate =>
            candidate.item.id ===
            record.item.id
        );

      if (
        index <= 0
      ) {
        return {
          lat:
            record.lat,

          lng:
            record.lng
        };
      }

      const angle =
        index *
        2.3999632297;

      const radius =
        0.00018 *
        Math.ceil(
          index / 5
        );

      return {
        lat:
          record.lat +
          Math.sin(angle) *
          radius,

        lng:
          record.lng +
          Math.cos(angle) *
          radius
      };
    }

    /* ============================================================
       MAP ITEM BANNER
       ============================================================ */

    function renderMapItemBanner() {
      const wrap =
        document.querySelector(
          ".market-map-wrap"
        );

      if (!wrap) {
        return;
      }

      let shell =
        wrap.querySelector(
          ".map-item-banner-shell"
        );

      if (!shell) {
        shell =
          document.createElement(
            "div"
          );

        shell.className =
          "map-item-banner-shell";

        wrap.appendChild(
          shell
        );
      }

      const marketplace =
        selectedMarketplace();

      const records =
        getMapInventoryRecords(
          marketplace.slug
        );

      if (
        !records.length
      ) {
        ui.selectedMapItemId =
          null;

        shell.innerHTML = `
          <div class="map-item-banner-empty">
            No Shop Hopper items have been added to
            ${escapeHtml(
              marketplace.name
            )}
            yet.
          </div>
        `;

        return;
      }

      const selected =
        records.find(
          record =>
            record.item.id ===
            ui.selectedMapItemId
        );

      if (!selected) {
        ui.selectedMapItemId =
          null;

        shell.innerHTML = `
          <div class="map-item-banner-empty map-item-banner-prompt">
            <i class="fa-solid fa-location-dot" aria-hidden="true"></i>
            Select a product marker to see its item.
          </div>
        `;

        return;
      }

      const distance =
        getStoreDistance(
          selected.store
        );

      shell.innerHTML = `
        <div class="map-item-banner">

          <button
            type="button"
            class="map-item-banner-main"
            data-action="map-view-item"
            data-id="${escapeHtml(selected.item.id)}"
            aria-label="View ${escapeHtml(selected.item.title)} at ${escapeHtml(selected.store.name)}"
          >

          <img
            class="map-item-banner-image"
            src="${escapeHtml(
              safeUrl(
                selected.item.image
              )
            )}"
            alt="${escapeHtml(
              selected.item.title
            )}"
          />

          <div class="map-item-banner-copy">

            <div class="map-item-banner-title">
              ${escapeHtml(
                selected.item.title
              )}
            </div>

            <div class="map-item-banner-store">
              ${escapeHtml(
                selected.store.name
              )}
            </div>

            <div class="map-item-banner-meta">
              ${money(
                selected.item.priceCents
              )}
              &nbsp;·&nbsp;
              ${escapeHtml(
                distanceLabel(
                  distance
                )
              )}
            </div>

          </div>

            <i class="fa-solid fa-chevron-right map-item-banner-arrow" aria-hidden="true"></i>

          </button>

          <button
            type="button"
            class="map-item-banner-close"
            data-action="map-close-item"
            aria-label="Close selected item"
          >
            <i class="fa-solid fa-xmark" aria-hidden="true"></i>
          </button>

        </div>
      `;
    }

    function selectMapItem(
      itemId
    ) {
      ui.selectedMapItemId =
        itemId;

      renderMapItemBanner();
    }

    /* ============================================================
       EXTEND MARKETPLACE RENDER
       ============================================================ */

    const originalRenderMarketplaces =
      renderMarketplaces;

    renderMarketplaces =
      function renderMarketplacesWithItems() {
        originalRenderMarketplaces();

        /*
         * Add the item banner after the existing Marketplace
         * screen has rendered.
         */
        renderMapItemBanner();
      };

    /* ============================================================
       LEAFLET ITEM MARKERS
       ============================================================ */

    const originalInitializeLeafletMap =
      initializeLeafletMap;

    initializeLeafletMap =
      function initializeLeafletMapWithItems(
        mapElement,
        marketplace
      ) {
        originalInitializeLeafletMap(
          mapElement,
          marketplace
        );

        if (
          !activeMap ||
          activeMapEngine !==
            "leaflet" ||
          !window.L
        ) {
          return;
        }

        const records =
          getMapInventoryRecords(
            marketplace.slug
          );

        records.forEach(
          record => {
            const position =
              getMapMarkerPosition(
                record,
                records
              );

            const icon =
              L.divIcon({
                className:
                  "",

                html: `
                  <div class="shop-map-item-marker">
                    <i class="fa-solid fa-bag-shopping"></i>
                  </div>
                `,

                iconSize:
                  [32, 32],

                iconAnchor:
                  [16, 16],

                popupAnchor:
                  [0, -18]
              });

            const marker =
              L.marker(
                [
                  position.lat,
                  position.lng
                ],
                {
                  icon,
                  title:
                    `${record.item.title} at ${record.store.name}`,
                  alt:
                    `${record.item.title} at ${record.store.name}`
                }
              )
                .addTo(
                  activeMap
                );

            marker.bindTooltip(
              `
                <strong>
                  ${escapeHtml(
                    record.item.title
                  )}
                </strong>
                <br>
                ${escapeHtml(
                  record.store.name
                )}
              `,
              {
                direction:
                  "top"
              }
            );

            marker.on(
              "click",
              () => {
                selectMapItem(
                  record.item.id
                );
              }
            );
          }
        );

        renderMapItemBanner();
      };

    /* ============================================================
       GOOGLE MAP ITEM MARKERS
       ============================================================ */

    const originalInitializeGoogleMap =
      initializeGoogleMap;

    initializeGoogleMap =
      function initializeGoogleMapWithItems(
        mapElement,
        marketplace
      ) {
        originalInitializeGoogleMap(
          mapElement,
          marketplace
        );

        if (
          !activeMap ||
          activeMapEngine !==
            "google" ||
          !window.google?.maps
        ) {
          return;
        }

        const records =
          getMapInventoryRecords(
            marketplace.slug
          );

        records.forEach(
          (
            record,
            index
          ) => {
            const position =
              getMapMarkerPosition(
                record,
                records
              );

            const marker =
              new google.maps.Marker({
                map:
                  activeMap,

                position,

                title:
                  `${record.item.title} — ${record.store.name}`,

                label: {
                  text:
                    "●",

                  color:
                    "#13a5c5",

                  fontSize:
                    "22px",

                  fontWeight:
                    "900"
                },

                zIndex:
                  100 +
                  index
              });

            marker.addListener(
              "click",
              () => {
                selectMapItem(
                  record.item.id
                );
              }
            );
          }
        );

        renderMapItemBanner();
      };

    /* ============================================================
       VIEW ITEM FROM MAP BANNER
       ============================================================ */

    document.addEventListener(
      "click",
      event => {
        const button =
          event.target.closest(
            '[data-action="map-view-item"], [data-action="map-close-item"]'
          );

        if (!button) {
          return;
        }

        if (
          button.dataset.action ===
          "map-close-item"
        ) {
          ui.selectedMapItemId =
            null;

          renderMapItemBanner();
          return;
        }

        const itemId =
          button.dataset.id;

        if (itemId) {
          openItemDetail(
            itemId
          );
        }
      }
    );
  })();
