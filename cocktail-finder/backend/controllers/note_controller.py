from flask import jsonify, request
from models import Note
from extensions import db


def get_notes(cocktail_id):
    notes = Note.query.filter_by(cocktail_id=cocktail_id)

    return jsonify([
        {
            "id": n.id,
            "text": n.text
        }
        for n in notes
    ])


def add_note(cocktail_id):
    data = request.json

    note = Note(
        cocktail_id=cocktail_id,
        text=data["text"]
    )

    db.session.add(note)
    db.session.commit()

    return jsonify({"message": "Note added"}), 201


def update_note(id):
    note = Note.query.get_or_404(id)

    note.text = request.json["text"]

    db.session.commit()

    return jsonify({"message": "Note updated"})


def delete_note(id):
    note = Note.query.get_or_404(id)

    db.session.delete(note)
    db.session.commit()

    return "", 204