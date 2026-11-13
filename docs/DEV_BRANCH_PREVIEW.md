# Development / Preview Branch Strategy

## Branches
- `main`: stable published releases only. No direct edits from autonomous coding agents.
- `development`: integration branch for human-reviewed features. Never merge this to main without owner sign-off.
- `feature/*`: small mechanics or Hub experiments, opened as PRs **to development**.

## Publication detail
**GitHub Pages normally publishes one active site for a repository.** A workflow triggered on `development` could replace the site's active production deployment. Therefore the ASCean `main` Pages workflow remains unchanged and is the only production publishing source. Do not deploy development directly to the Pages environment.

## Safe preview now
- Pull-request CI produces a downloadable `site/` preview artifact (static site). Run `python -m http.server 5500 --directory site` after extracting the artifact.
- Keep the branch on GitHub for source inspection and PR feedback.

## Optional separate public preview host later
For a single-click phone preview without risk to main, choose one of:
1. A **separate preview hosting project** (Cloudflare Pages/Netlify/Vercel) connecting only `development` and feature PRs to unique preview URLs.
2. A **separate GitHub Pages preview repository** with deployment scoped to development. This is more setup but prevents publishing over ASCean's main site.
Do not configure this automatically without selecting a host and access policy. Public preview should not contain private PCM data.
