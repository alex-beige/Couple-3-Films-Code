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
  //const spacerLarge = sectionWrapper.querySelector(".spacer-large");
  //const triangleIndicator = document.querySelector(".vertical-active-indicator");

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

    // Get the triangle indicator position (distance from top where it sits)
    const triangleOffset = triangleIndicator ? triangleIndicator.offsetTop : 0;

    // We need to move up by: total height - offset + triangle position
    // This ensures the last indicator reaches the triangle position
    return -(totalHeight - offsetHeight + triangleOffset);
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
      onUpdate: (self) => {
        const progress = self.progress;
        const positions = calculateIndicatorPositions();

        // Debug: log positions on first update
        if (!window.debugPositionsLogged) {
          console.log('Indicator positions:', positions);
          console.log('Total scroll distance:', Math.abs(calculateIndicatorScrollDistance()));
          console.log('Number of indicators:', indicators.length);
          console.log('Number of cms items:', cmsItems.length);
          indicators.forEach((ind, i) => {
            console.log(`Indicator ${i} height:`, ind.offsetHeight);
          });
          window.debugPositionsLogged = true;
        }

        // Find which indicator should be active based on current progress
        let activeIndex = 0;
        for (let i = positions.length - 1; i >= 0; i--) {
          if (progress >= positions[i]) {
            activeIndex = i;
            break;
          }
        }

        // Debug: log when activeIndex changes
        if (window.lastActiveIndex !== activeIndex) {
          console.log(`Progress: ${progress.toFixed(3)}, Active index: ${activeIndex}`);
          window.lastActiveIndex = activeIndex;
        }

        // Update active states - only change if different from current
        indicators.forEach((ind, i) => {
          const shouldBeActive = (i === activeIndex);
          const isActive = ind.classList.contains('is-active');

          if (shouldBeActive && !isActive) {
            ind.classList.add('is-active');
            if (cmsItems[i]) cmsItems[i].classList.add('is-active');
          } else if (!shouldBeActive && isActive) {
            ind.classList.remove('is-active');
            if (cmsItems[i]) cmsItems[i].classList.remove('is-active');
          }
        });
      },
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
    // Get total scroll distance (absolute value)
    const totalScrollDistance = Math.abs(calculateIndicatorScrollDistance());

    let accumulatedHeight = 0;
    const positions = [];

    indicators.forEach((indicator, index) => {
      if (index === 0) {
        // First indicator: activates at the top
        positions.push(0);
      } else {
        // Other indicators: activate at the center of the previous indicator
        // accumulatedHeight is at the top of current indicator
        // Subtract half the height of the previous indicator
        const previousIndicatorHalfHeight = indicators[index - 1].offsetHeight / 2;
        positions.push((accumulatedHeight - previousIndicatorHalfHeight) / totalScrollDistance);
      }
      accumulatedHeight += indicator.offsetHeight;
    });

    return positions;
  };
});
// const section = document.querySelector(".work-page_grid.is-category-page");

// const content = document.querySelector(".work-page_nav-main");

// window.addEventListener("scroll", () => {
//   const sectionRect = section.getBoundingClientRect();
//   const sectionTop = sectionRect.top;
//   const clipAmount = Math.max(0, 60 - sectionTop);
//   content.style.clipPath = `inset(${clipAmount}px 0 0 0)`;
// });
