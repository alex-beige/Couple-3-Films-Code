document.addEventListener("DOMContentLoaded", function () {
  gsap.registerPlugin(ScrollTrigger, SplitText);
  gsap.defaults({
    duration: 0.72,
    ease: "power2",
  });
  const mm = gsap.matchMedia();
      // Check if dependencies are loaded
if (typeof Lenis === 'undefined' || typeof gsap === 'undefined') {
  console.error('Required libraries not loaded');
  return;
}

const MOBILE_BREAKPOINT = 479;
const isDesktop = window.matchMedia(`(min-width: ${MOBILE_BREAKPOINT}px)`).matches;

if (isDesktop) {
  // Initialize Lenis with optimized settings
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1,
    smoothTouch: false,
    infinite: false,
  });

  // Sync with ScrollTrigger
  lenis.on('scroll', ScrollTrigger.update);

  // Use requestAnimationFrame for better performance
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  // Prevent memory leaks - cleanup on page unload
  window.addEventListener('beforeunload', () => {
    lenis.destroy();
  });
  
} else {
  console.log('Mobile view detected - smooth scroll disabled');
}

// Configure ScrollTrigger
ScrollTrigger.config({
  ignoreMobileResize: true
});
  // ====================================
  // DOM ELEMENT REFERENCES
  // ====================================
  const elements = {
    introContainer: document.querySelector(".standard-section:has(h1)"),
  };
//project pages - wrap role labels
$('.rich-text-roles p').each(function() {
    var $paragraph = $(this);
    var text = $paragraph.html();
    
    // Check if there's a colon in the paragraph
    if (text.indexOf(':') !== -1) {
        // Find the first colon position
        var colonIndex = text.indexOf(':') + 1;
        
        // Split into label (before colon) and rest (colon + after)
        var label = text.substring(0, colonIndex);
        var rest = text.substring(colonIndex);
        
        // Reconstruct with wrapped label
        var newHTML = '<span class="roles-label">' + label + '</span>' + rest;
        
        // Update the paragraph
        $paragraph.html(newHTML);
    }
});
  //elements.frame = elements.introContainer.querySelector(".hero-framing-wrap");
  elements.heroText = elements.introContainer.querySelectorAll("h1,.project_client-name");
  elements.introElements = elements.introContainer.querySelectorAll("[gsap-intro-el]");
    // Split text into words for stagger animation
  const split_h1 = new SplitText(elements.heroText, { type: "words" }),
  split_paragraph = new SplitText(elements.introContainer.querySelectorAll(".rich-text p, .rich-text-roles p"), { type: "words,lines" });
  const tl_intro = gsap.timeline({});

  tl_intro
    // Fade in brand wrapper
    .from("[gsap-intro-cell]", {
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
        stagger: 0.08,
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
var $projectPageHero = $('.standard-section[project-type]');

if ($projectPageHero.length) {
    var projectPageType = $projectPageHero.attr('project-type');
    console.log('Project type:', projectPageType);
    
    // Find nav links whose text contains the project type (case-insensitive)
    var $activePage = $(navLinks).filter(function() {
        var linkText = $(this).text().trim().toLowerCase();
        var searchTerm = projectPageType.trim().toLowerCase();
        return linkText.indexOf(searchTerm) !== -1;
    }).first();
    
    console.log('Found active page:', $activePage.length);
    
    // Call moveIndicator if we found a matching link
    if ($activePage.length) {
        moveIndicator($activePage[0]);
    } else {
        console.log('No matching nav link found');
    }
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
