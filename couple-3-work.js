document.addEventListener("DOMContentLoaded", function () {
  gsap.registerPlugin(ScrollTrigger, SplitText);
  gsap.defaults({
    duration: 0.72,
    ease: "power2",
  });
  const mm = gsap.matchMedia();

  // ====================================
  // DOM ELEMENT REFERENCES
  // ====================================
  const elements = {
    introContainer: document.querySelector(".standard-section:has(h1)"),
  };

  //elements.frame = elements.introContainer.querySelector(".hero-framing-wrap");
  elements.heroText = elements.introContainer.querySelector("h1");
  elements.introElements = elements.introContainer.querySelectorAll("[gsap-intro-el]");
    // Split text into words for stagger animation
  const split_h1 = new SplitText(elements.heroText, { type: "words" }),
  split_paragraph = new SplitText(elements.introContainer.querySelectorAll(".rich-text p"), { type: "words,lines" });
  const tl_intro = gsap.timeline({});

  tl_intro
    // Fade in brand wrapper
    .from(".orange-angle-wrap.page-intro", {
      autoAlpha: 0,
    })
    // Fade in hero text with stagger effect on words
    .from(
      $(elements.heroText).add(split_h1.words),
      {
        duration: 1,
        autoAlpha: 0,
        yPercent: 18,
        stagger: 0.08,
        ease: "power3",
      },
      ">"
    ).from(
      split_paragraph.lines,
      {
        y: 18,
        autoAlpha: 0,
        stagger: 0.06,
        ease: "power2",
      },
      "<0.2"
    )
    // Fade in intro elements with stagger
    .from(
      elements.introElements,
      {
        y: 24,
        autoAlpha: 0,
        stagger: 0.2,
        ease: "power2",
      },
      "<"
    )
    // Fade in navigation
    .from(
      ".navwrapper",
      {
        autoAlpha: 0,
        ease: "power3",
      },
      ">-0.4"
    );
// ====================================
// Infinite Carousel for Logos
// Assuming your HTML looks like:
// <div class="carousel">
//   <ul class="list">...</ul>
//   <ul class="list">...</ul>
// </div>

const carousel_lists = gsap.utils.toArray('.carousel-wrap');
let carousel_length = document.querySelectorAll('.carousel_item-logo').length;
const carousel_duration = carousel_length * 5; // adjust speed

// Set second list immediately after first
//gsap.set(carousel_lists[1], { xPercent: 100 });

// Create infinite loop
gsap.to(carousel_lists, {
  xPercent: -100,
  duration: carousel_duration,
  ease: 'none',
  repeat: -1,
  modifiers: {
    xPercent: gsap.utils.wrap(-100, 0)
  }
});

  // Get all indicator elements and corresponding CMS items
  const indicators = gsap.utils.toArray(".work-page_title-item");
  const cmsItems = gsap.utils.toArray(".work_cms-item");
  const sectionWrapper = document.querySelector("#category-wrapper");
  if (sectionWrapper) {
  const indicatorsColumn = sectionWrapper.querySelector(".work-page_nav-main");
  const titleSection = sectionWrapper.querySelector(".orange-angle-wrap.page-intro,.orange-angle-wrap.page-intro-supporting");
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
    const offsetHeight = titleHeight; //titleHeight + spacerHeight;

    // Get the triangle indicator position (distance from top where it sits)
    const triangleOffset = triangleIndicator ? triangleIndicator.offsetTop : 0;

    // We need to move up by: total height - offset + triangle position
    // This ensures the last indicator reaches the triangle position
    return -(totalHeight - offsetHeight + triangleOffset);
  };

  // amount to scroll
  let scrollSizeEnd = indicators.length * 70;

  // Create main timeline with pinning
  const workPage_tl = gsap.timeline({
    scrollTrigger: {
      trigger: sectionWrapper,
      start: "top 80",
      end: `+=${scrollSizeEnd}`,
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

  }

gsap.utils
    .toArray("section[anim-section]")
    .forEach((group, i) => {

        let heading = group.querySelector(
          ".h1-size,h2,.h2-size,h3:not(.h3-size-minor),.h3-size:not(p)"
        ),
        split_heading = new SplitText(heading, { type: "words" }),
        subheading = group.querySelector(
          ".spacer-heading-wrap ~ p"
        ),
        split_subheading = new SplitText(subheading, { type: "lines,words" }),
        items = group.querySelectorAll("[gsap-anim-el]");
        //gridCells = group.querySelectorAll(".work_section-grid > .grid-cell:not(:first-child)");


      let tl_group = gsap.timeline({
        scrollTrigger: {
          trigger: group,
          toggleActions: "play none none none",
          start: "top 54%",
        },
      });
   
      tl_group
        .from(
          $(heading).add(split_heading.words),
          {
            duration: 1,
            autoAlpha: 0,
            y: 27,
            stagger: 0.06,
            //ease: "power3",
          }
        )
        .from(
          $(subheading).add(split_subheading.lines),
          {
            autoAlpha: 0,
            duration: 0.8,
            y: 24,
            //autoAlpha: 0,
            //ease: "power3",
            stagger: 0.08,
          },
          "<0.24"
        ).from(
     items,
      {
        y: 24,
        autoAlpha: 0,
        stagger: 0.2,
        ease: "power2",
      },
      "<0.4"
    )

  });


  //CTA
    let tl_ctaAnimation = gsap.timeline({
    scrollTrigger: {
      trigger: '#cta-section',
      start: "top 50%", 
      //pin: true,
      end: "+=55%",
      //scrub: 1.6,
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

  tl_ctaAnimation.fromTo('[cta-half-section]',{clipPath:'inset(0% 100% 0% 0%)'},{clipPath:'inset(0% 0% 0% 0%)', duration:1.4, ease:"power2.inOut"})
  .from($(ctaTitle).add(ctaSplit.words).add(ctaParagraph),{y:24, autoAlpha:0, stagger:0.06, ease:"power2.out"}, "<0.2")
  .from(ctaArrowEl,{x:-12, autoAlpha:0, ease:"power2.inOut",stagger:0.08}, ">-0.4")
  .from([ctaCircles[0],ctaCircles[2]],{scale:0.8, autoAlpha:0, stagger:0.1, ease:"power2.out"}, "<0.2")
  .from([ctaCircles[1],ctaCircles[3]],{scale:1.1, autoAlpha:0, stagger:0.1, ease:"power2.out"}, "<0.1")
  .from($(ctaContactText).add(ctaContactSplit.chars),{y:12,autoAlpha:0, stagger:0.02, ease:"power3.out"}, "<0.2")
  .from(ctaFrame,{scale:0.9, autoAlpha:0, ease:"power2.out",onComplete: () => $(ctaButton).addClass("pointer-events-auto")}, "<0.2");
  //.from({},{duration: 0.25}) // tiny pause to create a gap in the scrub

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
// const section = document.querySelector(".work-page_grid.is-category-page");

// const content = document.querySelector(".work-page_nav-main");

// window.addEventListener("scroll", () => {
//   const sectionRect = section.getBoundingClientRect();
//   const sectionTop = sectionRect.top;
//   const clipAmount = Math.max(0, 60 - sectionTop);
//   content.style.clipPath = `inset(${clipAmount}px 0 0 0)`;
// });
