from flask import Blueprint
from controllers.note_controller import update_note, delete_note

note_bp = Blueprint("notes", __name__)

note_bp.route("/api/notes/<int:id>", methods=["PUT"])(update_note)
note_bp.route("/api/notes/<int:id>", methods=["DELETE"])(delete_note)