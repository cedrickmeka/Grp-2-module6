from app import app
from extensions import db
from models import Cocktail

with app.app_context():
    if Cocktail.query.first():
        print("Database already seeded.")
    else:
        cocktails = [
            Cocktail(
                name="Classic Margarita",
                category="Cocktail",
                alcoholic="Alcoholic",
                glass="Cocktail glass",
                image="https://www.thecocktaildb.com/images/media/drink/5noda61589575158.jpg",
                instructions="Rub the rim of the glass with lime, dip in salt, shake ingredients with ice and strain."
            ),
            Cocktail(
                name="Mojito",
                category="Cocktail",
                alcoholic="Alcoholic",
                glass="Highball glass",
                image="https://www.thecocktaildb.com/images/media/drink/3z6xdi1589574603.jpg",
                instructions="Muddle mint with sugar and lime juice, add rum and top with soda water."
            ),
            Cocktail(
                name="Espresso Martini",
                category="Cocktail",
                alcoholic="Alcoholic",
                glass="Martini glass",
                image="https://www.thecocktaildb.com/images/media/drink/n0sx531504372951.jpg",
                instructions="Shake vodka, coffee liqueur and espresso with ice, then strain into a chilled glass."
            ),
        ]

        db.session.add_all(cocktails)
        db.session.commit()

        print("Database seeded successfully.")