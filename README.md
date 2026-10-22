# Voynski Automotive Lab

Website for Voynski Automotive Lab: automotive photography for enthusiasts, collectors and brands. Part of Voynski Labs, next to Voynski Brand Lab. Replaces the old Squarespace site at voynskiautomotivelab.com.

Plain HTML, CSS and JavaScript with its own motorsport design (start lights intro, speed lines, a scroll speedometer, a pinned paddock gallery). No build step: open `index.html` in a browser, or deploy the folder as-is to Netlify.

## Pages

- `index.html`: home (start lights, hero, starting grid of services, paddock gallery, reels, Voynski Labs)
- `services.html`: private sessions, rolling shots, commercial, events, FAQ
- `about.html`
- `contact.html`: email, Instagram and message form
- `book.html`: booking request with calendar

## Editing

- Email, Instagram and the Brand Lab link: top of `assets/main.js` (`CONTACT`, `LABS`)
- Styles: `assets/style.css`

## Forms

The contact and booking forms use Netlify Forms. They start working once the site is deployed on Netlify; submissions show up under **Forms** in the Netlify dashboard.

## Photos

Only Victor's own photos go in `images/`, resized for the web (2000px long side, about 200 to 450 KB). Short muted clips for the reels live in `video/` (540px wide, under 1 MB each).
