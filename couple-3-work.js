document.addEventListener("DOMContentLoaded", function () {
  gsap.registerPlugin(ScrollTrigger, SplitText);
  gsap.defaults({
    duration: 0.72,
    ease: "power2",
  });
  const mm = gsap.matchMedia();

  // Get all indicator elements and corresponding CMS items
  const indicators = gsap.utils.toArray(".work-page_title-item");
  const cmsItems = gsap.utils.toArray(".work_cms-item");
  const sectionWrapper = document.querySelector("#category-wrapper");
  const indicatorsColumn = sectionWrapper.querySelector(".work-page_nav-main");

  // Calculate the scroll distance for indicators
  // We need to move the indicators column up by the total height of all indicators
  const calculateIndicatorScrollDistance = () => {
    if (!indicators.length) return 0;

    // Sum up the height of all indicator elements
    let totalHeight = 0;
    indicators.forEach(indicator => {
      totalHeight += indicator.offsetHeight;
    });

    return -totalHeight;
  };

  // Create main timeline with pinning
  const workPage_tl = gsap.timeline({
    scrollTrigger: {
      trigger: sectionWrapper,
      start: "top 100",
      end: "+=300%",
      scrub: 1.5,
      pin: true,
      pinSpacing: false,
      invalidateOnRefresh: true, // Recalculate on resize
      // markers: true,
    },
  });

  // Add indicators scrolling animation to timeline
  if (indicatorsColumn) {
    workPage_tl.to(indicatorsColumn, {
      y: calculateIndicatorScrollDistance,
      ease: "none", // Linear movement for scroll effect
      duration: 1, // This will be stretched by scrub
    }, 0); // Start at beginning of timeline
  }

  // Set first cms item to be visible initially
  if (cmsItems.length > 0) {
    gsap.set(cmsItems[0], { opacity: 1, y: 0 });
  }

  // Add fade-in animations for each cms item, coordinated with indicator positions
  indicators.forEach((indicator, index) => {
    const correspondingItem = cmsItems[index];

    if (correspondingItem) {
      // Skip the first item since it's already visible
      if (index === 0) return;

      // Calculate when this indicator should be in the "active" zone
      // The first indicator has half the active space (from top to center)
      // All other indicators have full space (from top to bottom edge)

      // For index 1, it should trigger when triangle hits bottom of item 0
      // For index 2, it should trigger when triangle hits bottom of item 1, etc.
      const timelineProgress = (index - 0.5) / (indicators.length - 1);

      workPage_tl.fromTo(
        correspondingItem,
        {
          opacity: 0,
          y: 20, // Add subtle upward movement
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.3, // Shortened duration within scrubbed timeline
          ease: "power2.out",
        },
        timelineProgress * 0.8 // Spread across 80% of timeline
      );
    }
  });
});
// const section = document.querySelector(".work-page_grid.is-category-page");

// const content = document.querySelector(".work-page_nav-main");

// window.addEventListener("scroll", () => {
//   const sectionRect = section.getBoundingClientRect();
//   const sectionTop = sectionRect.top;
//   const clipAmount = Math.max(0, 60 - sectionTop);
//   content.style.clipPath = `inset(${clipAmount}px 0 0 0)`;
// });
