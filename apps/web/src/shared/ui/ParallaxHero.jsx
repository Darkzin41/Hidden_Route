import { useParallax } from "../motion/motion.js";

export function ParallaxHero({
  image,
  mobileImage,
  eyebrow,
  title,
  description,
  actions,
  compact = false,
  children,
}) {
  const imageRef = useParallax(0.08);

  return (
    <section
      className={`parallax-hero${compact ? " parallax-hero--compact" : ""}`}
    >
      <picture
        className="parallax-hero__media"
        ref={imageRef}
        aria-hidden="true"
      >
        {mobileImage && (
          <source media="(max-width: 640px)" srcSet={mobileImage} />
        )}
        <img src={image} alt="" fetchPriority="high" />
      </picture>
      <div className="parallax-hero__veil" />
      <div className="container parallax-hero__content">
        {eyebrow && <span className="eyebrow eyebrow--light">{eyebrow}</span>}
        <h1>{title}</h1>
        {description && <p>{description}</p>}
        {actions && <div className="hero-actions">{actions}</div>}
        {children}
      </div>
    </section>
  );
}
