# Premium Section Animation Clone

Plain HTML/CSS/JS animation template inspired by the section-by-section motion behavior of the reference website.

## How to run

Open `index.html` in a browser, or serve the folder locally:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Files

- `index.html` - section structure and GSAP CDN links
- `styles.css` - responsive layout and animation-ready classes
- `script.js` - GSAP + ScrollTrigger animation system

## Integration

Copy the CSS and JS into your project, then add these classes to your real content:

- `.js-split` for premium heading word reveal
- `.js-reveal` for supporting copy/buttons
- `.js-stagger` on card-grid parents
- `.js-from-left` and `.js-from-right` for split sections
- `.js-stat` with `[data-count]` for counters
- `.js-hero-media` for hero parallax media

This does not copy the reference website content, branding, images, or exact design.
