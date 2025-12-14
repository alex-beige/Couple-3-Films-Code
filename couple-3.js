console.log("Party Time 2");
if (history.scrollRestoration) {
  history.scrollRestoration = "manual";
}
document.addEventListener("DOMContentLoaded", function () {
  gsap.registerPlugin(ScrollTrigger, SplitText);
  gsap.defaults({
    duration: 0.72,
    ease: "power2",
  });
  const mm = gsap.matchMedia();

  //Intro Anim
  let introContainer = document.querySelector(".standard-section:has(h1)"),
    brandWrap = introContainer.querySelector(".hero_brand-anim-wrap"),
    videoWrapper = introContainer.querySelector(".grid-cell.is-vimeo-wrapper"),
    frame = introContainer.querySelector(".hero-framing-wrap"),
    heroText = introContainer.querySelector("h1"),
    split_h1 = new SplitText(heroText, { type: "words" }),
    introEl = introContainer.querySelectorAll("[gsap-intro-el]");

  gsap.set(brandWrap, { xPercent: -69.3 });
  const elRect = brandWrap.getBoundingClientRect();

  let viewportCenterX = window.innerWidth / 2;
  let elCenterX = elRect.left + elRect.width / 2;
  //   viewportCenterX = viewportCenterX * 0.5;
  //   elCenterX = elCenterX * 0.5;
  function heroScroll() {
    console.log("scroll ready!");
    //ScrollTrigger.refresh();
    $("body").removeClass("body-overflow-hidden");
  }

  let tl_intro = gsap.timeline({
    onComplete: () => {
      heroScroll();
    },
  });

  tl_intro
    .from(brandWrap, {
      autoAlpha: 0,
    })
    .from(
      brandWrap,
      {
        x: viewportCenterX - elCenterX,
        ease: "power4.inOut",
        duration: 1.5,
      },
      ">-0.25"
    )
    .from(
      ".brand-anim_logo-img",
      {
        x: 24,
        ease: "power4.inOut",
        duration: 1.64,
      },
      "<0.1"
    )
    .from(
      $(heroText).add(split_h1.words),
      {
        duration: 1,
        autoAlpha: 0,
        yPercent: 25,
        stagger: 0.04,
        ease: "power3",
      },
      ">"
    )
    .from(
      introEl,
      {
        y: 24,
        autoAlpha: 0,
        stagger: 0.1,
        ease: "power2",
      },
      "<0.4"
    )
    .from(
      videoWrapper,
      {
        yPercent: 20,
        autoAlpha: 0,
        duration: 1,
        ease: "power3",
      },
      "<0.2"
    )
    .from(
      ".navwrapper",
      {
        autoAlpha: 0,
        ease: "power3",
      },
      "<0.6"
    );
  //.add(heroScroll(), "<");

  let tl_rotating1 = gsap.timeline({}).to(".brand-anim_outer-ring", {
    rotation: 360,
    duration: 400,
    repeat: -1,
    ease: "none",
    modifiers: {
      rotation: gsap.utils.unitize((value, target) => {
        const t = gsap.globalTimeline.time();
        const ramp = Math.min(t / 3, 1); // 0 → 1 over 0.8s
        return value * ramp;
      }),
    },
  });
  let tl_rotating2 = gsap.timeline({}).to(".brand-anim_inner-ring", {
    rotation: 360,
    duration: 650,
    repeat: -1,
    ease: "none",
    modifiers: {
      rotation: gsap.utils.unitize((value, target) => {
        const t = gsap.globalTimeline.time();
        const ramp = Math.min(t / 3, 1); // 0 → 1 over 0.8s
        return value * ramp;
      }),
    },
  });
  function centerTargetXY(el) {
    const r = el.getBoundingClientRect();

    const dx = window.innerWidth / 2 - (r.left + r.width / 2);
    const dy = window.innerHeight / 2 - (r.top + r.height / 2);

    const currentX = gsap.getProperty(el, "x");
    const currentY = gsap.getProperty(el, "y");

    return {
      x: currentX + dx,
      y: currentY + dy,
    };
  }
  function scaleToViewport(el, wRatio = 0.85, hRatio = 0.85) {
    const r = el.getBoundingClientRect();
    const sx = (window.innerWidth * wRatio) / r.width;
    const sy = (window.innerHeight * hRatio) / r.height;
    return Math.min(sx, sy); // keep aspect ratio (no stretching)
  }
  let tl_heroScroll = gsap.timeline({
    scrollTrigger: {
      pin: true,
      trigger: introContainer,
      start: "top top",
      end: "+=200%",
      scrub: 1.5,
      invalidateOnRefresh: true,
    },
  });
  tl_heroScroll
    .to(brandWrap, {
      xPercent: -10,
    })
    .to(
      [".hero_content-wrap", ".hero_icon", ".nav_linkwrapper"],
      { autoAlpha: 0 },
      "<"
    )
    .to(
      videoWrapper,
      {
        x: () => centerTargetXY(videoWrapper).x,
        y: () => centerTargetXY(videoWrapper).y,
        ease: "none",
      },
      "<0.1"
    )
    .to(
      videoWrapper,
      {
        scale: () => scaleToViewport(videoWrapper, 0.85, 0.85),
        transformOrigin: "50% 50%",
        ease: "none",
      },
      ">0.3"
    )
    .to(
      videoWrapper,
      {
        scale: () => scaleToViewport(videoWrapper, 0.85, 0.85),
        transformOrigin: "50% 50%",
        ease: "none",
      },
      ">0.3"
    );
  // .to(
  //   ".bg-overlay",
  //   {
  //     background: "#EF5E3D",
  //   },
  //   "<"
  // );
});
