/* ---- Header Scroll ---- */

const header = document.querySelector(".header");

let lastScrollY = window.scrollY;
let ticking = false;


/* ---- Mobile Menu Elements ---- */

const menuToggle = document.querySelector(".menu-toggle");
const mobileMenu = document.querySelector(".mobile-menu");
const mobileMenuLinks = document.querySelectorAll(".mobile-menu-nav a");

let savedScrollY = 0;


/* ---- Header Scroll ---- */

function updateHeader() {

    /* Keep header visible while mobile menu is open */
    if (mobileMenu && mobileMenu.classList.contains("active")) {
        header.classList.remove("header-hidden");
        ticking = false;
        return;
    }

    const currentScrollY = window.scrollY;

    if (currentScrollY <= 10) {
        header.classList.remove("header-hidden");
    } else if (currentScrollY > lastScrollY) {
        header.classList.add("header-hidden");
    } else if (currentScrollY < lastScrollY) {
        header.classList.remove("header-hidden");
    }

    lastScrollY = currentScrollY;
    ticking = false;
}


window.addEventListener(
    "scroll",
    () => {

        if (!ticking) {
            window.requestAnimationFrame(updateHeader);
            ticking = true;
        }

    },
    { passive: true }
);


/* ---- Lock Page Scroll ---- */

function lockPageScroll() {

    savedScrollY = window.scrollY;

    document.body.style.position = "fixed";
    document.body.style.top = `-${savedScrollY}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.width = "100%";
    document.body.style.overflow = "hidden";
}


/* ---- Unlock Page Scroll ---- */

function unlockPageScroll() {

    document.body.style.position = "";
    document.body.style.top = "";
    document.body.style.left = "";
    document.body.style.right = "";
    document.body.style.width = "";
    document.body.style.overflow = "";

    window.scrollTo(0, savedScrollY);

    lastScrollY = savedScrollY;
}


/* ---- Mobile Menu ---- */

function openMenu() {

    /* Keep header visible */
    header.classList.remove("header-hidden");

    /* Lock the page at its current position */
    lockPageScroll();

    mobileMenu.classList.add("active");
    menuToggle.classList.add("active");

    menuToggle.setAttribute("aria-expanded", "true");
    menuToggle.setAttribute("aria-label", "Close menu");

    mobileMenu.setAttribute("aria-hidden", "false");
}


function closeMenu() {

    /* Move focus out of the menu before hiding it */
    if (mobileMenu.contains(document.activeElement)) {
        menuToggle.focus();
    }

    mobileMenu.classList.remove("active");
    menuToggle.classList.remove("active");

    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open menu");

    mobileMenu.setAttribute("aria-hidden", "true");

    /* Restore normal page scrolling */
    unlockPageScroll();
}


/* ---- Menu Toggle ---- */

menuToggle.addEventListener("click", () => {

    if (mobileMenu.classList.contains("active")) {
        closeMenu();
    } else {
        openMenu();
    }

});


/* ---- Close Menu After Navigation ---- */

mobileMenuLinks.forEach((link) => {

    link.addEventListener("click", () => {
        closeMenu();
    });

});


/* ---- Close Menu With Escape ---- */

document.addEventListener("keydown", (event) => {

    if (
        event.key === "Escape" &&
        mobileMenu.classList.contains("active")
    ) {
        closeMenu();
    }

});


/* ---- Reset Menu When Returning To Desktop ---- */

window.addEventListener("resize", () => {

    if (
        window.innerWidth > 800 &&
        mobileMenu.classList.contains("active")
    ) {
        closeMenu();
    }

});
