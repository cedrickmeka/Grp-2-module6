from flask import Blueprint
from views.favorite_view import get_favorites, add_favorite, delete_favorite

favorite_bp = Blueprint("favorites", __name__)

favorite_bp.route("/api/favorites", methods=["GET"])(get_favorites)
favorite_bp.route("/api/favorites", methods=["POST"])(add_favorite)
favorite_bp.route("/api/favorites/<int:id>", methods=["DELETE"])(delete_favorite)