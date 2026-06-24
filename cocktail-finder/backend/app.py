from flask import Flask, jsonify, request
from flask_cors import CORS
from models import db, Cocktail, Favorite

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///cocktail_finder.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

CORS(app)
db.init_app(app)

with app.app_context():
    db.create_all()

@app.route('/')
def home():
    return jsonify({"message": "Cocktail Finder API Operational"}), 200

@app.route('/cocktails', methods=['GET', 'POST'])
def handle_cocktails():
    if request.method == 'POST':
        data = request.get_json()
        new_drink = Cocktail(
            name=data['name'], 
            instructions=data['instructions'], 
            image_url=data.get('image_url', '')
        )
        db.session.add(new_drink)
        db.session.commit()
        return jsonify(new_drink.to_dict()), 201
        
    drinks = Cocktail.query.all()
    return jsonify([d.to_dict() for d in drinks]), 200

@app.route('/cocktails/<int:id>', methods=['PATCH', 'DELETE'])
def modify_cocktail(id):
    drink = db.session.get(Cocktail, id)
    if not drink:
        return jsonify({"error": "Cocktail not found"}), 404
    
    if request.method == 'PATCH':
        data = request.get_json()
        if 'name' in data: drink.name = data['name']
        if 'instructions' in data: drink.instructions = data['instructions']
        if 'image_url' in data: drink.image_url = data['image_url']
        db.session.commit()
        return jsonify(drink.to_dict()), 200

    if request.method == 'DELETE':
        db.session.delete(drink)
        db.session.commit()
        return jsonify({"message": "Cocktail removed successfully"}), 200

@app.route('/favorites', methods=['GET', 'POST'])
def handle_favorites():
    if request.method == 'POST':
        data = request.get_json()
        new_fav = Favorite(cocktail_id=data['cocktail_id'], category=data.get('category', 'General'))
        db.session.add(new_fav)
        db.session.commit()
        return jsonify(new_fav.to_dict()), 201
        
    favs = Favorite.query.all()
    return jsonify([f.to_dict() for f in favs]), 200

if __name__ == '__main__':
    app.run(port=5555, debug=True)
