from flask import Blueprint
from controllers.cocktail_controller import *

cocktail_bp = Blueprint("cocktails", __name__)

cocktail_bp.route("/api/cocktails", methods=["GET"])(get_all)
cocktail_bp.route("/api/cocktails/<int:id>", methods=["GET"])(get_one)
cocktail_bp.route("/api/cocktails", methods=["POST"])(create)
cocktail_bp.route("/api/cocktails/<int:id>", methods=["PUT"])(update)
cocktail_bp.route("/api/cocktails/<int:id>", methods=["DELETE"])(remove)