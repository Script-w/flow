const header = document.querySelector("[data-header]");
const menuButton = document.querySelector("[data-menu-toggle]");
const mobileMenu = document.querySelector("[data-mobile-menu]");
const heroVisual = document.querySelector("[data-hero-visual]");
const heroCardLink = document.querySelector(".hero-card-link");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

document.querySelectorAll("[data-current-year]").forEach((element) => {
  element.textContent = String(new Date().getFullYear());
});

const updateHeader = () => header?.classList.toggle("is-scrolled", window.scrollY > 16);
updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

menuButton?.addEventListener("click", () => {
  const isOpen = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!isOpen));
  mobileMenu.hidden = isOpen;
});

mobileMenu?.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    menuButton.setAttribute("aria-expanded", "false");
    mobileMenu.hidden = true;
  }
});

const staggerGroups = [
  [".hero [data-reveal]", 120],
  [".service-card[data-reveal]", 110],
  [".process-grid li[data-reveal]", 100],
  [".why-card[data-reveal]", 90],
];

staggerGroups.forEach(([selector, step]) => {
  document.querySelectorAll(selector).forEach((element, index) => {
    element.dataset.reveal = element.dataset.reveal ?? "";
    element.style.setProperty("--reveal-delay", `${index * step}ms`);
  });
});

const revealElements = document.querySelectorAll("[data-reveal]");
if ("IntersectionObserver" in window && !prefersReducedMotion) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealElements.forEach((element) => observer.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("is-visible"));
}

const tiltTargets = document.querySelectorAll(".service-card, [data-hero-visual] .code-window, .floating-card");
if (!prefersReducedMotion) {
  tiltTargets.forEach((element) => {
    element.addEventListener("pointermove", (event) => {
      const bounds = element.getBoundingClientRect();
      const offsetX = event.clientX - bounds.left;
      const offsetY = event.clientY - bounds.top;
      const rotateY = ((offsetX / bounds.width) - 0.5) * 8;
      const rotateX = (((offsetY / bounds.height) - 0.5) * -8);

      element.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
      element.style.setProperty("--glow-x", `${(offsetX / bounds.width) * 100}%`);
      element.style.setProperty("--glow-y", `${(offsetY / bounds.height) * 100}%`);
    });

    element.addEventListener("pointerleave", () => {
      element.style.transform = "";
    });
  });
}

const processGrid = document.querySelector(".process-grid");
if (processGrid) {
  if ("IntersectionObserver" in window && !prefersReducedMotion) {
    const processObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          processGrid.classList.add("is-visible");
          processObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    processObserver.observe(processGrid);
  } else {
    processGrid.classList.add("is-visible");
  }
}

const evolvePanel = document.querySelector("[data-evolve-panel]");
const evolveTrigger = document.querySelector("[data-evolve-trigger]");
const uptimeTrigger = document.querySelector("[data-uptime-trigger]");

if (evolvePanel && evolveTrigger && uptimeTrigger) {
  const codeFields = {
    file: document.querySelector("[data-code-file]"),
    status: document.querySelector("[data-code-status]"),
    goal: document.querySelector("[data-code-goal]"),
    pace: document.querySelector("[data-code-pace]"),
    support: document.querySelector("[data-code-support]"),
    stepOne: document.querySelector("[data-code-step-one]"),
    stepTwo: document.querySelector("[data-code-step-two]"),
    stepThree: document.querySelector("[data-code-step-three]"),
    result: document.querySelector("[data-code-result]"),
    footerLeft: document.querySelector("[data-code-footer-left]"),
    footerRight: document.querySelector("[data-code-footer-right]"),
  };

  const baseState = {
    file: "delivery-plan",
    status: "active",
    goal: "\"solve the right problem\"",
    pace: "\"measured delivery\"",
    support: "\"long-term\"",
    stepOne: "review",
    stepTwo: "build",
    stepThree: "improve",
    result: "\"moving forward\"",
    footerLeft: "Delivery aligned",
    footerRight: "Built to evolve",
  };

  const evolveState = {
    file: "growth-mode",
    status: "adapting",
    goal: "\"extend what already works\"",
    pace: "\"steady scaling\"",
    support: "\"continuous\"",
    stepOne: "stabilize",
    stepTwo: "expand",
    stepThree: "adapt",
    result: "\"growth ready\"",
    footerLeft: "Growth ready",
    footerRight: "Designed for what comes next",
  };

  const uptimeState = {
    file: "uptime-guard",
    status: "monitored",
    goal: "\"protect the live experience\"",
    pace: "\"steady operations\"",
    support: "\"proactive\"",
    stepOne: "observe",
    stepTwo: "harden",
    stepThree: "recover",
    result: "\"steady uptime\"",
    footerLeft: "Continuity protected",
    footerRight: "99.9% target active",
  };

  let lockedMode = null;
  let previewMode = null;
  let activeMode = null;
  let evolveTimers = [];
  let signalTimer = null;

  const applyCodeState = (state) => {
    Object.entries(codeFields).forEach(([key, element]) => {
      if (element) {
        element.textContent = state[key];
      }
    });
  };

  const clearTimers = () => {
    evolveTimers.forEach((timer) => window.clearTimeout(timer));
    evolveTimers = [];
  };

  const transitionCodeState = (state) => {
    clearTimers();

    const toolbarUpdates = [
      ["file", codeFields.file],
      ["status", codeFields.status],
    ];

    const lineUpdates = [
      ["goal", codeFields.goal],
      ["pace", codeFields.pace],
      ["support", codeFields.support],
      ["stepOne", codeFields.stepOne],
      ["stepTwo", codeFields.stepTwo],
      ["stepThree", codeFields.stepThree],
      ["result", codeFields.result],
      ["footerLeft", codeFields.footerLeft],
      ["footerRight", codeFields.footerRight],
    ];

    toolbarUpdates.forEach(([key, element], index) => {
      const delay = index * 65;
      if (!element) {
        return;
      }

      evolveTimers.push(window.setTimeout(() => {
        element.classList.remove("is-entering");
        element.classList.add("is-shifting");
      }, delay));

      evolveTimers.push(window.setTimeout(() => {
        element.textContent = state[key];
        element.classList.remove("is-shifting");
        element.classList.add("is-entering");
      }, delay + 95));

      evolveTimers.push(window.setTimeout(() => {
        element.classList.remove("is-entering");
      }, delay + 360));
    });

    lineUpdates.forEach(([key, element], index) => {
      const targetLine = element?.closest("[data-code-line]") ?? element;
      const delay = 120 + (index * 55);
      if (!element || !targetLine) {
        return;
      }

      evolveTimers.push(window.setTimeout(() => {
        targetLine.classList.remove("is-entering");
        targetLine.classList.add("is-shifting");
      }, delay));

      evolveTimers.push(window.setTimeout(() => {
        element.textContent = state[key];
        targetLine.classList.remove("is-shifting");
        targetLine.classList.add("is-entering");
      }, delay + 95));

      evolveTimers.push(window.setTimeout(() => {
        targetLine.classList.remove("is-entering");
      }, delay + 420));
    });
  };

  const setModeVisualState = (mode) => {
    evolvePanel.classList.toggle("is-evolving", mode === "evolve");
    evolvePanel.classList.toggle("is-monitoring", mode === "uptime");
    heroVisual?.classList.toggle("is-evolve-active", mode === "evolve");
    heroVisual?.classList.toggle("is-uptime-active", mode === "uptime");
  };

  const stateForMode = (mode) => {
    if (mode === "evolve") {
      return evolveState;
    }
    if (mode === "uptime") {
      return uptimeState;
    }
    return baseState;
  };

  const syncTriggerStates = () => {
    evolveTrigger.setAttribute("aria-pressed", String(lockedMode === "evolve"));
    uptimeTrigger.setAttribute("aria-pressed", String(lockedMode === "uptime"));
  };

  const runBridgeSignal = () => {
    if (!heroCardLink || prefersReducedMotion) {
      return;
    }

    heroCardLink.classList.remove("is-signaling");
    window.clearTimeout(signalTimer);
    void heroCardLink.offsetWidth;
    heroCardLink.classList.add("is-signaling");
    signalTimer = window.setTimeout(() => {
      heroCardLink.classList.remove("is-signaling");
    }, 1200);
  };

  const renderHeroMode = () => {
    const mode = previewMode ?? lockedMode;
    const state = stateForMode(mode);
    const previousMode = activeMode;
    activeMode = mode;

    setModeVisualState(mode);
    if (previousMode !== mode) {
      runBridgeSignal();
    }
    if (prefersReducedMotion) {
      applyCodeState(state);
    } else {
      transitionCodeState(state);
    }
  };

  const previewModeState = (mode) => {
    previewMode = mode;
    renderHeroMode();
  };

  const clearPreview = (mode) => {
    if (previewMode === mode) {
      previewMode = null;
      renderHeroMode();
    }
  };

  const toggleLockedMode = (mode) => {
    lockedMode = lockedMode === mode ? null : mode;
    previewMode = null;
    syncTriggerStates();
    renderHeroMode();
  };

  evolveTrigger.addEventListener("pointerenter", () => previewModeState("evolve"));
  evolveTrigger.addEventListener("focus", () => previewModeState("evolve"));
  evolveTrigger.addEventListener("pointerleave", () => clearPreview("evolve"));
  evolveTrigger.addEventListener("blur", () => clearPreview("evolve"));
  evolveTrigger.addEventListener("click", () => toggleLockedMode("evolve"));

  uptimeTrigger.addEventListener("pointerenter", () => previewModeState("uptime"));
  uptimeTrigger.addEventListener("focus", () => previewModeState("uptime"));
  uptimeTrigger.addEventListener("pointerleave", () => clearPreview("uptime"));
  uptimeTrigger.addEventListener("blur", () => clearPreview("uptime"));
  uptimeTrigger.addEventListener("click", () => toggleLockedMode("uptime"));
}

const form = document.querySelector("[data-contact-form]");
const formStatus = document.querySelector("[data-form-status]");

if (form && formStatus) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!form.checkValidity()) {
      formStatus.textContent = "Please complete the required fields before sending your message.";
      formStatus.classList.remove("is-success");
      formStatus.classList.add("is-error");
      form.reportValidity();
      return;
    }

    const formData = new FormData(form);
    const honeypot = String(formData.get("website") ?? "").trim();

    if (honeypot) {
      form.reset();
      formStatus.textContent = "Thanks. Your message is ready to send.";
      formStatus.classList.remove("is-error");
      formStatus.classList.add("is-success");
      return;
    }

    const contactEmail = form.dataset.contactEmail ?? "";
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const company = String(formData.get("company") ?? "").trim();
    const service = String(formData.get("service") ?? "").trim();
    const message = String(formData.get("message") ?? "").trim();

    const subject = `Flowstate Tech inquiry from ${name}${company ? ` - ${company}` : ""}`;
    const bodyLines = [
      `Name: ${name}`,
      `Email: ${email}`,
      `Company: ${company || "Not provided"}`,
      `Service: ${service || "Not provided"}`,
      "",
      "Project details:",
      message,
    ];

    const mailtoUrl = `mailto:${encodeURIComponent(contactEmail)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyLines.join("\n"))}`;
    const submitButton = form.querySelector("button[type='submit']");

    formStatus.textContent = `Your email app should open now. If it doesn't, email ${contactEmail} directly.`;
    formStatus.classList.remove("is-error");
    formStatus.classList.add("is-success");

    if (submitButton) {
      const originalLabel = submitButton.innerHTML;
      submitButton.disabled = true;
      submitButton.textContent = "Opening email app...";
      window.setTimeout(() => {
        submitButton.disabled = false;
        submitButton.innerHTML = originalLabel;
      }, 1800);
    }

    window.location.href = mailtoUrl;
  });
}
