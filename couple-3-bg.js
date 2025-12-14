console.log("AB Web Dev");

(() => {
  const WRAPPER_SEL = ".page-bg-wrapper";

  const DOT_DIAM = 3;
  const SPACING = 60;

  const BASE = "#262626";
  const HOVER = "#363636";

  const DOT_RADIUS = DOT_DIAM / 2;
  const EFFECT_RADIUS = SPACING * 3; // ~3 dots in all directions
  const EFFECT_RADIUS_SQ = EFFECT_RADIUS * EFFECT_RADIUS;

  const wrapper = document.querySelector(WRAPPER_SEL);
  if (!wrapper) {
    console.warn(`[p5-dot-grid] Could not find ${WRAPPER_SEL}`);
    return;
  }
  if (!window.p5) {
    console.warn("[p5-dot-grid] p5.js not found. Load p5 before this script.");
    return;
  }

  // Ensure wrapper has a stacking context
  const wrapperStyle = getComputedStyle(wrapper);
  if (wrapperStyle.position === "static") wrapper.style.position = "relative";

  // Put canvas behind content

  const sketch = (p) => {
    let cols = 0;
    let rows = 0;
    let points = []; // store dot centers
    let mx = null;
    let my = null;

    function rebuildGrid() {
      const w = p.windowWidth;
      const h = p.windowHeight;

      // Full-viewport canvas
      p.resizeCanvas(w, h);

      // Compute grid with slight overscan to avoid edges on resize
      cols = Math.ceil(w / SPACING) + 2;
      rows = Math.ceil(h / SPACING) + 2;

      points = new Array(cols * rows);

      const startX = -SPACING;
      const startY = -SPACING;

      let i = 0;
      for (let r = 0; r < rows; r++) {
        const y = startY + r * SPACING;
        for (let c = 0; c < cols; c++) {
          const x = startX + c * SPACING;
          points[i++] = { x, y };
        }
      }
    }

    p.setup = () => {
      // Create the canvas and attach it to wrapper
      const cnv = p.createCanvas(p.windowWidth, p.windowHeight);
      cnv.parent(wrapper);

      // Style it like a fixed background layer
      Object.assign(cnv.elt.style, {
        position: "fixed",
        inset: "0",
        width: "100vw",
        height: "100vh",
        //zIndex: "0",
        pointerEvents: "none",
        display: "block",
      });

      // High-DPI crispness
      p.pixelDensity(Math.max(1, Math.min(2, window.devicePixelRatio || 1)));

      // Render settings
      p.noStroke();
      p.ellipseMode(p.CENTER);

      rebuildGrid();
    };

    p.windowResized = () => {
      rebuildGrid();
    };

    // Track pointer globally (works even with pointerEvents:none)
    window.addEventListener(
      "pointermove",
      (e) => {
        mx = e.clientX;
        my = e.clientY;
      },
      { passive: true }
    );

    window.addEventListener(
      "pointerleave",
      () => {
        mx = null;
        my = null;
      },
      { passive: true }
    );

    p.draw = () => {
      // Transparent by default. If you want a fill behind the dots:
      // p.background("#0b0b0f");
      p.clear();

      const hasMouse = mx !== null && my !== null;

      // If no mouse, draw everything base color fast
      if (!hasMouse) {
        p.fill(BASE);
        for (let i = 0; i < points.length; i++) {
          const pt = points[i];
          p.circle(pt.x, pt.y, DOT_DIAM);
        }
        return;
      }

      // Draw all dots with conditional color
      // (Grid is sparse: 60px spacing, so this is typically fine)
      for (let i = 0; i < points.length; i++) {
        const pt = points[i];
        const dx = pt.x - mx;
        const dy = pt.y - my;
        const d2 = dx * dx + dy * dy;

        p.fill(d2 <= EFFECT_RADIUS_SQ ? HOVER : BASE);
        p.circle(pt.x, pt.y, DOT_DIAM);
      }
    };
  };

  // Use instance mode to avoid polluting global scope / Webflow conflicts
  new window.p5(sketch);
})();
