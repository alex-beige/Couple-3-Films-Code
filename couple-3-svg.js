gsap.registerPlugin(DrawSVGPlugin);


// ============================================
    // TIMING CONTROLS - Tweak these values easily!
    // ============================================
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
gsap.set(".letter",{yPercent:5})
    // ============================================
    // ANIMATION SETUP
    // ============================================
    
    // Create the main timeline
    let masterTimeline;

    function createAnimation() {
      // Create a new timeline
      masterTimeline = gsap.timeline({ paused: true });

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

 

    // Optional: Auto-play on load (comment out if you don't want this)
    window.addEventListener('load', () => {
      setTimeout(() => {
        masterTimeline.play();
      }, 500);
    });