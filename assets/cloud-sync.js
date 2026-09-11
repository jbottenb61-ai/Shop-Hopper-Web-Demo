
(() => {
  "use strict";

  const SHOP_HOPPER_SUPABASE_URL =
    "https://ulnwokjannqitxgxqkdu.supabase.co";
  const SHOP_HOPPER_SUPABASE_KEY =
    "sb_publishable_abcSfF1w9wRtRHwIVs5zUA_n-Ctn8i2";

  if (!window.supabase?.createClient) {
    console.error("Shop Hopper cloud client could not be loaded.");
    return;
  }

  const cloudClient = window.supabase.createClient(
    SHOP_HOPPER_SUPABASE_URL,
    SHOP_HOPPER_SUPABASE_KEY
  );

  async function loadPhotoSource(file) {
    if (
      typeof createImageBitmap ===
      "function"
    ) {
      return createImageBitmap(
        file
      );
    }

    const objectUrl =
      URL.createObjectURL(
        file
      );

    try {
      const image =
        new Image();

      image.src =
        objectUrl;

      await image.decode();

      return image;
    } finally {
      URL.revokeObjectURL(
        objectUrl
      );
    }
  }

  async function prepareItemPhoto(file) {
    if (
      !file?.type?.startsWith(
        "image/"
      )
    ) {
      throw new Error(
        "Please choose an image file."
      );
    }

    if (
      file.size >
      25 * 1024 * 1024
    ) {
      throw new Error(
        "That photo is larger than 25 MB. Please choose a smaller image."
      );
    }

    const source =
      await loadPhotoSource(
        file
      );

    const sourceWidth =
      source.naturalWidth ||
      source.width;

    const sourceHeight =
      source.naturalHeight ||
      source.height;

    const maxDimension =
      1800;

    const scale =
      Math.min(
        1,
        maxDimension /
          Math.max(
            sourceWidth,
            sourceHeight
          )
      );

    const canvas =
      document.createElement(
        "canvas"
      );

    canvas.width =
      Math.max(
        1,
        Math.round(
          sourceWidth *
          scale
        )
      );

    canvas.height =
      Math.max(
        1,
        Math.round(
          sourceHeight *
          scale
        )
      );

    canvas
      .getContext(
        "2d"
      )
      .drawImage(
        source,
        0,
        0,
        canvas.width,
        canvas.height
      );

    source.close?.();

    const blob =
      await new Promise(
        resolve =>
          canvas.toBlob(
            resolve,
            "image/jpeg",
            0.84
          )
      );

    if (!blob) {
      throw new Error(
        "The selected photo could not be prepared."
      );
    }

    if (
      blob.size >
      6 * 1024 * 1024
    ) {
      throw new Error(
        "The prepared photo is still too large to upload."
      );
    }

    return blob;
  }

  window.shopHopperUploadImage =
    async function uploadItemPhoto(
      file
    ) {
      if (!cloudCanEdit) {
        throw new Error(
          "Sign in as an approved editor before uploading a photo."
        );
      }

      const {
        data: {
          session
        }
      } =
        await cloudClient.auth.getSession();

      if (!session) {
        throw new Error(
          "Your editor session has expired. Please sign in again."
        );
      }

      const photo =
        await prepareItemPhoto(
          file
        );

      const path =
        `${session.user.id}/${Date.now()}-${crypto.randomUUID()}.jpg`;

      const {
        error
      } =
        await cloudClient.storage
          .from(
            "item-photos"
          )
          .upload(
            path,
            photo,
            {
              cacheControl:
                "3600",

              contentType:
                "image/jpeg",

              upsert:
                false
            }
          );

      if (error) {
        throw error;
      }

      const {
        data
      } =
        cloudClient.storage
          .from(
            "item-photos"
          )
          .getPublicUrl(
            path
          );

      if (!data?.publicUrl) {
        await cloudClient.storage
          .from("item-photos")
          .remove([path]);

        throw new Error(
          "The uploaded photo URL could not be created."
        );
      }

      pendingPhotoPaths.add(
        path
      );

      return data.publicUrl;
    };

  let cloudReady = false;
  let cloudCanEdit = false;
  let cloudSyncing = false;
  let cloudReloadTimer = null;
  let cloudSyncTimer = null;
  let cloudKnownIds = null;
  let cloudRevision = null;
  const pendingPhotoPaths =
    new Set();

  const localSaveState = saveState;

  function ids(values) {
    return new Set((values || []).map(value => value.id));
  }

  function captureIds(source) {
    return {
      merchants: ids(source.merchants),
      stores: ids(source.stores),
      items: ids(source.items),
      hoppers: ids(source.hoppers),
      hopperLists: ids(source.hopperLists),
      hopperEntries: ids(
        (source.hopperLists || []).flatMap(list => list.entries || [])
      )
    };
  }

  function difference(before, after) {
    return [...(before || [])].filter(value => !(after || new Set()).has(value));
  }

  function setCloudStatus(message, mode = "") {
    const status = document.getElementById("cloudStatus");
    if (!status) return;
    status.className = `cloud-status ${mode}`.trim();
    status.querySelector("span:last-child").textContent = message;
  }

  const EDITOR_ONLY_SELECTOR = [
    '[data-persona-builder="add"]',
    '[data-hopper-manage="edit"]',
    '[data-hopper-manage="delete"]',
    '[data-hopper-nav="add"]',
    '[data-action="hopper-add-local-find"]',
    '[data-hopper-catalog-action="add"]',
    '[data-hopper-catalog-action="create"]',
    '[data-action="add-merchant"]',
    '[data-action="reset-demo"]',
    '[data-action="add-store"]',
    '[data-action="edit-store"]',
    '[data-action="toggle-store-publish"]',
    '[data-action="add-item"]',
    '[data-action="bulk-import"]',
    '[data-action="edit-item"]',
    '[data-action="toggle-item"]',
    '[data-action="delete-item"]',
    '[data-demo-data-action="import"]'
  ].join(',');

  const ACTION_LABELS = {
    "shopper-filter": "Filter products",
    "refresh-shopper": "Refresh products",
    "refresh-merchant": "Refresh merchant data",
    "merchant-exit": "Back to merchant list",
    "edit-store": "Edit store",
    "toggle-store-publish": "Change store publishing status",
    "edit-item": "Edit item",
    "toggle-item": "Change item publishing status",
    "delete-item": "Delete item",
    "hopper-open-item": "Open item details",
    "map-view-item": "Open map item"
  };

  function improveAccessibleNames(root = document) {
    root.querySelectorAll("i").forEach(icon => icon.setAttribute("aria-hidden", "true"));

    root.querySelectorAll("button, [role=button]").forEach(control => {
      if (control.getAttribute("aria-label")) return;
      const action = control.dataset?.action;
      const label = ACTION_LABELS[action] || control.title || control.textContent.trim();
      if (label) control.setAttribute("aria-label", label);
    });

    root.querySelectorAll(".leaflet-marker-icon:not([aria-label])").forEach(marker => {
      marker.setAttribute("aria-label", marker.title || "Map location");
    });
  }

  function organizeDemoBar() {
    const bar = document.querySelector(".demo-bar");
    if (!bar || bar.dataset.organized === "true") return;

    const label = bar.querySelector(".demo-label");
    const select = document.getElementById("personaSelect");
    const help = bar.querySelector(".prototype-help-button");
    const persona = bar.querySelector(".add-hopper-persona-button");
    const dataTools = document.getElementById("demoDataTools");
    const status = document.getElementById("cloudStatus");
    const auth = document.getElementById("cloudAuthButton");

    const primary = document.createElement("div");
    primary.className = "demo-primary-tools";
    [label, select, help].forEach(node => node && primary.appendChild(node));

    const menu = document.createElement("details");
    menu.className = "demo-tools-menu";
    const summary = document.createElement("summary");
    summary.textContent = "Tools";
    summary.setAttribute("aria-label", "Open Shop Hopper tools");
    const panel = document.createElement("div");
    panel.className = "demo-tools-panel";
    [persona, dataTools].forEach(node => node && panel.appendChild(node));
    menu.append(summary, panel);
    primary.appendChild(menu);

    const authTools = document.createElement("div");
    authTools.className = "demo-auth-tools";
    [status, auth].forEach(node => node && authTools.appendChild(node));

    bar.replaceChildren(primary, authTools);
    bar.dataset.organized = "true";
  }

  function applyEditorUI() {
    const editingAvailable =
      cloudCanEdit &&
      cloudReady;

    document.querySelectorAll(EDITOR_ONLY_SELECTOR).forEach(control => {
      control.dataset.editorOnly = "true";
      control.hidden = !editingAvailable;
      control.setAttribute("aria-hidden", String(!editingAvailable));
    });

    let notice = document.getElementById("readOnlyNotice");
    if (!notice) {
      notice = document.createElement("div");
      notice.id = "readOnlyNotice";
      notice.className = "read-only-notice";
      notice.setAttribute("role", "status");
      notice.textContent = "Viewing shared Shop Hopper data — sign in as an approved team member to make changes.";
      document.querySelector(".demo-bar")?.insertAdjacentElement("afterend", notice);
    }
    notice.hidden =
      editingAvailable;

    notice.textContent =
      cloudCanEdit && !cloudReady
        ? "Offline cache is available for viewing only. Reconnect before making shared changes."
        : "Viewing shared Shop Hopper data — sign in as an approved team member to make changes.";

    improveAccessibleNames();
  }

  function installEditorAwareRendering() {
    const originalRenderAll = renderAll;
    renderAll = function renderAllWithEditorState() {
      originalRenderAll();
      applyEditorUI();
    };

    document.addEventListener("click", event => {
      const control = event.target.closest(EDITOR_ONLY_SELECTOR);
      if (!control || cloudCanEdit) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      setCloudStatus("Sign in to make changes", "error");
    }, true);
  }

  function installCloudControls() {
    const bar = document.querySelector(".demo-bar");
    if (!bar || document.getElementById("cloudStatus")) return;

    const status = document.createElement("div");
    status.id = "cloudStatus";
    status.className = "cloud-status";
    status.innerHTML = '<span class="cloud-status-dot"></span><span>Connecting…</span>';

    const auth = document.createElement("button");
    auth.id = "cloudAuthButton";
    auth.type = "button";
    auth.className = "cloud-auth-button";
    auth.textContent = "Team sign in";
    auth.addEventListener("click", handleAuthClick);

    bar.append(status, auth);
    organizeDemoBar();
    improveAccessibleNames(bar);
  }

  async function refreshEditorStatus() {
    const { data: { session } } = await cloudClient.auth.getSession();
    const button = document.getElementById("cloudAuthButton");

    if (!session) {
      cloudCanEdit = false;
      if (button) button.textContent = "Team sign in";
      applyEditorUI();
      return;
    }

    const { data, error } = await cloudClient
      .from("app_editors")
      .select("user_id")
      .eq("user_id", session.user.id)
      .maybeSingle();

    cloudCanEdit = !error && Boolean(data);
    if (button) button.textContent = cloudCanEdit ? "Editor signed in" : "Sign out";
    applyEditorUI();
  }

  async function handleAuthClick() {
    const {
      data: {
        session
      }
    } =
      await cloudClient.auth.getSession();

    if (session) {
      await cloudClient.auth.signOut();
      cloudCanEdit =
        false;

      document.getElementById(
        "cloudAuthButton"
      ).textContent =
        "Team sign in";

      setCloudStatus(
        "Shared data · view only",
        "connected"
      );

      applyEditorUI();
      announce(
        "You are signed out. Shared data is read only."
      );

      return;
    }

    openModal({
      title:
        "Team sign in",

      submitLabel:
        "Send sign-in link",

      body: `
        <div class="notice">
          Use an approved Shop Hopper team email. We will send a secure magic link.
        </div>
        <div class="field">
          <label for="teamSignInEmail">Email address</label>
          <input
            id="teamSignInEmail"
            name="teamEmail"
            type="email"
            inputmode="email"
            autocomplete="email"
            required
          />
        </div>
        <p
          id="teamSignInStatus"
          class="form-status"
          role="status"
          aria-live="polite"
        ></p>
      `,

      onSubmit:
        async form => {
          const email =
            new FormData(
              form
            )
              .get(
                "teamEmail"
              )
              ?.toString()
              .trim();

          if (!email) {
            form.reportValidity();
            return;
          }

          const status =
            document.getElementById(
              "teamSignInStatus"
            );

          modalSubmit.disabled =
            true;

          if (status) {
            status.textContent =
              "Sending sign-in link…";
          }

          const {
            error
          } =
            await cloudClient.auth.signInWithOtp({
              email,
              options: {
                emailRedirectTo:
                  new URL(
                    ".",
                    window.location.href
                  ).href,
                shouldCreateUser:
                  true
              }
            });

          modalSubmit.disabled =
            false;

          if (error) {
            if (status) {
              status.textContent =
                `Could not send the sign-in email: ${error.message}`;
            }

            announce(
              "The sign-in email could not be sent.",
              "assertive"
            );

            return;
          }

          closeModal();

          announce(
            "Sign-in link sent. Check your email."
          );

          openModal({
            title:
              "Check your email",
            submitLabel:
              null,
            body: `
              <div class="notice">
                We sent a Shop Hopper sign-in link to
                <strong>${escapeHtml(email)}</strong>.
                You may close this message after opening the link.
              </div>
            `
          });
        }
    });
  }

  function mapCloudState(results) {
    const [merchants, stores, items, hoppers, lists, entries, settings] = results;
    const entriesByList = new Map();

    (entries.data || []).forEach(row => {
      if (!entriesByList.has(row.hopper_list_id)) entriesByList.set(row.hopper_list_id, []);
      entriesByList.get(row.hopper_list_id).push({
        id: row.id,
        itemId: row.item_id,
        merchantId: row.merchant_id,
        itemName: row.item_name,
        merchantName: row.merchant_name,
        suggestedCategory: row.suggested_category,
        note: row.note
      });
    });

    return {
      userLocation:
        (settings.data || []).find(row => row.key === "default_location")?.value ||
        state.userLocation,
      merchants: (merchants.data || []).map(row => ({
        id: row.id,
        businessName: row.business_name,
        ownerName: row.owner_name,
        email: row.email,
        phone: row.phone,
        status: row.status
      })),
      stores: (stores.data || []).map(row => ({
        id: row.id,
        merchantId: row.merchant_id,
        name: row.name,
        description: row.description,
        address: row.address,
        marketplaceSlug: row.marketplace_slug,
        category: row.category,
        lat: row.lat,
        lng: row.lng,
        published: row.published
      })),
      items: (items.data || []).map(row => ({
        id: row.id,
        storeId: row.store_id,
        title: row.title,
        description: row.description,
        category: row.category,
        type: row.item_type,
        priceCents: row.price_cents,
        qty: row.qty,
        image: row.image_url,
        featured: row.featured,
        active: row.active,
        createdByHopperId: row.created_by_hopper_id
      })),
      hoppers: (hoppers.data || []).map(row => ({
        id: row.id,
        name: row.display_name,
        personaName: row.persona_name,
        avatar: row.avatar,
        location: row.location,
        marketplaceSlug: row.marketplace_slug,
        marketplaceName: row.marketplace_name,
        interests: row.interests || [],
        active: row.active
      })),
      hopperLists: (lists.data || []).map(row => ({
        id: row.id,
        hopperId: row.hopper_id,
        title: row.title,
        description: row.description,
        entries: entriesByList.get(row.id) || []
      }))
    };
  }

  async function loadCloudState({ quiet = false } = {}) {
    if (!quiet) setCloudStatus("Loading shared data…");

    const revisionRequest =
      cloudCanEdit
        ? cloudClient
            .from(
              "app_sync_revision"
            )
            .select(
              "revision"
            )
            .eq(
              "singleton",
              true
            )
            .single()
        : Promise.resolve({
            data: null,
            error: null
          });

    const results = await Promise.all([
      cloudClient.from("merchants").select("*").order("business_name"),
      cloudClient.from("stores").select("*").order("name"),
      cloudClient.from("items").select("*").order("title"),
      cloudClient.from("hoppers").select("*").order("display_name"),
      cloudClient.from("hopper_lists").select("*").order("title"),
      cloudClient.from("hopper_list_entries").select("*").order("sort_order"),
      cloudClient.from("app_settings").select("*"),
      revisionRequest
    ]);

    const failure = results.find(result => result.error);
    if (failure) {
      setCloudStatus("Offline · local copy", "error");
      console.error("Could not load Shop Hopper shared data.", failure.error);
      return false;
    }

    state = mapCloudState(results);
    cloudKnownIds = captureIds(state);
    cloudRevision =
      results[7]?.data?.revision ??
      null;

    localSaveState();
    cloudReady = true;
    renderAll();
    setCloudStatus(
      cloudCanEdit ? "Shared data · editor" : "Shared data · view only",
      "connected"
    );
    return true;
  }

  async function syncCloudState() {
    if (!cloudReady || !cloudCanEdit || cloudSyncing) return;
    cloudSyncing = true;
    setCloudStatus("Saving shared update…");

    try {
      const currentIds = captureIds(state);
      const removals = [
        ...difference(cloudKnownIds?.hopperEntries, currentIds.hopperEntries).map(id => ({ table: "hopper_list_entries", id })),
        ...difference(cloudKnownIds?.hopperLists, currentIds.hopperLists).map(id => ({ table: "hopper_lists", id })),
        ...difference(cloudKnownIds?.items, currentIds.items).map(id => ({ table: "items", id })),
        ...difference(cloudKnownIds?.stores, currentIds.stores).map(id => ({ table: "stores", id })),
        ...difference(cloudKnownIds?.merchants, currentIds.merchants).map(id => ({ table: "merchants", id })),
        ...difference(cloudKnownIds?.hoppers, currentIds.hoppers).map(id => ({ table: "hoppers", id }))
      ];

      /*
       * The database validates this explicit ID list and performs the
       * deletions plus the upserts in one transaction. This supports
       * Hopper cascades and Import Data reconciliation without granting
       * TRUNCATE or allowing an unrestricted table clear.
       */
      const {
        data: nextRevision,
        error
      } =
        await cloudClient.rpc(
          "sync_app_state",
          {
            payload:
              state,
            removals,
            expected_revision:
              cloudRevision
          }
        );

      if (error) {
        throw error;
      }

      cloudRevision =
        nextRevision;

      cloudKnownIds =
        currentIds;

      pendingPhotoPaths.clear();

      setCloudStatus(
        "Shared update saved",
        "connected"
      );

      announce(
        "Shared update saved."
      );
    } catch (error) {
      console.error(
        "Shared update failed.",
        error
      );

      setCloudStatus(
        "Update not saved",
        "error"
      );

      if (
        pendingPhotoPaths.size
      ) {
        const paths =
          [...pendingPhotoPaths];

        const {
          error: cleanupError
        } =
          await cloudClient.storage
            .from(
              "item-photos"
            )
            .remove(
              paths
            );

        if (!cleanupError) {
          pendingPhotoPaths.clear();
        } else {
          console.warn(
            "Unused photo cleanup could not finish.",
            cleanupError
          );
        }
      }

      announce(
        error.message ||
        "The shared update could not be saved.",
        "assertive"
      );

      await loadCloudState({
        quiet: true
      });
    } finally {
      cloudSyncing = false;
    }
  }

  saveState = function saveSharedState() {
    localSaveState();
    if (!cloudReady) return;

    if (!cloudCanEdit) {
      setCloudStatus("Sign in to make changes", "error");
      window.clearTimeout(cloudReloadTimer);
      cloudReloadTimer = window.setTimeout(() => loadCloudState({ quiet: true }), 250);
      return;
    }

    window.clearTimeout(cloudSyncTimer);
    cloudSyncTimer = window.setTimeout(syncCloudState, 250);
  };

  function scheduleCloudReload() {
    if (cloudSyncing) return;
    window.clearTimeout(cloudReloadTimer);
    cloudReloadTimer = window.setTimeout(() => loadCloudState({ quiet: true }), 350);
  }

  function subscribeToCloudChanges() {
    const channel = cloudClient.channel("shop-hopper-shared-data");
    ["merchants", "stores", "items", "hoppers", "hopper_lists", "hopper_list_entries", "app_settings"]
      .forEach(table => {
        channel.on(
          "postgres_changes",
          { event: "*", schema: "public", table },
          scheduleCloudReload
        );
      });
    channel.subscribe();
  }

  cloudClient.auth.onAuthStateChange(async () => {
    await refreshEditorStatus();
    if (cloudReady) {
      setCloudStatus(
        cloudCanEdit ? "Shared data · editor" : "Shared data · view only",
        "connected"
      );
    }
  });

  async function initializeCloud() {
    installCloudControls();
    installEditorAwareRendering();
    applyEditorUI();
    await refreshEditorStatus();
    await loadCloudState();
    subscribeToCloudChanges();
  }

  initializeCloud();
})();