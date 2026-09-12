
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
  let cloudViewer = {
    signedIn: false,
    canEdit: false,
    email: ""
  };

  window.shopHopperGetViewer =
    function getShopHopperViewer() {
      return { ...cloudViewer };
    };

  function refreshViewerDependentUI() {
    if (document.querySelector(".profile-page")) {
      renderAll();
      return;
    }
    applyEditorUI();
  }
  let cloudSyncing = false;
  let cloudReloadTimer = null;
  let cloudSyncTimer = null;
  let cloudKnownIds = null;
  let cloudBaseState = null;
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

  function changedRecords(current, previous) {
    const previousById = new Map(
      (previous || []).map(record => [record.id, JSON.stringify(record)])
    );
    return (current || []).filter(
      record => previousById.get(record.id) !== JSON.stringify(record)
    );
  }

  function createStateDelta(current, previous) {
    const delta = {
      merchants: changedRecords(current.merchants, previous?.merchants),
      stores: changedRecords(current.stores, previous?.stores),
      items: changedRecords(current.items, previous?.items),
      hoppers: changedRecords(current.hoppers, previous?.hoppers),
      hopperLists: changedRecords(current.hopperLists, previous?.hopperLists)
    };

    if (JSON.stringify(current.userLocation) !== JSON.stringify(previous?.userLocation)) {
      delta.userLocation = current.userLocation;
    }

    return delta;
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
      cloudViewer = { signedIn: false, canEdit: false, email: "" };
      if (button) button.textContent = "Team sign in";
      refreshViewerDependentUI();
      return;
    }

    const { data, error } = await cloudClient
      .from("app_editors")
      .select("user_id")
      .eq("user_id", session.user.id)
      .maybeSingle();

    cloudCanEdit = !error && Boolean(data);
    cloudViewer = {
      signedIn: true,
      canEdit: cloudCanEdit,
      email: session.user.email || ""
    };
    if (button) button.textContent = cloudCanEdit ? "Editor signed in" : "Sign out";
    refreshViewerDependentUI();
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
      cloudViewer = { signedIn: false, canEdit: false, email: "" };

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
        <div class="shop-hopper-sign-in-brand" aria-hidden="true">
          <img
            src="data:image/png;base64,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"
            alt=""
          />
        </div>
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
                shouldCreateUser: false
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
        image: row.image_url,
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
    cloudBaseState = structuredClone(state);
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
      const payloadDelta = createStateDelta(state, cloudBaseState);
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
              payloadDelta,
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

      cloudBaseState =
        structuredClone(
          state
        );

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
