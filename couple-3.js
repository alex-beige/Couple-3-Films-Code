console.log("Party Time 2.2");

// ====================================
// ANIMATING P5.JS BACKGROUND DOTS - QUICK REFERENCE
// ====================================
// The p5.js dot grid (couple-3-bg.js) exposes a global API: window.p5DotGrid
//
// Available properties & methods:
//   window.p5DotGrid.colors.base       - Base dot color (string)
//   window.p5DotGrid.colors.hover      - Hover dot color (string)
//   window.p5DotGrid.colors.background - Canvas background color (string or null)
//   window.p5DotGrid.setBaseColor(color)
//   window.p5DotGrid.setHoverColor(color)
//   window.p5DotGrid.setBackgroundColor(color)
//   window.p5DotGrid.resetColors()
//
// GSAP Usage:
//   gsap.to(window.p5DotGrid.colors, { base: "#ffffff", duration: 2 })
//   gsap.to(window.p5DotGrid.colors, { background: "#000000", duration: 1 })
//
// IMPORTANT: Use hex (#ffffff) or rgb(a) colors for smooth GSAP interpolation.
//            HSLA strings may cause snapping instead of smooth transitions.
//
// See examples at the bottom of this file (search for "BACKGROUND DOT ANIMATIONS")
// ====================================

// Prevent browser from restoring scroll position on page reload
// This ensures animations always start from the top
if (history.scrollRestoration) {
  history.scrollRestoration = "manual";
}

document.addEventListener("DOMContentLoaded", function () {
  // ====================================
  // GSAP SETUP
  // ====================================
  gsap.registerPlugin(ScrollTrigger, SplitText, Flip, DrawSVGPlugin);
  gsap.defaults({
    duration: 0.72,
    ease: "power2",
  });
    const TIMING = {
      // Letter fade in duration
      letterDuration: 0.4,
      
      // Stagger between letters in a group
      letterStagger: 0,
      
      // Arrow line draw duration
      arrowLineDuration: 0.5,
      
      // Arrow head pop-in duration
      arrowHeadDuration: 0.25,
      
      // Pause between animation groups
      pauseBetweenGroups: 0,
      
      // Easing functions
      letterEase: "power2.out",
      arrowLineEase: "power3.out",
      arrowHeadEase: "power1.out"
    };
gsap.set(".letter:not(#letter-3)",{yPercent:-5})
gsap.set(".letter#letter-3",{yPercent:5})

let masterTimeline;

    function createAnimation() {
      // Create a new timeline
      masterTimeline = gsap.timeline({ paused: true,onComplete: () => {tl_intro.play();} });

      // Group 1: Letters C and O fade in
      masterTimeline.to(
        ["#letter-c", "#letter-o"], 
        {
          opacity: 1,
          duration: TIMING.letterDuration,
          ease: TIMING.letterEase,
          stagger: TIMING.letterStagger,
          yPercent:0
        },
        0 // Start at beginning
      );

      // Arrow 1: Draw the line, then show the head
      masterTimeline.fromTo(
        "#arrow-1",
        { drawSVG: "0%" },
        {
          drawSVG: "100%",
          opacity: 1,
          duration: TIMING.arrowLineDuration,
          ease: TIMING.arrowLineEase
        },
        "<0.2" // Pause after letters
      );

      masterTimeline.to(
        "#arrow-1-head",
        {
          opacity: 1,
          scale: 1,
          transformOrigin: "center",
          duration: TIMING.arrowHeadDuration,
          ease: TIMING.arrowHeadEase
        },
        "-=0.2" // Slight overlap with line completion
      );

      // Group 2: Letters U and P fade in
      masterTimeline.to(
        ["#letter-u", "#letter-p"],
        {
          opacity: 1,
          duration: TIMING.letterDuration,
          ease: TIMING.letterEase,
          stagger: TIMING.letterStagger,
          yPercent:0
        },
        "<0.15" 
      );

      // Arrow 2: Draw the line, then show the head
      masterTimeline.fromTo(
        "#arrow-2",
        { drawSVG: "0%" },
        {
          drawSVG: "100%",
          opacity: 1,
          duration: TIMING.arrowLineDuration,
          ease: TIMING.arrowLineEase
        },
        "<0.2" 
      );

      masterTimeline.to(
        "#arrow-2-head",
        {
          opacity: 1,
          scale: 1,
          transformOrigin: "center",
          duration: TIMING.arrowHeadDuration,
          ease: TIMING.arrowHeadEase
        },
        "-=0.2"
      );

      // Group 3: Letters L and E fade in
      masterTimeline.to(
        ["#letter-l", "#letter-e"],
        {
          opacity: 1,
          duration: TIMING.letterDuration,
          ease: TIMING.letterEase,
          stagger: TIMING.letterStagger,
          yPercent:0
        },
        "<0.15" 
      );

      // Arrow 3: Draw the line, then show the head
      masterTimeline.fromTo(
        "#arrow-3",
        { drawSVG: "0%" },
        {
          drawSVG: "100%",
          opacity: 1,
          duration: TIMING.arrowLineDuration,
          ease: TIMING.arrowLineEase
        },
       "<0.2" 
      );

      masterTimeline.to(
        "#arrow-3-head",
        {
          opacity: 1,
          scale: 1,
          transformOrigin: "center",
          duration: TIMING.arrowHeadDuration,
          ease: TIMING.arrowHeadEase
        },
        "-=0.2"
      );

      // Final letter: 3 fades in
      masterTimeline.to(
        "#letter-3",
        {
          opacity: 1,
          duration: TIMING.letterDuration,
          ease: TIMING.letterEase,
          yPercent:0
        },
        "<0.15" 
      );

      return masterTimeline;
    }

    // ============================================
    // BUTTON CONTROLS
    // ============================================
    
    // Initialize the animation
    createAnimation();
    masterTimeline.play();

  // ====================================
  // CONFIGURATION
  // ====================================
  const CONFIG = {
    // Animation timings
    intro: {
      brandMoveDuration: 1.5,
      logoOffsetX: 24,
      logoDuration: 1.64,
      textDuration: 1,
      textYPercent: 25,
      textStagger: 0.05,
      elementY: 24,
      elementStagger: 0.12,
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
      pinDuration: "175%",
      scrubSmooth: 1.5,
      videoScaleRatio: 0.85, // 85% of viewport
    },

    // Background dot colors (for p5.js canvas)
    // These can be animated during the intro or scroll sequences
    // NOTE: Use hex or rgb(a) colors for smooth GSAP interpolation
    dotColors: {
      baseDefault: "#333333", // Dark gray dots
      hoverDefault: "#404040", // Slightly lighter gray
      // Example color transitions you might want:
      // baseLight: "#e6e6e6",  // Light dots
      // hoverLight: "#f2f2f2", // Lighter hover
      // backgroundSolid: "#0b0b0f", // Dark solid background
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

  // Navigation elements for Flip animation
  elements.navBrandLinkOriginal = document.querySelector(".brand-anim_logo-img-inner");
  elements.navBrandSlot = document.querySelector(".nav_brand-link");

  // Create a clone for the Flip animation
  elements.navBrandLinkClone = elements.navBrandLinkOriginal.cloneNode(true);
  // Hide the clone initially
  gsap.set(elements.navBrandLinkClone, { autoAlpha: 0, position: "absolute" });
  // Insert clone right after original in DOM
  elements.navBrandLinkOriginal.parentNode.insertBefore(
    elements.navBrandLinkClone,
    elements.navBrandLinkOriginal.nextSibling
  );

  // Ensure correct initial visibility state
  gsap.set(elements.navBrandLinkOriginal, { autoAlpha: 1 });
  gsap.set(elements.navBrandLinkClone, { autoAlpha: 0 });

  // Split text into words for stagger animation
  const split_h1 = new SplitText(elements.heroText, { type: "words" });

  // ====================================
  // INITIAL POSITIONING
  // ====================================
  // Position brand wrapper to the left side initially
  // We'll calculate the exact position so we know where "center" is
  const brandRect = elements.brandWrap.getBoundingClientRect();
  const brandNaturalCenter = brandRect.left + brandRect.width / 2;
  const viewportCenterX = window.innerWidth / 2;

  // Calculate how far from center the brand starts (this becomes our "left" position)
  const brandStartX = 0; // Left position (natural position with no transforms)
  const brandCenterX = viewportCenterX - brandNaturalCenter; // Centered position

  // Set initial position to the left (no transform)
  //gsap.set(elements.brandWrap, { x: brandStartX });

  // ====================================
  // HELPER FUNCTIONS
  // ====================================

  /**
   * Removes body overflow restriction after intro completes
   * Allows page to become scrollable
   */
  function enableScrolling() {
    console.log("scroll ready!");
    //ScrollTrigger.refresh()
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
    paused:true

  });

  tl_intro
    // Fade in brand wrapper
    .from(".brand-anim_outer-ring,.brand-anim_inner-ring", {
      autoAlpha: 0,
    })
    // Move brand from center to left
    .from(
      elements.brandWrap,
      {
        x: brandCenterX, // Start from center
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
      "<0.32"
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
  // BACKGROUND DOT ANIMATIONS (Optional)
  // ====================================
  // Uncomment and customize these examples to animate the p5.js background dots
  // The p5DotGrid API is exposed globally from couple-3-bg.js

  /*
  // Example 1: Animate dot colors during intro
  tl_intro.to(
    window.p5DotGrid.colors,
    {
      base: "hsla(0, 0%, 90%, 1.00)",  // Lighter dots
      hover: "hsla(0, 0%, 95%, 1.00)", // Lighter hover
      duration: 2,
      ease: "power2.inOut",
    },
    "<" // Start with previous animation
  );
  */

  /*
  // Example 2: Add solid background color
  tl_intro.to(
    window.p5DotGrid.colors,
    {
      background: "#0b0b0f", // Dark solid background
      duration: 1.5,
      ease: "power2.out",
    },
    ">-1" // Overlap with previous
  );
  */

  /*
  // Example 3: Animate colors during scroll
  tl_heroScroll.to(
    window.p5DotGrid.colors,
    {
      base: "#ffffff",
      hover: "#cccccc",
      background: "#000000",
      duration: 1,
      ease: "none",
    },
    "<" // Start at beginning of scroll timeline
  );
  */

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
  // FLIP ANIMATION SETUP
  // ====================================
  // Create a paused timeline that we can scrub through
  const flipTimeline = gsap.timeline({ paused: true });

  function setupFlipAnimation() {
    // Capture state of clone at current position (matches original)
    const flipState = Flip.getState(elements.navBrandLinkClone);

    // Move clone to nav slot (before Flip animation runs)
    elements.navBrandSlot.appendChild(elements.navBrandLinkClone);

    // Add the Flip animation to the existing timeline with swap callbacks
    flipTimeline.add(
      Flip.from(flipState, {
        duration: 0.5,
        ease: "none", // Use "none" so we can control easing via the scrub
        absolute: true,
        scale: true,
        onStart: () => {
          // Swap to clone when Flip starts (scrolling forward)
          gsap.set(elements.navBrandLinkOriginal, { autoAlpha: 0 });
          gsap.set(elements.navBrandLinkClone, { autoAlpha: 1 });
        },
        onComplete: () => {
          // Keep clone visible when animation completes (at nav position)
          gsap.set(elements.navBrandLinkOriginal, { autoAlpha: 0 });
          gsap.set(elements.navBrandLinkClone, { autoAlpha: 1 });
        },
        onReverseComplete: () => {
          // Swap back to original when Flip reverses completely (scrolling back)
          gsap.set(elements.navBrandLinkClone, { autoAlpha: 0 });
          gsap.set(elements.navBrandLinkOriginal, { autoAlpha: 1 });
        },
      })
    );
  }

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
    // Fade out hero content and nav elements
    .fromTo(
      [".hero_content-wrap", ".hero_icon", ".nav_linkwrapper"],
      {opacity: 1},
      { yPercent:-8,opacity: 0,duration: 0.16, immediateRender: false,ease: "power2.out" },
      "<"
    )
    // Return brand to center position
    // Animate from left (x: 0) back to center (x: brandCenterX)
    .to(".hero_brand-anim-wrap-parent", {
      //invalidateOnRefresh: true,
      x: brandCenterX,
      immediateRender: false,
      ease: "power2.inOut",
      //overwrite: 'auto'
    },"<0.1")
    // Ensure original is visible before Flip setup
    .add(() => {
      gsap.set(elements.navBrandLinkOriginal, { autoAlpha: 1 });
      gsap.set(elements.navBrandLinkClone, { autoAlpha: 0 });
    }, ">")
    // Set up Flip animation (one-time setup)
    .call(setupFlipAnimation, null, "<")
    // Scrub through the Flip timeline progress (this makes it reversible!)
    .to(
      flipTimeline,
      {
        progress: 1,
        duration: 0.5,
        ease: "power2.inOut",
      },
      "<" // Start immediately after setup
    )
    // Center video wrapper in viewport
    .to(
      elements.videoWrapper,
      {
        x: () => centerTargetXY(elements.videoWrapper).x,
        y: () => centerTargetXY(elements.videoWrapper).y,
       ease: "power2.inOut",
      },
      "<-0.12"
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
        ease: "power2.inOut",
      },
      "<0.05")
    .fromTo(".hero-framing-wrap", {autoAlpha:0,scale:0.9},{autoAlpha:1, duration:0.3, scale:1 },">-0.35")
    //.addLabel('colorChange',"<")
    .to({},{ duration: 0.15 }) // tiny pause to create a gap in the scrub



 const ACTIVE_CLASS = 'is-active';
  
  // Get measurements
  const verticalNavIndicator = document.querySelector('.vertical-active-indicator');
  const workCategoryNav = document.querySelector('.work_category-nav');
  const workCategoryNavHeight = workCategoryNav.offsetHeight * 0.667;
  
  // Create ScrollTrigger for each section
  $('.work-category-wrapper').each(function(index) {
    const section = this;
    const sectionId = section.id;
    const $matchingNav = $(`.work_category-item[data-category="${sectionId}"]`);
    
    // Calculate footerIndicator position (0 for first, workCategoryNavHeight/2 for middle, full for last)
    let indicatorY;
    if (index === 0) {
      indicatorY = 0;
    } else if (index === 1) {
      indicatorY = workCategoryNavHeight / 2;
    } else {
      indicatorY = workCategoryNavHeight;
    }
    
    ScrollTrigger.create({
      trigger: section,
      start: "top 50%",
      end: "bottom 50%",
      onEnter: () => {
        $('.work_category-item').removeClass(ACTIVE_CLASS);
        $matchingNav.addClass(ACTIVE_CLASS);
        gsap.to(verticalNavIndicator, {
          y: indicatorY,
          duration: 0.6,
          ease: "power2.inOut"
        });
      },
      onEnterBack: () => {
        $('.work_category-item').removeClass(ACTIVE_CLASS);
        $matchingNav.addClass(ACTIVE_CLASS);
        gsap.to(verticalNavIndicator, {
          y: indicatorY,
          duration: 0.6,
          ease: "power2.inOut"
        });
      }
    });
  });
  
  // Custom easing for smooth scroll
  $.easing.easeInOutQuart = function(x) {
    return x < 0.5 ? 8 * x * x * x * x : 1 - Math.pow(-2 * x + 2, 4) / 2;
  };
  
  // Smooth scroll on nav click
  $('.work_category-item').on('click', function(e) {
    e.preventDefault();
    const targetId = $(this).attr('data-category');
    const targetSection = $(`#${targetId}`);
    
    if (targetSection.length) {
      $('html, body').animate({
        scrollTop: targetSection.offset().top - 132
      }, 1000, 'easeInOutQuart');
    }
  });
      


  // ====================================
  // INDEPENDENT COLOR CHANGE ANIMATION
  // ====================================
  // Separate ScrollTrigger not tied to scrub for discrete color transitions
  let calloutColorTrigger =
  ScrollTrigger.create({
    trigger: '#callout-section',
    start: "top 180%",
    //markers: true,
    end: 'bottom 60%',
    // This creates a trigger point approximately 70% through the scroll animation
    onEnter: () => {
      gsap.to(window.p5DotGrid.colors, {
        base: "#F2EFED",
        hover: "#fbfaf9",
        //background: "#EF5E3D",
        duration: 0.8,
        ease: "power2.inOut",
      });
      gsap.to('.bg-overlay', {
        backgroundColor: "#ef5e3d",
        duration: 0.8,
        ease: "power2.inOut",
      });
    },
    onLeaveBack: () => {
      gsap.to(window.p5DotGrid.colors, {
        base: CONFIG.dotColors.baseDefault,
        hover: CONFIG.dotColors.hoverDefault,
        //background: "#0a0a0a",
        duration: 0.72,
        ease: "power2.inOut",
      });
      gsap.to('.bg-overlay', {
        backgroundColor: "transparent",
        duration: 0.6,
        ease: "power2.inOut",
      });
    },
    onLeave: () => {
      gsap.to(window.p5DotGrid.colors, {
        base: CONFIG.dotColors.baseDefault,
        hover: CONFIG.dotColors.hoverDefault,
        //background: "#0a0a0a",
        duration: 0.72,
        ease: "power2.inOut",
      });
      gsap.to('.bg-overlay', {
        backgroundColor: "transparent",
        duration: 0.6,
        ease: "power2.inOut",
      });
    },
    onEnterBack: () => {
      gsap.to(window.p5DotGrid.colors, {
        base: "#F2EFED",
        hover: "#fbfaf9",
        //background: "#EF5E3D",
        duration: 0.8,
        ease: "power2.inOut",
      });
      gsap.to('.bg-overlay', {
        backgroundColor: "#ef5e3d",
        duration: 0.8,
        ease: "power2.inOut",
      });
    },
    // Adjust start position to align with label (around 70% through the pin)
    //start: "top+=140% top",
  });
  //tl_heroScroll.add(calloutColorTrigger, "colorChange=-0.3");

let tl_calloutSection = gsap.timeline({
  scrollTrigger: {
    trigger: '#callout-section',
    start: "top 55%",
    toggleActions: "play none none none",
  }
}), calloutSection = document.querySelector('#callout-section'),
calloutTitle = calloutSection.querySelector('.subheading'),
calloutSplit = new SplitText(calloutTitle, {type: "lines,words,chars"}),
calloutButton = calloutSection.querySelector('.button');

tl_calloutSection.from($(calloutTitle).add(calloutSplit.lines),{y:24, autoAlpha:0, stagger:0.08, ease:"power3.out"})
.from(calloutButton,{y:28, autoAlpha:0, ease:"power2.out"}, ">-0.4");

  let tl_ctaAnimation = gsap.timeline({
    scrollTrigger: {
      trigger: '#cta-section',
      start: "top 15%", 
      pin: true,
      end: "+=150%",
      scrub: 1.5,
      //invalidateOnRefresh: true,
      //markers: true,
      // toggleActions: "play none none none",
      onEnter: () => {
        tl_rotateCtaCircles.play();
        console.log("cta enter");
        gsap.to('.bg-overlay',{backgroundColor:"#0a0a0aFF", duration:0.8, ease:"power2.inOut"});
      },

      onLeaveBack: () => {
gsap.to('.bg-overlay',{backgroundColor:"#0a0a0a00", duration:0.8, ease:"power2.inOut"});
      },
     
  
    }
  }), ctaSection = document.querySelector('#cta-section'),
  ctaTitle = ctaSection.querySelector('h2'),
  ctaSplit = new SplitText(ctaTitle, {type: "words,chars"}),
  ctaParagraph = ctaSection.querySelector('p'),
  ctaArrowEl = ctaSection.querySelectorAll('.cta-icon,.cta_indicator-icons'),
  ctaCircles = ctaSection.querySelectorAll('.cta_circle-svg'),
  ctaFrame = ctaSection.querySelector('.section-framing-wrap'),
  ctaContactText = ctaSection.querySelector('.huge-text'),
  ctaContactSplit = new SplitText(ctaContactText, {type: "words,chars"}),
  ctaButton = ctaSection.querySelector('.cta_button-wrap');

  tl_ctaAnimation.fromTo('.cta_arrows-bg',{clipPath:'inset(0% 100% 0% 0%)'},{clipPath:'inset(0% 0% 0% 0%)', duration:1.2, ease:"power2.inOut"})
  .from($(ctaTitle).add(ctaSplit.words).add(ctaParagraph),{y:24, autoAlpha:0, stagger:0.06, ease:"power2.out"}, "<0.2")
  .from(ctaArrowEl,{x:-12, autoAlpha:0, ease:"power2.inOut",stagger:0.08}, ">-0.4")
  .from([ctaCircles[0],ctaCircles[2]],{scale:0.8, autoAlpha:0, stagger:0.1, ease:"power2.out"}, "<0.2")
  .from([ctaCircles[1],ctaCircles[3]],{scale:1.1, autoAlpha:0, stagger:0.1, ease:"power2.out"}, "<0.1")
  .from($(ctaContactText).add(ctaContactSplit.chars),{y:12,autoAlpha:0, stagger:0.02, ease:"power3.out"}, "<0.2")
  .from(ctaFrame,{scale:0.9, autoAlpha:0, ease:"power2.out"}, "<0.2")

let tl_rotateCtaCircles = gsap.timeline({repeat:-1,paused:true});
tl_rotateCtaCircles.to(ctaCircles[0],{rotation:360, duration:60, ease:"none"},0)
.to(ctaCircles[1],{rotation:-360, duration:80, ease:"none"},0)
.to(ctaCircles[2],{rotation:360, duration:100, ease:"none"},0)
.to(ctaCircles[3],{rotation:-360, duration:120, ease:"none"},0);

let tl_ctaBtnHover = gsap.timeline({paused:true});
tl_ctaBtnHover.to([ctaCircles[0],ctaCircles[3]],{scale:0.9, stagger:0.1,ease:"power2.inOut"});
ctaButton.addEventListener('mouseenter', () => {
  // Only play hover animation if scroll animation is complete
  if (!tl_ctaAnimation.progress() < 1) {
    tl_ctaBtnHover.play();
    tl_rotateCtaCircles.timeScale(1.72);
  }
});

ctaButton.addEventListener('mouseleave', () => {
  // Only reverse if we actually played it
  if (tl_ctaBtnHover.progress() > 0) {
    tl_ctaBtnHover.reverse();
    tl_rotateCtaCircles.timeScale(1);
  }
});

  //footer nav indicator animation
  const footerNavMenu = document.querySelector('.footer_link-wrapper');
const navLinks = document.querySelectorAll('.footer_link');

const footerIndicator = document.createElement('div');
footerIndicator.className = 'nav_indicator';
footerIndicator.innerHTML = '<img src="https://cdn.prod.website-files.com/693b6ff9d0380daa659b225b/693f9d3882289007d0ad5ebc_current%20nav%20indicator.svg" alt="">';
footerNavMenu.appendChild(footerIndicator);

function moveIndicator(link) {
  const linkRect = link.getBoundingClientRect();
  const menuRect = footerNavMenu.getBoundingClientRect();
  const targetX = linkRect.left - menuRect.left + (linkRect.width / 2) - (13 / 2);
  
  footerIndicator.style.transform = `translateX(${targetX}px)`;
  footerIndicator.style.opacity = '1';
}

const currentLink = document.querySelector('.footer_link.w--current');
if (currentLink) {
  moveIndicator(currentLink);
}

navLinks.forEach(link => {
  link.addEventListener('mouseenter', () => moveIndicator(link));
  link.addEventListener('mouseleave', () => {
    if (currentLink) moveIndicator(currentLink);
  });
});
});
