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
  const titleSection = sectionWrapper.querySelector(".orange-angle-wrap.page-intro");
  const spacerLarge = sectionWrapper.querySelector(".spacer-large");
  const triangleIndicator = document.querySelector(".vertical-active-indicator");

  // Calculate the scroll distance for indicators
  // We need to move the indicators column up by the total height of all indicators
  // accounting for the title section and spacer that come before the columns
  const calculateIndicatorScrollDistance = () => {
    if (!indicators.length) return 0;

    // Sum up the height of all indicator elements
    let totalHeight = 0;
    indicators.forEach(indicator => {
      totalHeight += indicator.offsetHeight;
    });

    // Account for the title section and spacer that offset the starting position
    const titleHeight = titleSection ? titleSection.offsetHeight : 0;
    const spacerHeight = spacerLarge ? spacerLarge.offsetHeight : 0;
    const offsetHeight = titleHeight + spacerHeight;

    // We need to move up by total indicator height minus the offset
    return -(totalHeight - offsetHeight);
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
      onLeave: () => {
        // Keep the last indicator and item active when unpinning
        if (indicators.length > 0 && cmsItems.length > 0) {
          indicators.forEach(ind => ind.classList.remove('is-active'));
          cmsItems.forEach(item => item.classList.remove('is-active'));
          indicators[indicators.length - 1].classList.add('is-active');
          cmsItems[cmsItems.length - 1].classList.add('is-active');
        }
      },
      onEnterBack: () => {
        // Restore the last indicator when scrolling back into the pinned area
        if (indicators.length > 0 && cmsItems.length > 0) {
          indicators.forEach(ind => ind.classList.remove('is-active'));
          cmsItems.forEach(item => item.classList.remove('is-active'));
          indicators[indicators.length - 1].classList.add('is-active');
          cmsItems[cmsItems.length - 1].classList.add('is-active');
        }
      }
    },
  });

  // Pin the triangle indicator for the duration of the animation
  if (triangleIndicator) {
    // Store the initial position
    const triangleInitialY = triangleIndicator.getBoundingClientRect().top;

    // Pin it by removing its sticky positioning and using GSAP to fix it in place
    ScrollTrigger.create({
      trigger: sectionWrapper,
      start: "top 100",
      end: "+=300%",
      onEnter: () => {
        gsap.set(triangleIndicator, { position: "fixed", top: triangleIndicator.getBoundingClientRect().top });
      },
      onLeave: () => {
        gsap.set(triangleIndicator, { position: "", top: "" });
      },
      onEnterBack: () => {
        gsap.set(triangleIndicator, { position: "fixed", top: triangleIndicator.getBoundingClientRect().top });
      },
      onLeaveBack: () => {
        gsap.set(triangleIndicator, { position: "", top: "" });
      }
    });
  }

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

  // Calculate the exact timeline position for each indicator based on accumulated heights
  // This accounts for variable indicator heights
  const calculateIndicatorPositions = () => {
    const titleHeight = titleSection ? titleSection.offsetHeight : 0;
    const spacerHeight = spacerLarge ? spacerLarge.offsetHeight : 0;
    const headerOffset = titleHeight + spacerHeight;

    // Get total scroll distance (absolute value)
    const totalScrollDistance = Math.abs(calculateIndicatorScrollDistance());

    let accumulatedHeight = 0;
    const positions = [];

    indicators.forEach((indicator, index) => {
      if (index === 0) {
        // First indicator: starts active at position 0
        positions.push(0);
      } else {
        // Other indicators: transition when triangle reaches bottom edge of previous indicator
        accumulatedHeight += indicators[index - 1].offsetHeight;
        // Divide by total scroll distance to get normalized position (0-1)
        positions.push(accumulatedHeight / totalScrollDistance);
      }
    });

    return positions;
  };

  // Add active class toggles for each indicator and cms item
  indicators.forEach((indicator, index) => {
    const correspondingItem = cmsItems[index];

    if (correspondingItem) {
      // Get the exact timeline position for this indicator
      const timelineProgress = calculateIndicatorPositions()[index];

      // Create a small tween at this position to handle forward and reverse properly
      workPage_tl.to({}, {
        duration: 0.01,
        onStart: () => {
          // This fires when scrubbing forward into this point
          indicators.forEach(ind => ind.classList.remove('is-active'));
          cmsItems.forEach(item => item.classList.remove('is-active'));
          indicator.classList.add('is-active');
          correspondingItem.classList.add('is-active');
        },
        onReverseComplete: () => {
          // This fires when scrubbing backward past this point
          // Reactivate the previous indicator/item
          if (index > 0) {
            indicators.forEach(ind => ind.classList.remove('is-active'));
            cmsItems.forEach(item => item.classList.remove('is-active'));
            indicators[index - 1].classList.add('is-active');
            cmsItems[index - 1].classList.add('is-active');
          }
        }
      }, timelineProgress);
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
