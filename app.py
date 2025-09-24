from flask import Flask, render_template, request, redirect, url_for, flash, abort
import os
from datetime import date

app = Flask(__name__)
app.secret_key = os.environ.get("FLASK_SECRET_KEY", "dev-secret-change-me")  # Use an environment variable in production

# In-memory data (replace with a database later)
RECIPES = [
    {
        "slug": "vanilla-cupcakes",
        "title": "Vanilla Cupcakes",
        "emoji": "🧁",
        "summary": "Fluffy vanilla cupcakes with buttercream frosting - perfect for any celebration!",
        "categories": ["Cupcakes", "Dessert"],
        "image": "https://source.unsplash.com/600x400/?vanilla,cupcake",
        "ingredients": [
            "1 1/2 cups all-purpose flour",
            "1 cup sugar",
            "1 1/2 tsp baking powder",
            "1/2 cup unsalted butter, softened",
            "2 large eggs",
            "1/2 cup milk",
            "1 tsp vanilla extract",
        ],
        "steps": [
            "Preheat oven to 350°F (175°C) and line a muffin tin with liners.",
            "Whisk dry ingredients together; beat in butter, eggs, milk, and vanilla until smooth.",
            "Divide batter into liners and bake 18–20 minutes until a toothpick comes out clean.",
            "Cool and frost as desired.",
        ],
    },
    {
        "slug": "chocolate-chip-cookies",
        "title": "Chocolate Chip Cookies",
        "emoji": "🍪",
        "summary": "Crispy edges and chewy centers—the classic cookie everyone loves.",
        "categories": ["Cookies", "Dessert"],
        "image": "https://source.unsplash.com/600x400/?chocolate-chip,cookies",
        "ingredients": [
            "2 1/4 cups all-purpose flour",
            "1 tsp baking soda",
            "1/2 tsp salt",
            "3/4 cup unsalted butter, melted",
            "1 cup brown sugar",
            "1/2 cup white sugar",
            "1 large egg + 1 yolk",
            "2 tsp vanilla extract",
            "1 1/2 cups chocolate chips",
        ],
        "steps": [
            "Preheat oven to 325°F (160°C).",
            "Mix dry ingredients; in another bowl combine butter and sugars, then eggs and vanilla.",
            "Combine mixtures, fold in chocolate chips, scoop onto tray.",
            "Bake 12–15 minutes until golden at edges.",
        ],
    },
    {
        "slug": "lemon-tart",
        "title": "Lemon Tart",
        "emoji": "🥧",
        "summary": "Refreshing lemon tart with a buttery crust and smooth citrus filling.",
        "categories": ["Tarts", "Dessert"],
        "image": "https://source.unsplash.com/600x400/?lemon,tart",
        "ingredients": [
            "1 tart shell, baked",
            "3/4 cup lemon juice",
            "1 tbsp lemon zest",
            "3/4 cup sugar",
            "3 large eggs",
            "6 tbsp butter",
        ],
        "steps": [
            "Whisk lemon juice, zest, sugar, and eggs over gentle heat until thickened.",
            "Whisk in butter, strain, pour into tart shell; chill until set.",
        ],
    },
]

PRODUCTS = [
    {"slug": "dozen-cupcakes", "name": "Dozen Vanilla Cupcakes", "emoji": "🧁", "price": 24.00, "description": "12 fluffy vanilla cupcakes with buttercream.", "rating": 4.9, "reviews": 132},
    {"slug": "cookie-box", "name": "Cookie Gift Box", "emoji": "🍪", "price": 18.00, "description": "Assorted chocolate chip cookies, 12 pieces.", "rating": 4.8, "reviews": 98},
    {"slug": "lemon-tart-9in", "name": '9" Lemon Tart', "emoji": "🥧", "price": 28.00, "description": "Buttery crust with tangy lemon filling.", "rating": 4.7, "reviews": 76},
]

SERVICES = [
    {"slug": "virtual-lesson", "name": "Virtual Baking Lesson", "emoji": "🎥", "duration": "60 min", "price": 50.00, "description": "One-on-one virtual baking session tailored to your level."},
    {"slug": "kitchen-consult", "name": "Kitchen Setup Consult", "emoji": "🧑‍🍳", "duration": "45 min", "price": 40.00, "description": "Tools, techniques, and pantry planning to level up your baking."},
    {"slug": "menu-planning", "name": "Menu Planning", "emoji": "🗒️", "duration": "30 min", "price": 30.00, "description": "Plan a custom baking menu for your event or week."},
]


def _get_recipe_or_404(slug: str):
    for r in RECIPES:
        if r["slug"] == slug:
            return r
    abort(404)


@app.route("/")
def home():
    featured = RECIPES[:3]
    # Tip of the day (rotates daily)
    TIPS = [
        "Room-temperature ingredients mix more evenly for fluffier bakes.",
        "Always preheat your oven—consistency is key for perfect rise.",
        "Weigh ingredients for accuracy—especially flour and sugar.",
        "Chill cookie dough for thicker, chewier cookies.",
        "Let cakes cool fully before frosting for a smooth finish.",
    ]
    tip_of_day = TIPS[date.today().toordinal() % len(TIPS)]

    TESTIMONIALS = [
        {"name": "Emily R.", "text": "The cupcakes were the hit of our party! Moist, fluffy, and beautiful.", "rating": 5},
        {"name": "Carlos M.", "text": "Sophie's virtual lesson boosted my confidence—my pie crusts are finally flaky!", "rating": 5},
        {"name": "Ava P.", "text": "The cookie box was incredible—perfect balance of chewy and crunchy.", "rating": 5},
    ]
    return render_template("index.html", featured_recipes=featured, tip_of_day=tip_of_day, testimonials=TESTIMONIALS)


@app.route("/recipes")
def recipes():
    # Build sorted unique categories
    cats = sorted({c for r in RECIPES for c in r.get("categories", [])})
    return render_template("recipes.html", recipes=RECIPES, categories=cats)


@app.route("/recipes/<slug>")
def recipe_detail(slug):
    recipe = _get_recipe_or_404(slug)
    return render_template("recipe_detail.html", recipe=recipe)


@app.route("/shop")
def shop():
    return render_template("shop.html", products=PRODUCTS)


@app.route("/consulting", methods=["GET", "POST"])
def consulting():
    if request.method == "POST":
        name = request.form.get("name")
        email = request.form.get("email")
        service = request.form.get("service")
        message = request.form.get("message")
        # In a real app, store this or send an email
        flash("Thanks! We'll get back to you shortly to schedule your consulting session.", "success")
        return redirect(url_for("consulting"))
    return render_template("consulting.html", services=SERVICES)


@app.route("/about")
def about():
    return render_template("about.html")


@app.route("/contact", methods=["GET", "POST"])
def contact():
    if request.method == "POST":
        name = request.form.get("name")
        email = request.form.get("email")
        subject = request.form.get("subject")
        message = request.form.get("message")
        # In a real app, store this or send an email
        flash("Thank you for reaching out! We'll reply to your message soon.", "success")
        return redirect(url_for("contact"))
    prefill = request.args.get("subject", "")
    return render_template("contact.html", prefill_subject=prefill)


@app.route("/newsletter", methods=["POST"])
def newsletter():
    email = request.form.get("email")
    if email:
        # In a real app, store email or send to newsletter service
        flash("You're subscribed! Welcome to Sophie's kitchen.", "success")
    else:
        flash("Please enter a valid email address.", "info")
    return redirect(url_for("home"))


@app.route("/favorites")
def favorites():
    # Render all recipes; front-end will filter to favorites via localStorage
    cats = sorted({c for r in RECIPES for c in r.get("categories", [])})
    return render_template("favorites.html", recipes=RECIPES, categories=cats)


if __name__ == "__main__":
    app.run(debug=True)
