from flask import Blueprint
from controllers.note_controller import *

note_bp = Blueprint("notes", __name__)

note_bp.route("/api/cocktails/<int:cocktail_id>/notes", methods=["GET"])(get_notes)
note_bp.route("/api/cocktails/<int:cocktail_id>/notes", methods=["POST"])(add_note)

note_bp.route("/api/notes/<int:id>", methods=["PUT"])(update_note)
note_bp.route("/api/notes/<int:id>", methods=["DELETE"])(delete_note)