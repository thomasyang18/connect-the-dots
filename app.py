from flask import Flask, request, render_template

app = Flask(__name__)

@app.route("/", methods=["GET", "POST"])
def index():
    if request.method == "POST":
        # Get input values (add validation here)
        n = int(request.form.get("n"))
        m = int(request.form.get("m"))
        colors = list(map(int, request.form.get("colors").split()))

        # Placeholder for the actual algorithm (replace this)
        connections = []
        for i in range(n):
            for j in range(i + 1, n):
                if colors[i] != colors[j]:
                    connections.append([i + 1, j + 1])


        return render_template("index.html", connections=connections)
    return render_template("index.html")


if __name__ == "__main__":
    app.run(debug=True)
