from app import create_app, db

app = create_app()

# This creates tables if they don't exist (Quick fix for dev)
with app.app_context():
    db.create_all()

if __name__ == "__main__":
    app.run(debug=True)
