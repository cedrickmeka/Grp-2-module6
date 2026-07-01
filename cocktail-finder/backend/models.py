from extensions import db


class Cocktail(db.Model):
    __tablename__ = "cocktails"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    category = db.Column(db.String(50))
    alcoholic = db.Column(db.String(50))
    glass = db.Column(db.String(50))
    image = db.Column(db.String(255))
    instructions = db.Column(db.Text)
    ingredients = db.Column(db.JSON, default=list)

    notes = db.relationship(
        "Note",
        backref="cocktail",
        cascade="all, delete-orphan"
    )


class Note(db.Model):
    __tablename__ = "notes"

    id = db.Column(db.Integer, primary_key=True)
    cocktail_id = db.Column(
        db.Integer,
        db.ForeignKey("cocktails.id")
    )

    text = db.Column(db.Text, nullable=False)


class Favorite(db.Model):
    __tablename__ = "favorites"

    id = db.Column(db.Integer, primary_key=True)
    cocktail_id = db.Column(db.Integer)
    category = db.Column(db.String(50))