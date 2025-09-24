# Bake With Sophie (Flask + DaisyUI)

Bake With Sophie is a simple Flask website to:

- Share recipes (with detail pages)
- Sell baked goods (Shop)
- Offer consulting/lessons (Consulting)
- Provide contact and about pages

It uses Tailwind + DaisyUI via CDN and a small amount of custom CSS/JS.

## Features

- Recipes list and dynamic recipe detail pages
- Shop with order inquiry CTA that pre-fills the contact form subject
- Consulting page with a booking request form (POST with flash message)
- Contact form (POST with flash message)
- Mobile-friendly navigation and active-link highlighting

## Project Structure

```
web/
├─ app.py                      # Flask app and in-memory data
├─ templates/
│  ├─ base.html                # Layout, nav, footer, flash messages
│  ├─ index.html               # Homepage with featured recipes
│  ├─ recipes.html             # All recipes
│  ├─ recipe_detail.html       # A single recipe page
│  ├─ shop.html                # Shop catalog
│  ├─ consulting.html          # Consulting/services + request form
│  ├─ contact.html             # Contact form
│  └─ about.html               # About page
├─ static/
│  ├─ css/style.css            # Custom styles
│  └─ js/main.js               # Mobile menu + UX enhancements
├─ pyproject.toml              # Python project config
└─ uv.lock                     # (Optional) Lock file used by `uv`
```

## Setup

You can use either `uv` or `pip`.

### Using uv (recommended)

1. Install `uv` if needed: https://docs.astral.sh/uv/
2. From the `web/` directory:

```
uv sync
```

### Using pip

From the `web/` directory:

```
python -m venv .venv
source .venv/bin/activate
pip install -U pip
pip install -e .
```

## Run

From the `web/` directory:

```
export FLASK_SECRET_KEY="change-me"   # Optional, but recommended
python app.py
```

Visit http://127.0.0.1:5000/

## Environment Variables

- `FLASK_SECRET_KEY`: Secret for session/flash messages. If unset, a dev default is used.

## Customizing Content

Currently the data lives in-memory inside `app.py`:

- `RECIPES`: Add or edit recipes, including `slug`, `title`, `emoji`, `summary`, `ingredients`, and `steps`.
- `PRODUCTS`: Items for the Shop (`slug`, `name`, `emoji`, `price`, `description`).
- `SERVICES`: Consulting services (`slug`, `name`, `emoji`, `duration`, `price`, `description`).

For production, consider moving these into a database or JSON files.

## Next Steps

- Payments: Start with Stripe Payment Links or Checkout for each product, replacing the "Order Now" link in `templates/shop.html`.
- Booking: Embed Calendly or a simple booking form on `templates/consulting.html` that posts to an email service (e.g., SendGrid/Resend) or stores to a DB.
- Email: Integrate an email provider to send notifications on contact/consulting form submissions.
- SEO: Add descriptive meta tags, Open Graph images, and sitemap.xml.
- Analytics: Add Plausible or Google Analytics.
- Auth (optional): Add admin-only routes to manage recipes/products/services securely.

