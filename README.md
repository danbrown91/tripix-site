# Tripix website V10

V10 is based directly on the clean V9 refactor.

## New global design controls

At the top of `assets/styles.css`, inside `:root`, there are now two values intended for easy visual tuning:

```css
--display-letter-spacing: .02em;
--device-scale: 1.25;
```

- `--display-letter-spacing` controls letter spacing for headings (`h1`, `h2`, `h3`) across the entire site.
- `--device-scale` controls the visual scale of every Tripix phone/device image used in the homepage hero, Trips feature, sticky story, stacked story fallback, and Share feature. `1` = original V9 size, `1.25` = 25% larger.

The device scaling uses the CSS individual `scale` property rather than `transform`, so it can coexist with the homepage parallax JavaScript.

Keep your existing GitHub Pages `CNAME` file when deploying.
