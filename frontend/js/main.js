// HERO TITLE

gsap.from(".hero-title", {
    y: -80,
    opacity: 0,
    duration: 1.2,
    ease: "power3.out"
});

// HERO TEXT

gsap.from(".hero-text", {
    x: -100,
    opacity: 0,
    duration: 1.5,
    delay: 0.3
});

// BUTTON

gsap.from(".hero-btn", {
    scale: 0,
    opacity: 0,
    duration: 1,
    delay: 0.7
});

// HERO IMAGE

gsap.from(".hero-image", {
    x: 150,
    opacity: 0,
    duration: 1.5
});

// ABOUT CARDS

gsap.from(".card", {
    y: 80,
    opacity: 0,
    duration: 1,
    stagger: 0.3,
    delay: 1
});

// CATEGORY CARDS

gsap.from(".category-card", {
    scale: 0,
    opacity: 0,
    duration: 0.8,
    stagger: 0.2,
    delay: 1.5
});


// GSAP Stagger Animation

gsap.from(
".card",
{
y:50,
opacity:0,
duration:1,
stagger:.2
}
);