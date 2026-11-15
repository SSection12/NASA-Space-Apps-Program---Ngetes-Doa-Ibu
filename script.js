const canvas = document.getElementById("spacething");
const ctx = canvas.getContext("2d");

const STAR_COUNT = 200;
let stars = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initStars();
}

function initStars() {
    stars = [];
    for (let i = 0; i < STAR_COUNT; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 1.5 + 0.5,
            speed: Math.random() * 0.7 + 0.2, 
            opacity: Math.random() * 0.7 + 0.3 
        });
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const scrollY = window.scrollY || window.pageYOffset;

    for (let star of stars) {

        let y = (star.y - scrollY * star.speed) % canvas.height;
        if (y < 0) {
            y += canvas.height;
        }

        ctx.beginPath();
        ctx.arc(star.x, y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.fill();
    }

    requestAnimationFrame(draw);
}

window.addEventListener("resize", resizeCanvas);

resizeCanvas();
requestAnimationFrame(draw);

const atmospher = document.getElementById("atmosphere");
const marsSection = document.getElementById("mars");

function updateAtmosphere() {
    if (!atmospher || !marsSection) return;

    const Rect = marsSection.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    const start = windowHeight * 0.9;
    const end = windowHeight * 0.15;

    const progress = math.max(0, math.min(1, (start - Rect.top) / (start - end)));

    atsmospher.style.opacity = progress;
}

window.addEventListener("scroll", updateAtmosphere, { passive: true });

window.addEventListener("resize", updateAtmosphere);

updateAtmosphere();

// SCROLL ANIMATION

const fadeElements = document.querySelectorAll(".ttse");
function handleScroll() {
    const screenHeight = window.innerHeight;
    fadeElements.forEach(element => {
        const rect = element.getBoundingClientRect();
        const elementCenter = rect.top + rect.height / 2;
        const distance = Math.abs(
            elementCenter - screenHeight / 2
        );
        let opacity = 1 - distance / (screenHeight * 0.5);
        opacity = Math.max(0, Math.min(1, opacity));
        element.style.opacity = opacity;
        element.style.transform =
            `translateY(${30 * (1 - opacity)}px)`;
    });
}
window.addEventListener("scroll", handleScroll, {
    passive: true
});

handleScroll();

const journey = document.querySelector(".sticky_section1");
const stage = document.querySelector(".lander-landing-land");
const moon = document.querySelector(".moon-image_sticky1");
const lander = document.querySelector(".apollo11");
const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
).matches;
let animationFrame = null;
const START_ANGLE  = 190; 
const END_ANGLE    = 90; 
const START_RADIUS = 0.57;
const START_TILT   = -65
const START_SCALE  = 0.72; 
const LAND_OFFSET  = 0.085;
function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

function lerp(a, b, t) {
    return a + (b - a) * t;
}

function smoothstep(t) {
    return t * t * (3 - 2 * t);
}

function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
}
if (lander) {
    lander.style.transformOrigin = "50% 100%";
    lander.style.transition = "none";
    lander.style.willChange = "transform, left, top";
}

function updateLander() {
    animationFrame = null;
    if (!journey || !stage || !moon || !lander) return;
    const journeyRect = journey.getBoundingClientRect();

    const scrollDistance = journey.offsetHeight - window.innerHeight;

    let progress = clamp(
        -journeyRect.top / Math.max(1, scrollDistance),
        0,
        1
    );
    if (prefersReducedMotion) {
        progress = 1;
    }
    const moonRect = moon.getBoundingClientRect();
    const stageRect = stage.getBoundingClientRect()
    if (!moonRect.width || !moonRect.height) return;
    const centerX = moonRect.left - stageRect.left + moonRect.width / 2;
    const centerY = moonRect.top - stageRect.top + moonRect.height / 2

    const landingY =
        moonRect.top - stageRect.top + moonRect.height * LAND_OFFSET;

    const startRadiusX = moonRect.width * START_RADIUS;
    const startRadiusY = moonRect.height * START_RADIUS;

    const endRadiusY = centerY - landingY;
    const endRadiusX = startRadiusX * (endRadiusY / startRadiusY);

    const swing = easeOutCubic(progress);
    const descent = smoothstep(clamp((progress - 0.3) / 0.7, 0, 1));

    const settle = smoothstep(progress);
    const angle = lerp(START_ANGLE, END_ANGLE, swing) * Math.PI / 180;
    const radiusX = lerp(startRadiusX, endRadiusX, descent);
    const radiusY = lerp(startRadiusY, endRadiusY, descent);
    const x = centerX + radiusX * Math.cos(angle);
    const y = centerY - radiusY * Math.sin(angle);

    const rotation = lerp(START_TILT, 0, settle);
    const scale = lerp(START_SCALE, 1, settle);
    lander.style.left = `${x}px`;
    lander.style.top = `${y}px`;
    lander.style.transform = `
        translate(-50%, -100%)
        rotate(${rotation}deg)
        scale(${scale})
    `;
}
function requestAnimationUpdate() {
    if (animationFrame !== null) return;
    animationFrame = requestAnimationFrame(updateLander);
}
window.addEventListener("scroll", requestAnimationUpdate, { passive: true });
window.addEventListener("resize", requestAnimationUpdate);
[moon, lander].forEach(img => {
    if (!img) return;
    img.addEventListener("load", requestAnimationUpdate);
    if (img.complete) requestAnimationUpdate();
});
if ("ResizeObserver" in window && stage) {
    new ResizeObserver(requestAnimationUpdate).observe(stage);
}
requestAnimationUpdate();

// LETTER FLICKER MAIN TEXT

function initLetterFlicker() {
    const targets = document.querySelectorAll(".flicker");

    targets.forEach(el => {
        const accessibleText = el.textContent.replace(/\s+/g, " ").trim();
        if (!el.hasAttribute("aria-label") && accessibleText) {
            el.setAttribute("aria-label", accessibleText);
        }

        const words = [];
        let currentWord = [];

        Array.from(el.childNodes).forEach(node => {
            if (node.nodeType === Node.TEXT_NODE) {
                const fragment = document.createDocumentFragment();

                for (const ch of node.textContent) {
                    if (/\S/.test(ch)) {
                        const span = document.createElement("span");
                        span.className = "flicker-char";
                        span.setAttribute("aria-hidden", "true");
                        span.textContent = ch;
                        fragment.appendChild(span);
                        currentWord.push(span);
                    } else {
                        if (currentWord.length > 0) {
                            words.push(currentWord);
                            currentWord = [];
                        }
                        fragment.appendChild(document.createTextNode(ch));
                    }
                }

                node.replaceWith(fragment);
            } else {
                if (currentWord.length > 0) {
                    words.push(currentWord);
                    currentWord = [];
                }
            }
        });

        if (currentWord.length > 0) {
            words.push(currentWord);
        }

        if (prefersReducedMotion || words.length === 0) return;

        const totalChars = words.reduce((sum, word) => sum + word.length, 0);
        function pickRandomWord() {
            let r = Math.random() * totalChars;
            for (const word of words) {
                r -= word.length;
                if (r <= 0) return word;
            }
            return words[words.length - 1];
        }

        function setDim(span, opacity) {
            span.classList.add("is-flickering");
            span.style.opacity = opacity;
        }

        function setLit(span) {
            span.classList.remove("is-flickering");
            span.style.opacity = "1";
        }

        function triggerClusterFlicker() {
            const word = pickRandomWord();

            // Choose 1–3 side-by-side letters (25% -> 1, 45% -> 2, 30% -> 3)
            const roll = Math.random();
            const desiredCount = roll < 0.25 ? 1 : roll < 0.7 ? 2 : 3;
            const count = Math.min(desiredCount, word.length);

            const startIdx = Math.floor(Math.random() * (word.length - count + 1));
            const cluster = word.slice(startIdx, startIdx + count);

            const firstDip = 55 + Math.random() * 75;
            const doubleFlicker = Math.random() < 0.35;
            const recoveryGap = 40 + Math.random() * 45;
            const secondDip = 45 + Math.random() * 65;

            let maxDuration = 0;

            cluster.forEach(span => {
                // Tiny 0–18ms stagger mimics uneven electrical sag across neighbors
                const microDelay = Math.random() * 18;
                const dim1 = (0.14 + Math.random() * 0.34).toFixed(2);
                const dim2 = (0.18 + Math.random() * 0.32).toFixed(2);

                setTimeout(() => setDim(span, dim1), microDelay);
                setTimeout(() => setLit(span), microDelay + firstDip);

                if (doubleFlicker) {
                    const secondStart = microDelay + firstDip + recoveryGap;
                    const secondEnd = secondStart + secondDip;

                    setTimeout(() => setDim(span, dim2), secondStart);
                    setTimeout(() => setLit(span), secondEnd);

                    maxDuration = Math.max(maxDuration, secondEnd);
                } else {
                    maxDuration = Math.max(maxDuration, microDelay + firstDip);
                }
            });

            const isAftershock = Math.random() < 0.2;
            const nextDelay = isAftershock
                ? 180 + Math.random() * 280
                : 700 + Math.random() * 1800;

            setTimeout(triggerClusterFlicker, maxDuration + nextDelay);
        }

        const initialDelay = 100 + Math.random() * 800; // Delay flickering
        setTimeout(triggerClusterFlicker, initialDelay);
    });
}

initLetterFlicker();