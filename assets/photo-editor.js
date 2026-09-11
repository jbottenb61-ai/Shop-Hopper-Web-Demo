(() => {
  "use strict";

  let photoEditorState =
    null;

  function closeEditorSource() {
    photoEditorState?.source?.close?.();
    photoEditorState =
      null;
  }

  function editorCanvas() {
    return document.querySelector(
      ".image-crop-canvas"
    );
  }

  function editorPanel() {
    return document.querySelector(
      ".image-photo-editor"
    );
  }

  function rotatedSize(state) {
    const quarterTurn =
      Math.abs(state.rotation / 90) % 2 === 1;

    return quarterTurn
      ? {
          width: state.source.height,
          height: state.source.width
        }
      : {
          width: state.source.width,
          height: state.source.height
        };
  }

  function drawEditor() {
    const state =
      photoEditorState;

    const canvas =
      editorCanvas();

    if (!state || !canvas) {
      return;
    }

    const context =
      canvas.getContext("2d");

    const size =
      rotatedSize(state);

    const baseScale =
      state.full
        ? Math.min(
            canvas.width / size.width,
            canvas.height / size.height
          )
        : Math.max(
            canvas.width / size.width,
            canvas.height / size.height
          );

    const scale =
      baseScale *
      (state.full ? 1 : state.zoom);

    if (!state.full) {
      const maxX =
        Math.max(
          0,
          (
            size.width *
            scale -
            canvas.width
          ) /
          2
        );

      const maxY =
        Math.max(
          0,
          (
            size.height *
            scale -
            canvas.height
          ) /
          2
        );

      state.offsetX =
        Math.max(
          -maxX,
          Math.min(
            maxX,
            state.offsetX
          )
        );

      state.offsetY =
        Math.max(
          -maxY,
          Math.min(
            maxY,
            state.offsetY
          )
        );
    }

    context.fillStyle =
      "#182327";

    context.fillRect(
      0,
      0,
      canvas.width,
      canvas.height
    );

    context.save();

    context.translate(
      canvas.width / 2 +
        (state.full ? 0 : state.offsetX),
      canvas.height / 2 +
        (state.full ? 0 : state.offsetY)
    );

    context.rotate(
      state.rotation *
      Math.PI /
      180
    );

    context.drawImage(
      state.source,
      -state.source.width * scale / 2,
      -state.source.height * scale / 2,
      state.source.width * scale,
      state.source.height * scale
    );

    context.restore();
  }

  function resetEditor() {
    if (!photoEditorState) {
      return;
    }

    photoEditorState.zoom =
      1;

    photoEditorState.rotation =
      0;

    photoEditorState.offsetX =
      0;

    photoEditorState.offsetY =
      0;

    photoEditorState.full =
      false;

    const zoom =
      document.querySelector(
        ".image-crop-zoom input"
      );

    if (zoom) {
      zoom.value =
        "1";

      const zoomRow =
        zoom.closest(
          ".image-crop-zoom"
        );

      if (zoomRow) {
        zoomRow.hidden =
          false;
      }
    }

    const mode =
      document.querySelector(
        "[data-photo-editor-mode]"
      );

    if (mode) {
      mode.textContent =
        "Use Full Photo";
    }

    drawEditor();
  }

  async function loadEditorPhoto(
    file
  ) {
    closeEditorSource();

    let source;

    if (
      typeof createImageBitmap ===
      "function"
    ) {
      source =
        await createImageBitmap(
          file,
          {
            imageOrientation:
              "from-image"
          }
        );
    } else {
      source =
        await new Promise(
          (resolve, reject) => {
            const image =
              new Image();

            const url =
              URL.createObjectURL(
                file
              );

            image.onload =
              () => {
                URL.revokeObjectURL(
                  url
                );

                resolve(
                  image
                );
              };

            image.onerror =
              () => {
                URL.revokeObjectURL(
                  url
                );

                reject(
                  new Error(
                    "The selected photo could not be opened."
                  )
                );
              };

            image.src =
              url;
          }
        );
    }

    photoEditorState = {
      source,
      zoom: 1,
      rotation: 0,
      offsetX: 0,
      offsetY: 0,
      full: false,
      dragging: false,
      pointerId: null,
      lastX: 0,
      lastY: 0
    };

    const panel =
      editorPanel();

    if (panel) {
      panel.hidden =
        false;
    }

    resetEditor();
  }

  function canvasBlob(
    canvas
  ) {
    return new Promise(
      (resolve, reject) => {
        canvas.toBlob(
          blob => {
            if (blob) {
              resolve(blob);
            } else {
              reject(
                new Error(
                  "The edited photo could not be prepared."
                )
              );
            }
          },
          "image/jpeg",
          0.88
        );
      }
    );
  }

  window.shopHopperGetEditedPhoto =
    async function getEditedPhoto(
      fallbackFile
    ) {
      const state =
        photoEditorState;

      if (!state) {
        return fallbackFile;
      }

      if (!state.full) {
        return canvasBlob(
          editorCanvas()
        );
      }

      const size =
        rotatedSize(state);

      const maxDimension =
        1800;

      const scale =
        Math.min(
          1,
          maxDimension /
          Math.max(
            size.width,
            size.height
          )
        );

      const output =
        document.createElement(
          "canvas"
        );

      output.width =
        Math.max(
          1,
          Math.round(
            size.width *
            scale
          )
        );

      output.height =
        Math.max(
          1,
          Math.round(
            size.height *
            scale
          )
        );

      const context =
        output.getContext(
          "2d"
        );

      context.translate(
        output.width / 2,
        output.height / 2
      );

      context.rotate(
        state.rotation *
        Math.PI /
        180
      );

      context.drawImage(
        state.source,
        -state.source.width * scale / 2,
        -state.source.height * scale / 2,
        state.source.width * scale,
        state.source.height * scale
      );

      return canvasBlob(
        output
      );
    };

  document.addEventListener(
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

      const file =
        event.target.files?.[0];

      if (!file) {
        const panel =
          editorPanel();

        if (panel) {
          panel.hidden =
            true;
        }

        closeEditorSource();

        return;
      }

      loadEditorPhoto(
        file
      ).catch(
        error => {
          console.error(
            "Photo editor could not open the image.",
            error
          );

          alert(
            error.message
          );
        }
      );
    }
  );

  document.addEventListener(
    "input",
    event => {
      if (
        !event.target.matches(
          ".image-crop-zoom input"
        ) ||
        !photoEditorState
      ) {
        return;
      }

      photoEditorState.zoom =
        Number(
          event.target.value
        );

      drawEditor();
    }
  );

  document.addEventListener(
    "click",
    event => {
      const rotate =
        event.target.closest(
          "[data-photo-editor-rotate]"
        );

      if (
        rotate &&
        photoEditorState
      ) {
        photoEditorState.rotation =
          (
            photoEditorState.rotation +
            90
          ) %
          360;

        drawEditor();

        return;
      }

      if (
        event.target.closest(
          "[data-photo-editor-reset]"
        )
      ) {
        resetEditor();

        return;
      }

      const mode =
        event.target.closest(
          "[data-photo-editor-mode]"
        );

      if (
        mode &&
        photoEditorState
      ) {
        photoEditorState.full =
          !photoEditorState.full;

        mode.textContent =
          photoEditorState.full
            ? "Use Square Crop"
            : "Use Full Photo";

        const zoom =
          document.querySelector(
            ".image-crop-zoom"
          );

        if (zoom) {
          zoom.hidden =
            photoEditorState.full;
        }

        drawEditor();
      }
    }
  );

  document.addEventListener(
    "pointerdown",
    event => {
      const stage =
        event.target.closest(
          ".image-crop-stage"
        );

      if (
        !stage ||
        !photoEditorState ||
        photoEditorState.full
      ) {
        return;
      }

      photoEditorState.dragging =
        true;

      photoEditorState.pointerId =
        event.pointerId;

      photoEditorState.lastX =
        event.clientX;

      photoEditorState.lastY =
        event.clientY;

      stage.classList.add(
        "dragging"
      );

      stage.setPointerCapture?.(
        event.pointerId
      );
    }
  );

  document.addEventListener(
    "pointermove",
    event => {
      const state =
        photoEditorState;

      if (
        !state?.dragging ||
        state.pointerId !==
          event.pointerId
      ) {
        return;
      }

      const canvas =
        editorCanvas();

      const rect =
        canvas.getBoundingClientRect();

      state.offsetX +=
        (
          event.clientX -
          state.lastX
        ) *
        canvas.width /
        rect.width;

      state.offsetY +=
        (
          event.clientY -
          state.lastY
        ) *
        canvas.height /
        rect.height;

      state.lastX =
        event.clientX;

      state.lastY =
        event.clientY;

      drawEditor();
    }
  );

  function stopDragging(
    event
  ) {
    const state =
      photoEditorState;

    if (
      !state?.dragging ||
      state.pointerId !==
        event.pointerId
    ) {
      return;
    }

    state.dragging =
      false;

    document
      .querySelector(
        ".image-crop-stage"
      )
      ?.classList.remove(
        "dragging"
      );
  }

  document.addEventListener(
    "pointerup",
    stopDragging
  );

  document.addEventListener(
    "pointercancel",
    stopDragging
  );

  document.addEventListener(
    "keydown",
    event => {
      const stage =
        event.target.closest?.(
          ".image-crop-stage"
        );

      if (
        !stage ||
        !photoEditorState ||
        photoEditorState.full
      ) {
        return;
      }

      const step =
        event.shiftKey
          ? 24
          : 8;

      if (
        event.key ===
        "ArrowLeft"
      ) {
        photoEditorState.offsetX -=
          step;
      } else if (
        event.key ===
        "ArrowRight"
      ) {
        photoEditorState.offsetX +=
          step;
      } else if (
        event.key ===
        "ArrowUp"
      ) {
        photoEditorState.offsetY -=
          step;
      } else if (
        event.key ===
        "ArrowDown"
      ) {
        photoEditorState.offsetY +=
          step;
      } else if (
        event.key ===
        "+" ||
        event.key ===
        "="
      ) {
        photoEditorState.zoom =
          Math.min(
            3,
            photoEditorState.zoom +
              0.1
          );
      } else if (
        event.key ===
        "-"
      ) {
        photoEditorState.zoom =
          Math.max(
            1,
            photoEditorState.zoom -
              0.1
          );
      } else if (
        event.key.toLowerCase() ===
        "r"
      ) {
        photoEditorState.rotation =
          (
            photoEditorState.rotation +
            90
          ) %
          360;
      } else {
        return;
      }

      event.preventDefault();

      const zoom =
        document.querySelector(
          ".image-crop-zoom input"
        );

      if (zoom) {
        zoom.value =
          String(
            photoEditorState.zoom
          );
      }

      drawEditor();

      announce(
        "Photo position updated."
      );
    }
  );

  document.addEventListener(
    "shop-hopper-modal-closed",
    closeEditorSource
  );
})();