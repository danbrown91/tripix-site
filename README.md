# Tripix website V9

V9 is a clean CSS/JS refactor built directly from the current uploaded site files.

Key changes:
- Removed accumulated V3–V8 override layers; every component is defined once.
- Uses `overflow-x: clip` instead of `hidden` so sticky descendants keep the viewport as their scroll container.
- Restored a single desktop sticky story implementation with Safari `-webkit-sticky` support and simple JS state switching.
- Keeps a stacked, non-sticky story below 981px.
- Moves the Trips and Share device images upward and prevents them being cut by the following section.
- Centres About, Privacy, Terms, Support and all support-guide header groups; Back to Support remains left aligned.
- Keeps the V7 transparent device artwork and current smaller device sizing.
- Increases display tracking to prevent character collisions.

Keep the repository CNAME file when uploading.
