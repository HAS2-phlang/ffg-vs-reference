# Lovable prompt: Nov 18 v3 hackathon page (paste in the Foundry Venture Studio project)

The hackathon lives inside the **Foundry Venture Studio** Lovable project at **/hackathon**, served from
`src/lib/hackathon/index.html`, with its images under `public/assets/hackathon/` and its CSS loaded only on the
hackathon pages (set up in the Oct 26 to Nov 9 chats). This prompt only touches that page.

Source: `preview-rafi-nov18-v3.html` in this folder.
Preview: https://raw.githack.com/HAS2-phlang/ffg-vs-reference/main/social-good-hackathon/preview-rafi-nov18-v3.html

---

```
Update ONLY the hackathon page (/hackathon, the page built from src/lib/hackathon/index.html). Do not change the Venture Studio homepage or any other Venture Studio page, the nav or footer of the Venture Studio, the hackathon apply page, or the application form and its submit URL.

Replace the content of src/lib/hackathon/index.html with the approved source below, so /hackathon matches it exactly. Read it in full first (markup, every <style> block and every <script> block):
https://raw.githubusercontent.com/HAS2-phlang/ffg-vs-reference/main/social-good-hackathon/preview-rafi-nov18-v3.html

It links these shared hackathon files. Compare each with what the hackathon page already uses and update them if they differ; sections/about_c1.css is new:
https://raw.githubusercontent.com/HAS2-phlang/ffg-vs-reference/main/social-good-hackathon/site.css
https://raw.githubusercontent.com/HAS2-phlang/ffg-vs-reference/main/social-good-hackathon/site.js
https://raw.githubusercontent.com/HAS2-phlang/ffg-vs-reference/main/social-good-hackathon/motion.css
https://raw.githubusercontent.com/HAS2-phlang/ffg-vs-reference/main/social-good-hackathon/motion.js
https://raw.githubusercontent.com/HAS2-phlang/ffg-vs-reference/main/social-good-hackathon/sections/<name>.css
(for every sections/<name>.css the source links)
Keep loading all hackathon CSS only on the hackathon pages, so none of it changes the Venture Studio pages.

Images: the source refers to images as assets/... . In this project the hackathon's images live in public/assets/hackathon/, so keep pointing to them there. Add these two new images to public/assets/hackathon/venue/ and point the page to them:
https://raw.githubusercontent.com/HAS2-phlang/ffg-vs-reference/main/social-good-hackathon/assets/venue/cg-logo.svg
https://raw.githubusercontent.com/HAS2-phlang/ffg-vs-reference/main/social-good-hackathon/assets/venue/cg-the-grounds.jpg
If any other image the source uses is missing from public/assets/hackathon/, copy it from https://raw.githubusercontent.com/HAS2-phlang/ffg-vs-reference/main/social-good-hackathon/assets/<same path>.

Links: keep the hackathon's top bar, nav and Apply buttons pointing exactly where they point now on /hackathon (the Apply buttons go to the existing hackathon apply page with ?as=individual or ?as=team). The idea "+6 more ideas" link goes to #ideas on the same page.

What changes on /hackathon (to check your work):
1. "What is the Social Good Hackathon?": centred heading with a yellow marker highlight, the one-day hackathon sentence, the "All you need is a pitch deck" sticker label with "presenting your concept.", a white pill with a calendar icon reading "On the day, you build with your team, then you present what you made to the judges", four colour tiles with inline SVG sticker drawings (2x2 sticker clusters; the navy tile shows four captioned idea stickers and "+6 more ideas"; the blue tile's text is two bullets: "Any and all skillsets are welcome" and "The best teams mix different skills, like a designer, a programmer and a business person"), the headline "We're excited to hear your ideas!", "An actual built MVP or demo is a plus, but not required.", the Transport / Lunch / Dinner pills, a white venue badge with the Common Ground logo and "Rockwell, Makati", a "View on Google Maps" link (https://www.google.com/maps/search/?api=1&query=Common+Ground+8+Rockwell+Makati, new tab), "Participate, network, and give your best work!" and the two Apply buttons. The four tiles animate in when scrolled into view (tiles rise and fade in one after another, then each big sticker pops, then the small stickers pop in sequence); this uses the r3- scroll-in <style> and <script> blocks in the source.
2. Prizes: sticker prizes on a navy card.
3. Ideas: the Foundry for Good logo on a cream tab attached to the orange "IDEAS" sticker; the 10 idea cards restyled and clickable (tapping a card shows "The problem" and "What you could build", one card open at a time); the icon wall scrolls slowly right to left, pauses on hover, is still under reduced motion; the orange "... or bring your own idea!" sticker sits centred on it.
4. Teams: the navy two-fact banner with the "TEAMS" sticker label, and four role cards with vector sticker drawings that animate once when scrolled into view and on hover.
5. Schedule: a photo banner of The Grounds under "SCHEDULE", then the ticket rows: Sat, Jan 16 Problem brief sent to every team / 8:30 AM Check-in / 9:00 AM Kickoff / 9:00 AM to 3:00 PM Build with your team / 12:00 to 1:00 PM Lunch / 3:00 to 5:00 PM Pitches to the judges / 5:00 to 5:30 PM Awards / From 5:30 PM Mixer and dinner.
6. FAQ: the same questions and answers as the current /hackathon page (no new questions).

Rules:
1. Match the source exactly: copy word for word, same layout, colours, fonts, spacing, inline SVGs and animations. Do not redesign, rewrite text, add sections or add stock photos.
2. Keep the original CSS and class names (plain CSS, not Tailwind) and port every scoped <style> block (c1wrap, g3w, r1-, r2-, r3-, an-, dz-, fv- and similar) and every inline <script> verbatim. The page must read fine with JavaScript off and under prefers-reduced-motion.
3. Page title stays "Foundry for Good Social Good Hackathon" (drop the "PREVIEW for Rafi (Nov 18):" prefix in the source).
4. Check /hackathon at 390 px and desktop: no sideways scrolling, nothing overlaps, FAQ tabs and accordions work, idea cards open and close. Then open the Venture Studio homepage and confirm it is unchanged.

When done, list anything you could not match exactly.
```
