(() => {
  "use strict";

  /* ============================================================
     ENHANCE EXISTING ITEM DETAIL WINDOW
     ============================================================ */

  const originalOpenItemDetailStoreMap =
    openItemDetail;

  openItemDetail =
    function openItemDetailWithStoreMap(
      itemId
    ) {
      originalOpenItemDetailStoreMap(
        itemId
      );

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

      const detailGrid =
        modalBody.querySelector(
          ".detail-grid"
        );

      if (!detailGrid) {
        return;
      }

      /*
       * Find the existing paragraph containing
       * the store name.
       */
      const storeStrong =
        Array.from(
          detailGrid.querySelectorAll(
            ".detail-copy strong"
          )
        ).find(
          element =>
            element.textContent
              .trim() ===
            store.name.trim()
        );

      if (!storeStrong) {
        return;
      }

      const storeParagraph =
        storeStrong.closest(
          ".detail-copy"
        );

      if (!storeParagraph) {
        return;
      }

      const distance =
        getStoreDistance(
          store
        );

      storeParagraph.innerHTML = `
        <button
          type="button"
          class="item-store-link item-store-preview-button"
          data-store-preview="${escapeHtml(
            store.id
          )}"
          aria-label="View ${escapeHtml(
            store.name
          )} store page"
        >
          <i class="fa-solid fa-store" aria-hidden="true"></i>

          <span>
            ${escapeHtml(
              store.name
            )}
          </span>

          <i
            class="fa-solid fa-chevron-right store-map-arrow"
            aria-hidden="true"
          ></i>
        </button>

        <br />

        <span class="item-store-map-meta">
          ${escapeHtml(
            distanceLabel(
              distance
            )
          )}
          ·
          ${escapeHtml(
            marketplaceLabel(
              store
            )
          )}
        </span>
      `;

      const addressParagraph =
        Array.from(
          detailGrid.querySelectorAll(
            ".detail-copy"
          )
        ).find(
          element =>
            element !==
              storeParagraph &&
            element.textContent
              .trim() ===
            store.address.trim()
        );

      if (addressParagraph) {
        addressParagraph.innerHTML = `
          <button
            type="button"
            class="item-store-link item-store-address-button"
            data-store-map="${escapeHtml(
              store.id
            )}"
            aria-label="Show ${escapeHtml(
              store.name
            )} on the map at ${escapeHtml(
              store.address
            )}"
          >
            <i class="fa-solid fa-map-location-dot" aria-hidden="true"></i>
            <span>${escapeHtml(store.address)}</span>
            <i
              class="fa-solid fa-chevron-right store-map-arrow"
              aria-hidden="true"
            ></i>
          </button>
        `;
      }
    };

  /* ============================================================
     CENTER MAP ON SELECTED STORE
     ============================================================ */

  function focusStoreOnMap(
    store
  ) {
    let attempts =
      0;

    const timer =
      setInterval(
        () => {
          attempts +=
            1;

          /*
           * Give the map renderer time to finish.
           */
          if (
            activeMap &&
            activeMapEngine
          ) {
            clearInterval(
              timer
            );

            const lat =
              Number(
                store.lat
              );

            const lng =
              Number(
                store.lng
              );

            if (
              !Number.isFinite(
                lat
              ) ||
              !Number.isFinite(
                lng
              )
            ) {
              return;
            }

            /* ----------------------------------------------
               LEAFLET / OPENSTREETMAP
               ---------------------------------------------- */

            if (
              activeMapEngine ===
                "leaflet" &&
              window.L
            ) {
              activeMap.setView(
                [
                  lat,
                  lng
                ],
                16
              );

              L.marker(
                [
                  lat,
                  lng
                ]
              )
                .addTo(
                  activeMap
                )
                .bindPopup(
                  `
                    <strong>
                      ${escapeHtml(
                        store.name
                      )}
                    </strong>
                    <br />
                    ${escapeHtml(
                      store.address
                    )}
                  `
                )
                .openPopup();

              setTimeout(
                () => {
                  activeMap
                    ?.invalidateSize();
                },
                100
              );

              return;
            }

            /* ----------------------------------------------
               GOOGLE MAPS
               ---------------------------------------------- */

            if (
              activeMapEngine ===
                "google" &&
              window.google?.maps
            ) {
              const position = {
                lat,
                lng
              };

              activeMap.setCenter(
                position
              );

              activeMap.setZoom(
                16
              );

              const marker =
                new google.maps.Marker({
                  map:
                    activeMap,

                  position,

                  title:
                    store.name
                });

              const infoWindow =
                new google.maps.InfoWindow({
                  content:
                    `
                      <div
                        style="
                          font-family:
                            Arial,
                            sans-serif;
                          min-width:160px;
                        "
                      >
                        <strong>
                          ${escapeHtml(
                            store.name
                          )}
                        </strong>

                        <br />

                        <span
                          style="
                            color:#666;
                            font-size:12px;
                          "
                        >
                          ${escapeHtml(
                            store.address
                          )}
                        </span>
                      </div>
                    `
                });

              infoWindow.open({
                map:
                  activeMap,

                anchor:
                  marker
              });
            }

            return;
          }

          /*
           * Stop checking after about 5 seconds
           * if the map could not load.
           */
          if (
            attempts >=
            50
          ) {
            clearInterval(
              timer
            );
          }
        },
        100
      );
  }

  /* ============================================================
     STORE AND MAP CLICKS
     ============================================================ */

  document.addEventListener(
    "click",
    event => {
      const button =
        event.target.closest(
          "[data-store-preview]"
        );

      if (!button) {
        return;
      }

      openStorePreview(
        button.dataset.storePreview
      );
    }
  );

  document.addEventListener(
    "click",
    event => {
      const button =
        event.target.closest(
          "[data-store-map]"
        );

      if (!button) {
        return;
      }

      const store =
        getStore(
          button.dataset.storeMap
        );

      if (!store) {
        return;
      }

      closeModal();

      disposeMap();

      /*
       * Switch to the Shopper map even if the
       * product was opened from a Hopper card.
       */
      ui.persona =
        "shopper";

      ui.shopperView =
        "map";

      ui.marketplaceSlug =
        store.marketplaceSlug ||
        "pacific-beach";

      ui.selectedMapMarketplace =
        store.marketplaceSlug ||
        "pacific-beach";

      renderAll();

      /*
       * After the marketplace map is created,
       * zoom directly to this store.
       */
      focusStoreOnMap(
        store
      );
    }
  );
})();