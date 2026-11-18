# Lovable prompt: new Overview section and schedule (Nov 18 2026)

**Paste this only after Rafi approves the preview.** Preview for Rafi:
https://raw.githack.com/HAS2-phlang/ffg-vs-reference/main/social-good-hackathon/preview-rafi-nov18.html
(source: `preview-rafi-nov18.html` and `sections/about_c1.css` in this folder)

What changes, nothing else:
1. Overview ("What is the Social Good Hackathon?") is replaced by the pitch-deck-first section with four drawn sticker tiles and the logistics pills.
2. Schedule: venue line and the rows, from the Nov 17 KC and Kwen touchbase (brief a week before, 6-hour build, mixer from 5:30 PM).
3. FAQ "Where is the hackathon?" answer names the venue.

---

```
Update the Social Good Hackathon page ("/") from the approved source on GitHub. Change only the three things below and keep every other section, word, color, font, photo and behaviour exactly as it is now.

Read these files first, in full:
https://raw.githubusercontent.com/HAS2-phlang/ffg-vs-reference/main/social-good-hackathon/preview-rafi-nov18.html
https://raw.githubusercontent.com/HAS2-phlang/ffg-vs-reference/main/social-good-hackathon/sections/about_c1.css

1. Overview section. Replace the current "What is the Social Good Hackathon?" section (the one with the bullet list, the logistics chips and the photo wall) with the markup inside <div class="c1wrap"> ... </div> in preview-rafi-nov18.html, copied exactly: the heading, the headline "All you need is a pitch deck for an idea that helps power social good.", the "What we're looking for" label, the four colour tiles with their inline SVG sticker drawings and text, the closing headline, the MVP line, the four logistics pills, the line "We'd love for you to participate, network, and give your best work!" and the two buttons "Apply as an individual" and "Apply as a team" (they link to /apply?as=individual and /apply?as=team like the other Apply buttons). Use the styles in about_c1.css; every rule there is scoped under .c1wrap, keep that scope so nothing else on the page changes. Keep the small script at the end of preview-rafi-nov18.html that arms the sticker animations; the drawings must be fully visible even if the script never runs. Remove the old photo wall.

2. Schedule section. Change the venue line under "Schedule" to "Common Ground, Rockwell, Makati". Replace the schedule rows with exactly these, in this order, using the same row style and icons as in preview-rafi-nov18.html:
   Sat, Jan 16 | Problem brief sent to every team
   8:30 AM | Check-in
   9:00 AM | Kickoff
   9:00 AM to 3:00 PM | Build with your team
   12:00 to 1:00 PM | Lunch
   3:00 to 5:00 PM | Pitches to the judges
   5:00 to 5:30 PM | Awards
   From 5:30 PM | Mixer and dinner
   Keep the ticket design and the Jan 23 2027 stub.

3. FAQ. Under "Where is the hackathon?", the answer is: "Common Ground, Rockwell, Makati. Floor and room details to follow."

Rules: no em dashes, no new sections, no stock photos, do not touch /apply or the form's submit URL. Check the page at 390 px wide and at desktop width: no horizontal scroll, the four tiles stack on a phone, nothing overlaps.
```
