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
7. Page titles: "Foundry for Good Social Good Hackathon" and "Apply | Foundry for Good Social Good Hackathon".
8. It must work on phones exactly like the source at 390px wide (no sideways scrolling).

When done, list anything you could not match exactly.
```

---

## Prompt 2: save applications

```
Make the application form on /apply save every submission to the database. Keep the form looking exactly the same.

Create a table "applications" with:
id, created_at, applying_as ("individual" or "team"), first_name, last_name, email, linkedin,
team_name, team_size (3 or 4), teammates (JSON array of {first_name, last_name, email, linkedin}),
why_join, idea_choice ("own" or "ours"), idea_text, privacy_consent (boolean).

On submit: validate exactly like the current form (team fields only required when "As a team" is picked,
teammate blocks only for the chosen team size), insert one row, then show the existing thank-you message.
Anyone can submit (no login), but only project admins can read the table. No emails, no extra fields.
```
