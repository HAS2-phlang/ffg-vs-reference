# Lovable prompts: Social Good Hackathon

Paste Prompt 1 first. Wait for it to finish and check the preview, then paste Prompt 2.

---

## Prompt 1: port the site

```
Port this static website into this project exactly. It is the approved Foundry for Good Social Good Hackathon site.

The full source is public on GitHub:
https://github.com/HAS2-phlang/ffg-vs-reference/tree/main/social-good-hackathon

Raw files to read (read every one before writing code):
https://raw.githubusercontent.com/HAS2-phlang/ffg-vs-reference/main/social-good-hackathon/index.html
https://raw.githubusercontent.com/HAS2-phlang/ffg-vs-reference/main/social-good-hackathon/apply.html
https://raw.githubusercontent.com/HAS2-phlang/ffg-vs-reference/main/social-good-hackathon/site.css
https://raw.githubusercontent.com/HAS2-phlang/ffg-vs-reference/main/social-good-hackathon/site.js
https://raw.githubusercontent.com/HAS2-phlang/ffg-vs-reference/main/social-good-hackathon/motion.css
https://raw.githubusercontent.com/HAS2-phlang/ffg-vs-reference/main/social-good-hackathon/motion.js
https://raw.githubusercontent.com/HAS2-phlang/ffg-vs-reference/main/social-good-hackathon/README.md
Section styles: https://raw.githubusercontent.com/HAS2-phlang/ffg-vs-reference/main/social-good-hackathon/sections/<name>.css
for <name> = hero_c08, about_zf, prizes, ideas_list, who, day, faq, closer, applypage.

Routes:
- "/"      = index.html
- "/apply" = apply.html (it reads ?as=individual or ?as=team and pre-picks that answer)

Rules:
1. Match the source exactly: same copy word for word, same layout, colors, fonts, spacing, icons and animations.
   Do not redesign, add sections, add stock photos, or rewrite any text.
2. Load the same Google Fonts the source <head> loads.
3. Keep the original CSS and class names (plain CSS files, not Tailwind) so the styles port verbatim.
4. Images: copy every file the pages use from
   https://raw.githubusercontent.com/HAS2-phlang/ffg-vs-reference/main/social-good-hackathon/assets/...
   into this project's public/assets/ (same folder structure, e.g. assets/ideas/01-website-laptop.jpg)
   and reference them as /assets/...
5. Inline SVG icons stay inline SVG, exactly as in the source.
6. Nav links: Overview, Prizes, Ideas, Teams, Schedule, FAQ scroll to their sections on "/"; Apply goes to "/apply".
   Keep the slim top bar above the nav on every page, exactly as in the source: "← Venture Studio"
   (https://venturestudio.foundryforgood.com/) on the left, "Careers" (https://careers.foundryforgood.com/) and
   "Back to Foundry for Good" (https://www.foundryforgood.com/) on the right. It copies the Venture Studio's top bar.
7. Page titles: "Foundry for Good Social Good Hackathon" and "Apply | Foundry for Good Social Good Hackathon".
8. It must work on phones exactly like the source at 390px wide (no sideways scrolling).

When done, list anything you could not match exactly.
```

---

## Prompt 2: send applications to the Google Sheet (after the Apps Script is deployed)

Applications go to Hugh's Google Apps Script (`HackathonApply.gs` in this folder), which saves a row in his
Sheet, emails Hugh a branded notification and emails the applicant a copy. Replace `PASTE_EXEC_URL_HERE`
with the Web app URL (ends in `/exec`) before pasting.

```
The form on /apply must send each application to this Google Apps Script web app:
PASTE_EXEC_URL_HERE

Keep the form looking and validating exactly as it does now, and port the submit logic from the source site.js exactly:
1. Validate like now (team fields only required when "As a team" is picked; teammate blocks only for the chosen team size).
2. Build this JSON: applying_as, first, last, email, linkedin, team_name, team_size, teammates (array of {first, last, email, linkedin}
   for teammates 2 to the team size), why, idea ("own" or "ours"), ideatext, privacy (true/false), website_url_2 (the hidden honeypot
   field, must stay hidden and empty for people), page (the current URL), user_agent.
3. POST it as a form-encoded body with one field named "payload" holding that JSON:
   fetch(URL, { method: 'POST', body: new URLSearchParams({ payload: JSON.stringify(data) }) })
   Do not set any headers and do not use mode 'no-cors' (this keeps it a simple request with no CORS preflight).
4. While sending, the button says "Sending..." and is disabled. If the JSON reply has ok: true, disable the form,
   set the button to "Sent" and show the existing thank-you message.
5. If it fails, re-enable the button and show the existing error line under it.
Do not use a database or Supabase for this, and do not add any fields.
```

---

## Prompt 3: add a "Hackathon" tab to the Venture Studio (paste in the Venture Studio Lovable project)

Paste this only once the hackathon site is published. Replace `HACKATHON_URL` with its live address first
(for example `https://hackathon.foundryforgood.com/`).

```
Add a "Hackathon" tab to the main navigation of this site. Change nothing else.

1. Desktop nav: add a link "Hackathon" right after "About FFG" (so the order is Our Model, Our Differentiators,
   The Playbook, About FFG, Hackathon). Use exactly the same style, size, color, spacing and hover state as the
   other nav links. Do not add an icon, badge or dropdown.
2. It links to HACKATHON_URL and opens in the same tab (it is a sister site with the same top bar, so visitors
   can come back with "← Venture Studio").
3. Mobile menu: add "Hackathon" in the same position, same style as the other menu items.
4. Footer: if the footer lists the main pages, add "Hackathon" there too, after "About FFG", same style.
5. Do not change the "Chat with Us" button, the top bar, any page content or any other link.

When done, confirm the nav still fits on one line at 1280px wide and that the mobile menu shows the new item.
```
