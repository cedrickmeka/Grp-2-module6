from flask import jsonify, request
from models import Cocktail
from extensions import db


def get_all():
    search = request.args.get("search", "").lower()

    cocktails = Cocktail.query.all()

    if search:
        cocktails = [
            c for c in cocktails
            if search in c.name.lower()
            or search in (c.category or "").lower()
        ]

    return jsonify([
        {
            "id": c.id,
            "name": c.name,
            "category": c.category,
            "alcoholic": c.alcoholic,
            "glass": c.glass,
            "image": c.image,
            "instructions": c.instructions,
        }
        for c in cocktails
    ])


def get_categories():
    categories = (
        Cocktail.query.with_entities(Cocktail.category)
        .distinct()
        .all()
    )

    return jsonify([
        category[0]
        for category in categories
        if category[0]
    ])


def get_one(id):
    cocktail = Cocktail.query.get_or_404(id)

    return jsonify({
        "id": cocktail.id,
        "name": cocktail.name,
        "category": cocktail.category,
        "alcoholic": cocktail.alcoholic,
        "glass": cocktail.glass,
        "image": cocktail.image,
        "instructions": cocktail.instructions,
        "ingredients": cocktail.ingredients or [],
    })


def create():
    data = request.json
    cocktail = Cocktail(**data)
    db.session.add(cocktail)
    db.session.commit()
    return jsonify({"message": "Cocktail created"}), 201


def update(id):
    cocktail = Cocktail.query.get_or_404(id)
    for key, value in request.json.items():
        setattr(cocktail, key, value)
    db.session.commit()
    return jsonify({"message": "Cocktail updated"})


def remove(id):
    cocktail = Cocktail.query.get_or_404(id)
    db.session.delete(cocktail)
    db.session.commit()
    return "", 204