# Lovable prompt: Nov 18 v3 (final redesign of the home page)

Source page: `preview-rafi-nov18-v3.html` in this folder.
Preview link (opens as a normal page):
https://raw.githack.com/HAS2-phlang/ffg-vs-reference/main/social-good-hackathon/preview-rafi-nov18-v3.html

This replaces the two earlier Nov 18 prompts. Paste the whole block below into the hackathon's Lovable project.
Only "/" changes. "/apply" and the form's submit URL stay exactly as they are.

---

```
Rebuild the hackathon home page ("/") so it matches this approved source exactly. Do not change "/apply" or the application form in any way.

Read this file in full before writing code (it is the complete page: markup, every <style> block and every <script> block):
https://raw.githubusercontent.com/HAS2-phlang/ffg-vs-reference/main/social-good-hackathon/preview-rafi-nov18-v3.html

It also loads these shared files, which are unchanged from what the site already uses:
https://raw.githubusercontent.com/HAS2-phlang/ffg-vs-reference/main/social-good-hackathon/site.css
https://raw.githubusercontent.com/HAS2-phlang/ffg-vs-reference/main/social-good-hackathon/site.js
https://raw.githubusercontent.com/HAS2-phlang/ffg-vs-reference/main/social-good-hackathon/motion.css
https://raw.githubusercontent.com/HAS2-phlang/ffg-vs-reference/main/social-good-hackathon/motion.js
https://raw.githubusercontent.com/HAS2-phlang/ffg-vs-reference/main/social-good-hackathon/sections/<name>.css
for every sections/<name>.css the page links (including the new sections/about_c1.css).

New images to add (copy into public/assets/venue/ and reference as /assets/venue/...):
https://raw.githubusercontent.com/HAS2-phlang/ffg-vs-reference/main/social-good-hackathon/assets/venue/cg-logo.svg
https://raw.githubusercontent.com/HAS2-phlang/ffg-vs-reference/main/social-good-hackathon/assets/venue/cg-the-grounds.jpg
All other images the page uses already exist in public/assets/ (same paths as in the source).

What changed on "/" (so you can check your work):
1. "What is the Social Good Hackathon?": new centred heading with a yellow marker highlight, the one-day hackathon sentence, the "All you need is a pitch deck" sticker label with "presenting your concept.", four colour tiles with inline SVG sticker drawings (each with a small 2x2 sticker cluster; the navy tile shows four captioned idea stickers and a "+6 more ideas" link to #ideas), the line "We'd love to hear and back your idea!", "An actual built MVP or demo is a plus, but not required.", the Transport / Lunch / Dinner pills, a white venue badge with the Common Ground logo and "Rockwell, Makati", a "View on Google Maps" link (opens https://www.google.com/maps/search/?api=1&query=Common+Ground+8+Rockwell+Makati in a new tab), "Participate, network, and give your best work!" and the two Apply buttons.
2. Prizes: sticker prizes on a navy card.
3. Ideas: the Foundry for Good logo on a cream tab attached to the orange "IDEAS" sticker; the 10 idea cards restyled (cream borders, navy caption bars, yellow number chips) and clickable: tapping a card shows "The problem" and "What you could build" over the photo, one card open at a time; the icon wall below scrolls slowly right to left in two rows, pauses on hover, and is still under reduced motion; the orange "Bring your own idea" sticker sits centred on it.
4. Teams: the evolved navy two-fact banner with the "TEAMS" sticker label, and four role cards with crisp vector sticker drawings (Developer, Designer = ruler and pencil over a wireframe, Copywriter, Business) that animate once when scrolled into view and on hover.
5. Schedule: a photo banner of The Grounds under "SCHEDULE", then the ticket with these rows: Sat, Jan 16 Problem brief sent to every team / 8:30 AM Check-in / 9:00 AM Kickoff / 9:00 AM to 3:00 PM Build with your team / 12:00 to 1:00 PM Lunch / 3:00 to 5:00 PM Pitches to the judges / 5:00 to 5:30 PM Awards / From 5:30 PM Mixer and dinner.
6. FAQ: same questions and answers as the live site today (no new questions).

Rules:
1. Match the source exactly: copy word for word, same layout, colours, fonts, spacing, inline SVG drawings and animations. Do not redesign, rewrite text, add sections or add stock photos.
2. Keep the original CSS and class names (plain CSS, not Tailwind). Every <style> block in the source is scoped (c1wrap, g3w, r1-, r2-, an-, dz-, fv- and similar prefixes); port them verbatim so nothing leaks.
3. Port every inline <script> in the source verbatim (idea card toggles, role animations, sticker reveals). The page must still be fully readable with JavaScript off and under prefers-reduced-motion.
4. Page title: "Foundry for Good Social Good Hackathon" (drop the "PREVIEW for Rafi (Nov 18):" prefix from the source title).
5. Keep the top bar, nav (Overview, Prizes, Ideas, Teams, Schedule, FAQ scroll to their sections; Apply goes to /apply) and footer as they are now.
6. Check at 390 px wide and at desktop: no sideways scrolling, nothing overlaps, the FAQ tabs and accordions work, idea cards open and close.

When done, list anything you could not match exactly.
```
