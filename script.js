(function () {
  const header = document.getElementById("header");
  const burger = document.getElementById("burger");
  const nav = document.getElementById("nav");

  if (header) {
    function onScroll() {
      if (header.classList.contains("header--solid")) return;
      header.classList.toggle("header--scrolled", window.scrollY > 40);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  if (burger && nav) {
    burger.addEventListener("click", () => {
      const open = nav.classList.toggle("nav--open");
      burger.classList.toggle("burger--open", open);
      burger.setAttribute("aria-expanded", String(open));
      document.body.style.overflow = open ? "hidden" : "";
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("nav--open");
        burger.classList.remove("burger--open");
        burger.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      });
    });
  }

  const revealSelectors = [
    ".section__head",
    ".compare__inner",
    ".compare__col",
    ".story-preview__photo",
    ".story-preview__text",
    ".why-me__item",
    ".savings-card",
    ".video-block__wrap",
    ".cta-block__inner",
    ".feature-card",
    ".member-benefit",
    ".platform-showcase__item",
    ".real-booking",
    ".gallery-collage",
    ".gallery-grid__item",
    ".blog-card",
    ".blog-hero__content",
    ".blog-post__head",
    ".blog-prose",
    ".story-card",
    ".videos-grid__item",
    ".quote-section__text",
    ".help-list__item",
    ".about-story__video",
    ".about-story__subtitle",
    ".about-story__pullquote",
    ".about-help__intro",
    ".about-help__outro",
    ".access-page__info",
    ".access-form",
  ];

  const revealEls = document.querySelectorAll(revealSelectors.join(", "));
  revealEls.forEach((el) => el.classList.add("reveal"));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );
  revealEls.forEach((el) => observer.observe(el));

  function formatPhone(value) {
    let v = value.replace(/\D/g, "");
    if (v.startsWith("8")) v = "7" + v.slice(1);
    if (!v.startsWith("7") && v.length) v = "7" + v;

    let formatted = "";
    if (v.length > 0) formatted = "+7";
    if (v.length > 1) formatted += " (" + v.slice(1, 4);
    if (v.length >= 4) formatted += ") " + v.slice(4, 7);
    if (v.length >= 7) formatted += "-" + v.slice(7, 9);
    if (v.length >= 9) formatted += "-" + v.slice(9, 11);
    return formatted;
  }

  function setupPhoneMask(input) {
    if (!input) return;
    input.addEventListener("input", (e) => {
      e.target.value = formatPhone(e.target.value);
    });
  }

  function setupForm(formId, noteId, requiredFields) {
    const form = document.getElementById(formId);
    const formNote = document.getElementById(noteId);
    if (!form || !formNote) return;

    const phoneInput = form.querySelector('[name="phone"]');
    const whatsappInput = form.querySelector('[name="whatsapp"]');
    setupPhoneMask(phoneInput);
    setupPhoneMask(whatsappInput);

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      formNote.className = "form-note";
      formNote.textContent = "";

      let valid = true;

      requiredFields.forEach((field) => {
        const input = form[field];
        if (!input) return;
        input.classList.remove("error");
        const value = input.value.trim();
        if (!value || (field === "phone" && value.replace(/\D/g, "").length < 11)) {
          input.classList.add("error");
          valid = false;
        }
      });

      if (!valid) {
        formNote.className = "form-note error";
        formNote.textContent = "Заполните, пожалуйста, обязательные поля.";
        const firstError = form.querySelector(".error");
        if (firstError) firstError.focus();
        return;
      }

      formNote.className = "form-note success";
      formNote.textContent =
        "Спасибо! Заявка принята — мы свяжемся с вами и откроем гостевой доступ.";
      form.reset();
    });
  }

  setupForm("accessForm", "formNote", ["name", "phone"]);

  document.querySelectorAll(".video-clickable").forEach((el) => {
    const src = el.dataset.video;
    if (!src) return;

    const playBtn = el.querySelector(".video-clickable__play");

    const play = () => {
      if (el.querySelector(".video-clickable__player")) return;
      const video = document.createElement("video");
      video.src = src;
      video.controls = true;
      video.playsInline = true;
      video.autoplay = true;
      video.className = "video-clickable__player";
      video.setAttribute("title", "Elevation 2026, Анталия");
      el.innerHTML = "";
      el.appendChild(video);
      video.play().catch(() => {});
    };

    if (playBtn) playBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      play();
    });
    el.addEventListener("click", play);
  });

  document.querySelectorAll(".video-placeholder").forEach((placeholder) => {
    const playBtn = placeholder.querySelector(".video-placeholder__play");
    if (!playBtn) return;

    const handler = () => {
      const wrap = placeholder.closest(".video-block__player") || placeholder.parentElement;
      const iframe = document.createElement("iframe");
      iframe.src = "https://www.youtube.com/embed/JGwWNGJdvx8?autoplay=1&rel=0";
      iframe.title = "Видео Travel Advantage";
      iframe.allow =
        "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
      iframe.allowFullscreen = true;
      wrap.innerHTML = "";
      wrap.appendChild(iframe);
    };

    playBtn.addEventListener("click", handler);
    placeholder.addEventListener("click", (e) => {
      if (e.target !== playBtn) handler();
    });
  });
})();
