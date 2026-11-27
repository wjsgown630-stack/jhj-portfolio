/* global jQuery, gsap, ScrollTrigger */
(function (window, document) {
  "use strict";

  // 콘텐츠는 기본적으로 보인다. CDN 로딩 실패 시에도 페이지를 읽을 수 있다.
  if (!window.jQuery || !window.gsap || !window.ScrollTrigger) return;

  jQuery(function ($) {
    gsap.registerPlugin(ScrollTrigger);

    const media = gsap.matchMedia();
    const heroImage = document.querySelector(".hero__image");

    media.add("(prefers-reduced-motion: no-preference)", function () {
      const heroTween = gsap.from(heroImage, {
        autoAlpha: 0,
        y: 48,
        duration: 1.2,
        ease: "power2.out",
        paused: true,
        clearProps: "opacity,visibility,transform"
      });

      // 이미지 다운로드가 끝난 뒤 페이드 업을 시작한다.
      function showHero() {
        heroTween.play();
      }

      if (heroImage.complete) {
        showHero();
      } else {
        $(heroImage).one("load.hero error.hero", showHero);
      }

      $("[data-reveal-group]").each(function () {
        const items = $(this).find("[data-reveal]").toArray();

        gsap.from(items, {
          autoAlpha: 0,
          y: 28,
          duration: 0.8,
          stagger: 0.12,
          ease: "power2.out",
          clearProps: "opacity,visibility,transform",
          scrollTrigger: {
            trigger: this,
            start: "top 85%",
            once: true
          }
        });
      });

      return function () {
        $(heroImage).off(".hero");
      };
    });

    // 웹폰트와 이미지가 로드된 최종 레이아웃으로 트리거 위치를 갱신한다.
    $(window).on("load.profile", function () {
      ScrollTrigger.refresh();
    });

    if (document.fonts) {
      document.fonts.ready.then(function () {
        ScrollTrigger.refresh();
      });
    }
  });
})(window, document);
