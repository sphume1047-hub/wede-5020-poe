Deploying Peak Carpenters website

This document shows quick steps to publish the site using GitHub Pages (project site) or Netlify.

1) Prepare the repo
- Commit your changes locally and push to GitHub:

```bash
git add .
git commit -m "Site: add JS, forms, sitemap, deploy docs"
git push origin main
```

2) GitHub Pages (recommended for a static project site)
- Open your repository on GitHub -> Settings -> Pages.
- Under "Build and deployment" choose branch `main` and folder `/ (root)` or `/docs` if you keep files there.
- Save. GitHub will publish at `https://<your-username>.github.io/<repo-name>/` or (if using a custom domain) your domain.
- To use a custom domain (e.g., `www.Peakcarpenters.com`): add the domain in the Pages settings and create a DNS `CNAME` record pointing to GitHub's pages endpoint (instructions shown in the Pages UI).
- After publishing, update `sitemap.xml` and `robots.txt` if you changed the final domain.

3) Netlify (more flexible; supports custom domains, redirects, continuous deploy)
- Create a Netlify account at https://app.netlify.com/ and connect your GitHub repository.
- In Netlify, click "New site from Git" and select your repo and branch (`main`).
- For simple static sites leave the build command blank and the publish directory as `/` (or `docs` if you use that folder).
- Once deployed, you get a Netlify subdomain. To use your custom domain, add it in "Domain settings" and follow DNS instructions (create A/CNAME records).
- Netlify automatically provisions HTTPS via Let's Encrypt.

4) Formspree setup (if using Formspree)
- Sign up at https://formspree.io/ and create a form. Copy the form endpoint ID in the format `https://formspree.io/f/{your-id}`.
- Replace `data-endpoint="https://formspree.io/f/your-form-id"` in your forms with the real endpoint, or set the form `action` to the endpoint and `method="POST"`.
- Test the form after deployment.

5) Final checklist
- Replace placeholder domain in `sitemap.xml` / `robots.txt` if needed.
- Add a valid `CNAME` file (for GitHub Pages custom domain) or configure DNS for Netlify.
- Verify forms work and adjust `js/main.js` if your endpoint expects JSON rather than form-encoded data.

If you want, I can:
- Create a commit that replaces the `data-endpoint` placeholders with a real Formspree ID (if you provide it).
- Create a `CNAME` file and help configure DNS records for `www.Peakcarpenters.com`.
