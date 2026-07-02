from flask import Blueprint
from views.cocktail_view import (
    get_all,
    get_categories,
    get_one,
    create,
    update,
    remove,
)

from views.note_view import (
    get_notes,
    add_note,
)

cocktail_bp = Blueprint(
    "cocktails",
    __name__,
    url_prefix="/api/cocktails",
)

cocktail_bp.route("/", methods=["GET"])(get_all) 
cocktail_bp.route("/categories", methods=["GET"])(get_categories)

cocktail_bp.route("/<int:id>", methods=["GET"])(get_one)
cocktail_bp.route("/", methods=["POST"])(create)
cocktail_bp.route("/<int:id>", methods=["PUT"])(update)
cocktail_bp.route("/<int:id>", methods=["DELETE"])(remove)

cocktail_bp.route("/<int:cocktail_id>/notes", methods=["GET"])(get_notes)
cocktail_bp.route("/<int:cocktail_id>/notes", methods=["POST"])(add_note)