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
  const workPage_tl = gsap.timeline({
    scrollTrigger: {
      trigger: sectionWrapper,
        start: "top 100",
        end: "+=300%",
        scrub: 1.5,
        // markers: true,
    },
  });


  indicators.forEach((indicator, index) => {
    const correspondingItem = cmsItems[index];

    if (correspondingItem) {
      gsap.fromTo(
        correspondingItem,
        {
          opacity: 0,
        },
        {
          opacity: 1,
          duration: 0.6, // Control animation speed
          scrollTrigger: {
            trigger: indicator,
            start: "top -60",
            end: "bottom top",
            toggleActions: "play reverse play reverse", // Fixed syntax
            //  markers: true,
          },
        }
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
