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
      //pinSpacing: false,
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

  // Set first indicator and cms item as active initially
  if (indicators.length > 0) {
    indicators[0].classList.add('is-active');
  }
  if (cmsItems.length > 0) {
    cmsItems[0].classList.add('is-active');
  }

  // Add active class toggles for each indicator and cms item
  indicators.forEach((indicator, index) => {
    const correspondingItem = cmsItems[index];

    if (correspondingItem) {
      // Calculate when this indicator should be in the "active" zone
      // The first indicator has half the active space (from top to center)
      // All other indicators have full space (from top to bottom edge)
      const timelineProgress = index === 0 ? 0 : (index - 0.5) / (indicators.length - 1);

      // Add active class at the appropriate timeline position
      workPage_tl.call(() => {
        // Remove active class from all indicators and items
        indicators.forEach(ind => ind.classList.remove('is-active'));
        cmsItems.forEach(item => item.classList.remove('is-active'));

        // Add active class to current indicator and item
        indicator.classList.add('is-active');
        correspondingItem.classList.add('is-active');
      }, null, timelineProgress * 0.8);
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
