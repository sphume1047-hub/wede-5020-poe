Peak Carpenters Website
Project Overview

Peak Carpenters is a responsive multi-page carpentry business website developed using HTML and CSS. The website was designed to showcase the services, background, and contact information of a fictional carpentry company based in Durban, South Africa.

The project focuses on creating a professional online presence for the business while demonstrating modern web design principles, responsive layouts, and user-friendly navigation.

Website Pages
Homepage

The homepage introduces visitors to Peak Carpenters and highlights the company’s mission, services, and craftsmanship.

Features:

Hero section
Business introduction
Gallery images
Navigation bar
Call-to-action button
Footer
About Us Page

The About Us page explains the company’s history, values, and community involvement.

Features:

Company background
Team and craftsmanship information
Gallery section
Responsive design
Services Page

The Services page showcases the carpentry services offered by the company.

Services Include:

Custom furniture
Home renovations
Commercial projects
Cabinetry and shelving
Installations and restorations

Features:

Service cards
Responsive service grid
Call-to-action buttons
Image gallery
Contact Page

The Contact page allows users to reach the company using various communication methods.

Features:

Contact information
Business hours
Social media links
Embedded Google Maps location
Gallery images
Inquiry Page

The Inquiry page contains a customer inquiry form for project requests and quotations.

Features:

Inquiry form
Input validation
Responsive layout
Call-to-action section
Gallery images
Technologies Used
HTML5
CSS3
CSS Grid
Flexbox
Responsive Web Design
Design Features

The website includes:

Responsive layouts
Modern user interface
Hero sections
Hover effects
Custom buttons
Image galleries
Glassmorphism styling
Mobile-friendly navigation
Consistent color palette
Folder Structure
Peak-Carpenters/
│
├── img/
├── .vscode/
│
├── homepage.html
├── services.html
├── about-us.html
├── contact.html
├── inquiry.html
├── style.css
├── README.md
Author

Developed by:
Sphumelele Ngcem

References
Images
https://unsplash.com/
Inspiration and Learning Resources
https://developer.mozilla.org/
https://www.w3schools.com/
https://css-tricks.com/
Maps
https://www.google.com/maps/
  
Changelog
------

- 2026-06-18: Added client-side JavaScript (`js/main.js`) to provide:
	- form validation and mailto-based submission for `.contact-form`
	- gallery lightbox for images inside `.gallery`
	- smooth in-page scrolling for anchor links
	- a small mobile nav toggle

- 2026-06-18: Inserted `contact` form into `Contact.html` and ensured `Inquiry.html` form uses `.contact-form` class.

- 2026-06-18: Added `robots.txt` and `sitemap.xml` (replace example.com with your production domain).

- 2026-06-18: Improvements to form handling and SEO:
	- `js/main.js` updated to attach validation and submission to all `.contact-form` forms and support optional AJAX endpoints via `data-endpoint` (example: Formspree). Falls back to `mailto:` if AJAX fails or no endpoint is configured.
	- Added meta description tags to all HTML pages for basic on-page SEO.
	- Reminder: Replace `sitemap.xml` URLs with your live domain before publishing.
	- Updated `sitemap.xml` and `robots.txt` to point to: `https://www.Peakcarpenters.com`.

	- 2026-06-18: Added `DEPLOY.md` with steps for publishing via GitHub Pages or Netlify, and instructions to wire Formspree.

	- 2026-06-19: Enhanced forms and validation:
		- Improved `Contact.html` and `Inquiry.html` forms with `required` attributes, phone field, file attachment (inquiry), `data-maxlength` on message areas, and `novalidate` so `js/main.js` handles custom validation.
		- `js/main.js` updated to validate phone numbers (basic length check), enforce char limits, and keep existing AJAX/Formspree submission and mailto fallback.
		- 2026-06-19 (update): Added Formsubmit (no-signup) as immediate backend and Netlify form attributes so forms will work without creating a Formspree account. To use Formspree instead, replace the form `action` with your Formspree endpoint and optionally add `data-ajax="true"` to enable AJAX submission.

		- 2026-06-19: Added `thank-you.html`, Netlify configuration, and `CNAME` to support deployment at `www.Peakcarpenters.com`. Forms now redirect to the thank-you page after successful submission.

References
---------