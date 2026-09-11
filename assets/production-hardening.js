(() => {
  "use strict";

  const TESTING_MODE_KEY =
    "shop-hopper-testing-mode";

  function setTestingMode(
    enabled
  ) {
    document.body.classList.toggle(
      "testing-mode",
      enabled
    );

    localStorage.setItem(
      TESTING_MODE_KEY,
      enabled
        ? "on"
        : "off"
    );

    const button =
      document.getElementById(
        "testingModeButton"
      );

    if (button) {
      button.textContent =
        enabled
          ? "Exit testing mode"
          : "Testing mode";

      button.setAttribute(
        "aria-pressed",
        String(
          enabled
        )
      );
    }
  }

  function installTestingMode() {
    setTestingMode(
      localStorage.getItem(
        TESTING_MODE_KEY
      ) ===
        "on" ||
      new URLSearchParams(
        window.location.search
      ).get(
        "testing"
      ) ===
        "1"
    );

    const authTools =
      document.querySelector(
        ".demo-auth-tools"
      );

    if (
      authTools &&
      !document.getElementById(
        "testingModeButton"
      )
    ) {
      const button =
        document.createElement(
          "button"
        );

      button.id =
        "testingModeButton";

      button.type =
        "button";

      button.className =
        "cloud-auth-button";

      button.dataset.editorOnly =
        "true";

      button.addEventListener(
        "click",
        () => {
          setTestingMode(
            !document.body.classList.contains(
              "testing-mode"
            )
          );
        }
      );

      authTools.insertBefore(
        button,
        authTools.firstChild
      );

      setTestingMode(
        document.body.classList.contains(
          "testing-mode"
        )
      );
    }
  }

  const observer =
    new MutationObserver(
      () => {
        document
          .querySelectorAll(
            ".image-crop-stage"
          )
          .forEach(
            stage => {
              stage.tabIndex =
                0;

              stage.setAttribute(
                "role",
                "application"
              );

              stage.setAttribute(
                "aria-label",
                "Photo crop. Use arrow keys to move, plus and minus to zoom, and R to rotate."
              );
            }
          );

        installTestingMode();
      }
    );

  observer.observe(
    document.body,
    {
      childList: true,
      subtree: true
    }
  );

  installTestingMode();
})();
