const nav = document.querySelector(".main-nav");
const toggle = document.querySelector(".mobile-toggle");

if (toggle && nav) {
  toggle.addEventListener("click", () => {
    nav.classList.toggle("is-open");
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => nav.classList.remove("is-open"));
  });
}

const year = document.querySelector("[data-year]");
if (year) year.textContent = new Date().getFullYear();

document.querySelectorAll(".accordion-item > button").forEach((button) => {
  button.addEventListener("click", () => {
    const item = button.closest(".accordion-item");
    if (!item) return;
    item.classList.toggle("is-open");
  });
});

document.querySelectorAll(".ba-slider").forEach((slider) => {
  const input = slider.querySelector('input[type="range"]');
  if (!input) return;

  const update = (value) => {
    const position = Math.max(0, Math.min(100, Number(value)));
    slider.style.setProperty("--position", `${position}%`);
    input.value = position;
  };

  const updateFromPointer = (event) => {
    const rect = slider.getBoundingClientRect();
    const clientX = event.touches ? event.touches[0].clientX : event.clientX;
    update(((clientX - rect.left) / rect.width) * 100);
  };

  input.addEventListener("input", (event) => update(event.target.value));
  slider.addEventListener("pointerdown", (event) => {
    slider.setPointerCapture(event.pointerId);
    updateFromPointer(event);
  });
  slider.addEventListener("pointermove", (event) => {
    if (event.buttons !== 1) return;
    updateFromPointer(event);
  });
  slider.addEventListener("touchmove", (event) => {
    updateFromPointer(event);
  }, { passive: true });

  update(input.value || 50);
});
