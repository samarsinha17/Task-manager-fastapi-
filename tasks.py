from sqlalchemy import Column, Integer, String, Boolean
from database import Base

class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), index=True)
    description = Column(String(500), nullable=True)
    completed = Column(Boolean, default=False)

if __name__ == "__main__":
    app = Flask(__name__)
    app.config.from_object(Config)

    db = SQLAlchemy(app)
    db.create_all()

    @app.route("/")
    def home():
        return "Hello, World!"

    @app.route("/tasks")
    def tasks():
        tasks = Task.query.all()
        return {"tasks": [{"id": t.id, "title": t.title, "description": t.description, "completed": t.completed} for t in tasks]}

    @app.route("/tasks", methods=["POST"])
    def create_task():
        data = request.get_json()
        task = Task(title=data["title"], description=data["description"])
        db.session.add(task)
        db.session.commit()
        return {"message": "Task created!"}

    @app.route("/tasks/<int:id>", methods=["GET"])
    def get_task(id):
        task = Task.query.get(id)
        if task:
            return {"id": task.id, "title": task.title, "description": task.description, "completed": task.completed}
        return {"error": "Task not found!"}

    @app.route("/tasks/<int:id>", methods=["PUT"])
    def update_task(id):
        task = Task.query.get(id)
        if task:
            data = request.get_json()
            task.title = data["title"]
            task.description = data["description"]
            task.completed = data["completed"]
            db.session.commit()
            return {"message": "Task updated!"}
        return {"error": "Task not found!"}

    @app.route("/tasks/<int:id>", methods=["DELETE"])
    def delete_task(id):
        task = Task.query.get(id)
        if task:
            db.session.delete(task)
            db.session.commit()
            return {"message": "Task deleted!"}
        return {"error": "Task not found!"}

    app.run(host="0.0.0.0", port=5000, debug=True)