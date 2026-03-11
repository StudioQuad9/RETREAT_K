"use client";

import { useEffect } from "react";

const useParallaxGaps = (selector = ".gap-image") => {
  useEffect(() => {
    const gaps = document.querySelectorAll(selector);

    if (!gaps.length) return;

    const handleScroll = () => {
      gaps.forEach((gap) => {
        const layer = gap.querySelector(".gap-image__layer");
        if (!layer) return;

        const rect = gap.getBoundingClientRect();
        const speed = Number(gap.dataset.speed || 0.18);

        const offset = rect.top * speed;

        layer.style.transform = `translate3d(0, ${offset}px, 0)`;
      });
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [selector]);
};

export default useParallaxGaps;

// "use client";

// import { useEffect } from "react";

// const useParallaxGaps = (selector = ".gap-image") => {
//   useEffect(() => {
//     const gaps = Array.from(document.querySelectorAll(selector));
//     console.log("gap count:", gaps.length);
//     if (!gaps.length) return;

//     const prefersReducedMotion =
//       window.matchMedia &&
//       window.matchMedia("(prefers-reduced-motion: reduce)").matches;

//     if (prefersReducedMotion) return;

//     let rafId = null;
//     const active = new Set();

//     const update = () => {
//       console.log("update running");
//       rafId = null;
//       const viewportHeight = window.innerHeight;

//       active.forEach((gap) => {
//         const layer = gap.querySelector(".gap-image__layer");
//         if (!layer) return;

//         const speed = Number(gap.dataset.speed ?? 0.18);
//         const rect = gap.getBoundingClientRect();

//         // 画面内での位置からずらし量を計算
//         const progress = (rect.top + rect.height) / (viewportHeight + rect.height);
//         const offset = (progress - 0.5) * 120 * speed;

//         layer.style.transform = `translate3d(0, ${offset}px, 0)`;
//       });
//     };

//     const requestTick = () => {
//       if (rafId) return;
//       rafId = window.requestAnimationFrame(update);
//     };

//     const observer = new IntersectionObserver(
//       (entries) => {
//         entries.forEach((entry) => {
//           if (entry.isIntersecting) {
//             active.add(entry.target);
//           } else {
//             active.delete(entry.target);
//           }
//         });

//         requestTick();
//       },
//       {
//         threshold: 0,
//       }
//     );

//     gaps.forEach((gap) => observer.observe(gap));

//     window.addEventListener("scroll", requestTick, { passive: true });
//     window.addEventListener("resize", requestTick);

//     requestTick();

//     return () => {
//       observer.disconnect();
//       window.removeEventListener("scroll", requestTick);
//       window.removeEventListener("resize", requestTick);
//       if (rafId) cancelAnimationFrame(rafId);
//     };
//   }, [selector]);
// };

// export default useParallaxGaps;
