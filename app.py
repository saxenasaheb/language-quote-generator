from flask import Flask, request, jsonify
from flask_cors import CORS
import random

app = Flask(__name__)
CORS(app)

quotes = {
    "English": [
        "To be or not to be, that is the question.",
        "I think, therefore I am.",
        "Stay hungry, stay foolish.",
        "The only way to do great work is to love what you do.",
        "Be the change you wish to see in the world."
    ],
    "Spanish": [
        "En boca cerrada no entran moscas.",
        "El que la sigue la consigue.",
        "Más vale tarde que nunca.",
        "Al mal tiempo, buena cara.",
        "Dime con quién andas y te diré quién eres."
    ],
    "French": [
        "Je pense, donc je suis.",
        "La vie est belle.",
        "L'amour est aveugle.",
        "Après la pluie, le beau temps.",
        "Qui vivra verra."
    ]
}

@app.route('/get_quotes', methods=['GET'])
def get_quotes():
    language = request.args.get('language', 'English')
    if language in quotes:
        return jsonify(random.sample(quotes[language], 5))
    else:
        return jsonify({"error": "Language not found"}), 404

if __name__ == '__main__':
    app.run(debug=True)