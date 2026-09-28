import { useEffect, useRef, useState } from "react";

export function nextNavbarVisibility({
  previousY,
  currentY,
  threshold = 80,
  menuOpen = false,
  focused = false,
}) {
  if (menuOpen || focused || currentY <= threshold) return true;
  return currentY < previousY;
}

export function calculateParallaxOffset({
  scrollY,
  speed,
  active,
  reducedMotion,
}) {
  if (!active || reducedMotion) return 0;
  return Math.round(scrollY * speed * 100) / 100;
}

export function useScrollDirection({ locked = false } = {}) {
  const [visible, setVisible] = useState(true);
  const previousY = useRef(0);

  useEffect(() => {
    let frame;
    const handleScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        const currentY = Math.max(0, window.scrollY);
        setVisible(
          nextNavbarVisibility({
            previousY: previousY.current,
            currentY,
            menuOpen: locked,
          }),
        );
        previousY.current = currentY;
        frame = undefined;
      });
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [locked]);

  return visible;
}

export function useParallax(speed = 0.16) {
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return undefined;
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let active = false;
    let frame;

    const update = () => {
      frame = undefined;
      const offset = calculateParallaxOffset({
        scrollY: window.scrollY,
        speed,
        active,
        reducedMotion: motionQuery.matches,
      });
      element.style.setProperty("--parallax-offset", `${offset}px`);
    };
    const requestUpdate = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const observer = new IntersectionObserver(([entry]) => {
      active = entry.isIntersecting;
      requestUpdate();
    });

    observer.observe(element);
    window.addEventListener("scroll", requestUpdate, { passive: true });
    motionQuery.addEventListener("change", requestUpdate);
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", requestUpdate);
      motionQuery.removeEventListener("change", requestUpdate);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [speed]);

  return ref;
}
