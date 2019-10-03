from flask import Flask, request, jsonify


# -- Set up runtime --
app = Flask(__name__)

@app.route("/", defaults={"path": ""}, methods=["GET"])
@app.route("/<path:path>", methods=["GET"])
def main_route(path):
    return jsonify({
      'message': 'Python App in Docker :D'
    })


