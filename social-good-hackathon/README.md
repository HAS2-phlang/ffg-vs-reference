# Foundry for Good Social Good Hackathon: website source for Lovable

This folder is the approved local build of the hackathon site, ready for Lovable to port 1:1.
Saturday, January 23, 2027, Makati.

## Pages

| File | Route in Lovable | What it is |
|---|---|---|
| `index.html` | `/` | Home: hero, Overview (What is it), Prizes, Ideas, Teams, Schedule, FAQ, Apply closer |
| `apply.html` | `/apply` | Application form. Opens pre-picked with `?as=individual` or `?as=team` |

## Files

| Path | Purpose |
|---|---|
| `site.css`, `site.js` | Shared styles and script (nav, scroll reveals, form logic incl. the team-size picker) |
| `motion.css`, `motion.js` | Scroll animations |
| `sections/*.css` | One stylesheet per section, same class names as the HTML |
| `assets/` | Every image the two pages use, nothing else |

Fonts load from Google Fonts in each page's `<head>` (Archivo, Inter, Lora, Anton, Kaushan Script, Sora, Fraunces, DM Sans).

## Rules for the port

- Copy is approved: keep every word exactly as written. Do not add sections, stats, testimonials or "learn more" blocks.
- Keep the layout, colors, fonts, photos and icons exactly. Palette: navy `#16323E`, deep navy `#10262F`, orange `#B5502D`, flame `#E8906B`, cream `#F7F4EE`.
- The Schedule says "Venue: TBD" and the Overview says "A coworking space in Makati" until a venue is booked.
- The application form posts to Hugh's Google Apps Script (`HackathonApply.gs`, set as SUBMIT_URL in site.js), which saves a Sheet row and sends the emails. Team applications send one block per teammate (first name, last name, email, LinkedIn).
