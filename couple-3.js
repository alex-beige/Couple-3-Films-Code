console.log("Party Time 2");

// Prevent browser from restoring scroll position on page reload
// This ensures animations always start from the top
if (history.scrollRestoration) {
  history.scrollRestoration = "manual";
}

document.addEventListener("DOMContentLoaded", function () {
  // ====================================
  // GSAP SETUP
  // ====================================
  gsap.registerPlugin(ScrollTrigger, SplitText);
  gsap.defaults({
    duration: 0.72,
    ease: "power2",
  });

  // ====================================
  // CONFIGURATION
  // ====================================
  const CONFIG = {
    // Brand positioning
    brandInitialXPercent: -69.3,

    // Animation timings
    intro: {
      brandMoveDuration: 1.5,
      logoOffsetX: 24,
      logoDuration: 1.64,
      textDuration: 1,
      textYPercent: 25,
      textStagger: 0.04,
      elementY: 24,
      elementStagger: 0.1,
      videoYPercent: 20,
      videoDuration: 1,
    },

    // Rotating rings
    rotating: {
      outerRingDuration: 300, // seconds for full rotation
      innerRingDuration: 650, // seconds for full rotation
      rampUpTime: 3, // seconds to reach full speed
    },

    // Scroll animation
    scroll: {
      pinDuration: "200%",
      scrubSmooth: 1.5,
      videoScaleRatio: 0.85, // 85% of viewport
    },
  };

  // ====================================
  // DOM ELEMENT REFERENCES
  // ====================================
  const elements = {
    introContainer: document.querySelector(".standard-section:has(h1)"),
  };

  // Child elements (depends on container being found first)
  elements.brandWrap = elements.introContainer.querySelector(".hero_brand-anim-wrap");
  elements.videoWrapper = elements.introContainer.querySelector(".grid-cell.is-vimeo-wrapper");
  elements.frame = elements.introContainer.querySelector(".hero-framing-wrap");
  elements.heroText = elements.introContainer.querySelector("h1");
  elements.introElements = elements.introContainer.querySelectorAll("[gsap-intro-el]");

  // Split text into words for stagger animation
  const split_h1 = new SplitText(elements.heroText, { type: "words" });

  // ====================================
  // INITIAL POSITIONING
  // ====================================
  gsap.set(elements.brandWrap, { xPercent: CONFIG.brandInitialXPercent });

  // Calculate center position for brand animation
  const elRect = elements.brandWrap.getBoundingClientRect();
  const viewportCenterX = window.innerWidth / 2;
  const elCenterX = elRect.left + elRect.width / 2;

  // ====================================
  // HELPER FUNCTIONS
  // ====================================

  /**
   * Removes body overflow restriction after intro completes
   * Allows page to become scrollable
   */
  function enableScrolling() {
    console.log("scroll ready!");
    // Note: Using jQuery here - ensure jQuery is loaded in Webflow
    // Alternative vanilla JS: document.body.classList.remove("body-overflow-hidden");
    $("body").removeClass("body-overflow-hidden");
  }

  /**
   * Calculates the x/y translation needed to center an element in the viewport
   * Accounts for element's current GSAP transform values
   * @param {HTMLElement} el - Element to center
   * @returns {Object} {x, y} translation values
   */
  function centerTargetXY(el) {
    const rect = el.getBoundingClientRect();

    // Calculate distance from element center to viewport center
    const dx = window.innerWidth / 2 - (rect.left + rect.width / 2);
    const dy = window.innerHeight / 2 - (rect.top + rect.height / 2);

    // Add to existing GSAP transform to maintain continuity
    const currentX = gsap.getProperty(el, "x");
    const currentY = gsap.getProperty(el, "y");

    return {
      x: currentX + dx,
      y: currentY + dy,
    };
  }

  /**
   * Calculates the scale needed to fit an element to the viewport
   * Maintains aspect ratio (no stretching)
   * @param {HTMLElement} el - Element to scale
   * @param {number} wRatio - Percentage of viewport width to use (default 0.85)
   * @param {number} hRatio - Percentage of viewport height to use (default 0.85)
   * @returns {number} Scale factor
   */
  function scaleToViewport(el, wRatio = 0.85, hRatio = 0.85) {
    const rect = el.getBoundingClientRect();
    const scaleX = (window.innerWidth * wRatio) / rect.width;
    const scaleY = (window.innerHeight * hRatio) / rect.height;
    return Math.min(scaleX, scaleY); // Use smaller scale to maintain aspect ratio
  }

  /**
   * Creates a rotating animation timeline with gradual speed ramp-up
   * @param {string} selector - CSS selector for element to rotate
   * @param {number} duration - Seconds for one full rotation
   * @returns {gsap.timeline} The animation timeline
   */
  function createRotatingTimeline(selector, duration) {
    return gsap.timeline({}).to(selector, {
      rotation: 360,
      duration: duration,
      repeat: -1,
      ease: "none",
      modifiers: {
        rotation: gsap.utils.unitize((value) => {
          // Gradually ramp up from 0 to full speed over rampUpTime seconds
          const currentTime = gsap.globalTimeline.time();
          const rampProgress = Math.min(currentTime / CONFIG.rotating.rampUpTime, 1);
          return value * rampProgress;
        }),
      },
    });
  }

  // ====================================
  // INTRO TIMELINE
  // ====================================
  const tl_intro = gsap.timeline({
    onComplete: enableScrolling,
  });

  tl_intro
    // Fade in brand wrapper
    .from(elements.brandWrap, {
      autoAlpha: 0,
    })
    // Move brand to center
    .from(
      elements.brandWrap,
      {
        x: viewportCenterX - elCenterX,
        ease: "power4.inOut",
        duration: CONFIG.intro.brandMoveDuration,
      },
      ">-0.25"
    )
    // Slide in logo
    .from(
      ".brand-anim_logo-img",
      {
        x: CONFIG.intro.logoOffsetX,
        ease: "power4.inOut",
        duration: CONFIG.intro.logoDuration,
      },
      "<0.1"
    )
    // Fade in hero text with stagger effect on words
    .from(
      $(elements.heroText).add(split_h1.words),
      {
        duration: CONFIG.intro.textDuration,
        autoAlpha: 0,
        yPercent: CONFIG.intro.textYPercent,
        stagger: CONFIG.intro.textStagger,
        ease: "power3",
      },
      ">"
    )
    // Fade in intro elements with stagger
    .from(
      elements.introElements,
      {
        y: CONFIG.intro.elementY,
        autoAlpha: 0,
        stagger: CONFIG.intro.elementStagger,
        ease: "power2",
      },
      "<0.4"
    )
    // Slide in video wrapper
    .from(
      elements.videoWrapper,
      {
        yPercent: CONFIG.intro.videoYPercent,
        autoAlpha: 0,
        duration: CONFIG.intro.videoDuration,
        ease: "power3",
      },
      "<0.2"
    )
    // Fade in navigation
    .from(
      ".navwrapper",
      {
        autoAlpha: 0,
        ease: "power3",
      },
      "<0.6"
    );

  // ====================================
  // ROTATING RINGS TIMELINES
  // ====================================
  // These create continuous rotating animations that gradually speed up on page load
  const tl_rotatingOuter = createRotatingTimeline(
    ".brand-anim_outer-ring",
    CONFIG.rotating.outerRingDuration
  );

  const tl_rotatingInner = createRotatingTimeline(
    ".brand-anim_inner-ring",
    CONFIG.rotating.innerRingDuration
  );

  // ====================================
  // SCROLL-TRIGGERED HERO ANIMATION
  // ====================================
  const tl_heroScroll = gsap.timeline({
    scrollTrigger: {
      pin: true,
      trigger: elements.introContainer,
      start: "top top",
      end: `+=${CONFIG.scroll.pinDuration}`,
      scrub: CONFIG.scroll.scrubSmooth,
      invalidateOnRefresh: true, // Recalculate on window resize
    },
  });

  tl_heroScroll
    // Move brand to left
    .to(elements.brandWrap, {
      xPercent: -10,
    })
    // Fade out hero content and nav elements
    .to(
      [".hero_content-wrap", ".hero_icon", ".nav_linkwrapper"],
      { autoAlpha: 0 },
      "<" // Start at same time as previous
    )
    // Center video wrapper in viewport
    .to(
      elements.videoWrapper,
      {
        x: () => centerTargetXY(elements.videoWrapper).x,
        y: () => centerTargetXY(elements.videoWrapper).y,
        ease: "none",
      },
      "<0.1"
    )
    // Scale video to fill viewport (maintaining aspect ratio)
    .to(
      elements.videoWrapper,
      {
        scale: () => scaleToViewport(
          elements.videoWrapper,
          CONFIG.scroll.videoScaleRatio,
          CONFIG.scroll.videoScaleRatio
        ),
        transformOrigin: "50% 50%",
        ease: "none",
      },
      ">0.3"
    );
});
