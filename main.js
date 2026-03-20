(function () {
  "use strict";

  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Page loader */
  function initLoader() {
    var loader = document.getElementById("pageLoader");
    if (!loader) return;

    var minVisible = 600;
    var start = performance.now();

    function hide() {
      var elapsed = performance.now() - start;
      var wait = Math.max(0, minVisible - elapsed);
      setTimeout(function () {
        loader.classList.add("is-done");
        loader.setAttribute("aria-hidden", "true");
      }, wait);
    }

    if (document.readyState === "complete") {
      hide();
    } else {
      window.addEventListener("load", hide);
    }
  }

  /* IntersectionObserver — reveals */
  function initReveals() {
    if (prefersReducedMotion) {
      document.querySelectorAll("[data-reveal], [data-reveal-line]").forEach(function (el) {
        el.classList.add("is-visible");
      });
      return;
    }

    var revealEls = document.querySelectorAll("[data-reveal]");

    var io = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        });
      },
      { root: null, rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );

    revealEls.forEach(function (el) {
      io.observe(el);
    });

    var lineObserver = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var lines = Array.prototype.slice.call(entry.target.querySelectorAll("[data-reveal-line]"));
          lines.forEach(function (line, i) {
            setTimeout(function () {
              line.classList.add("is-visible");
            }, i * 260);
          });
          obs.unobserve(entry.target);
        });
      },
      { root: null, rootMargin: "0px", threshold: 0.2 }
    );

    var quoteBlock = document.querySelector(".hero__quote");
    if (quoteBlock) {
      lineObserver.observe(quoteBlock);
    }
  }

  /* Lightbox */
  function initLightbox() {
    var root = document.getElementById("lightbox");
    var img = document.getElementById("lightboxImg");
    var closeBtn = document.getElementById("lightboxClose");
    var backdrop = document.getElementById("lightboxBackdrop");
    if (!root || !img || !closeBtn || !backdrop) return;

    var lastFocus = null;

    function openLightbox(src, alt) {
      img.src = src;
      img.alt = alt || "";
      lastFocus = document.activeElement;
      root.removeAttribute("hidden");
      document.body.classList.add("is-lightbox-open");
      requestAnimationFrame(function () {
        root.classList.add("is-open");
      });
      closeBtn.focus();
    }

    function closeLightbox() {
      root.classList.remove("is-open");
      document.body.classList.remove("is-lightbox-open");
      var delay = prefersReducedMotion ? 0 : 420;
      setTimeout(function () {
        root.setAttribute("hidden", "");
        img.removeAttribute("src");
        img.alt = "";
        if (lastFocus && typeof lastFocus.focus === "function") {
          lastFocus.focus();
        }
      }, delay);
    }

    document.querySelectorAll(".gallery-tile").forEach(function (tile) {
      var thumb = tile.querySelector("img");
      if (!thumb) return;

      tile.addEventListener("click", function () {
        openLightbox(thumb.currentSrc || thumb.src, thumb.alt);
      });

      tile.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openLightbox(thumb.currentSrc || thumb.src, thumb.alt);
        }
      });
    });

    closeBtn.addEventListener("click", closeLightbox);
    backdrop.addEventListener("click", closeLightbox);

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !root.hasAttribute("hidden")) {
        closeLightbox();
      }
    });
  }

  /* Touch / tap press state for gallery */
  function initGalleryTapState() {
    document.querySelectorAll(".gallery-tile").forEach(function (tile) {
      tile.addEventListener(
        "touchstart",
        function () {
          tile.classList.add("is-pressed");
        },
        { passive: true }
      );
      tile.addEventListener(
        "touchend",
        function () {
          tile.classList.remove("is-pressed");
        },
        { passive: true }
      );
      tile.addEventListener("touchcancel", function () {
        tile.classList.remove("is-pressed");
      });
    });
  }

  /* Background music — first user gesture fades in; toggle controls play/pause */
  function initMusic() {
    var audio = document.getElementById("bgm");
    var btn = document.getElementById("musicToggle");
    if (!audio || !btn) return;

    var TARGET_VOL = 0.52;
    var ambientStarted = false;

    function setPlayingUi(playing) {
      btn.classList.toggle("is-playing", playing);
      btn.setAttribute("aria-pressed", playing ? "true" : "false");
      btn.setAttribute("aria-label", playing ? "배경 음악 일시정지" : "배경 음악 재생");
      var cue = document.getElementById("musicToggleCue");
      if (cue) cue.textContent = playing ? "음악 끄기" : "음악 켜기";
    }

    function fadeVolumeTo(target, ms, done) {
      var from = audio.volume;
      var t0 = performance.now();
      function step(now) {
        var p = Math.min(1, (now - t0) / ms);
        audio.volume = from + (target - from) * p;
        if (p < 1) {
          requestAnimationFrame(step);
        } else if (done) {
          done();
        }
      }
      requestAnimationFrame(step);
    }

    function startAmbientFromInteraction() {
      if (ambientStarted) return;
      ambientStarted = true;
      audio.volume = 0;
      var playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(function () {
            setPlayingUi(true);
            fadeVolumeTo(TARGET_VOL, prefersReducedMotion ? 200 : 2800);
          })
          .catch(function () {
            ambientStarted = false;
            setPlayingUi(false);
          });
      }
    }

    /* 자동 재생 시도(Chrome/데스크톱 등에서는 성공하는 경우가 많음. 모바일·Safari는 차단될 수 있어 이후 클릭·스크롤로 대체) */
    function tryAutoplayAfterLoad() {
      if (ambientStarted) return;
      startAmbientFromInteraction();
    }

    window.addEventListener("load", function () {
      setTimeout(tryAutoplayAfterLoad, 250);
    });

    document.addEventListener(
      "click",
      function (e) {
        if (e.target.closest("#musicToggle")) return;
        startAmbientFromInteraction();
      },
      true
    );

    window.addEventListener(
      "scroll",
      function onFirstScroll() {
        startAmbientFromInteraction();
        window.removeEventListener("scroll", onFirstScroll);
      },
      { passive: true }
    );

    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      if (!ambientStarted) {
        startAmbientFromInteraction();
        return;
      }
      if (audio.paused) {
        audio.volume = 0;
        audio.play().then(function () {
          setPlayingUi(true);
          fadeVolumeTo(TARGET_VOL, prefersReducedMotion ? 120 : 950);
        });
      } else {
        fadeVolumeTo(0, prefersReducedMotion ? 80 : 420, function () {
          audio.pause();
          setPlayingUi(false);
        });
      }
    });
  }

  /* Mobile nav */
  function initMobileNav() {
    var toggle = document.querySelector(".site-header__toggle");
    var panel = document.getElementById("mobileNav");
    if (!toggle || !panel) return;

    function close() {
      toggle.setAttribute("aria-expanded", "false");
      toggle.classList.remove("is-open");
      panel.hidden = true;
    }

    function open() {
      toggle.setAttribute("aria-expanded", "true");
      toggle.classList.add("is-open");
      panel.hidden = false;
    }

    toggle.addEventListener("click", function () {
      var expanded = toggle.getAttribute("aria-expanded") === "true";
      if (expanded) close();
      else open();
    });

    panel.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", close);
    });
  }

  /* RSVP */
  function initRsvp() {
    var form = document.getElementById("rsvpForm");
    var err = document.getElementById("rsvpError");
    if (!form || !err) return;

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      err.hidden = true;
      err.textContent = "";

      var name = form.elements.namedItem("name");
      var attend = form.querySelector('input[name="attend"]:checked');
      var guests = form.elements.namedItem("guests");
      var message = form.elements.namedItem("message");
      var emailInput = document.getElementById("rsvpEmail");

      var nameVal = ((name && name.value) || "").trim();
      if (!nameVal) {
        err.textContent = "성함을 입력해 주세요.";
        err.hidden = false;
        return;
      }
      if (!attend) {
        err.textContent = "참석 여부를 선택해 주세요.";
        err.hidden = false;
        return;
      }

      var to = (emailInput && emailInput.value) || "".trim();
      var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to);
      if (!to || !emailOk) {
        err.textContent = "회신을 받으실 이메일 주소를 올바르게 입력해 주세요.";
        err.hidden = false;
        emailInput && emailInput.focus();
        return;
      }

      var guestNum = guests ? String(guests.value || "0") : "0";
      var body =
        "성함: " +
        nameVal +
        "\n" +
        "참석: " +
        attend.value +
        "\n" +
        "동반 인원: " +
        guestNum +
        "\n\n" +
        "메시지:\n" +
        ((message && message.value) || "").trim();

      var subject = "결혼식 참석 회신 · 이영직·김지수";
      var mailto =
        "mailto:" +
        encodeURIComponent(to) +
        "?subject=" +
        encodeURIComponent(subject) +
        "&body=" +
        encodeURIComponent(body);

      window.location.href = mailto;
    });
  }

  document.documentElement.style.setProperty("--header-h", "3.75rem");

  initLoader();
  initReveals();
  initLightbox();
  initGalleryTapState();
  initMusic();
  initMobileNav();
  initRsvp();
})();
