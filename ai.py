
from flask import Flask, jsonify, request, render_template
import requests

app = Flask(__name__)


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/api/health")
def health():
    return jsonify({"status": "ok"})


@app.route("/api/chat", methods=["POST"])
def chat():
    data = request.get_json(silent=True) or {}
    question = data.get("question", "").strip()

    if not question:
        return jsonify({"error": "Please enter a question."}), 400

    try:
        response = requests.post(
            "http://localhost:11434/api/generate",
            json={
                "model": "llama3:latest",
                "prompt": question,
                "stream": False
            },
            timeout=120
        )

        response.raise_for_status()
        answer = response.json()["response"]

        return jsonify({"answer": answer})

    except requests.RequestException:
        return jsonify({
            "error": "Could not connect to Ollama."
        }), 503


if __name__ == "__main__":
    app.run(debug=True, port=5000)
