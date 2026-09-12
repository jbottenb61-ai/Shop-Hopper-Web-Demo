# Shop Hopper Web Demo

This repository hosts the public, synchronized Shop Hopper browser demo:

[Open the live demo](https://jbottenb61-ai.github.io/Shop-Hopper-Web-Demo/)

Shop Hopper is a local-shopping prototype for discovering nearby products,
viewing neighborhood marketplaces, maintaining merchant catalogs, and
building independent curated lists for Hopper personas.

## Demo access

- Visitors may browse shared merchants, stores, items, Hoppers, lists, and maps.
- Anonymous visitors are read-only.
- Approved team editors may sign in by email magic link to maintain shared content.
- The browser contains only the Supabase project URL and publishable key.

## Repository purpose

This is a minimal public deployment copy. The private
`jbottenb61-ai/Shop-Hopper` repository is the source of truth for application
code, database migrations, automated tests, architecture, product requirements,
security documentation, and change history.

Application changes are tested in the private repository and then deliberately
promoted here. Do not develop database migrations or store secrets in this
deployment repository.

## Hosting

GitHub Pages publishes `index.html` and `assets/` from this repository.
The deployment workflow runs after changes to `main`.
