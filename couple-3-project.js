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

//project pages - set alt text as caption for recognition logos
$('.carousel_item-logo.is-project.page').each(function() {
    var $carouselItem = $(this);
    
    // Find the image and caption within this carousel item
    var $img = $carouselItem.find('.carousel-img');
    var $caption = $carouselItem.find('.recogniton-caption');
    
    // Get the alt text from the image
    var altText = $img.attr('alt');
    
    // Check if alt text exists and is not empty
    if (altText && altText.trim() !== '') {
        // Update caption text and ensure it's visible
        $caption.text(altText).show();
    } else {
        // Hide the caption if alt text is empty
        $caption.hide();
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
