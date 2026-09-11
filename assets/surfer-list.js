(() => {
  "use strict";

  const SURFER_HOPPER_ID =
    "hopper-surfer";

  /* ============================================================
     HELPERS
     ============================================================ */

  function surferKey(value) {
    return String(value || "")
      .trim()
      .toLowerCase()
      .replace(/[’]/g, "'")
      .replace(/\s+/g, " ");
  }

  function ensureSurferMerchant(
    targetState,
    spec
  ) {
    let merchant =
      targetState.merchants.find(
        candidate =>
          candidate.id === spec.id
      );

    if (!merchant) {
      merchant =
        targetState.merchants.find(
          candidate =>
            surferKey(
              candidate.businessName
            ) ===
            surferKey(
              spec.businessName
            )
        );
    }

    if (!merchant) {
      merchant = {
        ...spec
      };

      targetState.merchants.push(
        merchant
      );

      return merchant;
    }

    merchant.businessName =
      spec.businessName;

    merchant.status =
      "active";

    if (
      !merchant.ownerName &&
      spec.ownerName
    ) {
      merchant.ownerName =
        spec.ownerName;
    }

    if (
      !merchant.email &&
      spec.email
    ) {
      merchant.email =
        spec.email;
    }

    if (
      !merchant.phone &&
      spec.phone
    ) {
      merchant.phone =
        spec.phone;
    }

    return merchant;
  }

  function ensureSurferStore(
    targetState,
    spec,
    merchant
  ) {
    let store =
      targetState.stores.find(
        candidate =>
          candidate.id === spec.id
      );

    if (!store) {
      store =
        targetState.stores.find(
          candidate =>
            candidate.merchantId ===
              merchant.id &&
            surferKey(
              candidate.name
            ) ===
            surferKey(
              spec.name
            )
        );
    }

    if (!store) {
      store = {
        ...spec,
        merchantId:
          merchant.id
      };

      targetState.stores.push(
        store
      );

      return store;
    }

    Object.assign(
      store,
      {
        name:
          spec.name,

        merchantId:
          merchant.id,

        description:
          spec.description,

        address:
          spec.address,

        marketplaceSlug:
          "pacific-beach",

        category:
          spec.category,

        lat:
          spec.lat,

        lng:
          spec.lng,

        published:
          true
      }
    );

    return store;
  }

  function ensureSurferItem(
    targetState,
    spec,
    store
  ) {
    let item =
      targetState.items.find(
        candidate =>
          candidate.id === spec.id
      );

    if (!item) {
      item =
        targetState.items.find(
          candidate =>
            candidate.storeId ===
              store.id &&
            surferKey(
              candidate.title
            ) ===
            surferKey(
              spec.title
            )
        );
    }

    if (!item) {
      item = {
        ...spec,
        storeId:
          store.id
      };

      targetState.items.push(
        item
      );

      return item;
    }

    const existingId =
      item.id;

    Object.assign(
      item,
      spec,
      {
        id:
          existingId,

        storeId:
          store.id,

        active:
          true
      }
    );

    return item;
  }

  /* ============================================================
     COMPLETE SURFER DEMO DATA
     ============================================================ */

  function populateCompleteSurferDemo(
    targetState
  ) {
    if (
      !Array.isArray(
        targetState.merchants
      ) ||
      !Array.isArray(
        targetState.stores
      ) ||
      !Array.isArray(
        targetState.items
      )
    ) {
      return;
    }

    /* ----------------------------------------------------------
       MERCHANTS
       ---------------------------------------------------------- */

    const merchantSpecs = [
      {
        id:
          "merchant-mission-surf",

        businessName:
          "Mission Surf",

        ownerName:
          "Mission Surf Team",

        email:
          "prototype@missionsurf.local",

        phone:
          "(858) 483-8837",

        status:
          "active"
      },

      {
        id:
          "merchant-south-coast",

        businessName:
          "South Coast Surf Shops",

        ownerName:
          "South Coast Team",

        email:
          "prototype@southcoast.local",

        phone:
          "(858) 273-7600",

        status:
          "active"
      },

      {
        id:
          "merchant-gone-bananas",

        businessName:
          "Gone Bananas",

        ownerName:
          "Gone Bananas Team",

        email:
          "",

        phone:
          "(858) 488-4900",

        status:
          "active"
      },

      {
        id:
          "merchant-ananas-pb",

        businessName:
          "Ananas Pacific Beach",

        ownerName:
          "Ananas Team",

        email:
          "",

        phone:
          "",

        status:
          "active"
      },

      {
        id:
          "merchant-pb-fish-shop",

        businessName:
          "Pacific Beach Fish Shop",

        ownerName:
          "Fish Shop Team",

        email:
          "",

        phone:
          "(858) 483-4746",

        status:
          "active"
      },

      {
        id:
          "merchant-pacific-drive",

        businessName:
          "Pacific Drive Skateboard Shop",

        ownerName:
          "Pacific Drive Team",

        email:
          "info@pacificdrive.com",

        phone:
          "(858) 270-3361",

        status:
          "active"
      },

      {
        id:
          "merchant-play-it-again-pb",

        businessName:
          "Play It Again Sports",

        ownerName:
          "Pacific Beach Team",

        email:
          "",

        phone:
          "(858) 490-0222",

        status:
          "active"
      },

      {
        id:
          "merchant-randalls-sandals",

        businessName:
          "Randall's Sandals",

        ownerName:
          "Randall's Sandals Team",

        email:
          "",

        phone:
          "(619) 241-6138",

        status:
          "active"
      },

      {
        id:
          "merchant-pb-resort-wear",

        businessName:
          "Pacific Beach Resort Wear",

        ownerName:
          "PB Resort Wear Team",

        email:
          "",

        phone:
          "(858) 272-4554",

        status:
          "active"
      }
    ];

    const merchants = {};

    merchantSpecs.forEach(
      spec => {
        merchants[spec.id] =
          ensureSurferMerchant(
            targetState,
            spec
          );
      }
    );

    /* ----------------------------------------------------------
       STORES

       Some coordinates below are approximate demo map positions
       for the known public addresses.
       ---------------------------------------------------------- */

    const storeSpecs = [
      {
        id:
          "store-mission-surf",

        merchantId:
          "merchant-mission-surf",

        name:
          "Mission Surf Shop",

        description:
          "Surfboards, surf gear, apparel, accessories and rentals near the beach.",

        address:
          "4320 Mission Boulevard, San Diego, CA 92109",

        marketplaceSlug:
          "pacific-beach",

        category:
          "fashion",

        lat:
          32.7940,

        lng:
          -117.2550,

        published:
          true
      },

      {
        id:
          "store-south-coast-wahines",

        merchantId:
          "merchant-south-coast",

        name:
          "South Coast Wahines — Pacific Beach",

        description:
          "Pacific Beach surf and beachwear shop featuring apparel, footwear and surf lifestyle merchandise.",

        address:
          "4500 Ocean Blvd, San Diego, CA 92109",

        marketplaceSlug:
          "pacific-beach",

        category:
          "fashion",

        lat:
          32.7961711,

        lng:
          -117.2566854,

        published:
          true
      },

      {
        id:
          "store-gone-bananas",

        merchantId:
          "merchant-gone-bananas",

        name:
          "Gone Bananas Beachwear",

        description:
          "Long-running San Diego beachwear and swimwear boutique near Mission Beach.",

        address:
          "3785 Mission Blvd, San Diego, CA 92109",

        marketplaceSlug:
          "pacific-beach",

        category:
          "seasonal",

        lat:
          32.7845306,

        lng:
          -117.2528229,

        published:
          true
      },

      {
        id:
          "store-ananas-pb",

        merchantId:
          "merchant-ananas-pb",

        name:
          "Ananas Pacific Beach",

        description:
          "Pacific Beach gifts, souvenirs, apparel and beach accessories.",

        address:
          "714 Garnet Ave, San Diego, CA 92109",

        marketplaceSlug:
          "pacific-beach",

        category:
          "fashion",

        lat:
          32.796473,

        lng:
          -117.256495,

        published:
          true
      },

      {
        id:
          "store-pb-fish-shop",

        merchantId:
          "merchant-pb-fish-shop",

        name:
          "Pacific Beach Fish Shop",

        description:
          "Local Pacific Beach seafood restaurant known for customizable fresh fish tacos and seafood.",

        address:
          "1775 Garnet Ave, San Diego, CA 92109",

        marketplaceSlug:
          "pacific-beach",

        category:
          "grocery",

        lat:
          32.8006,

        lng:
          -117.2346,

        published:
          true
      },

      {
        id:
          "store-pacific-drive",

        merchantId:
          "merchant-pacific-drive",

        name:
          "Pacific Drive Skateboard Shop",

        description:
          "Pacific Beach skate shop serving local skaters since 1987.",

        address:
          "756 Thomas Ave, San Diego, CA 92109",

        marketplaceSlug:
          "pacific-beach",

        category:
          "fitness",

        lat:
          32.79384,

        lng:
          -117.25505,

        published:
          true
      },

      {
        id:
          "store-play-it-again-pb",

        merchantId:
          "merchant-play-it-again-pb",

        name:
          "Play It Again Sports — Pacific Beach",

        description:
          "New and used sporting goods, including rotating used surfboard inventory.",

        address:
          "1401 Garnet Ave, San Diego, CA 92109",

        marketplaceSlug:
          "pacific-beach",

        category:
          "fitness",

        lat:
          32.7992,

        lng:
          -117.2443,

        published:
          true
      },

      {
        id:
          "store-randalls-sandals",

        merchantId:
          "merchant-randalls-sandals",

        name:
          "Randall's Sandals",

        description:
          "Local Pacific Beach sandal shop specializing in beach footwear and accessories.",

        address:
          "1033 Garnet Ave, San Diego, CA 92109",

        marketplaceSlug:
          "pacific-beach",

        category:
          "fashion",

        lat:
          32.7974,

        lng:
          -117.2514,

        published:
          true
      },

      {
        id:
          "store-pb-resort-wear",

        merchantId:
          "merchant-pb-resort-wear",

        name:
          "Pacific Beach Resort Wear",

        description:
          "Pacific Beach souvenir apparel, shirts and beachwear.",

        address:
          "4131 Ocean Front Walk, San Diego, CA 92109",

        marketplaceSlug:
          "pacific-beach",

        category:
          "fashion",

        lat:
          32.7932,

        lng:
          -117.2555,

        published:
          true
      }
    ];

    const stores = {};

    storeSpecs.forEach(
      spec => {
        const merchant =
          merchants[
            spec.merchantId
          ];

        if (!merchant) {
          return;
        }

        stores[spec.id] =
          ensureSurferStore(
            targetState,
            spec,
            merchant
          );
      }
    );

    /* ----------------------------------------------------------
       ITEMS
       ---------------------------------------------------------- */

    const itemSpecs = [
      {
        key:
          "sex-wax",

        id:
          "item-mission-sex-wax",

        storeId:
          "store-mission-surf",

        title:
          "Mr. Zog's Sex Wax Original Surf Wax",

        description:
          "Classic surfboard wax selected by The Surfer as a Pacific Beach surf-bag essential.",

        category:
          "seasonal",

        type:
          "product",

        priceCents:
          272,

        qty:
          30,

        image:
          "https://www.cleanlinesurf.com/cdn/shop/files/Sex-Wax-WAXOGCOOS-Original-Cool-Surf-Wax-Strawberry_400x%402x.jpg?v=1747772613",

        featured:
          true,

        active:
          true
      },

      {
        key:
          "towel",

        id:
          "item-south-coast-towel",

        storeId:
          "store-south-coast-wahines",

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
          "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80",

        featured:
          true,

        active:
          true
      },

      {
        key:
          "sunscreen",

        id:
          "item-gone-bananas-sunscreen",

        storeId:
          "store-gone-bananas",

        title:
          "Sun Bum Original SPF 70 Sunscreen Lotion",

        description:
          "Demo sunscreen listing selected by The Surfer for long Pacific Beach days.",

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
      },

      {
        key:
          "keychain",

        id:
          "item-ananas-pb-keychain",

        storeId:
          "store-ananas-pb",

        title:
          "Pacific Beach Surf Keychain",

        description:
          "Demo Pacific Beach souvenir keychain selected by The Surfer.",

        category:
          "fashion",

        type:
          "product",

        priceCents:
          799,

        qty:
          25,

        image:
          "https://rlv.zcache.com/pacific_beach_san_diego_vintage_retro_surfing_keychain-rfd77d41c190b4af0b5336d23052447ed_c01k3_644.jpg?rlvnet=1",

        featured:
          true,

        active:
          true
      },

      {
        key:
          "bike-rack",

        id:
          "item-mission-surf-bike-rack",

        storeId:
          "store-mission-surf",

        title:
          "Surfboard Bike Rack",

        description:
          "Demo surfboard bicycle rack for carrying a board down to the break.",

        category:
          "auto",

        type:
          "product",

        priceCents:
          8995,

        qty:
          4,

        image:
          "https://static.wixstatic.com/media/50726d_38a189cd941f4b0b82cd9ce87547f82f~mv2.jpg/v1/fill/w_800%2Ch_563%2Cal_c%2Cq_85%2Cenc_avif%2Cquality_auto/50726d_38a189cd941f4b0b82cd9ce87547f82f~mv2.jpg",

        featured:
          true,

        active:
          true
      },

      {
        key:
          "fish-tacos",

        id:
          "item-pb-fish-shop-mahi-taco",

        storeId:
          "store-pb-fish-shop",

        title:
          "Mahi Mahi Taco",

        description:
          "Mahi Mahi taco with shredded cabbage, pico de gallo, mixed cheeses and house cilantro white sauce.",

        category:
          "grocery",

        type:
          "product",

        priceCents:
          700,

        qty:
          50,

        image:
          "https://food.fnr.sndimg.com/content/dam/images/food/fullset/2010/4/26/0/FNM_060110-Weeknight-001_s4x3.jpg.rend.hgtvcom.1280.1280.85.suffix/1371591159264.webp",

        featured:
          true,

        active:
          true
      },

      {
        key:
          "skate",

        id:
          "item-pacific-drive-skate-deck",

        storeId:
          "store-pacific-drive",

        title:
          "Skateboard Deck",

        description:
          "Demo street skateboard deck representing The Surfer's Pacific Drive skate-shop pick.",

        category:
          "fitness",

        type:
          "product",

        priceCents:
          6995,

        qty:
          8,

        image:
          "https://www.routeone.co.uk/cdn/shop/collections/001145086.webp?crop=center&height=1200&v=1736160151&width=1200",

        featured:
          true,

        active:
          true
      },

      {
        key:
          "used-board",

        id:
          "item-play-it-again-used-gh-board",

        storeId:
          "store-play-it-again-pb",

        title:
          "Used GH Surfboard — 7'4\"",

        description:
          "Used 7'4\" GH surfboard example from the Pacific Beach Play It Again Sports inventory.",

        category:
          "fitness",

        type:
          "product",

        priceCents:
          15999,

        qty:
          1,

        image:
          "https://cdn11.bigcommerce.com/s-8yxoh6lp1a/images/stencil/600x600/products/6781897/6367651/2f8aa003-ada9-47b4-820b-92383c219470__14471.1779221955.png?c=1",

        featured:
          true,

        active:
          true
      },

      {
        key:
          "sandals",

        id:
          "item-randalls-rainbow-sandals",

        storeId:
          "store-randalls-sandals",

        title:
          "Rainbow Double Layer Classic Leather Sandals",

        description:
          "Double-layer classic leather Rainbow sandals with additional midsole support and a 1-inch leather strap.",

        category:
          "fashion",

        type:
          "product",

        priceCents:
          7400,

        qty:
          10,

        image:
          "https://randallssandals.com/cdn/shop/files/FullSizeRender_b04e0e32-73ff-4226-a0b0-d670f6d9746a.jpg?v=1726448135&width=1445",

        featured:
          true,

        active:
          true
      },

      {
        key:
          "apparel",

        id:
          "item-pb-resort-wear-shirt",

        storeId:
          "store-pb-resort-wear",

        title:
          "Pacific Beach Surf Tee",

        description:
          "Demo Pacific Beach surf-inspired souvenir shirt selected by The Surfer.",

        category:
          "fashion",

        type:
          "product",

        priceCents:
          2499,

        qty:
          20,

        image:
          "https://swellscenes.com/cdn/shop/files/il_fullxfull.6871805702_euly.jpg?v=1750472498",

        featured:
          true,

        active:
          true
      }
    ];

    const items = {};

    itemSpecs.forEach(
      spec => {
        const store =
          stores[
            spec.storeId
          ] ||
          targetState.stores.find(
            candidate =>
              candidate.id ===
              spec.storeId
          );

        if (!store) {
          return;
        }

        items[spec.key] =
          ensureSurferItem(
            targetState,
            spec,
            store
          );
      }
    );

    /* ----------------------------------------------------------
       HOPPER PROFILE / LIST
       ---------------------------------------------------------- */

    if (
      !Array.isArray(
        targetState.hoppers
      )
    ) {
      targetState.hoppers = [];
    }

    let surfer =
      targetState.hoppers.find(
        hopper =>
          hopper.id ===
          SURFER_HOPPER_ID
      );

    if (!surfer) {
      surfer = {
        id:
          SURFER_HOPPER_ID,

        name:
          "Hopper 0",

        personaName:
          "The Surfer",

        marketplaceSlug:
          "pacific-beach",

        marketplaceName:
          "Pacific Beach",

        interests: [
          "Surf",
          "Beach",
          "Skate",
          "Local Food"
        ]
      };

      targetState.hoppers.push(
        surfer
      );
    }

    if (
      !Array.isArray(
        targetState.hopperLists
      )
    ) {
      targetState.hopperLists = [];
    }

    let list =
      targetState.hopperLists.find(
        candidate =>
          candidate.hopperId ===
          SURFER_HOPPER_ID
      );

    if (!list) {
      list = {
        id:
          "hopper-surfer-pb-essentials",

        hopperId:
          SURFER_HOPPER_ID,

        title:
          "The Surfer's Pacific Beach Essentials",

        description:
          "Favorite local finds for surf days, beach life, skating and food around Pacific Beach.",

        entries:
          []
      };

      targetState.hopperLists.push(
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

    const entrySpecs = [
      {
        id:
          "hopper-pick-sex-wax",

        itemKey:
          "sex-wax",

        itemName:
          "Board wax / Sex Wax",

        merchantName:
          "Mission Surf",

        merchantId:
          "merchant-mission-surf",

        category:
          "seasonal",

        note:
          "A surf-bag staple before paddling out."
      },

      {
        id:
          "hopper-pick-towel",

        itemKey:
          "towel",

        itemName:
          "Beach towel",

        merchantName:
          "South Coast Wahines",

        merchantId:
          "merchant-south-coast",

        category:
          "seasonal",

        note:
          "Always good to have one waiting after a session."
      },

      {
        id:
          "hopper-pick-sunscreen",

        itemKey:
          "sunscreen",

        itemName:
          "Sunscreen",

        merchantName:
          "Gone Bananas",

        merchantId:
          "merchant-gone-bananas",

        category:
          "seasonal",

        note:
          "Keep it in the board bag for long beach days."
      },

      {
        id:
          "hopper-pick-keychain",

        itemKey:
          "keychain",

        itemName:
          "Keychain",

        merchantName:
          "Ananas Pacific Beach",

        merchantId:
          "merchant-ananas-pb",

        category:
          "fashion",

        note:
          "A simple little piece of PB to take home."
      },

      {
        id:
          "hopper-pick-bike-rack",

        itemKey:
          "bike-rack",

        itemName:
          "Surfboard bike rack",

        merchantName:
          "Mission Surf",

        merchantId:
          "merchant-mission-surf",

        category:
          "auto",

        note:
          "The PB way to get your board to the break without a car."
      },

      {
        id:
          "hopper-pick-fish-tacos",

        itemKey:
          "fish-tacos",

        itemName:
          "Fish tacos",

        merchantName:
          "Pacific Beach Fish Shop",

        merchantId:
          "merchant-pb-fish-shop",

        category:
          "grocery",

        note:
          "Post-surf fuel."
      },

      {
        id:
          "hopper-pick-skate",

        itemKey:
          "skate",

        itemName:
          "Skate items",

        merchantName:
          "Pacific Drive Skateboard Shop",

        merchantId:
          "merchant-pacific-drive",

        category:
          "fitness",

        note:
          "One of the local stops when the waves aren't cooperating."
      },

      {
        id:
          "hopper-pick-used-boards",

        itemKey:
          "used-board",

        itemName:
          "Used boards",

        merchantName:
          "Play It Again Sports, Pacific Beach",

        merchantId:
          "merchant-play-it-again-pb",

        category:
          "fitness",

        note:
          "Always worth checking the used rack for a good find."
      },

      {
        id:
          "hopper-pick-flip-flops",

        itemKey:
          "sandals",

        itemName:
          "Flip flops / sandals",

        merchantName:
          "Randall's Sandals",

        merchantId:
          "merchant-randalls-sandals",

        category:
          "fashion",

        note:
          "Pretty much the Pacific Beach uniform."
      },

      {
        id:
          "hopper-pick-apparel",

        itemKey:
          "apparel",

        itemName:
          "Apparel",

        merchantName:
          "Pacific Beach Resort Wear",

        merchantId:
          "merchant-pb-resort-wear",

        category:
          "fashion",

        note:
          "Classic PB gear for locals and visitors."
      }
    ];

    entrySpecs.forEach(
      spec => {
        const item =
          items[
            spec.itemKey
          ];

        if (!item) {
          return;
        }

        let entry =
          list.entries.find(
            candidate =>
              candidate.id ===
              spec.id
          );

        if (!entry) {
          entry = {
            id:
              spec.id
          };

          list.entries.push(
            entry
          );
        }

        entry.itemName =
          spec.itemName;

        entry.merchantName =
          spec.merchantName;

        entry.merchantId =
          spec.merchantId;

        entry.suggestedCategory =
          spec.category;

        entry.itemId =
          item.id;

        entry.note =
          spec.note;
      }
    );

    /*
     * Keep the original ten Hopper picks in the intended order.
     */
    const order = new Map(
      entrySpecs.map(
        (
          entry,
          index
        ) => [
          entry.id,
          index
        ]
      )
    );

    list.entries.sort(
      (
        a,
        b
      ) => {
        const aOrder =
          order.has(a.id)
            ? order.get(a.id)
            : 999;

        const bOrder =
          order.has(b.id)
            ? order.get(b.id)
            : 999;

        return (
          aOrder -
          bOrder
        );
      }
    );
  }

  /* ============================================================
     MAKE RESET ALSO RESTORE THE COMPLETE SURFER DEMO
     ============================================================ */

  const previousCreateSeedDataForSurfer =
    createSeedData;

  createSeedData =
    function createSeedDataWithCompleteSurfer() {
      const fresh =
        previousCreateSeedDataForSurfer();

      populateCompleteSurferDemo(
        fresh
      );

      return fresh;
    };

  /* ============================================================
     POPULATE CURRENT BROWSER DATA NOW
     ============================================================ */

  populateCompleteSurferDemo(
    state
  );

  saveState();

  renderAll();
})();