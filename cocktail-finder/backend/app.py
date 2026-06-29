from flask import Flask
from flask_cors import CORS

from config import Config
from extensions import db, migrate

from routes.cocktails import cocktail_bp
from routes.notes import note_bp
from routes.favorites import favorite_bp

app = Flask(__name__)
app.config.from_object(Config)

CORS(app)

db.init_app(app)
migrate.init_app(app, db)

app.register_blueprint(cocktail_bp)
app.register_blueprint(note_bp)
app.register_blueprint(favorite_bp)

with app.app_context():
    db.create_all()


@app.route("/")
def home():
    return {
        "message": "Cocktail Finder API is running."
    }


if __name__ == "__main__":
    app.run(port=4000, debug=True)