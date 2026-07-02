from flask import jsonify, request
from models import Favorite
from extensions import db


def get_favorites():
    favorites = Favorite.query.all()

    return jsonify([
        {
            "id": f.id,
            "cocktailId": f.cocktail_id,
            "category": f.category
        }
        for f in favorites
    ])


def add_favorite():
    data = request.json

    favorite = Favorite(
        cocktail_id=data["cocktailId"],
        category=data.get("category", "General")
    )

    db.session.add(favorite)
    db.session.commit()

    return jsonify({"message": "Favorite added"}), 201


def delete_favorite(id):
    favorite = Favorite.query.get_or_404(id)

    db.session.delete(favorite)
    db.session.commit()

    return "", 204