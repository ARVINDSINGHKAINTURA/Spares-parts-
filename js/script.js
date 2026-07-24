const debounce = (fn, wait = 140) => {
let timeoutId = null;
return (...args) => {
if (timeoutId) window.clearTimeout(timeoutId);
timeoutId = window.setTimeout(() => fn(...args), wait);
};
};

(() => {
const hero = document.querySelector(".parts-hero");
if (!hero) return;

const slides = Array.from(hero.querySelectorAll(".parts-slide"));
const dots = Array.from(hero.querySelectorAll(".parts-dot"));
if (!slides.length) return;

let currentIndex = 0;
let intervalId = null;

const setSlide = (index) => {
currentIndex = index;
slides.forEach((slide, slideIndex) => {
const isActive = slideIndex === index;
slide.classList.toggle("is-active", isActive);
slide.setAttribute("aria-hidden", isActive ? "false" : "true");
});

dots.forEach((dot, dotIndex) => {
dot.classList.toggle("is-active", dotIndex === index);
});
};

const nextSlide = () => setSlide((currentIndex + 1) % slides.length);

const stopAutoplay = () => {
if (!intervalId) return;
window.clearInterval(intervalId);
intervalId = null;
};

const startAutoplay = () => {
if (intervalId) return;
intervalId = window.setInterval(nextSlide, 4200);
};

dots.forEach((dot, index) => {
dot.addEventListener("click", () => {
setSlide(index);
startAutoplay();
});
});

document.addEventListener("visibilitychange", () => {
if (document.hidden) {
stopAutoplay();
return;
}
startAutoplay();
});

setSlide(0);
startAutoplay();
})();

(() => {
const menuToggle = document.querySelector(".menu-toggle");
const mobileMenu = document.getElementById("mobileMenu");
if (!menuToggle || !mobileMenu) return;

const closeTriggers = mobileMenu.querySelectorAll("[data-close-mobile-menu]");
const menuLinks = mobileMenu.querySelectorAll("a");

const closeMenu = () => {
menuToggle.classList.remove("is-open");
menuToggle.setAttribute("aria-expanded", "false");
mobileMenu.classList.remove("is-open");
mobileMenu.setAttribute("aria-hidden", "true");
document.body.classList.remove("menu-open");
};

const openMenu = () => {
menuToggle.classList.add("is-open");
menuToggle.setAttribute("aria-expanded", "true");
mobileMenu.classList.add("is-open");
mobileMenu.setAttribute("aria-hidden", "false");
document.body.classList.add("menu-open");
};

menuToggle.addEventListener("click", () => {
if (mobileMenu.classList.contains("is-open")) {
closeMenu();
return;
}
openMenu();
});

closeTriggers.forEach((trigger) => trigger.addEventListener("click", closeMenu));
menuLinks.forEach((link) => link.addEventListener("click", closeMenu));

document.addEventListener("keydown", (event) => {
if (event.key === "Escape" && mobileMenu.classList.contains("is-open")) {
closeMenu();
}
});

window.addEventListener("resize", () => {
if (window.innerWidth > 980 && mobileMenu.classList.contains("is-open")) closeMenu();
});
})();

(() => {
const contentSection = document.querySelector(".content-section");
if (!contentSection) return;

const blocks = contentSection.querySelectorAll(".content-block");
if (!blocks.length) return;

const modal = document.createElement("div");
modal.className = "readmore-modal";
modal.setAttribute("aria-hidden", "true");
modal.innerHTML = `
<button class="readmore-backdrop" type="button" aria-label="Close details"></button>
<section class="readmore-card" role="dialog" aria-modal="true" aria-labelledby="readmoreCardTitle">
<header class="readmore-card-header">
<h2 id="readmoreCardTitle"></h2>
<button class="readmore-close" type="button" aria-label="Close">&times;</button>
</header>
<div class="readmore-card-body"></div>
</section>
`;
document.body.appendChild(modal);

const title = modal.querySelector("#readmoreCardTitle");
const body = modal.querySelector(".readmore-card-body");
const closeButton = modal.querySelector(".readmore-close");
const backdrop = modal.querySelector(".readmore-backdrop");

const closeCard = () => {
modal.classList.remove("is-open");
modal.setAttribute("aria-hidden", "true");
document.body.classList.remove("modal-open");
};

const openCardForBlock = (block) => {
const heading = block.querySelector("h2");
title.textContent = heading ? heading.textContent.trim() : "Details";

const clone = block.cloneNode(true);
const clonedHeading = clone.querySelector("h2");
if (clonedHeading) clonedHeading.remove();

const readMoreButton = clone.querySelector(".block-read-more");
if (readMoreButton) readMoreButton.remove();

clone.classList.remove("content-block-compact");
clone.querySelectorAll(".content-extra, .content-preview").forEach((node) => {
node.classList.remove("content-extra", "content-preview");
});

body.innerHTML = "";
body.appendChild(clone);

modal.classList.add("is-open");
modal.setAttribute("aria-hidden", "false");
document.body.classList.add("modal-open");
};

blocks.forEach((block) => {
const heading = block.querySelector("h2");
if (!heading) return;

const contentNodes = Array.from(block.children).filter((child) => child.tagName.toLowerCase() !== "h2");
if (!contentNodes.length) return;

block.classList.add("content-block-compact");
let previewSet = false;
contentNodes.forEach((node) => {
if (!previewSet && node.tagName.toLowerCase() === "p") {
node.classList.add("content-preview");
previewSet = true;
return;
}
node.classList.add("content-extra");
});

if (!previewSet) {
contentNodes[0].classList.remove("content-extra");
contentNodes[0].classList.add("content-preview");
}

const button = document.createElement("button");
button.type = "button";
button.className = "block-read-more";
button.innerHTML = `Read More <span aria-hidden="true">&#9662;</span>`;
button.addEventListener("click", () => openCardForBlock(block));
block.appendChild(button);
});

if (closeButton) closeButton.addEventListener("click", closeCard);
if (backdrop) backdrop.addEventListener("click", closeCard);

document.addEventListener("keydown", (event) => {
if (event.key === "Escape" && modal.classList.contains("is-open")) closeCard();
});
})();

(() => {
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const revealItems = document.querySelectorAll(".reveal");
if (!revealItems.length) return;

if (prefersReducedMotion || !("IntersectionObserver" in window)) {
revealItems.forEach((item) => item.classList.add("in-view"));
return;
}

const observer = new IntersectionObserver(
(entries, obs) => {
entries.forEach((entry) => {
if (!entry.isIntersecting) return;
entry.target.classList.add("in-view");
obs.unobserve(entry.target);
});
},
{
root: null,
rootMargin: "0px 0px -10% 0px",
threshold: 0.18,
}
);

revealItems.forEach((item) => observer.observe(item));
})();

(() => {
const cards = Array.from(document.querySelectorAll(".service-card"));
if (!cards.length) return;

const touchLikeDevice = window.matchMedia("(hover: none), (pointer: coarse)");
const shouldUseTapFlip = () => window.innerWidth <= 980 || touchLikeDevice.matches;

const closeOthers = (activeCard) => {
cards.forEach((card) => {
if (card !== activeCard) {
card.classList.remove("is-flipped");
card.setAttribute("aria-pressed", "false");
}
});
};

cards.forEach((card) => {
card.setAttribute("tabindex", "0");
card.setAttribute("role", "button");
card.setAttribute("aria-label", "Tap to flip card");
card.setAttribute("aria-pressed", "false");

card.addEventListener("click", (event) => {
if (!shouldUseTapFlip()) return;

const isLink = event.target.closest("a, button");
if (isLink) return;

const nextState = !card.classList.contains("is-flipped");
closeOthers(card);
card.classList.toggle("is-flipped", nextState);
card.setAttribute("aria-pressed", nextState ? "true" : "false");
});

card.addEventListener("keydown", (event) => {
if (!shouldUseTapFlip()) return;
if (event.key !== "Enter" && event.key !== " ") return;

event.preventDefault();
const nextState = !card.classList.contains("is-flipped");
closeOthers(card);
card.classList.toggle("is-flipped", nextState);
card.setAttribute("aria-pressed", nextState ? "true" : "false");
});
});

document.addEventListener("click", (event) => {
if (!shouldUseTapFlip()) return;
if (event.target.closest(".service-card")) return;

cards.forEach((card) => {
card.classList.remove("is-flipped");
card.setAttribute("aria-pressed", "false");
});
});

window.addEventListener("resize", () => {
if (shouldUseTapFlip()) return;

cards.forEach((card) => {
card.classList.remove("is-flipped");
card.setAttribute("aria-pressed", "false");
});
});
})();

(() => {
const modal = document.getElementById("enquiryModal");
if (!modal) return;

const modalSeenKey = "xyzEnquiryModalSeen";
const closeTriggers = modal.querySelectorAll("[data-close-modal]");
const openTriggers = document.querySelectorAll("[data-open-modal]");
const form = document.getElementById("enquiryForm");

const openModal = () => {
modal.classList.add("is-open");
modal.setAttribute("aria-hidden", "false");
document.body.classList.add("modal-open");
};

const closeModal = () => {
modal.classList.remove("is-open");
modal.setAttribute("aria-hidden", "true");
document.body.classList.remove("modal-open");
};

closeTriggers.forEach((trigger) => trigger.addEventListener("click", closeModal));
openTriggers.forEach((trigger) => {
trigger.addEventListener("click", (event) => {
event.preventDefault();
openModal();
});
});

document.addEventListener("keydown", (event) => {
if (event.key === "Escape" && modal.classList.contains("is-open")) closeModal();
});

if (form) {
form.addEventListener("submit", (event) => {
event.preventDefault();
closeModal();
});
}

window.addEventListener("load", () => {
let hasSeenModal = false;
try {
hasSeenModal = window.localStorage.getItem(modalSeenKey) === "1";
} catch (_error) {
hasSeenModal = false;
}

if (hasSeenModal) return;

try {
window.localStorage.setItem(modalSeenKey, "1");
} catch (_error) {
// Ignore storage errors and still show once for this load.
}

window.setTimeout(openModal, 120);
});
})();

(() => {
const insightsSection = document.querySelector(".insights-section");
if (!insightsSection) return;

const slider = insightsSection.querySelector(".insights-slider");
const viewport = insightsSection.querySelector(".insights-viewport");
const track = insightsSection.querySelector(".insights-track");
const prevButton = insightsSection.querySelector(".insights-nav-prev");
const nextButton = insightsSection.querySelector(".insights-nav-next");
const dotsWrap = insightsSection.querySelector(".insights-dots");
const baseCards = Array.from(track ? track.querySelectorAll(".insight-card") : []);

if (!slider || !viewport || !track || !prevButton || !nextButton || !dotsWrap || baseCards.length < 2) return;

if (window.matchMedia("(max-width: 980px)").matches) {
prevButton.hidden = true;
nextButton.hidden = true;
dotsWrap.hidden = true;
viewport.classList.add("mobile-snap-viewport");
track.classList.add("mobile-snap-track");
track.style.transform = "none";
return;
}

const totalCards = baseCards.length;
let step = 0;
let visibleCards = 1;
let loopOffset = 1;
let currentIndex = 1;
let logicalIndex = 0;
let currentOffset = 0;
let autoplayId = null;
let dots = [];
let isPointerDown = false;
let pointerId = null;
let startX = 0;
let startY = 0;
let startOffset = 0;
let isDraggingTrack = false;

const normalize = (value) => {
const mod = value % totalCards;
return mod < 0 ? mod + totalCards : mod;
};

const setTrackOffset = (px) => {
currentOffset = px;
track.style.transform = `translate3d(${px}px, 0, 0)`;
};

const updateDots = () => {
dots.forEach((dot, i) => {
const active = i === logicalIndex;
dot.classList.toggle("is-active", active);
dot.setAttribute("aria-current", active ? "true" : "false");
});
};

const moveTo = (index, animate = true) => {
currentIndex = index;
logicalIndex = normalize(currentIndex - loopOffset);
track.classList.toggle("is-dragging", !animate);
setTrackOffset(-(currentIndex * step));
updateDots();
if (!animate) {
window.requestAnimationFrame(() => track.classList.remove("is-dragging"));
}
};

const clearClones = () => {
track.querySelectorAll('[data-clone="true"]').forEach((node) => node.remove());
};

const rebuildTrack = () => {
clearClones();
for (let i = 0; i < loopOffset; i += 1) {
const pre = baseCards[totalCards - loopOffset + i].cloneNode(true);
pre.setAttribute("data-clone", "true");
track.insertBefore(pre, track.firstChild);
}
for (let i = 0; i < loopOffset; i += 1) {
const post = baseCards[i].cloneNode(true);
post.setAttribute("data-clone", "true");
track.appendChild(post);
}
};

const buildDots = () => {
dotsWrap.innerHTML = "";
dots = [];
for (let i = 0; i < totalCards; i += 1) {
const dot = document.createElement("button");
dot.type = "button";
dot.className = "insights-dot";
dot.setAttribute("aria-label", `Go to slide ${i + 1}`);
dot.addEventListener("click", () => {
moveTo(loopOffset + i);
startAutoplay();
});
dotsWrap.appendChild(dot);
dots.push(dot);
}
dotsWrap.hidden = totalCards <= 1;
};

const recalc = () => {
const cardRect = baseCards[0].getBoundingClientRect();
const computedTrack = window.getComputedStyle(track);
const gap = Number.parseFloat(computedTrack.columnGap || computedTrack.gap || "0") || 0;
step = cardRect.width + gap;
visibleCards = Math.max(1, Math.floor((viewport.clientWidth + gap) / step));
loopOffset = Math.min(visibleCards, totalCards);
rebuildTrack();
buildDots();
moveTo(loopOffset + logicalIndex, false);
};

const goNext = () => moveTo(currentIndex + 1);
const goPrev = () => moveTo(currentIndex - 1);

const stopAutoplay = () => {
if (!autoplayId) return;
window.clearInterval(autoplayId);
autoplayId = null;
};

const startAutoplay = () => {
if (autoplayId || totalCards <= 1) return;
autoplayId = window.setInterval(goNext, 3800);
};

track.addEventListener("transitionend", () => {
if (currentIndex >= loopOffset + totalCards) {
moveTo(currentIndex - totalCards, false);
return;
}
if (currentIndex < loopOffset) {
moveTo(currentIndex + totalCards, false);
}
});

prevButton.addEventListener("click", () => {
goPrev();
startAutoplay();
});

nextButton.addEventListener("click", () => {
goNext();
startAutoplay();
});

viewport.addEventListener("pointerdown", (event) => {
if (event.pointerType === "mouse" && event.button !== 0) return;
isPointerDown = true;
isDraggingTrack = false;
pointerId = event.pointerId;
startX = event.clientX;
startY = event.clientY;
startOffset = currentOffset;
});

viewport.addEventListener("pointermove", (event) => {
if (!isPointerDown) return;
const deltaX = event.clientX - startX;
const deltaY = event.clientY - startY;

if (!isDraggingTrack) {
if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > 8) {
isPointerDown = false;
pointerId = null;
startAutoplay();
return;
}

if (Math.abs(deltaX) <= 8) return;

isDraggingTrack = true;
viewport.classList.add("is-dragging");
track.classList.add("is-dragging");
if (pointerId !== null) viewport.setPointerCapture(pointerId);
stopAutoplay();
}

setTrackOffset(startOffset + deltaX);
});

const endDrag = (event) => {
if (!isPointerDown && !isDraggingTrack) return;
isPointerDown = false;
const hadHorizontalDrag = isDraggingTrack;
isDraggingTrack = false;
viewport.classList.remove("is-dragging");
track.classList.remove("is-dragging");
try {
if (pointerId !== null) viewport.releasePointerCapture(pointerId);
} catch (_error) {
// Ignore if pointer capture is already released.
}
pointerId = null;

if (!hadHorizontalDrag) {
startAutoplay();
return;
}

const movedBy = event.clientX - startX;
const threshold = Math.max(50, step * 0.18);
if (movedBy <= -threshold) goNext();
else if (movedBy >= threshold) goPrev();
else moveTo(currentIndex);

startAutoplay();
};

viewport.addEventListener("pointerup", endDrag);
viewport.addEventListener("pointercancel", endDrag);

viewport.addEventListener("mouseenter", stopAutoplay);
viewport.addEventListener("mouseleave", startAutoplay);
viewport.addEventListener("focusin", stopAutoplay);
viewport.addEventListener("focusout", startAutoplay);

viewport.addEventListener("keydown", (event) => {
if (event.key === "ArrowRight") {
event.preventDefault();
goNext();
startAutoplay();
}
if (event.key === "ArrowLeft") {
event.preventDefault();
goPrev();
startAutoplay();
}
});

window.addEventListener("resize", debounce(() => {
  if (window.__prodPagination && typeof window.__prodPagination.refresh === "function") {
    window.__prodPagination.refresh();
  }
}, 180));

document.addEventListener("visibilitychange", () => {
if (document.hidden) {
stopAutoplay();
return;
}
startAutoplay();
});

recalc();
startAutoplay();
})();

(() => {
  const cardsGrid = document.querySelector(".prod-cards-grid");
  const paginationContainer = document.querySelector(".prod-pagination");
  const resultsCount = document.querySelector(".prod-results-count");
  if (!cardsGrid || !paginationContainer || !resultsCount) return;

  const PAGE_SIZE = 8;
  let currentPage = 1;

  const getCards = () => Array.from(cardsGrid.querySelectorAll(".prod-part-card"));

  const buildPagination = (totalPages) => {
    paginationContainer.innerHTML = "";
    if (totalPages <= 1) {
      paginationContainer.style.display = "none";
      return;
    }

    paginationContainer.style.display = "flex";

    const createButton = (pageNumber) => {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = `${pageNumber}`;
      button.dataset.page = String(pageNumber);
      if (pageNumber === currentPage) {
        button.classList.add("is-active");
        button.setAttribute("aria-current", "page");
        button.disabled = true;
      }
      button.addEventListener("click", () => renderPage(pageNumber));
      return button;
    };

    if (currentPage > 1) {
      const prev = document.createElement("button");
      prev.type = "button";
      prev.textContent = "←";
      prev.addEventListener("click", () => renderPage(currentPage - 1));
      paginationContainer.appendChild(prev);
    }

    for (let i = 1; i <= totalPages; i += 1) {
      paginationContainer.appendChild(createButton(i));
    }

    if (currentPage < totalPages) {
      const next = document.createElement("button");
      next.type = "button";
      next.textContent = "→";
      next.addEventListener("click", () => renderPage(currentPage + 1));
      paginationContainer.appendChild(next);
    }
  };

  const renderPage = (page = currentPage) => {
    const cards = getCards();
    const totalItems = cards.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));

    currentPage = Math.min(Math.max(page, 1), totalPages);
    const start = (currentPage - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;

    cards.forEach((card, index) => {
      card.style.display = index >= start && index < end ? "" : "none";
    });

    const visibleItems = Math.min(PAGE_SIZE, Math.max(0, totalItems - start));
    resultsCount.innerHTML = `<span>${visibleItems}</span> of ${totalItems} results`;

    buildPagination(totalPages);

    window.__prodPagination = {
      currentPage,
      totalPages,
      renderPage,
      refresh: () => renderPage(currentPage),
    };
  };

  const refreshPagination = () => renderPage(currentPage);

  document.addEventListener("DOMContentLoaded", () => renderPage(1));

  let pendingRefresh = false;
  const scheduleRefresh = () => {
    if (pendingRefresh) return;
    pendingRefresh = true;
    window.requestAnimationFrame(() => {
      pendingRefresh = false;
      renderPage(1);
    });
  };

  const observer = new MutationObserver((mutations) => {
    let dirty = false;
    for (const mutation of mutations) {
      if (mutation.type === "childList" && (mutation.addedNodes.length > 0 || mutation.removedNodes.length > 0)) {
        dirty = true;
        break;
      }
    }
    if (dirty) {
      scheduleRefresh();
    }
  });

  observer.observe(cardsGrid, {
    childList: true,
    subtree: false,
  });

  window.addEventListener("resize", debounce(() => {
    if (window.__prodPagination && typeof window.__prodPagination.refresh === "function") {
      window.__prodPagination.refresh();
    }
  }, 180));
})();

// Search functionality for part number queries
(() => {
const urlParams = new URLSearchParams(window.location.search);
const partNumber = urlParams.get('part');

if (!partNumber) return;

// Display search results section
const contactSection = document.querySelector('.support-section');
if (!contactSection) return;

const searchResultsSection = document.createElement('section');
searchResultsSection.className = 'search-results-section reveal';
searchResultsSection.setAttribute('data-animate', 'up');
searchResultsSection.innerHTML = `
<div class="search-results-header">
<h2>Search Results for Part: "${partNumber}"</h2>
<p>We received your part number search. Our team will check availability and get back to you within 2 hours during business hours.</p>
<div class="search-results-actions">
<a href="mailto:sales@simhasupply.com?subject=Part Inquiry: ${encodeURIComponent(partNumber)}" class="search-results-btn primary">Email Inquiry</a>
<a href="tel:+6563189251" class="search-results-btn secondary">Call Now</a>
</div>
</div>
`;

// Insert after the hero section but before the support section
const heroSection = document.querySelector('.parts-hero');
if (heroSection) {
heroSection.insertAdjacentElement('afterend', searchResultsSection);
}

// Pre-fill the contact form with the part number
const contactForm = document.querySelector('.contact-page-form');
if (contactForm) {
const messageTextarea = contactForm.querySelector('textarea[name="message"]');
if (messageTextarea && !messageTextarea.value) {
messageTextarea.value = `Part Number: ${partNumber}\n\nPlease provide availability, pricing, and lead time.`;
}
}

// Pre-fill search forms with the part number for consistency
const searchInputs = document.querySelectorAll('input[name="part"]');
searchInputs.forEach(input => {
if (!input.value) {
input.value = partNumber;
}
});
})();
// Product filtering functionality for brand pages
(() => {
const filterForm = document.querySelector('[data-filter-form]');
if (!filterForm) return;

const searchInput = filterForm.querySelector('input[name="part"]');
const searchButton = filterForm.querySelector('button');
const resultsCount = document.querySelector('.prod-results-count');
const resultsSpan = resultsCount ? resultsCount.querySelector('span') : null;
const cardsGrid = document.querySelector('.prod-cards-grid');
const cards = cardsGrid ? Array.from(cardsGrid.querySelectorAll('.prod-part-card')) : [];
const pagination = document.querySelector('.prod-pagination');

if (!searchInput || !cardsGrid || !cards.length) return;

let currentFilter = '';
const totalResults = () => document.querySelectorAll('.prod-part-card').length;

const updateResults = (visibleCount) => {
if (resultsSpan) {
resultsSpan.textContent = visibleCount;
}
if (resultsCount) {
resultsCount.innerHTML = `<span>${visibleCount}</span> of ${totalResults()} results`;
}
};

const filterCards = (searchTerm) => {
currentFilter = searchTerm.toLowerCase().trim();

// When no filter is active, defer to pagination view
if (!currentFilter) {
  if (window.__prodPagination && typeof window.__prodPagination.renderPage === 'function') {
    window.__prodPagination.renderPage(window.__prodPagination.currentPage || 1);
  }

  if (pagination) {
    pagination.style.display = window.__prodPagination && window.__prodPagination.totalPages > 1 ? '' : 'none';
  }

  return;
}

let visibleCount = 0;

// Get current cards (including dynamically added ones)
const currentCards = cardsGrid ? Array.from(cardsGrid.querySelectorAll('.prod-part-card')) : [];

currentCards.forEach(card => {
const partNumber = card.querySelector('h3')?.textContent?.toLowerCase() || '';
const isVisible = partNumber.includes(currentFilter);
card.style.display = isVisible ? '' : 'none';
if (isVisible) visibleCount++;
});

// Hide pagination if filtering is active
if (pagination) {
pagination.style.display = 'none';
}

// Show "no results" message if no matches found
let noResultsMsg = cardsGrid.querySelector('.no-results-message');
if (currentFilter && visibleCount === 0) {
if (!noResultsMsg) {
noResultsMsg = document.createElement('div');
noResultsMsg.className = 'no-results-message';
noResultsMsg.innerHTML = `
<div style="text-align: center; padding: 2rem; grid-column: 1 / -1;">
<h3 style="color: #4f6577; margin-bottom: 0.5rem;">No parts found</h3>
<p style="color: #6b7c8d; margin: 0;">Try a different search term or <a href="contact.html" style="color: var(--orange);">contact us</a> for assistance.</p>
</div>
`;
cardsGrid.appendChild(noResultsMsg);
}
} else if (noResultsMsg) {
noResultsMsg.remove();
}

updateResults(visibleCount);
};

// Initial state
filterCards('');
const initialCards = cardsGrid ? Array.from(cardsGrid.querySelectorAll('.prod-part-card')) : [];
updateResults(initialCards.length);

// Handle search input
const handleSearch = () => {
const searchTerm = searchInput.value;
filterCards(searchTerm);
};

// Search on input (real-time filtering)
searchInput.addEventListener('input', handleSearch);

// Search on button click
if (searchButton) {
searchButton.addEventListener('click', handleSearch);
}

// Search on Enter key
searchInput.addEventListener('keydown', (event) => {
if (event.key === 'Enter') {
event.preventDefault();
handleSearch();
}
});

// Admin functionality for adding product cards
const initAdminInterface = () => {
const adminLoginBtn = document.createElement('button');
adminLoginBtn.textContent = 'Admin Login';
adminLoginBtn.className = 'admin-login-btn';
adminLoginBtn.style.cssText = `
position: fixed;
bottom: 20px;
right: 20px;
background: var(--orange);
color: white;
border: none;
padding: 10px 15px;
border-radius: 8px;
cursor: pointer;
font-weight: 600;
z-index: 1000;
box-shadow: 0 4px 12px rgba(243, 115, 33, 0.3);
`;

adminLoginBtn.addEventListener('click', showAdminLogin);
document.body.appendChild(adminLoginBtn);

// Check if user is already logged in
const isLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';
if (isLoggedIn) {
showAdminInterface();
}
};

const showAdminLogin = () => {
const modal = document.createElement('div');
modal.className = 'admin-modal';
modal.innerHTML = `
<div class="admin-modal-backdrop"></div>
<div class="admin-modal-content">
<h3>Admin Login</h3>
<form class="admin-login-form">
<input type="text" placeholder="Username" required>
<input type="password" placeholder="Password" required>
<button type="submit">Login</button>
<button type="button" class="cancel-btn">Cancel</button>
</form>
</div>
`;

document.body.appendChild(modal);

const form = modal.querySelector('.admin-login-form');
const cancelBtn = modal.querySelector('.cancel-btn');

form.addEventListener('submit', (e) => {
e.preventDefault();
const username = form.querySelector('input[type="text"]').value;
const password = form.querySelector('input[type="password"]').value;

// Simple authentication (you should use proper authentication in production)
if (username === 'admin' && password === 'admin123') {
localStorage.setItem('adminLoggedIn', 'true');
document.body.removeChild(modal);
showAdminInterface();
} else {
alert('Invalid credentials');
}
});

cancelBtn.addEventListener('click', () => {
document.body.removeChild(modal);
});

modal.querySelector('.admin-modal-backdrop').addEventListener('click', () => {
document.body.removeChild(modal);
});
};

const showAdminInterface = () => {
// Hide login button
const loginBtn = document.querySelector('.admin-login-btn');
if (loginBtn) loginBtn.style.display = 'none';

// Add delete buttons to existing cards
addDeleteButtonsToExistingCards();

// Add logout button
const logoutBtn = document.createElement('button');
logoutBtn.textContent = 'Logout';
logoutBtn.className = 'admin-logout-btn';
logoutBtn.style.cssText = `
position: fixed;
bottom: 20px;
right: 20px;
background: #dc3545;
color: white;
border: none;
padding: 10px 15px;
border-radius: 8px;
cursor: pointer;
font-weight: 600;
z-index: 1000;
box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
`;
logoutBtn.addEventListener('click', () => {
localStorage.removeItem('adminLoggedIn');
location.reload();
});
document.body.appendChild(logoutBtn);

// Add admin panel
const adminPanel = document.createElement('div');
adminPanel.className = 'admin-panel';
adminPanel.innerHTML = `
<div class="admin-panel-header">
<h3>Add New Product Card</h3>
<button class="admin-panel-close" title="Close">&times;</button>
</div>
<form class="admin-add-card-form">
<div class="form-group">
<label>Part Number:</label>
<input type="text" name="partNumber" required>
</div>
<div class="form-group">
<label>Brand:</label>
<input type="text" name="brand" required>
</div>
<div class="form-group">
<label>Availability:</label>
<select name="availability">
<option value="Enquire">Enquire</option>
<option value="In Stock">In Stock</option>
<option value="Limited Stock">Limited Stock</option>
<option value="Out of Stock">Out of Stock</option>
</select>
</div>
<div class="form-group">
<label>Features (one per line):</label>
<textarea name="features" rows="3" placeholder="12-month warranty
Dispatch immediately
Delivery worldwide"></textarea>
</div>
<button type="submit">Add Card</button>
</form>
<div class="admin-cards-list">
<h4>Manage Existing Cards</h4>
<div class="cards-list"></div>
</div>
`;

document.body.appendChild(adminPanel);

// Add close button functionality
const closeBtn = adminPanel.querySelector('.admin-panel-close');
closeBtn.addEventListener('click', () => {
document.body.removeChild(adminPanel);
});

// Load existing cards
loadAdminCards();

// Handle form submission
const form = adminPanel.querySelector('.admin-add-card-form');
form.addEventListener('submit', (e) => {
e.preventDefault();

const formData = new FormData(form);
const cardData = {
id: Date.now().toString(),
partNumber: formData.get('partNumber'),
brand: formData.get('brand'),
availability: formData.get('availability'),
features: formData.get('features').split('\n').filter(f => f.trim())
};

// Save to localStorage
saveCard(cardData);

// Add to grid
addCardToGrid(cardData);

// Reset form
form.reset();

// Reload admin cards list
loadAdminCards();
});
};

const saveCard = (cardData) => {
const brand = window.location.pathname.split('/').pop().replace('.html', '');
const storageKey = `cards_${brand}`;
let cards = JSON.parse(localStorage.getItem(storageKey) || '[]');
cards.push(cardData);
localStorage.setItem(storageKey, JSON.stringify(cards));
};

const loadCards = () => {
const brand = window.location.pathname.split('/').pop().replace('.html', '');
const storageKey = `cards_${brand}`;
return JSON.parse(localStorage.getItem(storageKey) || '[]');
};

const addCardToGrid = (cardData) => {
const grid = document.querySelector('.prod-cards-grid');
if (!grid) return;

const card = document.createElement('article');
card.className = 'prod-part-card reveal admin-card';
card.setAttribute('data-card-id', cardData.id);

// Add delete button for admin cards
const isLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';
const deleteButton = isLoggedIn ? '<button class="card-delete-btn" data-card-id="' + cardData.id + '" title="Delete card">×</button>' : '';

card.innerHTML = `
${deleteButton}
<h3>${cardData.partNumber}</h3>
<h4>${cardData.brand}</h4>
<p>Availability: ${cardData.availability}</p>
<ul>
${cardData.features.map(feature => `<li>${feature.trim()}</li>`).join('')}
</ul>
<a href="contact.html">Get a Quote</a>
`;

grid.appendChild(card);

// Rebuild pagination after new card insertion
if (window.__prodPagination && typeof window.__prodPagination.refresh === 'function') {
  window.__prodPagination.refresh();
}

// Add delete event listener if logged in
if (isLoggedIn) {
const deleteBtn = card.querySelector('.card-delete-btn');
if (deleteBtn) {
deleteBtn.addEventListener('click', (e) => {
e.preventDefault();
e.stopPropagation();
const cardId = e.target.getAttribute('data-card-id');
if (confirm('Are you sure you want to delete this card?')) {
deleteCard(cardId);
loadAdminCards(); // Refresh admin panel
}
});
}
}
};

const loadAdminCards = () => {
const cardsList = document.querySelector('.cards-list');
if (!cardsList) return;

const cards = loadCards();
cardsList.innerHTML = '';

cards.forEach(card => {
const cardItem = document.createElement('div');
cardItem.className = 'admin-card-item';
cardItem.innerHTML = `
<div class="card-info">
<strong>${card.partNumber}</strong> - ${card.brand} (${card.availability})
</div>
<button class="delete-card-btn" data-card-id="${card.id}">Delete</button>
`;
cardsList.appendChild(cardItem);
});

// Add delete event listeners
document.querySelectorAll('.delete-card-btn').forEach(btn => {
btn.addEventListener('click', (e) => {
const cardId = e.target.getAttribute('data-card-id');
deleteCard(cardId);
loadAdminCards();
});
});
};

const deleteCard = (cardId) => {
const brand = window.location.pathname.split('/').pop().replace('.html', '');
const storageKey = `cards_${brand}`;
let cards = JSON.parse(localStorage.getItem(storageKey) || '[]');
cards = cards.filter(card => card.id !== cardId);
localStorage.setItem(storageKey, JSON.stringify(cards));

// Remove from grid
const cardElement = document.querySelector(`[data-card-id="${cardId}"]`);
if (cardElement) {
cardElement.remove();
}

  if (window.__prodPagination && typeof window.__prodPagination.refresh === 'function') {
    window.__prodPagination.refresh();
  }
};

const savedCards = loadCards();
savedCards.forEach(card => addCardToGrid(card));

// Add delete buttons to existing admin cards when logging in
const addDeleteButtonsToExistingCards = () => {
const allCards = document.querySelectorAll('.prod-part-card');
allCards.forEach(card => {
if (!card.querySelector('.card-delete-btn')) {
const cardId = card.getAttribute('data-card-id');
const partNumber = card.querySelector('h3')?.textContent?.trim();

const deleteButton = document.createElement('button');
deleteButton.className = 'card-delete-btn';
if (cardId) {
deleteButton.setAttribute('data-card-id', cardId);
} else if (partNumber) {
deleteButton.setAttribute('data-part-number', partNumber);
}
deleteButton.title = 'Delete card';
deleteButton.textContent = '×';
card.insertBefore(deleteButton, card.firstChild);

deleteButton.addEventListener('click', (e) => {
e.preventDefault();
e.stopPropagation();
if (confirm('Are you sure you want to delete this card?')) {
card.remove();
// Also remove from localStorage if it's an admin card
if (cardId) {
deleteCard(cardId);
loadAdminCards(); // Refresh admin panel
}
}
});
}
});
};

// Initialize admin interface
const currentPage = window.location.pathname.split('/').pop();
const brandPages = ['abb.html', 'fanuc.html', 'siemens.html', 'mitsubishi.html', 'schneider.html', 'indramat.html', 'br.html'];

if (brandPages.includes(currentPage)) {
if ("requestIdleCallback" in window) {
window.requestIdleCallback(initAdminInterface, { timeout: 1200 });
} else {
window.setTimeout(initAdminInterface, 500);
}
}

})();

(() => {
const images = Array.from(document.querySelectorAll("img"));
if (!images.length) return;

images.forEach((img, index) => {
const isHeroPrimary = Boolean(img.closest(".parts-hero .parts-slide.is-active, .parts-hero .parts-slide:first-child"));
const isLogo = img.classList.contains("aa-brand-logo") || img.classList.contains("aa-mobile-panel-logo");
const isCritical = isHeroPrimary || isLogo || index === 0;

if (!img.hasAttribute("decoding")) img.decoding = "async";

if (!isCritical && !img.hasAttribute("loading")) {
img.loading = "lazy";
img.fetchPriority = "low";
}
});
})();

(() => {
if (document.querySelector(".wa-float-left")) return;

const waButton = document.createElement("a");
waButton.className = "wa-float-left";
waButton.href = "https://wa.me/6583619135?text=Hello%20Simha%20Automation%2C%20I%20need%20support.";
waButton.target = "_blank";
waButton.rel = "noopener noreferrer";
waButton.setAttribute("aria-label", "Chat with us on WhatsApp");
waButton.title = "WhatsApp";
waButton.innerHTML = `
<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
<path d="M19.05 4.94A9.84 9.84 0 0 0 12.03 2C6.59 2 2.17 6.42 2.17 11.86c0 1.74.46 3.44 1.32 4.93L2 22l5.36-1.4a9.86 9.86 0 0 0 4.67 1.19h.01c5.44 0 9.86-4.42 9.86-9.86a9.8 9.8 0 0 0-2.85-6.99Zm-7.02 15.17h-.01a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.18.83.85-3.1-.2-.32a8.2 8.2 0 0 1-1.27-4.33c0-4.52 3.68-8.2 8.21-8.2 2.2 0 4.26.85 5.82 2.41a8.15 8.15 0 0 1 2.4 5.81c0 4.53-3.68 8.22-8.2 8.22Zm4.5-6.15c-.25-.13-1.49-.73-1.72-.81-.23-.08-.4-.13-.57.13-.17.25-.65.8-.8.97-.15.17-.3.19-.55.07-.25-.13-1.06-.39-2.01-1.25-.74-.66-1.25-1.48-1.39-1.73-.14-.25-.01-.38.1-.51.11-.11.25-.29.38-.43.13-.14.17-.25.25-.42.08-.16.04-.31-.02-.43-.06-.12-.51-1.23-.7-1.69-.18-.43-.37-.38-.51-.38h-.49c-.16 0-.44.06-.66.31-.23.25-.87.85-.87 2.08 0 1.23.89 2.42 1.01 2.58.12.16 1.76 2.69 4.26 3.77.6.26 1.06.42 1.42.53.6.19 1.15.16 1.59.1.49-.07 1.49-.6 1.7-1.18.21-.58.21-1.08.15-1.18-.06-.1-.23-.17-.48-.3Z"></path>
</svg>
`;

document.body.appendChild(waButton);
})();