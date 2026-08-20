// ---------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------
const API_BASE_URL = "http://127.0.0.1:8000";

const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
).matches;

// ---------------------------------------------------------------
// Header scroll state
// ---------------------------------------------------------------
const header = document.getElementById("header");

function updateHeader() {
    if (window.scrollY > 40) {
        header.classList.add("scrolled");
    } else {
        header.classList.remove("scrolled");
    }
}

window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

// ---------------------------------------------------------------
// Mobile menu
// ---------------------------------------------------------------
const hamburger = document.getElementById("hamburger");
const mobileMenu = document.getElementById("mobileMenu");
const mmLinks = document.querySelectorAll(".mm-link");

function openMenu() {
    hamburger.classList.add("open");
    mobileMenu.classList.add("open");
    mobileMenu.removeAttribute("aria-hidden");
    hamburger.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
}

function closeMenu() {
    hamburger.classList.remove("open");
    mobileMenu.classList.remove("open");
    mobileMenu.setAttribute("aria-hidden", "true");
    hamburger.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
}

if (hamburger) {
    hamburger.addEventListener("click", () => {
        mobileMenu.classList.contains("open") ? closeMenu() : openMenu();
    });
}

mmLinks.forEach((link) => link.addEventListener("click", closeMenu));

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && mobileMenu.classList.contains("open")) {
        closeMenu();
        hamburger.focus();
    }
});

// ---------------------------------------------------------------
// Scroll reveal
// ---------------------------------------------------------------
const revealEls = document.querySelectorAll(".reveal");

if (prefersReducedMotion) {
    revealEls.forEach((el) => el.classList.add("visible"));
} else {
    const revealObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    revealObserver.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.12 }
    );
    revealEls.forEach((el) => revealObserver.observe(el));
}

// ---------------------------------------------------------------
// Hero headline staggered entrance
// ---------------------------------------------------------------
if (!prefersReducedMotion) {
    const lines = document.querySelectorAll(".hero .line");
    lines.forEach((line, i) => {
        line.style.opacity = "0";
        line.style.transform = "translateY(100%)";
        line.style.transition = `opacity 0.7s cubic-bezier(0.22,1,0.36,1) ${i * 0.12 + 0.1}s, transform 0.7s cubic-bezier(0.22,1,0.36,1) ${i * 0.12 + 0.1}s`;

        // Trigger after short paint delay
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                line.style.opacity = "1";
                line.style.transform = "translateY(0)";
            });
        });
    });

    // Fade in the rest of the hero intro
    const heroIntroChildren = document.querySelectorAll(
        ".hero-location, .hero-sub, .hero-actions"
    );
    heroIntroChildren.forEach((el, i) => {
        el.style.opacity = "0";
        el.style.transform = "translateY(14px)";
        el.style.transition = `opacity 0.7s cubic-bezier(0.22,1,0.36,1) ${i * 0.1 + 0.55}s, transform 0.7s cubic-bezier(0.22,1,0.36,1) ${i * 0.1 + 0.55}s`;

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                el.style.opacity = "1";
                el.style.transform = "translateY(0)";
            });
        });
    });
}

// ---------------------------------------------------------------
// Active nav link highlight on scroll
// ---------------------------------------------------------------
const sections = document.querySelectorAll("section[id], .hero[id]");
const navLinks = document.querySelectorAll(".nav-links a");

const sectionObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                navLinks.forEach((link) => {
                    const matches = link.getAttribute("href") === `#${id}`;
                    link.style.color = matches ? "var(--lime)" : "";
                });
            }
        });
    },
    { rootMargin: "-35% 0px -60% 0px" }
);

sections.forEach((s) => sectionObserver.observe(s));

// ---------------------------------------------------------------
// Contact form
// ---------------------------------------------------------------
const contactForm = document.getElementById("contactForm");
const submitBtn = document.getElementById("submitBtn");
const formStatus = document.getElementById("formStatus");

const nameInput = document.getElementById("nameInput");
const emailInput = document.getElementById("emailInput");
const messageInput = document.getElementById("messageInput");

const nameError = document.getElementById("nameError");
const emailError = document.getElementById("emailError");
const messageError = document.getElementById("messageError");

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function clearErrors() {
    nameError.textContent = "";
    emailError.textContent = "";
    messageError.textContent = "";
}

function validateForm() {
    clearErrors();
    let valid = true;

    if (!nameInput.value.trim()) {
        nameError.textContent = "Please enter your name.";
        valid = false;
    }
    if (!emailInput.value.trim()) {
        emailError.textContent = "Please enter your email.";
        valid = false;
    } else if (!EMAIL_PATTERN.test(emailInput.value.trim())) {
        emailError.textContent = "Please enter a valid email address.";
        valid = false;
    }
    if (!messageInput.value.trim()) {
        messageError.textContent = "Please enter a message.";
        valid = false;
    }
    return valid;
}

function setSubmitting(state) {
    submitBtn.disabled = state;
    submitBtn.querySelector(".btn-label").textContent = state
        ? "Sending…"
        : "Send Message";
}

function setStatus(msg, state) {
    formStatus.textContent = msg;
    formStatus.dataset.state = state || "";
}

if (contactForm) {
    contactForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        setStatus("", "");

        if (!validateForm()) return;

        setSubmitting(true);

        const payload = {
            name: nameInput.value.trim(),
            email: emailInput.value.trim(),
            message: messageInput.value.trim(),
        };

        try {
            const res = await fetch(`${API_BASE_URL}/api/contact`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error(`Status ${res.status}`);

            setStatus("Message sent — thanks for reaching out!", "success");
            contactForm.reset();
        } catch {
            setStatus(
                "Something went wrong. Please email me directly.",
                "error"
            );
        } finally {
            setSubmitting(false);
        }
    });
}

// ---------------------------------------------------------------
// Smooth anchor scroll (offset for fixed nav)
// ---------------------------------------------------------------
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
        const target = document.querySelector(anchor.getAttribute("href"));
        if (!target) return;
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: "smooth" });
    });
});