// VIDEO PLAY & PAUSE
const video = document.querySelector(".hero .video video");
const videoControl = document.querySelector(".video-control");
const videoIcon = videoControl.querySelector("i");

videoControl.addEventListener("click", () => {
    if (video.paused) {
        video.play().then(() => {
            videoIcon.classList.remove("fa-play");
            videoIcon.classList.add("fa-pause");

            videoControl.setAttribute("aria-label", "Pause video");
        });
    } else {
        video.pause();

        videoIcon.classList.remove("fa-pause");
        videoIcon.classList.add("fa-play");

        videoControl.setAttribute("aria-label", "Play video");
    }
});



// HERO SECTION ANIMATION FOR THE BRAND SECTION
const hero = document.querySelector(".hero");

if (hero) {
    // ========================================
    // HERO — FIXED IN PLACE
    // ========================================

    const spacer = document.createElement("div");

    function setHeroSize() {
        const height = window.innerHeight;

        hero.style.height = `${height}px`;
        spacer.style.height = `${height}px`;
    }

    spacer.style.width = "100%";
    spacer.style.pointerEvents = "none";

    // Preserve the hero's original space in the document
    hero.parentNode.insertBefore(spacer, hero);

    // Keep the hero fixed in its original position
    hero.style.position = "fixed";
    hero.style.top = "0";
    hero.style.left = "0";
    hero.style.width = "100%";
    hero.style.zIndex = "1";
    hero.style.transform = "none";

    setHeroSize();

    // ========================================
    // FOLLOWING SECTIONS + FOOTER
    // ========================================

    let section = hero.nextElementSibling;

    while (section) {
        section.style.position = "relative";
        section.style.zIndex = "2";

        section = section.nextElementSibling;
    }

    // Also ensure footer is above the fixed hero
    const footer = document.querySelector(".footer");
    if (footer) {
        footer.style.position = "relative";
        footer.style.zIndex = "2";
    }

    // ========================================
    // SMOOTH ANCHOR SCROLLING
    // ========================================

    document.querySelectorAll('a[href^="#"]').forEach((link) => {
        link.addEventListener("click", (event) => {
            const targetId = link.getAttribute("href");

            if (!targetId || targetId === "#") {
                return;
            }

            const target = document.querySelector(targetId);

            if (!target) {
                return;
            }

            event.preventDefault();

            const targetPosition =
                target.getBoundingClientRect().top + window.scrollY;

            window.scrollTo({
                top: targetPosition,
                behavior: "smooth"
            });
        });
    });

    // ========================================
    // RESIZE
    // ========================================

    let resizeTimer;

    window.addEventListener("resize", () => {
        clearTimeout(resizeTimer);

        resizeTimer = setTimeout(() => {
            setHeroSize();
        }, 100);
    });
}




// const brand = document.querySelector(".brand");
// const services = document.querySelector(".services");

// if (brand && services) {
//     const blend = document.createElement("div");

//     blend.className = "brand-services-blend";

//     brand.style.position = "relative";

//     Object.assign(blend.style, {
//         position: "absolute",
//         left: "0",
//         right: "0",
//         bottom: "0",
//         height: "180px",
//         pointerEvents: "none",
//         zIndex: "1",

//         background: `
//             linear-gradient(
//                 to bottom,
//                 #F3EEE5 0%,
//                 #F3EEE5 20%,
//                 #F4EFE7 34%,
//                 #F6F2EC 48%,
//                 #F8F5F0 61%,
//                 #FAF8F4 72%,
//                 #FCFBF9 82%,
//                 #FDFCFB 92%,
//                 #FCFCFA 100%
//             )
//         `
//     });

//     brand.appendChild(blend);

//     const content = brand.querySelector(".content");

//     if (content) {
//         content.style.position = "relative";
//         content.style.zIndex = "2";
//     }
// }


// ========================================
// BRAND → SERVICES BLEND
// ========================================

const brand = document.querySelector(".brand");
const services = document.querySelector(".services");
const process = document.querySelector(".process");


// ========================================
// BRAND → SERVICES
// ========================================

if (brand && services) {

    const brandBlend = document.createElement("div");

    brandBlend.className = "brand-services-blend";

    brand.style.position = "relative";

    Object.assign(brandBlend.style, {
        position: "absolute",
        left: "0",
        right: "0",
        bottom: "0",
        height: "180px",
        pointerEvents: "none",
        zIndex: "1",

        background: `
            linear-gradient(
                to bottom,
                #F3EEE5 0%,
                #F3EEE5 20%,
                #F4EFE7 34%,
                #F6F2EC 48%,
                #F8F5F0 61%,
                #FAF8F4 72%,
                #FCFBF9 82%,
                #FDFCFB 92%,
                #FCFCFA 100%
            )
        `
    });

    brand.appendChild(brandBlend);

    const brandContent = brand.querySelector(".content");

    if (brandContent) {
        brandContent.style.position = "relative";
        brandContent.style.zIndex = "2";
    }
}


// ========================================
// SERVICES → PROCESS BLEND
// ========================================

if (services && process) {

    const servicesBlend = document.createElement("div");

    servicesBlend.className = "services-process-blend";

    services.style.position = "relative";

    Object.assign(servicesBlend.style, {
        position: "absolute",
        left: "0",
        right: "0",
        bottom: "0",
        height: "180px",
        pointerEvents: "none",
        zIndex: "1",

        background: `
            linear-gradient(
                to bottom,
                #FCFCFA 0%,
                #FCFCFA 20%,
                #FDFCFB 34%,
                #FAF8F4 48%,
                #F8F5F0 61%,
                #F6F2EC 72%,
                #F4EFE7 82%,
                #F3EEE5 92%,
                #F3EEE5 100%
            )
        `
    });

    services.appendChild(servicesBlend);

    const servicesContent = services.querySelector(".content");

    if (servicesContent) {
        servicesContent.style.position = "relative";
        servicesContent.style.zIndex = "2";
    }
}
