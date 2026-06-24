from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Cocktail(db.Model):
    __tablename__ = 'cocktails'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    instructions = db.Column(db.Text, nullable=False)
    image_url = db.Column(db.String(255))
    
    # Cascade deletes favorites cleanly if a cocktail is removed
    favorites = db.relationship('Favorite', backref='cocktail', lazy=True, cascade="all, delete-orphan")

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "instructions": self.instructions,
            "image_url": self.image_url
        }

class Favorite(db.Model):
    __tablename__ = 'favorites'
    id = db.Column(db.Integer, primary_key=True)
    cocktail_id = db.Column(db.Integer, db.ForeignKey('cocktails.id'), nullable=False)
    category = db.Column(db.String(50)) 

    def to_dict(self):
        return {
            "id": self.id,
            "cocktail_id": self.cocktail_id,
            "category": self.category,
            # This safely includes the nested cocktail details for your frontend team
            "cocktail": self.cocktail.to_dict() if self.cocktail else None
        }
