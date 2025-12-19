console.log("AB Web Dev");

// ====================================
// P5.JS INTERACTIVE DOT GRID BACKGROUND
// ====================================
// Creates a fixed canvas with a grid of dots that respond to mouse movement
// Dots within a certain radius of the cursor change color
(() => {
  // ====================================
  // CONFIGURATION
  // ====================================
  const WRAPPER_SEL = ".page-bg-wrapper";

  const DOT_DIAM = 3;
  const SPACING = 60;

  const BASE = "hsla(0, 0%, 27%, 1.00)"; // Default dot color
  const HOVER = "hsla(0, 0%, 54%, 1.00)"; // Dot color near cursor

  const DOT_RADIUS = DOT_DIAM / 2;
  const EFFECT_RADIUS = SPACING * 3; // ~3 dots in all directions
  const EFFECT_RADIUS_SQ = EFFECT_RADIUS * EFFECT_RADIUS; // Pre-calculate for performance

  // ====================================
  // INITIALIZATION & ERROR CHECKING
  // ====================================
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
  if (wrapperStyle.position === "static") {
    wrapper.style.position = "relative";
  }

  // ====================================
  // P5.JS SKETCH
  // ====================================
  const sketch = (p) => {
    // State variables
    let cols = 0;
    let rows = 0;
    let points = []; // Array of {x, y} dot positions
    let mx = null; // Mouse X position
    let my = null; // Mouse Y position

    // Animatable color state (can be controlled by GSAP)
    // IMPORTANT: Initialize with hex colors for GSAP interpolation
    // GSAP struggles with HSLA strings, so we convert to hex
    let currentColors = {
      base: "#3b3b3b", // Equivalent to hsla(0, 0%, 20%, 1.00)
      hover: "#545454", // Equivalent to hsla(0, 0%, 28%, 1.00)
      background:"#00000000", // null = transparent, set to color string to show background
    };


    
    /**
     * Rebuilds the dot grid based on current window size
     * Called on setup and window resize
     */
    function rebuildGrid() {
      const w = p.windowWidth;
      const h = p.windowHeight;

      // Resize canvas to fill viewport
      p.resizeCanvas(w, h);

      // Calculate grid dimensions with overscan
      // +2 ensures dots don't disappear at edges during resize
      cols = Math.ceil(w / SPACING) + 2;
      rows = Math.ceil(h / SPACING) + 2;

      // Pre-allocate array for performance
      points = new Array(cols * rows);

      // Start grid slightly off-screen to prevent edge gaps
      const startX = -SPACING / 2;
      const startY = -SPACING / 2;

      // Populate grid with dot positions
      let i = 0;
      for (let r = 0; r < rows; r++) {
        const y = startY + r * SPACING;
        for (let c = 0; c < cols; c++) {
          const x = startX + c * SPACING;
          points[i++] = { x, y };
        }
      }
      // Play fade-in tween on rebuild
      fadeInCanvas.play();

    }
//gsap fade in grid tween
    let fadeInCanvas;
    /**
     * p5.js setup - runs once when sketch starts
     */
    p.setup = () => {
      // Create canvas and attach to wrapper element
      const cnv = p.createCanvas(p.windowWidth, p.windowHeight);
      cnv.parent(wrapper);

      // Position canvas as fixed background layer
      Object.assign(cnv.elt.style, {
        position: "fixed",
        inset: "0",
        width: "100vw",
        height: "100vh",
        pointerEvents: "none", // Allow clicks to pass through to content
        display: "block",
        opacity: "0",
        transform:"scale(0.97)"
      });

      // Enable high-DPI support for crisp dots on retina displays
      // Cap at 2x for performance
      p.pixelDensity(Math.max(1, Math.min(2, window.devicePixelRatio || 1)));

      // Configure drawing style
      p.noStroke();
      p.ellipseMode(p.CENTER);

      // Create fade-in tween (paused by default)
      fadeInCanvas = gsap.to(wrapper.querySelector("canvas"), {duration: 0.8, opacity: 1, scale:1, ease: "power2.out",paused:true});

      rebuildGrid();
    };

    /**
     * p5.js windowResized - called when browser window is resized
     */
    p.windowResized = () => {
      rebuildGrid();
    };

    // ====================================
    // MOUSE TRACKING
    // ====================================
    // Track pointer globally (works even though canvas has pointerEvents: none)
    window.addEventListener(
      "pointermove",
      (e) => {
        mx = e.clientX;
        my = e.clientY;
      },
      { passive: true } // Performance optimization
    );

    // Reset mouse position when cursor leaves window
    window.addEventListener(
      "pointerleave",
      () => {
        mx = null;
        my = null;
      },
      { passive: true }
    );

    // ====================================
    // RENDER LOOP
    // ====================================
    /**
     * p5.js draw - called continuously (~60fps)
     * Renders dots with color based on distance from cursor
     */
    p.draw = () => {
      // Handle background color
      if (currentColors.background) {
        p.background(currentColors.background);
      } else {
        p.clear(); // Transparent background
      }

      const hasMouse = mx !== null && my !== null;

      // Fast path: no mouse interaction, draw all dots in base color
      if (!hasMouse) {
        p.fill(currentColors.base);
        for (let i = 0; i < points.length; i++) {
          const pt = points[i];
          p.circle(pt.x, pt.y, DOT_DIAM);
        }
        return;
      }

      // Interactive path: calculate distance to mouse for each dot
      // Use squared distance to avoid expensive Math.sqrt()
      for (let i = 0; i < points.length; i++) {
        const pt = points[i];
        const dx = pt.x - mx;
        const dy = pt.y - my;
        const distanceSquared = dx * dx + dy * dy;

        // Change color if within effect radius
        p.fill(distanceSquared <= EFFECT_RADIUS_SQ ? currentColors.hover : currentColors.base);
        p.circle(pt.x, pt.y, DOT_DIAM);
      }
    };

    // ====================================
    // PUBLIC API - Expose to global scope for GSAP
    // ====================================
    // Store reference to color object so GSAP can animate it
    window.p5DotGrid = {
      colors: currentColors,

      /**
       * Set base dot color
       * @param {string} color - Any valid CSS color string
       */
      setBaseColor(color) {
        currentColors.base = color;
      },

      /**
       * Set hover dot color
       * @param {string} color - Any valid CSS color string
       */
      setHoverColor(color) {
        currentColors.hover = color;
      },

      /**
       * Set background color
       * @param {string} color - Any valid CSS color string, or null for transparent
       */
      setBackgroundColor(color) {
        currentColors.background = color;
      },

      /**
       * Reset all colors to defaults
       */
      resetColors() {
        currentColors.base = "#3b3b3b";
        currentColors.hover = "#545454";
        currentColors.background = null;
      },
    };
  };

  // ====================================
  // INITIALIZE P5 SKETCH
  // ====================================
  // Use instance mode to prevent global namespace pollution
  // This avoids conflicts with Webflow and other scripts
  new window.p5(sketch);
})();
