(() => {
  "use strict";

  if (
    window.__shopHopperEmojiPickerInstalled
  ) {
    return;
  }

  window.__shopHopperEmojiPickerInstalled =
    true;

  /* ============================================================
     EMOJI LIBRARY
     Search works against these keywords.
     ============================================================ */

  const HOPPER_EMOJIS = [
    {
      emoji: "🏄",
      keywords:
        "surf surfer surfing wave ocean beach"
    },

    {
      emoji: "🛹",
      keywords:
        "skate skateboard skating skater street"
    },

    {
      emoji: "🏖️",
      keywords:
        "beach ocean vacation sand umbrella"
    },

    {
      emoji: "🌊",
      keywords:
        "wave ocean surf water beach"
    },

    {
      emoji: "☀️",
      keywords:
        "sun sunny beach summer outdoor"
    },

    {
      emoji: "🚲",
      keywords:
        "bike bicycle cycling ride"
    },

    {
      emoji: "🏃",
      keywords:
        "run runner running fitness"
    },

    {
      emoji: "🏋️",
      keywords:
        "gym fitness weights workout"
    },

    {
      emoji: "🧘",
      keywords:
        "yoga wellness health meditation"
    },

    {
      emoji: "⚽",
      keywords:
        "soccer sports ball"
    },

    {
      emoji: "🏀",
      keywords:
        "basketball sports ball"
    },

    {
      emoji: "🏈",
      keywords:
        "football sports ball"
    },

    {
      emoji: "⚾",
      keywords:
        "baseball sports ball"
    },

    {
      emoji: "🎾",
      keywords:
        "tennis sports racket"
    },

    {
      emoji: "⛳",
      keywords:
        "golf golfer sports"
    },

    {
      emoji: "🎸",
      keywords:
        "music guitar musician rock"
    },

    {
      emoji: "🎵",
      keywords:
        "music song audio musician"
    },

    {
      emoji: "🎧",
      keywords:
        "music headphones dj audio"
    },

    {
      emoji: "🎨",
      keywords:
        "art artist creative paint"
    },

    {
      emoji: "📸",
      keywords:
        "photo photographer photography camera"
    },

    {
      emoji: "🎬",
      keywords:
        "movie film cinema video"
    },

    {
      emoji: "📚",
      keywords:
        "books reading reader student"
    },

    {
      emoji: "☕",
      keywords:
        "coffee cafe caffeine morning"
    },

    {
      emoji: "🍵",
      keywords:
        "tea drink cafe matcha"
    },

    {
      emoji: "🍕",
      keywords:
        "pizza food restaurant foodie"
    },

    {
      emoji: "🌮",
      keywords:
        "taco tacos mexican food foodie"
    },

    {
      emoji: "🍔",
      keywords:
        "burger hamburger food restaurant"
    },

    {
      emoji: "🍣",
      keywords:
        "sushi food japanese restaurant"
    },

    {
      emoji: "🥗",
      keywords:
        "salad healthy food vegetarian"
    },

    {
      emoji: "🍦",
      keywords:
        "ice cream dessert food sweet"
    },

    {
      emoji: "🍩",
      keywords:
        "donut doughnut dessert bakery"
    },

    {
      emoji: "🍺",
      keywords:
        "beer brewery drink pub"
    },

    {
      emoji: "🍷",
      keywords:
        "wine winery drink"
    },

    {
      emoji: "🐕",
      keywords:
        "dog dogs pet pets puppy"
    },

    {
      emoji: "🐈",
      keywords:
        "cat cats pet pets kitten"
    },

    {
      emoji: "🐾",
      keywords:
        "pets animals dog cat paws"
    },

    {
      emoji: "🌱",
      keywords:
        "plants garden eco green nature"
    },

    {
      emoji: "🌴",
      keywords:
        "palm tropical beach vacation"
    },

    {
      emoji: "🌺",
      keywords:
        "flower tropical floral"
    },

    {
      emoji: "👗",
      keywords:
        "fashion clothing clothes style"
    },

    {
      emoji: "👟",
      keywords:
        "shoes sneakers fashion running"
    },

    {
      emoji: "🧢",
      keywords:
        "hat cap fashion streetwear"
    },

    {
      emoji: "🕶️",
      keywords:
        "sunglasses fashion beach style"
    },

    {
      emoji: "👜",
      keywords:
        "bag purse fashion shopping"
    },

    {
      emoji: "🛍️",
      keywords:
        "shopping shopper retail stores"
    },

    {
      emoji: "🔧",
      keywords:
        "tools mechanic hardware repair"
    },

    {
      emoji: "🔨",
      keywords:
        "hammer hardware construction tools"
    },

    {
      emoji: "🚗",
      keywords:
        "car auto automotive driving"
    },

    {
      emoji: "🏍️",
      keywords:
        "motorcycle bike motor"
    },

    {
      emoji: "🚐",
      keywords:
        "van travel camper road"
    },

    {
      emoji: "✈️",
      keywords:
        "travel traveler airplane trip"
    },

    {
      emoji: "🧳",
      keywords:
        "travel traveler luggage trip"
    },

    {
      emoji: "🗺️",
      keywords:
        "map travel local explorer geography"
    },

    {
      emoji: "📍",
      keywords:
        "location local map places"
    },

    {
      emoji: "⭐",
      keywords:
        "star favorite favorites best"
    },

    {
      emoji: "✨",
      keywords:
        "sparkle lifestyle general favorite"
    },

    {
      emoji: "🔥",
      keywords:
        "hot trending popular fire"
    },

    {
      emoji: "💡",
      keywords:
        "idea ideas expert knowledge"
    },

    {
      emoji: "😎",
      keywords:
        "cool lifestyle local expert"
    },

    {
      emoji: "🤙",
      keywords:
        "shaka surf beach local aloha"
    },

    {
      emoji: "❤️",
      keywords:
        "love favorite favorites heart"
    }
  ];

  /* ============================================================
     RENDER SEARCH RESULTS
     ============================================================ */

  function renderEmojiChoices(
    panel,
    searchValue = ""
  ) {
    const grid =
      panel.querySelector(
        ".hopper-emoji-grid"
      );

    if (!grid) {
      return;
    }

    const search =
      String(
        searchValue
      )
        .trim()
        .toLowerCase();

    const matches =
      HOPPER_EMOJIS.filter(
        item => {
          if (!search) {
            return true;
          }

          return (
            item.keywords.includes(
              search
            ) ||
            item.emoji.includes(
              search
            )
          );
        }
      );

    if (!matches.length) {
      grid.innerHTML = `
        <div
          class="hopper-emoji-empty"
        >
          No matching emoji found.
          Try another word.
        </div>
      `;

      return;
    }

    grid.innerHTML =
      matches
        .map(
          item => `
            <button
              type="button"
              class="hopper-emoji-choice"
              data-hopper-emoji="${item.emoji}"
              title="${escapeHtml(
                item.keywords
              )}"
            >
              ${item.emoji}
            </button>
          `
        )
        .join("");
  }

  /* ============================================================
     ADD PICKER TO AVATAR FIELD
     ============================================================ */

  function installEmojiPicker() {
    const avatarInput =
      modalBody.querySelector(
        'input[name="avatar"]'
      );

    if (!avatarInput) {
      return;
    }

    if (
      modalBody.querySelector(
        ".hopper-emoji-picker-button"
      )
    ) {
      return;
    }

    const field =
      avatarInput.closest(
        ".field"
      );

    if (!field) {
      return;
    }

    const currentEmoji =
      avatarInput.value ||
      "✨";

    field.insertAdjacentHTML(
      "beforeend",
      `
        <button
          type="button"
          class="hopper-emoji-picker-button"
          data-hopper-emoji-action="toggle"
        >
          <span
            class="hopper-avatar-preview"
            data-hopper-avatar-preview
          >
            ${escapeHtml(
              currentEmoji
            )}
          </span>

          Choose Emoji
        </button>

        <div
          class="hopper-emoji-panel"
          data-hopper-emoji-panel
        >
          <div
            class="hopper-emoji-search-wrap"
          >
            <i
              class="
                fa-solid
                fa-magnifying-glass
                hopper-emoji-search-icon
              "
            ></i>

            <input
              type="search"
              class="hopper-emoji-search"
              placeholder="Search: skate, surf, food, dog..."
              autocomplete="off"
            />
          </div>

          <div
            class="hopper-emoji-grid"
          ></div>

          <div
            class="hopper-emoji-help"
          >
            You can also type or paste any emoji directly
            into the Avatar field.
          </div>
        </div>
      `
    );

    const panel =
      field.querySelector(
        "[data-hopper-emoji-panel]"
      );

    if (panel) {
      renderEmojiChoices(
        panel,
        ""
      );
    }
  }

  /* ============================================================
     ENHANCE ALL MODALS
     ============================================================ */

  const previousOpenModalEmojiPicker =
    openModal;

  openModal =
    function openModalWithEmojiPicker(
      options
    ) {
      previousOpenModalEmojiPicker(
        options
      );

      requestAnimationFrame(
        () => {
          installEmojiPicker();
        }
      );
    };

  /* ============================================================
     EVENTS
     ============================================================ */

  document.addEventListener(
    "click",
    event => {
      const toggle =
        event.target.closest(
          '[data-hopper-emoji-action="toggle"]'
        );

      if (toggle) {
        const field =
          toggle.closest(
            ".field"
          );

        const panel =
          field?.querySelector(
            "[data-hopper-emoji-panel]"
          );

        if (panel) {
          panel.classList.toggle(
            "open"
          );

          if (
            panel.classList.contains(
              "open"
            )
          ) {
            panel
              .querySelector(
                ".hopper-emoji-search"
              )
              ?.focus();
          }
        }

        return;
      }

      const choice =
        event.target.closest(
          "[data-hopper-emoji]"
        );

      if (!choice) {
        return;
      }

      const field =
        choice.closest(
          ".field"
        );

      const avatarInput =
        field?.querySelector(
          'input[name="avatar"]'
        );

      const preview =
        field?.querySelector(
          "[data-hopper-avatar-preview]"
        );

      const panel =
        field?.querySelector(
          "[data-hopper-emoji-panel]"
        );

      const emoji =
        choice.dataset
          .hopperEmoji;

      if (
        avatarInput &&
        emoji
      ) {
        avatarInput.value =
          emoji;

        avatarInput.dispatchEvent(
          new Event(
            "input",
            {
              bubbles: true
            }
          )
        );
      }

      if (preview) {
        preview.textContent =
          emoji;
      }

      panel?.classList.remove(
        "open"
      );
    }
  );

  document.addEventListener(
    "input",
    event => {
      if (
        event.target.matches(
          ".hopper-emoji-search"
        )
      ) {
        const panel =
          event.target.closest(
            "[data-hopper-emoji-panel]"
          );

        if (panel) {
          renderEmojiChoices(
            panel,
            event.target.value
          );
        }

        return;
      }

      if (
        event.target.matches(
          'input[name="avatar"]'
        )
      ) {
        const field =
          event.target.closest(
            ".field"
          );

        const preview =
          field?.querySelector(
            "[data-hopper-avatar-preview]"
          );

        if (preview) {
          preview.textContent =
            event.target.value ||
            "✨";
        }
      }
    }
  );

  /*
   * Handle an avatar form that might already
   * be open when this code loads.
   */
  installEmojiPicker();
})();